"use client";
import { useState, useCallback } from "react";
import { EngineLoader } from "@/components/system/EngineLoader";
import { DropZone } from "@/components/ui/DropZone";
import { Loader2, Download, Settings2 } from "lucide-react";
import { useObjectUrlManager } from "@/src/lib/hooks";
import { logger } from "@/src/lib/logger";
import { workerManager } from "@/src/workers/manager";
import { useRef } from "react";

interface ExtractedImage { url: string; width: number; height: number; page: number; }

export default function PdfToImageClient() {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [images, setImages] = useState<ExtractedImage[]>([]);
  const [progress, setProgress] = useState("");
  const [progressPercent, setProgressPercent] = useState(0);
  const [error, setError] = useState("");
  const [format, setFormat] = useState<"jpeg" | "png">("jpeg");
  const { createUrl, revokeUrl } = useObjectUrlManager();
  const abortControllerRef = useRef<AbortController | null>(null);

  const cancelProcess = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setProcessing(false);
      setProgress("");
      setError("Operation cancelled by user.");
    }
  }, []);

  const checkLib = useCallback(() => {
    return true; 
  }, []);

  const convert = async () => {
    if (!file) { setError("Please select a PDF file."); return; }
    setProcessing(true);
    setError("");
    setProgressPercent(0);
    
    images.forEach(img => revokeUrl(img.url));
    setImages([]);

    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    const { signal } = abortController;

    try {
      const pdfjsLib = await import("pdfjs-dist");
      const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
      const workerUrl = typeof window !== 'undefined' ? window.location.origin + basePath + '/pdf.worker.min.mjs' : 'https://unpkg.com/pdfjs-dist@6.1.200/build/pdf.worker.min.mjs';
      if (pdfjsLib.GlobalWorkerOptions) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;
      } else if ((pdfjsLib as any).default?.GlobalWorkerOptions) {
        (pdfjsLib as any).default.GlobalWorkerOptions.workerSrc = workerUrl;
      }

      const bytes = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
      const totalPages = pdf.numPages;
      const extracted: ExtractedImage[] = [];

      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        if (signal.aborted) throw new Error("Cancelled");
        setProgress(`Rendering page ${pageNum} of ${totalPages}...`);
        setProgressPercent((pageNum / totalPages) * 100);
        
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 2.0 }); 
        
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Could not create canvas context");
        
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: ctx, viewport, canvas: canvas as any }).promise;

        const blob = await new Promise<Blob | null>((resolve) => {
          canvas.toBlob(resolve, `image/${format}`, 0.9);
        });

        if (blob) {
          extracted.push({
            url: createUrl(blob),
            width: canvas.width,
            height: canvas.height,
            page: pageNum
          });
        }
      }

      setImages(extracted);
      setProgress("");
      setProgressPercent(0);
      if (extracted.length === 0) setError("Failed to convert any pages.");
    } catch (e: any) {
      console.error("PDF to Image conversion error:", e);
      setError(e?.message === "Cancelled" ? "Conversion cancelled." : (e?.message || "Failed to convert PDF pages."));
      setProgress("");
      setProgressPercent(0);
    }
    setProcessing(false);
    abortControllerRef.current = null;
  };

  const downloadAll = async () => {
    if (images.length === 0) return;
    
    if (images.length === 1) {
      const a = document.createElement("a");
      a.href = images[0]!.url;
      a.download = `page-1.${format}`;
      a.click();
      return;
    }

    setProgress("Preparing ZIP file...");
    setProcessing(true);
    
    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    const { signal } = abortController;
    
    try {
      const files: Record<string, Uint8Array> = {};
      for (let i = 0; i < images.length; i++) {
        if (signal.aborted) throw new Error("Cancelled");
        const img = images[i]!;
        const res = await fetch(img.url, { signal });
        const buf = await res.arrayBuffer();
        files[`page-${img.page}.${format}`] = new Uint8Array(buf);
      }
      
      const transferList = Object.values(files).map(v => v.buffer);
      const zipData = await workerManager.runZip(files, undefined, signal);
      
      const blob = new Blob([zipData as any], { type: "application/zip" });
      const url = createUrl(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `converted-pages.zip`;
      a.click();
      
    } catch (e: any) {
      console.error("ZIP creation error:", e);
      if (e.name !== "AbortError" && e.message !== "Cancelled") {
        setError("Failed to create ZIP file.");
      }
    }
    
    setProgress("");
    setProcessing(false);
    abortControllerRef.current = null;
  };

  return (
    <div className="space-y-8">
      <EngineLoader
        checkInit={checkLib}
        loadingMessage="Preparing PDF rendering engine..."
        errorMessage="Failed to load PDF engine."
      >
        <div className="bg-surface border border-border p-5 rounded-3xl shadow-sm space-y-6">
          <div className="flex items-center gap-4 border-b border-border pb-4">
             <Settings2 className="w-5 h-5 text-blue" />
             <h3 className="font-bold text-text uppercase tracking-widest text-sm">Conversion Settings</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-xs font-bold text-text-3 uppercase tracking-widest block">Output Format</label>
              <div className="flex bg-surface-2 p-1 rounded-xl">
                {(["jpeg", "png"] as const).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setFormat(fmt)}
                    className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${format === fmt ? "bg-blue text-white shadow-md shadow-blue/20" : "text-text-3 hover:text-text hover:bg-surface-3"}`}
                  >
                    {fmt.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
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
            {progressPercent > 0 && (
              <div className="w-full bg-surface-2 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-blue h-1.5 rounded-full transition-all duration-300" 
                  style={{ width: `${progressPercent}%` }} 
                />
              </div>
            )}
          </div>
        )}

        <div className="flex gap-4">
          <button
            onClick={convert}
            disabled={!file || processing}
            className="flex-1 py-4 bg-blue text-white font-black uppercase tracking-widest rounded-2xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-40 disabled:scale-100 shadow-lg shadow-blue/20"
          >
            {processing ? "Converting…" : "Convert to Images"}
          </button>
          
          {processing && (
            <button
              onClick={cancelProcess}
              className="px-8 py-4 bg-red-500/10 text-red-500 border border-red-500/20 font-black uppercase tracking-widest rounded-2xl hover:bg-red-500/20 active:scale-95 transition-all"
            >
              Cancel
            </button>
          )}
        </div>

        {images.length > 0 && (
          <div className="bg-surface border border-border p-5 rounded-4xl shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-black text-text-2 text-xs uppercase tracking-widest-lg">{images.length} page{images.length !== 1 ? "s" : ""} converted</h2>
              <button 
                onClick={downloadAll} 
                disabled={processing}
                className="flex items-center gap-2 px-4 py-2 bg-blue text-white text-tiny font-bold uppercase tracking-widest-sm rounded-xl hover:opacity-90 transition-all shadow-md shadow-blue/10 disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" /> Download All
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {images.map((img, i) => (
                <div key={i} className="bg-bg border border-border rounded-2xl overflow-hidden group flex flex-col">
                  <div className="aspect-[1/1.4] bg-white flex items-center justify-center p-2 relative overflow-hidden">
                    <img src={img.url} alt={`Converted page ${img.page}`} className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-3 bg-surface border-t border-border space-y-2 mt-auto">
                    <p className="text-tiny font-bold text-text-4 uppercase tracking-tighter">Page {img.page}</p>
                    <a 
                      href={img.url} 
                      download={`page-${img.page}.${format}`} 
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
