"use client";

import React from 'react';
import { useImageCompressStore } from '../store';
import { DropZone } from '@/components/ui/DropZone';
import { AdvancedSettings } from './AdvancedSettings';
import { ComparisonView } from './ComparisonView';
import { Loader2, AlertCircle, RefreshCw, Zap } from 'lucide-react';

export const SingleMode: React.FC = () => {
  const state = useImageCompressStore();
  const { items, addFiles, compressItem } = state;
  const activeItem = items && items.length > 0 ? items[0] : undefined;

  const handleFiles = (files: File[] | FileList) => {
    try {
      const fileArray = files instanceof FileList ? Array.from(files) : files;
      if (addFiles) addFiles(fileArray);
    } catch (err) {
      console.error("Failed to add files:", err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Primary Display Area */}
      <div className="lg:col-span-8 space-y-6">
        {!activeItem ? (
          <DropZone
            onFilesSelected={handleFiles}
            accept="image/*"
            title="Choose Image"
            description="Drag and drop or click to upload. JPEG, PNG, WebP, AVIF."
            maxSize={50 * 1024 * 1024}
            className="aspect-[4/3] sm:aspect-video"
          />
        ) : (
          <div className="space-y-6">
            <ComparisonView item={activeItem} />
            
            {activeItem.status === 'error' && (
              <div className="p-6 bg-red-500/5 border border-red-500/10 rounded-[32px] flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 shrink-0">
                  <AlertCircle size={24} />
                </div>
                <div>
                  <h4 className="text-sm font-black uppercase tracking-widest text-red-600 mb-1">Compression Failed</h4>
                  <p className="text-[11px] font-bold text-red-500/80 uppercase leading-relaxed">{activeItem.error}</p>
                </div>
                <button 
                  onClick={() => compressItem(activeItem.id)}
                  className="ml-auto p-3 bg-red-500 text-white rounded-xl hover:scale-105 active:scale-95 transition-all"
                >
                  <RefreshCw size={18} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Settings Panel */}
      <div className="lg:col-span-4 space-y-6">
        <div className="sticky top-6 space-y-6">
          <div className="p-6 bg-surface border border-border rounded-[32px] space-y-6">
            <div className="space-y-2">
              <h3 className="text-sm font-black uppercase tracking-widest">Settings</h3>
              <p className="text-[10px] font-bold text-text-4 uppercase tracking-widest">Adjust output quality and format</p>
            </div>
            
            <AdvancedSettings itemId={activeItem ? activeItem.id : undefined} />

            <button
              onClick={() => activeItem && compressItem(activeItem.id)}
              disabled={!activeItem || activeItem.status === 'processing'}
              className="w-full py-4 bg-blue text-white font-black uppercase tracking-widest rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-blue/20 disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
            >
              {activeItem?.status === 'processing' ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Processing...
                </>
              ) : (
                <>
                  <Zap size={18} />
                  Compress Now
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
