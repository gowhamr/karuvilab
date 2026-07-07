"use client";

import { useMemo, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ToolEntry, ALL_TOOLS } from "@/src/tool-registry";
import { Clock, Play, ChevronRight, Heart, Sparkles, Clipboard, Upload, Search, Zap, TrendingUp } from "lucide-react";
import { detectContentToolSuggestion } from "@/src/lib/search/intelligentDetector";
import { useSearchStore } from "@/src/store/useSearchStore";
import { ToolIcon } from "./Icons";

interface QuickActionsProps {
  continueTool: ToolEntry | null | undefined;
  recentTools: ToolEntry[];
  favoriteTools: ToolEntry[];
  frequentlyUsedTools: ToolEntry[];
  suggestedTools: ToolEntry[];
}

export function QuickActionsDashboard({ 
  continueTool, 
  recentTools, 
  favoriteTools,
  frequentlyUsedTools,
  suggestedTools 
}: QuickActionsProps) {
  const router = useRouter();
  const setIsPaletteOpen = useSearchStore(s => s.setIsPaletteOpen);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pasteNotice, setPasteNotice] = useState<string | null>(null);

  const handlePasteDetect = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text || !text.trim()) {
        setPasteNotice("Clipboard is empty");
        setTimeout(() => setPasteNotice(null), 3000);
        return;
      }
      const suggestion = detectContentToolSuggestion(text);
      if (suggestion) {
        const tool = ALL_TOOLS.find(t => t.id === suggestion.toolId || t.href.includes(suggestion.toolId));
        if (tool) {
          router.push(`/${tool.href}`);
          return;
        }
      }
      // Fallback: open search palette prefilled
      useSearchStore.getState().setSearchQuery(text.slice(0, 40));
      setIsPaletteOpen(true);
    } catch {
      setIsPaletteOpen(true);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') {
      router.push('/pdf-tools');
    } else if (['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg'].includes(ext || '')) {
      router.push('/image-tools');
    } else if (ext === 'json') {
      router.push('/developer-tools/json-formatter');
    } else if (ext === 'csv') {
      router.push('/developer-tools/csv-json-converter');
    } else if (ext === 'xml') {
      router.push('/developer-tools/xml-formatter');
    } else if (ext === 'sql') {
      router.push('/developer-tools/sql-formatter');
    } else {
      router.push('/all-tools');
    }
  };

  const isEmpty = !continueTool && recentTools.length === 0 && favoriteTools.length === 0;

  const starterTools = useMemo(() => {
    const starterIds = ["merge-pdf", "json-formatter", "image-compress", "url-encoder"];
    return ALL_TOOLS.filter(t => starterIds.includes(t.id));
  }, []);

  if (isEmpty) {
    return (
      <div className="bg-surface border border-border rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
        <div className="text-center flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue/10 flex items-center justify-center text-blue">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-text">Start exploring your toolkit</h2>
            <p className="text-sm text-text-muted mt-1 max-w-sm mx-auto">
              Choose a popular starter tool below or browse the full collection to get started.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
          {starterTools.map(tool => (
            <Link
              key={tool.id}
              href={`/${tool.href}`}
              className="flex flex-col items-center justify-center text-center p-4 rounded-2xl bg-bg border border-border hover:border-blue/30 hover:bg-blue/5 transition-all outline-none focus-visible:ring-2 focus-visible:ring-blue gap-2"
            >
              <div className="w-10 h-10 rounded-xl bg-blue/5 border border-blue/10 flex items-center justify-center text-blue shrink-0">
                <ToolIcon toolId={tool.id} category={tool.category} className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-text truncate max-w-[140px]">{tool.name}</p>
                <p className="text-[10px] text-text-muted truncate max-w-[140px] mt-0.5">{tool.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-3xl p-4 md:p-6 space-y-8 shadow-sm">
      
      {/* ── Smart Quick Actions Strip ── */}
      <section>
        <div className="flex items-center gap-2 mb-3 px-1">
          <Zap className="w-3.5 h-3.5 text-blue" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-text-2">Smart Quick Actions</h3>
          {pasteNotice && <span className="text-xs font-semibold text-rose-400 ml-auto animate-pulse">{pasteNotice}</span>}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {continueTool ? (
            <Link
              href={continueTool.href}
              className="flex items-center gap-2.5 p-3 rounded-2xl bg-blue/10 border border-blue/20 hover:bg-blue/15 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue"
            >
              <div className="w-8 h-8 rounded-xl bg-blue flex items-center justify-center text-white shrink-0 shadow-sm">
                <Play className="w-4 h-4 fill-current ml-0.5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-text truncate">Resume</p>
                <p className="text-[10px] text-text-muted truncate">{continueTool.name}</p>
              </div>
            </Link>
          ) : (
            <button
              onClick={() => setIsPaletteOpen(true)}
              className="flex items-center gap-2.5 p-3 rounded-2xl bg-bg border border-border hover:border-blue/30 transition-all text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue"
            >
              <div className="w-8 h-8 rounded-xl bg-blue/10 flex items-center justify-center text-blue shrink-0">
                <Search className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-text truncate">Search Tools</p>
                <p className="text-[10px] text-text-muted truncate">Ctrl+K Palette</p>
              </div>
            </button>
          )}

          <button
            onClick={handlePasteDetect}
            className="flex items-center gap-2.5 p-3 rounded-2xl bg-bg border border-border hover:border-blue/30 transition-all text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue"
          >
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 shrink-0">
              <Clipboard className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-text truncate">Paste & Detect</p>
              <p className="text-[10px] text-text-muted truncate">Auto tool match</p>
            </div>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2.5 p-3 rounded-2xl bg-bg border border-border hover:border-blue/30 transition-all text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue"
          >
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 shrink-0">
              <Upload className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-text truncate">Upload File</p>
              <p className="text-[10px] text-text-muted truncate">Auto route format</p>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              aria-label="Upload file for quick action"
            />
          </button>

          <button
            onClick={() => setIsPaletteOpen(true)}
            className="flex items-center gap-2.5 p-3 rounded-2xl bg-bg border border-border hover:border-blue/30 transition-all text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
              <Search className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-text truncate">Command Bar</p>
              <p className="text-[10px] text-text-muted truncate">Explore 150+ tools</p>
            </div>
          </button>
        </div>
      </section>

      {/* ── Continue Working Detailed Card ── */}
      {continueTool && (
        <section>
          <div className="flex items-center gap-2 mb-3 px-1">
            <Play className="w-3.5 h-3.5 text-blue" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-text-2">Continue Working</h3>
          </div>
          <Link
            href={continueTool.href}
            className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-bg border border-border hover:border-blue/30 hover:bg-blue/5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                <ToolIcon category={continueTool.category} className="w-6 h-6 text-text" />
              </div>
              <div>
                <h4 className="text-base font-bold text-text group-hover:text-blue transition-colors">
                  {continueTool.name}
                </h4>
                <p className="text-xs text-text-muted mt-0.5">
                  Last active tool in your session
                </p>
              </div>
            </div>
            <div className="inline-flex items-center justify-center h-9 px-4 rounded-lg bg-blue text-white text-xs font-bold sm:w-auto w-full group-hover:shadow-md group-hover:shadow-blue/20 transition-all">
              Resume
            </div>
          </Link>
        </section>
      )}

      {/* ── Favorites (Pinned) ── */}
      {favoriteTools.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3 px-1">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-text-2">Favorites</h3>
          </div>
          <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar pb-2 -mx-2 px-2 snap-x">
            {favoriteTools.map(tool => (
              <Link
                key={`fav-${tool.id}`}
                href={tool.href}
                className="group flex items-center gap-2.5 min-w-[140px] px-3.5 py-2.5 rounded-xl bg-bg border border-border hover:border-border-focus hover:bg-mat-hover transition-all shrink-0 snap-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue"
              >
                <ToolIcon category={tool.category} className="w-4 h-4 text-text-3 group-hover:text-rose-500 transition-colors" />
                <span className="text-sm font-semibold text-text truncate">{tool.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Recent Tools ── */}
      {recentTools.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3 px-1">
            <Clock className="w-3.5 h-3.5 text-text-muted" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-text-2">Recently Used</h3>
          </div>
          <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar pb-2 -mx-2 px-2 snap-x">
            {recentTools.slice(0, 10).map(tool => (
              <Link
                key={`rec-${tool.id}`}
                href={tool.href}
                className="group flex items-center gap-2.5 min-w-[140px] px-3.5 py-2.5 rounded-xl bg-bg border border-border hover:border-border-focus hover:bg-mat-hover transition-all shrink-0 snap-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue"
              >
                <div className="w-6 h-6 rounded-md bg-surface border border-border flex items-center justify-center shrink-0 group-hover:border-blue/30 transition-colors">
                  <ToolIcon category={tool.category} className="w-3.5 h-3.5 text-text-3 group-hover:text-blue" />
                </div>
                <span className="text-sm font-medium text-text-2 group-hover:text-text truncate">{tool.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Frequently Used Tools ── */}
      {frequentlyUsedTools.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3 px-1">
            <TrendingUp className="w-3.5 h-3.5 text-green-500" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-text-2">Frequently Used</h3>
          </div>
          <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar pb-2 -mx-2 px-2 snap-x">
            {frequentlyUsedTools.slice(0, 10).map(tool => (
              <Link
                key={`freq-${tool.id}`}
                href={tool.href}
                className="group flex items-center gap-2.5 min-w-[140px] px-3.5 py-2.5 rounded-xl bg-bg border border-border hover:border-green-500/30 hover:bg-green-500/5 transition-all shrink-0 snap-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
              >
                <div className="w-6 h-6 rounded-md bg-surface border border-border flex items-center justify-center shrink-0 group-hover:border-green-500/30 transition-colors">
                  <ToolIcon category={tool.category} className="w-3.5 h-3.5 text-text-3 group-hover:text-green-500" />
                </div>
                <span className="text-sm font-medium text-text-2 group-hover:text-text truncate">{tool.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Suggested for You ── */}
      {suggestedTools.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3 px-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-text-2">Suggested for You</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {suggestedTools.map(tool => (
              <Link
                key={`sugg-${tool.id}`}
                href={tool.href}
                className="group flex items-center gap-3 p-3 rounded-xl bg-bg border border-border hover:border-amber-500/40 hover:bg-amber-500/5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <ToolIcon category={tool.category} className="w-5 h-5 text-amber-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-text truncate group-hover:text-amber-500 transition-colors">{tool.name}</p>
                  <p className="text-[10px] text-text-muted truncate">Based on recent workflow</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
