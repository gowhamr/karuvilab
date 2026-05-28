"use client";

import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { 
  FileText, Upload, Code2, Download, Search, 
  RefreshCw, CheckCircle2, X, ChevronRight,
  FileCode, FileEdit, Type
} from "lucide-react";
import { ToolShell } from "@/components/ui/ToolShell";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { DropZone } from "@/components/ui/DropZone";
import { useToast } from "@/components/ui/Toast";
import { blobManager } from "@/src/lib/blob-manager";

import { MarkdownService } from "../MarkdownService";
import { StatBar } from "./StatBar";
import { Toolbar } from "./Toolbar";
import { FindBar } from "./FindBar";
import { MarkdownPreview } from "./MarkdownPreview";
import { SAMPLE_MARKDOWN } from "../constants";

import { Document, Packer, Paragraph, TextRun } from "docx";

import { CATEGORIES } from "@/src/tool-registry";

export function MarkdownEditor() {
  const { toast } = useToast();
  const [mode, setMode] = useState<"editor" | "upload">("editor");
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [md, setMd] = useState(SAMPLE_MARKDOWN);
  const [uploadMd, setUploadMd] = useState("");
  const [fileName, setFileName] = useState("");
  
  const [showFind, setShowFind] = useState(false);
  const [findState, setFindState] = useState({ matches: [] as number[], index: 0 });
  const [scrollSync, setScrollSync] = useState(true);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const activeMd = mode === "editor" ? md : uploadMd;
  const html = useMemo(() => MarkdownService.parse(activeMd), [activeMd]);
  const stats = useMemo(() => MarkdownService.getStats(activeMd), [activeMd]);

  // Insert logic
  const insertAtCursor = useCallback((before: string, after = "", insert = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart || 0;
    const end = textarea.selectionEnd || 0;
    const selected = textarea.value.slice(start, end);
    let newVal: string;

    if (insert) {
      newVal = textarea.value.slice(0, start) + insert + textarea.value.slice(end);
    } else {
      newVal = textarea.value.slice(0, start) + before + selected + after + textarea.value.slice(end);
    }

    setMd(newVal);
    
    requestAnimationFrame(() => {
      textarea.focus();
      const newPos = insert ? start + insert.length : start + before.length + selected.length + after.length;
      textarea.setSelectionRange(newPos, newPos);
    });
  }, []);

  // Find & Replace logic
  const handleFind = useCallback((query: string) => {
    if (!query || !textareaRef.current) {
      setFindState({ matches: [], index: 0 });
      return;
    }
    const text = textareaRef.current.value;
    const re = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const matches: number[] = [];
    let m;
    while ((m = re.exec(text)) !== null) matches.push(m.index);
    setFindState({ matches, index: 0 });
    
    if (matches.length > 0) {
      const firstMatch = matches[0];
      if (firstMatch !== undefined) {
        textareaRef.current.setSelectionRange(firstMatch, firstMatch + query.length);
        textareaRef.current.focus();
      }
    }
  }, []);

  const handleReplace = useCallback((query: string, replacement: string, all: boolean) => {
    if (!query || !textareaRef.current) return;
    const text = textareaRef.current.value;
    let nextText = "";
    if (all) {
      nextText = text.split(query).join(replacement);
      toast(`Replaced all occurrences of "${query}"`);
    } else {
      const { matches, index } = findState;
      const start = matches[index];
      if (start === undefined) return;
      nextText = text.slice(0, start) + replacement + text.slice(start + query.length);
      toast(`Replaced 1 occurrence of "${query}"`);
    }
    setMd(nextText);
    handleFind(query);
  }, [findState, handleFind, toast]);

  // Scroll sync
  useEffect(() => {
    if (!scrollSync || mode !== "editor") return;
    const ta = textareaRef.current;
    const prev = previewRef.current;
    if (!ta || !prev) return;

    const handleScroll = () => {
      const pct = ta.scrollTop / (ta.scrollHeight - ta.clientHeight || 1);
      const targetScroll = pct * (prev.scrollHeight - prev.clientHeight);
      prev.scrollTop = targetScroll;
    };

    ta.addEventListener("scroll", handleScroll);
    return () => ta.removeEventListener("scroll", handleScroll);
  }, [scrollSync, mode]);

  // File Upload
  const handleFileUpload = (files: File[] | FileList) => {
    const fileArray = Array.from(files);
    const file = fileArray[0];
    if (!file) return;
    if (!file.name.match(/\.(md|markdown)$/i)) {
      toast("Only .md files are supported", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setUploadMd(content);
      setFileName(file.name);
      setMode("upload");
      toast(`Loaded ${file.name}`);
    };
    reader.readAsText(file);
  };

  // Export Logic
  const handleExport = async (format: "html" | "pdf" | "word") => {
    const content = mode === "editor" ? md : uploadMd;
    if (!content.trim()) {
      toast("Nothing to export", "error");
      return;
    }

    const name = fileName ? fileName.replace(/\.md$/i, "") : "document";

    if (format === "html") {
      const fullHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${name}</title>
  <style>
    body { font-family: sans-serif; line-height: 1.6; max-width: 800px; margin: 40px auto; padding: 0 20px; }
    pre { background: #f4f4f4; padding: 15px; border-radius: 5px; overflow-x: auto; }
    code { font-family: monospace; background: #eee; padding: 2px 4px; border-radius: 3px; }
    blockquote { border-left: 4px solid #ccc; margin: 0; padding-left: 20px; color: #666; }
    table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #f2f2f2; }
  </style>
</head>
<body>${html}</body>
</html>`;
      const blob = new Blob([fullHtml], { type: "text/html" });
      const url = blobManager.create(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${name}.html`;
      a.click();
      blobManager.revoke(url);
      toast("HTML exported!");
    } else if (format === "pdf") {
      window.print();
    } else if (format === "word") {
      try {
        const sections = [
          {
            properties: {},
            children: activeMd.split("\n").map(line => 
              new Paragraph({
                children: [new TextRun({ text: line, size: 24 })],
                spacing: { after: 200 }
              })
            ),
          }
        ];
        const doc = new Document({ sections });
        const blob = await Packer.toBlob(doc);
        const url = blobManager.create(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${name}.docx`;
        a.click();
        blobManager.revoke(url);
        toast("Word document exported!");
      } catch (err) {
        console.error("Word export failed:", err);
        toast("Word export failed", "error");
      }
    }
  };

  return (
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            <SegmentedControl
              options={[
                { id: "editor", label: "Live Editor", icon: <FileEdit className="w-4 h-4" /> },
                { id: "upload", label: "File Upload", icon: <Upload className="w-4 h-4" /> },
              ]}
              activeId={mode}
              onChange={(id) => setMode(id as any)}
            />

            {mode === "editor" && (
              <div className="md:hidden w-full sm:w-auto">
                <SegmentedControl
                  options={[
                    { id: "edit", label: "Edit" },
                    { id: "preview", label: "Preview" },
                  ]}
                  activeId={activeTab}
                  onChange={(id) => setActiveTab(id as any)}
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFind(!showFind)}
              className={`p-2 rounded-xl border transition-all ${showFind ? 'bg-blue text-white border-blue' : 'bg-surface border-border text-text-3 hover:border-blue hover:text-blue'}`}
              title="Find & Replace"
            >
              <Search className="w-4 h-4" />
            </button>
            
            <div className="w-px h-6 bg-border mx-1 hidden md:block" />

            <div className="flex bg-surface border border-border rounded-xl overflow-hidden shadow-sm">
              <button
                onClick={() => handleExport("html")}
                className="flex items-center gap-1.5 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-text-3 hover:bg-blue/5 hover:text-blue transition-all border-r border-border"
              >
                <Code2 className="w-3.5 h-3.5" /> HTML
              </button>
              <button
                onClick={() => handleExport("pdf")}
                className="flex items-center gap-1.5 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-text-3 hover:bg-blue/5 hover:text-blue transition-all border-r border-border"
              >
                <FileText className="w-3.5 h-3.5" /> PDF
              </button>
              <button
                onClick={() => handleExport("word")}
                className="flex items-center gap-1.5 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-text-3 hover:bg-blue/5 hover:text-blue transition-all"
              >
                <FileCode className="w-3.5 h-3.5" /> Word
              </button>
            </div>
          </div>
        </div>

        {mode === "editor" ? (
          <div className="flex flex-col h-[70vh] min-h-[500px] max-h-[800px] bg-surface border border-border rounded-[32px] overflow-hidden shadow-sm">
            <Toolbar 
              onInsert={insertAtCursor} 
              onClear={() => setMd("")}
              onLoadSample={() => setMd(SAMPLE_MARKDOWN)}
              scrollSync={scrollSync}
              onToggleScrollSync={() => setScrollSync(!scrollSync)}
            />
            
            {showFind && (
              <FindBar
                onFind={handleFind}
                onReplace={handleReplace}
                onClose={() => setShowFind(false)}
                matchCount={findState.matches.length}
                currentIndex={findState.index}
                onNext={() => setFindState(s => ({ ...s, index: (s.index + 1) % (s.matches.length || 1) }))}
                onPrev={() => setFindState(s => ({ ...s, index: (s.index - 1 + s.matches.length) % (s.matches.length || 1) }))}
              />
            )}

            <div className="flex-1 flex flex-col md:flex-row min-h-0">
              <div className={`flex-1 flex-col min-w-0 border-r border-border h-full ${activeTab === "edit" ? "flex" : "hidden"} md:flex`}>
                <textarea
                  ref={textareaRef}
                  value={md}
                  onChange={(e) => setMd(e.target.value)}
                  placeholder="# Start typing your markdown here..."
                  className="flex-1 p-6 bg-transparent outline-none resize-none font-mono text-sm text-text-2 leading-relaxed h-full overflow-y-auto"
                  spellCheck={false}
                />
              </div>
              <div className={`flex-1 min-w-0 bg-bg/30 h-full overflow-hidden ${activeTab === "preview" ? "flex" : "hidden"} md:flex`}>
                <MarkdownPreview 
                  html={html} 
                  onCopyRaw={() => {
                    navigator.clipboard.writeText(md);
                    toast("Markdown copied!");
                  }} 
                />
              </div>
            </div>

            <StatBar stats={stats} />
          </div>
        ) : (
          <div className="space-y-6">
            <DropZone
              onFilesSelected={handleFileUpload}
              accept=".md,.markdown"
              description="Drop your Markdown file here or click to browse"
            />

            {fileName && (
              <div className="flex flex-col h-[60vh] min-h-[400px] max-h-[700px] bg-surface border border-border rounded-[32px] overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-border bg-bg/50 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue/10 rounded-2xl flex items-center justify-center shrink-0">
                      <FileCode className="w-5 h-5 text-blue" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-black uppercase tracking-widest truncate">{fileName}</h4>
                      <p className="text-[10px] font-bold text-text-4 uppercase tracking-tighter truncate">
                        {stats.words} words • {stats.chars} characters
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setFileName("");
                      setUploadMd("");
                    }}
                    className="p-2 hover:bg-surface rounded-xl text-text-4 transition-all shrink-0 ml-2"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex-1 min-h-0 overflow-hidden bg-bg/30">
                  <MarkdownPreview 
                    html={html} 
                    onCopyRaw={() => {
                      navigator.clipboard.writeText(uploadMd);
                      toast("Markdown copied!");
                    }} 
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
  );
}

