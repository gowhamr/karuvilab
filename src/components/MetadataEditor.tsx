"use client";

import React, { useState, useRef } from "react";
import { DropZone } from "@/components/ui/DropZone";
import { PrivacyBadge } from "@/components/system/PrivacyBadge";
import { useObjectUrlManager } from "@/src/lib/hooks";
import { workerManager } from "@/src/workers/manager";
import { formatError } from "@/src/lib/formatError";
import { useProgress } from "@/src/contexts/ProgressContext";
import { File, Database, Eraser, PenLine } from "lucide-react";
import { cn } from "@/src/lib/utils";

export type MetadataMode = 'edit' | 'remove';

interface MetadataEditorProps {
  mode: MetadataMode;
  toolId: string;
  title: string;
  description: string;
  actionLabel: string;
}

export function MetadataEditor({ mode, toolId, title, description, actionLabel }: MetadataEditorProps) {
  const { createUrl } = useObjectUrlManager();
  const [file, setFile] = useState<File | null>(null);
  const [fileBuffer, setFileBuffer] = useState<ArrayBuffer | null>(null);
  const { state: progressState, startProcessing, setStage, setProgress, finishProcessing } = useProgress();
  const [error, setError] = useState("");
  const abortControllerRef = useRef<AbortController | null>(null);

  const [metadata, setMetadata] = useState<{
    title: string;
    author: string;
    subject: string;
    keywords: string;
    producer: string;
    creator: string;
  }>({
    title: '', author: '', subject: '', keywords: '', producer: '', creator: ''
  });

  const handleFiles = async (files: FileList | File[]) => {
    const f = files[0];
    if (!f) return;
    setFile(f);
    setError("");
    
    startProcessing("heavy");
    setStage("Reading Metadata...");
    
    try {
      const buffer = await f.arrayBuffer();
      setFileBuffer(buffer);
      
      const meta = await workerManager.getPdfMetadata(buffer);
      setMetadata({
        title: meta.title as string || '',
        author: meta.author as string || '',
        subject: meta.subject as string || '',
        keywords: Array.isArray(meta.keywords) ? meta.keywords.join(', ') : '',
        producer: meta.producer as string || '',
        creator: meta.creator as string || ''
      });
      
    } catch (e) {
      setError("Failed to read PDF file.");
    } finally {
      finishProcessing(true);
    }
  };

  const processPdf = async () => {
    if (!fileBuffer || !file) return;

    const controller = new AbortController();
    abortControllerRef.current = controller;
    
    startProcessing("heavy");
    setStage("Processing PDF...");
    setProgress(0);

    try {
      const targetMetadata = mode === 'remove' 
        ? { clearAll: true }
        : {
            title: metadata.title,
            author: metadata.author,
            subject: metadata.subject,
            keywords: metadata.keywords.split(',').map(k => k.trim()).filter(Boolean),
            producer: metadata.producer,
            creator: metadata.creator,
            clearAll: false
          };

      const outBytes = await workerManager.setPdfMetadata(
        fileBuffer,
        targetMetadata,
        (p: any) => {
          setStage(p.message || "Processing...");
          setProgress(p.percent);
        },
        controller.signal
      );

      const blob = new Blob([outBytes as any], { type: "application/pdf" });
      const url = createUrl(blob);
      
      const a = document.createElement("a");
      a.href = url;
      a.download = `${file.name.replace(/\.pdf$/i, "")}-${mode}-metadata.pdf`;
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

  const hasAnyMetadata = Object.values(metadata).some(val => val.trim().length > 0);

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
                <p className="text-xs text-text-4 font-bold tracking-wider uppercase">PDF Document</p>
              </div>
            </div>
            <button 
              onClick={() => { setFile(null); setFileBuffer(null); setMetadata({title:'', author:'', subject:'', keywords:'', producer:'', creator:''}); }}
              disabled={progressState.isProcessing}
              className="text-xs font-bold uppercase tracking-widest text-text-4 hover:text-red-500 transition-colors disabled:opacity-50"
            >
              Change File
            </button>
          </div>

          <div className="bg-surface border border-border p-6 rounded-3xl space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Database className="w-5 h-5 text-blue" />
              <h3 className="font-black text-lg tracking-tight text-text">Document Properties</h3>
            </div>
            
            {mode === 'remove' && !hasAnyMetadata && !progressState.isProcessing && (
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-400 text-sm font-medium">
                This document does not contain standard metadata properties.
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(Object.keys(metadata) as Array<keyof typeof metadata>).map(field => (
                <div key={field}>
                  <label className="block text-xs font-bold text-text-3 uppercase tracking-wider mb-2">
                    {field}
                  </label>
                  <input 
                    type="text" 
                    value={metadata[field]}
                    readOnly={mode === 'remove' || progressState.isProcessing}
                    onChange={(e) => setMetadata(m => ({ ...m, [field]: e.target.value }))}
                    placeholder={`No ${field}`}
                    className={cn(
                      "w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-text font-medium transition-colors",
                      mode === 'remove' ? "opacity-50 cursor-not-allowed" : "focus:border-blue outline-none"
                    )}
                  />
                </div>
              ))}
            </div>
            
            {mode === 'remove' && hasAnyMetadata && (
              <p className="text-sm font-medium text-text-3">
                All visible metadata above will be removed from the document properties.
              </p>
            )}
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs font-bold uppercase tracking-wider text-center">
              {error}
            </div>
          )}

          <button
            onClick={processPdf}
            disabled={progressState.isProcessing || (mode === 'remove' && !hasAnyMetadata)}
            className={cn(
              "w-full py-4 text-white font-black rounded-xl hover:scale-101 active:scale-98 transition-all disabled:opacity-40 disabled:scale-100 flex justify-center items-center gap-2 shadow-lg",
              mode === 'remove' ? "bg-red-500 shadow-red-500/20" : "bg-blue shadow-blue/20"
            )}
          >
            {progressState.isProcessing ? "Processing..." : (
              <>
                {mode === 'remove' ? <Eraser className="w-5 h-5" /> : <PenLine className="w-5 h-5" />}
                {actionLabel}
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
