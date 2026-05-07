"use client";

import { useMemo, useEffect, useState } from "react";
import Link from "next/link";
import { ALL_TOOLS, CATEGORIES, getRecentTools, ToolEntry } from "@/src/tool-registry";
import { ToolCard } from "@/components/ToolCard";
import { SearchBar } from "@/components/ui/SearchBar";
import { CategoryChips } from "@/components/ui/CategoryChips";
import { useSearchStore } from "@/src/store/useSearchStore";
import {
  ShieldCheck, ArrowRight, LayoutGrid, Info, Star, Clock, 
  ChevronRight, Lock, Zap, Gift, UploadCloud, Search, 
  Command, FileText, Image as ImageIcon, Code, Calculator, Settings
} from "lucide-react";

// ── Feature badges row ────────────────────────────────────────────────────────
const FEATURES = [
  { icon: ShieldCheck, title: "No Uploads", desc: "Processing stays local" },
  { icon: Lock, title: "100% Private", desc: "Your data stays yours" },
  { icon: Gift, title: "Free Forever", desc: "No hidden costs" },
  { icon: Zap, title: "Blazing Fast", desc: "Optimized for speed" },
];

const POPULAR_SEARCHES = ["Compress PDF", "JSON Formatter", "Image Compressor", "Base64 Encode"];

// ── Hero Graphic (CSS-based 3D Grid) ──────────────────────────────────────────
function HeroGraphic() {
  const icons = [FileText, ImageIcon, Code, Lock, Calculator, Search];
  
  return (
    <div className="relative w-full max-w-[500px] aspect-square hidden lg:flex items-center justify-center select-none" aria-hidden="true">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-blue/10 blur-[100px] rounded-full animate-pulse" />
      
      {/* Main Container Card */}
      <div className="relative w-[340px] h-[340px] bg-surface/40 backdrop-blur-2xl border border-white/20 dark:border-white/5 rounded-[40px] shadow-2xl rotate-[-12deg] flex items-center justify-center">
        <div className="grid grid-cols-3 gap-6 p-8">
          {icons.map((Icon, i) => (
            <div 
              key={i} 
              className="w-16 h-16 rounded-2xl bg-surface/80 border border-white/40 dark:border-white/10 shadow-lg flex items-center justify-center text-blue animate-in fade-in zoom-in duration-700"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <Icon className="w-8 h-8" />
            </div>
          ))}
        </div>

        {/* Floating Accents */}
        <div className="absolute -top-6 -right-6 w-20 h-20 bg-blue/20 backdrop-blur-xl border border-white/20 rounded-2xl rotate-[15deg] animate-bounce-slow" />
        <div className="absolute -bottom-8 -left-4 w-16 h-16 bg-blue/10 backdrop-blur-md border border-white/10 rounded-full animate-pulse" />
      </div>
    </div>
  );
}

// ── Homepage FAQ ──────────────────────────────────────────────────────────────
const FAQ = [
  { q: "Is KaruviLab free for commercial use?", a: "Yes. All tools are 100% free for personal and commercial projects with no limits or sign-up." },
  { q: "How secure is my data on this platform?", a: "Extremely. All processing happens locally in your browser. Your files and text never leave your device." },
  { q: "Can I use these tools offline?", a: "Most tools work offline after the first load since all processing is client-side." },
  { q: "Do you store any of my data?", a: "No. We do not have servers that process your data. Everything stays in your browser's memory." },
];

export default function Home() {
  const { searchQuery, setSearchQuery, activeCategory, setActiveCategory } = useSearchStore();
  const [recentTools, setRecentTools] = useState<ToolEntry[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    setRecentTools(getRecentTools().slice(0, 5));
  }, []);

  const popularTools = useMemo(
    () => (ALL_TOOLS as ToolEntry[]).filter(t => t.popular).slice(0, 12),
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
    <div className="max-w-7xl mx-auto pb-24 px-4 sm:px-8 space-y-24">

      {/* ── 1. Hero Section ─────────────────────────────────────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pt-8 md:pt-16">
        <div className="space-y-10">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl xl:text-7xl font-black tracking-tight leading-[1.05]">
              Every tool you need,<br />
              <span className="text-blue">right here.</span>
            </h1>
            <p className="text-lg md:text-xl text-text-3 leading-relaxed font-medium max-w-xl">
              Fast, private, and secure browser-based tools.<br className="hidden md:block" />
              <span className="text-text-2 font-semibold">No data ever leaves your device.</span>
            </p>
          </div>

          <div className="space-y-4 max-w-2xl">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            <div className="flex flex-wrap items-center gap-2 px-1">
              <span className="text-xs font-bold text-text-4">Popular searches:</span>
              {POPULAR_SEARCHES.map(s => (
                <button 
                  key={s} 
                  onClick={() => setSearchQuery(s)}
                  className="text-xs font-bold text-text-3 px-3 py-1 bg-bg border border-border rounded-full hover:border-blue hover:text-blue transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 pt-4">
            {FEATURES.map((f, i) => (
              <div key={i} className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-2xl bg-blue/5 border border-blue/10 flex items-center justify-center text-blue group-hover:scale-110 transition-transform">
                  <f.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-text">{f.title}</h3>
                  <p className="text-xs text-text-4 font-medium">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <HeroGraphic />
      </section>

      {/* ── 2. Category Filter ──────────────────────────────────────────────── */}
      <div className="sticky top-[64px] z-30 py-4 bg-bg/80 backdrop-blur-md border-b border-border/50">
        <CategoryChips activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
      </div>

      {/* ── 3. Search Results ────────────────────────────────────────────────── */}
      {isSearching && (
        <section className="space-y-8 animate-in fade-in duration-300 scroll-mt-24">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue/10 flex items-center justify-center text-blue">
                <LayoutGrid className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-black">
                {searchQuery ? `Search Results` : CATEGORIES.find(c => c.id === activeCategory)?.label}
                <span className="ml-3 text-text-4 font-bold text-sm">({filteredTools.length})</span>
              </h2>
            </div>
            <button
              onClick={() => { setSearchQuery(""); setActiveCategory(null); }}
              className="text-sm font-bold text-blue hover:underline"
            >
              Clear filters
            </button>
          </div>

          {filteredTools.length === 0 ? (
            <div className="py-24 text-center space-y-4 border-2 border-dashed border-border rounded-[32px] bg-surface/30">
              <Info className="w-12 h-12 text-text-4 mx-auto" />
              <div className="space-y-1">
                <p className="text-lg font-bold text-text-2">No tools found matching your criteria</p>
                <p className="text-sm text-text-4">Try adjusting your search or category filter.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTools.map(tool => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          )}
        </section>
      )}

      {!isSearching && (
        <div className="space-y-32 animate-in fade-in duration-700">
          
          {/* ── 4. Popular Tools ─────────────────────────────────────────────── */}
          <section className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500">
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <h2 className="text-2xl font-black tracking-tight">Popular Tools</h2>
              </div>
              <Link href="/calculators/" className="group flex items-center gap-2 text-sm font-bold text-blue hover:underline">
                View all tools <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {popularTools.map(tool => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </section>

          {/* ── 5. Browse by Category ────────────────────────────────────────── */}
          <section className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue/10 flex items-center justify-center text-blue">
                  <LayoutGrid className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-black tracking-tight">Browse by Category</h2>
              </div>
              <button className="group flex items-center gap-2 text-sm font-bold text-blue hover:underline">
                View all categories <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {CATEGORIES.map(cat => {
                const count = ALL_TOOLS.filter(t => t.category === cat.id).length;
                return (
                  <Link
                    key={cat.id}
                    href={`/${cat.href}`}
                    className="group p-6 bg-surface border border-border rounded-3xl hover:border-blue/50 hover:shadow-xl hover:shadow-blue/5 transition-all duration-500 flex flex-col gap-6"
                  >
                    <div className="flex items-start justify-between">
                      <div className="text-3xl grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500">
                        {cat.emoji}
                      </div>
                      <div className="p-2 rounded-xl bg-bg border border-border text-text-4 group-hover:text-blue group-hover:border-blue/20 transition-all">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-bold text-text group-hover:text-blue transition-colors">{cat.label}</h3>
                      <p className="text-xs text-text-4 font-bold">{count} tools</p>
                      <p className="text-xs text-text-3 font-medium leading-relaxed line-clamp-2 mt-2">
                        {cat.description}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* ── 6. Recently Used ─────────────────────────────────────────────── */}
          {recentTools.length > 0 && (
            <section className="space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-500">
                    <Clock className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl font-black tracking-tight">Recently Used</h2>
                </div>
                <button
                  onClick={() => {
                    localStorage.removeItem("karuvi.recent.paths");
                    setRecentTools([]);
                  }}
                  className="text-xs font-bold text-text-4 hover:text-red-500 transition-colors"
                >
                  Clear history
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {recentTools.map(tool => (
                  <Link
                    key={tool.id}
                    href={`/${tool.href}`}
                    className="flex items-center gap-4 p-4 bg-surface border border-border rounded-2xl hover:border-blue/30 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-bg border border-border flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                      <ToolCard tool={tool} compact />
                      {/* Note: I'm just reusing icon/title logic here for dense view */}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-text text-sm truncate group-hover:text-blue transition-colors">{tool.name}</div>
                      <div className="text-[10px] text-text-4 font-bold">Just now</div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* ── 7. Trust & FAQ ────────────────────────────────────────────────── */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start pt-16 border-t border-border/50">
            
            {/* Privacy Card */}
            <div className="relative overflow-hidden bg-gradient-to-br from-blue to-blue-dark rounded-[40px] p-10 space-y-8 text-white shadow-2xl shadow-blue/20">
              <div className="absolute top-0 right-0 p-12 opacity-10" aria-hidden="true">
                <ShieldCheck className="w-48 h-48" />
              </div>
              <div className="space-y-4 relative z-10">
                <h2 className="text-3xl md:text-4xl font-black leading-tight">Built for privacy<br />and performance.</h2>
                <p className="text-blue-light/80 text-lg font-medium leading-relaxed max-w-md">
                  All tools are built with a privacy-first approach. Your data is processed locally in your browser and never leaves your device.
                </p>
              </div>
              <Link href="/privacy" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue rounded-2xl font-bold hover:scale-105 transition-all shadow-xl">
                Learn more about privacy <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* FAQ Accordion */}
            <div className="space-y-8">
              <h2 className="text-2xl font-black tracking-tight">Frequently Asked Questions</h2>
              <div className="space-y-3">
                {FAQ.map((item, i) => (
                  <div key={i} className="bg-surface border border-border rounded-2xl overflow-hidden transition-all hover:border-blue/30">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between px-6 py-5 text-left font-bold text-text hover:text-blue transition-colors"
                    >
                      <span>{item.q}</span>
                      <ChevronRight
                        className={`w-5 h-5 flex-shrink-0 ml-4 transition-transform text-text-4 ${openFaq === i ? "rotate-90 text-blue" : ""}`}
                      />
                    </button>
                    {openFaq === i && (
                      <div className="px-6 pb-6 text-text-3 text-sm leading-relaxed font-medium animate-in slide-in-from-top-2 duration-300">
                        {item.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}

      {/* ── 8. Footer ───────────────────────────────────────────────────────── */}
      <footer className="pt-16 pb-12 border-t border-border/50">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-12 mb-16">
          <div className="col-span-2 space-y-6">
            <Link href="/" className="font-black text-3xl tracking-tighter">
              <span className="text-blue">Karuvi</span>Lab
            </Link>
            <p className="text-text-4 text-sm font-medium leading-relaxed max-w-xs">
              The world's fastest, most private browser-side toolkit. No uploads. No tracking. Just pure performance.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-text-4">Platform</h4>
            <ul className="space-y-3 text-xs font-bold text-text-3">
              <li><Link href="/about" className="hover:text-blue transition-colors">About Us</Link></li>
              <li><Link href="/help" className="hover:text-blue transition-colors">How it works</Link></li>
              <li><Link href="/privacy" className="hover:text-blue transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-blue transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-text-4">Tools</h4>
            <ul className="space-y-3 text-xs font-bold text-text-3">
              <li><Link href="/" className="hover:text-blue transition-colors">All Tools</Link></li>
              <li><Link href="/" className="hover:text-blue transition-colors">Popular Tools</Link></li>
              <li><Link href="/" className="hover:text-blue transition-colors">New Tools</Link></li>
              <li><Link href="/" className="hover:text-blue transition-colors">Categories</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-text-4">Support</h4>
            <ul className="space-y-3 text-xs font-bold text-text-3">
              <li><Link href="/contact" className="hover:text-blue transition-colors">Report a Bug</Link></li>
              <li><Link href="/contact" className="hover:text-blue transition-colors">Feature Request</Link></li>
              <li><Link href="/contact" className="hover:text-blue transition-colors">Contact Us</Link></li>
              <li><Link href="/help" className="hover:text-blue transition-colors">Help Center</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-border/20 text-[10px] font-black uppercase tracking-widest text-text-4">
          <p>© 2026 KaruviLab. All rights reserved.</p>
          <div className="flex items-center gap-8">
            <a href="#" className="hover:text-blue transition-colors">Twitter</a>
            <a href="#" className="hover:text-blue transition-colors">GitHub</a>
            <a href="#" className="hover:text-blue transition-colors">Discord</a>
          </div>
          <p className="flex items-center gap-1.5">
            Made with <span className="text-red-500">❤️</span> for productivity
          </p>
        </div>
      </footer>
    </div>
  );
}
