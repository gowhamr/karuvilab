"use client";
import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { blobManager } from "@/src/lib/blob-manager";

interface PdfPagePreviewProps {
  file: File | Blob | ArrayBuffer;
  pageIndex: number;
  width?: number;
  rotation?: number;
  className?: string;
}

export function PdfPagePreview({ file, pageIndex, width = 150, rotation = 0, className = "" }: PdfPagePreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    let objectUrl: string | null = null;
    let loadingTask: any = null;

    const renderPage = async () => {
      try {
        setLoading(true);
        const pdfjsLib = await import("pdfjs-dist");
        
        if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
          const initWorkerSrc = () => {
            try { return '/pdf.worker.min.mjs'; }
            catch { return 'https://unpkg.com/pdfjs-dist@5.4.149/build/pdf.worker.min.mjs'; }
          };
          pdfjsLib.GlobalWorkerOptions.workerSrc = initWorkerSrc();
        }

        let docParams;
        if (file instanceof ArrayBuffer) {
          docParams = { data: file };
        } else {
          objectUrl = blobManager.create(file as Blob);
          docParams = { url: objectUrl };
        }

        loadingTask = pdfjsLib.getDocument(docParams);
        const pdfDoc = await loadingTask.promise;
        
        if (!active) return;
        
        const page = await pdfDoc.getPage(pageIndex);
        if (!active) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const viewportUnscaled = page.getViewport({ scale: 1.0 });
        const scale = width / viewportUnscaled.width;
        const viewport = page.getViewport({ scale });

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const renderContext = {
          canvasContext: ctx,
          viewport: viewport,
        };

        await page.render(renderContext).promise;
        if (active) setLoading(false);
      } catch (err) {
        // Suppress errors from cancelled rendering
        if (active) console.error("Failed to render PDF page preview:", err);
      }
    };

    renderPage();

    return () => {
      active = false;
      if (objectUrl) blobManager.revoke(objectUrl);
      if (loadingTask) {
        try {
          loadingTask.destroy();
        } catch (e) {}
      }
    };
  }, [file, pageIndex, width]);

  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width }}>
      <canvas 
        ref={canvasRef} 
        className="block max-w-full shadow-sm rounded border border-border bg-white" 
        style={{ 
          transform: `rotate(${rotation}deg)`, 
          transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)" 
        }} 
      />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-bg/50 backdrop-blur-sm rounded">
          <Loader2 className="w-5 h-5 animate-spin text-blue" />
        </div>
      )}
    </div>
  );
}
