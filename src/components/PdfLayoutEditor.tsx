"use client";

import React, { useState, useRef } from "react";
import { DropZone } from "@/components/ui/DropZone";
import { PrivacyBadge } from "@/components/system/PrivacyBadge";
import { useObjectUrlManager } from "@/src/lib/hooks";
import { workerManager } from "@/src/workers/manager";
import { formatError } from "@/src/lib/formatError";
import { useProgress } from "@/src/contexts/ProgressContext";
import { useToast } from "@/components/ui/Toast";
import { File, Settings2 } from "lucide-react";

export type PdfLayoutMode = 'crop' | 'resize' | 'a4' | 'letter' | 'legal' | 'margin';

interface PdfLayoutEditorProps {
  mode: PdfLayoutMode;
  toolId: string;
  title: string;
  description: string;
  actionLabel: string;
}

const PAGE_SIZES: Record<string, [number, number]> = {
  a4: [595.28, 841.89],
  letter: [612, 792],
  legal: [612, 1008],
};

export function PdfLayoutEditor({ mode, toolId, title, description, actionLabel }: PdfLayoutEditorProps) {
  const { createUrl } = useObjectUrlManager();
  const [file, setFile] = useState<File | null>(null);
  const [fileBuffer, setFileBuffer] = useState<ArrayBuffer | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const { state: progressState, startProcessing, setStage, setProgress, finishProcessing } = useProgress();
  const [error, setError] = useState("");
  const abortControllerRef = useRef<AbortController | null>(null);

  // Settings states
  const [margins, setMargins] = useState({ top: 36, right: 36, bottom: 36, left: 36 });
  const [cropBox, setCropBox] = useState({ x: 36, y: 36, width: 500, height: 700 });
  const [targetSize, setTargetSize] = useState<string>('a4');
  const [scaleToFit, setScaleToFit] = useState(true);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape' | 'auto'>('auto');
  const { toast } = useToast();

  const handleFiles = async (files: FileList | File[]) => {
    const f = files[0];
    if (!f) return;
    
    if (f.type !== "application/pdf" && !f.name.endsWith(".pdf")) {
      toast(`Invalid file type: ${f.name}. Only PDFs are allowed.`, "error");
      return;
    }
    if (f.size > 100 * 1024 * 1024) {
      toast(`File too large: ${f.name}. Maximum size is 100MB.`, "error");
      return;
    }

    setFile(f);
    setError("");
    
    try {
      const buffer = await f.arrayBuffer();
      setFileBuffer(buffer);
      const count = await workerManager.getPdfPageCount(buffer);
      setPageCount(count);
    } catch (e) {
      setError("Failed to read PDF file.");
    }
  };

  const processPdf = async () => {
    if (!fileBuffer || !file) return;

    const controller = new AbortController();
    abortControllerRef.current = controller;
    
    startProcessing("heavy");
    setStage("Preparing PDF...");
    setProgress(0);

    try {
      let options: any = { pages: 'all' };
      
      if (mode === 'crop') {
        options.action = 'crop';
        options.cropBox = cropBox;
      } else if (mode === 'margin') {
        options.action = 'margin';
        options.margins = margins;
      } else {
        options.action = 'resize';
        options.scaleToFit = scaleToFit;
        options.orientation = orientation;
        
        if (mode === 'a4') options.targetSize = PAGE_SIZES.a4;
        else if (mode === 'letter') options.targetSize = PAGE_SIZES.letter;
        else if (mode === 'legal') options.targetSize = PAGE_SIZES.legal;
        else if (mode === 'resize') options.targetSize = PAGE_SIZES[targetSize] || PAGE_SIZES.a4;
      }

      const outBytes = await workerManager.adjustPdfLayout(
        fileBuffer.slice(0),
        options,
        (p: any) => {
          setStage(p.message || "Processing...");
          setProgress(p.percent);
        }
      );

      const blob = new Blob([outBytes as any], { type: "application/pdf" });
      const url = createUrl(blob);
      
      const a = document.createElement("a");
      a.href = url;
      a.download = `${file.name.replace(/\.pdf$/i, "")}-${mode}.pdf`;
      a.click();

    } catch (e: any) {
      if (e.message === "Task cancelled" || e.name === "AbortError") {
        setError("Operation cancelled.");
        finishProcessing(false, new Error("Cancelled"));
      } else {
        setError(formatError(e));
        finishProcessing(false, e);
      }
    } finally {
      finishProcessing(true);
      abortControllerRef.current = null;
    }
  };

  return (
    <div className="space-y-8">
      <PrivacyBadge message="Local processing – No files uploaded to servers" />

      {!file ? (
        <DropZone
          onFilesSelected={handleFiles}
          accept=".pdf,application/pdf"
          multiple={false}
          title={title}
          description={description}
          icon={<div className="text-4xl">📄</div>}
        />
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-surface border border-border p-4 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue/10 text-blue flex items-center justify-center rounded-xl">
                <File className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-sm text-text truncate max-w-[200px] md:max-w-md">{file.name}</p>
                <p className="text-xs text-text-4 font-bold tracking-wider uppercase">{pageCount} pages</p>
              </div>
            </div>
            <button 
              onClick={() => { setFile(null); setFileBuffer(null); setPageCount(0); }}
              disabled={progressState.isProcessing}
              className="text-xs font-bold uppercase tracking-widest text-text-4 hover:text-red-500 transition-colors disabled:opacity-50"
            >
              Change File
            </button>
          </div>

          <div className="bg-surface border border-border p-6 rounded-3xl space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Settings2 className="w-5 h-5 text-blue" />
              <h3 className="font-black text-lg tracking-tight text-text">Layout Settings</h3>
            </div>
            
            {mode === 'margin' && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {(['top', 'right', 'bottom', 'left'] as const).map(side => (
                  <div key={side}>
                    <label className="block text-xs font-bold text-text-3 uppercase tracking-wider mb-2">{side} (pt)</label>
                    <input 
                      type="number" 
                      value={margins[side]}
                      onChange={(e) => setMargins(m => ({ ...m, [side]: Number(e.target.value) }))}
                      className="w-full bg-surface-2 border border-border rounded-xl px-4 py-2 text-text font-medium focus:border-blue outline-none transition-colors"
                    />
                  </div>
                ))}
              </div>
            )}

            {mode === 'crop' && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {(['x', 'y', 'width', 'height'] as const).map(prop => (
                  <div key={prop}>
                    <label className="block text-xs font-bold text-text-3 uppercase tracking-wider mb-2">{prop} (pt)</label>
                    <input 
                      type="number" 
                      value={cropBox[prop]}
                      onChange={(e) => setCropBox(c => ({ ...c, [prop]: Number(e.target.value) }))}
                      className="w-full bg-surface-2 border border-border rounded-xl px-4 py-2 text-text font-medium focus:border-blue outline-none transition-colors"
                    />
                  </div>
                ))}
              </div>
            )}

            {(mode === 'resize' || mode === 'a4' || mode === 'letter' || mode === 'legal') && (
              <div className="space-y-4">
                {mode === 'resize' && (
                  <div>
                    <label className="block text-xs font-bold text-text-3 uppercase tracking-wider mb-2">Target Size</label>
                    <select 
                      value={targetSize}
                      onChange={(e) => setTargetSize(e.target.value)}
                      className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-text font-medium focus:border-blue outline-none transition-colors appearance-none"
                    >
                      <option value="a4">A4 (210 × 297 mm)</option>
                      <option value="letter">US Letter (8.5 × 11 in)</option>
                      <option value="legal">US Legal (8.5 × 14 in)</option>
                    </select>
                  </div>
                )}
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-text-3 uppercase tracking-wider mb-2">Orientation</label>
                    <select 
                      value={orientation}
                      onChange={(e) => setOrientation(e.target.value as any)}
                      className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-text font-medium focus:border-blue outline-none transition-colors appearance-none"
                    >
                      <option value="auto">Auto (Match Original)</option>
                      <option value="portrait">Portrait</option>
                      <option value="landscape">Landscape</option>
                    </select>
                  </div>
                  
                  <div className="flex items-end">
                    <label className="flex items-center gap-3 p-3 border border-border rounded-xl bg-surface-2 cursor-pointer hover:border-blue/50 transition-colors w-full h-[46px]">
                      <input 
                        type="checkbox" 
                        checked={scaleToFit}
                        onChange={(e) => setScaleToFit(e.target.checked)}
                        className="w-5 h-5 rounded bg-surface border-border text-blue focus:ring-blue focus:ring-offset-surface"
                      />
                      <div>
                        <p className="text-sm font-bold text-text">Scale to Fit</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            )}

          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs font-bold uppercase tracking-wider text-center">
              {error}
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={processPdf}
              disabled={progressState.isProcessing}
              className="flex-1 py-4 bg-blue text-white font-black rounded-xl hover:scale-101 active:scale-98 transition-all disabled:opacity-40 disabled:scale-100 shadow-lg shadow-blue/20"
            >
              {progressState.isProcessing ? "Processing..." : actionLabel}
            </button>
            {progressState.isProcessing && (
              <button
                onClick={() => abortControllerRef.current?.abort()}
                className="px-6 py-4 bg-red-500/10 text-red-500 font-bold rounded-xl hover:bg-red-500/20 transition-all"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
