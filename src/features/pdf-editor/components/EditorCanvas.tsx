"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { getDeviceTier } from "../utils/device";
import AnnotationLayer from "./AnnotationLayer";
import { useEditorStore } from "../store";

interface EditorCanvasProps {
  pdfDoc: any;
  pageId: string;
  onPrevPage?: () => void;
  onNextPage?: () => void;
}

export default function EditorCanvas({ pdfDoc, pageId, onPrevPage, onNextPage }: EditorCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const pageState = useEditorStore(s => s.pages.find(p => p.id === pageId));
  const zoom = useEditorStore(s => s.zoom);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
        const state = useEditorStore.getState();
        const delta = e.deltaY * -0.01;
        state.setZoom(Math.min(Math.max(state.zoom + delta, 0.5), 3.0));
      }
    };
    
    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
    }
    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel);
      }
    };
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (!file) return;
      
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            useEditorStore.getState().addAnnotation({
              id: crypto.randomUUID(),
              type: 'image',
              pageIndex: pageState!.originalIndex,
              x: 10,
              y: 10,
              width: 20,
              height: 20,
              dataUrl: event.target.result as string,
            });
          }
        };
        reader.readAsDataURL(file);
      }
    }
  }, [pageState]);

  useEffect(() => {
    let active = true;
    let renderTask: any = null;
    let pageRef: any = null;
    const canvas = canvasRef.current;

    const render = async () => {
      if (!pageState) return;
      
      try {
        setLoading(true);
        pageRef = await pdfDoc.getPage(pageState.originalIndex);
        if (!active || !canvas || !containerRef.current) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const rawWidth = containerRef.current.clientWidth;
        
        const tier = getDeviceTier();
        let dprCap = tier === "low" ? 1.5 : (tier === "standard" ? 2.0 : window.devicePixelRatio || 1);
        
        // On mobile (containerWidth < 600), use DPR cap of 1.5
        if (rawWidth < 600) {
          dprCap = Math.min(dprCap, 1.5);
        }
        
        const actualDpr = Math.min(window.devicePixelRatio || 1, dprCap);

        // Remove fixed 40px padding subtraction, use a percentage instead
        const containerWidth = rawWidth * 0.95; 
        
        const baseRotation = pageRef.rotate || 0;
        const totalRotation = (baseRotation + pageState.rotation) % 360;

        const unscaledViewport = pageRef.getViewport({ scale: 1.0, rotation: totalRotation });
        let scale = containerWidth / unscaledViewport.width;
        if (scale > 2) scale = 2; 
        
        const viewport = pageRef.getViewport({ scale: scale * actualDpr, rotation: totalRotation });

        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.style.width = `${viewport.width / actualDpr}px`;
        canvas.style.height = `${viewport.height / actualDpr}px`;

        renderTask = pageRef.render({ canvasContext: ctx, viewport });
        await renderTask.promise;

        if (active) setLoading(false);
      } catch (err: any) {
        if (active && err.name !== "RenderingCancelledException") {
          // No console.log in production code as per instructions
        }
      }
    };

    render();

    return () => {
      active = false;
      if (renderTask) {
        try { renderTask.cancel(); } catch (e) {}
      }
      if (pageRef) {
        try { pageRef.cleanup(); } catch (e) {}
      }
      if (canvas) {
        canvas.width = 0;
        canvas.height = 0;
      }
    };
  }, [pdfDoc, pageState]);



  if (!pageState) return null;

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full flex flex-col items-center py-10 overflow-auto custom-scrollbar"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}>
        <div className="relative shadow-xl bg-white border border-border">
          <canvas ref={canvasRef} className="block" />
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-bg/20 backdrop-blur-sm z-modal">
              <Loader2 className="w-10 h-10 animate-spin text-blue" />
            </div>
          )}
          {!loading && <AnnotationLayer pageIndex={pageState.originalIndex} />}
        </div>
      </div>
    </div>
  );
}
