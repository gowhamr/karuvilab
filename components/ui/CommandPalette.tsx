"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { TOOLS, ToolEntry } from "@/src/tool-registry";

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
    if (!query.trim()) return TOOLS.filter(t => t.popular).slice(0, 8); // Show popular tools by default
    
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
    const selectedEl = scrollRef.current?.children[selectedIndex] as HTMLElement;
    if (selectedEl) {
      selectedEl.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] px-4 sm:px-6">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-bg/80 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={() => setIsOpen(false)}
      />

      {/* Palette */}
      <div className="relative w-full max-w-2xl bg-surface border border-border shadow-2xl rounded-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-top-4 duration-200">
        {/* Search Input */}
        <div className="flex items-center px-4 border-b border-border">
          <svg className="w-5 h-5 text-text-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search tools, keywords, or categories..."
            className="w-full px-4 py-5 bg-transparent outline-none text-lg text-text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
          />
          <button 
            onClick={() => setIsOpen(false)}
            className="px-2 py-1 text-[10px] font-bold text-text-4 border border-border rounded-md hover:bg-bg transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Results */}
        <div 
          ref={scrollRef}
          className="max-h-[60vh] overflow-y-auto p-2 space-y-1"
        >
          <div className="px-3 py-2 text-[10px] font-bold text-text-4 uppercase tracking-wider">
            {!query.trim() ? "Popular Tools" : `Search Results (${filteredTools.length})`}
          </div>
          
          {filteredTools.length === 0 ? (
            <div className="px-3 py-8 text-center text-text-4 text-sm">
              No tools found for "{query}"
            </div>
          ) : (
            filteredTools.map((tool, i) => (
              <button
                key={tool.id}
                onMouseEnter={() => setSelectedIndex(i)}
                onClick={() => handleSelect(tool)}
                className={`
                  w-full flex items-center gap-4 px-3 py-3 rounded-xl transition-all text-left
                  ${i === selectedIndex ? "bg-blue text-white shadow-lg shadow-blue/20" : "hover:bg-bg"}
                `}
              >
                <div className={`
                  w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0
                  ${i === selectedIndex ? "bg-white/20" : "bg-bg"}
                `}>
                  {/* Category Emoji lookup logic could go here, using a map or registry */}
                  {tool.category === 'calculators' ? '🧮' : 
                   tool.category === 'pdf' ? '📄' :
                   tool.category === 'image' ? '🖼️' :
                   tool.category === 'security' ? '🔐' :
                   tool.category === 'developer' ? '💻' :
                   tool.category === 'seo' ? '🔍' : '🛠️'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold truncate">{tool.name}</div>
                  <div className={`text-xs truncate ${i === selectedIndex ? "text-white/80" : "text-text-4"}`}>
                    {tool.desc}
                  </div>
                </div>
                {i === selectedIndex && (
                  <div className="text-[10px] font-bold px-2 py-1 bg-white/20 rounded-md">
                    ENTER
                  </div>
                )}
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-bg/50 border-t border-border flex items-center justify-between text-[10px] font-medium text-text-4">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span className="px-1 py-0.5 bg-surface border border-border rounded">↑↓</span> to navigate
            </span>
            <span className="flex items-center gap-1">
              <span className="px-1 py-0.5 bg-surface border border-border rounded">Enter</span> to select
            </span>
          </div>
          <div className="flex items-center gap-1">
             Search across <span className="font-bold text-text-2">{TOOLS.length}</span> tools
          </div>
        </div>
      </div>
    </div>
  );
}
