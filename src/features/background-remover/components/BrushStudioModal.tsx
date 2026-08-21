"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { BrushStudioEngine } from "../brush-engine";
import { BrushSettings, BrushMode } from "../types";
import { 
  Eraser, Paintbrush, Undo, Redo, ZoomIn, ZoomOut, 
  RotateCcw, X, Check, Eye
} from "lucide-react";
import { cn } from "@/src/lib/utils";

export interface BrushStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  cutoutCanvas: HTMLCanvasElement | ImageBitmap | OffscreenCanvas;
  originalImage: HTMLImageElement | ImageBitmap;
  onApply: (modifiedBlob: Blob) => void;
}

export function BrushStudioModal({
  isOpen,
  onClose,
  cutoutCanvas,
  originalImage,
  onApply
}: BrushStudioModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<BrushStudioEngine | null>(null);
  const isPaintingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  const [brushSettings, setBrushSettings] = useState<BrushSettings>({
    mode: 'eraser',
    size: 25,
    hardness: 80,
    opacity: 1.0
  });

  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [zoom, setZoom] = useState(1.0);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);
  const [showOriginalOverlay, setShowOriginalOverlay] = useState(false);

  const width = cutoutCanvas instanceof HTMLCanvasElement ? cutoutCanvas.width : cutoutCanvas.width;
  const height = cutoutCanvas instanceof HTMLCanvasElement ? cutoutCanvas.height : cutoutCanvas.height;

  // Initialize Canvas & Brush Engine
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;

    const canvas = canvasRef.current;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(cutoutCanvas, 0, 0);
      const engine = new BrushStudioEngine(canvas, originalImage);
      engineRef.current = engine;
      setCanUndo(engine.canUndo());
      setCanRedo(engine.canRedo());
    }
  }, [isOpen, cutoutCanvas, originalImage, width, height]);

  const updateHistoryState = useCallback(() => {
    if (engineRef.current) {
      setCanUndo(engineRef.current.canUndo());
      setCanRedo(engineRef.current.canRedo());
    }
  }, []);

  const handleUndo = useCallback(() => {
    if (engineRef.current && engineRef.current.undo()) {
      updateHistoryState();
    }
  }, [updateHistoryState]);

  const handleRedo = useCallback(() => {
    if (engineRef.current && engineRef.current.redo()) {
      updateHistoryState();
    }
  }, [updateHistoryState]);

  // Keyboard Shortcuts (Ctrl+Z, Ctrl+Y, [, ])
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
      } else if (e.key === '[') {
        setBrushSettings(s => ({ ...s, size: Math.max(5, s.size - 5) }));
      } else if (e.key === ']') {
        setBrushSettings(s => ({ ...s, size: Math.min(100, s.size + 5) }));
      } else if (e.key === 'e' || e.key === 'E') {
        setBrushSettings(s => ({ ...s, mode: 'eraser' }));
      } else if (e.key === 'r' || e.key === 'R') {
        setBrushSettings(s => ({ ...s, mode: 'restore' }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleUndo, handleRedo]);

  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isPaintingRef.current = true;
    const pt = getCanvasCoordinates(e);
    lastPointRef.current = pt;

    if (engineRef.current) {
      engineRef.current.paintStamp(pt.x, pt.y, brushSettings.mode, brushSettings.size, brushSettings.hardness, brushSettings.opacity);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pt = getCanvasCoordinates(e);
    setCursorPos({ x: e.clientX, y: e.clientY });

    if (!isPaintingRef.current || !lastPointRef.current || !engineRef.current) return;

    engineRef.current.paintStroke(lastPointRef.current, pt, brushSettings);
    lastPointRef.current = pt;
  };

  const handleMouseUp = () => {
    if (isPaintingRef.current && engineRef.current) {
      engineRef.current.saveHistoryState();
      updateHistoryState();
    }
    isPaintingRef.current = false;
    lastPointRef.current = null;
  };

  const handleApply = async () => {
    if (!engineRef.current) return;
    const blob = await engineRef.current.toBlob('png');
    onApply(blob);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-modal bg-black/80 backdrop-blur-md flex flex-col items-center justify-between p-4 select-none">
      {/* Header Bar */}
      <div className="w-full max-w-5xl bg-surface/90 border border-border rounded-2xl p-3.5 flex items-center justify-between shadow-2xl backdrop-blur-lg">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 p-1 bg-surface-elevated rounded-xl border border-border">
            <button
              type="button"
              onClick={() => setBrushSettings(s => ({ ...s, mode: 'eraser' }))}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                brushSettings.mode === 'eraser' ? "bg-red-500 text-white shadow-sm" : "text-text-muted hover:text-text"
              )}
            >
              <Eraser className="w-3.5 h-3.5" />
              <span>Eraser (E)</span>
            </button>
            <button
              type="button"
              onClick={() => setBrushSettings(s => ({ ...s, mode: 'restore' }))}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                brushSettings.mode === 'restore' ? "bg-blue text-white shadow-sm" : "text-text-muted hover:text-text"
              )}
            >
              <Paintbrush className="w-3.5 h-3.5" />
              <span>Restore (R)</span>
            </button>
          </div>

          <div className="h-6 w-[1px] bg-border mx-1" />

          {/* Undo / Redo */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleUndo}
              disabled={!canUndo}
              className="p-2 rounded-lg border border-border text-text-muted hover:text-text disabled:opacity-40 transition-colors cursor-pointer"
              title="Undo (Ctrl+Z)"
            >
              <Undo className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleRedo}
              disabled={!canRedo}
              className="p-2 rounded-lg border border-border text-text-muted hover:text-text disabled:opacity-40 transition-colors cursor-pointer"
              title="Redo (Ctrl+Y)"
            >
              <Redo className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Zoom & View Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onMouseDown={() => setShowOriginalOverlay(true)}
            onMouseUp={() => setShowOriginalOverlay(false)}
            onMouseLeave={() => setShowOriginalOverlay(false)}
            className="px-2.5 py-1.5 rounded-lg border border-border text-xs font-bold text-text-muted hover:text-text flex items-center gap-1 cursor-pointer"
            title="Hold to peek at original image"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Peek Original</span>
          </button>

          <div className="flex items-center gap-1 bg-surface-elevated p-1 rounded-xl border border-border">
            <button
              type="button"
              onClick={() => setZoom(z => Math.max(0.5, z - 0.25))}
              className="p-1.5 rounded-lg text-text-muted hover:text-text transition-colors cursor-pointer"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono font-bold text-text px-1.5">{Math.round(zoom * 100)}%</span>
            <button
              type="button"
              onClick={() => setZoom(z => Math.min(3.0, z + 0.25))}
              className="p-1.5 rounded-lg text-text-muted hover:text-text transition-colors cursor-pointer"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setZoom(1.0)}
              className="p-1.5 rounded-lg text-text-muted hover:text-text transition-colors cursor-pointer"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-6 w-[1px] bg-border mx-1" />

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-text-muted hover:text-text transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Canvas Work Area */}
      <div 
        className="relative flex-1 w-full max-w-5xl my-3 rounded-3xl border border-border overflow-auto flex items-center justify-center p-4 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] bg-surface"
      >
        <div 
          className="relative transition-transform duration-150 ease-out origin-center"
          style={{ transform: `scale(${zoom})` }}
        >
          {showOriginalOverlay && originalImage && (
            <img 
              src={originalImage instanceof HTMLImageElement ? originalImage.src : ''}
              alt="Original peek"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none opacity-50 z-content"
            />
          )}

          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="max-h-[65vh] object-contain rounded-xl shadow-2xl cursor-crosshair"
          />
        </div>
      </div>

      {/* Footer Controls Bar */}
      <div className="w-full max-w-5xl bg-surface/90 border border-border rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl backdrop-blur-lg">
        {/* Brush Sliders */}
        <div className="flex flex-wrap items-center gap-6 w-full sm:w-auto">
          <div className="space-y-1 min-w-[120px]">
            <div className="flex justify-between text-[11px] font-bold text-text-muted uppercase">
              <span>Size ([ / ])</span>
              <span className="font-mono text-blue">{brushSettings.size}px</span>
            </div>
            <input
              type="range"
              min="5"
              max="100"
              value={brushSettings.size}
              onChange={(e) => setBrushSettings(s => ({ ...s, size: Number(e.target.value) }))}
              className="w-full cursor-pointer accent-blue h-1.5 bg-border rounded-lg"
            />
          </div>

          <div className="space-y-1 min-w-[120px]">
            <div className="flex justify-between text-[11px] font-bold text-text-muted uppercase">
              <span>Hardness</span>
              <span className="font-mono text-blue">{brushSettings.hardness}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={brushSettings.hardness}
              onChange={(e) => setBrushSettings(s => ({ ...s, hardness: Number(e.target.value) }))}
              className="w-full cursor-pointer accent-blue h-1.5 bg-border rounded-lg"
            />
          </div>

          <div className="space-y-1 min-w-[120px]">
            <div className="flex justify-between text-[11px] font-bold text-text-muted uppercase">
              <span>Opacity</span>
              <span className="font-mono text-blue">{Math.round(brushSettings.opacity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={brushSettings.opacity}
              onChange={(e) => setBrushSettings(s => ({ ...s, opacity: Number(e.target.value) }))}
              className="w-full cursor-pointer accent-blue h-1.5 bg-border rounded-lg"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-border text-xs font-bold text-text-muted hover:text-text transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="px-5 py-2 rounded-xl bg-blue hover:bg-blue-hover text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Apply Touch-ups</span>
          </button>
        </div>
      </div>
    </div>
  );
}
