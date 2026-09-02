"use client";

import React, { useState, useMemo } from "react";
import { ListTree, X, Plus, Search, ChevronRight, Hash } from "lucide-react";
import { TocHeading, generateMarkdownTocText } from "../utils/toc-extractor";
import { cn } from "@/src/lib/utils";

interface DocumentOutlineProps {
  headings: TocHeading[];
  isOpen: boolean;
  onClose: () => void;
  onSelectHeading: (heading: TocHeading) => void;
  onInsertTocText: (tocText: string) => void;
}

export function DocumentOutline({
  headings,
  isOpen,
  onClose,
  onSelectHeading,
  onInsertTocText,
}: DocumentOutlineProps) {
  const [filter, setFilter] = useState("");

  const filteredHeadings = useMemo(() => {
    if (!filter.trim()) return headings;
    const q = filter.toLowerCase();
    return headings.filter(h => h.text.toLowerCase().includes(q));
  }, [headings, filter]);

  if (!isOpen) return null;

  return (
    <div className="w-full lg:w-72 bg-surface border border-border rounded-2xl flex flex-col overflow-hidden shadow-md shrink-0 h-full max-h-[750px] animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-border bg-bg/50 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <ListTree className="w-4 h-4 text-blue shrink-0" />
          <span className="text-xs font-bold uppercase tracking-wider text-text truncate">
            Document Outline
          </span>
          <span className="px-1.5 py-0.5 rounded-full bg-blue/10 text-blue text-[10px] font-mono font-bold shrink-0">
            {headings.length}
          </span>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-hover text-text-4 hover:text-text transition-all cursor-pointer shrink-0"
          title="Close Outline"
          aria-label="Close Outline"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Filter / Search if more than 4 headings */}
      {headings.length > 4 && (
        <div className="p-2 border-b border-border shrink-0">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-text-4 absolute left-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Filter headings..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full pl-8 pr-2.5 py-1 bg-bg border border-border rounded-xl text-xs text-text placeholder:text-text-4 focus:outline-none focus:border-blue"
            />
            {filter && (
              <button
                type="button"
                onClick={() => setFilter("")}
                className="absolute right-2 text-text-4 hover:text-text text-xs"
              >
                ×
              </button>
            )}
          </div>
        </div>
      )}

      {/* Headings List */}
      <div className="flex-1 min-h-0 overflow-y-auto p-2 space-y-1 custom-scrollbar">
        {filteredHeadings.length === 0 ? (
          <div className="p-4 text-center text-xs text-text-4 flex flex-col items-center gap-1.5">
            <Hash className="w-5 h-5 text-text-4/50 mb-1" />
            {headings.length === 0 ? (
              <>
                <p className="font-semibold text-text-3">No headings found</p>
                <p className="text-[11px]">Use <code className="text-blue"># Heading</code> syntax to create document sections.</p>
              </>
            ) : (
              <p>No headings match &quot;{filter}&quot;</p>
            )}
          </div>
        ) : (
          filteredHeadings.map((heading) => {
            // Indent based on level (1 = 0px, 2 = 12px, 3 = 24px, 4+ = 32px)
            const indentClass =
              heading.level === 1
                ? "pl-2 font-bold text-text"
                : heading.level === 2
                ? "pl-5 font-semibold text-text-2"
                : heading.level === 3
                ? "pl-8 text-text-3"
                : "pl-10 text-text-4 text-[11px]";

            return (
              <button
                key={heading.id}
                type="button"
                onClick={() => onSelectHeading(heading)}
                className={cn(
                  "w-full flex items-center justify-between gap-1.5 py-1.5 pr-2 rounded-xl text-xs text-left hover:bg-hover hover:text-blue transition-all cursor-pointer group",
                  indentClass
                )}
                title={`Jump to line ${heading.lineNumber}: ${heading.text}`}
              >
                <div className="flex items-center gap-1.5 min-w-0 truncate">
                  <span className={cn(
                    "px-1 py-0.2 rounded text-[9px] font-mono font-bold shrink-0 uppercase",
                    heading.level === 1 ? "bg-blue/15 text-blue" :
                    heading.level === 2 ? "bg-purple-500/15 text-purple-400" :
                    "bg-border text-text-4"
                  )}>
                    H{heading.level}
                  </span>
                  <span className="truncate">{heading.text}</span>
                </div>
                <span className="text-[10px] font-mono text-text-4 group-hover:text-blue shrink-0">
                  L{heading.lineNumber}
                </span>
              </button>
            );
          })
        )}
      </div>

      {/* Footer CTA: Insert TOC into Document */}
      {headings.length > 0 && (
        <div className="p-2 border-t border-border bg-bg/50 shrink-0">
          <button
            type="button"
            onClick={() => onInsertTocText(generateMarkdownTocText(headings))}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 bg-surface hover:bg-blue/10 border border-border hover:border-blue/30 text-text-3 hover:text-blue rounded-xl text-xs font-bold transition-all cursor-pointer"
            title="Insert a Markdown Table of Contents at the current cursor position"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Insert TOC in Document</span>
          </button>
        </div>
      )}
    </div>
  );
}
