"use client";
import { useState, useMemo, useCallback } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { CopyButton } from "@/components/ui/CopyButton";

const cat = CATEGORIES.find(c => c.id === "utilities")!;

function parseMarkdown(md: string): string {
  let html = md
    // Escape HTML special chars first (only in non-code contexts)
    // Code blocks (fenced)
    .replace(/```(\w*)\n?([\s\S]*?)```/g, (_, lang, code) =>
      `<pre class="bg-bg border border-border rounded-xl p-4 overflow-auto my-4"><code class="text-sm font-mono text-text">${code.trim().replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>`
    )
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="font-mono text-sm bg-bg border border-border rounded px-1.5 py-0.5 text-blue">$1</code>')
    // Headings
    .replace(/^###### (.+)$/gm, '<h6 class="text-sm font-bold mt-4 mb-1">$1</h6>')
    .replace(/^##### (.+)$/gm, '<h5 class="text-base font-bold mt-4 mb-1">$1</h5>')
    .replace(/^#### (.+)$/gm, '<h4 class="text-lg font-bold mt-5 mb-1">$1</h4>')
    .replace(/^### (.+)$/gm, '<h3 class="text-xl font-bold mt-6 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-black mt-8 mb-2">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-3xl font-black mt-8 mb-3">$1</h1>')
    // Bold + italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
    .replace(/__(.+?)__/g, '<strong class="font-bold">$1</strong>')
    .replace(/_(.+?)_/g, '<em class="italic">$1</em>')
    // Strikethrough
    .replace(/~~(.+?)~~/g, '<del class="line-through text-text-4">$1</del>')
    // HR
    .replace(/^---+$/gm, '<hr class="border-border my-6" />')
    // Blockquote
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-blue pl-4 my-2 text-text-3 italic">$1</blockquote>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" class="text-blue underline hover:opacity-80">$1</a>')
    // Images
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full rounded-xl my-2" />')
    // Unordered list
    .replace(/^\s*[-*+] (.+)$/gm, '<li class="ml-6 list-disc mb-1">$1</li>')
    // Ordered list
    .replace(/^\s*\d+\. (.+)$/gm, '<li class="ml-6 list-decimal mb-1">$1</li>')
    // Wrap consecutive li tags
    .replace(/((<li.*?<\/li>\n?)+)/g, '<ul class="my-2">$1</ul>')
    // Paragraphs (double newline)
    .replace(/\n\n+/g, "\n</p><p class=\"my-3\">\n")
    .replace(/\n/g, "<br />");

  return `<div class="prose"><p class="my-3">${html}</p></div>`;
}

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

  const preview = useMemo(() => parseMarkdown(md), [md]);

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
                else insertAtCursor(ta, item.wrap![0], item.wrap![1]);
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
