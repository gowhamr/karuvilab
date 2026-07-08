"use client";

import { useMemo, useEffect, useState, memo, useCallback, useDeferredValue } from "react";
import Link from "next/link";
import { m, AnimatePresence, MotionConfig } from "framer-motion";
import { ALL_TOOLS, CATEGORIES, getRecentTools, ToolEntry } from "@/src/tool-registry";
import { ToolCard } from "@/components/ToolCard";
import { HomeHero } from "./HomeHero";
import { QuickActionsDashboard } from "@/components/ui/QuickActionsDashboard";
import { CategoryChips } from "@/components/ui/CategoryChips";
import { CollectionsDashboard } from "@/components/ui/collections/CollectionsDashboard";
import { useSearchStore } from "@/src/store/useSearchStore";
import { useFavoriteStore } from "@/src/store/useFavoriteStore";
import { useIntelligenceStore } from "@/src/store/useIntelligenceStore";
import { useAnalyticsStore } from "@/src/store/analyticsStore";
import { useI18n } from "@/src/lib/i18n/store";
import {
  LayoutGrid, TrendingUp, ChevronRight, Sparkles, SlidersHorizontal, FolderHeart
} from "lucide-react";
import { cn } from "@/src/lib/utils";

// ── Animation presets ─────────────────────────────────────────────────────────

const fadeUp = {
  hidden:  { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 260, damping: 22 },
  },
} as const;

// ── Smart Categories definition ───────────────────────────────────────────────

export interface SmartCategory {
  id: string;
  label: string;
  emoji: string;
}

export const SMART_CATEGORIES: SmartCategory[] = [
  { id: "popular", label: "Popular", emoji: "🔥" },
  { id: "favorites", label: "Favorites", emoji: "⭐" },
  { id: "recent", label: "Recently Used", emoji: "🕒" },
  { id: "new", label: "New Releases", emoji: "🆕" },
  { id: "pdf", label: "PDF", emoji: "📄" },
  { id: "image", label: "Image", emoji: "🖼" },
  { id: "media", label: "Media", emoji: "🎬" },
  { id: "developer", label: "Developer", emoji: "💻" },
  { id: "security", label: "Security", emoji: "🔒" },
  { id: "finance", label: "Finance", emoji: "📈" },
  { id: "student", label: "Student", emoji: "🎓" },
  { id: "business", label: "Business", emoji: "🏢" },
  { id: "travel", label: "Travel", emoji: "🌍" },
  { id: "design", label: "Design", emoji: "🎨" },
  { id: "productivity", label: "Productivity", emoji: "📅" },
  { id: "offline-only", label: "Offline Only", emoji: "📦" },
  { id: "advanced", label: "Advanced", emoji: "⚙️" }
];

const matchesSmartCategory = (tool: ToolEntry, categoryId: string, favoriteIds: string[], recentToolIds: string[]): boolean => {
  switch (categoryId) {
    case "popular":
      return !!tool.popular;
    case "favorites":
      return favoriteIds.includes(tool.id);
    case "recent":
      return recentToolIds.includes(tool.id);
    case "new":
      return tool.status === "new" || (tool.lastAdded ? (Date.now() - new Date(tool.lastAdded).getTime() < 14 * 24 * 60 * 60 * 1000) : false);
    case "pdf":
      return tool.category === "pdf" || tool.keywords.includes("pdf");
    case "image":
      return tool.category === "image" || tool.keywords.includes("image") || tool.keywords.includes("png") || tool.keywords.includes("jpg");
    case "media":
      return tool.category === "media" || tool.category === "image";
    case "developer":
      return tool.category === "developer" || tool.keywords.includes("code") || tool.keywords.includes("json") || tool.keywords.includes("developer");
    case "security":
      return tool.category === "security" || tool.keywords.includes("encrypt") || tool.keywords.includes("hash") || tool.keywords.includes("password");
    case "finance":
      return tool.subCategory === "Financial" || tool.keywords.includes("finance") || tool.keywords.includes("interest") || tool.keywords.includes("tax");
    case "student":
      return ["standard-calculator", "scientific-calculator", "unit-converter", "grammar-checker", "markdown", "age-calculator"].includes(tool.id) || tool.category === "calculators";
    case "business":
      return ["gst-calculator", "invoice-generator", "salary-calculator", "qrcode"].includes(tool.id) || tool.keywords.includes("business");
    case "travel":
      return ["currency-converter", "world-clock", "unit-converter"].includes(tool.id) || tool.keywords.includes("travel");
    case "design":
      return ["gradient-generator", "box-shadow-generator", "glassmorphism-generator", "color-palette-extractor", "image-crop"].includes(tool.id) || tool.category === "image";
    case "productivity":
      return tool.category === "productivity" || tool.category === "utilities";
    case "offline-only":
      return tool.requiresNetwork !== true;
    case "advanced":
      return tool.difficulty === "advanced" || tool.category === "developer" || tool.category === "security";
    default:
      return tool.category === categoryId;
  }
};

// ── Section Header ─────────────────────────────────────────────────────────────

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ElementType;
  badge?: string;
  href?: string;
  headingId?: string;
}

const SectionHeader = memo(function SectionHeader({
  title, subtitle, icon: Icon, badge, href, headingId,
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
          <h2 id={headingId} className="text-base md:text-lg font-black tracking-tight text-text flex items-center gap-2">
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
  const isSidebarOpen     = useSearchStore(state => state.isSidebarOpen);

  const favoriteIds = useFavoriteStore(state => state.favorites);
  const [recentTools,  setRecentTools]  = useState<ToolEntry[]>([]);
  const [favoriteTools, setFavorites]  = useState<ToolEntry[]>([]);
  const [hydrated, setHydrated]        = useState(false);
  const t = useI18n(s => s.t);

  const recordView       = useAnalyticsStore(state => state.recordView);
  const recordEngagement = useAnalyticsStore(state => state.recordEngagement);

  // Home Tabs
  const [activeTab, setActiveTab] = useState<"tools" | "collections">("tools");
  
  // Smart Filtering
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [showSmartFilters, setShowSmartFilters] = useState(false);

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
    let list = ALL_TOOLS as ToolEntry[];
    
    // Apply category filter if active
    if (deferredActiveCategory) {
      list = list.filter(t => t.category === deferredActiveCategory);
    }
    
    // Apply smart filters (AND logic)
    if (activeFilters.length > 0) {
      list = list.filter(tool => 
        activeFilters.every(filterId => 
          matchesSmartCategory(tool, filterId, favoriteIds, recentTools.map(r => r.id))
        )
      );
    }

    return list;
  }, [deferredActiveCategory, activeFilters, favoriteIds, recentTools]);

  const handleCategoryChange = useCallback((id: string | null) => {
    setActiveCategory(id);
    if (id) recordEngagement("homepage");
  }, [setActiveCategory, recordEngagement]);

  const toggleSmartFilter = (filterId: string) => {
    setActiveFilters(prev => 
      prev.includes(filterId) ? prev.filter(id => id !== filterId) : [...prev, filterId]
    );
  };

  const handleClearFilters = () => {
    handleCategoryChange(null);
    setActiveFilters([]);
  };

  const isFiltering = !!activeCategory || activeFilters.length > 0;

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
      <div className="w-full space-y-0 pb-[calc(5rem+env(safe-area-inset-bottom,0px))] md:pb-16">

        <HomeHero isReturning={isReturning} />

        {/* ── Main Tab Navigation ── */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-4 flex border-b border-border/80 gap-6">
          <button
            onClick={() => setActiveTab("tools")}
            className={cn(
              "pb-3 text-sm font-black uppercase tracking-widest transition-all relative",
              activeTab === "tools" ? "text-text" : "text-text-4 hover:text-text-2"
            )}
          >
            Browse Tools
            {activeTab === "tools" && (
              <m.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary" />
            )}
          </button>
          
          <button
            onClick={() => setActiveTab("collections")}
            className={cn(
              "pb-3 text-sm font-black uppercase tracking-widest transition-all relative flex items-center gap-1.5",
              activeTab === "collections" ? "text-text" : "text-text-4 hover:text-text-2"
            )}
          >
            <FolderHeart className="w-4 h-4" /> Tool Collections
            {activeTab === "collections" && (
              <m.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary" />
            )}
          </button>
        </div>

        {activeTab === "tools" ? (
          <>
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
                
                <div className="flex items-center gap-2 shrink-0">
                  {/* Smart Filters toggle */}
                  <button
                    onClick={() => setShowSmartFilters(!showSmartFilters)}
                    className={cn(
                      "min-h-11 px-3 flex items-center gap-1.5 text-xs font-bold hover:bg-surface border rounded-lg transition-colors uppercase tracking-widest",
                      activeFilters.length > 0 ? "border-brand-primary/50 text-brand-primary bg-brand-primary/5" : "border-border/80 text-text-3"
                    )}
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" /> Filters 
                    {activeFilters.length > 0 && <span className="bg-brand-primary text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">{activeFilters.length}</span>}
                  </button>

                  {isFiltering && (
                    <button
                      onClick={handleClearFilters}
                      aria-label="Clear active filter"
                      className="min-h-11 px-3 flex items-center gap-1 text-xs font-bold text-blue hover:bg-blue/5 rounded-lg transition-colors uppercase tracking-widest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* ── Smart Filters Panel ── */}
            <AnimatePresence>
              {showSmartFilters && (
                <m.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="w-full bg-surface-2/40 border-b border-border/80 overflow-hidden"
                >
                  <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 space-y-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Smart Categories & Filtering</span>
                    <div className="flex flex-wrap gap-2">
                      {SMART_CATEGORIES.map(cat => {
                        const isSelected = activeFilters.includes(cat.id);
                        return (
                          <button
                            key={cat.id}
                            onClick={() => toggleSmartFilter(cat.id)}
                            className={cn(
                              "px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 select-none active:scale-95",
                              isSelected 
                                ? "bg-brand-primary border-brand-primary text-white shadow-md shadow-brand-primary/10" 
                                : "bg-surface border-border text-text-3 hover:text-text hover:border-text-4/30"
                            )}
                          >
                            <span>{cat.emoji}</span>
                            <span>{cat.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </m.div>
              )}
            </AnimatePresence>

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
                      title={activeCategory ? (CATEGORIES.find(c => c.id === activeCategory)?.label ?? "Tools") : "Smart Search Results"}
                      subtitle={`${filteredTools.length} tools match active filters`}
                      icon={LayoutGrid}
                    />
                    
                    {filteredTools.length === 0 ? (
                      <div className="text-center py-20 bg-surface-2/10 border border-dashed border-border rounded-3xl flex flex-col items-center gap-3">
                        <SlidersHorizontal className="w-8 h-8 text-text-4" />
                        <div>
                          <p className="text-sm font-bold text-text">No tools match selected filter combination</p>
                          <p className="text-xs text-text-muted mt-1">Try clearing some of the active filters.</p>
                        </div>
                      </div>
                    ) : (
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
                    )}
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
                        headingId="popular-heading"
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
                        headingId="all-tools-heading"
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
          </>
        ) : (
          <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6 md:pt-8">
            <CollectionsDashboard />
          </div>
        )}
      </div>
    </MotionConfig>
  );
}
