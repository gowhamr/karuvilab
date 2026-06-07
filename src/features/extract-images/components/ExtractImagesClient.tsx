"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { EngineLoader } from "@/components/system/EngineLoader";
import { DropZone } from "@/components/ui/DropZone";
import { Loader2, AlertCircle, FileText, Download } from "lucide-react";

declare const pdfjsLib: any;

const cat = CATEGORIES.find(c => c.id === "pdf")!;

interface ExtractedImage { url: string; width: number; height: number; page: number; index: number; }

export default function ExtractImagesClient() {
  const [file, setFile] = useState<File | null>(null);
  const [libReady, setLibReady] = useState(false);
  const [libError, setLibError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [images, setImages] = useState<ExtractedImage[]>([]);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");

  // Robust ESM Loader for PDF.js
  useEffect(() => {
    async function initLib() {
      if (typeof window === 'undefined') return;
      if (typeof (window as any).pdfjsLib !== 'undefined') {
        setLibReady(true);
        return;
      }

      try {
        let pdfjs;
        try {
          // @ts-ignore
          pdfjs = await import(/* webpackIgnore: true */ "/pdf.min.mjs");
        } catch (e) {
          // @ts-ignore
          pdfjs = await import(/* webpackIgnore: true */ "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.4.149/pdf.min.mjs");
        }
        
        (window as any).pdfjsLib = pdfjs;

        // Configure Worker Source
        try {
          (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
        } catch (err) {
          (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc = "https://unpkg.com/pdfjs-dist@5.4.149/build/pdf.worker.min.mjs";
        }

        setLibReady(true);
      } catch (err) {
        console.error("Failed to load PDF.js engine:", err);
        setLibError("Failed to load PDF engine. Please check your connection.");
      }
    }
    initLib();
  }, []);

  const checkLib = useCallback(() => {
    return typeof (window as any).pdfjsLib !== 'undefined';
  }, []);

  const extract = async () => {
    if (!checkLib()) { setError("PDF library not loaded yet."); return; }
    if (!file) { setError("Please select a PDF file."); return; }
    setProcessing(true);
    setError("");
    setImages([]);
    try {
      try {
        pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
      } catch (err) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.mjs";
      }
      
      const bytes = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
      const extracted: ExtractedImage[] = [];
      let imgIndex = 0;

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        setProgress(`Processing page ${pageNum} of ${pdf.numPages}…`);
        const page = await pdf.getPage(pageNum);
        const ops = await page.getOperatorList();
        const fns = ops.fnArray;
        const args = ops.argsArray;

        for (let i = 0; i < fns.length; i++) {
          const OPS = pdfjsLib.OPS;
          if (fns[i] === OPS.paintImageXObject || fns[i] === OPS.paintImageXObjectRepeat) {
            const imgName = args[i][0];
            try {
              const imgData = await new Promise<any>((res, rej) => {
                page.objs.get(imgName, (img: any) => img ? res(img) : rej(new Error("not found")));
              });
              const canvas = document.createElement("canvas");
              canvas.width = imgData.width;
              canvas.height = imgData.height;
              const ctx = canvas.getContext("2d")!;
              const imageData = ctx.createImageData(imgData.width, imgData.height);

              if (imgData.data && imgData.data.length) {
                const src = imgData.data;
                const dst = imageData.data;
                if (src.length === imgData.width * imgData.height * 3) {
                  for (let p = 0; p < imgData.width * imgData.height; p++) {
                    dst[p * 4] = src[p * 3];
                    dst[p * 4 + 1] = src[p * 3 + 1];
                    dst[p * 4 + 2] = src[p * 3 + 2];
                    dst[p * 4 + 3] = 255;
                  }
                } else {
                  dst.set(src.slice(0, dst.length));
                }
              }

              ctx.putImageData(imageData, 0, 0);
              const url = canvas.toDataURL("image/png");
              extracted.push({ url, width: imgData.width, height: imgData.height, page: pageNum, index: imgIndex++ });
            } catch {}
          }
        }
      }

      setImages(extracted);
      setProgress("");
      if (extracted.length === 0) setError("No extractable images found in this PDF.");
    } catch (e: any) {
      setError(e?.message || "Failed to extract images.");
      setProgress("");
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
        errorMessage={libError || "Failed to load PDF extraction engine."}
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
        {progress && <div className="p-4 bg-surface border border-border rounded-xl text-sm text-text-3 flex items-center gap-2 font-bold uppercase tracking-widest"><Loader2 className="w-4 h-4 animate-spin text-blue" />{progress}</div>}

        <button
          onClick={extract}
          disabled={!file || processing || !libReady}
          className="w-full py-4 bg-blue text-white font-black uppercase tracking-widest rounded-2xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-40 disabled:scale-100 shadow-lg shadow-blue/20"
        >
          {processing ? "Extracting…" : "Extract Images"}
        </button>

        {images.length > 0 && (
          <div className="bg-surface border border-border p-5 rounded-4xl shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-black text-text-2 text-[10px] uppercase tracking-[0.2em]">{images.length} image{images.length !== 1 ? "s" : ""} found</h2>
              <button 
                onClick={downloadAll} 
                className="flex items-center gap-2 px-4 py-2 bg-blue text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:opacity-90 transition-all shadow-md shadow-blue/10"
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
                    <p className="text-[9px] font-bold text-text-4 uppercase tracking-tighter">Page {img.page} · {img.width}×{img.height}px</p>
                    <a 
                      href={img.url} 
                      download={`extracted-p${img.page}-${i + 1}.png`} 
                      className="inline-flex items-center gap-1.5 text-[9px] font-black text-blue uppercase tracking-widest hover:underline"
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
