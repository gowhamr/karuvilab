"use client";

import { useMemo, useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ALL_TOOLS, CATEGORIES, getRecentTools, ToolEntry } from "@/src/tool-registry";
import { ToolCard } from "@/components/ToolCard";
import { SearchBar } from "@/components/ui/SearchBar";
import { CategoryChips } from "@/components/ui/CategoryChips";
import { TrustIndicators } from "@/components/ui/TrustIndicators";
import { PrivacyFeatures } from "@/components/ui/PrivacyFeatures";
import { useSearchStore } from "@/src/store/useSearchStore";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion";
import { 
  ArrowRight, LayoutGrid, Star, Clock, 
  ShieldCheck, Zap, Heart, MessageSquare, 
  HelpCircle, Sparkles, TrendingUp
} from "lucide-react";

// ── Components ──────────────────────────────────────────────────────────────

function SectionHeader({ title, subtitle, icon: Icon, badge, href }: any) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 md:mb-8">
      <div className="space-y-2">
        {badge && (
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue/5 border border-blue/10 text-[9px] font-black uppercase tracking-widest text-blue">
            <Sparkles className="w-2.5 h-2.5" />
            {badge}
          </div>
        )}
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center text-text-3 shadow-sm">
              <Icon className="w-4 h-4" />
            </div>
          )}
          <h2 className="text-xl md:text-2xl font-black tracking-tight text-text">
            {title}
          </h2>
        </div>
        {subtitle && (
          <p className="text-xs md:text-sm text-text-4 font-semibold max-w-xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {href && (
        <Link 
          href={href}
          className="group flex items-center gap-2 text-[10px] font-black text-blue hover:translate-x-1 transition-all"
        >
          View all <ArrowRight className="w-3 h-3" />
        </Link>
      )}
    </div>
  );
}


const FAQ = [
  { q: "Is KaruviLab free for commercial use?", a: "Yes. All tools are 100% free for personal and commercial projects. No limits, no subscriptions, no credit cards required." },
  { q: "How secure is my data on this platform?", a: "Security is our core mission. All processing happens locally in your browser. Your files and text never leave your device. We use industry-standard sandboxing to ensure zero data leakage." },
  { q: "Can I use these tools offline?", a: "Most tools are designed to work offline once the page is loaded. Since processing is 100% client-side, you can disconnect from the internet and keep working." },
  { q: "Do you store any of my inputs or outputs?", a: "Absolutely not. We do not have a backend that processes your data. Everything stays in your browser's volatile memory and is cleared as soon as you close the tab." },
];

// ── Page Component ───────────────────────────────────────────────────────────

export default function Home() {
  const { searchQuery, setSearchQuery, activeCategory, setActiveCategory } = useSearchStore();
  const [recentTools, setRecentTools] = useState<ToolEntry[]>([]);

  useEffect(() => {
    setRecentTools(getRecentTools().slice(0, 5));
  }, []);

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

  const isSearching = !!(searchQuery || activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20 space-y-12 md:space-y-24">
      
      {/* ── 1. Hero Section ─────────────────────────────────────────────────── */}
      <section className="relative pt-8 md:pt-16 flex flex-col items-center text-center space-y-8 overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl aspect-square bg-blue/5 blur-[100px] rounded-full -z-10" />
        
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="space-y-4 max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-border shadow-sm mb-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-text-4">Local-first privacy</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[0.95] text-text">
            Every tool you need,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue via-indigo-500 to-blue-dark">
              right here.
            </span>
          </h1>
          
          <p className="text-base md:text-lg text-text-4 font-semibold max-w-xl mx-auto leading-relaxed">
            Fast, private browser tools. No uploads. No tracking.<br className="hidden md:block" />
            <span className="text-text-2">Everything runs locally on your device.</span>
          </p>
        </motion.div>

        <div className="w-full max-w-2xl mx-auto space-y-6">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-[9px] font-black uppercase tracking-widest text-text-4">Popular:</span>
            {["Compress PDF", "JSON Formatter", "Base64", "EMI"].map(s => (
              <button 
                key={s} 
                onClick={() => setSearchQuery(s)}
                className="px-2.5 py-0.5 bg-surface border border-border rounded-lg text-[10px] font-bold text-text-3 hover:border-blue/30 hover:text-blue transition-all"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="w-full max-w-4xl mx-auto pt-4">
          <TrustIndicators />
        </div>
      </section>

      {/* ── 2. Content Area (Search Results or Default) ─────────────────────── */}
      <div className="relative">
        {/* Sticky Category Nav */}
        <div className="sticky top-[56px] md:top-[64px] z-30 -mx-4 px-4 sm:mx-0 sm:px-0 py-2 bg-bg/80 backdrop-blur-xl border-b border-border/50">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex-1 overflow-hidden">
              <CategoryChips activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
            </div>
            {isSearching && (
              <button
                onClick={() => { setSearchQuery(""); setActiveCategory(null); }}
                className="text-[10px] font-black text-blue hover:underline whitespace-nowrap"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="pt-8 md:pt-12">
          <AnimatePresence mode="wait">
            {isSearching ? (
              <motion.section 
                key="search-results"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue/5 border border-blue/10 flex items-center justify-center text-blue">
                    <LayoutGrid className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-text">
                      {searchQuery ? `Search Results` : CATEGORIES.find(c => c.id === activeCategory)?.label}
                    </h2>
                    <p className="text-[10px] text-text-4 font-bold uppercase tracking-wider">{filteredTools.length} tools</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
                  {filteredTools.map(tool => (
                    <ToolCard key={tool.id} tool={tool} compact />
                  ))}
                </div>
              </motion.section>
            ) : (
              <motion.div 
                key="default-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-16 md:space-y-28"
              >
                {/* Popular Tools Area */}
                <section>
                  <SectionHeader 
                    title="Popular Tools" 
                    badge="Trending"
                    icon={TrendingUp}
                    href="/calculators"
                  />
                  <div className="flex overflow-x-auto no-scrollbar gap-3 md:gap-5 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x">
                    {popularTools.map(tool => (
                      <div key={tool.id} className="min-w-[220px] md:min-w-[280px] snap-start">
                        <ToolCard tool={tool} />
                      </div>
                    ))}
                  </div>
                </section>

                {/* Main Discovery Grid */}
                <section id="tools">
                  <SectionHeader 
                    title="All Utilities" 
                    icon={LayoutGrid}
                  />
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
                    {(ALL_TOOLS as ToolEntry[]).slice(0, 16).map(tool => (
                      <ToolCard key={tool.id} tool={tool} compact />
                    ))}
                  </div>
                  <div className="mt-8 flex justify-center">
                    <Link 
                      href="/calculators"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-surface border border-border rounded-xl text-xs font-black text-text hover:border-blue/30 hover:text-blue transition-all shadow-sm"
                    >
                      Browse 100+ Tools <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </section>

                {/* Privacy & Security */}
                <section>
                  <SectionHeader 
                    title="Privacy First" 
                    icon={ShieldCheck}
                  />
                  <PrivacyFeatures />
                </section>

                {/* FAQ Section */}
                <section className="max-w-3xl mx-auto w-full">
                  <SectionHeader 
                    title="FAQ" 
                    icon={MessageSquare}
                  />
                  <Accordion type="single" collapsible className="w-full space-y-2">
                    {FAQ.map((item, i) => (
                      <AccordionItem key={i} value={`item-${i}`} className="bg-surface border border-border rounded-xl px-4 border-b-0 overflow-hidden hover:border-blue/30 transition-colors">
                        <AccordionTrigger className="text-sm md:text-base py-4 hover:no-underline">{item.q}</AccordionTrigger>
                        <AccordionContent className="text-xs md:text-sm pb-4">{item.a}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </section>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── 8. Footer ───────────────────────────────────────────────────────── */}
      <footer className="pt-24 border-t border-border/50">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-12 md:gap-24 mb-24">
          <div className="col-span-2 space-y-8">
            <Link href="/" className="font-black text-3xl tracking-tighter inline-block">
              <span className="text-blue">Karuvi</span>Lab
            </Link>
            <p className="text-text-4 text-sm font-semibold leading-relaxed max-w-xs">
              The world's fastest, most private browser-side toolkit. No uploads. No tracking. Just pure performance.
            </p>
            <div className="flex items-center gap-4">
              {[ShieldCheck, Zap, Heart].map((Icon, i) => (
                <div key={i} className="w-10 h-10 rounded-xl bg-bg border border-border flex items-center justify-center text-text-4">
                  <Icon className="w-5 h-5" />
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-text-4">Platform</h4>
            <ul className="space-y-4 text-xs font-bold text-text-3">
              <li><Link href="/about" className="hover:text-blue transition-colors">About Us</Link></li>
              <li><Link href="/help" className="hover:text-blue transition-colors">How it works</Link></li>
              <li><Link href="/privacy" className="hover:text-blue transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-blue transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-text-4">Categories</h4>
            <ul className="space-y-4 text-xs font-bold text-text-3">
              {CATEGORIES.slice(0, 4).map(cat => (
                <li key={cat.id}><Link href={`/${cat.href}`} className="hover:text-blue transition-colors">{cat.label}</Link></li>
              ))}
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-text-4">Support</h4>
            <ul className="space-y-4 text-xs font-bold text-text-3">
              <li><Link href="/contact" className="hover:text-blue transition-colors">Report a Bug</Link></li>
              <li><Link href="/contact" className="hover:text-blue transition-colors">Feature Request</Link></li>
              <li><Link href="/contact" className="hover:text-blue transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-12 pb-16 border-t border-border/20">
          <p className="text-[10px] font-black uppercase tracking-widest text-text-4">© 2026 KaruviLab. Built for privacy.</p>
          <div className="flex items-center gap-8">
            <a href="#" className="text-[10px] font-black uppercase tracking-widest text-text-4 hover:text-blue transition-colors">Twitter</a>
            <a href="#" className="text-[10px] font-black uppercase tracking-widest text-text-4 hover:text-blue transition-colors">GitHub</a>
            <a href="#" className="text-[10px] font-black uppercase tracking-widest text-text-4 hover:text-blue transition-colors">Discord</a>
          </div>
          <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-4">
            Made with <Heart className="w-3 h-3 text-red-500 fill-current" /> in the browser
          </p>
        </div>
      </footer>
    </div>
  );
}
