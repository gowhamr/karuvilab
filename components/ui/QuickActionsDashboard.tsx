"use client";

import { useMemo, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ToolEntry, ALL_TOOLS } from "@/src/tool-registry";
import { Clock, Play, ChevronRight, Heart, Sparkles, Clipboard, Upload, Search, Zap, TrendingUp } from "lucide-react";
import { detectContentToolSuggestion } from "@/src/lib/search/intelligentDetector";
import { useSearchStore } from "@/src/store/useSearchStore";
import { ToolIcon } from "./Icons";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

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
          {starterTools.map(tool => (
            <Link key={tool.id} href={`/${tool.href}`} passHref legacyBehavior>
              <Card
                variant="interactive"
                padding="sm"
                className="flex flex-col items-center justify-center text-center gap-2 group focus-visible:ring-2 focus-visible:ring-primary"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary shrink-0 transition-transform group-hover:scale-105">
                  <ToolIcon toolId={tool.id} category={tool.category} className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-caption font-bold text-text-primary truncate max-w-[140px]">{tool.name}</p>
                  <p className="text-tiny text-text-secondary truncate max-w-[140px] mt-0.5">{tool.desc}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card variant="default" padding="md" className="space-y-8 shadow-sm">
      
      {/* ── Smart Quick Actions Strip ── */}
      <section aria-label="Smart Quick Actions">
        <div className="flex items-center gap-2 mb-3 px-1">
          <Zap className="w-3.5 h-3.5 text-primary" />
          <h2 className="text-caption font-bold uppercase tracking-widest text-text-secondary">Smart Quick Actions</h2>
          {pasteNotice && <span className="text-caption font-bold text-danger ml-auto animate-pulse">{pasteNotice}</span>}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {continueTool ? (
            <Link
              href={continueTool.href}
              className="flex items-center gap-2.5 p-3 rounded-md bg-primary/10 border border-primary/20 hover:bg-primary/15 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-text-primary shrink-0 shadow-sm">
                <Play className="w-4 h-4 fill-current ml-0.5" />
              </div>
              <div className="min-w-0">
                <p className="text-caption font-bold text-text-primary truncate">Resume</p>
                <p className="text-tiny text-text-secondary truncate">{continueTool.name}</p>
              </div>
            </Link>
          ) : (
            <button
              onClick={() => setIsPaletteOpen(true)}
              className="flex items-center gap-2.5 p-3 rounded-md bg-bg border border-divider hover:border-primary/30 transition-all text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Search className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-caption font-bold text-text-primary truncate">Search Tools</p>
                <p className="text-tiny text-text-secondary truncate">Ctrl+K Palette</p>
              </div>
            </button>
          )}

          <button
            onClick={handlePasteDetect}
            className="flex items-center gap-2.5 p-3 rounded-md bg-bg border border-divider hover:border-primary/30 transition-all text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <div className="w-8 h-8 rounded-md bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
              <Clipboard className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-caption font-bold text-text-primary truncate">Paste & Detect</p>
              <p className="text-tiny text-text-secondary truncate">Auto tool match</p>
            </div>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2.5 p-3 rounded-md bg-bg border border-divider hover:border-primary/30 transition-all text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <Upload className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-caption font-bold text-text-primary truncate">Upload File</p>
              <p className="text-tiny text-text-secondary truncate">Auto route format</p>
            </div>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            aria-label="Upload file for quick action"
          />

          <button
            onClick={() => setIsPaletteOpen(true)}
            className="flex items-center gap-2.5 p-3 rounded-md bg-bg border border-divider hover:border-primary/30 transition-all text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <div className="w-8 h-8 rounded-md bg-warning/10 flex items-center justify-center text-warning shrink-0">
              <Search className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-caption font-bold text-text-primary truncate">Command Bar</p>
              <p className="text-tiny text-text-secondary truncate">Explore 150+ tools</p>
            </div>
          </button>
        </div>
      </section>

      {/* ── Continue Working Detailed Card ── */}
      {continueTool && (
        <section aria-label="Continue Working">
          <div className="flex items-center gap-2 mb-3 px-1">
            <Play className="w-3.5 h-3.5 text-primary" />
            <h3 className="text-caption font-bold uppercase tracking-widest text-text-secondary">Continue Working</h3>
          </div>
          <Link href={continueTool.href} passHref legacyBehavior>
            <Card
              variant="interactive"
              padding="md"
              className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 focus-visible:ring-2 focus-visible:ring-primary"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-bg border border-divider flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                  <ToolIcon category={continueTool.category} className="w-6 h-6 text-text-primary" />
                </div>
                <div>
                  <h4 className="text-body font-bold text-text-primary group-hover:text-primary transition-colors">
                    {continueTool.name}
                  </h4>
                  <p className="text-caption text-text-secondary mt-0.5">
                    Last active tool in your session
                  </p>
                </div>
              </div>
              <Button
                variant="primary"
                size="sm"
                className="sm:w-auto w-full group-hover:shadow-md"
              >
                Resume
              </Button>
            </Card>
          </Link>
        </section>
      )}

      {/* ── Favorites (Pinned) ── */}
      {favoriteTools.length > 0 && (
        <section aria-label="Favorites">
          <div className="flex items-center gap-2 mb-3 px-1">
            <Heart className="w-3.5 h-3.5 text-danger fill-current" />
            <h3 className="text-caption font-bold uppercase tracking-widest text-text-secondary">Favorites</h3>
          </div>
          <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar pb-2 -mx-2 px-2 snap-x">
            {favoriteTools.map(tool => (
              <Link
                key={`fav-${tool.id}`}
                href={tool.href}
                className="group flex items-center gap-2.5 min-w-[140px] px-3.5 py-2.5 rounded-md bg-bg border border-divider hover:border-primary/30 hover:bg-surface-elevated transition-all shrink-0 snap-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <ToolIcon category={tool.category} className="w-4 h-4 text-text-secondary group-hover:text-danger transition-colors" />
                <span className="text-caption font-semibold text-text-primary truncate">{tool.name}</span>
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
            <h3 className="text-caption font-bold uppercase tracking-widest text-text-secondary">Recently Used</h3>
          </div>
          <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar pb-2 -mx-2 px-2 snap-x">
            {recentTools.slice(0, 10).map(tool => (
              <Link
                key={`rec-${tool.id}`}
                href={tool.href}
                className="group flex items-center gap-2.5 min-w-[140px] px-3.5 py-2.5 rounded-md bg-bg border border-divider hover:border-primary/30 hover:bg-surface-elevated transition-all shrink-0 snap-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <div className="w-6 h-6 rounded-md bg-surface border border-divider flex items-center justify-center shrink-0 group-hover:border-primary/30 transition-colors">
                  <ToolIcon category={tool.category} className="w-3.5 h-3.5 text-text-secondary group-hover:text-primary" />
                </div>
                <span className="text-caption font-medium text-text-secondary group-hover:text-text-primary truncate">{tool.name}</span>
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
            <h3 className="text-caption font-bold uppercase tracking-widest text-text-secondary">Frequently Used</h3>
          </div>
          <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar pb-2 -mx-2 px-2 snap-x">
            {frequentlyUsedTools.slice(0, 10).map(tool => (
              <Link
                key={`freq-${tool.id}`}
                href={tool.href}
                className="group flex items-center gap-2.5 min-w-[140px] px-3.5 py-2.5 rounded-md bg-bg border border-divider hover:border-success/30 hover:bg-success/5 transition-all shrink-0 snap-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-success"
              >
                <div className="w-6 h-6 rounded-md bg-surface border border-divider flex items-center justify-center shrink-0 group-hover:border-success/30 transition-colors">
                  <ToolIcon category={tool.category} className="w-3.5 h-3.5 text-text-secondary group-hover:text-success" />
                </div>
                <span className="text-caption font-medium text-text-secondary group-hover:text-text-primary truncate">{tool.name}</span>
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
            <h3 className="text-caption font-bold uppercase tracking-widest text-text-secondary">Suggested for You</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {suggestedTools.map(tool => (
              <Link key={`sugg-${tool.id}`} href={tool.href} passHref legacyBehavior>
                <Card
                  variant="interactive"
                  padding="sm"
                  className="flex items-center gap-3 group focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <div className="w-10 h-10 rounded-lg bg-surface border border-divider flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <ToolIcon category={tool.category} className="w-5 h-5 text-warning" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-caption font-bold text-text-primary truncate group-hover:text-warning transition-colors">{tool.name}</p>
                    <p className="text-tiny text-text-secondary truncate">Based on recent workflow</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}
    </Card>
  );
}
