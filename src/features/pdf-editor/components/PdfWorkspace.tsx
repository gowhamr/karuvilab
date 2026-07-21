"use client";
import { useEffect, useState, useRef } from "react";
import { Loader2, MousePointer2, Type, PenTool, Square, Image as ImageIcon, Eraser, Download } from "lucide-react";
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
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  
  const initPages = useEditorStore(s => s.initPages);
  const pages = useEditorStore(s => s.pages);
  const activePages = pages.filter(p => !p.isDeleted);
  
  const displayIndex = activePages.findIndex(p => p.id === currentPageId) + 1;
  const numActivePages = activePages.length;

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
        
        if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
          const initWorkerSrc = () => {
            try { return '/pdf.worker.min.mjs'; }
            catch { return 'https://unpkg.com/pdfjs-dist@5.7.284/build/pdf.worker.min.mjs'; }
          };
          pdfjsLib.GlobalWorkerOptions.workerSrc = initWorkerSrc();
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
      <div className="p-8 text-center bg-red-500/10 rounded-2xl border border-red-500/20">
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
    <div className="flex h-[calc(100vh-140px)] min-h-[600px] border border-border rounded-4xl overflow-hidden bg-bg shadow-sm">
      <ThumbnailSidebar 
        pdfDoc={pdfDoc}
        currentPageId={currentPageId} 
        onSelectPage={setCurrentPageId}
      />
      
      <div className="flex-1 bg-surface-2 relative flex flex-col">
        {/* Top toolbar */}
        <div className="h-14 border-b border-border bg-surface flex items-center justify-between px-4 z-content relative">
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-text-2 truncate max-w-[200px] sm:max-w-[300px]">{file.name}</span>
            <span className="px-2 py-1 bg-bg border border-border rounded-md text-xs font-bold text-text-4 uppercase tracking-widest">
              Page {displayIndex} / {numActivePages}
            </span>
          </div>
          
          <div className="flex items-center gap-2 bg-bg p-1 rounded-xl border border-border">
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
                  className={`p-2 rounded-lg transition-colors flex items-center gap-2 ${useEditorStore((s) => s.activeTool) === tool.id ? 'bg-blue text-white' : 'text-text-4 hover:bg-surface-2'}`}
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

          <div className="flex items-center gap-2">
            <button 
              onClick={handleExport}
              disabled={progressState.isProcessing}
              className="flex items-center gap-2 px-4 py-2 bg-blue text-white rounded-xl text-sm font-bold shadow-sm hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
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

        {useEditorStore((s) => s.activeTool) === 'blackout' && (
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
