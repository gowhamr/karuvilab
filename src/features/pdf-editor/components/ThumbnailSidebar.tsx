"use client";
import React, { useEffect, useRef, useState } from "react";
import { Loader2, Trash2, RotateCw } from "lucide-react";
import { useEditorStore, PageState } from "../store";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ThumbnailItemProps {
  pdfDoc: any;
  page: PageState;
  isActive: boolean;
  onClick: () => void;
  scrollContainer?: HTMLElement | null;
}

function ThumbnailItem({ pdfDoc, page, isActive, onClick, scrollContainer }: ThumbnailItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: page.id });
  const updatePage = useEditorStore(s => s.updatePage);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry) setIsVisible(entry.isIntersecting);
    }, { 
      root: scrollContainer || null,
      rootMargin: "300px" 
    }); 

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [scrollContainer]);

  useEffect(() => {
    if (!isVisible) {
       if (canvasRef.current) {
         canvasRef.current.width = 0;
         canvasRef.current.height = 0;
       }
       return; 
    }

    let active = true;
    let renderTask: any = null;
    let pageRef: any = null;

    const render = async () => {
      try {
        setLoading(true);
        pageRef = await pdfDoc.getPage(page.originalIndex);
        if (!active || !canvasRef.current) return;

        const ctx = canvasRef.current.getContext("2d");
        if (!ctx) return;

        const baseRotation = pageRef.rotate || 0;
        const totalRotation = (baseRotation + page.rotation) % 360;

        const viewportUnscaled = pageRef.getViewport({ scale: 1.0, rotation: totalRotation });
        const scale = 120 / viewportUnscaled.width;
        const viewport = pageRef.getViewport({ scale, rotation: totalRotation });

        canvasRef.current.width = viewport.width;
        canvasRef.current.height = viewport.height;

        renderTask = pageRef.render({ canvasContext: ctx, viewport });
        await renderTask.promise;

        if (active) setLoading(false);
      } catch (err: any) {
        if (active && err.name !== "RenderingCancelledException") {
          console.error("Thumbnail render error", err);
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
      if (canvasRef.current) {
        canvasRef.current.width = 0;
        canvasRef.current.height = 0;
      }
    };
  }, [pdfDoc, page.originalIndex, page.rotation, isVisible]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  const handleRotate = (e: React.MouseEvent) => {
    e.stopPropagation();
    updatePage(page.id, { rotation: (page.rotation + 90) % 360 });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    updatePage(page.id, { isDeleted: true });
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className={`relative w-[120px] shrink-0 sm:mb-4 cursor-pointer transition-all border-2 rounded-xl bg-bg group ${isActive ? "border-blue shadow-md" : "border-transparent hover:border-border"} ${isDragging ? "opacity-50" : ""}`}
      onClick={onClick}
    >
      <div 
        {...attributes} 
        {...listeners}
        className="relative bg-white min-h-[140px] flex items-center justify-center border border-border/50 overflow-hidden rounded-t-lg"
      >
        <div ref={containerRef} className="w-full h-full flex items-center justify-center p-2">
          <canvas ref={canvasRef} className="max-w-full max-h-full block shadow-sm" />
          {isVisible && loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-bg/50 backdrop-blur-sm">
              <Loader2 className="w-4 h-4 animate-spin text-blue" />
            </div>
          )}
        </div>
        
        <div className="absolute top-1 right-1 flex flex-col gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity z-content">
          <button onClick={handleRotate} className="p-1.5 bg-surface text-text-2 rounded-md shadow-sm hover:text-blue hover:bg-bg border border-border/50 focus:outline-none focus:ring-2 focus:ring-blue" title="Rotate Clockwise">
            <RotateCw className="w-3.5 h-3.5" />
          </button>
          <button onClick={handleDelete} className="p-1.5 bg-surface text-text-2 rounded-md shadow-sm hover:text-red-500 hover:bg-bg border border-border/50 focus:outline-none focus:ring-2 focus:ring-red-500" title="Delete Page">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <div className={`text-center text-xs font-bold py-1.5 ${isActive ? "text-blue bg-blue/10" : "text-text-4 bg-surface-2"}`}>
        Page {page.originalIndex}
      </div>
    </div>
  );
}

interface ThumbnailSidebarProps {
  pdfDoc: any;
  currentPageId: string;
  onSelectPage: (id: string) => void;
}

export default function ThumbnailSidebar({ pdfDoc, currentPageId, onSelectPage }: ThumbnailSidebarProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollEl, setScrollEl] = useState<HTMLElement | null>(null);
  const pages = useEditorStore(s => s.pages);
  const reorderPages = useEditorStore(s => s.reorderPages);

  const activePages = pages.filter(p => !p.isDeleted);

  useEffect(() => {
    if (scrollRef.current) setScrollEl(scrollRef.current);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      reorderPages(active.id as string, over.id as string);
    }
  };

  return (
    <div className="w-full sm:w-40 h-32 sm:h-full border-b sm:border-b-0 sm:border-r border-border bg-surface-2 flex flex-col sm:flex-col z-sidebar select-none shrink-0">
      <div className="p-2 sm:p-4 border-b border-border bg-bg shadow-sm z-content flex items-center justify-between">
        <h3 className="font-bold text-xs text-text-2 uppercase tracking-wider text-center">Pages</h3>
        <span className="text-[10px] font-bold text-text-4 bg-surface px-1.5 py-0.5 rounded-md">{activePages.length}</span>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-x-auto sm:overflow-x-hidden overflow-y-hidden sm:overflow-y-auto p-2 sm:p-4 custom-scrollbar flex flex-row sm:flex-col items-center gap-4 sm:gap-0">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={activePages.map(p => p.id)} strategy={verticalListSortingStrategy}>
            {activePages.map((page) => (
              <ThumbnailItem 
                key={page.id}
                pdfDoc={pdfDoc}
                page={page}
                isActive={currentPageId === page.id}
                onClick={() => onSelectPage(page.id)}
                scrollContainer={scrollEl}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
