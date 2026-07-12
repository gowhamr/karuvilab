"use client";
import { useState, useRef } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { workerManager } from "@/src/workers/manager";
import { TaskProgress } from "@/src/workers/types";
import { useProgress } from "@/src/contexts/ProgressContext";

import { useObjectUrlManager } from "@/src/lib/hooks";

import { DropZone } from "@/components/ui/DropZone";

const cat = CATEGORIES.find(c => c.id === "pdf")!;

interface PdfFile { name: string; file: File; }

import { useWorkflowStore } from "@/src/store/useWorkflowStore";
import { WorkflowSuggestions } from "@/components/ui/WorkflowSuggestions";
import { useWorkflowInput } from "@/src/lib/hooks/useWorkflowInput";

export default function MergePdfClient() {
  const { createUrl, revokeUrl } = useObjectUrlManager();
  const [files, setFiles] = useState<PdfFile[]>([]);

  const { state: progressState, startProcessing, setStage, setProgress, finishProcessing } = useProgress();
  const [error, setError] = useState("");
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  const addFiles = (fl: FileList | File[] | null) => {
    if (!fl) return;
    setFiles(prev => [...prev, ...Array.from(fl).map(f => ({ name: f.name, file: f }))]);
  };

  useWorkflowInput(addFiles);

  const removeFile = (i: number) => setFiles(f => f.filter((_, idx) => idx !== i));

  const moveUp = (i: number) => {
    if (i === 0) return;
    setFiles(f => { const a = [...f]; const t = a[i-1]!; a[i-1] = a[i]!; a[i] = t; return a; });
  };

  const moveDown = (i: number) => {
    setFiles(f => { if (i >= f.length - 1) return f; const a = [...f]; const t = a[i]!; a[i] = a[i+1]!; a[i+1] = t; return a; });
  };

  const merge = async () => {
    if (files.length < 2) { setError("Please add at least 2 PDF files to merge."); return; }
    
    const totalSize = files.reduce((acc, f) => acc + f.file.size, 0);
    const isLarge = totalSize > 30 * 1024 * 1024; // 30MB threshold

    const controller = new AbortController();
    setAbortController(controller);
    startProcessing("heavy");
    setStage(isLarge ? "Large files detected. Merging sequentially to save memory..." : "Preparing files...");
    setProgress(0);
    
    // UI Warning for mobile
    if (isLarge && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      setStage("Processing >30MB on mobile. Please keep the app open...");
    }
    
    try {
      // Pass the File objects directly to the worker. 
      // They are cloned (not read into memory yet) when passed.
      const bytes = await workerManager.mergePdfs(
        files.map(f => f.file),
        (p) => {
          setStage(p.message || "Merging...");
          setProgress(p.percent);
        },
        controller.signal
      );

      const blob = new Blob([bytes as unknown as BlobPart], { type: "application/pdf" });
      const url = createUrl(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "merged.pdf";
      a.click();
      
      useWorkflowStore.getState().syncToolOutput("merge-pdf", [{ 
        blob, 
        name: "merged.pdf", 
        type: "pdf" 
      }]);
      
      // Delay revocation by 5 seconds to ensure browser starts download even for massive blobs
      setTimeout(() => revokeUrl(url), 5000);
    } catch (e: any) {
      if (e.message === "Task cancelled") {
        setError("Merge cancelled.");
        finishProcessing(false, new Error("Merge cancelled."));
      } else {
        setError(e?.message || "Failed to merge PDFs.");
        finishProcessing(false, new Error(e?.message || "Failed to merge PDFs."));
      }
    } finally {
      finishProcessing(true);
      setAbortController(null);
    }
  };

  const cancelMerge = () => {
    abortController?.abort();
  };

  return (
    <div className="space-y-6">
      <DropZone
        onFilesSelected={addFiles}
        accept=".pdf,application/pdf"
        multiple
        title="Drop PDF files here or click to add"
        description="Add multiple PDFs — they will be merged in order"
        icon={<div className="text-4xl">📄</div>}
      />

      {files.length > 0 && (
        <div className="bg-surface border border-border p-5 rounded-2xl shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-text-2 text-sm uppercase tracking-wider">Files ({files.length}) — drag to reorder</h2>
            <button onClick={() => setFiles([])} className="text-xs text-red-500 hover:text-red-600 font-medium">Clear all</button>
          </div>
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-3 bg-bg border border-border rounded-xl px-4 py-3">
              <span className="text-xs font-bold text-text-4 w-5 text-center">{i + 1}</span>
              <div className="flex flex-col gap-0.5 flex-shrink-0">
                <button aria-label="Move file up" onClick={() => moveUp(i)} disabled={i === 0} className="text-xs text-text-4 hover:text-blue disabled:opacity-30">▲</button>
                <button aria-label="Move file down" onClick={() => moveDown(i)} disabled={i === files.length - 1} className="text-xs text-text-4 hover:text-blue disabled:opacity-30">▼</button>
              </div>
              <p className="flex-1 font-medium text-sm truncate">{f.name}</p>
              <p className="text-xs text-text-4">{(f.file.size / 1024).toFixed(0)} KB</p>
              <button aria-label="Remove file" onClick={() => removeFile(i)} className="text-red-400 hover:text-red-600 text-sm font-bold flex-shrink-0">✕</button>
            </div>
          ))}
        </div>
      )}

      {error && <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl text-red-600 text-sm">{error}</div>}

      <div className="flex gap-4">
        <button
          onClick={merge}
          disabled={files.length < 2 || progressState.isProcessing}
          className="flex-1 py-4 bg-blue text-white font-bold rounded-xl hover:scale-102 active:scale-98 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100 flex flex-col items-center justify-center gap-1"
        >
          {progressState.isProcessing ? "Processing..." : `Merge ${files.length} PDF${files.length !== 1 ? "s" : ""}`}
        </button>

        {progressState.isProcessing && (
          <button
            onClick={cancelMerge}
            className="px-6 py-4 bg-red-500/10 text-red-500 font-bold rounded-xl hover:bg-red-500/20 transition-all"
          >
            Cancel
          </button>
        )}
      </div>

      <WorkflowSuggestions />
    </div>
  );
}
