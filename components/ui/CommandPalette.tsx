"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { ALL_TOOLS, ToolEntry } from "@/src/tool-registry";
import { ToolIcon } from "@/components/ui/Icons";
import { useSearchStore } from "@/src/store/useSearchStore";
import { Search, Command, X, ArrowDown, ArrowUp, CornerDownLeft } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { usePerformanceSettings } from "@/src/lib/hooks";
import { m, AnimatePresence, useReducedMotion } from "framer-motion";

export function CommandPalette() {
  const shouldReduceMotion = useReducedMotion();
  const isPaletteOpen = useSearchStore(state => state.isPaletteOpen);  const setIsPaletteOpen = useSearchStore(state => state.setIsPaletteOpen);
  const { shouldBlur } = usePerformanceSettings();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const listboxId = "command-palette-listbox";

  // Keyboard shortcut: Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsPaletteOpen(!isPaletteOpen);
        setQuery("");
        setSelectedIndex(0);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPaletteOpen, setIsPaletteOpen]);

  // Reset query on close
  useEffect(() => {
    if (!isPaletteOpen) {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isPaletteOpen]);

  // Search Logic
  const filteredTools = useMemo(() => {
    if (!query.trim()) return ALL_TOOLS.filter((t: ToolEntry) => t.popular).slice(0, 6);
    const q = query.toLowerCase();
    return ALL_TOOLS.filter((t: ToolEntry) => 
      t.name.toLowerCase().includes(q) ||
      t.desc.toLowerCase().includes(q) ||
      t.keywords.some((k: string) => k.toLowerCase().includes(q))
    ).slice(0, 8);
  }, [query]);

  const handleSelect = (tool: ToolEntry) => {
    setIsPaletteOpen(false);
    router.push(`/${tool.href}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredTools.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredTools.length) % filteredTools.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredTools[selectedIndex]) handleSelect(filteredTools[selectedIndex]);
    }
  };

  useEffect(() => {
    const selectedEl = scrollRef.current?.children[selectedIndex + 1] as HTMLElement;
    if (selectedEl) selectedEl.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  return (
    <Dialog.Root open={isPaletteOpen} onOpenChange={setIsPaletteOpen}>
      <Dialog.Portal>
        <AnimatePresence>
          {isPaletteOpen && (
            <>
              <Dialog.Overlay asChild>
                <m.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[200] bg-bg/80" 
                  style={{ backdropFilter: shouldBlur ? 'blur(12px)' : 'none' }}
                />
              </Dialog.Overlay>
              <Dialog.Content asChild>
                <m.div 
                  onKeyDown={handleKeyDown}
                  initial={{ opacity: 0, scale: 0.95, y: -20, x: "-50%" }}
                  animate={{ opacity: 1, scale: 1, y: 0, x: "-50%" }}
                  exit={{ opacity: 0, scale: 0.95, y: -20, x: "-50%" }}
                  transition={{ 
                    type: shouldReduceMotion ? "tween" : "spring", 
                    duration: shouldReduceMotion ? 0 : 0.4,
                    damping: 25, 
                    stiffness: 400 
                  }}
                  className="fixed left-1/2 top-[15%] z-[201] w-full max-w-xl bg-surface border border-border shadow-2xl rounded-2xl overflow-hidden outline-none"
                >
          <div className="flex items-center px-6 border-b border-border bg-bg/50">
            <Search className="w-5 h-5 text-text-4" aria-hidden="true" />
            <input
              autoFocus
              ref={inputRef}
              type="text"
              placeholder="Jump to a tool..."
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={isPaletteOpen}
              aria-haspopup="listbox"
              aria-controls={listboxId}
              aria-activedescendant={filteredTools.length > 0 ? `option-${filteredTools[selectedIndex]?.id}` : undefined}
              className="w-full px-4 py-5 bg-transparent outline-none text-lg text-text font-bold placeholder:text-text-4"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
            />
            <Dialog.Close 
              aria-label="Close palette"
              className="p-2 hover:bg-bg rounded-lg text-text-4 transition-colors focus-visible:ring-2 focus-visible:ring-blue/20 outline-none"
            >
              <X className="w-4 h-4" />
            </Dialog.Close>
          </div>

          <div 
            id={listboxId}
            role="listbox"
            aria-label="Suggested tools"
            ref={scrollRef} 
            className="max-h-[50vh] overflow-y-auto p-2 space-y-1"
          >
            <div className="px-3 py-2 text-[9px] font-black text-text-4 uppercase tracking-[0.2em]" aria-hidden="true">
              {!query.trim() ? "Most Popular" : "Search Results"}
            </div>
            
            {filteredTools.length === 0 ? (
              <div className="px-3 py-8 text-center text-text-4 text-xs font-bold" role="status">
                No tools found.
              </div>
            ) : (
              filteredTools.map((tool: ToolEntry, i: number) => (
                <button
                  key={tool.id}
                  id={`option-${tool.id}`}
                  role="option"
                  aria-selected={i === selectedIndex}
                  onMouseEnter={() => setSelectedIndex(i)}
                  onClick={() => handleSelect(tool)}
                  className={`
                    w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all text-left group outline-none
                    ${i === selectedIndex ? "bg-blue text-white shadow-lg shadow-blue/20" : "hover:bg-bg"}
                  `}
                >
                  <div className={`
                    w-9 h-9 rounded-lg flex items-center justify-center text-xl flex-shrink-0 border transition-colors
                    ${i === selectedIndex ? "bg-white/20 border-white/10" : "bg-bg border-border"}
                  `} aria-hidden="true">
                    <ToolIcon toolId={tool.id} category={tool.category} className={`w-4 h-4 ${i === selectedIndex ? "text-white" : "text-text-2"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold truncate text-sm">{tool.name}</div>
                    <div className={`text-[10px] truncate font-medium ${i === selectedIndex ? "text-indigo-100" : "text-text-4"}`}>
                      {tool.desc}
                    </div>
                  </div>
                  {i === selectedIndex && (
                    <CornerDownLeft className="w-3.5 h-3.5 opacity-60" aria-hidden="true" />
                  )}
                </button>
              ))
            )}
          </div>

          <div className="px-6 py-3 bg-bg/50 border-t border-border flex items-center justify-between text-[9px] font-black uppercase tracking-[0.15em] text-text-4">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5"><ArrowUp className="w-2.5 h-2.5" /><ArrowDown className="w-2.5 h-2.5" /> Move</span>
              <span className="px-1.5 py-0.5 bg-surface border border-border rounded">Enter</span>
            </div>
            <div className="flex items-center gap-1.5">
               <Command className="w-2.5 h-2.5" />
               <span>Professional Suite</span>
            </div>
          </div>
            </m.div>
          </Dialog.Content>
            </>
          )}
        </AnimatePresence>
    </Dialog.Portal>
  </Dialog.Root>
  );
}
