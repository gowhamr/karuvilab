"use client";

import { useMemo, useEffect, useState, memo } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { m, AnimatePresence } from "framer-motion";
import { ALL_TOOLS, CATEGORIES, getRecentTools, ToolEntry } from "@/src/tool-registry";
import { ToolCard } from "@/components/ToolCard";
import { SearchBar } from "@/components/ui/SearchBar";
import { CategoryChips } from "@/components/ui/CategoryChips";
import { useSearchStore } from "@/src/store/useSearchStore";
import { useFavoriteStore } from "@/src/store/useFavoriteStore";
import { 
  ArrowRight, LayoutGrid, Zap, ShieldCheck, 
  Search, Laptop, Sparkles, TrendingUp,
  CloudOff, UserMinus, Lock, Heart, Command
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
          <h2 className="text-sm md:text-base font-black tracking-tight text-text flex items-center gap-2">
            {title}
            {badge && (
              <span className="px-1.5 py-0.5 rounded-md bg-blue/5 border border-blue/10 text-[8px] font-black uppercase tracking-widest text-blue">
                {badge}
              </span>
            )}
          </h2>
          {subtitle && (
            <p className="text-[10px] text-text-4 font-bold uppercase tracking-wider">
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

// ── Page Component ───────────────────────────────────────────────────────────

export default function HomeClient() {
  const searchQuery = useSearchStore(state => state.searchQuery);
  const setSearchQuery = useSearchStore(state => state.setSearchQuery);
  const activeCategory = useSearchStore(state => state.activeCategory);
  const setActiveCategory = useSearchStore(state => state.setActiveCategory);
  
  const favoriteIds = useFavoriteStore(state => state.favorites);
  const [recentTools, setRecentTools] = useState<ToolEntry[]>([]);
  const [favoriteTools, setFavorites] = useState<ToolEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    setHydrated(true);
    setRecentTools(getRecentTools().slice(0, 5));
  }, []);

  useEffect(() => {
    if (hydrated) {
      setFavorites(ALL_TOOLS.filter(t => favoriteIds.includes(t.id)).slice(0, 5));
    }
  }, [favoriteIds, hydrated]);

  const popularTools = useMemo(
    () => (ALL_TOOLS as ToolEntry[]).filter(t => t.popular).slice(0, 10),
    []
  );

  const filteredTools = useMemo(() => {
    if (!searchQuery && !activeCategory) return [];
    return (ALL_TOOLS as ToolEntry[]).filter(tool => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = q
        ? tool.name.toLowerCase().includes(q) ||
          tool.desc.toLowerCase().includes(q) ||
          (tool.keywords ?? []).some((k: string) => k.toLowerCase().includes(q))
        : true;
      const matchesCat = activeCategory ? tool.category === activeCategory : true;
      return matchesSearch && matchesCat;
    });
  }, [searchQuery, activeCategory]);

  const { shouldBlur } = usePerformanceSettings();
  const isSearching = !!(searchQuery || activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 pb-16 space-y-10 md:space-y-16">
      
      {/* ── 1. Hero Section (Compact & Command-First) ────────────────────────── */}
      <section className="relative pt-6 md:pt-12 flex flex-col items-center text-center space-y-6">
        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-4 max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-surface border border-border text-[9px] font-bold uppercase tracking-widest text-text-4">
            <Sparkles className="w-3 h-3 text-blue" />
            <span>{t('hero.tag')}</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter leading-[1.1] text-text">
            {t('hero.title')}<br />
            <span className="text-text-4">{t('hero.subtitle')}</span>
          </h1>
          
          <p className="text-xs md:text-sm text-text-3 font-medium max-w-md mx-auto leading-relaxed">
            {t('hero.desc')}
            <span className="block text-text-4 mt-1">Fast. Secure. Local-first.</span>
          </p>
        </m.div>

        <div className="w-full max-w-xl mx-auto space-y-3">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          
          {/* Inline Trust Strip */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-2">
            {[
              { icon: CloudOff, text: "No Uploads" },
              { icon: Lock, text: "100% Private" },
              { icon: UserMinus, text: "No Accounts" },
              { icon: Zap, text: "Instant" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-1.5 opacity-50 hover:opacity-100 transition-opacity">
                <item.icon className="w-3 h-3 text-blue" />
                <span className="text-[9px] font-bold uppercase tracking-widest text-text-4">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 2. Content Area ─────────────────────────────────────────────────── */}
      <div className="relative">
        {/* Horizontal Category Chips */}
        <div 
          className="sticky top-[60px] md:top-[72px] z-30 w-full max-w-[100vw] py-2 bg-surface/95 border-b border-border transition-all"
          style={{ backdropFilter: shouldBlur ? 'blur(12px)' : 'none' }}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex-1 overflow-hidden">
              <CategoryChips activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
            </div>
            {isSearching && (
              <button
                onClick={() => { setSearchQuery(""); setActiveCategory(null); }}
                className="text-[9px] font-bold text-blue hover:underline whitespace-nowrap uppercase tracking-widest"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="pt-8">
          <AnimatePresence mode="wait">
            {isSearching ? (
              <m.section 
                key="search-results"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="space-y-6"
              >
                <SectionHeader 
                  title={searchQuery ? `Results for "${searchQuery}"` : (CATEGORIES.find(c => c.id === activeCategory)?.label || "Tools")}
                  subtitle="Search results"
                  icon={Search}
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
                {/* 1. Popular Tools Area (Static-ish, above the fold) */}
                <section>
                  <SectionHeader 
                    title={t('common.popular')} 
                    subtitle="Industry standards"
                    icon={TrendingUp}
                    badge="Hot"
                    href="/all-tools"
                  />
                  <div className="flex overflow-x-auto no-scrollbar gap-3 md:gap-4 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x">
                    {popularTools.map(tool => (
                      <div key={tool.id} className="min-w-[150px] md:min-w-[220px] snap-start">
                        <ToolCard tool={tool} />
                      </div>
                    ))}
                  </div>
                </section>

                {/* 2. Personal Favorites (if any) */}
                {favoriteTools.length > 0 && (
                  <section className="animate-in fade-in slide-in-from-bottom-2 duration-500">
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
                  </section>
                )}

                {/* 3. Recently Used (if any) */}
                {recentTools.length > 0 && (
                  <section>
                    <SectionHeader 
                      title={t('common.recent')} 
                      subtitle="Pick up where you left off"
                      icon={TrendingUp}
                    />
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                      {recentTools.map(tool => (
                        <ToolCard key={tool.id} tool={tool} compact />
                      ))}
                    </div>
                  </section>
                )}

                {/* 4. Main Grid */}
                <section id="tools">
                  <SectionHeader 
                    title={t('common.all')} 
                    subtitle="Universal toolkit"
                    icon={LayoutGrid}
                    href="/all-tools"
                  />
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                    {(ALL_TOOLS as ToolEntry[]).slice(0, 15).map(tool => (
                      <ToolCard key={tool.id} tool={tool} compact />
                    ))}
                  </div>
                  <div className="mt-8 flex justify-center">
                    <Link 
                      href="/all-tools"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-surface border border-border rounded-xl text-[11px] font-black text-text hover:border-blue/30 hover:text-blue hover:shadow-lg transition-all shadow-sm uppercase tracking-widest"
                    >
                      Browse 100+ Tools <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </section>

                {/* Compact FAQ */}
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
              </m.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
