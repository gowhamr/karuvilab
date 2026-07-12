"use client";
import { useState, useCallback } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { EngineLoader } from "@/components/system/EngineLoader";
import { DropZone } from "@/components/ui/DropZone";
import { Loader2, AlertCircle, FileText, Download } from "lucide-react";
import { workerOrchestrator } from "@/src/engine/workers/WorkerOrchestrator";
import { useObjectUrlManager } from "@/src/lib/hooks";

const cat = CATEGORIES.find(c => c.id === "pdf")!;

interface ExtractedImage { url: string; width: number; height: number; page: number; index: number; }

export default function ExtractImagesClient() {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [images, setImages] = useState<ExtractedImage[]>([]);
  const [progress, setProgress] = useState("");
  const [progressPercent, setProgressPercent] = useState(0);
  const [error, setError] = useState("");
  const { createUrl, revokeUrl } = useObjectUrlManager();

  const checkLib = useCallback(() => {
    return true; // Library is running in the worker, so it's always ready
  }, []);

  const extract = async () => {
    if (!file) { setError("Please select a PDF file."); return; }
    setProcessing(true);
    setError("");
    setProgressPercent(0);
    
    // Revoke any previous image URLs to avoid memory leaks
    images.forEach(img => revokeUrl(img.url));
    setImages([]);

    try {
      const bytes = await file.arrayBuffer();
      
      const results = await workerOrchestrator.dispatch<Array<{
        arrayBuffer: ArrayBuffer;
        width: number;
        height: number;
        page: number;
        index: number;
      }>>(
        "extractImagesFromPdf",
        [bytes],
        [bytes],
        (p: any) => {
          setProgress(p.message || `Processing page...`);
          if (typeof p.percent === "number") {
            setProgressPercent(p.percent);
          }
        }
      );

      const extracted = results.map(item => {
        const blob = new Blob([item.arrayBuffer], { type: "image/png" });
        const url = createUrl(blob);
        return {
          url,
          width: item.width,
          height: item.height,
          page: item.page,
          index: item.index
        };
      });

      setImages(extracted);
      setProgress("");
      setProgressPercent(0);
      if (extracted.length === 0) setError("No extractable images found in this PDF.");
    } catch (e: any) {
      console.error("Image extraction error:", e);
      setError(e?.message || "Failed to extract images.");
      setProgress("");
      setProgressPercent(0);
    }
    setProcessing(false);
  };

  const downloadAll = () => {
    images.forEach((img, i) => {
      const a = document.createElement("a");
      a.href = img.url;
      a.download = `extracted-page${img.page}-img${img.index + 1}.png`;
      a.click();
    });
  };

  return (
    <div className="space-y-8">
      <EngineLoader
        checkInit={checkLib}
        loadingMessage="Preparing PDF extraction engine..."
        errorMessage="Failed to load PDF extraction engine."
      >
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl text-sm text-yellow-700 dark:text-yellow-400">
          <strong>Note:</strong> Extracts raster images (JPEG, PNG) embedded in the PDF. Vector graphics and text-based content cannot be extracted as images.
        </div>

        <DropZone
          onFilesSelected={(files) => {
            const f = files instanceof FileList ? files[0] : files[0];
            if (f) { setFile(f); setImages([]); }
          }}
          accept=".pdf,application/pdf"
          title={file ? file.name : "Drop a PDF here or click to select"}
          description={file ? `${(file.size / 1024).toFixed(0)} KB` : "Supports standard PDF files"}
          icon={<div className="text-4xl">{file ? "📄" : "🖼️"}</div>}
        />

        {error && <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl text-red-600 text-sm font-bold">{error}</div>}
        {progress && (
          <div className="p-4 bg-surface border border-border rounded-xl space-y-3">
            <div className="text-sm text-text-3 flex items-center gap-2 font-bold uppercase tracking-widest">
              <Loader2 className="w-4 h-4 animate-spin text-blue" />
              {progress}
            </div>
            <div className="w-full bg-surface-2 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-blue h-1.5 rounded-full transition-all duration-300" 
                style={{ width: `${progressPercent}%` }} 
              />
            </div>
          </div>
        )}

        <button
          onClick={extract}
          disabled={!file || processing}
          className="w-full py-4 bg-blue text-white font-black uppercase tracking-widest rounded-2xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-40 disabled:scale-100 shadow-lg shadow-blue/20"
        >
          {processing ? "Extracting…" : "Extract Images"}
        </button>

        {images.length > 0 && (
          <div className="bg-surface border border-border p-5 rounded-4xl shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-black text-text-2 text-xs uppercase tracking-widest-lg">{images.length} image{images.length !== 1 ? "s" : ""} found</h2>
              <button 
                onClick={downloadAll} 
                className="flex items-center gap-2 px-4 py-2 bg-blue text-white text-tiny font-bold uppercase tracking-widest-sm rounded-xl hover:opacity-90 transition-all shadow-md shadow-blue/10"
              >
                <Download className="w-3.5 h-3.5" /> Download All
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {images.map((img, i) => (
                <div key={i} className="bg-bg border border-border rounded-2xl overflow-hidden group">
                  <div className="aspect-square bg-white flex items-center justify-center p-2">
                    <img src={img.url} alt={`Extracted image ${i + 1}`} className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="p-3 bg-surface border-t border-border space-y-2">
                    <p className="text-tiny font-bold text-text-4 uppercase tracking-tighter">Page {img.page} · {img.width}×{img.height}px</p>
                    <a 
                      href={img.url} 
                      download={`extracted-p${img.page}-${i + 1}.png`} 
                      className="inline-flex items-center gap-1.5 text-tiny font-black text-blue uppercase tracking-widest hover:underline"
                    >
                      <Download size={10} /> Download
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </EngineLoader>
    </div>
  );
}
