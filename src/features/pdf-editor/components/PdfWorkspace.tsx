"use client";
import { useEffect, useState, useRef } from "react";
import { Loader2, MousePointer2, Type, PenTool, Square, Image as ImageIcon, Eraser, Download, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import ThumbnailSidebar from "./ThumbnailSidebar";
import EditorCanvas from "./EditorCanvas";
import { useEditorStore } from "../store";
import { useProgress } from "@/src/contexts/ProgressContext";
import { useObjectUrlManager } from "@/src/lib/hooks";
import { workerManager } from "@/src/workers/manager";

interface PdfWorkspaceProps {
  file: File;
  onClear: () => void;
}

export default function PdfWorkspace({ file, onClear }: PdfWorkspaceProps) {
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentPageId, setCurrentPageId] = useState("1");
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  
  const initPages = useEditorStore(s => s.initPages);
  const pages = useEditorStore(s => s.pages);
  const activePages = pages.filter(p => !p.isDeleted);
  
  const displayIndex = activePages.findIndex(p => p.id === currentPageId) + 1;
  const numActivePages = activePages.length;
  const activeTool = useEditorStore(s => s.activeTool);

  const [pageInput, setPageInput] = useState<string>(String(displayIndex));

  useEffect(() => {
    setPageInput(String(displayIndex > 0 ? displayIndex : 1));
  }, [displayIndex]);

  const handlePageJump = (val: string) => {
    const num = parseInt(val, 10);
    if (!isNaN(num) && num >= 1 && num <= numActivePages) {
      setCurrentPageId(activePages[num - 1]!.id);
    } else {
      setPageInput(String(displayIndex > 0 ? displayIndex : 1));
    }
  };

  const goToFirstPage = () => {
    if (activePages.length > 0) setCurrentPageId(activePages[0]!.id);
  };

  const goToLastPage = () => {
    if (activePages.length > 0) setCurrentPageId(activePages[activePages.length - 1]!.id);
  };

  const goToPrevPage = () => {
    const currentIndex = activePages.findIndex(p => p.id === currentPageId);
    if (currentIndex > 0) {
      setCurrentPageId(activePages[currentIndex - 1]!.id);
    }
  };

  const goToNextPage = () => {
    const currentIndex = activePages.findIndex(p => p.id === currentPageId);
    if (currentIndex < activePages.length - 1) {
      setCurrentPageId(activePages[currentIndex + 1]!.id);
    }
  };

  const { state: progressState, startProcessing, setStage, setProgress, finishProcessing } = useProgress();
  const { createUrl, revokeUrl } = useObjectUrlManager();

  useEffect(() => {
    if (activePages.length > 0 && displayIndex === 0) {
      setCurrentPageId(activePages[0]!.id);
    }
  }, [activePages, displayIndex]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const currentPageData = pages.find(p => p.id === currentPageId);
    if (!currentPageData) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      useEditorStore.getState().addAnnotation({
        id: Date.now().toString(),
        pageIndex: currentPageData.originalIndex,
        type: 'image',
        dataUrl,
        x: 40, y: 40, 
        width: 20, height: 20, 
      } as any);
      useEditorStore.getState().setActiveTool('select');
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };
  
  const handleExport = async () => {
    const controller = new AbortController();
    setAbortController(controller);
    startProcessing("heavy");
    setStage("Preparing to export...");
    setProgress(0);

    try {
      const bytes = await file.arrayBuffer();
      const activeState = pages.filter(p => !p.isDeleted).map(p => ({ originalIndex: p.originalIndex, rotation: p.rotation }));
      const annotations = useEditorStore.getState().annotations;
      
      const outBytes = await workerManager.exportPdfEditor(
        bytes,
        activeState,
        annotations,
        (p) => {
          setStage(p.message || "Exporting...");
          setProgress(p.percent);
        },
        controller.signal
      );
      
      const blob = new Blob([outBytes as unknown as BlobPart], { type: "application/pdf" });
      const url = createUrl(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name.replace(/\.pdf$/i, "") + "-edited.pdf";
      a.click();
      revokeUrl(url);
    } catch (e: any) {
      if (e.message !== "Task cancelled") {
        setError(e?.message || "Failed to export PDF.");
      }
    } finally {
      finishProcessing(true);
      setAbortController(null);
    }
  };

  useEffect(() => {
    let active = true;
    let loadingTask: any = null;

    const loadPdf = async () => {
      try {
        const pdfjsLib = await import("pdfjs-dist");
        
        const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
        const version = pdfjsLib.version || '6.2.108';
        const workerUrl = typeof window !== 'undefined' 
          ? `${window.location.origin}${basePath}/pdf.worker.min.mjs?v=${version}` 
          : `https://unpkg.com/pdfjs-dist@${version}/build/pdf.worker.min.mjs`;
        if (pdfjsLib.GlobalWorkerOptions) {
          pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;
        }
        if ((pdfjsLib as any).default?.GlobalWorkerOptions) {
          (pdfjsLib as any).default.GlobalWorkerOptions.workerSrc = workerUrl;
        }

        let buffer: ArrayBuffer | null = await file.arrayBuffer();
        if (!active) {
          buffer = null;
          return;
        }
        
        loadingTask = pdfjsLib.getDocument({ data: buffer });
        buffer = null; 
        
        const doc = await loadingTask.promise;
        if (!active) return;

        setPdfDoc(doc);
        initPages(doc.numPages);
      } catch (err: any) {
        if (active) setError(err.message || "Failed to load PDF");
      }
    };

    loadPdf();

    return () => {
      active = false;
      if (loadingTask) {
        try {
          loadingTask.destroy();
        } catch (e) {}
      }
    };
  }, [file, initPages]);

  if (error) {
    return (
      <div className="p-4 sm:p-8 text-center bg-red-500/10 rounded-2xl border border-red-500/20">
        <p className="text-red-500 font-bold mb-4">{error}</p>
        <button onClick={onClear} className="px-6 py-3 bg-bg rounded-xl border border-border text-sm font-bold text-text-2 hover:bg-surface-2 transition-colors">Back</button>
      </div>
    );
  }

  if (!pdfDoc) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] bg-surface border border-border rounded-4xl shadow-sm">
        <Loader2 className="w-10 h-10 animate-spin text-blue mb-4" />
        <p className="text-text-2 font-bold animate-pulse uppercase tracking-wider text-sm">Parsing PDF...</p>
      </div>
    );
  }

  if (activePages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] bg-surface border border-border rounded-4xl shadow-sm space-y-4">
        <div className="text-4xl">🗑️</div>
        <p className="text-text-2 font-bold text-lg">All pages deleted</p>
        <button onClick={onClear} className="px-6 py-3 bg-blue text-white rounded-xl font-bold shadow-lg shadow-blue/20">Start Over</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row h-[calc(100vh-140px)] min-h-[600px] border border-border rounded-4xl overflow-hidden bg-bg shadow-sm">
      <ThumbnailSidebar 
        pdfDoc={pdfDoc}
        currentPageId={currentPageId} 
        onSelectPage={setCurrentPageId}
        className={showThumbnails ? 'flex' : 'hidden sm:flex'}
      />
      
      <div className="flex-1 bg-surface-2 relative flex flex-col min-w-0">
        {/* Top toolbar */}
        <div className="border-b border-border bg-surface flex flex-col sm:flex-row items-center justify-between p-2 sm:px-4 sm:h-14 z-content relative gap-2 sm:gap-0">
          <div className="flex items-center justify-between w-full sm:w-auto gap-2 sm:gap-4">
            <span className="text-sm font-bold text-text-2 truncate max-w-[150px] sm:max-w-[300px]">{file.name}</span>
            <div className="flex gap-1 items-center shrink-0">
              <button
                onClick={goToFirstPage}
                disabled={displayIndex <= 1}
                className="p-1 bg-bg border border-border rounded-md text-text hover:bg-surface-2 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                title="First Page"
                aria-label="First Page"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>
              <button
                onClick={goToPrevPage}
                disabled={displayIndex <= 1}
                className="p-1 bg-bg border border-border rounded-md text-text hover:bg-surface-2 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                title="Previous Page"
                aria-label="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-1 bg-bg border border-border rounded-md px-1.5 py-0.5 shrink-0">
                <span className="text-[11px] font-bold text-text-muted">Page</span>
                <input
                  type="number"
                  min={1}
                  max={numActivePages}
                  value={pageInput}
                  onChange={(e) => setPageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handlePageJump(pageInput);
                  }}
                  onBlur={() => handlePageJump(pageInput)}
                  aria-label="Target Page Number"
                  className="w-10 text-center text-xs font-bold text-text bg-surface-2 border border-border/60 rounded px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-blue"
                />
                <span className="text-[11px] font-bold text-text-muted">/ {numActivePages}</span>
              </div>
              <button
                onClick={goToNextPage}
                disabled={displayIndex >= numActivePages}
                className="p-1 bg-bg border border-border rounded-md text-text hover:bg-surface-2 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                title="Next Page"
                aria-label="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={goToLastPage}
                disabled={displayIndex >= numActivePages}
                className="p-1 bg-bg border border-border rounded-md text-text hover:bg-surface-2 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                title="Last Page"
                aria-label="Last Page"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setShowThumbnails(!showThumbnails)}
                className="sm:hidden px-2 py-1 bg-blue/10 text-blue border border-blue/20 rounded-md text-xs font-bold uppercase tracking-widest"
              >
                {showThumbnails ? 'Hide' : 'Pages'}
              </button>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2 bg-bg p-1 rounded-xl border border-border w-full sm:w-auto">
            {[
              { id: 'select', icon: MousePointer2, label: 'Select' },
              { id: 'text', icon: Type, label: 'Text' },
              { id: 'draw', icon: PenTool, label: 'Draw' },
              { id: 'shape', icon: Square, label: 'Shape' },
              { id: 'image', icon: ImageIcon, label: 'Image' },
              { id: 'blackout', icon: Eraser, label: 'Black Out (Redact)' }
            ].map(tool => {
              const Icon = tool.icon;
              return (
                <button
                  key={tool.id}
                  onClick={() => {
                    if (tool.id === 'image') {
                      fileInputRef.current?.click();
                    } else {
                      useEditorStore.getState().setActiveTool(tool.id as any);
                    }
                  }}
                  className={`p-2 rounded-lg transition-colors flex items-center gap-2 ${activeTool === tool.id ? 'bg-blue text-white' : 'text-text-4 hover:bg-surface-2'}`}
                  title={tool.label}
                >
                  <Icon className="w-4 h-4" />
                </button>
              );
            })}
          </div>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            accept="image/*" 
            className="hidden" 
          />

          <div className="flex items-center justify-end gap-2 w-full sm:w-auto">
            <button 
              onClick={handleExport}
              disabled={progressState.isProcessing}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-blue text-white rounded-xl text-sm font-bold shadow-sm hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
            >
              <Download className="w-4 h-4" />
              <span>{progressState.isProcessing ? "Exporting..." : "Export"}</span>
            </button>
            <button 
              onClick={onClear}
              className="text-text-4 hover:text-red-500 transition-colors p-2 text-sm font-bold bg-bg rounded-xl border border-border"
              title="Close PDF"
            >
              ✕
            </button>
          </div>
        </div>

        {activeTool === 'blackout' && (
          <div className="bg-orange-500/10 border-b border-orange-500/20 px-4 py-2 text-xs text-orange-600 dark:text-orange-400 font-medium flex items-center justify-center gap-2 z-content relative">
            <span>⚠️</span>
            <span>
              <strong>Note:</strong> "Black Out" visually covers text but <strong>does not guarantee</strong> complete removal of underlying metadata or invisible text streams from the file.
            </span>
          </div>
        )}

        {/* Main Canvas Area */}
        <div className="flex-1 relative overflow-hidden">
          <EditorCanvas 
            pdfDoc={pdfDoc} 
            pageId={currentPageId} 
          />
        </div>
      </div>
    </div>
  );
}
