"use client";

import React from 'react';
import { useImageCompressStore } from '../store';
import { SingleMode } from './SingleMode';
import { BatchMode } from './BatchMode';
import { WorkflowSuggestions } from '@/components/ui/WorkflowSuggestions';
import { useWorkflowIntegration } from '@/src/lib/workflow-hook';
import { Image as ImageIcon, Layers, Settings2, ShieldCheck, Zap, AlertTriangle } from 'lucide-react';

const toolId = 'image-compress';

export default function ImageCompressorClient() {
  try {
    const state = useImageCompressStore();
    if (!state) throw new Error("Store unavailable");

    const { ui, setActiveTab, setUIMode, clearFiles } = state;
    
    try {
      useWorkflowIntegration(toolId);
    } catch (e) {
      console.error("Workflow error:", e);
    }

    React.useEffect(() => {
      return () => {
        if (clearFiles) clearFiles();
      };
    }, [clearFiles]);

    return (
      <div className="space-y-12 pb-20">
        <div className="space-y-8">
          {/* Navigation & Mode Toggle */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex p-1 bg-surface border border-border rounded-2xl">
              <button
                onClick={() => setActiveTab('single')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  ui.activeTab === 'single' ? 'bg-blue text-white shadow-lg shadow-blue/20' : 'text-text-4 hover:text-text-2'
                }`}
              >
                <ImageIcon size={16} />
                Single
              </button>
              <button
                onClick={() => setActiveTab('batch')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  ui.activeTab === 'batch' ? 'bg-blue text-white shadow-lg shadow-blue/20' : 'text-text-4 hover:text-text-2'
                }`}
              >
                <Layers size={16} />
                Batch
              </button>
            </div>

            <button
              onClick={() => setUIMode(ui.mode === 'simple' ? 'advanced' : 'simple')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                ui.mode === 'advanced' 
                  ? 'bg-blue/5 border-blue/20 text-blue' 
                  : 'bg-surface border-border text-text-4 hover:border-blue/30'
              }`}
            >
              <Settings2 size={14} />
              {ui.mode === 'advanced' ? 'Advanced Options' : 'Simple Mode'}
            </button>
          </div>

          {/* Core Experience */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {ui.activeTab === 'single' ? <SingleMode /> : <BatchMode />}
          </div>
        </div>

        {/* Trust & Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Privacy First", desc: "No images are uploaded. All processing stays local.", icon: <ShieldCheck className="text-blue" /> },
            { title: "Fast Engine", desc: "Worker-powered compression for peak performance.", icon: <Zap className="text-blue" /> },
            { title: "Universal", desc: "Supports JPEG, PNG, WebP, and next-gen AVIF.", icon: <ImageIcon className="text-blue" /> },
          ].map((f, i) => (
            <div key={i} className="p-8 bg-surface border border-border rounded-[32px] space-y-4 hover:border-blue/30 transition-colors group">
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
  } catch (err: any) {
    console.error("[ImageCompressor] Initialization crash:", err);
    return (
      <div className="p-8 bg-red-500/5 border border-red-500/10 rounded-[32px] text-center space-y-4">
        <AlertTriangle className="mx-auto text-red-500" size={32} />
        <h3 className="text-lg font-black uppercase tracking-tight">Initialization Error</h3>
        <p className="text-sm text-text-3 max-w-xs mx-auto">
          Failed to start the compressor engine. Please try clearing your browser cache.
        </p>
        <code className="block p-4 bg-bg border border-border rounded-xl text-[10px] font-mono text-red-500 break-all text-left">
          {err.message || String(err)}
        </code>
      </div>
    );
  }
}
