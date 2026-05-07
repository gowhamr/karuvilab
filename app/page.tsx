"use client";

import { useMemo, useEffect, useState } from "react";
import { TOOLS, CATEGORIES, getRecentTools, ToolEntry } from "@/src/tool-registry";
import { ToolCard } from "@/components/ToolCard";
import { SearchBar } from "@/components/ui/SearchBar";
import { CategoryChips } from "@/components/ui/CategoryChips";
import { TrustIndicators } from "@/components/ui/TrustIndicators";
import { ToolIcon } from "@/components/ui/Icons";
import { useSearchStore } from "@/src/store/useSearchStore";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/Accordion";
import { 
  ChevronRight, 
  LayoutGrid, 
  Sparkles, 
  History, 
  HelpCircle, 
  Info,
  ShieldCheck,
  Zap,
  Globe,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  const { searchQuery, setSearchQuery, activeCategory, setActiveCategory } = useSearchStore();
  const [recentTools, setRecentTools] = useState<ToolEntry[]>([]);

  useEffect(() => {
    setRecentTools(getRecentTools().slice(0, 4));
  }, []);

  const filteredTools = useMemo(() => {
    if (!searchQuery && !activeCategory) return [];
    
    return TOOLS.filter(tool => {
      const matchesSearch = searchQuery ? (
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()))
      ) : true;
      
      const matchesCategory = activeCategory ? tool.category === activeCategory : true;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const popularTools = useMemo(() => TOOLS.filter(t => t.popular).slice(0, 8), []);

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24 px-4 sm:px-6">
      {/* 1. High-Dominance Search Hero */}
      <section className="pt-6 md:pt-12 pb-4 space-y-8 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="text-center space-y-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Professional tools, <span className="text-blue">private by design.</span>
          </h1>
          <p className="text-base md:text-lg text-text-3 max-w-xl mx-auto font-medium">
            Fast, browser-based utilities for developers and creators.
          </p>
        </div>

        <div className="space-y-6 max-w-3xl mx-auto">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <TrustIndicators />
        </div>
      </section>

      {/* 2. Content Sections */}
      {(searchQuery || activeCategory) ? (
        <section className="space-y-6 animate-in fade-in duration-500">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <LayoutGrid className="w-4 h-4 text-blue" />
              <h2 className="text-sm font-black uppercase tracking-widest">
                {searchQuery ? 'Search Results' : CATEGORIES.find(c => c.id === activeCategory)?.label}
                <span className="ml-2 text-text-4 font-bold text-xs">({filteredTools.length})</span>
              </h2>
            </div>
            <button 
              onClick={() => { setSearchQuery(""); setActiveCategory(null); }}
              className="text-[10px] font-black uppercase tracking-widest text-blue hover:underline"
            >
              Clear
            </button>
          </div>
          
          {filteredTools.length === 0 ? (
            <div className="py-16 text-center space-y-4 bg-elevated/50 border border-dashed border-border rounded-2xl">
              <Info className="w-8 h-8 text-text-4 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-lg font-bold">No results</h3>
                <p className="text-text-4 text-xs font-medium">Try different keywords or browse categories.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTools.map(tool => (
                <ToolCard key={tool.id} tool={tool} compact />
              ))}
            </div>
          )}
        </section>
      ) : (
        <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
          
          {/* 3. Popular Row (High Density) */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                <h2 className="text-sm font-black uppercase tracking-widest">Most Popular</h2>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {popularTools.map(tool => (
                <ToolCard key={tool.id} tool={tool} compact />
              ))}
            </div>
          </section>

          {/* 4. Categorized Explorer */}
          <section className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <LayoutGrid className="w-4 h-4 text-blue" />
                <h2 className="text-sm font-black uppercase tracking-widest">Explore Categories</h2>
              </div>
              <CategoryChips activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {CATEGORIES.map(cat => (
                <div key={cat.id} className="group p-5 bg-elevated/30 border border-border rounded-xl hover:border-blue/30 transition-all flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-bg border border-border flex items-center justify-center group-hover:bg-blue/10 transition-colors text-blue">
                        <ToolIcon category={cat.id} className="w-5 h-5" />
                      </div>
                      <ChevronRight className="w-4 h-4 text-text-4 group-hover:text-blue group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-black text-lg">{cat.label}</h3>
                      <p className="text-text-4 text-xs font-medium leading-relaxed line-clamp-2">{cat.description}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {TOOLS.filter(t => t.category === cat.id).slice(0, 2).map(t => (
                      <span key={t.id} className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-bg border border-border rounded text-text-4">
                        {t.name}
                      </span>
                    ))}
                    <span className="text-[9px] font-black uppercase tracking-wider py-0.5 text-blue">
                      +{TOOLS.filter(t => t.category === cat.id).length - 2} more
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 5. Trust & SEO (Compact Grid) */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-12 border-t border-border/50">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue" />
                <h2 className="text-sm font-black uppercase tracking-widest">Why KaruviLab?</h2>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { icon: Zap, title: "Zero Latency", desc: "Tools run instantly on your device hardware." },
                  { icon: Globe, title: "Local-First", desc: "Processing happens in-browser. No cloud uploads." },
                  { icon: Sparkles, title: "Pro Utilities", desc: "Expert-grade tools designed for speed." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 bg-surface border border-border rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-blue/5 flex items-center justify-center flex-shrink-0 text-blue">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-0.5">
                      <h3 className="text-sm font-bold text-text">{item.title}</h3>
                      <p className="text-text-3 text-[11px] font-medium leading-tight">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-blue" />
                <h2 className="text-sm font-black uppercase tracking-widest">FAQ</h2>
              </div>
              <Accordion type="single" collapsible className="w-full">
                {[
                  {
                    q: "Is it free for commercial use?",
                    a: "Yes. All tools are 100% free for both personal and commercial projects without limits.",
                  },
                  {
                    q: "How secure is my data?",
                    a: "Extremely. Since data processing is client-side, your files never touch our servers.",
                  },
                  {
                    q: "Do I need to install anything?",
                    a: "No. KaruviLab works entirely in your web browser across all modern devices.",
                  }
                ].map((faq, i) => (
                  <AccordionItem key={i} value={`item-${i}`}>
                    <AccordionTrigger className="text-xs">{faq.q}</AccordionTrigger>
                    <AccordionContent className="text-[11px]">{faq.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>
        </div>
      )}

      {/* 6. Dense Footer */}
      <footer className="pt-12 pb-8 border-t border-border/50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 space-y-4">
            <div className="font-black text-2xl tracking-tighter">
              <span className="text-blue">Karuvi</span>Lab
            </div>
            <p className="text-text-4 text-xs font-medium leading-relaxed max-w-xs">
              Fast, private browser-side toolkit. No uploads. No tracking. Pure performance.
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-text-4">Platform</h4>
            <ul className="space-y-1.5 text-xs font-bold">
              <li><Link href="/about" className="text-text-3 hover:text-blue">About</Link></li>
              <li><Link href="/help" className="text-text-3 hover:text-blue">Guides</Link></li>
              <li><Link href="/privacy" className="text-text-3 hover:text-blue">Privacy</Link></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-text-4">Support</h4>
            <ul className="space-y-1.5 text-xs font-bold">
              <li><Link href="/contact" className="text-text-3 hover:text-blue">Bug Report</Link></li>
              <li><Link href="/terms" className="text-text-3 hover:text-blue">Terms</Link></li>
              <li><Link href="/settings" className="text-text-3 hover:text-blue">Settings</Link></li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border/20 text-[9px] font-black uppercase tracking-[0.2em] text-text-4 text-center sm:text-left">
          <p>© 2026 KaruviLab. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-blue">Twitter</a>
            <a href="#" className="hover:text-blue">GitHub</a>
            <a href="#" className="hover:text-blue">Discord</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
