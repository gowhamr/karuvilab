"use client";
import { blobManager } from "@/src/lib/blob-manager";

import React, { useState, useRef } from "react";
import { BatchItem } from "../types";
import { zip } from "fflate";
import { 
  Layers, Play, X, RefreshCw, Trash2, Download, 
  CheckCircle, AlertCircle, Sparkles, Image as ImageIcon 
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useToast } from "@/components/ui/Toast";
import { useObjectUrlManager } from "@/src/lib/hooks";
import { workerManager } from "@/src/workers/manager";
import { safeImageProcess } from "@/src/features/image-compressor/utils/safe-process";

export interface BatchProcessingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialFiles?: File[];
}

export function BatchProcessingModal({ isOpen, onClose, initialFiles = [] }: BatchProcessingModalProps) {
  const { createUrl, revokeUrl } = useObjectUrlManager();
  const { toast } = useToast();
  const [items, setItems] = useState<BatchItem[]>(() => {
    return initialFiles.map(file => ({
      id: Math.random().toString(36).substring(2, 9),
      file,
      originalUrl: createUrl(file),
      status: 'idle',
      progress: 0
    }));
  });

  const [isProcessingAll, setIsProcessingAll] = useState(false);
  const [selectedEngine, setSelectedEngine] = useState<'canvas' | 'u2netp'>('u2netp');
  const abortRef = useRef(false);

  if (!isOpen) return null;

  const handleAddFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files).filter(f => f.type.startsWith('image/'));
    const newItems: BatchItem[] = files.map(file => ({
      id: Math.random().toString(36).substring(2, 9),
      file,
      originalUrl: createUrl(file),
      status: 'idle',
      progress: 0
    }));
    setItems(prev => [...prev, ...newItems]);
  };

  const handleRemoveItem = (id: string) => {
    setItems(prev => {
      const item = prev.find(i => i.id === id);
      if (item) revokeUrl(item.originalUrl);
      return prev.filter(i => i.id !== id);
    });
  };

  const processSingleItem = async (item: BatchItem): Promise<void> => {
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, status: 'processing', progress: 10 } : i));

    try {
      if (selectedEngine === 'canvas') {
        const res = await safeImageProcess(async () => {
          const buffer = await item.file.arrayBuffer();
          const bytes = await workerManager.removeBackground(buffer, '#ffffff', 40);
          return new Blob([bytes as any], { type: 'image/png' });
        }, 'batch-bg-remover');

        if (res.success && res.data) {
          setItems(prev => prev.map(i => i.id === item.id ? {
            ...i,
            status: 'done',
            progress: 100,
            resultTransparentBlob: res.data
          } : i));
        } else {
          throw res.error || new Error('Canvas processing failed');
        }
      } else {
        // U2-NetP AI
        const { ai } = await import('@/src/ai/sdk');
        const { blob, inferenceTimeMs } = await ai.removeBackground(item.file, {
          modelId: 'u2netp-mobile',
          onProgress: (p) => {
            setItems(prev => prev.map(i => i.id === item.id ? {
              ...i,
              progress: Math.round(p.percent)
            } : i));
          }
        });

        setItems(prev => prev.map(i => i.id === item.id ? {
          ...i,
          status: 'done',
          progress: 100,
          resultTransparentBlob: blob,
          inferenceTimeMs
        } : i));
      }
    } catch (err: any) {
      setItems(prev => prev.map(i => i.id === item.id ? {
        ...i,
        status: 'error',
        error: err.message || 'Processing failed'
      } : i));
    }
  };

  const handleStartBatch = async () => {
    setIsProcessingAll(true);
    abortRef.current = false;

    const pending = items.filter(i => i.status !== 'done');
    for (const item of pending) {
      if (abortRef.current) break;
      await processSingleItem(item);
    }

    setIsProcessingAll(false);
    toast('Batch processing complete!', 'success');
  };

  const handleDownloadZip = async () => {
    const completed = items.filter(i => i.status === 'done' && i.resultTransparentBlob);
    if (completed.length === 0) {
      toast('No completed images to download', 'info');
      return;
    }

    try {
      const zipData: Record<string, Uint8Array> = {};

      for (const item of completed) {
        const buffer = await item.resultTransparentBlob!.arrayBuffer();
        const baseName = item.file.name.replace(/\.[^/.]+$/, "");
        zipData[`${baseName}-no-bg.png`] = new Uint8Array(buffer);
      }

      const zipped = await new Promise<Uint8Array>((resolve, reject) => {
        zip(zipData, (err, data) => {
          if (err) reject(err);
          else resolve(data);
        });
      });
      const zipBlob = new Blob([zipped.buffer as ArrayBuffer], { type: 'application/zip' });
      blobManager.download(zipBlob, `karuvilab-batch-bg-removed-${Date.now()}.zip`);
      toast(`Downloaded ${completed.length} images in ZIP archive`, 'success');
    } catch (err: any) {
      toast('Failed to create ZIP file', 'error');
    }
  };

  const completedCount = items.filter(i => i.status === 'done').length;

  return (
    <div className="fixed inset-0 z-modal bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-3xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-border/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue/10 border border-blue/20 flex items-center justify-center text-blue">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-text">Batch Background Removal</h3>
              <p className="text-xs text-text-muted">Process multiple images locally with automated batch queuing</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 hover:bg-surface-elevated rounded-xl text-text-muted hover:text-text transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar Controls */}
        <div className="p-4 bg-surface-elevated/40 border-b border-border/60 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <label className="text-xs font-bold text-text-muted">Engine:</label>
            <select
              value={selectedEngine}
              onChange={(e) => setSelectedEngine(e.target.value as any)}
              disabled={isProcessingAll}
              className="bg-surface border border-border rounded-xl px-3 py-1.5 text-xs font-bold text-text cursor-pointer"
            >
              <option value="u2netp">U²-NetP Mobile AI (4.4 MB • High Accuracy)</option>
              <option value="canvas">Instant Canvas (0 MB • Solid Backgrounds)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="px-3 py-1.5 bg-surface border border-border hover:bg-surface-elevated text-text text-xs font-bold rounded-xl transition-colors cursor-pointer">
              <span>+ Add Images</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleAddFiles}
                className="hidden"
              />
            </label>

            {completedCount > 0 && (
              <button
                type="button"
                onClick={handleDownloadZip}
                className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download ZIP ({completedCount})</span>
              </button>
            )}
          </div>
        </div>

        {/* Batch Queue Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {items.length === 0 ? (
            <div className="h-48 border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center text-text-muted p-4 text-center">
              <ImageIcon className="w-8 h-8 mb-2 opacity-50 text-blue" />
              <p className="text-sm font-bold text-text">No Images in Batch Queue</p>
              <p className="text-xs text-text-muted mt-1">Click &quot;+ Add Images&quot; above to select files for batch background removal.</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="p-3 bg-surface/80 border border-border/70 rounded-2xl flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-xl border border-border overflow-hidden bg-bg/50 shrink-0 flex items-center justify-center">
                    <img src={item.originalUrl} alt={item.file.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <p className="text-xs font-bold text-text truncate max-w-[200px] sm:max-w-xs">{item.file.name}</p>
                    <p className="text-[10px] font-mono text-text-muted">{(item.file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Status indicator */}
                  {item.status === 'idle' && (
                    <span className="text-[11px] font-mono text-text-muted px-2 py-0.5 rounded-md bg-surface-elevated border border-border">Queued</span>
                  )}
                  {item.status === 'processing' && (
                    <div className="flex items-center gap-1.5 text-blue text-xs font-bold">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>{item.progress}%</span>
                    </div>
                  )}
                  {item.status === 'done' && (
                    <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
                      <CheckCircle className="w-4 h-4" />
                      <span className="hidden sm:inline font-mono">{item.inferenceTimeMs ? `${item.inferenceTimeMs}ms` : 'Ready'}</span>
                    </div>
                  )}
                  {item.status === 'error' && (
                    <div className="flex items-center gap-1 text-red-400 text-xs font-bold" title={item.error}>
                      <AlertCircle className="w-4 h-4" />
                      <span className="hidden sm:inline">Failed</span>
                    </div>
                  )}

                  {/* Actions */}
                  {item.status === 'error' && (
                    <button
                      type="button"
                      onClick={() => processSingleItem(item)}
                      className="p-1.5 rounded-lg border border-border text-text-muted hover:text-text"
                      title="Retry"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.id)}
                    disabled={item.status === 'processing'}
                    className="p-1.5 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer disabled:opacity-40"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border/80 flex items-center justify-between bg-surface-elevated/30">
          <span className="text-xs font-mono text-text-muted">
            {completedCount} of {items.length} completed
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-border text-xs font-bold text-text-muted hover:text-text transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleStartBatch}
              disabled={isProcessingAll || items.length === 0}
              className="px-5 py-2 rounded-xl bg-blue hover:bg-blue-hover text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isProcessingAll ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Processing Queue...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Start Batch</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
