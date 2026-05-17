"use client";

import React from 'react';
import { useImageCompressStore } from '../store';
import { DropZone } from '@/components/ui/DropZone';
import { ImageQueue } from './ImageQueue';
import { AdvancedSettings } from './AdvancedSettings';
import { Loader2, Download, Trash2, Zap, AlertTriangle } from 'lucide-react';
import { getDeviceCapabilities, isLargeBatch } from '@/src/utils';

export const BatchMode: React.FC = () => {
  const { items, addFiles, clearFiles, compressAll, downloadBatch, isProcessing, zipProgress } = useImageCompressStore();

  const handleFiles = (files: File[] | FileList) => {
    const fileArray = files instanceof FileList ? Array.from(files) : files;
    addFiles(fileArray);
  };

  const { isMobile } = getDeviceCapabilities();
  const showLargeBatchWarning = isMobile && isLargeBatch(items.map(i => i.file), 50);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-8 space-y-6">
        <DropZone
          onFilesSelected={handleFiles}
          accept="image/*"
          multiple
          title="Drop Images Here"
          description="Process up to 100 images at once."
          maxSize={25 * 1024 * 1024}
        />

        {showLargeBatchWarning && (
          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center gap-3 text-amber-600">
            <AlertTriangle size={18} />
            <p className="text-[10px] font-bold uppercase tracking-widest">Large batch detected. Mobile devices may throttle processing.</p>
          </div>
        )}

        <ImageQueue />
      </div>

      <div className="lg:col-span-4 space-y-6">
        <div className="sticky top-6 space-y-6">
          <div className="p-6 bg-surface border border-border rounded-[32px] space-y-6">
            <div className="space-y-2">
              <h3 className="text-sm font-black uppercase tracking-widest">Global Settings</h3>
              <p className="text-[10px] font-bold text-text-4 uppercase tracking-widest">Apply to all queued images</p>
            </div>

            <AdvancedSettings />

            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={compressAll}
                disabled={items.length === 0 || isProcessing}
                className="w-full py-4 bg-blue text-white font-black uppercase tracking-widest rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-blue/20 disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
              >
                {isProcessing && zipProgress === 0 ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Processing...
                  </>
                ) : (
                  <>
                    <Zap size={18} />
                    Compress All
                  </>
                )}
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={downloadBatch}
                  disabled={!items.some(i => i.status === 'completed') || isProcessing}
                  className="py-3 bg-surface border border-border text-text-2 font-bold text-[10px] uppercase tracking-widest rounded-xl hover:border-blue hover:text-blue transition-all disabled:opacity-50 flex items-center justify-center gap-2 relative overflow-hidden"
                >
                  {zipProgress > 0 && (
                    <div 
                      className="absolute inset-0 bg-blue/10 transition-all duration-300" 
                      style={{ width: `${zipProgress}%` }}
                    />
                  )}
                  <Download size={14} className="relative z-10" />
                  <span className="relative z-10">{zipProgress > 0 ? `${zipProgress}%` : 'ZIP All'}</span>
                </button>

                <button
                  onClick={clearFiles}
                  disabled={items.length === 0 || isProcessing}
                  className="py-3 bg-surface border border-border text-red-500 font-bold text-[10px] uppercase tracking-widest rounded-xl hover:border-red-500 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Trash2 size={14} />
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
