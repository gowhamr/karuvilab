"use client";

import React from 'react';
import { useFileViewerStore } from '@/src/store/useFileViewerStore';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ViewEditTab } from './ViewEditTab';
import { CompareTab } from './CompareTab';
import { FileText, Files, ShieldCheck, Database } from 'lucide-react';
import { cn } from '@/src/lib/utils';

const cat = CATEGORIES.find(c => c.id === "developer")!;

const TABS = [
  { id: 'view', label: 'View / Edit', icon: FileText, component: ViewEditTab },
  { id: 'compare', label: 'Compare Files', icon: Files, component: CompareTab },
];

export default function FileViewerDiffClient() {
  const { activeTab, setActiveTab } = useFileViewerStore();

  const ActiveComponent = TABS.find(t => t.id === activeTab)?.component || ViewEditTab;

  return (
    <ToolShell
      title="File Viewer & Diff"
      description="Professional text editor and comparison tool. View, edit, and compare code or text files locally. 100% private, zero uploads."
      category={cat}
      toolId="file-viewer-diff"
    >
      <div className="space-y-10">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 p-1.5 bg-surface border border-border rounded-[28px] w-fit mx-auto shadow-sm">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex items-center gap-2.5 px-6 py-3 rounded-[22px] text-xs font-black uppercase tracking-widest transition-all duration-300",
                  activeTab === tab.id
                    ? "bg-blue text-white shadow-lg shadow-blue/20 scale-105"
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
        <div className="min-h-[500px] animate-in fade-in slide-in-from-bottom-4 duration-700">
          <ActiveComponent />
        </div>

        {/* Privacy Note */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 p-8 bg-bg/50 border border-border/50 rounded-[40px]">
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
    </ToolShell>
  );
}
