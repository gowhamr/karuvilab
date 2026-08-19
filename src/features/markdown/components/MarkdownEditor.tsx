"use client";

import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { 
  FileText, Upload, Code2, Download, Search, 
  RefreshCw, CheckCircle2, X, ChevronRight,
  FileCode, FileEdit, Type, Eye
} from "lucide-react";
import { m } from "framer-motion";
import { cn } from "@/src/lib/utils";
import { ToolShell } from "@/components/ui/ToolShell";
import { useFullscreenContext } from "@/src/contexts/FullscreenContext";
import { useFocusModeIntegration } from '@/src/contexts/FocusModeControlsContext';
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { DropZone } from "@/components/ui/DropZone";
import { useToast } from "@/components/ui/Toast";
import { blobManager } from "@/src/lib/blob-manager";

import { MarkdownService } from "../MarkdownService";
import { StatBar } from "./StatBar";
import { Toolbar } from "./Toolbar";
import { FindBar } from "./FindBar";
import { MarkdownPreview } from "./MarkdownPreview";
import { MarkdownVisualEditor } from "./MarkdownVisualEditor";
import { SAMPLE_MARKDOWN } from "../constants";



import { CATEGORIES } from "@/src/tool-registry";

export function MarkdownEditor() {
  const { toast } = useToast();
  const [mode, setMode] = useState<"editor" | "upload">("editor");
  type EditorTab = "write" | "visual" | "preview";
  const [activeTab, setActiveTab] = useState<EditorTab>("write");
  const [md, setMd] = useState(SAMPLE_MARKDOWN);
  const [uploadMd, setUploadMd] = useState("");
  const [fileName, setFileName] = useState("");
  const [fontSize, setFontSize] = useState(14);
  const [wordWrap, setWordWrap] = useState(true);
  
  const { isFullscreen, activeToolId } = useFullscreenContext();


  const isThisToolFullscreen = isFullscreen && activeToolId === "markdown";
  
  const [showFind, setShowFind] = useState(false);
  const [findState, setFindState] = useState({ matches: [] as number[], index: 0 });
  const [scrollSync, setScrollSync] = useState(true);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const uploadPreviewRef = useRef<HTMLDivElement>(null);

  const activeMd = mode === "editor" ? md : uploadMd;
  const [html, setHtml] = useState("");
  
  useEffect(() => {
    let active = true;
    MarkdownService.parse(activeMd).then(res => {
      if (active) setHtml(res);
    });
    return () => { active = false; };
  }, [activeMd]);
  const stats = useMemo(() => MarkdownService.getStats(activeMd), [activeMd]);

  useFocusModeIntegration({
    wordCount: stats.words,
    charCount: stats.chars,
    lineCount: md.split('\n').length,
    language: "markdown",
    onFontSizeChange: setFontSize,
    onWrapToggle: () => setWordWrap(v => !v)
  });

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

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const pct = ta.scrollTop / (ta.scrollHeight - ta.clientHeight || 1);
          const targetScroll = pct * (prev.scrollHeight - prev.clientHeight);
          prev.scrollTop = targetScroll;
          ticking = false;
        });
        ticking = true;
      }
    };

    ta.addEventListener("scroll", handleScroll, { passive: true });
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
    if (file.size > 1000000) {
      toast("File size exceeds 1MB limit", "error");
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
      const element = mode === "editor" ? previewRef.current : uploadPreviewRef.current;
      if (!element) {
        toast("Preview not ready", "error");
        return;
      }

      const toastId = toast("Generating PDF...", "info");

      try {
        const html2pdf = (await import('html2pdf.js')).default;
        
        const opt = {
          margin: [15, 15] as [number, number],
          filename: `${name}.pdf`,
          image: { type: 'jpeg' as const, quality: 0.98 },
          html2canvas: { 
            scale: 2, 
            useCORS: true, 
            letterRendering: true,
            logging: false,
            scrollY: 0,
            windowY: 0
          },
          jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const },
          pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        };

        // Extract content and strip Tailwind classes that cause oklab/oklch parsing issues
        const rawContent = element.querySelector('.markdown-body') || element;
        const clone = rawContent.cloneNode(true) as HTMLElement;
        
        // Remove UI buttons and copy widgets
        clone.querySelectorAll('.copy-code-btn, .mmd-copy, button, .flex.items-center.justify-between').forEach(el => el.remove());

        // Strip Tailwind background/text/border classes to avoid oklab/oklch computed values
        const allElements = [clone, ...Array.from(clone.querySelectorAll('*'))];
        for (const el of allElements) {
          if (el instanceof HTMLElement) {
            el.className = el.className
              .replace(/\b(bg|text|border|shadow|ring|backdrop|from|to|via)-[^\s]+/g, '')
              .trim();
          }
        }

        // Create a clean A4 export container
        const container = document.createElement('div');
        container.className = 'markdown-body';
        container.style.width = '180mm';
        container.style.padding = '0';
        container.style.backgroundColor = '#ffffff';
        container.style.color = '#24292e';
        container.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif';
        
        // Add PDF-specific styles for professional output
        const style = document.createElement('style');
        style.innerHTML = `
          * {
            box-sizing: border-box !important;
            color: #24292e !important;
            border-color: #d0d7de !important;
          }
          .markdown-body { 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji" !important; 
            font-size: 14px !important; 
            line-height: 1.6 !important; 
            color: #24292e !important; 
            background: #ffffff !important;
            padding: 0 !important;
          }
          .markdown-body h1 { font-size: 2em !important; margin-bottom: 16px !important; font-weight: 600 !important; border-bottom: 1px solid #eaecef !important; padding-bottom: 0.3em !important; color: #24292e !important; }
          .markdown-body h2 { font-size: 1.5em !important; margin-top: 24px !important; margin-bottom: 16px !important; font-weight: 600 !important; border-bottom: 1px solid #eaecef !important; padding-bottom: 0.3em !important; color: #24292e !important; }
          .markdown-body h3 { font-size: 1.25em !important; margin-top: 24px !important; margin-bottom: 16px !important; font-weight: 600 !important; color: #24292e !important; }
          .markdown-body p { margin-top: 0 !important; margin-bottom: 16px !important; color: #24292e !important; }
          .markdown-body pre { background-color: #f6f8fa !important; border: 1px solid #d0d7de !important; border-radius: 6px !important; padding: 16px !important; margin-bottom: 16px !important; white-space: pre-wrap !important; word-break: break-all !important; }
          .markdown-body code { font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace !important; background-color: #f1f3f5 !important; border-radius: 3px !important; padding: 0.2em 0.4em !important; font-size: 85% !important; color: #24292e !important; }
          .markdown-body pre code { background-color: transparent !important; padding: 0 !important; margin: 0 !important; font-size: 100% !important; white-space: pre-wrap !important; word-break: break-all !important; color: #24292e !important; }
          .markdown-body blockquote { border-left: 0.25em solid #dfe2e5 !important; color: #6a737d !important; padding: 0 1em !important; margin: 0 0 16px 0 !important; background: transparent !important; }
          .markdown-body table { border-collapse: collapse !important; width: 100% !important; margin-top: 0 !important; margin-bottom: 16px !important; display: table !important; table-layout: fixed !important; word-break: break-word !important; }
          .markdown-body th, .markdown-body td { border: 1px solid #dfe2e5 !important; padding: 6px 13px !important; overflow-wrap: break-word !important; text-align: left !important; color: #24292e !important; }
          .markdown-body th { background-color: #f6f8fa !important; font-weight: 600 !important; }
          .markdown-body img { max-width: 100% !important; box-sizing: content-box !important; background-color: #ffffff !important; }
          .markdown-body svg { max-width: 100% !important; height: auto !important; }
          .markdown-body [id^="mermaid-"] { height: auto !important; max-width: 100% !important; }
          .markdown-body ul, .markdown-body ol { padding-left: 2em !important; margin-top: 0 !important; margin-bottom: 16px !important; }
          .markdown-body li { margin-bottom: 4px !important; color: #24292e !important; }
        `;
        container.appendChild(style);
        container.appendChild(clone);

        await html2pdf().set(opt).from(container).save();
        toast("PDF exported successfully!");
      } catch (err) {
        console.error("PDF export failed:", err);
        toast("PDF export failed", "error");
      }
    } else if (format === "word") {
      try {
        const { Document, Packer, Paragraph, TextRun } = await import("docx");
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
    <div className="space-y-4 md:space-y-6">
      {/* Unified Header Controls */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          {/* Main Mode Toggle */}
          <SegmentedControl
            options={[
              { id: "editor", label: "Editor", icon: <FileEdit className="w-4 h-4" /> },
              { id: "upload", label: "Upload", icon: <Upload className="w-4 h-4" /> },
            ]}
            activeId={mode}
            onChange={(id) => setMode(id as any)}
          />

          {/* Tri-Mode Segmented Control */}
          {mode === "editor" && (
            <div className="w-full sm:w-auto">
              <SegmentedControl
                options={[
                  { id: "write", label: "Write", icon: <FileEdit className="w-4 h-4" /> },
                  { id: "visual", label: "Visual", icon: <Type className="w-4 h-4" /> },
                  { id: "preview", label: "Preview", icon: <Eye className="w-4 h-4" /> },
                ]}
                activeId={activeTab}
                onChange={(id) => setActiveTab(id as any)}
              />
            </div>
          )}
        </div>

        <div className="flex items-center justify-between w-full sm:w-auto gap-2">
          <button
            onClick={() => setShowFind(!showFind)}
            className={`p-2 rounded-xl border transition-all ${showFind ? 'bg-blue text-white border-blue' : 'bg-surface border-border text-text-3 hover:border-blue hover:text-blue'}`}
            title="Find & Replace"
            aria-label="Find and Replace"
          >
            <Search className="w-4 h-4" />
          </button>
          
          <div className="w-px h-6 bg-border mx-1 hidden sm:block" />

          <div className="flex bg-surface border border-border rounded-xl overflow-hidden shadow-sm">
            <button
              onClick={() => handleExport("html")}
              className="flex items-center gap-1.5 px-3 py-2 text-tiny font-bold uppercase tracking-widest-sm text-text-3 hover:bg-blue/5 hover:text-blue transition-all border-r border-border"
            >
              <Code2 className="w-3.5 h-3.5" /> HTML
            </button>
            <button
              onClick={() => handleExport("pdf")}
              className="flex items-center gap-1.5 px-3 py-2 text-tiny font-bold uppercase tracking-widest-sm text-text-3 hover:bg-blue/5 hover:text-blue transition-all border-r border-border"
            >
              <FileText className="w-3.5 h-3.5" /> PDF
            </button>
            <button
              onClick={() => handleExport("word")}
              className="flex items-center gap-1.5 px-3 py-2 text-tiny font-bold uppercase tracking-widest-sm text-text-3 hover:bg-blue/5 hover:text-blue transition-all"
            >
              <FileCode className="w-3.5 h-3.5" /> Word
            </button>
          </div>
        </div>
      </div>

      {mode === "editor" ? (
        <div className="w-full">
          <m.div
            layout
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={cn(
              "flex flex-col bg-surface border border-border rounded-4xl overflow-hidden shadow-sm w-full",
              isThisToolFullscreen ? "h-full" : "h-tool-viewport md:h-tool-viewport min-h-full max-h-screen"
            )}
          >
            {/* Hide Toolbar in Visual/Preview mode */}
            <div className={`${activeTab === "write" ? "block" : "hidden"}`}>
              {activeTab === "write" && (
                <Toolbar 
                  onInsert={insertAtCursor} 
                  onClear={() => setMd("")}
                  onLoadSample={() => setMd(SAMPLE_MARKDOWN)}
                  scrollSync={scrollSync}
                  onToggleScrollSync={() => setScrollSync(!scrollSync)}
                />
              )}
            </div>
            
            {showFind && activeTab === "write" && (
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
              <div className={`flex-1 flex-col min-w-0 h-full ${activeTab === "write" ? "flex" : "hidden"}`}>
                <textarea
                  ref={textareaRef}
                  value={md}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val.length > 1000000) {
                      toast("Text exceeds 1MB limit", "error");
                      setMd(val.slice(0, 1000000));
                    } else {
                      setMd(val);
                    }
                  }}
                  placeholder="# Start typing your markdown here..."
                  className={`flex-1 p-4 md:p-6 bg-transparent outline-none resize-none font-mono text-text-2 leading-relaxed h-full overflow-y-auto ${wordWrap ? 'whitespace-pre-wrap' : 'whitespace-pre overflow-x-auto'}`}
                  style={{ fontSize: `${fontSize}px` }}
                  spellCheck={false}
                />
              </div>

              <div className={`flex-1 flex-col min-w-0 h-full ${activeTab === "visual" ? "flex" : "hidden"}`}>
                {activeTab === "visual" && (
                  <MarkdownVisualEditor 
                    markdown={md} 
                    onChange={setMd} 
                    fontSize={fontSize} 
                  />
                )}
              </div>

              <div className={cn("flex-1 min-w-0 bg-bg/30 h-full overflow-hidden", activeTab === "preview" ? "flex" : "hidden")}>
                <MarkdownPreview 
                  html={html} 
                  ref={previewRef}
                  hideHeader={true}
                  onCopyRaw={() => {
                    navigator.clipboard.writeText(md);
                    toast("Markdown copied!");
                  }} 
                />
              </div>
            </div>

            {/* Hide StatBar in Preview mode */}
            <div className={`${activeTab === "preview" ? "hidden" : "block"}`}>
              <StatBar stats={stats} />
            </div>
          </m.div>
        </div>
      ) : (
        <div className="space-y-6">
            <DropZone
              onFilesSelected={handleFileUpload}
              accept=".md,.markdown"
              description="Drop your Markdown file here or click to browse"
            />

            {fileName && (
              <div className="flex flex-col h-[60vh] min-h-96 max-h-tool-viewport-lg bg-surface border border-border rounded-4xl overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-border bg-bg/50 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue/10 rounded-2xl flex items-center justify-center shrink-0">
                      <FileCode className="w-5 h-5 text-blue" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-tiny font-bold uppercase tracking-widest-sm truncate">{fileName}</h4>
                      <p className="text-xs font-bold text-text-4 uppercase tracking-tighter truncate">
                        {stats.words} words • {stats.chars} characters
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setFileName("");
                      setUploadMd("");
                    }}
                    aria-label="Close"
                    className="p-2 hover:bg-surface rounded-xl text-text-4 transition-all shrink-0 ml-2"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex-1 min-h-0 overflow-hidden bg-bg/30">
                  <MarkdownPreview 
                    html={html} 
                    ref={uploadPreviewRef}
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

