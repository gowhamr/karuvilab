"use client";

import { useMemo, useEffect, useState, memo, useCallback, useDeferredValue } from "react";
import Link from "next/link";
import { m, AnimatePresence, MotionConfig } from "framer-motion";
import { ALL_TOOLS, CATEGORIES, getRecentTools, ToolEntry } from "@/src/tool-registry";
import { ToolCard } from "@/components/ToolCard";
import { SearchBar } from "@/components/ui/search/SearchBar";
import { CategoryChips } from "@/components/ui/CategoryChips";
import { useSearchStore } from "@/src/store/useSearchStore";
import { useFavoriteStore } from "@/src/store/useFavoriteStore";
import { useAnalyticsStore } from "@/src/store/analyticsStore";
import { useI18n } from "@/src/lib/i18n/store";
import {
  ArrowRight, LayoutGrid, TrendingUp,
  Clock, Heart, Command, ChevronRight, Sparkles,
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

// ── Category Quick-nav cards ──────────────────────────────────────────────────

const CategoryQuickNav = memo(function CategoryQuickNav() {
  const cats = CATEGORIES.slice(0, 6);
  return (
    <section aria-labelledby="categories-heading" className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 id="categories-heading" className="text-base font-black tracking-tight text-text flex items-center gap-2">
          <span className="w-9 h-9 rounded-xl bg-blue/8 border border-blue/12 flex items-center justify-center text-blue">
            <LayoutGrid className="w-4 h-4" aria-hidden="true" />
          </span>
          Categories
        </h2>
        <Link
          href="/all-tools"
          className="flex items-center gap-1 min-h-11 px-3 text-xs font-bold text-blue hover:bg-blue/5 rounded-lg transition-all uppercase tracking-widest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue"
        >
          All <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
        </Link>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
        {cats.map((cat) => (
          <Link
            key={cat.id}
            href={`/${cat.href}`}
            className={cn(
              "flex flex-col items-center gap-2 p-3 rounded-2xl border text-center",
              "bg-mat-surface border-mat-border",
              "hover:border-blue/30 hover:bg-blue/5 hover:-translate-y-0.5",
              "transition-all duration-150 ease-out group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue"
            )}
            aria-label={`Browse ${cat.label}`}
          >
            <span
              className="w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-transform duration-150 group-hover:scale-110"
              style={{ background: `${cat.color}18` }}
              aria-hidden="true"
            >
              <ToolIcon category={cat.id} className="w-4 h-4" />
            </span>
            <span className="text-[11px] font-bold text-text-muted group-hover:text-text leading-tight transition-colors">
              {cat.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
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
    setHydrated(true);
    setRecentTools(getRecentTools().slice(0, 5));
    recordView("homepage");
  }, [recordView]);

  useEffect(() => {
    if (hydrated) {
      setFavorites(ALL_TOOLS.filter(t => favoriteIds.includes(t.id)).slice(0, 5));
    }
  }, [favoriteIds, hydrated]);

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

  return (
    <MotionConfig reducedMotion="user">
      <div className="w-full space-y-0 pb-16">

        {/* ── Search bar (mobile only — desktop uses sidebar) ── */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-4 md:pt-6">
          <div className="sm:hidden w-full">
            <button
              onClick={() => setIsPaletteOpen(true)}
              aria-label="Open search palette"
              className="w-full h-12 flex items-center gap-3 px-4 bg-surface border border-border rounded-2xl text-sm font-medium text-text-muted hover:border-blue/30 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue"
            >
              <Command className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span className="flex-1 text-left">Search 100+ tools…</span>
              <kbd className="hidden sm:inline text-xs font-mono border border-border rounded px-1.5 py-0.5">⌘K</kbd>
            </button>
          </div>
          <div className="hidden sm:block w-full max-w-xl mx-auto">
            <SearchBar variant="hero" />
          </div>
        </div>

        {/* ── Sticky category chip bar ── */}
        <div
          className={cn(
            "sticky top-15 md:top-18 z-30 w-full py-2 bg-bg/95 backdrop-blur-sm border-b border-border transition-opacity",
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
                  variants={stagger}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 min-h-80"
                >
                  {filteredTools.map(tool => (
                    <m.div key={tool.id} variants={fadeUp}>
                      <ToolCard tool={tool} compact />
                    </m.div>
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

                {/* Recently Used */}
                {hydrated && recentTools.length > 0 && (
                  <AnimatePresence>
                    <m.section
                      key="recent"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.22 }}
                      style={{ overflow: "hidden" }}
                      aria-labelledby="recent-heading"
                    >
                      <SectionHeader
                        title={t("common.recent")}
                        subtitle="Pick up where you left off"
                        icon={Clock}
                      />
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                        {recentTools.map(tool => (
                          <ToolCard key={tool.id} tool={tool} compact />
                        ))}
                      </div>
                    </m.section>
                  </AnimatePresence>
                )}

                {/* Favorites */}
                {hydrated && favoriteTools.length > 0 && (
                  <AnimatePresence>
                    <m.section
                      key="favorites"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.22 }}
                      style={{ overflow: "hidden" }}
                      aria-labelledby="favorites-heading"
                    >
                      <SectionHeader
                        title={t("common.favorites")}
                        subtitle="Your hand-picked toolkit"
                        icon={Heart}
                      />
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                        {favoriteTools.map(tool => (
                          <ToolCard key={tool.id} tool={tool} compact />
                        ))}
                      </div>
                    </m.section>
                  </AnimatePresence>
                )}

                {/* Category quick-nav */}
                <CategoryQuickNav />

                {/* Popular Tools */}
                <section aria-labelledby="popular-heading">
                  <SectionHeader
                    title={t("common.popular")}
                    subtitle="Most-used across all users"
                    icon={TrendingUp}
                    badge="Hot"
                    href="/all-tools"
                  />
                  <m.div
                    variants={stagger}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-60px" }}
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4"
                  >
                    {popularTools.map(tool => (
                      <m.div key={tool.id} variants={fadeUp}>
                        <ToolCard tool={tool} compact />
                      </m.div>
                    ))}
                  </m.div>
                </section>

                {/* Inline promo banner */}
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
                  <Link
                    href="/all-tools"
                    className="relative inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-blue text-white text-sm font-bold shadow-md shadow-blue/25 hover:bg-blue-dark hover:-translate-y-0.5 transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2"
                  >
                    Browse All <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                </m.div>

                {/* All Tools Grid */}
                <section aria-labelledby="all-tools-heading" id="tools">
                  <SectionHeader
                    title={t("common.all")}
                    subtitle="The complete universal toolkit"
                    icon={LayoutGrid}
                    href="/all-tools"
                  />
                  <m.div
                    variants={stagger}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-80px" }}
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4"
                  >
                    {(ALL_TOOLS as ToolEntry[]).slice(0, 15).map(tool => (
                      <m.div key={tool.id} variants={fadeUp}>
                        <ToolCard tool={tool} compact />
                      </m.div>
                    ))}
                  </m.div>
                  <m.div variants={fadeUp} className="flex justify-center mt-8">
                    <Link
                      href="/all-tools"
                      aria-label="Browse all 100+ tools"
                      className="inline-flex items-center gap-2 h-11 px-6 rounded-xl bg-blue text-white text-sm font-bold shadow-md shadow-blue/25 hover:bg-blue-dark hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue/30 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2"
                    >
                      Browse All 100+ Tools
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </Link>
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
