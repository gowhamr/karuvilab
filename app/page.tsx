"use client";

import { useMemo, useEffect, useState } from "react";
import Link from "next/link";
import { ALL_TOOLS, CATEGORIES, getRecentTools, ToolEntry } from "@/src/tool-registry";
import { ToolCard } from "@/components/ToolCard";
import { SearchBar } from "@/components/ui/SearchBar";
import { CategoryChips } from "@/components/ui/CategoryChips";
import { ToolIcon } from "@/components/ui/Icons";
import { useSearchStore } from "@/src/store/useSearchStore";
import {
  ShieldCheck, ArrowRight, LayoutGrid, Info, Star, Clock,
  ChevronRight, Lock, Zap, Gift, FileText,
  Image as ImageIcon, Code, Calculator, Search,
} from "lucide-react";

// ── Consts ────────────────────────────────────────────────────────────────────

const FEATURES = [
  { icon: ShieldCheck, title: "No Uploads",   desc: "Processing stays local"  },
  { icon: Lock,        title: "100% Private", desc: "Your data stays yours"   },
  { icon: Gift,        title: "Free Forever", desc: "No hidden costs"         },
  { icon: Zap,         title: "Blazing Fast", desc: "Optimized for speed"     },
];

const POPULAR_SEARCHES = ["Compress PDF", "JSON Formatter", "Image Compressor", "Base64 Encode"];

const FAQ = [
  { q: "Is KaruviLab free for commercial use?",  a: "Yes. All tools are 100% free for personal and commercial projects with no limits or sign-up." },
  { q: "How secure is my data on this platform?", a: "Extremely. All processing happens locally in your browser. Your files and text never leave your device." },
  { q: "Can I use these tools offline?",          a: "Most tools work offline after the first load since all processing is client-side." },
  { q: "Do you store any of my data?",            a: "No. We do not have servers that process your data. Everything stays in your browser's memory." },
];

// ── Hero Graphic ──────────────────────────────────────────────────────────────

function HeroGraphic() {
  const TILES = [
    { Icon: FileText,   bg: "bg-red-50    dark:bg-red-950/30    border-red-200    dark:border-red-900/40    text-red-500"     },
    { Icon: ImageIcon,  bg: "bg-violet-50 dark:bg-violet-950/30 border-violet-200 dark:border-violet-900/40 text-violet-500"  },
    { Icon: Code,       bg: "bg-blue-50   dark:bg-blue-950/30   border-blue-200   dark:border-blue-900/40   text-blue-500"    },
    { Icon: Lock,       bg: "bg-amber-50  dark:bg-amber-950/30  border-amber-200  dark:border-amber-900/40  text-amber-500"   },
    { Icon: Calculator, bg: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/40 text-emerald-500" },
    { Icon: Search,     bg: "bg-pink-50   dark:bg-pink-950/30   border-pink-200   dark:border-pink-900/40   text-pink-500"    },
  ];

  return (
    <div
      className="relative hidden lg:flex items-center justify-center w-full max-w-[440px] h-[380px] mx-auto select-none"
      aria-hidden="true"
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 bg-blue/10 blur-[80px] rounded-full pointer-events-none" />

      {/* Tilted card grid */}
      <div className="relative w-[320px] h-[320px] bg-surface/50 backdrop-blur-xl border border-border/60 rounded-[32px] shadow-2xl rotate-[-8deg] flex items-center justify-center overflow-hidden">
        <div className="grid grid-cols-3 gap-4 p-6">
          {TILES.map(({ Icon, bg }, i) => (
            <div
              key={i}
              className={`w-[72px] h-[72px] rounded-2xl border flex items-center justify-center shadow-sm ${bg}`}
            >
              <Icon className="w-8 h-8" />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue/5 to-transparent pointer-events-none" />
      </div>

      {/* Floating status badges */}
      <div className="absolute top-4 right-0 flex items-center gap-2.5 px-4 py-2.5 bg-surface/90 backdrop-blur-md border border-border/80 rounded-2xl shadow-xl rotate-[8deg]">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span className="text-xs font-black text-text-2 whitespace-nowrap">100% Browser-based</span>
      </div>
      <div className="absolute bottom-8 left-0 flex items-center gap-2.5 px-4 py-2.5 bg-surface/90 backdrop-blur-md border border-border/80 rounded-2xl shadow-xl rotate-[-6deg]">
        <span className="text-base leading-none">⚡</span>
        <span className="text-xs font-black text-text-2 whitespace-nowrap">60+ Free Tools</span>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

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
    <div className="max-w-7xl mx-auto pb-24 space-y-24">

      {/* ── 1. Hero ─────────────────────────────────────────────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pt-8 md:pt-14">
        <div className="space-y-10">

          {/* Eyebrow + headline */}
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue/5 border border-blue/15 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-blue animate-pulse" />
              <span className="text-[10px] font-black text-blue uppercase tracking-widest">60+ Privacy-first tools</span>
            </div>

            <h1 className="text-5xl md:text-6xl xl:text-7xl font-black tracking-tight leading-[1.0]">
              Every tool<br />
              you need,{" "}
              <span className="text-blue relative inline-block">
                right here.
                <span className="absolute inset-x-0 -bottom-1 h-[3px] rounded-full bg-blue/30" />
              </span>
            </h1>

            <p className="text-lg md:text-xl text-text-3 leading-relaxed font-medium max-w-lg">
              Fast, private, and secure browser-based tools.{" "}
              <span className="text-text-2 font-semibold">No data ever leaves your device.</span>
            </p>
          </div>

          {/* Search */}
          <div className="space-y-3 max-w-xl">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            <div className="flex flex-wrap items-center gap-2 px-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-text-4">Try:</span>
              {POPULAR_SEARCHES.map(s => (
                <button
                  key={s}
                  onClick={() => setSearchQuery(s)}
                  className="text-xs font-bold text-text-3 px-3 py-1.5 bg-surface border border-border rounded-full hover:border-blue/50 hover:text-blue transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Feature indicators */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            {FEATURES.map((f, i) => (
              <div key={i} className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-blue/5 border border-blue/10 flex items-center justify-center text-blue group-hover:scale-110 group-hover:bg-blue/10 transition-all flex-shrink-0">
                  <f.icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-black text-text leading-tight">{f.title}</div>
                  <div className="text-[10px] text-text-4 font-medium">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <HeroGraphic />
      </section>

      {/* ── 2. Sticky category filter ────────────────────────────────────────── */}
      <div className="sticky top-[52px] z-30 -mx-6 px-6 py-3 bg-bg/85 backdrop-blur-xl border-b border-border/50">
        <CategoryChips activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
      </div>

      {/* ── 3. Search / filter results ───────────────────────────────────────── */}
      {isSearching && (
        <section className="space-y-8 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue/10 flex items-center justify-center text-blue">
                <LayoutGrid className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-black">
                {searchQuery
                  ? `"${searchQuery}"`
                  : CATEGORIES.find(c => c.id === activeCategory)?.label}
                <span className="ml-2 text-sm font-bold text-text-4">({filteredTools.length} tools)</span>
              </h2>
            </div>
            <button
              onClick={() => { setSearchQuery(""); setActiveCategory(null); }}
              className="text-sm font-bold text-text-4 hover:text-blue transition-colors"
            >
              Clear ×
            </button>
          </div>

          {filteredTools.length === 0 ? (
            <div className="py-20 text-center space-y-3 border-2 border-dashed border-border rounded-3xl">
              <Info className="w-10 h-10 text-text-4 mx-auto" />
              <p className="text-base font-bold text-text-2">No tools found for &ldquo;{searchQuery}&rdquo;</p>
              <p className="text-sm text-text-4">Try different keywords or browse by category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredTools.map(tool => (
                <ToolCard key={tool.id} tool={tool} compact />
              ))}
            </div>
          )}
        </section>
      )}

      {/* ── Default sections ─────────────────────────────────────────────────── */}
      {!isSearching && (
        <div className="space-y-24 animate-in fade-in duration-500">

          {/* ── Popular Tools ──────────────────────────────────────────────────  */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-orange-500/10 flex items-center justify-center">
                  <Star className="w-4 h-4 text-orange-500 fill-orange-500" />
                </div>
                <h2 className="text-xl font-black">Popular Tools</h2>
              </div>
              <Link
                href="/calculators/"
                className="group flex items-center gap-1.5 text-xs font-black text-blue hover:underline uppercase tracking-wide"
              >
                View all <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* Horizontal scroll on mobile → grid on lg+ */}
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-1 lg:grid lg:grid-cols-3 xl:grid-cols-4 lg:overflow-visible">
              {popularTools.map(tool => (
                <div key={tool.id} className="flex-shrink-0 w-[200px] sm:w-[220px] lg:w-auto">
                  <ToolCard tool={tool} compact />
                </div>
              ))}
            </div>
          </section>

          {/* ── Browse by Category ─────────────────────────────────────────────  */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue/10 flex items-center justify-center text-blue">
                <LayoutGrid className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-black">Browse by Category</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {CATEGORIES.map(cat => {
                const count = ALL_TOOLS.filter(t => t.category === cat.id).length;
                return (
                  <Link
                    key={cat.id}
                    href={`/${cat.href}`}
                    className="group flex flex-col items-center gap-3 p-4 bg-surface border border-border rounded-2xl hover:border-blue/50 hover:shadow-lg hover:shadow-blue/5 transition-all duration-300 active:scale-[0.97] text-center"
                  >
                    <span className="text-2xl grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-300">
                      {cat.emoji}
                    </span>
                    <div>
                      <div className="text-xs font-black text-text group-hover:text-blue transition-colors leading-tight">
                        {cat.label}
                      </div>
                      <div className="text-[10px] text-text-4 font-bold mt-0.5">{count} tools</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* ── Recently Used ──────────────────────────────────────────────────  */}
          {recentTools.length > 0 && (
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-violet-500/10 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-violet-500" />
                  </div>
                  <h2 className="text-xl font-black">Recently Used</h2>
                </div>
                <button
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      localStorage.removeItem("karuvi.recent.paths");
                      setRecentTools([]);
                    }
                  }}
                  className="text-xs font-bold text-text-4 hover:text-red-500 transition-colors"
                >
                  Clear history
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                {recentTools.map(tool => (
                  <Link
                    key={tool.id}
                    href={`/${tool.href}`}
                    className="group flex items-center gap-3 p-4 min-h-[60px] bg-surface border border-border rounded-2xl hover:border-blue/40 hover:shadow-md transition-all"
                  >
                    <div className="w-9 h-9 rounded-xl bg-bg border border-border flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                      <ToolIcon
                        category={(tool as ToolEntry).category}
                        className="w-4 h-4 text-text-3 group-hover:text-blue transition-colors"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-black text-text truncate group-hover:text-blue transition-colors">
                        {tool.name}
                      </div>
                      <div className="text-[10px] text-text-4 font-bold truncate">{tool.desc}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* ── Privacy CTA + FAQ ──────────────────────────────────────────────  */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start pt-12 border-t border-border/50">

            {/* Privacy gradient card */}
            <div className="relative overflow-hidden bg-gradient-to-br from-blue to-indigo-600 rounded-3xl p-8 space-y-6 shadow-2xl shadow-blue/20">
              <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none" aria-hidden>
                <ShieldCheck className="w-48 h-48 text-white" />
              </div>

              <div className="relative space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">
                  Built for privacy<br />and performance.
                </h2>
                <p className="text-white/70 text-sm leading-relaxed max-w-sm">
                  All tools run entirely in your browser. No file uploads, no tracking cookies, no accounts needed. Your data is yours — always.
                </p>
              </div>

              <ul className="relative space-y-2.5">
                {[
                  "Zero data transmission — runs on your device",
                  "No accounts or sign-ups required — ever",
                  "Open to all — no paywalls or rate limits",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    </div>
                    <span className="text-white/80 text-xs font-semibold">{item}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/privacy"
                className="relative inline-flex items-center gap-2 px-5 py-3 bg-white text-blue font-black text-sm rounded-2xl hover:scale-[1.02] transition-all shadow-lg"
              >
                Privacy Policy <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* FAQ accordion */}
            <div className="space-y-5">
              <h2 className="text-xl font-black">Frequently Asked Questions</h2>
              <div className="space-y-2">
                {FAQ.map((item, i) => (
                  <div
                    key={i}
                    className="border border-border rounded-2xl overflow-hidden hover:border-blue/30 transition-colors"
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between px-5 py-4 min-h-[56px] text-left font-black text-sm text-text hover:text-blue transition-colors"
                    >
                      <span className="pr-4">{item.q}</span>
                      <ChevronRight
                        className={`w-4 h-4 flex-shrink-0 text-text-4 transition-transform duration-200 ${
                          openFaq === i ? "rotate-90 text-blue" : ""
                        }`}
                      />
                    </button>
                    {openFaq === i && (
                      <div className="px-5 pb-5 pt-4 text-sm text-text-3 leading-relaxed border-t border-border/50 animate-in slide-in-from-top-2 duration-200">
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

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="pt-16 border-t border-border/50">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">
          <div className="col-span-2 space-y-5">
            <Link href="/" className="font-black text-2xl tracking-tighter">
              <span className="text-blue">Karuvi</span>Lab
            </Link>
            <p className="text-text-4 text-xs font-medium leading-relaxed max-w-xs">
              The world&apos;s fastest, most private browser-side toolkit. No uploads. No tracking. Pure performance.
            </p>
          </div>

          {[
            {
              heading: "Platform",
              links: [["About Us", "/about"], ["How it works", "/help"], ["Privacy Policy", "/privacy"], ["Terms of Service", "/terms"]],
            },
            {
              heading: "Tools",
              links: [["All Tools", "/"], ["Popular Tools", "/"], ["New Tools", "/"], ["Categories", "/"]],
            },
            {
              heading: "Support",
              links: [["Report a Bug", "/contact"], ["Feature Request", "/contact"], ["Contact Us", "/contact"], ["Help Center", "/help"]],
            },
          ].map(col => (
            <div key={col.heading} className="space-y-4">
              <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-text-4">{col.heading}</h4>
              <ul className="space-y-2.5">
                {col.links.map(([label, href], i) => (
                  <li key={i}>
                    <Link href={href} className="text-xs font-bold text-text-3 hover:text-blue transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-border/20">
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-text-4">
            © 2026 KaruviLab. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {["Twitter", "GitHub", "Discord"].map(s => (
              <a key={s} href="#" className="text-[9px] font-black uppercase tracking-[0.15em] text-text-4 hover:text-blue transition-colors">
                {s}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
