"use client";

import React, { useState, useEffect } from 'react';
import { listAllModels } from '@/src/ai/registry';
import { modelManager, StorageMetrics } from '@/src/ai/model-manager';
import { ModelStatusBadge } from './ModelStatusBadge';
import { HardDrive, Trash2, RefreshCw, X, ShieldCheck, Download } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useToast } from '@/components/ui/Toast';

export interface ModelManagerDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ModelManagerDialog({ isOpen, onClose }: ModelManagerDialogProps) {
  const [metrics, setMetrics] = useState<StorageMetrics>({ totalModels: 0, totalModelsCount: 0, totalSizeMB: 0, cachedModels: [] });
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<{ [id: string]: number }>({});
  const { toast } = useToast();

  const refreshMetrics = async () => {
    try {
      const data = await modelManager.getStorageMetrics();
      setMetrics(data);
    } catch {
      // Ignored
    }
  };

  useEffect(() => {
    if (isOpen) {
      refreshMetrics();
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const models = listAllModels();

  const handleDelete = async (id: string, name: string) => {
    try {
      await modelManager.deleteModel(id);
      await refreshMetrics();
      toast(`Deleted "${name}" from offline cache`, 'info');
    } catch (err: any) {
      toast(err.message || 'Failed to delete model', 'error');
    }
  };

  const handleClearAll = async () => {
    try {
      await modelManager.clearAll();
      await refreshMetrics();
      toast('Cleared all cached AI models from local storage', 'info');
    } catch (err: any) {
      toast(err.message || 'Failed to clear models', 'error');
    }
  };

  const handleDownload = async (model: any) => {
    try {
      setDownloadingId(model.id);
      setDownloadProgress((prev) => ({ ...prev, [model.id]: 0 }));
      
      await modelManager.ensureModelAvailable(
        model,
        (p) => {
          setDownloadProgress((prev) => ({ ...prev, [model.id]: p.percent }));
        },
        undefined
      );
      
      await refreshMetrics();
      toast(`"${model.name}" downloaded & ready offline!`, 'success');
    } catch (err: any) {
      toast(err.message || `Failed to download ${model.name}`, 'error');
    } finally {
      setDownloadingId(null);
      setDownloadProgress((prev) => {
        const next = { ...prev };
        delete next[model.id];
        return next;
      });
    }
  };

  return (
    <div className="fixed inset-0 z-modal bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        role="dialog"
        aria-modal="true"
        aria-label="AI Model Manager"
        className="bg-surface border border-border rounded-3xl w-full max-w-xl p-6 space-y-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/60 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue/10 border border-blue/20 flex items-center justify-center text-blue">
              <HardDrive className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-text">AI Model Manager</h3>
              <p className="text-xs text-text-muted">Manage in-browser neural network models & IndexedDB storage</p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close AI Model Manager"
            className="p-1.5 hover:bg-surface-elevated rounded-xl text-text-muted hover:text-text transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Storage Summary */}
        <div className="flex items-center justify-between p-4 bg-surface-elevated/50 border border-border/60 rounded-2xl">
          <div>
            <div className="text-xs text-text-muted font-semibold">Total Model Storage Used</div>
            <div className="text-xl font-black text-blue">{metrics.totalSizeMB} MB</div>
          </div>

          {metrics.cachedModels.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-3 py-1.5 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All Models</span>
            </button>
          )}
        </div>

        {/* Models List */}
        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {models.map((model) => {
            const isCached = metrics.cachedModels.some((m) => m.id === model.id);
            const isDownloading = downloadingId === model.id;
            const progress = downloadProgress[model.id] ?? 0;

            return (
              <div
                key={model.id}
                className="flex items-center justify-between p-3.5 bg-surface/80 border border-border/60 rounded-2xl"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-text">{model.name}</span>
                    <span className="text-[10px] font-mono text-text-muted">v{model.version}</span>
                  </div>
                  <div className="text-tiny font-mono text-text-muted">{model.description}</div>
                </div>

                <div className="flex items-center gap-2">
                  <ModelStatusBadge isCached={isCached} sizeMB={model.sizeMB} />
                  {isCached ? (
                    <button
                      onClick={() => handleDelete(model.id, model.name)}
                      className="p-1.5 hover:bg-red-500/10 hover:text-red-500 rounded-lg text-text-muted transition-colors cursor-pointer"
                      title="Delete cached model"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleDownload(model)}
                      disabled={isDownloading}
                      className={cn(
                        "px-2 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer",
                        isDownloading
                          ? "text-blue bg-blue/10"
                          : "hover:bg-blue/10 hover:text-blue text-text-muted border border-border/60"
                      )}
                      title="Download and cache model for offline use"
                    >
                      {isDownloading ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>{progress > 0 ? `${progress}%` : 'Downloading...'}</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5" />
                          <span>Cache</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border/60 pt-4 text-tiny font-mono text-text-muted">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>SHA-256 Verified • 100% Client-Side Storage</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-blue hover:bg-blue-hover text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
