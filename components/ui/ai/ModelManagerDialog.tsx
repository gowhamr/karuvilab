"use client";

import React, { useState, useEffect } from 'react';
import { listAllModels, AI_MODEL_REGISTRY } from '@/src/ai/registry';
import { modelManager, StorageMetrics } from '@/src/ai/model-manager';
import { ModelStatusBadge } from './ModelStatusBadge';
import { HardDrive, Trash2, RefreshCw, X, ShieldCheck, Download } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export interface ModelManagerDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ModelManagerDialog({ isOpen, onClose }: ModelManagerDialogProps) {
  const [metrics, setMetrics] = useState<StorageMetrics>({ totalModels: 0, totalModelsCount: 0, totalSizeMB: 0, cachedModels: [] });
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

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
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const models = listAllModels();

  const handleDelete = async (id: string) => {
    await modelManager.deleteModel(id);
    await refreshMetrics();
  };

  const handleClearAll = async () => {
    await modelManager.clearAll();
    await refreshMetrics();
  };

  return (
    <div className="fixed inset-0 z-modal bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-3xl w-full max-w-xl p-6 space-y-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
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
            className="p-1.5 hover:bg-surface-elevated rounded-xl text-text-muted hover:text-text transition-colors"
          >
            <X className="w-4 h-4" />
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
              className="px-3 py-1.5 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-bold transition-colors flex items-center gap-1.5"
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
            return (
              <div
                key={model.id}
                className="flex items-center justify-between p-3.5 bg-surface/80 border border-border/60 rounded-2xl"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-text">{model.name}</span>
                    <span className="text-[10px] font-mono text-text-4">v{model.version}</span>
                  </div>
                  <div className="text-tiny font-mono text-text-muted">{model.description}</div>
                </div>

                <div className="flex items-center gap-2">
                  <ModelStatusBadge isCached={isCached} sizeMB={model.sizeMB} />
                  {isCached && (
                    <button
                      onClick={() => handleDelete(model.id)}
                      className="p-1.5 hover:bg-red-500/10 hover:text-red-500 rounded-lg text-text-muted transition-colors"
                      title="Delete cached model"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border/60 pt-4 text-tiny font-mono text-text-4">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>SHA-256 Verified • 100% Client-Side Storage</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-blue hover:bg-blue-hover text-white text-xs font-bold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
