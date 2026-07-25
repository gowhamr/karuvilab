"use client";

import React, { useState, useCallback, useRef } from "react";
import { DropZone } from "@/components/ui/DropZone";
import { PrivacyBadge } from "@/components/system/PrivacyBadge";
import { PdfPagePreview } from "@/components/ui/PdfPagePreview";
import { useObjectUrlManager } from "@/src/lib/hooks";
import { workerManager } from "@/src/workers/manager";
import { formatError } from "@/src/lib/formatError";
import { useProgress } from "@/src/contexts/ProgressContext";
import { m } from "framer-motion";
import { File, CheckCircle2, RotateCw } from "lucide-react";
import { cn } from "@/src/lib/utils";

export type BasicPdfMode = 'remove' | 'extract' | 'reverse' | 'duplicate' | 'even' | 'odd';

interface BasicPdfEditorProps {
  mode: BasicPdfMode;
  toolId: string;
  title: string;
  description: string;
  actionLabel: string;
}

export function BasicPdfEditor({ mode, toolId, title, description, actionLabel }: BasicPdfEditorProps) {
  const { createUrl } = useObjectUrlManager();
  const [file, setFile] = useState<File | null>(null);
  const [fileBuffer, setFileBuffer] = useState<ArrayBuffer | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  const { state: progressState, startProcessing, setStage, setProgress, finishProcessing } = useProgress();
  const [error, setError] = useState("");
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleFiles = async (files: FileList | File[]) => {
    const f = files[0];
    if (!f) return;
    setFile(f);
    setError("");
    setSelectedPages(new Set());
    
    try {
      const buffer = await f.arrayBuffer();
      setFileBuffer(buffer);
      const count = await workerManager.getPdfPageCount(buffer);
      setPageCount(count);

      // Pre-select for even/odd modes
      if (mode === 'even' || mode === 'odd') {
        const newSelection = new Set<number>();
        for (let i = 1; i <= count; i++) {
          if (mode === 'even' && i % 2 === 0) newSelection.add(i);
          if (mode === 'odd' && i % 2 !== 0) newSelection.add(i);
        }
        setSelectedPages(newSelection);
      }
    } catch (e) {
      setError("Failed to read PDF file.");
    }
  };

  const togglePage = (pageNum: number) => {
    if (mode === 'reverse') return; // Selection disabled for reverse
    
    setSelectedPages(prev => {
      const next = new Set(prev);
      if (next.has(pageNum)) {
        next.delete(pageNum);
      } else {
        next.add(pageNum);
      }
      return next;
    });
  };

  const processPdf = async () => {
    if (!fileBuffer || !file) return;

    if (mode !== 'reverse' && selectedPages.size === 0) {
      setError("Please select at least one page.");
      return;
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;
    
    startProcessing("heavy");
    setStage("Preparing PDF...");
    setProgress(0);

    try {
      let pagesState: { originalIndex: number; rotation: number }[] = [];

      if (mode === 'remove') {
        for (let i = 1; i <= pageCount; i++) {
          if (!selectedPages.has(i)) {
            pagesState.push({ originalIndex: i - 1, rotation: 0 });
          }
        }
        if (pagesState.length === 0) throw new Error("Cannot remove all pages.");
      } 
      else if (mode === 'extract' || mode === 'even' || mode === 'odd') {
        // Output in original order, but only selected pages
        for (let i = 1; i <= pageCount; i++) {
          if (selectedPages.has(i)) {
            pagesState.push({ originalIndex: i - 1, rotation: 0 });
          }
        }
      } 
      else if (mode === 'reverse') {
        for (let i = pageCount; i >= 1; i--) {
          pagesState.push({ originalIndex: i - 1, rotation: 0 });
        }
      } 
      else if (mode === 'duplicate') {
        // Duplicate selected pages in place
        for (let i = 1; i <= pageCount; i++) {
          pagesState.push({ originalIndex: i - 1, rotation: 0 });
          if (selectedPages.has(i)) {
            pagesState.push({ originalIndex: i - 1, rotation: 0 });
          }
        }
      }

      const outBytes = await workerManager.exportPdfEditor(
        fileBuffer,
        pagesState,
        [],
        (p) => {
          setStage(p.message || "Processing...");
          setProgress(p.percent);
        },
        controller.signal
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

  const cancelProcess = () => {
    abortControllerRef.current?.abort();
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
          {/* File Header */}
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
              onClick={() => { setFile(null); setFileBuffer(null); setPageCount(0); setSelectedPages(new Set()); }}
              disabled={progressState.isProcessing}
              className="text-xs font-bold uppercase tracking-widest text-text-4 hover:text-red-500 transition-colors disabled:opacity-50"
            >
              Change File
            </button>
          </div>

          {/* Grid Selection */}
          <div className="bg-surface border border-border p-6 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-lg tracking-tight text-text">Select Pages</h3>
                <p className="text-xs font-medium text-text-4 mt-1">
                  {mode === 'reverse' ? "All pages will be reversed automatically." : `Click on pages to ${mode}.`}
                </p>
              </div>
              {mode !== 'reverse' && mode !== 'even' && mode !== 'odd' && (
                <div className="flex gap-2">
                  <button onClick={() => {
                    const all = new Set<number>();
                    for(let i=1; i<=pageCount; i++) all.add(i);
                    setSelectedPages(all);
                  }} className="text-xs font-bold uppercase text-blue bg-blue/10 px-3 py-1.5 rounded-lg hover:bg-blue/20 transition-colors">Select All</button>
                  <button onClick={() => setSelectedPages(new Set())} className="text-xs font-bold uppercase text-text-4 bg-bg border border-border px-3 py-1.5 rounded-lg hover:bg-surface-2 transition-colors">Clear</button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-[60vh] overflow-y-auto p-2">
              {Array.from({ length: pageCount }).map((_, idx) => {
                const pageNum = idx + 1;
                const isSelected = selectedPages.has(pageNum);
                return (
                  <m.div 
                    key={pageNum}
                    whileHover={mode !== 'reverse' ? { scale: 1.02 } : {}}
                    whileTap={mode !== 'reverse' ? { scale: 0.98 } : {}}
                    onClick={() => togglePage(pageNum)}
                    className={cn(
                      "relative aspect-[1/1.4] rounded-xl border-2 overflow-hidden transition-all select-none",
                      mode !== 'reverse' ? "cursor-pointer" : "opacity-80",
                      isSelected ? "border-blue bg-blue/5 shadow-md shadow-blue/10" : "border-border bg-surface-2 hover:border-blue/30"
                    )}
                  >
                    <div className="absolute inset-0 pointer-events-none p-2 flex flex-col">
                      <div className="flex justify-between items-start">
                        <span className={cn(
                          "text-[10px] font-black px-2 py-0.5 rounded-full backdrop-blur-md shadow-sm z-content",
                          isSelected ? "bg-blue text-white" : "bg-surface-2/80 text-text-4"
                        )}>
                          {pageNum}
                        </span>
                        {isSelected && mode !== 'reverse' && (
                          <div className="bg-blue text-white rounded-full p-0.5 shadow-sm z-content">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="w-full h-full flex items-center justify-center opacity-90 overflow-hidden">
                      <PdfPagePreview file={file} pageIndex={pageNum} width={150} />
                    </div>
                    
                    {isSelected && mode !== 'reverse' && (
                      <div className="absolute inset-0 bg-blue/10 pointer-events-none mix-blend-overlay" />
                    )}
                  </m.div>
                );
              })}
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs font-bold uppercase tracking-wider text-center">
              {error}
            </div>
          )}

          <div className="flex gap-4">
            {!progressState.isProcessing ? (
              <button
                onClick={processPdf}
                disabled={mode !== 'reverse' && selectedPages.size === 0}
                className="flex-1 py-4 bg-blue text-white font-black rounded-xl hover:scale-101 active:scale-98 transition-all disabled:opacity-40 disabled:scale-100 shadow-lg shadow-blue/20 flex flex-col items-center justify-center gap-1"
              >
                {actionLabel}
              </button>
            ) : (
              <button
                onClick={cancelProcess}
                className="flex-1 py-4 bg-red-500/10 text-red-500 border border-red-500/20 font-black rounded-xl hover:bg-red-500/20 transition-all uppercase tracking-widest text-sm"
              >
                Cancel Processing
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
