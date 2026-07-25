"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { DropZone } from "@/components/ui/DropZone";
import { PrivacyBadge } from "@/components/system/PrivacyBadge";
import { PdfPagePreview } from "@/components/ui/PdfPagePreview";
import { useObjectUrlManager } from "@/src/lib/hooks";
import { workerManager } from "@/src/workers/manager";
import { formatError } from "@/src/lib/formatError";
import { useProgress } from "@/src/contexts/ProgressContext";
import { m } from "framer-motion";
import { File, RotateCw, Trash2, CheckCircle2 } from "lucide-react";
import { cn } from "@/src/lib/utils";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export type AdvancedMode = 'organize' | 'reorder' | 'move' | 'rotate' | 'delete-blank';

interface PageItem {
  id: string;
  originalIndex: number;
  rotation: number;
  isDeleted: boolean;
}

interface PdfOrganizerProps {
  mode: AdvancedMode;
  toolId: string;
  title: string;
  description: string;
  actionLabel: string;
}

function SortablePageItem({
  page,
  file,
  mode,
  onRotate,
  onDelete,
  onToggleSelect,
  isSelected
}: {
  page: PageItem;
  file: File;
  mode: AdvancedMode;
  onRotate: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleSelect: (id: string) => void;
  isSelected: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ 
    id: page.id,
    disabled: mode === 'rotate' || mode === 'delete-blank'
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  if (page.isDeleted && mode === 'delete-blank') return null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative aspect-[1/1.4] rounded-xl border-2 overflow-hidden transition-all select-none group",
        isDragging ? "opacity-50 scale-105 shadow-xl border-blue" : "border-border bg-surface-2 hover:border-blue/30",
        isSelected && mode === 'rotate' ? "border-blue bg-blue/5" : ""
      )}
      {...attributes}
      {...listeners}
      onClick={() => mode === 'rotate' && onToggleSelect(page.id)}
    >
      <div className="absolute inset-0 pointer-events-none p-2 flex flex-col z-above">
        <div className="flex justify-between items-start">
          <span className="text-[10px] font-black px-2 py-0.5 rounded-full backdrop-blur-md bg-surface-2/80 text-text-4 shadow-sm">
            {page.originalIndex}
          </span>
          {isSelected && mode === 'rotate' && (
            <div className="bg-blue text-white rounded-full p-0.5 shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          )}
        </div>
      </div>
      
      <div className="w-full h-full flex items-center justify-center opacity-90 overflow-hidden relative">
        <div style={{ transform: `rotate(${page.rotation}deg)`, transition: 'transform 0.3s' }}>
          <PdfPagePreview file={file} pageIndex={page.originalIndex} width={150} />
        </div>
      </div>
      
      {/* Overlay Actions */}
      {(mode === 'organize' || mode === 'reorder' || mode === 'move') && !isDragging && (
        <div className="absolute inset-0 bg-surface/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-sidebar">
          <button 
            onPointerDown={(e) => { e.stopPropagation(); onRotate(page.id); }}
            className="p-2 bg-surface rounded-full shadow-md hover:text-blue hover:scale-110 transition-transform pointer-events-auto"
          >
            <RotateCw className="w-4 h-4" />
          </button>
          <button 
            onPointerDown={(e) => { e.stopPropagation(); onDelete(page.id); }}
            className="p-2 bg-surface rounded-full shadow-md hover:text-red-500 hover:scale-110 transition-transform pointer-events-auto"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

export function PdfOrganizer({ mode, toolId, title, description, actionLabel }: PdfOrganizerProps) {
  const { createUrl } = useObjectUrlManager();
  const [file, setFile] = useState<File | null>(null);
  const [fileBuffer, setFileBuffer] = useState<ArrayBuffer | null>(null);
  const [pages, setPages] = useState<PageItem[]>([]);
  const [selectedPages, setSelectedPages] = useState<Set<string>>(new Set());
  
  const { state: progressState, startProcessing, setStage, setProgress, finishProcessing } = useProgress();
  const [error, setError] = useState("");
  const abortControllerRef = useRef<AbortController | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleFiles = async (files: FileList | File[]) => {
    const f = files[0];
    if (!f) return;
    setFile(f);
    setError("");
    setPages([]);
    setSelectedPages(new Set());
    
    try {
      const buffer = await f.arrayBuffer();
      setFileBuffer(buffer);
      const count = await workerManager.getPdfPageCount(buffer);
      
      const newPages = Array.from({ length: count }).map((_, i) => ({
        id: `page-${i + 1}`,
        originalIndex: i + 1,
        rotation: 0,
        isDeleted: false
      }));
      
      setPages(newPages);

      if (mode === 'delete-blank') {
        detectBlankPages(buffer, newPages);
      }
    } catch (e) {
      setError("Failed to read PDF file.");
    }
  };

  const detectBlankPages = async (buffer: ArrayBuffer, initialPages: PageItem[]) => {
    startProcessing("heavy");
    setStage("Detecting blank pages...");
    setProgress(0);
    try {
      const pdfjsLib = await import("pdfjs-dist");
      const doc = await pdfjsLib.getDocument({ data: buffer }).promise;
      
      let deletedCount = 0;
      const updatedPages = [...initialPages];

      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const text = await page.getTextContent();
        
        // Blank heuristic: no text items
        if (text.items.length === 0) {
          // Render to small canvas to check for graphics
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d', { willReadFrequently: true });
          if (ctx) {
            const viewport = page.getViewport({ scale: 0.1 });
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            await page.render({ canvasContext: ctx, viewport } as any).promise;
            
            const imgData = ctx.getImageData(0,0, canvas.width, canvas.height)?.data;
            if (imgData) {
              let isBlank = true;
              for (let j=0; j<imgData.length; j+=4) {
                if (imgData[j]! < 250 || imgData[j+1]! < 250 || imgData[j+2]! < 250) {
                  isBlank = false; break;
                }
              }
              if (isBlank && updatedPages[i-1]) {
                updatedPages[i-1]!.isDeleted = true;
                deletedCount++;
              }
            }
          }
        }
        setProgress(Math.round((i / doc.numPages) * 100));
      }
      
      setPages(updatedPages);
      if (deletedCount === 0) setError("No blank pages found.");
      else setError(`Successfully detected and removed ${deletedCount} blank pages. Click Export to download.`);
      
    } catch (e) {
      console.error(e);
      setError("Failed to detect blank pages. You can manually delete them instead.");
    } finally {
      finishProcessing(true);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setPages((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const rotatePage = (id: string) => {
    setPages(pages.map(p => p.id === id ? { ...p, rotation: (p.rotation + 90) % 360 } : p));
  };

  const deletePage = (id: string) => {
    setPages(pages.filter(p => p.id !== id));
  };

  const toggleSelect = (id: string) => {
    setSelectedPages(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const rotateSelected = () => {
    setPages(pages.map(p => selectedPages.has(p.id) ? { ...p, rotation: (p.rotation + 90) % 360 } : p));
  };

  const processPdf = async () => {
    if (!fileBuffer || !file) return;

    const finalPages = pages.filter(p => !p.isDeleted);
    if (finalPages.length === 0) {
      setError("Cannot create an empty PDF.");
      return;
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;
    startProcessing("heavy");
    setStage("Processing PDF...");
    setProgress(0);

    try {
      const pagesState = finalPages.map(p => ({
        originalIndex: p.originalIndex,
        rotation: p.rotation
      }));

      const outBytes = await workerManager.exportPdfEditor(
        fileBuffer,
        pagesState,
        [],
        (p) => {
          setStage(p.message || "Processing...");
          setProgress(p.percent);
        },
        controller.signal
      );

      const blob = new Blob([outBytes as any], { type: "application/pdf" });
      const url = createUrl(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${file.name.replace(/\.pdf$/i, "")}-${mode}.pdf`;
      a.click();

    } catch (e: any) {
      if (e.message !== "Task cancelled") {
        setError(formatError(e));
      }
    } finally {
      finishProcessing(true);
      abortControllerRef.current = null;
    }
  };

  return (
    <div className="space-y-8">
      <PrivacyBadge message="Local processing – No files uploaded to servers" />

      {!file ? (
        <DropZone
          onFilesSelected={handleFiles}
          accept=".pdf,application/pdf"
          multiple={false}
          title={title}
          description={description}
          icon={<div className="text-4xl">🗂️</div>}
        />
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-surface border border-border p-4 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue/10 text-blue flex items-center justify-center rounded-xl">
                <File className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-sm text-text truncate max-w-[200px] md:max-w-md">{file.name}</p>
                <p className="text-xs text-text-4 font-bold tracking-wider uppercase">{pages.filter(p => !p.isDeleted).length} pages</p>
              </div>
            </div>
            <button 
              onClick={() => { setFile(null); setFileBuffer(null); setPages([]); setSelectedPages(new Set()); setError(""); }}
              disabled={progressState.isProcessing}
              className="text-xs font-bold uppercase tracking-widest text-text-4 hover:text-red-500 transition-colors disabled:opacity-50"
            >
              Change File
            </button>
          </div>

          <div className="bg-surface border border-border p-6 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-lg tracking-tight text-text">
                  {mode === 'rotate' ? "Select Pages to Rotate" : "Organize Pages"}
                </h3>
                <p className="text-xs font-medium text-text-4 mt-1">
                  {mode === 'rotate' ? "Click pages to select, then rotate them together." : "Drag and drop to reorder. Hover for more actions."}
                </p>
              </div>
              {mode === 'rotate' && (
                <div className="flex gap-2">
                  <button onClick={rotateSelected} disabled={selectedPages.size === 0} className="text-xs font-bold uppercase text-white bg-blue px-4 py-2 rounded-lg hover:scale-105 transition-all disabled:opacity-50 flex items-center gap-2">
                    <RotateCw className="w-3 h-3" /> Rotate Selected
                  </button>
                  <button onClick={() => setSelectedPages(new Set())} className="text-xs font-bold uppercase text-text-4 bg-bg border border-border px-3 py-2 rounded-lg hover:bg-surface-2 transition-colors">Clear</button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-[60vh] overflow-y-auto p-2">
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={pages.map(p => p.id)} strategy={rectSortingStrategy}>
                  {pages.map((page) => (
                    <SortablePageItem 
                      key={page.id} 
                      page={page} 
                      file={file} 
                      mode={mode}
                      onRotate={rotatePage}
                      onDelete={deletePage}
                      onToggleSelect={toggleSelect}
                      isSelected={selectedPages.has(page.id)}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            </div>
          </div>

          {error && (
            <div className={cn("p-4 border rounded-2xl text-xs font-bold uppercase tracking-wider text-center", error.includes("Successfully") ? "bg-green-500/10 border-green-500/20 text-green-500" : "bg-red-500/10 border-red-500/20 text-red-500")}>
              {error}
            </div>
          )}

          <div className="flex gap-4">
            {!progressState.isProcessing ? (
              <button
                onClick={processPdf}
                className="flex-1 py-4 bg-blue text-white font-black rounded-xl hover:scale-101 active:scale-98 transition-all shadow-lg shadow-blue/20"
              >
                {actionLabel}
              </button>
            ) : (
              <button
                onClick={() => abortControllerRef.current?.abort()}
                className="flex-1 py-4 bg-red-500/10 text-red-500 border border-red-500/20 font-black rounded-xl hover:bg-red-500/20 transition-all uppercase tracking-widest text-sm"
              >
                Cancel Processing
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
