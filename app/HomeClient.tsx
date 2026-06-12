"use client";

import { useMemo, useEffect, useState, memo, useCallback } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { m, AnimatePresence, MotionConfig } from "framer-motion";
import { ALL_TOOLS, CATEGORIES, getRecentTools, ToolEntry } from "@/src/tool-registry";
import { ToolCard } from "@/components/ToolCard";
import { SearchBar } from "@/components/ui/search/SearchBar";
import { CategoryChips } from "@/components/ui/CategoryChips";
import { useSearchStore } from "@/src/store/useSearchStore";
import { useFavoriteStore } from "@/src/store/useFavoriteStore";
import { useAnalyticsStore } from "@/src/store/analyticsStore";
import { 
  ArrowRight, LayoutGrid, Zap, ShieldCheck, 
  Sparkles, TrendingUp, Clock, Heart, Command
} from "lucide-react";
import { cn } from "@/src/lib/utils";

// ── Components ──────────────────────────────────────────────────────────────

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ElementType;
  badge?: string;
  href?: string;
}

const SectionHeader = memo(function SectionHeader({ title, subtitle, icon: Icon, badge, href }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4 md:mb-6">
      <div className="flex items-center gap-2.5">
        {Icon && (
          <div className="w-8 h-8 rounded-lg bg-blue/5 border border-blue/10 flex items-center justify-center text-blue shadow-sm">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <div>
          <h2 className="text-base md:text-lg font-black tracking-tight text-text flex items-center gap-2">
            {title}
            {badge && (
              <span className="px-1.5 py-0.5 rounded-md bg-blue/5 border border-blue/10 text-[11px] font-black uppercase tracking-widest text-blue">
                {badge}
              </span>
            )}
          </h2>
          {subtitle && (
            <p className="text-[11px] md:text-[12px] text-[--kv-text-muted] font-bold uppercase tracking-[0.15em]">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {href && (
        <Link 
          href={href}
          aria-label={`Explore all ${title}`}
          className="flex items-center gap-1 min-h-[44px] px-2 text-[12px] font-black text-blue hover:translate-x-0.5 transition-all uppercase tracking-widest"
        >
          Explore all <ArrowRight className="w-3 h-3" />
        </Link>
      )}
    </div>
  );
});


import { useI18n } from "@/src/lib/i18n/store";
import { usePerformanceSettings } from "@/src/lib/hooks";

// ── Animation Variants ───────────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20
    }
  }
} as const;

// ── Page Component ───────────────────────────────────────────────────────────

export default function HomeClient() {
  const activeCategory = useSearchStore(state => state.activeCategory);
  const setActiveCategory = useSearchStore(state => state.setActiveCategory);
  const setIsPaletteOpen = useSearchStore(state => state.setIsPaletteOpen);
  const isSidebarOpen = useSearchStore(state => state.isSidebarOpen);
  
  const favoriteIds = useFavoriteStore(state => state.favorites);
  const [recentTools, setRecentTools] = useState<ToolEntry[]>([]);
  const [favoriteTools, setFavorites] = useState<ToolEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const { t } = useI18n();

  // Analytics
  const recordView = useAnalyticsStore(state => state.recordView);
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

  // Usage-based popular tools
  const popularToolsMap = useSearchStore(state => state.popularTools);
  const popularTools = useMemo(() => {
    const usageBased = Object.entries(popularToolsMap)
      .filter(([_, count]) => count > 0)
      .sort((a, b) => b[1] - a[1])
      .map(([id]) => ALL_TOOLS.find(t => t.id === id))
      .filter(Boolean) as ToolEntry[];

    const hardcoded = (ALL_TOOLS as ToolEntry[]).filter(t => t.popular);

    if (usageBased.length < 4) {
      return hardcoded.slice(0, 10);
    }

    // Merge usage-based (priority) with hardcoded, keeping unique items
    const merged = new Set<ToolEntry>();
    usageBased.forEach(t => merged.add(t));
    hardcoded.forEach(t => merged.add(t));
    
    return Array.from(merged).slice(0, 10);
  }, [popularToolsMap]);

  const filteredTools = useMemo(() => {
    if (!activeCategory) return [];
    return (ALL_TOOLS as ToolEntry[]).filter(tool => {
      return tool.category === activeCategory;
    });
  }, [activeCategory]);

  const handleCategoryChange = useCallback((id: string | null) => {
    setActiveCategory(id);
    if (id) recordEngagement("homepage");
  }, [setActiveCategory, recordEngagement]);

  const isFiltering = !!activeCategory;

  return (
    <MotionConfig reducedMotion="user">
      <div className="w-full space-y-4 md:space-y-8 pb-12">
        
        {/* ── 1. Search & CTA Section ── */}
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="hidden sm:block w-full max-w-xl mx-auto space-y-3 pt-2 md:pt-4">
            <SearchBar variant="hero" />
            <div className="flex justify-center">
              <button
                onClick={() => setIsPaletteOpen(true)}
                className="h-[48px] px-6 rounded-xl border border-mat-border bg-transparent text-[15px] font-bold text-text flex items-center justify-center gap-2 hover:bg-mat-hover hover:border-mat-border-focus focus-visible:ring-2 focus-visible:ring-brand-primary transition-colors duration-150"
              >
                <Command className="w-4 h-4" />
                <span>Quick Search</span>
                <kbd className="text-[12px] font-mono">⌘K</kbd>
              </button>
            </div>
          </div>
        </div>

        {/* ── 2. Sticky Category Chips (Full Width Container) ── */}
        <div 
          className={cn(
            "sticky top-[60px] md:top-[72px] z-30 w-full py-2 bg-bg border-b border-border transition-all !opacity-100 overflow-hidden",
            isSidebarOpen && "invisible md:visible"
          )}
        >
          <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between gap-4">
            <div className="flex-1">
              <CategoryChips activeCategory={activeCategory} onCategoryChange={handleCategoryChange} />
            </div>
            {isFiltering && (
              <button
                onClick={() => { handleCategoryChange(null); }}
                className="text-[9px] font-bold text-blue hover:underline whitespace-nowrap uppercase tracking-widest"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* ── 3. Main Content Area ── */}
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div
            id="tool-grid-panel"
            role="tabpanel"
            aria-labelledby={activeCategory ? `tab-${activeCategory}` : 'tab-all'}
            className="pt-4 md:pt-6"
          >
            <AnimatePresence mode="wait">
              {isFiltering ? (
                <m.section 
                  key="category-results"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="space-y-6"
                >
                  <SectionHeader 
                    title={CATEGORIES.find(c => c.id === activeCategory)?.label || "Tools"}
                    subtitle="Category results"
                    icon={LayoutGrid}
                  />

                  <div className="min-h-[350px]">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                      {filteredTools.map(tool => (
                        <ToolCard key={tool.id} tool={tool} compact />
                      ))}
                    </div>
                  </div>
                </m.section>
              ) : (
                <m.div 
                  key="default-content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-8 md:space-y-10"
                >
                  {/* Recently Used */}
                  {recentTools.length > 0 && (
                    <div className="min-h-0 transition-all duration-300">
                      <AnimatePresence>
                        <m.section
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                          style={{ overflow: "hidden" }}
                        >
                          <SectionHeader 
                            title={t('common.recent')} 
                            subtitle="Pick up where you left off"
                            icon={Clock}
                          />
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                            {recentTools.map(tool => (
                              <ToolCard key={tool.id} tool={tool} compact />
                            ))}
                          </div>
                        </m.section>
                      </AnimatePresence>
                    </div>
                  )}

                  {/* Favorites */}
                  {favoriteTools.length > 0 && (
                    <div className="min-h-0 transition-all duration-300">
                      <AnimatePresence>
                        <m.section
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                          style={{ overflow: "hidden" }}
                        >
                          <SectionHeader 
                            title={t('common.favorites')} 
                            subtitle="Your hand-picked toolkit"
                            icon={Heart}
                          />
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                            {favoriteTools.map(tool => (
                              <ToolCard key={tool.id} tool={tool} compact />
                            ))}
                          </div>
                        </m.section>
                      </AnimatePresence>
                    </div>
                  )}

                  {/* Popular Tools */}
                  <section>
                    <SectionHeader 
                      title={t('common.popular')} 
                      subtitle="Industry standards"
                      icon={TrendingUp}
                      badge="Hot"
                      href="/all-tools"
                    />
                    
                    {/* Mobile: 2-col grid */}
                    <div className="sm:hidden grid grid-cols-2 gap-3">
                      {popularTools.slice(0, 6).map(tool => (
                        <ToolCard key={tool.id} tool={tool} compact />
                      ))}
                    </div>

                    {/* Tablet+ carousel */}
                    <div className="hidden sm:flex overflow-x-auto no-scrollbar gap-3 pb-2 snap-x snap-mandatory">
                      {popularTools.map(tool => (
                        <div key={tool.id} className="min-w-[220px] snap-start shrink-0">
                          <ToolCard tool={tool} />
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Main Grid */}
                  <section id="tools">
                    <SectionHeader 
                      title={t('common.all')} 
                      subtitle="Universal toolkit"
                      icon={LayoutGrid}
                      href="/all-tools"
                    />
                    <m.div 
                      variants={containerVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4"
                    >
                      {(ALL_TOOLS as ToolEntry[]).slice(0, 16).map(tool => (
                        <m.div key={tool.id} variants={itemVariants}>
                          <ToolCard tool={tool} compact />
                        </m.div>
                      ))}
                    </m.div>
                    <div className="mt-8 flex justify-center">
                      <Link 
                        href="/all-tools"
                        className="w-full flex items-center justify-center gap-2 h-[52px] md:w-auto md:inline-flex md:px-6 md:h-[48px] bg-[--kv-mat-raised] border border-[--kv-mat-border] rounded-xl text-[15px] font-semibold text-[--kv-text] hover:bg-[--kv-mat-hover] hover:border-[--kv-brand-primary]/40 hover:text-[--kv-brand-primary] transition-all duration-150"
                      >
                        Browse 100+ Tools <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </section>
                </m.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </MotionConfig>
  );
}
