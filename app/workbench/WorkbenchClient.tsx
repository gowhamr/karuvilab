"use client";

import { useState, useMemo, useCallback } from "react";
import { ALL_TOOLS, ToolEntry } from "@/src/tool-registry";
import { Plus, X, Columns, Maximize2, Search, AppWindow } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { ToolIcon } from "@/components/ui/Icons";
import { m, AnimatePresence } from "framer-motion";
import { useWorkbenchTouch } from "./useWorkbenchTouch";

interface Tab {
  id: string;
  tool: ToolEntry;
}

export default function WorkbenchClient() {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [splitTabId, setSplitTabId] = useState<string | null>(null);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const activeTab = tabs.find(t => t.id === activeTabId);
  const splitTab = tabs.find(t => t.id === splitTabId);

  const filteredTools = useMemo(() => {
    const query = searchQuery.toLowerCase();
    if (!query) return ALL_TOOLS;
    return ALL_TOOLS.filter(t => 
      t.name.toLowerCase().includes(query) || 
      t.desc.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const addTab = useCallback((tool: ToolEntry) => {
    const newTab: Tab = { id: Date.now().toString(), tool };
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
    setIsPickerOpen(false);
  }, []);

  const removeTab = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTabs(prev => {
      const remaining = prev.filter(t => t.id !== id);
      setActiveTabId(curr => {
        if (curr === id) {
          return remaining.length > 0 ? remaining[remaining.length - 1]?.id ?? null : null;
        }
        return curr;
      });
      return remaining;
    });
    setSplitTabId(curr => curr === id ? null : curr);
  }, []);

  const toggleSplit = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSplitTabId(curr => curr === id ? null : id);
  }, []);

  const { handleTouchStart, handleTouchEnd } = useWorkbenchTouch({
    tabs,
    activeTabId,
    setActiveTabId
  });

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] md:h-screen w-full bg-bg overflow-hidden">
      {/* Top Bar */}
      <div className="h-14 shrink-0 bg-surface border-b border-border flex items-center px-2 gap-2 overflow-x-auto hide-scrollbar">
        <div className="flex items-center gap-1.5 min-w-max pr-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTabId(tab.id)}
              className={cn(
                "group relative h-10 flex items-center gap-2.5 px-3 rounded-xl text-sm font-semibold transition-all select-none outline-none focus-visible:ring-2 focus-visible:ring-blue",
                activeTabId === tab.id 
                  ? "bg-blue/10 text-blue shadow-sm" 
                  : "bg-transparent text-text-4 hover:bg-mat-hover hover:text-text"
              )}
            >
              <ToolIcon category={tab.tool.category} toolId={tab.tool.id} className="w-4 h-4 shrink-0" />
              <span className="truncate max-w-[120px]">{tab.tool.name}</span>
              
              <div className="flex items-center gap-1 shrink-0 ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {tabs.length > 1 && (
                  <div
                    role="button"
                    title={splitTabId === tab.id ? "Close Split" : "Split View"}
                    onClick={(e) => toggleSplit(tab.id, e)}
                    className={cn(
                      "w-6 h-6 rounded-md flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/10",
                      splitTabId === tab.id && "bg-blue/20 text-blue"
                    )}
                  >
                    <Columns className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  role="button"
                  title="Close Tab"
                  onClick={(e) => removeTab(tab.id, e)}
                  className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-red-500/20 hover:text-red-500"
                >
                  <X className="w-3.5 h-3.5" />
                </div>
              </div>
              
              {activeTabId === tab.id && (
                <m.div layoutId="workbench-active" className="absolute bottom-0 left-3 right-3 h-0.5 bg-blue rounded-t-full" />
              )}
            </button>
          ))}

          <button
            onClick={() => setIsPickerOpen(true)}
            className="w-10 h-10 ml-1 flex items-center justify-center rounded-xl border border-dashed border-border text-text-4 hover:border-blue hover:text-blue hover:bg-blue/5 transition-all outline-none focus-visible:ring-2 focus-visible:ring-blue"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Workspace Area */}
      <div 
        className="flex-1 flex overflow-hidden relative bg-bg"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Invisible edge swipe zones for mobile */}
        <div className="absolute top-0 bottom-0 left-0 w-6 z-content md:hidden" />
        <div className="absolute top-0 bottom-0 right-0 w-6 z-content md:hidden" />

        {tabs.length === 0 && !isPickerOpen && (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 opacity-60">
            <div className="w-20 h-20 bg-surface rounded-3xl flex items-center justify-center shadow-sm mb-6">
              <AppWindow className="w-10 h-10 text-text-4" />
            </div>
            <h2 className="text-xl font-black mb-2">Workbench Empty</h2>
            <p className="text-sm font-medium text-text-muted max-w-md">
              Create a custom workspace with multiple tools. Run them side-by-side without losing your data.
            </p>
            <button 
              onClick={() => setIsPickerOpen(true)}
              className="mt-6 px-6 py-3 bg-blue text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Tool
            </button>
          </div>
        )}

        {/* Iframe Viewers */}
        {activeTab && (
          <div className={cn("flex-1 h-full border-r border-border transition-all", splitTab ? "w-1/2 hidden md:block" : "w-full")}>
            <iframe 
              src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}${activeTab.tool.href}?embed=true`} 
              className="w-full h-full border-none"
              title={activeTab.tool.name}
            />
          </div>
        )}
        
        {splitTab && (
          <div className="flex-1 h-full w-full md:w-1/2">
            <iframe 
              src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}${splitTab.tool.href}?embed=true`} 
              className="w-full h-full border-none"
              title={splitTab.tool.name}
            />
          </div>
        )}

        {/* Tool Picker Overlay */}
        <AnimatePresence>
          {isPickerOpen && (
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-surface/80 backdrop-blur-md z-modal flex flex-col p-4 md:p-12"
            >
              <div className="max-w-3xl w-full mx-auto bg-surface border border-border shadow-2xl rounded-3xl flex flex-col max-h-full overflow-hidden">
                <div className="p-4 border-b border-border flex items-center gap-3">
                  <Search className="w-5 h-5 text-text-4 shrink-0" />
                  <input 
                    autoFocus
                    placeholder="Search tools to add..."
                    className="flex-1 bg-transparent outline-none text-lg font-medium"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button 
                    onClick={() => setIsPickerOpen(false)}
                    className="w-8 h-8 rounded-lg hover:bg-mat-hover flex items-center justify-center shrink-0"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 content-start">
                  {filteredTools.map(tool => (
                    <button
                      key={tool.id}
                      onClick={() => addTab(tool)}
                      className="flex items-center gap-3 p-3 text-left rounded-xl hover:bg-mat-hover border border-transparent hover:border-border transition-all"
                    >
                      <div className="w-10 h-10 rounded-lg bg-surface border border-border flex items-center justify-center shrink-0">
                        <ToolIcon category={tool.category} toolId={tool.id} className="w-5 h-5 text-blue" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-sm truncate">{tool.name}</div>
                        <div className="text-xs text-text-4 truncate">{tool.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
