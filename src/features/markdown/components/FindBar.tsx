"use client";

import React, { useState, useEffect } from "react";
import { Search, X, ChevronDown, ChevronUp, Replace } from "lucide-react";

interface FindBarProps {
  onFind: (query: string) => void;
  onReplace: (query: string, replacement: string, all: boolean) => void;
  onClose: () => void;
  matchCount: number;
  currentIndex: number;
  onNext: () => void;
  onPrev: () => void;
}

export function FindBar({ 
  onFind, onReplace, onClose, 
  matchCount, currentIndex, onNext, onPrev 
}: FindBarProps) {
  const [query, setQuery] = useState("");
  const [replacement, setReplacement] = useState("");

  useEffect(() => {
    onFind(query);
  }, [query, onFind]);

  return (
    <div className="flex flex-wrap items-center gap-2 p-2 bg-surface border-b border-border shadow-inner">
      <div className="relative flex-1 min-w-52">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-4" />
        <input
          type="text"
          placeholder="Find..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-8 pr-20 py-1.5 bg-bg border border-border rounded-lg text-xs outline-none focus:ring-1 focus:ring-blue transition-all"
          autoFocus
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          <span className="text-xs font-bold text-text-4 mr-1">
            {matchCount > 0 ? `${currentIndex + 1}/${matchCount}` : "0 found"}
          </span>
          <button onClick={onPrev} aria-label="Previous match" className="p-0.5 hover:bg-surface rounded"><ChevronUp className="w-3.5 h-3.5" /></button>
          <button onClick={onNext} aria-label="Next match" className="p-0.5 hover:bg-surface rounded"><ChevronDown className="w-3.5 h-3.5" /></button>
        </div>
      </div>

      <div className="relative flex-1 min-w-52">
        <Replace className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-4" />
        <input
          type="text"
          placeholder="Replace with..."
          value={replacement}
          onChange={(e) => setReplacement(e.target.value)}
          className="w-full pl-8 pr-24 py-1.5 bg-bg border border-border rounded-lg text-xs outline-none focus:ring-1 focus:ring-blue transition-all"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          <button 
            onClick={() => onReplace(query, replacement, false)}
            aria-label="Replace current match"
            className="px-1.5 py-0.5 hover:bg-blue hover:text-white rounded text-tiny font-black uppercase tracking-tighter transition-all"
          >
            One
          </button>
          <button 
            onClick={() => onReplace(query, replacement, true)}
            aria-label="Replace all matches"
            className="px-1.5 py-0.5 hover:bg-blue hover:text-white rounded text-tiny font-black uppercase tracking-tighter transition-all"
          >
            All
          </button>
        </div>
      </div>

      <button onClick={onClose} aria-label="Close find and replace" className="min-w-11 min-h-11 hover:bg-surface rounded-lg text-text-4 flex items-center justify-center">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
