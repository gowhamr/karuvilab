"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import { useFileViewerStore } from '@/src/store/useFileViewerStore';
import { FileText, Files, ShieldCheck, Database } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { ToolSkeleton } from '@/components/ui/ToolSkeleton';
import { useFocusModeIntegration } from '@/src/contexts/FocusModeControlsContext';

const ViewEditTab = dynamic(() => import('./ViewEditTab').then(mod => mod.ViewEditTab), {
  loading: () => <ToolSkeleton />,
  ssr: false
});

const CompareTab = dynamic(() => import('./CompareTab').then(mod => mod.CompareTab), {
  loading: () => <ToolSkeleton />,
  ssr: false
});

const TABS = [
  { id: 'view', label: 'Editor', icon: FileText, component: ViewEditTab },
  { id: 'compare', label: 'Compare', icon: Files, component: CompareTab },
];

export default function FileViewerDiffClient() {
  const activeTab = useFileViewerStore(state => state.activeTab);
  const setActiveTab = useFileViewerStore(state => state.setActiveTab);
  const fileA = useFileViewerStore(state => state.fileA);
  const fileB = useFileViewerStore(state => state.fileB);
  
  const settings = useFileViewerStore(state => state.settings);
  const updateSettings = useFileViewerStore(state => state.updateSettings);

  const fontSize = settings.fontSize;
  const setFontSize = (size: number) => updateSettings({ fontSize: size });
  const onWrapToggle = () => updateSettings({ wordWrap: !settings.wordWrap });

  const lineCount = Math.max(
    fileA?.content?.split('\n').length || 0,
    fileB?.content?.split('\n').length || 0
  );

  const ActiveComponent = TABS.find(t => t.id === activeTab)?.component || ViewEditTab;

  useFocusModeIntegration({
    lineCount,
    language: activeTab === 'compare' ? 'diff' : fileA?.language || 'text',
    onFontSizeChange: setFontSize,
    onWrapToggle: onWrapToggle
  });

  return (
    <div className="w-full">
      <div className="space-y-10 w-full">
      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-surface border border-border rounded-3xl w-fit mx-auto shadow-sm">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl text-xs font-bold uppercase tracking-widest transition-all duration-300",
                activeTab === tab.id
                  ? "bg-blue text-white shadow-md shadow-blue/10 scale-102 sm:scale-105"
                  : "text-text-4 hover:text-text-2 hover:bg-bg/50"
              )}
            >
              <Icon className={cn("w-4 h-4", activeTab === tab.id ? "animate-pulse" : "")} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="min-h-full animate-in fade-in slide-in-from-bottom-4 duration-700">
        <ActiveComponent />
      </div>

      {/* Privacy Note */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 p-8 bg-bg/50 border border-border/50 rounded-5xl">
        <div className="flex items-center gap-3">
           <ShieldCheck className="w-5 h-5 text-success" />
           <p className="text-xs font-bold text-text-3 uppercase tracking-widest">Client-Side Processing</p>
        </div>
        <div className="hidden sm:block w-px h-4 bg-border" />
        <div className="flex items-center gap-3">
           <Database className="w-5 h-5 text-blue" />
           <p className="text-xs font-bold text-text-3 uppercase tracking-widest">No Cloud Storage</p>
        </div>
      </div>
      </div>
    </div>
  );
}
