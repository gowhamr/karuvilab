"use client";

import React from "react";
import { 
  Bold, Italic, Strikethrough, Code, Heading1, Heading2, 
  Quote, List, ListOrdered, Link, Image as ImageIcon, 
  Table as TableIcon, Sparkles, Trash2, 
  Share2, FileJson, Layout, RefreshCw,
  LucideIcon
} from "lucide-react";
import { 
  DIAGRAM_SNIPPETS 
} from "../constants";

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
      
      <button
        title="Insert Table"
        aria-label="Insert Table"
        onClick={() => onInsert("\n| Col 1 | Col 2 |\n|-------|-------|\n| Cell  | Cell  |\n")}
        className="w-8 h-8 min-w-8 flex items-center justify-center rounded-lg hover:bg-surface border border-transparent hover:border-border text-text-3 hover:text-blue transition-all cursor-pointer shrink-0"
      >
        <TableIcon className="w-4 h-4" />
      </button>

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
