"use client";

import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { 
  FileText, Upload, Code2, Download, Search, 
  RefreshCw, CheckCircle2, X, ChevronRight,
  FileCode, FileEdit, Type, Eye, Columns,
  Settings2, Copy, AlignLeft, Hash, Sliders,
  Sparkles, Trash2, Check, Sun, Moon, Monitor, SpellCheck, Loader2
} from "lucide-react";
import { m, AnimatePresence } from "framer-motion";
import { cn } from "@/src/lib/utils";
import { useFullscreenContext } from "@/src/contexts/FullscreenContext";
import { useFocusModeIntegration } from '@/src/contexts/FocusModeControlsContext';
import { useProgress } from "@/src/contexts/ProgressContext";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { DropZone } from "@/components/ui/DropZone";
import { useToast } from "@/components/ui/Toast";
import { blobManager } from "@/src/lib/blob-manager";

import { MarkdownService } from "../MarkdownService";
import { documentRevision } from "../DocumentRevision";
import { workerManager } from "@/src/workers/manager";
import { useGrammarStore } from "@/src/features/grammar-checker/store";
import { tokenizeMarkdownForSpellCheck } from "../utils/markdown-spell-tokenizer";
import { applySpellMarkers, clearSpellMarkers, SpellMarker } from "../utils/markdown-spell-markers";
import Editor from "@monaco-editor/react";
import { defineMonacoThemes } from "@/src/core/monaco/MonacoTheme";
import { StatBar } from "./StatBar";
import { Toolbar } from "./Toolbar";
import { FindBar } from "./FindBar";
import { MarkdownPreview } from "./MarkdownPreview";
import { MarkdownVisualEditor } from "./MarkdownVisualEditor";
import { SAMPLE_MARKDOWN } from "../constants";
import { MermaidExportBarrier } from "../mermaid/export-barrier";
import { waitForDocumentReady } from "../mermaid/utils/export-barrier";

type EditorTab = "split" | "write" | "visual" | "preview";

async function yieldToMain(): Promise<void> {
  if (typeof window !== "undefined" && "scheduler" in window && typeof (window as any).scheduler?.yield === "function") {
    await (window as any).scheduler.yield();
  } else {
    await new Promise((resolve) => setTimeout(resolve, 30));
  }
}

export function MarkdownEditor() {
  const { toast } = useToast();
  const { startProcessing, setStage, setProgress, finishProcessing } = useProgress();
  const [exportingFormat, setExportingFormat] = useState<"html" | "pdf" | "word" | null>(null);
  const [mode, setMode] = useState<"editor" | "upload">("editor");
  const [activeTab, setActiveTab] = useState<EditorTab>("write");
  const [md, setMd] = useState(SAMPLE_MARKDOWN);
  const [uploadMd, setUploadMd] = useState("");
  const [fileName, setFileName] = useState("");
  const [fontSize, setFontSize] = useState(14);
  const [wordWrap, setWordWrap] = useState(true);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [scrollSync, setScrollSync] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showFind, setShowFind] = useState(false);
  const [findState, setFindState] = useState({ matches: [] as number[], index: 0, query: "" });
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [editorThemeMode, setEditorThemeMode] = useState<"auto" | "dark" | "light">("auto");
  const [systemIsDark, setSystemIsDark] = useState(true);

  // Spell Check State
  const [spellCheckEnabled, setSpellCheckEnabled] = useState(false);
  const [spellMarkers, setSpellMarkers] = useState<SpellMarker[]>([]);
  const [hoveredSpellMarker, setHoveredSpellMarker] = useState<SpellMarker | null>(null);
  const [hoverPos, setHoverPos] = useState({ top: 0, left: 0 });
  const spellAbortRef = useRef<AbortController | null>(null);
  const { ignoredWords, addIgnoredWord } = useGrammarStore();

  // Monitor DOM/system dark theme changes
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const checkTheme = () => {
      const isDark =
        document.documentElement.getAttribute('data-theme') === 'dark' ||
        document.documentElement.classList.contains('dark') ||
        (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches);
      setSystemIsDark(!!isDark);
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class'] });
    return () => observer.disconnect();
  }, []);

  const activeEditorTheme = useMemo(() => {
    if (editorThemeMode === "light") return "karuvi-light";
    if (editorThemeMode === "dark") return "karuvi-dark";
    return systemIsDark ? "karuvi-dark" : "karuvi-light";
  }, [editorThemeMode, systemIsDark]);

  const { isFullscreen, activeToolId } = useFullscreenContext();
  const isThisToolFullscreen = isFullscreen && activeToolId === "markdown";

  const editorRef = useRef<any>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const uploadPreviewRef = useRef<HTMLDivElement>(null);

  const activeMd = mode === "editor" ? md : uploadMd;
  const [html, setHtml] = useState("");
  
  useEffect(() => {
    documentRevision.bump();
    let active = true;
    const debounceMs = activeMd.length > 50000 ? 150 : 0;
    
    const timer = setTimeout(() => {
      MarkdownService.parse(activeMd).then(res => {
        if (active) setHtml(res);
      });
    }, debounceMs);

    return () => { 
      active = false;
      clearTimeout(timer);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [activeMd]);

  // Spell check logic
  useEffect(() => {
    if (!spellCheckEnabled || !editorRef.current || mode !== "editor") {
      clearSpellMarkers((window as any).monaco, editorRef.current);
      setSpellMarkers([]);
      setHoveredSpellMarker(null);
      return;
    }

    if (activeMd.length > 500000) { // Limit to 500KB
      clearSpellMarkers((window as any).monaco, editorRef.current);
      return;
    }

    if (spellAbortRef.current) {
      spellAbortRef.current.abort();
    }
    const abortController = new AbortController();
    spellAbortRef.current = abortController;

    const rev = documentRevision.capture();
    
    const timer = setTimeout(async () => {
      try {
        const tokenized = tokenizeMarkdownForSpellCheck(activeMd);
        const res = await workerManager.checkGrammar(tokenized.plainText, ignoredWords, 'standard', undefined, abortController.signal);
        
        if (!documentRevision.isCurrent(rev)) return;
        if (abortController.signal.aborted) return;
        
        const spellingErrors = res.errors.filter((e: any) => e.type === 'spelling');
        const markers = applySpellMarkers((window as any).monaco, editorRef.current, spellingErrors, tokenized);
        setSpellMarkers(markers);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error("Spell check error:", err);
        }
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [activeMd, spellCheckEnabled, ignoredWords, mode]);

  const spellMarkersRef = useRef<SpellMarker[]>([]);
  useEffect(() => { spellMarkersRef.current = spellMarkers; }, [spellMarkers]);

  const handleApplySpellFix = useCallback((marker: SpellMarker, replacement: string) => {
    if (!editorRef.current) return;
    const model = editorRef.current.getModel();
    if (!model) return;
    const monaco = (window as any).monaco;

    editorRef.current.executeEdits("spell-check", [{
      range: new monaco.Range(marker.startLineNumber, marker.startColumn, marker.endLineNumber, marker.endColumn),
      text: replacement,
      forceMoveMarkers: true,
    }]);
    setHoveredSpellMarker(null);
  }, []);

  const handleIgnoreWord = useCallback((marker: SpellMarker) => {
    const word = activeMd.substring(marker.rawOffset, marker.rawOffset + marker.rawLength);
    addIgnoredWord(word.toLowerCase());
    setHoveredSpellMarker(null);
    setSpellMarkers(prev => prev.filter(m => m.errorId !== marker.errorId));
  }, [activeMd, addIgnoredWord]);

  const stats = useMemo(() => MarkdownService.getStats(activeMd), [activeMd]);

  useFocusModeIntegration({
    wordCount: stats.words,
    charCount: stats.chars,
    lineCount: stats.lines,
    language: "markdown",
    onFontSizeChange: setFontSize,
    onWrapToggle: () => setWordWrap(v => !v)
  });

  // Insert text / snippets at cursor — editorRef holds the Monaco editor instance
  const insertAtCursor = useCallback((before: string, after = "", insert = "") => {
    const editor = editorRef.current;
    if (!editor) return;
    const model = editor.getModel();
    if (!model) return;

    const selection = editor.getSelection();
    const selectedText = selection ? model.getValueInRange(selection) : "";
    const text = insert || (before + selectedText + after);

    editor.executeEdits("insertAtCursor", [{
      range: selection || new (window as any).monaco.Range(1, 1, 1, 1),
      text,
      forceMoveMarkers: true,
    }]);
    editor.focus();
  }, []);

  // Download Markdown file (.md)
  const handleDownloadMd = useCallback(() => {
    const content = mode === "editor" ? md : uploadMd;
    if (!content.trim()) {
      toast("Nothing to download", "error");
      return;
    }
    const name = fileName ? fileName.replace(/\.md$/i, "") : "document";
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = blobManager.create(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name}.md`;
    a.click();
    blobManager.revoke(url);
    toast("Downloaded markdown file (.md)");
  }, [mode, md, uploadMd, fileName, toast]);

  // Copy raw Markdown
  const handleCopyMd = useCallback(() => {
    const content = mode === "editor" ? md : uploadMd;
    if (!content.trim()) {
      toast("Nothing to copy", "error");
      return;
    }
    navigator.clipboard.writeText(content);
    toast("Markdown copied to clipboard!");
  }, [mode, md, uploadMd, toast]);

  // Copy rendered HTML
  const handleCopyHtml = useCallback(() => {
    if (!html.trim()) {
      toast("Nothing to copy", "error");
      return;
    }
    navigator.clipboard.writeText(html);
    toast("Rendered HTML copied to clipboard!");
  }, [html, toast]);

  // Monaco handles Tab / indentation natively. This registers Ctrl shortcuts via the editor's addAction API
  // and is wired via the onMount callback — no separate keydown handler needed on a DOM element.
  // The handleEditorMount function registers these actions when the Monaco editor mounts.
  const handleEditorMount = useCallback((editor: any, monaco: any) => {
    editorRef.current = editor;

    // Register Ctrl+B / Ctrl+I / Ctrl+K shortcuts inside Monaco
    editor.addAction({
      id: "kv-bold", label: "Bold", keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyB],
      run: () => insertAtCursor("**", "**"),
    });
    editor.addAction({
      id: "kv-italic", label: "Italic", keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyI],
      run: () => insertAtCursor("*", "*"),
    });
    editor.addAction({
      id: "kv-link", label: "Link", keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK],
      run: () => insertAtCursor("[", "](url)"),
    });
    editor.addAction({
      id: "kv-find", label: "Find & Replace", keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyF],
      run: () => setShowFind(prev => !prev),
    });
    editor.addAction({
      id: "kv-save", label: "Download Markdown", keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS],
      run: () => handleDownloadMd(),
    });

    // Scroll sync: editor → preview
    editor.onDidScrollChange((e: any) => {
      if (!scrollSync || activeTab !== "split" || isScrollingRef.current === "preview") return;
      isScrollingRef.current = "textarea";
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => { isScrollingRef.current = null; }, 50);

      if (previewRef.current) {
        const maxScrollEditor = editor.getScrollHeight() - editor.getLayoutInfo().height;
        const maxScrollPreview = previewRef.current.scrollHeight - previewRef.current.clientHeight;
        if (maxScrollEditor > 0) {
          previewRef.current.scrollTop = (e.scrollTop / maxScrollEditor) * maxScrollPreview;
        }
      }
    });

    editor.onDidChangeCursorPosition((e: any) => {
      const pos = e.position;
      const marker = spellMarkersRef.current.find(m => 
        pos.lineNumber >= m.startLineNumber && pos.lineNumber <= m.endLineNumber &&
        pos.column >= m.startColumn && pos.column <= m.endColumn
      );
      if (marker) {
        const coords = editor.getScrolledVisiblePosition(pos);
        if (coords) {
          setHoverPos({ top: coords.top + 25, left: coords.left });
          setHoveredSpellMarker(marker);
        }
      } else {
        setHoveredSpellMarker(null);
      }
    });
  }, [insertAtCursor, handleDownloadMd, scrollSync, activeTab]);

  // Find & Replace logic — uses Monaco model API
  const handleFind = useCallback((query: string, focusEditor = false) => {
    if (!query || !editorRef.current) {
      setFindState({ matches: [], index: 0, query: "" });
      return;
    }
    const model = editorRef.current.getModel();
    if (!model) return;
    const text = model.getValue();
    const re = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    const matches: number[] = [];
    let matchResult;
    while ((matchResult = re.exec(text)) !== null) matches.push(matchResult.index);
    setFindState({ matches, index: 0, query });

    if (matches.length > 0 && matches[0] !== undefined) {
      const firstMatch = matches[0];
      const pos = model.getPositionAt(firstMatch);
      const endPos = model.getPositionAt(firstMatch + query.length);
      const monaco = (window as any).monaco;
      if (monaco?.Range) {
        editorRef.current.setSelection(new monaco.Range(pos.lineNumber, pos.column, endPos.lineNumber, endPos.column));
      }
      editorRef.current.revealPositionInCenter(pos);
      if (focusEditor) {
        editorRef.current.focus();
      }
    }
  }, []);

  const navigateFindMatch = useCallback((nextIndex: number) => {
    const { matches, query } = findState;
    if (matches.length === 0 || !editorRef.current) return;
    const count = matches.length;
    const boundedIndex = ((nextIndex % count) + count) % count;
    setFindState(s => ({ ...s, index: boundedIndex }));
    const matchPos = matches[boundedIndex];
    if (matchPos === undefined) return;
    const model = editorRef.current.getModel();
    if (!model) return;
    const qLen = query ? query.length : 1;
    const pos = model.getPositionAt(matchPos);
    const endPos = model.getPositionAt(matchPos + qLen);
    const monaco = (window as any).monaco;
    if (monaco?.Range) {
      editorRef.current.setSelection(new monaco.Range(pos.lineNumber, pos.column, endPos.lineNumber, endPos.column));
    }
    editorRef.current.revealPositionInCenter(pos);
  }, [findState]);

  const handleReplace = useCallback((query: string, replacement: string, all: boolean) => {
    if (!query || !editorRef.current) return;
    const model = editorRef.current.getModel();
    if (!model) return;
    const text = model.getValue();
    let nextText = "";
    if (all) {
      const re = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
      nextText = text.replace(re, replacement);
      toast(`Replaced all occurrences of "${query}"`);
    } else {
      const { matches, index } = findState;
      const start = matches[index];
      if (start === undefined) return;
      nextText = text.slice(0, start) + replacement + text.slice(start + query.length);
      toast(`Replaced 1 occurrence of "${query}"`);
    }
    setMd(nextText);
    handleFind(query, false);
  }, [findState, handleFind, toast]);

  // Synchronized scrolling
  const isScrollingRef = useRef<"textarea" | "preview" | null>(null);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Preview → Editor reverse scroll sync (Editor → Preview is handled in handleEditorMount via onDidScrollChange)
  const handlePreviewScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    if (!scrollSync || activeTab !== "split" || isScrollingRef.current === "textarea") return;

    const prev = e.currentTarget;
    isScrollingRef.current = "preview";
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

    if (editorRef.current) {
      const pct = prev.scrollTop / (prev.scrollHeight - prev.clientHeight || 1);
      const maxScrollEditor = editorRef.current.getScrollHeight() - editorRef.current.getLayoutInfo().height;
      editorRef.current.setScrollTop(pct * maxScrollEditor);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      isScrollingRef.current = null;
    }, 100);
  }, [scrollSync, activeTab]);

  // File Upload via DropZone or Drag & Drop
  const handleFileUpload = useCallback((files: File[] | FileList) => {
    const fileArray = Array.from(files);
    const file = fileArray[0];
    if (!file) return;
    if (!file.name.match(/\.(md|markdown|txt)$/i)) {
      toast("Only Markdown (.md) or text (.txt) files are supported", "error");
      return;
    }
    if (file.size > 5000000) {
      toast("File size exceeds 5MB limit", "error");
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
  }, [toast]);

  // Direct editor drag & drop
  const handleEditorDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    if (file.size > 5000000) {
      toast("File size exceeds 5MB limit", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = (ev.target?.result as string) || "";
      setMd(text);
      setFileName(file.name);
      toast(`Loaded ${file.name}`);
    };
    reader.readAsText(file);
  }, [toast]);

  // Export Logic (HTML, PDF, Word)
  const handleExport = async (format: "html" | "pdf" | "word") => {
    const content = mode === "editor" ? md : uploadMd;
    if (!content.trim()) {
      toast("Nothing to export", "error");
      return;
    }

    // Ensure all active Mermaid diagram rendering, fonts, and images are ready before exporting
    try {
      const { waitForDocumentReady } = await import("../mermaid/utils/export-barrier");
      const targetElement = (mode === "editor" ? previewRef : uploadPreviewRef).current;
      const readiness = await waitForDocumentReady(targetElement);
      if (readiness.revisionChanged) {
        toast("Document was modified during export preparation. Please try again.", "error");
        return;
      }
    } catch {
      // Non-blocking fallback
    }

    const name = fileName ? fileName.replace(/\.md$/i, "") : "document";

    if (format === "html") {
      const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name}</title>
  <style>
    :root {
      --bg: #ffffff;
      --text: #1f2328;
      --border: #d0d7de;
      --code-bg: #f6f8fa;
      --header-bg: #f6f8fa;
      --link: #0969da;
    }
    @media (prefers-color-scheme: dark) {
      :root {
        --bg: #0d1117;
        --text: #e6edf3;
        --border: #30363d;
        --code-bg: #161b22;
        --header-bg: #161b22;
        --link: #4493f8;
      }
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: var(--text);
      background-color: var(--bg);
      max-width: 860px;
      margin: 40px auto;
      padding: 0 24px;
    }
    h1, h2, h3, h4, h5, h6 { margin-top: 24px; margin-bottom: 16px; font-weight: 600; line-height: 1.25; }
    h1 { font-size: 2em; border-bottom: 1px solid var(--border); padding-bottom: 0.3em; }
    h2 { font-size: 1.5em; border-bottom: 1px solid var(--border); padding-bottom: 0.3em; }
    a { color: var(--link); text-decoration: none; }
    a:hover { text-decoration: underline; }
    pre {
      position: relative;
      background: var(--code-bg);
      padding: 16px;
      border-radius: 8px;
      border: 1px solid var(--border);
      overflow-x: auto;
      font-size: 85%;
    }
    code {
      font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
      background: var(--code-bg);
      padding: 0.2em 0.4em;
      border-radius: 4px;
      font-size: 85%;
    }
    pre code { background: transparent; padding: 0; }
    blockquote {
      border-left: 4px solid var(--border);
      margin: 16px 0;
      padding: 0 16px;
      color: #656d76;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 16px 0;
      display: block;
      overflow-x: auto;
    }
    th, td {
      border: 1px solid var(--border);
      padding: 8px 14px;
      text-align: left;
    }
    th {
      background-color: var(--header-bg);
      font-weight: 600;
    }
    img { max-width: 100%; height: auto; border-radius: 8px; }
    hr { height: 1px; background-color: var(--border); border: 0; margin: 24px 0; }
    .mermaid-box {
      margin: 20px 0;
      padding: 16px;
      border: 1px solid var(--border);
      border-radius: 8px;
      background: var(--code-bg);
      display: flex;
      justify-content: center;
      overflow-x: auto;
    }
    .mermaid-box foreignObject div, .mermaid-box foreignObject span, .mermaid-box foreignObject p {
      margin: 0 !important;
      padding: 0 !important;
      line-height: 1.3 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      text-align: center !important;
    }
    .copy-btn {
      position: absolute;
      top: 8px;
      right: 8px;
      padding: 4px 8px;
      font-size: 11px;
      font-weight: 600;
      color: var(--text);
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: 6px;
      cursor: pointer;
      opacity: 0.8;
      transition: opacity 0.2s;
    }
    .copy-btn:hover { opacity: 1; border-color: var(--link); color: var(--link); }
  </style>
</head>
<body>
  ${html}

  <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
  <script>
    document.addEventListener("DOMContentLoaded", function() {
      // Initialize Code Copy Buttons
      document.querySelectorAll("pre").forEach(function(pre) {
        var btn = document.createElement("button");
        btn.className = "copy-btn";
        btn.textContent = "Copy";
        btn.onclick = function() {
          var code = pre.querySelector("code") ? pre.querySelector("code").innerText : pre.innerText;
          navigator.clipboard.writeText(code).then(function() {
            btn.textContent = "Copied!";
            setTimeout(function() { btn.textContent = "Copy"; }, 2000);
          });
        };
        pre.appendChild(btn);
      });

      // Initialize Mermaid Diagrams
      if (typeof mermaid !== "undefined") {
        var isDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
        mermaid.initialize({
          startOnLoad: false,
          theme: isDark ? "dark" : "default",
          securityLevel: "loose"
        });

        document.querySelectorAll(".mermaid-placeholder").forEach(function(ph, idx) {
          var src = decodeURIComponent(ph.getAttribute("data-src") || "");
          var container = document.createElement("div");
          container.className = "mermaid-box";
          var mDiv = document.createElement("div");
          mDiv.className = "mermaid";
          mDiv.textContent = src;
          container.appendChild(mDiv);
          ph.replaceWith(container);
        });

        mermaid.run();
      }
    });
  </script>
</body>
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
      let tempContainer: HTMLDivElement | null = null;
      let exportContainer: HTMLDivElement | null = null;

      startProcessing("heavy");
      setStage("Preparing document for PDF export...");
      setProgress(15);
      await yieldToMain();

      try {
        let element: HTMLElement | null = mode === "editor" ? previewRef.current : uploadPreviewRef.current;

        if (!element) {
          // If the user is on the Write or Visual tab, previewRef.current is not mounted in the DOM.
          // Render the current parsed HTML into an off-screen container.
          tempContainer = document.createElement("div");
          tempContainer.className = "markdown-body";
          tempContainer.style.position = "fixed";
          tempContainer.style.left = "-9999px";
          tempContainer.style.top = "0";
          tempContainer.style.width = "794px";
          tempContainer.style.visibility = "visible";
          tempContainer.innerHTML = html;
          document.body.appendChild(tempContainer);
          element = tempContainer;
        }

        if (!element) {
          finishProcessing(false);
          toast("Preview not ready", "error");
          return;
        }

        // 1. Wait for document readiness: Mermaid rendering queue, web fonts, and images
        setStage("Rendering Mermaid diagrams & typography...");
        setProgress(35);
        await yieldToMain();

        const readiness = await waitForDocumentReady(element, 8000);
        if (readiness.revisionChanged) {
          finishProcessing(false);
          toast("Document modified during export preparation. Please retry.", "error");
          return;
        }

        setStage("Rasterizing vector diagrams & structure...");
        setProgress(55);
        await yieldToMain();

        const rawContent = element.querySelector(".markdown-body") || element;
        const clone = rawContent.cloneNode(true) as HTMLElement;
        
        // Remove interactive UI buttons
        clone.querySelectorAll(".copy-code-btn, .mmd-copy, button, .flex.items-center.justify-between").forEach(el => el.remove());

        // Resolve any unrendered .mermaid-placeholder elements inside the clone
        const unrenderedPlaceholders = Array.from(clone.querySelectorAll<HTMLElement>('.mermaid-placeholder'));
        if (unrenderedPlaceholders.length > 0) {
          const { mermaidManager } = await import('../mermaid/MermaidRenderManager');
          const { MermaidPreflightAnalyzer } = await import('../mermaid/MermaidPreflight');
          const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
          const theme = isDark ? 'dark' : 'light';

          await Promise.all(
            unrenderedPlaceholders.map(async (ph, idx) => {
              const src = decodeURIComponent(ph.getAttribute('data-src') || '');
              const hash = MermaidPreflightAnalyzer.computeHash(src, theme);
              const block = {
                id: `mmd-pdf-${hash.substring(0, 8)}-${idx}`,
                source: src,
                hash,
                index: idx,
                lang: ph.getAttribute('data-lang') || 'mermaid',
              };
              const res = await mermaidManager.renderDiagram(block, { priority: 'immediate', theme });
              if (res.svg) {
                const wrapper = document.createElement('div');
                wrapper.className = 'mermaid-container';
                wrapper.innerHTML = res.svg;
                ph.replaceWith(wrapper);
              }
            })
          );
        }

        // 2. Utilize specialized MermaidExporter to convert all complex SVG diagrams to high-DPI raster PNGs
        await MermaidExportBarrier.adaptForPdf(clone, 2);
        await yieldToMain();

        const allElements = [clone, ...Array.from(clone.querySelectorAll("*"))];
        for (const el of allElements) {
          if (el instanceof HTMLElement) {
            el.className = el.className
              .replace(/\b(bg|text|border|shadow|ring|backdrop|from|to|via)-[^\s]+/g, "")
              .trim();
          }
        }

        exportContainer = document.createElement("div");
        exportContainer.className = "markdown-body";
        exportContainer.style.position = "fixed";
        exportContainer.style.left = "-9999px";
        exportContainer.style.top = "0";
        exportContainer.style.width = "794px"; // A4 pixel width at 96 DPI
        exportContainer.style.padding = "20px";
        exportContainer.style.backgroundColor = "#ffffff";
        exportContainer.style.color = "#24292e";
        exportContainer.style.fontFamily = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";
        exportContainer.style.zIndex = "-1000";
        exportContainer.style.visibility = "visible";
        
        const style = document.createElement("style");
        style.innerHTML = `
          * { box-sizing: border-box !important; color: #24292e !important; border-color: #d0d7de !important; }
          .markdown-body { font-size: 14px !important; line-height: 1.6 !important; background: #ffffff !important; padding: 0 !important; }
          .markdown-body h1 { font-size: 2em !important; margin-bottom: 16px !important; font-weight: 600 !important; border-bottom: 1px solid #eaecef !important; padding-bottom: 0.3em !important; }
          .markdown-body h2 { font-size: 1.5em !important; margin-top: 24px !important; margin-bottom: 16px !important; font-weight: 600 !important; border-bottom: 1px solid #eaecef !important; padding-bottom: 0.3em !important; }
          .markdown-body h3 { font-size: 1.25em !important; margin-top: 24px !important; margin-bottom: 16px !important; font-weight: 600 !important; }
          .markdown-body p { margin-top: 0 !important; margin-bottom: 16px !important; }
          .markdown-body pre { background-color: #f6f8fa !important; border: 1px solid #d0d7de !important; border-radius: 6px !important; padding: 16px !important; margin-bottom: 16px !important; white-space: pre-wrap !important; word-break: break-all !important; }
          .markdown-body code { font-family: "SFMono-Regular", Consolas, Menlo, monospace !important; background-color: #f1f3f5 !important; border-radius: 3px !important; padding: 0.2em 0.4em !important; font-size: 85% !important; }
          .markdown-body pre code { background-color: transparent !important; padding: 0 !important; font-size: 100% !important; }
          .markdown-body blockquote { border-left: 0.25em solid #dfe2e5 !important; color: #6a737d !important; padding: 0 1em !important; margin: 0 0 16px 0 !important; }
          .markdown-body table { border-collapse: collapse !important; width: 100% !important; margin-bottom: 16px !important; table-layout: fixed !important; word-break: break-word !important; }
          .markdown-body th, .markdown-body td { border: 1px solid #dfe2e5 !important; padding: 6px 13px !important; text-align: left !important; }
          .markdown-body th { background-color: #f6f8fa !important; font-weight: 600 !important; }
          .markdown-body img { max-width: 100% !important; background-color: #ffffff !important; }
          .markdown-body svg { max-width: 100% !important; height: auto !important; }
          .markdown-body ul, .markdown-body ol { padding-left: 2em !important; margin-bottom: 16px !important; }
        `;
        exportContainer.appendChild(style);
        exportContainer.appendChild(clone);
        document.body.appendChild(exportContainer);

        setStage("Generating PDF layout & pages...");
        setProgress(75);
        await yieldToMain();

        const html2pdf = (await import("html2pdf.js")).default;
        
        const opt = {
          margin: [10, 10, 10, 10] as [number, number, number, number],
          filename: `${name}.pdf`,
          image: { type: "jpeg" as const, quality: 0.95 },
          html2canvas: { 
            scale: 1.5, 
            useCORS: true, 
            letterRendering: true,
            logging: false,
            scrollY: 0,
            windowWidth: 794
          },
          jsPDF: { unit: "mm" as const, format: "a4" as const, orientation: "portrait" as const },
          pagebreak: { mode: ["avoid-all", "css", "legacy"] }
        };

        setStage("Compiling PDF binary file...");
        setProgress(90);
        await yieldToMain();

        await html2pdf().set(opt).from(exportContainer).save();
        
        setProgress(100);
        finishProcessing(true);
        toast("PDF exported successfully!");
      } catch (err) {
        finishProcessing(false);
        toast("PDF export failed", "error");
      } finally {
        if (exportContainer && exportContainer.parentNode) {
          exportContainer.parentNode.removeChild(exportContainer);
        }
        if (tempContainer && tempContainer.parentNode) {
          tempContainer.parentNode.removeChild(tempContainer);
        }
        setExportingFormat(null);
      }
    } else if (format === "word") {
      try {
        const { Packer } = await import("docx");
        const { convertMarkdownToDocx } = await import("../utils/markdown-docx");
        const doc = convertMarkdownToDocx(activeMd, name);
        const blob = await Packer.toBlob(doc);
        const url = blobManager.create(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${name}.docx`;
        a.click();
        blobManager.revoke(url);
        toast("Word document exported!");
      } catch (err) {
        toast("Word export failed", "error");
      }
    }
  };

  return (
    <div className={cn(
      "w-full",
      isThisToolFullscreen 
        ? "h-full flex flex-col flex-1 min-h-0 space-y-3" 
        : "space-y-3 sm:space-y-4"
    )}>
      {/* Header Controls */}
      <div className="flex flex-col xl:flex-row gap-3 items-stretch xl:items-center justify-between shrink-0 max-w-full min-w-0">
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 w-full xl:w-auto max-w-full min-w-0">
          {/* Main Mode Toggle */}
          <div className="flex items-center shrink-0 max-w-full min-w-0">
            <SegmentedControl
              options={[
                { id: "editor", label: "Editor", icon: <FileEdit className="w-4 h-4" /> },
                { id: "upload", label: "Upload", icon: <Upload className="w-4 h-4" /> },
              ]}
              activeId={mode}
              onChange={(id) => setMode(id as any)}
            />
          </div>

          {/* Quad Mode Segmented Control */}
          {mode === "editor" && (
            <div className="flex items-center shrink-0 max-w-full min-w-0 overflow-x-auto no-scrollbar">
              <SegmentedControl
                options={[
                  { id: "split", label: "Split", icon: <Columns className="w-4 h-4" />, className: "hidden md:flex" },
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

        {/* Action Buttons */}
        <div className="flex items-center justify-start xl:justify-end w-full xl:w-auto gap-1.5 sm:gap-2 flex-wrap shrink-0">
          {/* Quick Theme Toggle */}
          <button
            onClick={() => {
              setEditorThemeMode(m => {
                const next = m === "dark" ? "light" : m === "light" ? "auto" : "dark";
                const target = next === "auto" 
                  ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
                  : next;
                document.documentElement.setAttribute("data-theme", target);
                document.documentElement.classList.toggle("dark", target === "dark");
                return next;
              });
            }}
            className={cn(
              "p-2 rounded-xl border transition-all cursor-pointer",
              editorThemeMode !== "auto" 
                ? "bg-blue/10 border-blue text-blue" 
                : "bg-surface border-border text-text-3 hover:border-blue hover:text-blue"
            )}
            title={`Editor Theme: ${editorThemeMode.toUpperCase()} (Click to toggle Dark/Light/Auto)`}
            aria-label="Toggle Editor Theme"
          >
            {activeEditorTheme === "karuvi-light" ? (
              <Sun className="w-4 h-4 text-amber-500" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>

          {/* Find & Replace Toggle */}
          <button
            onClick={() => setShowFind(!showFind)}
            className={cn(
              "p-2 rounded-xl border transition-all cursor-pointer",
              showFind 
                ? "bg-blue text-white border-blue shadow-xs" 
                : "bg-surface border-border text-text-3 hover:border-blue hover:text-blue"
            )}
            title="Find & Replace (Ctrl+F)"
            aria-label="Find and Replace"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Editor Settings Toggle */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={cn(
              "p-2 rounded-xl border transition-all cursor-pointer",
              showSettings 
                ? "bg-blue text-white border-blue shadow-xs" 
                : "bg-surface border-border text-text-3 hover:border-blue hover:text-blue"
            )}
            title="Editor Settings & Config"
            aria-label="Editor Settings"
          >
            <Settings2 className="w-4 h-4" />
          </button>
          
          <div className="w-px h-6 bg-border mx-0.5 hidden sm:block" />

          {/* Quick Copy & Download Actions */}
          <button
            onClick={handleCopyMd}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 bg-surface border border-border rounded-xl text-tiny font-bold uppercase tracking-widest-sm text-text-3 hover:border-blue hover:text-blue hover:bg-blue/5 transition-all cursor-pointer"
            title="Copy Markdown Source"
            aria-label="Copy Markdown"
          >
            <Copy className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Copy MD</span>
          </button>

          <button
            onClick={handleDownloadMd}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 bg-surface border border-border rounded-xl text-tiny font-bold uppercase tracking-widest-sm text-text-3 hover:border-blue hover:text-blue hover:bg-blue/5 transition-all cursor-pointer"
            title="Download .md file (Ctrl+S)"
            aria-label="Download Markdown File"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download</span>
          </button>

          {/* Export Menu */}
          <div className="flex bg-surface border border-border rounded-xl overflow-hidden shadow-xs shrink-0">
            <button
              onClick={() => handleExport("html")}
              disabled={exportingFormat !== null}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-2 text-tiny font-bold uppercase tracking-widest-sm text-text-3 hover:bg-blue/10 hover:text-blue transition-all border-r border-border cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              title="Export HTML"
            >
              {exportingFormat === "html" ? <Loader2 className="w-3.5 h-3.5 animate-spin text-blue" /> : <Code2 className="w-3.5 h-3.5" />} HTML
            </button>
            <button
              onClick={() => handleExport("pdf")}
              disabled={exportingFormat !== null}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-2 text-tiny font-bold uppercase tracking-widest-sm text-text-3 hover:bg-blue/10 hover:text-blue transition-all border-r border-border cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              title="Export PDF"
            >
              {exportingFormat === "pdf" ? <Loader2 className="w-3.5 h-3.5 animate-spin text-blue" /> : <FileText className="w-3.5 h-3.5" />} PDF
            </button>
            <button
              onClick={() => handleExport("word")}
              disabled={exportingFormat !== null}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-2 text-tiny font-bold uppercase tracking-widest-sm text-text-3 hover:bg-blue/10 hover:text-blue transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              title="Export Word Document (.docx)"
            >
              {exportingFormat === "word" ? <Loader2 className="w-3.5 h-3.5 animate-spin text-blue" /> : <FileCode className="w-3.5 h-3.5" />} Word
            </button>
          </div>
        </div>
      </div>

      {/* Collapsible Editor Settings Panel */}
      <AnimatePresence>
        {showSettings && mode === "editor" && (
          <m.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden shrink-0"
          >
            <div className="flex flex-wrap items-center gap-3 p-3 bg-surface border border-border rounded-2xl text-xs font-bold">
              {/* Editor Theme Option */}
              <div className="flex items-center gap-2">
                <span className="text-text-4 uppercase tracking-widest-sm text-tiny">Theme</span>
                <div className="flex items-center bg-bg rounded-xl border border-border overflow-hidden p-0.5">
                  <button
                    onClick={() => setEditorThemeMode("dark")}
                    className={cn(
                      "flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer",
                      editorThemeMode === "dark" ? "bg-surface text-blue shadow-xs" : "text-text-3 hover:text-text"
                    )}
                    title="Dark Theme"
                  >
                    <Moon className="w-3.5 h-3.5" />
                    <span>Dark</span>
                  </button>
                  <button
                    onClick={() => setEditorThemeMode("light")}
                    className={cn(
                      "flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer",
                      editorThemeMode === "light" ? "bg-surface text-blue shadow-xs" : "text-text-3 hover:text-text"
                    )}
                    title="Light Theme"
                  >
                    <Sun className="w-3.5 h-3.5" />
                    <span>Light</span>
                  </button>
                  <button
                    onClick={() => setEditorThemeMode("auto")}
                    className={cn(
                      "flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer",
                      editorThemeMode === "auto" ? "bg-surface text-blue shadow-xs" : "text-text-3 hover:text-text"
                    )}
                    title="Auto (System Theme)"
                  >
                    <Monitor className="w-3.5 h-3.5" />
                    <span>Auto</span>
                  </button>
                </div>
              </div>

              {/* Font Size Stepper */}
              <div className="flex items-center gap-2">
                <span className="text-text-4 uppercase tracking-widest-sm text-tiny">Font Size</span>
                <div className="flex items-center bg-bg rounded-xl border border-border overflow-hidden">
                  <button
                    onClick={() => setFontSize(v => Math.max(10, v - 2))}
                    disabled={fontSize <= 10}
                    className="px-2.5 py-1 text-text-3 hover:text-blue hover:bg-surface disabled:opacity-30 transition-all font-mono cursor-pointer"
                    aria-label="Decrease Font Size"
                  >
                    A-
                  </button>
                  <span className="px-2 text-text font-mono border-x border-border min-w-8 text-center">
                    {fontSize}px
                  </span>
                  <button
                    onClick={() => setFontSize(v => Math.min(24, v + 2))}
                    disabled={fontSize >= 24}
                    className="px-2.5 py-1 text-text-3 hover:text-blue hover:bg-surface disabled:opacity-30 transition-all font-mono cursor-pointer"
                    aria-label="Increase Font Size"
                  >
                    A+
                  </button>
                </div>
              </div>

              {/* Word Wrap Toggle */}
              <button
                onClick={() => setWordWrap(!wordWrap)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all text-xs font-bold cursor-pointer",
                  wordWrap 
                    ? "bg-blue/10 border-blue text-blue" 
                    : "bg-bg border-border text-text-3 hover:border-blue/40"
                )}
                aria-pressed={wordWrap}
              >
                <AlignLeft className="w-3.5 h-3.5" />
                <span>Word Wrap: {wordWrap ? "ON" : "OFF"}</span>
              </button>

              {/* Line Numbers Toggle */}
              <button
                onClick={() => setShowLineNumbers(!showLineNumbers)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all text-xs font-bold cursor-pointer",
                  showLineNumbers 
                    ? "bg-blue/10 border-blue text-blue" 
                    : "bg-bg border-border text-text-3 hover:border-blue/40"
                )}
                aria-pressed={showLineNumbers}
              >
                <Hash className="w-3.5 h-3.5" />
                <span>Line Numbers: {showLineNumbers ? "ON" : "OFF"}</span>
              </button>

              {/* Spell Check Toggle */}
              <button
                onClick={() => setSpellCheckEnabled(!spellCheckEnabled)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all text-xs font-bold cursor-pointer",
                  spellCheckEnabled 
                    ? "bg-blue/10 border-blue text-blue" 
                    : "bg-bg border-border text-text-3 hover:border-blue/40"
                )}
                aria-pressed={spellCheckEnabled}
              >
                <SpellCheck className="w-3.5 h-3.5" />
                <span>Spell Check: {spellCheckEnabled ? "ON" : "OFF"}</span>
              </button>

              {/* Scroll Sync Toggle (Split Mode) */}
              <button
                onClick={() => setScrollSync(!scrollSync)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all text-xs font-bold cursor-pointer",
                  scrollSync 
                    ? "bg-blue/10 border-blue text-blue" 
                    : "bg-bg border-border text-text-3 hover:border-blue/40"
                )}
                aria-pressed={scrollSync}
              >
                <RefreshCw className={cn("w-3.5 h-3.5", scrollSync && "animate-spin-slow")} />
                <span>Scroll Sync: {scrollSync ? "ON" : "OFF"}</span>
              </button>

              {/* Copy Rendered HTML */}
              <button
                onClick={handleCopyHtml}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-bg text-text-3 hover:border-blue hover:text-blue transition-all ml-auto cursor-pointer"
                title="Copy rendered HTML code"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Copy HTML</span>
              </button>
            </div>
          </m.div>
        )}
      </AnimatePresence>

      {/* Editor Body */}
      {mode === "editor" ? (
        <div className={cn(
          "w-full flex-1 flex flex-col min-h-0",
          isThisToolFullscreen ? "h-full" : ""
        )}>
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }}
            onDragLeave={() => setIsDraggingOver(false)}
            onDrop={handleEditorDrop}
            className={cn(
              "flex flex-col bg-surface border rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs w-full transition-colors",
              isDraggingOver ? "border-blue ring-2 ring-blue/30 bg-blue/5" : "border-border",
              isThisToolFullscreen 
                ? "h-full flex-1 min-h-0" 
                : "min-h-[380px] sm:min-h-[520px] md:min-h-[640px] h-[calc(100dvh-220px)] sm:h-[calc(100dvh-260px)]"
            )}
          >
            {/* Toolbar (Active in Write & Split tabs) */}
            {(activeTab === "write" || activeTab === "split") && (
              <div className="shrink-0">
                <Toolbar 
                  onInsert={insertAtCursor} 
                  onClear={() => setMd("")}
                  onLoadSample={() => setMd(SAMPLE_MARKDOWN)}
                  scrollSync={scrollSync}
                  onToggleScrollSync={() => setScrollSync(!scrollSync)}
                />
              </div>
            )}
            
            {/* Find & Replace Bar */}
            {showFind && (activeTab === "write" || activeTab === "split") && (
              <div className="shrink-0">
                <FindBar
                  onFind={(q) => handleFind(q, false)}
                  onReplace={handleReplace}
                  onClose={() => {
                    setShowFind(false);
                    editorRef.current?.focus();
                  }}
                  matchCount={findState.matches.length}
                  currentIndex={findState.index}
                  onNext={() => navigateFindMatch(findState.index + 1)}
                  onPrev={() => navigateFindMatch(findState.index - 1)}
                />
              </div>
            )}

            {/* Split / Write / Visual / Preview Workspace */}
            <div className="flex-1 flex flex-col md:flex-row min-h-0 min-w-0 max-w-full overflow-hidden">
              {/* Left Column: Markdown Source Editor (Visible in Write and Split tabs) */}
              {(activeTab === "write" || activeTab === "split") && (
                <div className={cn(
                  "flex flex-col min-w-0 h-full overflow-hidden relative",
                  activeTab === "split" ? "flex-1 border-b md:border-b-0 md:border-r border-border" : "w-full"
                )}>
                  <div className="flex flex-1 min-h-0 overflow-hidden relative font-mono bg-bg">
                    {/* Monaco Editor */}
                    <div 
                      className="flex-1 h-full relative min-w-0 touch-pan-y select-text"
                      style={{ WebkitUserSelect: "text", userSelect: "text" }}
                    >
                      {/* Spell Check Hover Tooltip */}
                      {hoveredSpellMarker && (
                        <div 
                          className="absolute z-dropdown p-3 bg-surface-2 border border-border shadow-lg rounded-xl flex flex-col gap-2 min-w-[200px]"
                          style={{ top: hoverPos.top, left: hoverPos.left }}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-text">Spelling</span>
                            <button onClick={() => setHoveredSpellMarker(null)} className="text-text-muted hover:text-text cursor-pointer">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="text-sm text-text-muted">
                            {hoveredSpellMarker.message}
                          </div>
                          {hoveredSpellMarker.replacements && hoveredSpellMarker.replacements.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {hoveredSpellMarker.replacements.map(rep => (
                                <button 
                                  key={rep}
                                  className="px-2 py-1 text-xs bg-primary/10 text-primary hover:bg-primary/20 rounded-md transition-colors cursor-pointer"
                                  onClick={() => handleApplySpellFix(hoveredSpellMarker, rep)}
                                >
                                  {rep}
                                </button>
                              ))}
                            </div>
                          )}
                          <button 
                            className="mt-2 text-xs text-text-muted hover:text-text text-left cursor-pointer"
                            onClick={() => handleIgnoreWord(hoveredSpellMarker)}
                          >
                            Ignore word
                          </button>
                        </div>
                      )}
                      <Editor
                        language="markdown"
                        theme={activeEditorTheme}
                        path="kv://markdown/doc.md"
                        value={md}
                        beforeMount={(monaco) => defineMonacoThemes(monaco)}
                        onChange={(val) => {
                          if (val && val.length > 5000000) {
                            toast("Text exceeds 5MB limit", "error");
                            setMd(val.slice(0, 5000000));
                          } else {
                            setMd(val || "");
                          }
                        }}
                        onMount={handleEditorMount}
                        options={{
                          ariaLabel: "Markdown Source Editor",
                          automaticLayout: true,
                          wordWrap: wordWrap ? "on" : "off",
                          minimap: { enabled: false },
                          fontSize: fontSize,
                          fontFamily: "'JetBrains Mono', 'Fira Code', ui-monospace, SFMono-Regular, monospace",
                          lineNumbers: showLineNumbers ? "on" : "off",
                          lineNumbersMinChars: 3,
                          padding: { top: 12, bottom: 12 },
                          scrollBeyondLastLine: false,
                          renderLineHighlight: "all",
                          overviewRulerBorder: false,
                          overviewRulerLanes: 0,
                          hideCursorInOverviewRuler: true,
                          tabSize: 2,
                          contextmenu: true,
                          selectOnLineNumbers: true,
                          selectionHighlight: true,
                          roundedSelection: true,
                          dragAndDrop: true,
                          links: true,
                          multiCursorModifier: "alt",
                          scrollbar: {
                            vertical: "visible",
                            horizontal: wordWrap ? "hidden" : "visible",
                            verticalScrollbarSize: 10,
                            horizontalScrollbarSize: 10,
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Visual WYSIWYG Editor (TipTap) */}
              {activeTab === "visual" && (
                <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-bg">
                  <MarkdownVisualEditor 
                    markdown={md} 
                    onChange={setMd} 
                    fontSize={fontSize} 
                  />
                </div>
              )}

              {/* Right Column / Live Preview (Visible in Split and Preview tabs) */}
              {(activeTab === "preview" || activeTab === "split") && (
                <div className={cn(
                  "flex flex-col min-w-0 h-full overflow-hidden bg-bg/40",
                  activeTab === "split" ? "hidden md:flex flex-1" : "w-full flex"
                )}>
                  <MarkdownPreview 
                    html={html} 
                    ref={previewRef}
                    hideHeader={activeTab === "split"}
                    onScroll={handlePreviewScroll}
                    onCopyRaw={handleCopyMd} 
                    theme={activeEditorTheme === "karuvi-dark" ? "dark" : "light"}
                  />
                </div>
              )}
            </div>

            {/* StatBar Footer */}
            <div className="shrink-0">
              <StatBar stats={stats} />
            </div>
          </div>
        </div>
      ) : (
        /* Upload Mode */
        <div className="space-y-6">
          <DropZone
            onFilesSelected={handleFileUpload}
            accept=".md,.markdown,.txt"
            description="Drop your Markdown (.md) file here or click to browse"
          />

          {fileName && (
            <div className="flex flex-col h-[60vh] min-h-96 max-h-tool-viewport-lg bg-surface border border-border rounded-3xl overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-border bg-bg/50 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue/10 rounded-2xl flex items-center justify-center shrink-0">
                    <FileCode className="w-5 h-5 text-blue" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-tiny font-bold uppercase tracking-widest-sm truncate">{fileName}</h4>
                    <p className="text-xs font-bold text-text-4 uppercase tracking-tighter truncate">
                      {stats.words} words • {stats.chars} characters • {stats.lines} lines
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setMd(uploadMd);
                      setMode("editor");
                      toast(`Opened ${fileName} in Editor`);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue text-white rounded-xl text-xs font-bold hover:bg-blue/90 transition-all shadow-xs"
                  >
                    <FileEdit className="w-3.5 h-3.5" />
                    <span>Edit in Workspace</span>
                  </button>
                  <button 
                    onClick={() => {
                      setFileName("");
                      setUploadMd("");
                      setMode("editor");
                    }}
                    aria-label="Close"
                    className="p-2 hover:bg-surface rounded-xl text-text-4 transition-all shrink-0"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 min-h-0 overflow-hidden bg-bg/30">
                <MarkdownPreview 
                  html={html} 
                  ref={uploadPreviewRef}
                  theme={activeEditorTheme === "karuvi-dark" ? "dark" : "light"}
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

