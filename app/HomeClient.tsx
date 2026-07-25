"use client";

import { useMemo, useEffect, useState, memo, useCallback, useDeferredValue } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  LayoutGrid, TrendingUp, ChevronRight, Sparkles, SlidersHorizontal, FolderHeart,
  Heart, FilterX
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { CATEGORY_ICONS } from "@/components/ui/Icons";

const CURATED_SUGGESTIONS = [
  "reaction-time",
  "color-match",
  "currency-converter",
  "gst-calculator",
  "qrcode"
];

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

export default function HomeClient() {
  const router = useRouter();
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

  const [activeTab, setActiveTab] = useState<"tools" | "collections">("tools");
  
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
    return Array.from(merged).slice(0, MERGED_POPULAR_LIMIT());
    
    function MERGED_POPULAR_LIMIT() {
      return 10;
    }
  }, [popularToolsMap]);

  const deferredActiveCategory = useDeferredValue(activeCategory);
  const filteredTools = useMemo(() => {
    let list = ALL_TOOLS as ToolEntry[];
    
    if (deferredActiveCategory) {
      list = list.filter(t => t.category === deferredActiveCategory);
    }
    
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

  const toggleSmartFilter = useCallback((filterId: string) => {
    setActiveFilters(prev => 
      prev.includes(filterId) ? prev.filter(id => id !== filterId) : [...prev, filterId]
    );
  }, []);

  const handleClearFilters = useCallback(() => {
    handleCategoryChange(null);
    setActiveFilters([]);
  }, [handleCategoryChange]);

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

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    ALL_TOOLS.forEach(tool => {
      counts[tool.category] = (counts[tool.category] || 0) + 1;
    });
    return counts;
  }, []);

  const recommendedTools = useMemo(() => {
    return ALL_TOOLS.filter(t => CURATED_SUGGESTIONS.includes(t.id));
  }, []);

  const isReturning = hydrated && (recentTools.length > 0 || favoriteTools.length > 0);

  const renderCategoriesSection = (isFirstTime = false) => {
    return (
      <section aria-labelledby="categories-heading" className="space-y-6">
        <SectionHeader
          title={isFirstTime ? "Browse by Category" : "Popular Categories"}
          subtitle="Find specialized toolsets for your tasks"
          icon={LayoutGrid}
          headingId="categories-heading"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {CATEGORIES.map(cat => {
            const IconComponent = CATEGORY_ICONS[cat.id] || Sparkles;
            const count = categoryCounts[cat.id] || 0;
            return (
              <Link 
                key={cat.id} 
                href={cat.href} 
                className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-card min-h-11"
              >
                <Card 
                  variant="interactive" 
                  padding="md" 
                  className="h-full flex flex-col justify-between min-h-[140px] group transition-all duration-200 border-l-4"
                  style={{ 
                    borderLeftColor: cat.color,
                  }}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-105"
                        style={{ 
                          backgroundColor: `${cat.color}10`, 
                          color: cat.color,
                          border: `1px solid ${cat.color}20` 
                        }}
                      >
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <Badge variant="neutral" size="sm" className="bg-surface-elevated/50 text-[10px] font-bold">
                        {count} {count === 1 ? 'tool' : 'tools'}
                      </Badge>
                    </div>
                    <div>
                      <h3 className="text-body font-bold text-text-primary group-hover:text-primary transition-colors">
                        {cat.label}
                      </h3>
                      <p className="text-caption text-text-secondary mt-1 line-clamp-2 leading-relaxed">
                        {cat.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>
    );
  };



  const renderPersonalSection = () => {
    if (hydrated && favoriteIds.length > 0) {
      return (
        <section aria-labelledby="personal-heading-fav" className="space-y-6">
          <SectionHeader
            title="Continue where you left off"
            subtitle="Your favorited tools for quick access"
            icon={Heart}
            headingId="personal-heading-fav"
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
            {favoriteTools.map(tool => (
              <div key={tool.id} className="flex flex-col h-full">
                <ToolCard tool={tool} compact />
              </div>
            ))}
          </div>
        </section>
      );
    }
    return (
      <section aria-labelledby="personal-heading-rec" className="space-y-6">
        <SectionHeader
          title="Recommended for You"
          subtitle="Hand-picked local tools to get you started"
          icon={Sparkles}
          headingId="personal-heading-rec"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
          {recommendedTools.map(tool => (
            <div key={tool.id} className="flex flex-col h-full">
              <ToolCard tool={tool} compact />
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderFooterTransition = () => {
    return (
      <div className="relative pt-12 pb-4">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-divider/60" />
        </div>
        <div className="relative flex justify-center">
          <div className="px-4 bg-bg text-text-4 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-primary/50" />
            End of Toolkit
            <div className="w-1.5 h-1.5 rounded-full bg-brand-primary/50" />
          </div>
        </div>
        <div 
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-24 bg-gradient-to-t from-brand-primary/4 via-brand-primary/1 to-transparent blur-2xl pointer-events-none" 
          style={{ contentVisibility: 'auto' }}
        />
      </div>
    );
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="w-full space-y-0 pb-[calc(5rem+env(safe-area-inset-bottom,0px))] md:pb-16">

        <HomeHero isReturning={isReturning} />

        {/* ── Sticky category chip bar ── */}
        <div
          className={cn(
            "sticky top-15 md:top-18 z-sidebar w-full py-2 bg-bg/95 backdrop-blur-sm border-b border-border transition-opacity",
            isSidebarOpen && "opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto"
          )}
        >
          <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center gap-2">
            <div className="flex-1 min-w-0">
              <CategoryChips activeCategory={activeCategory} onCategoryChange={handleCategoryChange} />
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setShowSmartFilters(!showSmartFilters)}
                aria-label="Toggle smart filters"
                aria-expanded={showSmartFilters}
                aria-controls="smart-filters-panel"
                className={cn(
                  "min-h-9 min-w-9 px-2 flex items-center justify-center gap-1 text-xs font-bold hover:bg-surface border rounded-lg transition-colors uppercase tracking-widest",
                  activeFilters.length > 0 ? "border-brand-primary/50 text-brand-primary bg-brand-primary/5" : "border-border/80 text-text-3"
                )}
              >
                <SlidersHorizontal className="w-4 h-4" />
                {activeFilters.length > 0 && <span className="bg-brand-primary text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">{activeFilters.length}</span>}
              </button>

              {isFiltering && (
                <button
                  onClick={handleClearFilters}
                  aria-label="Clear active filter"
                  title="Clear filters"
                  className="min-h-9 min-w-9 flex items-center justify-center text-blue hover:text-blue-600 hover:bg-blue/10 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue border border-transparent hover:border-blue/20"
                >
                  <FilterX className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Smart Filters Panel ── */}
        <AnimatePresence>
          {showSmartFilters && (
            <m.div
              id="smart-filters-panel"
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              exit={{ opacity: 0, scaleY: 0 }}
              style={{ transformOrigin: 'top' }}
              transition={{ duration: 0.2 }}
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
                          "px-3 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 select-none active:scale-95 min-h-11 outline-none focus-visible:ring-2 focus-visible:ring-blue/40",
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

        {/* ── Main Tab Navigation ── */}
        <div id="tools-tabs-nav" className="max-w-7xl mx-auto px-4 md:px-8 pt-4 flex items-end justify-between border-b border-border/80 gap-x-2">
          <div className="flex gap-2 md:gap-6 shrink">
            <button
              onClick={() => setActiveTab("tools")}
              className={cn(
                "pb-3 pt-2 text-[10px] sm:text-xs md:text-sm font-black uppercase tracking-widest transition-all relative min-h-11 px-2 md:px-4 flex items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-blue/40 rounded-t-lg shrink-0",
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
                "pb-3 pt-2 text-[10px] sm:text-xs md:text-sm font-black uppercase tracking-widest transition-all relative flex items-center justify-center gap-1 sm:gap-1.5 min-h-11 px-2 md:px-4 outline-none focus-visible:ring-2 focus-visible:ring-blue/40 rounded-t-lg shrink-0",
                activeTab === "collections" ? "text-text" : "text-text-4 hover:text-text-2"
              )}
            >
              <FolderHeart className="w-3 h-3 sm:w-4 sm:h-4 hidden xs:block" /> Tool Collections
              {activeTab === "collections" && (
                <m.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary" />
              )}
            </button>
          </div>
        </div>

        {activeTab === "tools" ? (
          <>
            {/* ── Main content ── */}
            <div
              id="tool-grid-panel"
              role="tabpanel"
              aria-labelledby={activeCategory ? `tab-${activeCategory}` : "tab-all"}
              className="max-w-7xl mx-auto px-4 md:px-8 pt-6 md:pt-8 space-y-10 md:space-y-12"
            >
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
                      <div className="space-y-12">
                        {Object.entries(
                          filteredTools.reduce((acc, tool) => {
                            const sub = tool.subCategory || 'Other';
                            if (!acc[sub]) acc[sub] = [];
                            acc[sub].push(tool);
                            return acc;
                          }, {} as Record<string, typeof filteredTools>)
                        ).map(([groupName, groupTools]) => (
                          <m.section
                            key={groupName}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6"
                          >
                            <h2 className="text-xl font-black uppercase tracking-widest text-blue flex items-center gap-3">
                              <span className="w-8 h-px bg-blue/20" />
                              {groupName}
                            </h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 min-h-20 content-start">
                              {groupTools.map(tool => (
                                <div key={tool.id} className="flex flex-col h-full">
                                  <ToolCard tool={tool} compact />
                                </div>
                              ))}
                            </div>
                          </m.section>
                        ))}
                      </div>
                    )}
                  </m.section>
                ) : (
                  /* ── DEFAULT STATE ── */
                  <m.div
                    key="default-content"
                    initial={false}
                    animate={{ opacity: 1 }}
                    className="space-y-10 md:space-y-12"
                  >
                    {isReturning ? (
                      <>
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
                            initial={false}
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

                        {/* Popular Categories */}
                        {renderCategoriesSection(false)}



                        {/* Personal Section */}
                        {renderPersonalSection()}

                        {/* Footer Transition */}
                        {renderFooterTransition()}
                      </>
                    ) : (
                      <>
                        {/* Browse by Category - Placed FIRST for new users to shorten path */}
                        {renderCategoriesSection(true)}

                        {/* Popular Tools */}
                        <section aria-labelledby="popular-heading">
                          <SectionHeader
                            title={t("common.popular")}
                            subtitle="Most-used starter tools"
                            icon={TrendingUp}
                            badge="Hot"
                            headingId="popular-heading"
                          />
                          <m.div
                            initial={false}
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

                        {/* Inline promo / View All banner */}
                        <m.div
                          initial={false}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ type: "spring", stiffness: 260, damping: 24 }}
                          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue/10 via-indigo-500/8 to-purple-500/10 border border-blue/15 p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-4"
                        >
                          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue/5 to-transparent" />
                          <div className="relative flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-blue/15 border border-blue/20 flex items-center justify-center text-blue shrink-0">
                              <Sparkles className="w-6 h-6" aria-hidden="true" />
                            </div>
                            <div>
                              <p className="font-black text-text text-base leading-tight">Discover 150+ free tools</p>
                              <p className="text-sm text-text-muted mt-0.5">All local. No sign-up. No data sent to servers.</p>
                            </div>
                          </div>
                          <Link href="/all-tools" passHref legacyBehavior>
                            <Button variant="primary" size="md" className="min-w-[160px] cursor-pointer min-h-11 flex items-center justify-center">
                              Browse All Tools
                            </Button>
                          </Link>
                        </m.div>



                        {/* Footer Transition */}
                        {renderFooterTransition()}
                      </>
                    )}
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
