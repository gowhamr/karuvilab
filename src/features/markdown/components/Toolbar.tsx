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
      { icon: Bold, title: "Bold", wrap: ["**", "**"] },
      { icon: Italic, title: "Italic", wrap: ["*", "*"] },
      { icon: Strikethrough, title: "Strikethrough", wrap: ["~~", "~~"] },
      { icon: Code, title: "Inline Code", wrap: ["`", "`"] },
      { icon: Heading1, title: "Heading 1", prefix: "# " },
      { icon: Heading2, title: "Heading 2", prefix: "## " },
      { icon: Quote, title: "Blockquote", prefix: "> " },
      { icon: List, title: "Bullet List", prefix: "- " },
      { icon: ListOrdered, title: "Ordered List", prefix: "1. " },
      { icon: Link, title: "Link", wrap: ["[", "](url)"] },
      { icon: ImageIcon, title: "Image", wrap: ["![alt](", ")"] },
    ]
  },
  {
    label: "Diagrams",
    items: [
      { icon: Layout, title: "Flowchart", diagram: "flowchart" },
      { icon: Share2, title: "Sequence", diagram: "sequence" },
      { icon: FileJson, title: "ER Diagram", diagram: "er" },
    ]
  }
];

export function Toolbar({ 
  onInsert, onClear, onLoadSample, scrollSync, onToggleScrollSync 
}: ToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-1 p-2 bg-bg border-b border-border">
      {TOOLBAR_GROUPS.map((group, gIdx) => (
        <React.Fragment key={group.label}>
          {gIdx > 0 && <div className="w-px h-4 bg-border mx-1" />}
          <div className="flex flex-wrap gap-1">
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
                className="p-1.5 rounded-lg hover:bg-surface border border-transparent hover:border-border text-text-3 hover:text-blue transition-all"
              >
                <item.icon className="w-4 h-4" />
              </button>
            ))}
          </div>
        </React.Fragment>
      ))}

      <div className="w-px h-4 bg-border mx-1" />
      
      <button
        title="Insert Table"
        aria-label="Insert Table"
        onClick={() => onInsert("\n| Col 1 | Col 2 |\n|-------|-------|\n| Cell  | Cell  |\n")}
        className="p-1.5 rounded-lg hover:bg-surface border border-border text-text-3 hover:text-blue transition-all"
      >
        <TableIcon className="w-4 h-4" />
      </button>

      <div className="w-px h-4 bg-border mx-1" />

      <button
        title={scrollSync ? "Disable Scroll Sync" : "Enable Scroll Sync"}
        aria-label={scrollSync ? "Disable Scroll Sync" : "Enable Scroll Sync"}
        onClick={onToggleScrollSync}
        className={`p-1.5 rounded-lg border transition-all ${scrollSync ? 'bg-blue/10 border-blue/20 text-blue' : 'bg-transparent border-transparent text-text-4 hover:border-border hover:bg-surface'}`}
      >
        <RefreshCw className={`w-4 h-4 ${scrollSync ? 'animate-spin-slow' : ''}`} />
      </button>

      <div className="ml-auto flex gap-1">
        <button
          title="Load Sample"
          aria-label="Load Sample Markdown"
          onClick={onLoadSample}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue/5 text-blue text-tiny font-bold uppercase tracking-widest-sm hover:bg-blue/10 transition-all border border-blue/10"
        >
          <Sparkles className="w-3 h-3" />
          Sample
        </button>
        <button
          title="Clear All"
          aria-label="Clear All Content"
          onClick={onClear}
          className="p-1.5 rounded-lg hover:bg-error/5 text-text-4 hover:text-error transition-all"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
