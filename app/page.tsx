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
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 md:mb-12">
      <div className="space-y-3">
        {badge && (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue/5 border border-blue/10 text-[10px] font-black uppercase tracking-widest text-blue">
            <Sparkles className="w-3 h-3" />
            {badge}
          </div>
        )}
        <div className="flex items-center gap-4">
          {Icon && (
            <div className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center text-text-3 shadow-sm">
              <Icon className="w-5 h-5" />
            </div>
          )}
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-text">
            {title}
          </h2>
        </div>
        {subtitle && (
          <p className="text-sm md:text-base text-text-4 font-semibold max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {href && (
        <Link 
          href={href}
          className="group flex items-center gap-2 text-sm font-black text-blue hover:translate-x-1 transition-all"
        >
          View all <ArrowRight className="w-4 h-4" />
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32 space-y-24 md:space-y-40">
      
      {/* ── 1. Hero Section ─────────────────────────────────────────────────── */}
      <section className="relative pt-12 md:pt-24 lg:pt-32 flex flex-col items-center text-center space-y-12 overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl aspect-square bg-blue/5 blur-[120px] rounded-full -z-10" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-6 max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface border border-border shadow-sm mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-text-3">Privacy-first productivity</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.95] text-text">
            Every tool you need,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue via-indigo-500 to-blue-dark">
              right here.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-text-4 font-semibold max-w-2xl mx-auto leading-relaxed">
            Fast, private, and secure browser-based tools. <br className="hidden md:block" />
            No uploads. No tracking. <span className="text-text-2">Everything runs locally.</span>
          </p>
        </motion.div>

        <div className="w-full max-w-2xl mx-auto space-y-8">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-text-4">Popular:</span>
            {["Compress PDF", "JSON Formatter", "Base64", "EMI Calculator"].map(s => (
              <button 
                key={s} 
                onClick={() => setSearchQuery(s)}
                className="px-3 py-1 bg-surface border border-border rounded-lg text-xs font-bold text-text-3 hover:border-blue/30 hover:text-blue transition-all"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="w-full max-w-5xl mx-auto pt-8">
          <TrustIndicators />
        </div>
      </section>

      {/* ── 2. Content Area (Search Results or Default) ─────────────────────── */}
      <div className="relative">
        {/* Sticky Category Nav */}
        <div className="sticky top-[56px] md:top-[64px] z-30 -mx-4 px-4 sm:mx-0 sm:px-0 py-4 bg-bg/80 backdrop-blur-xl border-b border-border/50">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
            <div className="flex-1 overflow-hidden">
              <CategoryChips activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
            </div>
            {isSearching && (
              <button
                onClick={() => { setSearchQuery(""); setActiveCategory(null); }}
                className="hidden md:block text-xs font-black text-blue hover:underline whitespace-nowrap"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        <div className="pt-12 md:pt-16">
          <AnimatePresence mode="wait">
            {isSearching ? (
              <motion.section 
                key="search-results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-12"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue/5 border border-blue/10 flex items-center justify-center text-blue">
                      <LayoutGrid className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-text">
                        {searchQuery ? `Search Results` : CATEGORIES.find(c => c.id === activeCategory)?.label}
                      </h2>
                      <p className="text-xs text-text-4 font-bold uppercase tracking-wider">{filteredTools.length} tools found</p>
                    </div>
                  </div>
                </div>

                {filteredTools.length === 0 ? (
                  <div className="py-32 text-center space-y-6 bg-surface border-2 border-dashed border-border rounded-[40px]">
                    <div className="w-16 h-16 rounded-2xl bg-bg border border-border flex items-center justify-center text-text-4 mx-auto">
                      <HelpCircle className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xl font-black text-text">No matches found</p>
                      <p className="text-sm text-text-4 font-semibold">Try a different keyword or category.</p>
                    </div>
                    <button 
                      onClick={() => { setSearchQuery(""); setActiveCategory(null); }}
                      className="px-6 py-2 bg-blue text-white rounded-xl font-bold hover:scale-105 transition-transform"
                    >
                      Browse All Tools
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {filteredTools.map(tool => (
                      <ToolCard key={tool.id} tool={tool} compact />
                    ))}
                  </div>
                )}
              </motion.section>
            ) : (
              <motion.div 
                key="default-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-32 md:space-y-48"
              >
                {/* Popular Tools Horizontal Area */}
                <section>
                  <SectionHeader 
                    title="Most Popular Tools" 
                    subtitle="The most used utilities by our community, optimized for speed and privacy."
                    badge="Trending Now"
                    icon={TrendingUp}
                    href="/calculators"
                  />
                  <div className="flex overflow-x-auto no-scrollbar gap-4 md:gap-6 pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x">
                    {popularTools.map(tool => (
                      <div key={tool.id} className="min-w-[260px] md:min-w-[300px] snap-start">
                        <ToolCard tool={tool} />
                      </div>
                    ))}
                  </div>
                </section>

                {/* Main Discovery Grid */}
                <section id="tools">
                  <SectionHeader 
                    title="Powerful Browser Tools" 
                    subtitle="Browse our complete catalog of professional utilities, all running 100% locally."
                    icon={LayoutGrid}
                  />
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {(ALL_TOOLS as ToolEntry[]).slice(0, 16).map(tool => (
                      <ToolCard key={tool.id} tool={tool} compact />
                    ))}
                  </div>
                  <div className="mt-12 flex justify-center">
                    <Link 
                      href="/calculators"
                      className="inline-flex items-center gap-3 px-8 py-4 bg-surface border border-border rounded-2xl font-black text-text hover:border-blue/30 hover:text-blue transition-all shadow-sm"
                    >
                      Browse All 100+ Tools <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </section>

                {/* Recently Used */}
                {recentTools.length > 0 && (
                  <section>
                    <SectionHeader 
                      title="Recently Used" 
                      subtitle="Pick up exactly where you left off."
                      icon={Clock}
                    />
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {recentTools.map(tool => (
                        <Link
                          key={tool.id}
                          href={`/${tool.href}`}
                          className="flex items-center gap-3 p-4 bg-surface border border-border rounded-2xl hover:border-blue/30 hover:shadow-lg transition-all group overflow-hidden"
                        >
                          <div className="w-8 h-8 rounded-lg bg-bg border border-border flex items-center justify-center text-sm font-black text-text-4 group-hover:bg-blue/10 group-hover:text-blue group-hover:border-blue/20 transition-all">
                            {tool.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-text text-xs truncate group-hover:text-blue transition-colors">{tool.name}</div>
                            <div className="text-[9px] text-text-4 font-black uppercase">Recent</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </section>
                )}

                {/* Privacy & Security */}
                <section>
                  <SectionHeader 
                    title="Privacy & Security" 
                    subtitle="How we ensure your data never leaves your device."
                    icon={ShieldCheck}
                  />
                  <PrivacyFeatures />
                </section>

                {/* FAQ Section */}
                <section className="max-w-4xl mx-auto w-full">
                  <SectionHeader 
                    title="Common Questions" 
                    subtitle="Everything you need to know about KaruviLab."
                    icon={MessageSquare}
                  />
                  <Accordion type="single" collapsible className="w-full space-y-4">
                    {FAQ.map((item, i) => (
                      <AccordionItem key={i} value={`item-${i}`} className="bg-surface border border-border rounded-2xl px-6 border-b-0 overflow-hidden hover:border-blue/30 transition-colors">
                        <AccordionTrigger className="text-base md:text-lg hover:no-underline">{item.q}</AccordionTrigger>
                        <AccordionContent className="text-sm md:text-base">{item.a}</AccordionContent>
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
