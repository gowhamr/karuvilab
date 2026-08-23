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

  const handleFindKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (e.shiftKey) {
        onPrev();
      } else {
        onNext();
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };

  const handleReplaceKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (e.shiftKey) {
        onReplace(query, replacement, true);
      } else {
        onReplace(query, replacement, false);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2 bg-surface border-b border-border shadow-xs">
      <div className="relative flex-1 min-w-0">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-4 pointer-events-none" />
        <input
          type="text"
          placeholder="Find in document (Enter for next)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleFindKeyDown}
          className="w-full pl-8 pr-24 py-1.5 bg-bg border border-border rounded-lg text-xs text-text placeholder:text-text-muted outline-none focus:ring-1 focus:ring-blue transition-all"
          autoFocus
        />
        <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
          <span className="text-[11px] font-mono font-bold text-text-4 mr-1 select-none">
            {matchCount > 0 ? `${currentIndex + 1}/${matchCount}` : query ? "0" : ""}
          </span>
          <button 
            onClick={onPrev} 
            disabled={matchCount === 0}
            title="Previous Match (Shift+Enter)"
            aria-label="Previous match" 
            className="p-1 hover:bg-surface disabled:opacity-30 rounded text-text-3 hover:text-blue transition-all cursor-pointer"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={onNext} 
            disabled={matchCount === 0}
            title="Next Match (Enter)"
            aria-label="Next match" 
            className="p-1 hover:bg-surface disabled:opacity-30 rounded text-text-3 hover:text-blue transition-all cursor-pointer"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="relative flex-1 min-w-0 flex items-center gap-1.5">
        <div className="relative flex-1 min-w-0">
          <Replace className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-4 pointer-events-none" />
          <input
            type="text"
            placeholder="Replace with..."
            value={replacement}
            onChange={(e) => setReplacement(e.target.value)}
            onKeyDown={handleReplaceKeyDown}
            className="w-full pl-8 pr-3 py-1.5 bg-bg border border-border rounded-lg text-xs text-text placeholder:text-text-muted outline-none focus:ring-1 focus:ring-blue transition-all"
          />
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button 
            onClick={() => onReplace(query, replacement, false)}
            disabled={matchCount === 0 || !query}
            title="Replace Next Occurrence"
            aria-label="Replace current match"
            className="px-2 py-1.5 bg-bg hover:bg-blue hover:text-white border border-border hover:border-blue disabled:opacity-40 rounded-lg text-tiny font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            Replace
          </button>
          <button 
            onClick={() => onReplace(query, replacement, true)}
            disabled={matchCount === 0 || !query}
            title="Replace All Occurrences"
            aria-label="Replace all matches"
            className="px-2 py-1.5 bg-bg hover:bg-blue hover:text-white border border-border hover:border-blue disabled:opacity-40 rounded-lg text-tiny font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            All
          </button>
        </div>
        <button 
          onClick={onClose} 
          title="Close (Escape)"
          aria-label="Close find and replace" 
          className="p-1.5 hover:bg-surface rounded-lg text-text-4 hover:text-text transition-all shrink-0 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
