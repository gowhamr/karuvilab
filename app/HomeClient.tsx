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
import { PrivacyFeatures } from "@/components/ui/PrivacyFeatures";
import { TrustIndicators } from "@/components/ui/TrustIndicators";
import { 
  ArrowRight, LayoutGrid, Zap, ShieldCheck, 
  Sparkles, TrendingUp, Clock, Heart, Command
} from "lucide-react";

const Accordion = dynamic(() => import("@/components/ui/Accordion").then(mod => mod.Accordion), { ssr: false });
const AccordionItem = dynamic(() => import("@/components/ui/Accordion").then(mod => mod.AccordionItem), { ssr: false });
const AccordionTrigger = dynamic(() => import("@/components/ui/Accordion").then(mod => mod.AccordionTrigger), { ssr: false });
const AccordionContent = dynamic(() => import("@/components/ui/Accordion").then(mod => mod.AccordionContent), { ssr: false });

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
            <p className="text-[12px] text-text-4 font-bold uppercase tracking-wider">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {href && (
        <Link 
          href={href}
          className="group flex items-center gap-1 text-[10px] font-black text-blue hover:translate-x-0.5 transition-all uppercase tracking-widest"
        >
          Explore all <ArrowRight className="w-3 h-3" />
        </Link>
      )}
    </div>
  );
});

const FAQ = [
  { q: "Is KV free for commercial use?", a: "Yes. KV (KaruviLab) is 100% free for personal and commercial projects. No limits, no subscriptions, no credit cards required." },
  { q: "How secure is my data on KV?", a: "Security is our core mission. All processing happens locally in your browser. Your files and text never leave your device." },
  { q: "Can I use these tools offline?", a: "Most KV tools are designed to work offline once loaded. Since processing is 100% client-side, you can disconnect and keep working." },
  { q: "Do you store any of my inputs or outputs?", a: "Absolutely not. KV does not have a backend that processes your data. Everything stays in your browser's volatile memory." },
];

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
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([id]) => ALL_TOOLS.find(t => t.id === id))
      .filter(Boolean) as ToolEntry[];

    // Fall back to hardcoded if no usage data yet
    if (usageBased.length < 4) {
      return (ALL_TOOLS as ToolEntry[]).filter(t => t.popular).slice(0, 10);
    }
    return usageBased;
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

  const { shouldBlur } = usePerformanceSettings();
  const isFiltering = !!activeCategory;

  return (
    <MotionConfig reducedMotion="user">
      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-16 space-y-10 md:space-y-16">
        
        {/* ── 1. Search & CTA Section (Centered & Clear next action) ─────────── */}
        <div className="w-full max-w-xl mx-auto space-y-3 pt-6 md:pt-10">
          {/* SearchBar: hidden on mobile (BottomNav + Header handle it) */}
          <div className="hidden sm:block">
            <SearchBar variant="hero" />
          </div>
          
          {/* Primary & Secondary CTAs */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/all-tools"
              className="w-full sm:w-auto flex-1 h-[52px] sm:h-[48px] rounded-xl bg-[--kv-brand-primary] text-white text-[16px] font-semibold flex items-center justify-center gap-2 shadow-lg shadow-[--kv-brand-glow] hover:opacity-90 active:scale-[0.98] transition-all duration-150 focus-visible:ring-2 focus-visible:ring-[--kv-brand-primary] focus-visible:ring-offset-2 focus-visible:ring-offset-[--kv-mat-base]"
            >
              <LayoutGrid className="w-5 h-5" />
              Browse 100+ Tools
            </Link>

            <button
              onClick={() => setIsPaletteOpen(true)}
              className="hidden sm:flex h-[48px] px-6 rounded-xl border border-mat-border bg-transparent text-[15px] font-bold text-text items-center justify-center gap-2 hover:bg-mat-hover hover:border-mat-border-focus focus-visible:ring-2 focus-visible:ring-brand-primary transition-colors duration-150"
            >
              <Command className="w-4 h-4" />
              <span>Quick Search</span>
              <kbd className="text-[12px] font-mono">⌘K</kbd>
            </button>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="w-full max-w-5xl mx-auto pt-2 md:pt-4">
          <TrustIndicators />
        </div>

        {/* ── 2. Content Area ─────────────────────────────────────────────────── */}
        <div className="relative">
          {/* Horizontal Category Chips */}
          <div 
            className="sticky top-[60px] md:top-[72px] z-30 w-full max-w-[100vw] py-2 bg-surface/95 border-b border-border transition-all"
            style={{ backdropFilter: shouldBlur ? 'blur(12px)' : 'none' }}
          >
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
              <div className="flex-1 overflow-hidden">
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

          <div className="pt-8">
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

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                    {filteredTools.map(tool => (
                      <ToolCard key={tool.id} tool={tool} compact />
                    ))}
                  </div>
                </m.section>
              ) : (
                <m.div 
                  key="default-content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-12 md:space-y-20"
                >
                  {/* 1. Recently Used (if any) — CLS-safe */}
                  <div className="min-h-0 transition-all duration-300">
                    <AnimatePresence>
                      {recentTools.length > 0 && (
                        <m.section
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
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
                      )}
                    </AnimatePresence>
                  </div>

                  {/* 2. Personal Favorites (if any) — CLS-safe */}
                  <div className="min-h-0 transition-all duration-300">
                    <AnimatePresence>
                      {favoriteTools.length > 0 && (
                        <m.section
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
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
                      )}
                    </AnimatePresence>
                  </div>

                  {/* 3. Popular Tools Area (Optimized mobile/desktop rendering) */}
                  <section>
                    <SectionHeader 
                      title={t('common.popular')} 
                      subtitle="Industry standards"
                      icon={TrendingUp}
                      badge="Hot"
                      href="/all-tools"
                    />
                    
                    {/* Mobile: 2-col grid (no scroll) */}
                    <div className="sm:hidden grid grid-cols-2 gap-3">
                      {popularTools.slice(0, 6).map(tool => (
                        <ToolCard key={tool.id} tool={tool} compact />
                      ))}
                    </div>

                    {/* sm+: horizontal scroll carousel */}
                    <div className="hidden sm:block relative">
                      <div className="flex overflow-x-auto no-scrollbar gap-3 md:gap-4 pb-2 snap-x snap-mandatory">
                        {popularTools.map(tool => (
                          <div key={tool.id} className="min-w-[200px] snap-start shrink-0">
                            <ToolCard tool={tool} />
                          </div>
                        ))}
                      </div>
                      {/* Fade gradient at right edge */}
                      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-mat-base to-transparent pointer-events-none" />
                    </div>
                  </section>

                  {/* 4. Main Grid */}
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
                      {(ALL_TOOLS as ToolEntry[]).slice(0, 15).map(tool => (
                        <m.div key={tool.id} variants={itemVariants}>
                          <ToolCard tool={tool} compact />
                        </m.div>
                      ))}
                    </m.div>
                    <div className="mt-8 flex justify-center">
                      <Link 
                        href="/all-tools"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-surface border border-border rounded-xl text-[11px] font-black text-text hover:border-blue/30 hover:text-blue hover:shadow-lg transition-all shadow-sm uppercase tracking-widest"
                      >
                        Browse 100+ Tools <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </section>

                  {/* Privacy Features section — resurrected */}
                  <section className="max-w-4xl mx-auto w-full">
                    <SectionHeader
                      title="Built for Privacy"
                      subtitle="Why local-first matters"
                      icon={ShieldCheck}
                    />
                    <PrivacyFeatures />
                  </section>

                  {/* Compact FAQ */}
                  {hydrated && (
                    <section className="max-w-3xl mx-auto w-full">
                      <SectionHeader 
                        title="Frequently Asked" 
                        subtitle="Support & Privacy"
                        icon={ShieldCheck}
                      />
                      <Accordion type="single" collapsible className="w-full space-y-2">
                        {FAQ.map((item, i) => (
                          <AccordionItem key={i} value={`item-${i}`} className="bg-surface/50 border border-border/50 rounded-xl px-4 overflow-hidden hover:border-blue/30 transition-all">
                            <AccordionTrigger className="text-[11px] md:text-xs font-black uppercase tracking-widest py-4 hover:no-underline text-text-2">{item.q}</AccordionTrigger>
                            <AccordionContent className="text-xs text-text-3 font-medium pb-4 leading-relaxed">{item.a}</AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </section>
                  )}
                </m.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </MotionConfig>
  );
}
