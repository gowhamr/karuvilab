"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { TOOLS, ToolEntry } from "@/src/tool-registry";
import { ToolIcon } from "@/components/ui/Icons";
import { Search, Command, X, ArrowDown, ArrowUp, CornerDownLeft } from "lucide-react";

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. Toggle with Cmd/Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        setQuery("");
        setSelectedIndex(0);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // 2. Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // 3. Search Logic
  const filteredTools = useMemo(() => {
    if (!query.trim()) return TOOLS.filter(t => t.popular).slice(0, 8);
    
    const q = query.toLowerCase();
    return TOOLS.filter(t => 
      t.name.toLowerCase().includes(q) ||
      t.desc.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.keywords.some(k => k.toLowerCase().includes(q))
    ).slice(0, 10);
  }, [query]);

  // 4. Keyboard Navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredTools.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredTools.length) % filteredTools.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredTools[selectedIndex]) {
        handleSelect(filteredTools[selectedIndex]);
      }
    }
  };

  const handleSelect = (tool: ToolEntry) => {
    setIsOpen(false);
    router.push(`/${tool.href}`);
  };

  // 5. Scroll selected into view
  useEffect(() => {
    const selectedEl = scrollRef.current?.children[selectedIndex + 1] as HTMLElement; // +1 for the header
    if (selectedEl) {
      selectedEl.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] px-4 sm:px-6">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-bg/80 backdrop-blur-md animate-in fade-in duration-300"
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Palette */}
      <div className="relative w-full max-w-2xl bg-surface border border-border shadow-2xl rounded-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-top-4 duration-200">
        {/* Search Input */}
        <div className="flex items-center px-6 border-b border-border bg-elevated/50">
          <Search className="w-5 h-5 text-text-4" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search tools, keywords, or categories..."
            className="w-full px-4 py-6 bg-transparent outline-none text-xl text-text font-medium placeholder:text-text-4"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            role="combobox"
            aria-expanded="true"
            aria-controls="command-palette-results"
            aria-haspopup="listbox"
          />
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-bg rounded-lg text-text-4 transition-colors"
              aria-label="Close command palette"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Results */}
        <div 
          ref={scrollRef}
          id="command-palette-results"
          role="listbox"
          className="max-h-[50vh] overflow-y-auto p-3 space-y-1"
        >
          <div className="px-3 py-2 text-[10px] font-black text-text-4 uppercase tracking-[0.2em]">
            {!query.trim() ? "Popular Essentials" : `Search Results (${filteredTools.length})`}
          </div>
          
          {filteredTools.length === 0 ? (
            <div className="px-3 py-12 text-center space-y-2">
              <div className="text-text-4 font-bold">No results found for "{query}"</div>
              <p className="text-xs text-text-4 font-medium">Try searching for generic terms like "PDF" or "Convert".</p>
            </div>
          ) : (
            filteredTools.map((tool, i) => (
              <button
                key={tool.id}
                role="option"
                aria-selected={i === selectedIndex}
                onMouseEnter={() => setSelectedIndex(i)}
                onClick={() => handleSelect(tool)}
                className={`
                  w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all text-left group
                  ${i === selectedIndex ? "bg-blue text-white shadow-lg shadow-blue/20" : "hover:bg-bg"}
                `}
              >
                <div className={`
                  w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0 border transition-colors
                  ${i === selectedIndex ? "bg-white/20 border-white/10" : "bg-elevated border-border"}
                `}>
                  <ToolIcon category={tool.category} className={`w-5 h-5 ${i === selectedIndex ? "text-white" : "text-text-2"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold truncate group-hover:text-current">{tool.name}</div>
                  <div className={`text-xs truncate font-medium ${i === selectedIndex ? "text-white/70" : "text-text-4"}`}>
                    {tool.desc}
                  </div>
                </div>
                {i === selectedIndex && (
                  <div className="flex items-center gap-2 px-2 py-1 bg-white/20 rounded-md text-[10px] font-black uppercase tracking-wider">
                    <span>Jump to</span>
                    <CornerDownLeft className="w-3 h-3" />
                  </div>
                )}
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-elevated/50 border-t border-border flex items-center justify-between text-[10px] font-black uppercase tracking-[0.15em] text-text-4">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <span className="flex items-center gap-1 p-1 bg-surface border border-border rounded">
                <ArrowUp className="w-3 h-3" />
                <ArrowDown className="w-3 h-3" />
              </span> 
              <span>Navigate</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="px-2 py-1 bg-surface border border-border rounded">Enter</span>
              <span>Select</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="px-2 py-1 bg-surface border border-border rounded">Esc</span>
              <span>Close</span>
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-2">
             <Command className="w-3 h-3" />
             <span>Karuvi Intelligence v1.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
