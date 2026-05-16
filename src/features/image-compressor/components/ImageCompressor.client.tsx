"use client";

import React from 'react';
import { useImageCompressStore } from '../hooks/useImageCompressStore';
import { SingleTab } from './SingleTab';
import { BatchTab } from './BatchTab';
import { WorkflowSuggestions } from '@/components/ui/WorkflowSuggestions';
import { useWorkflowIntegration } from '@/src/lib/workflow-hook';
import { ImageIcon, Layers, ShieldCheck, Zap } from 'lucide-react';

const toolId = 'image-compress';

export default function ImageCompressorClient() {
  const { activeTab, setActiveTab, clearFiles } = useImageCompressStore();
  
  useWorkflowIntegration(toolId);

  React.useEffect(() => {
    return () => {
      clearFiles();
    };
  }, [clearFiles]);

  return (
    <div className="space-y-12 pb-20">
      <div className="space-y-8">
        <div className="flex justify-center">
          <div className="flex flex-col sm:inline-flex sm:flex-row p-1 bg-surface border border-border rounded-2xl w-full sm:w-auto">
            <button
              onClick={() => {
                clearFiles();
                setActiveTab('single');
              }}
              className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === 'single' ? 'bg-blue text-white shadow-lg shadow-blue/20' : 'text-text-4 hover:text-text-2'
              }`}
            >
              <ImageIcon size={16} />
              Single Image
            </button>
            <button
              onClick={() => {
                clearFiles();
                setActiveTab('batch');
              }}
              className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === 'batch' ? 'bg-blue text-white shadow-lg shadow-blue/20' : 'text-text-4 hover:text-text-2'
              }`}
            >
              <Layers size={16} />
              Batch Processing
            </button>
          </div>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === 'single' ? <SingleTab /> : <BatchTab />}
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Privacy First", desc: "No images are uploaded. Everything stays on your device.", icon: <ShieldCheck className="text-blue" /> },
          { title: "Fast Engine", desc: "Uses Web Workers & OffscreenCanvas for peak performance.", icon: <Zap className="text-blue" /> },
          { title: "Modern Formats", desc: "Supports next-gen formats like WebP and AVIF.", icon: <ImageIcon className="text-blue" /> },
        ].map((f, i) => (
          <div key={i} className="p-6 sm:p-8 bg-surface border border-border rounded-[24px] sm:rounded-[32px] space-y-4 hover:border-blue/30 transition-colors group">
            <div className="w-12 h-12 rounded-2xl bg-blue/5 flex items-center justify-center group-hover:scale-110 transition-transform">
              {f.icon}
            </div>
            <div>
              <h4 className="text-sm font-black uppercase tracking-widest mb-1">{f.title}</h4>
              <p className="text-[11px] font-bold text-text-4 uppercase leading-relaxed">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <WorkflowSuggestions />
    </div>
  );
}
