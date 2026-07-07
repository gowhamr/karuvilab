"use client";

import { useMemo, useEffect, useState, memo, useCallback, useDeferredValue } from "react";
import Link from "next/link";
import { m, AnimatePresence, MotionConfig } from "framer-motion";
import { ALL_TOOLS, CATEGORIES, getRecentTools, ToolEntry } from "@/src/tool-registry";
import { ToolCard } from "@/components/ToolCard";
import { HomeHero } from "./HomeHero";
import { QuickActionsDashboard } from "@/components/ui/QuickActionsDashboard";
import { SearchBar } from "@/components/ui/search/SearchBar";
import { CategoryChips } from "@/components/ui/CategoryChips";
import { useSearchStore } from "@/src/store/useSearchStore";
import { useFavoriteStore } from "@/src/store/useFavoriteStore";
import { useIntelligenceStore } from "@/src/store/useIntelligenceStore";
import { useAnalyticsStore } from "@/src/store/analyticsStore";
import { useI18n } from "@/src/lib/i18n/store";
import {
  ArrowRight, LayoutGrid, TrendingUp,
  Clock, Heart, Command, ChevronRight, Sparkles, Play,
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { ToolIcon } from "@/components/ui/Icons";

// ── Animation presets ─────────────────────────────────────────────────────────

const fadeUp = {
  hidden:  { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 260, damping: 22 },
  },
} as const;

const stagger = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.045 } },
} as const;

// ── Section Header ─────────────────────────────────────────────────────────────

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ElementType;
  badge?: string;
  href?: string;
}

const SectionHeader = memo(function SectionHeader({
  title, subtitle, icon: Icon, badge, href,
}: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-5 md:mb-6">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="w-9 h-9 rounded-xl bg-blue/8 border border-blue/12 flex items-center justify-center text-blue shrink-0">
            <Icon className="w-4 h-4" aria-hidden="true" />
          </div>
        )}
        <div>
          <h2 className="text-base md:text-lg font-black tracking-tight text-text flex items-center gap-2">
            {title}
            {badge && (
              <span className="px-2 py-0.5 rounded-full bg-blue/8 border border-blue/12 text-[10px] font-bold uppercase tracking-widest text-blue">
                {badge}
              </span>
            )}
          </h2>
          {subtitle && (
            <p className="text-xs text-text-muted font-medium mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      {href && (
        <Link
          href={href}
          aria-label={`Explore all ${title}`}
          className="flex items-center gap-1 min-h-11 px-3 text-xs font-bold text-blue hover:text-blue-dark hover:bg-blue/5 rounded-lg transition-all uppercase tracking-widest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue"
        >
          See all <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
        </Link>
      )}
    </div>
  );
});


// ── Page Component ─────────────────────────────────────────────────────────────

export default function HomeClient() {
  const activeCategory   = useSearchStore(state => state.activeCategory);
  const setActiveCategory = useSearchStore(state => state.setActiveCategory);
  const setIsPaletteOpen  = useSearchStore(state => state.setIsPaletteOpen);
  const isSidebarOpen     = useSearchStore(state => state.isSidebarOpen);

  const favoriteIds = useFavoriteStore(state => state.favorites);
  const [recentTools,  setRecentTools]  = useState<ToolEntry[]>([]);
  const [favoriteTools, setFavorites]  = useState<ToolEntry[]>([]);
  const [hydrated, setHydrated]        = useState(false);
  const t = useI18n(s => s.t);

  const recordView       = useAnalyticsStore(state => state.recordView);
  const recordEngagement = useAnalyticsStore(state => state.recordEngagement);

  useEffect(() => {
    setRecentTools(getRecentTools().slice(0, 5));
    setFavorites(ALL_TOOLS.filter(t => favoriteIds.includes(t.id)).slice(0, 5));
    setHydrated(true);
    recordView("homepage");
  }, [favoriteIds, recordView]);

  const popularToolsMap = useSearchStore(state => state.popularTools);
  const popularTools = useMemo(() => {
    const usageBased = Object.entries(popularToolsMap)
      .filter(([, count]) => count > 0)
      .sort((a, b) => b[1] - a[1])
      .map(([id]) => ALL_TOOLS.find(t => t.id === id))
      .filter(Boolean) as ToolEntry[];

    const hardcoded = (ALL_TOOLS as ToolEntry[]).filter(t => t.popular);
    if (usageBased.length < 4) return hardcoded.slice(0, 10);

    const merged = new Set<ToolEntry>();
    usageBased.forEach(t => merged.add(t));
    hardcoded.forEach(t => merged.add(t));
    return Array.from(merged).slice(0, 10);
  }, [popularToolsMap]);

  const deferredActiveCategory = useDeferredValue(activeCategory);
  const filteredTools = useMemo(() => {
    if (!deferredActiveCategory) return [];
    return (ALL_TOOLS as ToolEntry[]).filter(t => t.category === deferredActiveCategory);
  }, [deferredActiveCategory]);

  const handleCategoryChange = useCallback((id: string | null) => {
    setActiveCategory(id);
    if (id) recordEngagement("homepage");
  }, [setActiveCategory, recordEngagement]);

  const isFiltering = !!activeCategory;

  const continueWorkingTool = useMemo(() => {
    return recentTools.length > 0 ? recentTools[0] : null;
  }, [recentTools]);

  const getSuggestions = useIntelligenceStore(s => s.getSuggestions);
  
  const suggestedTools = useMemo(() => {
    if (!continueWorkingTool) return [];
    const ids = getSuggestions(continueWorkingTool.id, 5);
    return ALL_TOOLS.filter(t => ids.includes(t.id));
  }, [continueWorkingTool, getSuggestions]);

  const isReturning = hydrated && (recentTools.length > 0 || favoriteTools.length > 0);

  return (
    <MotionConfig reducedMotion="user">
      <div className="w-full space-y-0 pb-16">

        <HomeHero isReturning={isReturning} />



        {/* ── Sticky category chip bar ── */}
        <div
          className={cn(
            "sticky top-15 md:top-18 z-sidebar w-full py-2 bg-bg/95 backdrop-blur-sm border-b border-border transition-opacity",
            isSidebarOpen && "opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto"
          )}
        >
          <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <CategoryChips activeCategory={activeCategory} onCategoryChange={handleCategoryChange} />
            </div>
            {isFiltering && (
              <button
                onClick={() => handleCategoryChange(null)}
                aria-label="Clear active filter"
                className="min-h-11 px-3 flex items-center gap-1 text-xs font-bold text-blue hover:bg-blue/5 rounded-lg transition-colors uppercase tracking-widest shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* ── Main content ── */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6 md:pt-8 space-y-10 md:space-y-12">
          <AnimatePresence mode="wait">

            {/* ── FILTERING STATE ── */}
            {isFiltering ? (
              <m.section
                key="category-results"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
                aria-live="polite"
              >
                <SectionHeader
                  title={CATEGORIES.find(c => c.id === activeCategory)?.label ?? "Tools"}
                  subtitle={`${filteredTools.length} tools in this category`}
                  icon={LayoutGrid}
                />
                <m.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 min-h-80 content-start"
                >
                  {filteredTools.map(tool => (
                    <div key={tool.id} className="flex flex-col h-full">
                      <ToolCard tool={tool} compact />
                    </div>
                  ))}
                </m.div>
              </m.section>
            ) : (

              /* ── DEFAULT STATE ── */
              <m.div
                key="default-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-10 md:space-y-12"
              >

                {/* Quick Actions Dashboard */}
                {hydrated && (
                  <AnimatePresence>
                    <m.section
                      key="quick-actions"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.22 }}
                    >
                      <QuickActionsDashboard 
                        continueTool={continueWorkingTool}
                        recentTools={recentTools}
                        favoriteTools={favoriteTools}
                        frequentlyUsedTools={popularTools}
                        suggestedTools={suggestedTools}
                      />
                    </m.section>
                  </AnimatePresence>
                )}


                {/* Popular Tools */}
                <section aria-labelledby="popular-heading">
                  <SectionHeader
                    title={t("common.popular")}
                    subtitle="Most-used across all users"
                    icon={TrendingUp}
                    badge="Hot"
                  />
                  <m.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.4 }}
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4"
                  >
                    {popularTools.map(tool => (
                      <div key={tool.id} className="flex flex-col h-full">
                        <ToolCard tool={tool} compact />
                      </div>
                    ))}
                  </m.div>
                </section>

                {/* Inline promo banner */}
                {!isReturning && (
                  <m.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 260, damping: 24 }}
                    className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue/10 via-indigo-500/8 to-purple-500/10 border border-blue/15 p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue/5 to-transparent"
                    />
                    <div className="relative flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-blue/15 border border-blue/20 flex items-center justify-center text-blue shrink-0">
                        <Sparkles className="w-6 h-6" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="font-black text-text text-base leading-tight">Discover 100+ free tools</p>
                        <p className="text-sm text-text-muted mt-0.5">All local. No sign-up. No data sent to servers.</p>
                      </div>
                    </div>
                  </m.div>
                )}

                {/* All Tools Grid (Adaptive limit based on user state) */}
                <section aria-labelledby="all-tools-heading" id="tools">
                  <SectionHeader
                    title={t("common.all")}
                    subtitle="The complete universal toolkit"
                    icon={LayoutGrid}
                  />
                  <m.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.4 }}
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4"
                  >
                    {(ALL_TOOLS as ToolEntry[]).slice(0, isReturning ? 10 : 15).map(tool => (
                      <div key={tool.id} className="flex flex-col h-full">
                        <ToolCard tool={tool} compact />
                      </div>
                    ))}
                  </m.div>
                </section>

              </m.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </MotionConfig>
  );
}
