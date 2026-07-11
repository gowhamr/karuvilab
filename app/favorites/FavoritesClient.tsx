"use client";

import { useMemo, useState, useEffect } from "react";
import { useFavoriteStore } from "@/src/store/useFavoriteStore";
import { ALL_TOOLS, ToolEntry } from "@/src/tool-registry";
import { ToolCard } from "@/components/ToolCard";
import { Heart, Sparkles, AlertCircle } from "lucide-react";
import { m, AnimatePresence } from "framer-motion";
import Link from "next/link";

// 5 curated suggestions when no favorites are set
const CURATED_SUGGESTIONS = [
  "reaction-time",
  "color-match",
  "currency-converter",
  "gst-calculator",
  "qrcode"
];

export default function FavoritesClient() {
  const favoriteIds = useFavoriteStore(state => state.favorites);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const favoriteTools = useMemo(() => {
    if (!hydrated) return [];
    return ALL_TOOLS.filter(t => favoriteIds.includes(t.id));
  }, [favoriteIds, hydrated]);

  const suggestedTools = useMemo(() => {
    return ALL_TOOLS.filter(t => CURATED_SUGGESTIONS.includes(t.id));
  }, []);

  if (!hydrated) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-10 w-1/4 bg-surface rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="h-40 w-full bg-surface rounded-3xl" />
          <div className="h-40 w-full bg-surface rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <header className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
            <Heart className="w-5 h-5 fill-current" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-text">Favorites</h1>
        </div>
        <p className="text-sm text-text-4 font-medium max-w-2xl leading-relaxed">
          Your custom collection of quick-access tools. These are stored locally and synced instantly.
        </p>
      </header>

      <AnimatePresence mode="wait">
        {favoriteTools.length > 0 ? (
          <m.div
            key="grid"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-12"
          >
            {/* Grid of favorited tools */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favoriteTools.map(tool => (
                <div key={tool.id} className="flex flex-col h-full">
                  <ToolCard tool={tool} compact={false} />
                </div>
              ))}
            </div>

            {/* Deferred Features Notice */}
            <div className="flex items-start gap-3 p-4 bg-surface-elevated border border-border rounded-2xl max-w-2xl">
              <AlertCircle className="w-5 h-5 text-text-4 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest-sm text-text-3">Future Enhancements</h4>
                <p className="text-xs text-text-4 leading-relaxed mt-1">
                  Smart Categories, Custom Tool Playlists, and Collections dashboards are currently flagged for future releases. 
                  All your data stays private and local to this device.
                </p>
              </div>
            </div>
          </m.div>
        ) : (
          <m.div
            key="empty"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-12"
          >
            {/* Empty State Card */}
            <div className="flex flex-col items-center justify-center text-center p-8 md:p-16 bg-surface border border-border/80 rounded-4xl max-w-3xl mx-auto space-y-6">
              <div className="w-16 h-16 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
                <Heart className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl md:text-2xl font-black tracking-tight text-text">No favorites yet</h2>
                <p className="text-sm text-text-4 max-w-md mx-auto leading-relaxed">
                  Mark your most-used tools with a heart/star inside any tool details shell to pin them directly here.
                </p>
              </div>
              <Link
                href="/all-tools"
                className="h-11 px-6 bg-blue hover:bg-blue-dark text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-blue/20 transition-all active:scale-95"
              >
                Browse All Tools
              </Link>
            </div>

            {/* Curated suggestions section */}
            <section className="space-y-6 max-w-5xl mx-auto">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue/10 flex items-center justify-center text-blue">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-base font-black uppercase tracking-widest text-text">Recommended Tools</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {suggestedTools.map(tool => (
                  <div key={tool.id} className="flex flex-col h-full">
                    <ToolCard tool={tool} compact={false} />
                  </div>
                ))}
              </div>
            </section>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
