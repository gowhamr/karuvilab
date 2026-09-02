"use client";

import React, { useState, useRef, useEffect } from "react";
import { m, AnimatePresence } from "framer-motion";
import { 
  Bold, Italic, Strikethrough, Code, Heading1, Heading2, 
  Quote, List, ListOrdered, Link, Image as ImageIcon, 
  Table as TableIcon, Sparkles, Trash2, 
  Share2, FileJson, Layout, RefreshCw,
  LucideIcon
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { 
  DIAGRAM_SNIPPETS 
} from "../constants";

function generateMarkdownTable(rows: number, cols: number): string {
  const r = Math.max(1, Math.min(rows, 10));
  const c = Math.max(1, Math.min(cols, 8));
  
  let md = "\n";
  // Header row
  md += "| " + Array.from({ length: c }, (_, i) => `Header ${i + 1}`).join(" | ") + " |\n";
  // Separator row
  md += "| " + Array.from({ length: c }, () => "---").join(" | ") + " |\n";
  // Data rows
  for (let i = 0; i < r; i++) {
    md += "| " + Array.from({ length: c }, () => "Cell").join(" | ") + " |\n";
  }
  return md + "\n";
}

interface ToolbarItem {
  icon: LucideIcon;
  title: string;
  wrap?: string[];
  prefix?: string;
  diagram?: keyof typeof DIAGRAM_SNIPPETS;
}

interface ToolbarGroup {
  label: string;
  items: ToolbarItem[];
}

interface ToolbarProps {
  onInsert: (prefix: string, suffix?: string, insert?: string) => void;
  onClear: () => void;
  onLoadSample: () => void;
  scrollSync: boolean;
  onToggleScrollSync: () => void;
}

const TOOLBAR_GROUPS: ToolbarGroup[] = [
  {
    label: "Format",
    items: [
      { icon: Bold, title: "Bold (Ctrl+B)", wrap: ["**", "**"] },
      { icon: Italic, title: "Italic (Ctrl+I)", wrap: ["*", "*"] },
      { icon: Strikethrough, title: "Strikethrough (Ctrl+Shift+X)", wrap: ["~~", "~~"] },
      { icon: Code, title: "Inline Code (`)", wrap: ["`", "`"] },
      { icon: Heading1, title: "Heading 1 (# )", prefix: "# " },
      { icon: Heading2, title: "Heading 2 (## )", prefix: "## " },
      { icon: Quote, title: "Blockquote (> )", prefix: "> " },
      { icon: List, title: "Bullet List (- )", prefix: "- " },
      { icon: ListOrdered, title: "Ordered List (1. )", prefix: "1. " },
      { icon: Link, title: "Link (Ctrl+K)", wrap: ["[", "](url)"] },
      { icon: ImageIcon, title: "Image (![alt](url))", wrap: ["![alt](", ")"] },
    ]
  },
  {
    label: "Diagrams",
    items: [
      { icon: Layout, title: "Flowchart Diagram", diagram: "flowchart" },
      { icon: Share2, title: "Sequence Diagram", diagram: "sequence" },
      { icon: FileJson, title: "ER Diagram", diagram: "er" },
    ]
  }
];

export function Toolbar({ 
  onInsert, onClear, onLoadSample, scrollSync, onToggleScrollSync 
}: ToolbarProps) {
  const [isTablePickerOpen, setIsTablePickerOpen] = useState(false);
  const [hoverGrid, setHoverGrid] = useState({ rows: 3, cols: 3 });
  const tablePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isTablePickerOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (tablePickerRef.current && !tablePickerRef.current.contains(e.target as Node)) {
        setIsTablePickerOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsTablePickerOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isTablePickerOpen]);
  return (
    <div className="flex items-center gap-1 p-1.5 sm:p-2 bg-bg border-b border-border overflow-x-auto no-scrollbar sm:flex-wrap min-w-0 max-w-full">
      {TOOLBAR_GROUPS.map((group, gIdx) => (
        <React.Fragment key={group.label}>
          {gIdx > 0 && <div className="w-px h-4 bg-border mx-0.5 shrink-0" />}
          <div className="flex items-center gap-1 shrink-0">
            {group.items.map((item, iIdx) => (
              <button
                key={iIdx}
                title={item.title}
                aria-label={item.title}
                onClick={() => {
                  if (item.diagram) {
                    const snippet = DIAGRAM_SNIPPETS[item.diagram];
                    if (snippet) onInsert("", "", snippet);
                  } else if (item.prefix) {
                    onInsert(item.prefix, "");
                  } else if (item.wrap) {
                    onInsert(item.wrap[0] || "", item.wrap[1] || "");
                  }
                }}
                className="w-8 h-8 min-w-8 flex items-center justify-center rounded-lg hover:bg-surface border border-transparent hover:border-border text-text-3 hover:text-blue transition-all cursor-pointer shrink-0"
              >
                <item.icon className="w-4 h-4" />
              </button>
            ))}
          </div>
        </React.Fragment>
      ))}

      <div className="w-px h-4 bg-border mx-0.5 shrink-0" />

      {/* Diagrams Dropdown Selector */}
      <div className="flex items-center shrink-0">
        <select
          title="Insert Diagram Template"
          aria-label="Insert Diagram Template"
          onChange={(e) => {
            const val = e.target.value as keyof typeof DIAGRAM_SNIPPETS;
            if (val && DIAGRAM_SNIPPETS[val]) {
              onInsert("", "", DIAGRAM_SNIPPETS[val]);
              e.target.value = "";
            }
          }}
          defaultValue=""
          className="h-8 px-2.5 bg-surface border border-border rounded-lg text-xs font-semibold text-text-3 hover:text-blue hover:border-blue transition-all cursor-pointer focus:outline-none shrink-0"
        >
          <option value="" disabled>
            + Diagram Template
          </option>
          <option value="flowchart">Flowchart TD</option>
          <option value="sequence">Sequence Diagram</option>
          <option value="class">Class Diagram</option>
          <option value="state">State Machine</option>
          <option value="er">ER Diagram</option>
          <option value="gantt">Gantt Timeline</option>
          <option value="gitgraph">Git Graph</option>
          <option value="mindmap">Mindmap</option>
          <option value="timeline">Roadmap Timeline</option>
          <option value="pie">Pie Chart</option>
          <option value="c4">C4 Architecture</option>
          <option value="sankey">Sankey Beta</option>
          <option value="xychart">XY Chart</option>
          <option value="kanban">Kanban Board</option>
        </select>
      </div>

      <div className="w-px h-4 bg-border mx-0.5 shrink-0" />
      
      {/* Table Generator Dropdown */}
      <div ref={tablePickerRef} className="relative flex items-center shrink-0">
        <button
          type="button"
          title="Insert Custom Table"
          aria-label="Insert Table"
          aria-expanded={isTablePickerOpen}
          onClick={() => setIsTablePickerOpen(!isTablePickerOpen)}
          className={cn(
            "w-8 h-8 min-w-8 flex items-center justify-center rounded-lg border transition-all cursor-pointer shrink-0",
            isTablePickerOpen 
              ? "bg-blue/10 border-blue/20 text-blue" 
              : "hover:bg-surface border-transparent hover:border-border text-text-3 hover:text-blue"
          )}
        >
          <TableIcon className="w-4 h-4" />
        </button>

        <AnimatePresence>
          {isTablePickerOpen && (
            <m.div
              initial={{ opacity: 0, y: 4, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.96 }}
              transition={{ duration: 0.12 }}
              className="absolute top-full left-0 mt-1.5 p-3 bg-surface border border-border rounded-2xl shadow-xl z-dropdown flex flex-col gap-2.5 min-w-44"
            >
              <div className="flex items-center justify-between text-xs font-bold px-0.5">
                <span className="text-text-4 uppercase tracking-widest-sm text-[10px]">Table Grid</span>
                <span className="text-blue font-mono">{hoverGrid.rows} × {hoverGrid.cols}</span>
              </div>

              {/* Grid matrix 6x6 */}
              <div 
                className="grid grid-cols-6 gap-1 p-1 bg-bg/80 border border-border rounded-xl"
                onMouseLeave={() => setHoverGrid({ rows: 3, cols: 3 })}
              >
                {Array.from({ length: 6 }).map((_, rIdx) => (
                  <React.Fragment key={rIdx}>
                    {Array.from({ length: 6 }).map((_, cIdx) => {
                      const isHighlighted = rIdx < hoverGrid.rows && cIdx < hoverGrid.cols;
                      return (
                        <button
                          key={cIdx}
                          type="button"
                          onMouseEnter={() => setHoverGrid({ rows: rIdx + 1, cols: cIdx + 1 })}
                          onClick={() => {
                            onInsert(generateMarkdownTable(rIdx + 1, cIdx + 1));
                            setIsTablePickerOpen(false);
                          }}
                          className={cn(
                            "w-5 h-5 rounded-xs border transition-all cursor-pointer",
                            isHighlighted 
                              ? "bg-blue/30 border-blue text-blue" 
                              : "bg-surface border-border hover:border-blue/50"
                          )}
                          title={`${rIdx + 1} rows × ${cIdx + 1} columns`}
                          aria-label={`Create ${rIdx + 1} by ${cIdx + 1} table`}
                        />
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-border">
                <button
                  type="button"
                  onClick={() => {
                    onInsert(generateMarkdownTable(3, 3));
                    setIsTablePickerOpen(false);
                  }}
                  className="text-[11px] font-bold text-text-3 hover:text-blue transition-colors cursor-pointer"
                >
                  + Default (3×3)
                </button>
                <span className="text-[10px] text-text-4">Click to insert</span>
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </div>

      <div className="w-px h-4 bg-border mx-0.5 shrink-0" />

      <button
        title={scrollSync ? "Disable Scroll Sync" : "Enable Scroll Sync"}
        aria-label={scrollSync ? "Disable Scroll Sync" : "Enable Scroll Sync"}
        onClick={onToggleScrollSync}
        className={`w-8 h-8 min-w-8 flex items-center justify-center rounded-lg border transition-all cursor-pointer shrink-0 ${scrollSync ? 'bg-blue/10 border-blue/20 text-blue' : 'bg-transparent border-transparent text-text-4 hover:border-border hover:bg-surface'}`}
      >
        <RefreshCw className={`w-4 h-4 ${scrollSync ? 'animate-spin-slow' : ''}`} />
      </button>

      <div className="ml-auto flex items-center gap-1 shrink-0">
        <button
          title="Load Sample"
          aria-label="Load Sample Markdown"
          onClick={onLoadSample}
          className="flex items-center gap-1.5 h-8 px-2.5 rounded-lg bg-blue/5 text-blue text-tiny font-bold uppercase tracking-widest-sm hover:bg-blue/10 transition-all border border-blue/10 cursor-pointer shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Sample</span>
        </button>
        <button
          title="Clear All"
          aria-label="Clear All Content"
          onClick={onClear}
          className="w-8 h-8 min-w-8 flex items-center justify-center rounded-lg hover:bg-error/5 text-text-4 hover:text-error border border-transparent hover:border-error/20 transition-all cursor-pointer shrink-0"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
