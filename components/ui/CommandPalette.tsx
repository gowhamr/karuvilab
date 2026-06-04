"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ALL_TOOLS, ToolEntry, CATEGORIES } from "@/src/tool-registry";
import { ToolIcon } from "@/components/ui/Icons";
import { useSearchStore } from "@/src/store/useSearchStore";
import { Search, Command, X, ArrowDown, ArrowUp, CornerDownLeft, Sparkles } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { m, AnimatePresence, useReducedMotion, MotionConfig } from "framer-motion";
import { cn } from "@/src/lib/utils";

const KBD_BADGE_CLASS = "flex items-center justify-center min-w-[1.4rem] h-5 px-1.5 rounded border border-border bg-surface-2 text-[10px] font-black text-text-4 shadow-sm";

export function CommandPalette() {
  const shouldReduceMotion = useReducedMotion();
  const isPaletteOpen = useSearchStore(state => state.isPaletteOpen);
  const setIsPaletteOpen = useSearchStore(state => state.setIsPaletteOpen);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const listboxId = "command-palette-listbox";

  // Keyboard shortcut: Cmd+K
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsPaletteOpen(!isPaletteOpen);
        setQuery("");
        setSelectedIndex(0);
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [isPaletteOpen, setIsPaletteOpen]);

  // Reset query on close
  useEffect(() => {
    if (!isPaletteOpen) {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isPaletteOpen]);

  // Search Logic with grouping
  const results = useMemo(() => {
    let tools = ALL_TOOLS;
    if (!query.trim()) {
      tools = ALL_TOOLS.filter((t: ToolEntry) => t.popular).slice(0, 6);
    } else {
      const q = query.toLowerCase();
      tools = ALL_TOOLS.filter((t: ToolEntry) => {
        const category = CATEGORIES.find(c => c.id === t.category);
        return t.name.toLowerCase().includes(q) ||
          t.desc.toLowerCase().includes(q) ||
          t.keywords.some((k: string) => k.toLowerCase().includes(q)) ||
          (category && category.label.toLowerCase().includes(q));
      }).slice(0, 10);
    }

    // Grouping
    const groups: Record<string, ToolEntry[]> = {};
    tools.forEach(t => {
      const cat = t.category || 'other';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(t);
    });

    return {
      flat: tools,
      grouped: groups
    };
  }, [query]);

  const handleSelect = useCallback((tool: ToolEntry) => {
    setIsPaletteOpen(false);
    router.push(`/${tool.href}`);
  }, [setIsPaletteOpen, router]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, results.flat.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.flat.length) % Math.max(1, results.flat.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results.flat[selectedIndex]) handleSelect(results.flat[selectedIndex]);
    }
  };

  useEffect(() => {
    const activeItem = scrollRef.current?.querySelector(`[aria-selected="true"]`);
    if (activeItem) {
      activeItem.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  return (
    <Dialog.Root open={isPaletteOpen} onOpenChange={setIsPaletteOpen}>
      <Dialog.Portal>
        <MotionConfig transition={{ type: "spring", stiffness: 300, damping: 30 }}>
          <AnimatePresence>
            {isPaletteOpen && (
              <>
                <Dialog.Overlay asChild>
                  <m.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="fixed inset-0 z-[200] bg-surface/80 backdrop-blur-xl" 
                  />
                </Dialog.Overlay>
                <Dialog.Content asChild>
                  <m.div 
                    onKeyDown={handleKeyDown}
                    initial={{ opacity: 0, scale: 0.96, y: 8, x: "-50%" }}
                    animate={{ opacity: 1, scale: 1, y: 0, x: "-50%" }}
                    exit={{ opacity: 0, scale: 0.98, y: 4, x: "-50%" }}
                    className="fixed left-1/2 top-[15%] z-[201] w-full max-w-xl bg-surface border border-border shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] rounded-2xl overflow-hidden outline-none flex flex-col"
                  >
                    <Dialog.Title className="sr-only">Command Palette</Dialog.Title>
                    
                    {/* Search Field */}
                    <div className="flex items-center px-6 bg-bg/30 border-b border-border">
                      <Search className="w-5 h-5 text-text-4" aria-hidden="true" />
                      <input
                        autoFocus
                        ref={inputRef}
                        type="text"
                        placeholder="Search for a tool or command..."
                        role="combobox"
                        aria-label="Search tools"
                        aria-autocomplete="list"
                        aria-expanded={isPaletteOpen}
                        aria-haspopup="listbox"
                        aria-controls={listboxId}
                        className="w-full px-4 py-6 bg-transparent outline-none text-[18px] text-text font-medium placeholder:text-text-4"
                        value={query}
                        onChange={(e) => {
                          setQuery(e.target.value);
                          setSelectedIndex(0);
                        }}
                      />
                      <div className="flex items-center gap-2">
                        <kbd className={KBD_BADGE_CLASS}>Esc</kbd>
                      </div>
                    </div>

                    {/* Results Area */}
                    <div 
                      id={listboxId}
                      role="listbox"
                      aria-label="Search results"
                      ref={scrollRef} 
                      className="max-h-[60vh] overflow-y-auto custom-scrollbar-thin p-2"
                    >
                      {results.flat.length === 0 ? (
                        <m.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex flex-col items-center justify-center py-12 px-6 text-center space-y-3"
                        >
                          <div className="w-12 h-12 bg-surface-2 rounded-2xl flex items-center justify-center shadow-inner">
                            <Search className="w-6 h-6 text-text-4 opacity-30" />
                          </div>
                          <div>
                            <p className="font-black text-sm text-text">No commands found</p>
                            <p className="text-[11px] text-text-4 font-medium uppercase tracking-widest mt-1">Try a different search term</p>
                          </div>
                        </m.div>
                      ) : (
                        Object.entries(results.grouped).map(([categoryId, tools]) => (
                          <div key={categoryId} role="group" className="mb-2 last:mb-0">
                            <div className="px-4 py-2 text-[10px] font-black text-text-4 uppercase tracking-[0.2em] select-none">
                              {CATEGORIES.find(c => c.id === categoryId)?.label || categoryId}
                            </div>
                            <div className="space-y-0.5">
                              {tools.map((tool) => {
                                const flatIndex = results.flat.findIndex(t => t.id === tool.id);
                                const isSelected = flatIndex === selectedIndex;
                                return (
                                  <button
                                    key={tool.id}
                                    id={`option-${tool.id}`}
                                    role="option"
                                    aria-selected={isSelected}
                                    onMouseEnter={() => setSelectedIndex(flatIndex)}
                                    onClick={() => handleSelect(tool)}
                                    className={cn(
                                      "w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all text-left outline-none relative group",
                                      isSelected 
                                        ? "bg-surface-2 shadow-sm border-l-[3px] border-blue rounded-l-sm" 
                                        : "hover:bg-surface-2/50"
                                    )}
                                  >
                                    <div className={cn(
                                      "w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 border transition-all duration-200",
                                      isSelected ? "bg-blue/10 border-blue/20" : "bg-bg border-border"
                                    )}>
                                      <ToolIcon toolId={tool.id} category={tool.category} className={cn("w-5 h-5", isSelected ? "text-blue" : "text-text-2")} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className={cn("font-bold text-sm transition-colors", isSelected ? "text-blue" : "text-text")}>
                                        {tool.name}
                                      </div>
                                      <div className={cn("text-[11px] truncate font-medium", isSelected ? "text-text-2" : "text-text-4")}>
                                        {tool.desc}
                                      </div>
                                    </div>
                                    {isSelected && (
                                      <m.div 
                                        initial={{ opacity: 0, x: -4 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="flex items-center gap-2 text-blue"
                                      >
                                        <span className="text-[10px] font-black uppercase tracking-widest">Execute</span>
                                        <CornerDownLeft className="w-4 h-4" />
                                      </m.div>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Footer Legend */}
                    <div className="px-6 py-4 bg-bg/30 border-t border-border flex items-center justify-between text-[10px] font-black uppercase tracking-[0.15em] text-text-4 select-none">
                      <div className="flex items-center gap-6">
                        <span className="flex items-center gap-2">
                          <div className="flex gap-1">
                            <kbd className={KBD_BADGE_CLASS}><ArrowUp className="w-2.5 h-2.5" /></kbd>
                            <kbd className={KBD_BADGE_CLASS}><ArrowDown className="w-2.5 h-2.5" /></kbd>
                          </div>
                          Navigate
                        </span>
                        <span className="flex items-center gap-2">
                          <kbd className={KBD_BADGE_CLASS}>↵</kbd>
                          Select
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-blue">
                         <Sparkles className="w-3 h-3" />
                         <span>Elite Toolkit</span>
                      </div>
                    </div>
                  </m.div>
                </Dialog.Content>
              </>
            )}
          </AnimatePresence>
        </MotionConfig>
      </Dialog.Portal>
      
      <style jsx global>{`
        .custom-scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar-thin::-webkit-scrollbar-thumb {
          background: var(--kv-border);
          border-radius: 4px;
        }
      `}</style>
    </Dialog.Root>
  );
}
