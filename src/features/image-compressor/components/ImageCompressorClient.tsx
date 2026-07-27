"use client";

import React from 'react';
import { useImageCompressStore } from '../store';
import { SingleMode } from './SingleMode';
import { BatchMode } from './BatchMode';
import { WorkflowSuggestions } from '@/components/ui/WorkflowSuggestions';
import { Image as ImageIcon, Layers, Settings2, ShieldCheck, Zap, AlertTriangle } from 'lucide-react';
import { useBatchStore } from '@/src/store/useBatchStore';
import { SegmentedControl } from '@/components/ui/SegmentedControl';

const toolId = 'image-compress';
const EMPTY_ARRAY: any[] = [];

export default function ImageCompressorClient() {
  const ui = useImageCompressStore(state => state.ui);
  const setActiveTab = useImageCompressStore(state => state.setActiveTab);
  const setUIMode = useImageCompressStore(state => state.setUIMode);
  const clearFiles = useImageCompressStore(state => state.clearFiles);
  const addFiles = useImageCompressStore(state => state.addFiles);
  const localItems = useImageCompressStore(state => state.items);

  const batchItems = useBatchStore(state => state.items[toolId] || EMPTY_ARRAY);
  const clearBatchItems = useBatchStore(state => state.clearItems);
  
  const syncRef = React.useRef<string[]>([]);

  // Sync items from global workflow/batch store to local image store
  React.useEffect(() => {
    if (batchItems.length > 0) {
      const newFiles = batchItems
        .filter(bi => !syncRef.current.includes(bi.id))
        .map(bi => bi.file);
      
      if (newFiles.length > 0) {
        // Track by IDs from batch store to prevent re-syncing the same items
        syncRef.current = Array.from(new Set([...syncRef.current, ...batchItems.map(bi => bi.id)]));
        addFiles(newFiles);
      }
    }
  }, [batchItems, addFiles]);

  React.useEffect(() => {
    return () => {
      if (clearFiles) clearFiles();
      if (clearBatchItems) clearBatchItems(toolId);
    };
  }, [clearFiles, clearBatchItems]);

  return (
    <div className="space-y-12 pb-20">
      <div className="space-y-8">
        {/* Navigation & Mode Toggle */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <SegmentedControl
            activeId={ui.activeTab}
            onChange={(id) => setActiveTab(id as 'single' | 'batch')}
            options={[
              { id: 'single', label: 'Single', icon: <ImageIcon size={14} /> },
              { id: 'batch', label: 'Batch', icon: <Layers size={14} /> },
            ]}
          />

          <SegmentedControl
            activeId={ui.mode}
            onChange={(id) => setUIMode(id as 'simple' | 'advanced')}
            options={[
              { id: 'simple', label: 'Simple' },
              { id: 'advanced', label: 'Advanced', icon: <Settings2 size={14} /> },
            ]}
          />
        </div>

        {/* Core Experience */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {ui.activeTab === 'single' ? <SingleMode /> : <BatchMode />}
        </div>
      </div>

      {/* Trust & Features */}
      <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-border bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
        {[
          { title: "Privacy First", desc: "No images are uploaded. All processing stays local.", icon: <ShieldCheck className="w-5 h-5 text-blue" /> },
          { title: "Fast Engine", desc: "Worker-powered compression for peak performance.", icon: <Zap className="w-5 h-5 text-blue" /> },
          { title: "Universal", desc: "Supports JPEG, PNG, WebP, and next-gen AVIF.", icon: <ImageIcon className="w-5 h-5 text-blue" /> },
        ].map((f, i) => (
          <div key={i} className="flex-1 p-5 flex items-start gap-4 hover:bg-blue/5 transition-colors group">
            <div className="w-10 h-10 rounded-xl bg-blue/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              {f.icon}
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-wide mb-1">{f.title}</h3>
              <p className="text-xs text-text-3 leading-relaxed">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <WorkflowSuggestions />
    </div>
  );
}
