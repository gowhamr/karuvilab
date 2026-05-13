"use client";
import { useState, useMemo, useCallback } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { CopyButton } from "@/components/ui/CopyButton";
import { parseAndSanitizeMarkdownSync } from "@/src/lib/security";

const cat = CATEGORIES.find(c => c.id === "utilities")!;

const TOOLBAR_ITEMS = [
  { label: "B", title: "Bold", wrap: ["**", "**"] },
  { label: "I", title: "Italic", wrap: ["*", "*"] },
  { label: "~~", title: "Strikethrough", wrap: ["~~", "~~"] },
  { label: "`", title: "Inline Code", wrap: ["`", "`"] },
  { label: "H1", title: "Heading 1", prefix: "# " },
  { label: "H2", title: "Heading 2", prefix: "## " },
  { label: "H3", title: "Heading 3", prefix: "### " },
  { label: ">", title: "Blockquote", prefix: "> " },
  { label: "- ", title: "Bullet list", prefix: "- " },
  { label: "1.", title: "Ordered list", prefix: "1. " },
  { label: "---", title: "Horizontal rule", insert: "\n---\n" },
  { label: "[link]", title: "Link", wrap: ["[", "](url)"] },
];

export default function MarkdownEditorClient() {
  const [md, setMd] = useState(`# Welcome to the Markdown Editor

Type your **markdown** here and see a *live preview* on the right.

## Features
- Bold, *italic*, ~~strikethrough~~
- \`inline code\` and code blocks
- [Links](https://karuvilab.com) and lists
- > Blockquotes
- Headings H1–H6

---

\`\`\`js
console.log("Hello, world!");
\`\`\``);

  const preview = useMemo(() => parseAndSanitizeMarkdownSync(md), [md]);

  const insertAtCursor = useCallback((textarea: HTMLTextAreaElement, before: string, after = "", insert = "") => {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = textarea.value.slice(start, end);
    let newVal: string;
    if (insert) {
      newVal = textarea.value.slice(0, start) + insert + textarea.value.slice(end);
    } else {
      newVal = textarea.value.slice(0, start) + before + selected + after + textarea.value.slice(end);
    }
    setMd(newVal);
    // Restore selection after state update
    requestAnimationFrame(() => {
      textarea.focus();
      const newPos = insert ? start + insert.length : start + before.length + selected.length + after.length;
      textarea.setSelectionRange(newPos, newPos);
    });
  }, []);

  return (
    
      <div className="bg-surface border border-border p-4 rounded-2xl shadow-sm">
        <div className="flex flex-wrap gap-1 mb-3">
          {TOOLBAR_ITEMS.map(item => (
            <button
              key={item.label}
              title={item.title}
              onClick={() => {
                const ta = document.getElementById("md-editor") as HTMLTextAreaElement | null;
                if (!ta) return;
                if (item.insert) insertAtCursor(ta, "", "", item.insert);
                else if (item.prefix) insertAtCursor(ta, item.prefix, "");
                else insertAtCursor(ta, item.wrap![0]!, item.wrap![1]!);
              }}
              className="px-2.5 py-1 text-xs font-mono font-bold bg-bg border border-border rounded-lg hover:border-blue hover:text-blue transition-all"
            >
              {item.label}
            </button>
          ))}
          <div className="ml-auto">
            <CopyButton text={md} label="Copy MD" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-text-4 uppercase tracking-wider">Markdown</label>
            <textarea
              id="md-editor"
              className="w-full h-[500px] px-4 py-3 bg-bg border border-border rounded-xl font-mono text-sm focus:ring-2 focus:ring-blue outline-none transition-all resize-none"
              value={md}
              onChange={e => setMd(e.target.value)}
              spellCheck={false}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-text-4 uppercase tracking-wider">Preview</label>
            <div
              className="w-full h-[500px] px-4 py-3 bg-bg border border-border rounded-xl text-sm text-text overflow-y-auto"
              dangerouslySetInnerHTML={{ __html: preview }}
            />
          </div>
        </div>
      </div>
    
  );
}
