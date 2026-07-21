"use client";
import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { getDeviceTier } from "../utils/device";
import AnnotationLayer from "./AnnotationLayer";
import { useEditorStore } from "../store";

interface EditorCanvasProps {
  pdfDoc: any;
  pageId: string;
}

export default function EditorCanvas({ pdfDoc, pageId }: EditorCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const pageState = useEditorStore(s => s.pages.find(p => p.id === pageId));

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

        const tier = getDeviceTier();
        const dprCap = tier === "low" ? 1.5 : (tier === "standard" ? 2.0 : window.devicePixelRatio || 1);
        const actualDpr = Math.min(window.devicePixelRatio || 1, dprCap);

        const containerWidth = containerRef.current.clientWidth - 40; 
        
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
          console.error("Main canvas render error", err);
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
    <div ref={containerRef} className="w-full h-full flex flex-col items-center py-10 px-5 overflow-auto custom-scrollbar">
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
  );
}
