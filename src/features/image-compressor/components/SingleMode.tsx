"use client";

import React, { useState } from 'react';
import { useImageCompressStore } from '../store';
import { EmptyState } from '@/components/ui/EmptyState';
import { AdvancedSettings } from './AdvancedSettings';
import { ComparisonView } from './ComparisonView';
import { Loader2, AlertCircle, RefreshCw, Zap, Image as ImageIcon } from 'lucide-react';

export const SingleMode: React.FC = () => {
  const items = useImageCompressStore(state => state.items);
  const addFiles = useImageCompressStore(state => state.addFiles);
  const compressItem = useImageCompressStore(state => state.compressItem);
  const [dragState, setDragState] = useState<'idle' | 'hover' | 'over' | 'rejected'>('idle');

  const activeItem = React.useMemo(() => 
    items && items.length > 0 ? items[0] : undefined
  , [items]);

  const handleFiles = React.useCallback((files: File[]) => {
    try {
      if (addFiles) addFiles(files);
      setDragState('idle');
    } catch (err) {
      console.error("Failed to add files:", err);
      setDragState('rejected');
    }
  }, [addFiles]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Primary Display Area */}
      <div className="lg:col-span-8 space-y-6">
        {!activeItem ? (
          <EmptyState
            toolId="imageCompressor"
            icon={ImageIcon}
            headline="Drop images here"
            toolType="file"
            onDrop={handleFiles}
            dragState={dragState}
            onDragOver={() => setDragState('over')}
            onDragLeave={() => setDragState('idle')}
            formats={['PNG', 'JPG', 'WebP', 'AVIF']}
            maxSize="50MB"
            outcomeText="Result: Download optimized images"
            sampleCTA={{ label: "Try Sample Image" }}
          />
        ) : (
          <div className="space-y-6">
            <ComparisonView item={activeItem} />
            
            {activeItem.status === 'error' && (
              <div className="p-6 bg-red-500/5 border border-red-500/10 rounded-4xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 shrink-0">
                  <AlertCircle size={24} />
                </div>
                <div>
                  <h4 className="text-sm font-black uppercase tracking-widest text-red-600 mb-1">Compression Failed</h4>
                  <p className="text-xs font-bold text-red-500/80 uppercase leading-relaxed">{activeItem.error}</p>
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
          <div className="p-6 bg-surface border border-border rounded-4xl space-y-6">
            <div className="space-y-2">
              <h3 className="text-sm font-black uppercase tracking-widest">Settings</h3>
              <p className="text-xs font-bold text-text-3 uppercase tracking-widest">Adjust output quality and format</p>
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
