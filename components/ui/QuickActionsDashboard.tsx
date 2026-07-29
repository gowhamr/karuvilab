"use client";

import { useMemo, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ToolEntry, ALL_TOOLS } from "@/src/tool-registry";
import { Clock, Play, Heart, Sparkles, Clipboard, Upload, Zap, TrendingUp } from "lucide-react";
import { detectContentToolSuggestion } from "@/src/lib/search/intelligentDetector";
import { useSearchStore } from "@/src/store/useSearchStore";
import { useSettingsStore } from "@/src/store/settings/store";
import { ToolIcon } from "./Icons";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

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
  const setSearchQuery   = useSearchStore(s => s.setSearchQuery);
  // Setting: show Quick Actions only when user opts in (default off)
  const showQuickActions = useSettingsStore(s => s.appearance.showQuickActions ?? false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // BUG-01: wrapped in useCallback — stable reference, no subtree re-render on every parent render
  const handlePasteDetect = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      const trimmed = text?.trim();

      if (!trimmed) {
        // Clipboard empty — open palette blank so user can type manually
        setSearchQuery('');
        setIsPaletteOpen(true);
        return;
      }

      // Has content — try to route directly to matching tool
      const suggestion = detectContentToolSuggestion(trimmed);
      if (suggestion) {
        const tool = ALL_TOOLS.find(t => t.id === suggestion.toolId || t.href.includes(suggestion.toolId));
        if (tool) {
          router.push(tool.href);
          return;
        }
      }

      // No direct match — open search palette prefilled with clipboard text
      setSearchQuery(trimmed.slice(0, 40));
      setIsPaletteOpen(true);
    } catch {
      // Clipboard permission denied or unavailable — open palette blank
      setSearchQuery('');
      setIsPaletteOpen(true);
    }
  }, [router, setIsPaletteOpen, setSearchQuery]);

  // BUG-02 + BUG-06: useCallback for stable ref; MIME fallback so renamed/extensionless files still route
  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Reset so the same file can be re-selected
    e.target.value = "";
    const ext  = file.name.split('.').pop()?.toLowerCase() ?? '';
    const mime = file.type;
    if (ext === 'pdf' || mime === 'application/pdf') {
      router.push('/pdf-tools/merge-pdf');
    } else if (['png','jpg','jpeg','webp','gif','bmp','svg','avif','heic'].includes(ext) || mime.startsWith('image/')) {
      router.push('/image-tools/image-compressor');
    } else if (ext === 'json' || mime === 'application/json') {
      router.push('/developer-tools/json-formatter');
    } else if (ext === 'csv' || mime === 'text/csv') {
      router.push('/developer-tools/csv-to-json');
    } else if (ext === 'xml' || mime === 'application/xml' || mime === 'text/xml') {
      router.push('/developer-tools/xml-formatter');
    } else if (ext === 'sql') {
      router.push('/developer-tools/sql-formatter');
    } else if (ext === 'yaml' || ext === 'yml') {
      router.push('/developer-tools/yaml-json-converter');
    } else {
      router.push('/all-tools');
    }
  }, [router]);

  // STD-01: extracted from inline JSX to avoid new function ref on every render
  const handleUploadClick = useCallback(() => fileInputRef.current?.click(), []);

  // BUG-03: useMemo MUST stay above the isEmpty early-return — do not move (Rules of Hooks)
  const starterTools = useMemo(() => {
    const starterIds = ["merge-pdf", "json-formatter", "compress", "url-encoder"];
    return ALL_TOOLS.filter(t => starterIds.includes(t.id));
  }, []);

  const isEmpty = !continueTool && recentTools.length === 0 && favoriteTools.length === 0;

  if (isEmpty) {
    return (
      <Card variant="glass" padding="lg" className="space-y-6 shadow-sm">
        <div className="text-center flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-text-primary">Start exploring your toolkit</h2>
            <p className="text-sm text-text-secondary mt-1 max-w-sm mx-auto">
              Choose a popular starter tool below or browse the full collection to get started.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
          {/* STD-02: Link renders <a> directly in Next.js 13+; Card's classes moved to Link so HTML is valid <a> not <a><div> */}
          {starterTools.map(tool => (
            <Link
              key={tool.id}
              href={tool.href}
              className="flex flex-col items-center justify-center text-center gap-2 group min-h-[88px] rounded-card border border-divider bg-surface hover:border-primary/30 hover:bg-surface-elevated/40 transition-colors cursor-pointer active:scale-[0.99] overflow-hidden p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary shrink-0 transition-transform group-hover:scale-105">
                <ToolIcon toolId={tool.id} category={tool.category} className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-text-primary truncate max-w-[140px]">{tool.name}</p>
                <p className="text-xs text-text-secondary truncate max-w-[140px] mt-0.5">{tool.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card variant="default" padding="md" className="space-y-8 shadow-sm">
      
      {/* ── Smart Quick Actions Strip (only when user enables in Settings) ── */}
      {showQuickActions && (
        <section aria-label="Smart Quick Actions">
          <div className="flex items-center gap-2 mb-3 px-1">
            <Zap className="w-3.5 h-3.5 text-primary" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-text-secondary">Smart Quick Actions</h2>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {/* Slot 1: Resume if session active, otherwise Paste & Detect */}
            {continueTool ? (
              <Link
                href={continueTool.href}
                className="flex items-center gap-2.5 p-3 min-h-[56px] rounded-md bg-primary/10 border border-primary/20 hover:bg-primary/15 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-text-primary shrink-0 shadow-sm">
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-text-primary truncate">Resume</p>
                  <p className="text-xs text-text-secondary truncate">{continueTool.name}</p>
                </div>
              </Link>
            ) : (
              <button
                onClick={handlePasteDetect}
                className="flex items-center gap-2.5 p-3 min-h-[56px] rounded-md bg-bg border border-divider hover:border-primary/30 transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <div className="w-8 h-8 rounded-md bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
                  <Clipboard className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-text-primary truncate">Paste &amp; Detect</p>
                  <p className="text-xs text-text-secondary truncate">Auto tool match</p>
                </div>
              </button>
            )}

            {/* Slot 2: Upload File — always present */}
            <button
              onClick={handleUploadClick}
              className="flex items-center gap-2.5 p-3 min-h-[56px] rounded-md bg-bg border border-divider hover:border-primary/30 transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Upload className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-text-primary truncate">Upload File</p>
                <p className="text-xs text-text-secondary truncate">Jump to right tool</p>
              </div>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              aria-label="Upload file for quick action"
            />
          </div>
        </section>
      )}


      {/* ── Continue Working Detailed Card ── */}
      {continueTool && (
        <section aria-label="Continue Working">
          <div className="flex items-center gap-2 mb-3 px-1">
            <Play className="w-3.5 h-3.5 text-primary" />
            <h3 className="text-sm font-bold uppercase tracking-widest text-text-secondary">Continue Working</h3>
          </div>
          {/* STD-02: Link renders <a> natively — Card classes moved to Link to avoid invalid <a><div> */}
          <Link
            href={continueTool.href}
            className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-card border border-divider bg-surface hover:border-primary/30 hover:bg-surface-elevated/40 transition-colors cursor-pointer active:scale-[0.99] overflow-hidden p-6 min-h-[64px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-bg border border-divider flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                <ToolIcon category={continueTool.category} className="w-6 h-6 text-text-primary" />
              </div>
              <div>
                <h4 className="text-body font-bold text-text-primary group-hover:text-primary transition-colors">
                  {continueTool.name}
                </h4>
                <p className="text-sm text-text-secondary mt-0.5">
                  Last active tool in your session
                </p>
              </div>
            </div>
            {/* QA-02: span styled as button — <button> inside <a> is invalid HTML */}
            <span className="mt-auto sm:mt-0 sm:w-auto w-full inline-flex items-center justify-center px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg group-hover:shadow-md transition-colors">
              Resume
            </span>
          </Link>
        </section>
      )}

      {/* ── Favorites (Pinned) ── */}
      {favoriteTools.length > 0 && (
        <section aria-label="Favorites">
          <div className="flex items-center gap-2 mb-3 px-1">
            <Heart className="w-3.5 h-3.5 text-danger fill-current" />
            <h3 className="text-sm font-bold uppercase tracking-widest text-text-secondary">Favorites</h3>
          </div>
          <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar pb-2 -mx-2 px-2 snap-x">
            {favoriteTools.map(tool => (
              <Link
                key={`fav-${tool.id}`}
                href={tool.href}
                className="group flex items-center gap-2.5 min-w-[140px] min-h-[44px] px-3.5 py-3 rounded-md bg-bg border border-divider hover:border-primary/30 hover:bg-surface-elevated transition-colors shrink-0 snap-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <ToolIcon category={tool.category} className="w-4 h-4 text-text-secondary group-hover:text-danger transition-colors" />
                <span className="text-sm font-semibold text-text-primary truncate">{tool.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Recent Tools ── */}
      {recentTools.length > 0 && (
        <section aria-label="Recently Used">
          <div className="flex items-center gap-2 mb-3 px-1">
            <Clock className="w-3.5 h-3.5 text-text-secondary" />
            <h3 className="text-sm font-bold uppercase tracking-widest text-text-secondary">Recently Used</h3>
          </div>
          <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar pb-2 -mx-2 px-2 snap-x">
            {recentTools.slice(0, 10).map(tool => (
              <Link
                key={`rec-${tool.id}`}
                href={tool.href}
                className="group flex items-center gap-2.5 min-w-[140px] min-h-[44px] px-3.5 py-3 rounded-md bg-bg border border-divider hover:border-primary/30 hover:bg-surface-elevated transition-colors shrink-0 snap-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <div className="w-6 h-6 rounded-md bg-surface border border-divider flex items-center justify-center shrink-0 group-hover:border-primary/30 transition-colors">
                  <ToolIcon category={tool.category} className="w-3.5 h-3.5 text-text-secondary group-hover:text-primary" />
                </div>
                <span className="text-sm font-medium text-text-secondary group-hover:text-text-primary truncate">{tool.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Frequently Used Tools ── */}
      {frequentlyUsedTools.length > 0 && (
        <section aria-label="Frequently Used">
          <div className="flex items-center gap-2 mb-3 px-1">
            <TrendingUp className="w-3.5 h-3.5 text-success" />
            <h3 className="text-sm font-bold uppercase tracking-widest text-text-secondary">Frequently Used</h3>
          </div>
          <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar pb-2 -mx-2 px-2 snap-x">
            {frequentlyUsedTools.slice(0, 10).map(tool => (
              <Link
                key={`freq-${tool.id}`}
                href={tool.href}
                className="group flex items-center gap-2.5 min-w-[140px] min-h-[44px] px-3.5 py-3 rounded-md bg-bg border border-divider hover:border-success/30 hover:bg-success/5 transition-colors shrink-0 snap-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-success"
              >
                <div className="w-6 h-6 rounded-md bg-surface border border-divider flex items-center justify-center shrink-0 group-hover:border-success/30 transition-colors">
                  <ToolIcon category={tool.category} className="w-3.5 h-3.5 text-text-secondary group-hover:text-success" />
                </div>
                <span className="text-sm font-medium text-text-secondary group-hover:text-text-primary truncate">{tool.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Suggested for You ── */}
      {suggestedTools.length > 0 && (
        <section aria-label="Suggested for You">
          <div className="flex items-center gap-2 mb-3 px-1">
            <Sparkles className="w-3.5 h-3.5 text-warning" />
            <h3 className="text-sm font-bold uppercase tracking-widest text-text-secondary">Suggested for You</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {/* STD-02: Link renders <a> natively — Card classes moved to Link */}
            {suggestedTools.map(tool => (
              <Link
                key={`sugg-${tool.id}`}
                href={tool.href}
                className="flex items-center gap-3 group min-h-[64px] rounded-card border border-divider bg-surface hover:border-primary/30 hover:bg-surface-elevated/40 transition-colors cursor-pointer active:scale-[0.99] overflow-hidden p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <div className="w-10 h-10 rounded-lg bg-surface border border-divider flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <ToolIcon category={tool.category} className="w-5 h-5 text-warning" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-text-primary truncate group-hover:text-warning transition-colors">{tool.name}</p>
                  <p className="text-xs text-text-secondary truncate">Based on recent workflow</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </Card>
  );
}
