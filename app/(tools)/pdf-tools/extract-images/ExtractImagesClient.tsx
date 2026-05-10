"use client";
import { useState, useRef } from "react";
import Script from "next/script";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";

declare const pdfjsLib: any;

const cat = CATEGORIES.find(c => c.id === "pdf")!;

interface ExtractedImage { url: string; width: number; height: number; page: number; index: number; }

export default function ExtractImagesClient() {
  const [file, setFile] = useState<File | null>(null);
  const [libReady, setLibReady] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [images, setImages] = useState<ExtractedImage[]>([]);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const extract = async () => {
    if (!libReady) { setError("PDF library not loaded yet."); return; }
    if (!file) { setError("Please select a PDF file."); return; }
    setProcessing(true);
    setError("");
    setImages([]);
    try {
      pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.mjs";
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
    <>
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.min.mjs" type="module" onLoad={() => setLibReady(true)} />
      
        {!libReady && <div className="bg-surface border border-border p-4 rounded-2xl text-sm text-text-3 flex items-center gap-2"><span className="animate-spin">⏳</span> Loading PDF.js library…</div>}

        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl text-sm text-yellow-700 dark:text-yellow-400">
          <strong>Note:</strong> Extracts raster images (JPEG, PNG) embedded in the PDF. Vector graphics and text-based content cannot be extracted as images.
        </div>

        <div
          className="bg-surface border-2 border-dashed border-border rounded-2xl p-10 text-center cursor-pointer hover:border-blue transition-colors"
          onClick={() => fileRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) { setFile(f); setImages([]); } }}
        >
          {file ? (
            <div className="space-y-1">
              <p className="font-semibold text-text-2">{file.name}</p>
              <p className="text-sm text-text-3">{(file.size / 1024).toFixed(0)} KB</p>
            </div>
          ) : (
            <>
              <div className="text-4xl mb-2">🖼️</div>
              <p className="font-semibold text-text-2">Drop a PDF here or click to select</p>
            </>
          )}
          <input ref={fileRef} type="file" accept=".pdf,application/pdf" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) { setFile(f); setImages([]); } }} />
        </div>

        {error && <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl text-red-600 text-sm">{error}</div>}
        {progress && <div className="p-4 bg-surface border border-border rounded-xl text-sm text-text-3 flex items-center gap-2"><span className="animate-spin">⏳</span>{progress}</div>}

        <button
          onClick={extract}
          disabled={!file || processing || !libReady}
          className="w-full py-4 bg-blue text-white font-bold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
        >
          {processing ? "Extracting…" : "Extract Images"}
        </button>

        {images.length > 0 && (
          <div className="bg-surface border border-border p-5 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-text-2 text-sm uppercase tracking-wider">{images.length} image{images.length !== 1 ? "s" : ""} found</h2>
              <button onClick={downloadAll} className="px-4 py-2 bg-blue text-white text-sm font-bold rounded-xl hover:opacity-90">
                Download All
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {images.map((img, i) => (
                <div key={i} className="bg-bg border border-border rounded-xl overflow-hidden">
                  <img src={img.url} alt={`Extracted image ${i + 1}`} className="w-full h-24 object-contain bg-white" />
                  <div className="p-2 space-y-1">
                    <p className="text-xs text-text-4">Page {img.page} · {img.width}×{img.height}px</p>
                    <a href={img.url} download={`extracted-p${img.page}-${i + 1}.png`} className="text-xs text-blue hover:underline font-medium">
                      Download
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      
    </>
  );
}
