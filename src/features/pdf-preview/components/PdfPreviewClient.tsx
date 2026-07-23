"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { useObjectUrlManager } from "@/src/lib/hooks";
import { DropZone } from "@/components/ui/DropZone";
import { PrivacyBadge } from "@/components/system/PrivacyBadge";
import { formatError } from "@/src/lib/formatError";
import { Loader2, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Download } from "lucide-react";

export default function PdfPreviewClient() {
  const { createUrl, revokeUrl } = useObjectUrlManager();
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.0);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const f = files[0];
    if (!f) return;
    
    setFile(f);
    if (fileUrl) revokeUrl(fileUrl);
    setFileUrl(createUrl(f));
    setError("");
    setIsProcessing(true);
    
    try {
      const pdfjsLib = await import("pdfjs-dist");
      const workerUrl = typeof window !== 'undefined' ? window.location.origin + '/pdf.worker.min.mjs' : 'https://unpkg.com/pdfjs-dist@5.7.284/build/pdf.worker.min.mjs';
      if (pdfjsLib.GlobalWorkerOptions) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;
      } else if ((pdfjsLib as any).default?.GlobalWorkerOptions) {
        (pdfjsLib as any).default.GlobalWorkerOptions.workerSrc = workerUrl;
      }
      
      const buffer = await f.arrayBuffer();
      const doc = await pdfjsLib.getDocument({ data: buffer }).promise;
      setPdfDoc(doc);
      setNumPages(doc.numPages);
      setCurrentPage(1);
      setScale(1.0);
    } catch (e: any) {
      setError(formatError(e) || "Failed to load PDF.");
    } finally {
      setIsProcessing(false);
    }
  }, [fileUrl, createUrl, revokeUrl]);

  const renderPage = useCallback(async (pageNum: number, currentScale: number) => {
    if (!pdfDoc || !canvasRef.current) return;
    try {
      const page = await pdfDoc.getPage(pageNum);
      const viewport = page.getViewport({ scale: currentScale });
      
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      if (!context) return;
      
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      
      const renderContext = {
        canvasContext: context,
        viewport: viewport
      };
      
      await page.render(renderContext).promise;
    } catch (e: any) {
      console.error("Error rendering page:", e);
    }
  }, [pdfDoc]);

  useEffect(() => {
    if (pdfDoc && canvasRef.current) {
      renderPage(currentPage, scale);
    }
  }, [pdfDoc, currentPage, scale, renderPage]);

  const handleZoomIn = () => setScale(s => Math.min(s + 0.25, 3.0));
  const handleZoomOut = () => setScale(s => Math.max(s - 0.25, 0.5));
  const handlePrevPage = () => setCurrentPage(p => Math.max(p - 1, 1));
  const handleNextPage = () => setCurrentPage(p => Math.min(p + 1, numPages));

  return (
    <div className="space-y-6">
      <PrivacyBadge message="Local processing – No files uploaded to servers" />

      {!pdfDoc && (
        <DropZone
          onFilesSelected={handleFiles}
          accept=".pdf,application/pdf"
          multiple={false}
          title={file ? file.name : "Drop a PDF here to preview"}
          description={file ? `${(file.size / 1024).toFixed(0)} KB` : "View your PDF securely offline"}
          icon={<div className="text-4xl">{file ? "📄" : "🔍"}</div>}
        />
      )}

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl text-red-600 text-sm font-bold">
          {error}
        </div>
      )}

      {isProcessing && !pdfDoc && (
        <div className="p-4 bg-surface border border-border rounded-xl flex items-center justify-center gap-3 text-sm text-text-3 font-bold uppercase tracking-widest">
          <Loader2 className="w-4 h-4 animate-spin text-blue" />
          Loading PDF...
        </div>
      )}

      {pdfDoc && (
        <div className="bg-surface border border-border rounded-3xl overflow-hidden flex flex-col shadow-sm">
          <div className="p-3 border-b border-border bg-bg flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <button onClick={() => setPdfDoc(null)} className="px-3 py-1.5 bg-surface-2 hover:bg-border border border-border text-text rounded-lg text-xs font-bold transition-colors">
                Close
              </button>
              <span className="text-sm font-bold text-text-2 truncate max-w-[200px]" title={file?.name}>{file?.name}</span>
            </div>
            
            <div className="flex items-center gap-4 bg-surface rounded-xl p-1 border border-border">
              <div className="flex items-center gap-1 border-r border-border pr-3">
                <button 
                  onClick={handleZoomOut} 
                  disabled={scale <= 0.5}
                  className="p-1.5 text-text-3 hover:text-blue hover:bg-blue/10 rounded-lg disabled:opacity-50 transition-colors"
                  aria-label="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs font-bold text-text-2 w-12 text-center">{Math.round(scale * 100)}%</span>
                <button 
                  onClick={handleZoomIn} 
                  disabled={scale >= 3.0}
                  className="p-1.5 text-text-3 hover:text-blue hover:bg-blue/10 rounded-lg disabled:opacity-50 transition-colors"
                  aria-label="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex items-center gap-2 pl-1 pr-2">
                <button 
                  onClick={handlePrevPage} 
                  disabled={currentPage <= 1}
                  className="p-1.5 text-text-3 hover:text-blue hover:bg-blue/10 rounded-lg disabled:opacity-50 transition-colors"
                  aria-label="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-bold text-text-2">
                  {currentPage} <span className="text-text-4">/ {numPages}</span>
                </span>
                <button 
                  onClick={handleNextPage} 
                  disabled={currentPage >= numPages}
                  className="p-1.5 text-text-3 hover:text-blue hover:bg-blue/10 rounded-lg disabled:opacity-50 transition-colors"
                  aria-label="Next Page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {fileUrl && (
              <a 
                href={fileUrl} 
                download={file?.name}
                className="px-3 py-1.5 bg-blue text-white text-xs font-bold rounded-lg hover:opacity-90 transition-opacity flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Download
              </a>
            )}
          </div>
          
          <div className="bg-[#e5e7eb] dark:bg-[#111827] w-full min-h-[60vh] max-h-[80vh] overflow-auto flex items-center justify-center p-6 relative">
            <canvas 
              ref={canvasRef} 
              className="bg-white shadow-xl max-w-none"
              style={{ width: `${canvasRef.current?.width ? canvasRef.current.width / window.devicePixelRatio : 'auto'}px` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
