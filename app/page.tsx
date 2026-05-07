"use client";

import { useMemo, useEffect, useState } from "react";
import Link from "next/link";
import { ALL_TOOLS, CATEGORIES, getRecentTools, ToolEntry } from "@/src/tool-registry";
import { ToolCard } from "@/components/ToolCard";
import { SearchBar } from "@/components/ui/SearchBar";
import { useSearchStore } from "@/src/store/useSearchStore";
import {
  UploadCloud, Lock, Gift, Zap, ChevronRight, Star,
  Clock, ShieldCheck, ArrowRight, LayoutGrid, Info,
} from "lucide-react";

// ── Feature badges ────────────────────────────────────────────────────────────
const BADGES = [
  { icon: UploadCloud, label: "No Uploads",    crossed: true  },
  { icon: Lock,        label: "100% Private",  crossed: false },
  { icon: Gift,        label: "Free Forever",  crossed: false },
  { icon: Zap,         label: "Blazing Fast",  crossed: false },
];

// ── Floating hero cards ───────────────────────────────────────────────────────
const FLOAT_CARDS = [
  { emoji: "📄", label: "PDF Tools",      cls: "top-2  left-6   rotate-[-7deg]", bg: "bg-red-50  dark:bg-red-950/40  border-red-200  dark:border-red-900/50"  },
  { emoji: "💻", label: "Dev Tools",      cls: "top-6  right-4  rotate-[5deg]",  bg: "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/50" },
  { emoji: "🧮", label: "Calculators",   cls: "bottom-10 left-2  rotate-[6deg]",  bg: "bg-violet-50 dark:bg-violet-950/40 border-violet-200 dark:border-violet-900/50" },
  { emoji: "🔐", label: "Security",      cls: "bottom-4  right-8 rotate-[-4deg]", bg: "bg-amber-50  dark:bg-amber-950/40  border-amber-200  dark:border-amber-900/50"  },
  { emoji: "🖼️", label: "Image Tools",  cls: "top-1/2 left-1/3 -translate-y-1/2 rotate-[3deg]", bg: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/50" },
];

// ── Homepage FAQ ──────────────────────────────────────────────────────────────
const FAQ = [
  { q: "Is KaruviLab free for commercial use?",   a: "Yes. All tools are 100% free for personal and commercial projects with no limits or sign-up." },
  { q: "Do you track any of my data?",             a: "No. All processing happens locally in your browser. Your files and text never leave your device." },
  { q: "Can I use these tools offline?",           a: "Most tools work offline after the first load since all processing is client-side." },
  { q: "Are the tools mobile-friendly?",           a: "Yes. Every tool is designed mobile-first with touch-optimized controls and 48 px tap targets." },
];

export default function Home() {
  const { searchQuery, setSearchQuery, activeCategory, setActiveCategory } = useSearchStore();
  const [recentTools, setRecentTools] = useState<ToolEntry[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    setRecentTools(getRecentTools().slice(0, 4));
  }, []);

  const popularTools = useMemo(
    () => (ALL_TOOLS as ToolEntry[]).filter(t => t.popular).slice(0, 6),
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
    <div className="max-w-6xl mx-auto pb-24 px-4 sm:px-6 space-y-20">

      {/* ── 1. Hero ─────────────────────────────────────────────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center pt-8 md:pt-14">
        {/* Left column */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl xl:text-6xl font-black tracking-tight leading-[1.05]">
              Every tool you need,{" "}
              <span className="text-blue bg-blue/5 px-3 rounded-2xl whitespace-nowrap">right here.</span>
            </h1>
            <p className="text-base md:text-lg text-text-3 leading-relaxed font-medium max-w-md">
              Fast, private, and secure browser-based tools.{" "}
              <span className="text-text-2 font-semibold">No data ever leaves your device.</span>
            </p>
          </div>

          <SearchBar value={searchQuery} onChange={setSearchQuery} />

          {/* Feature Badges */}
          <div className="flex flex-wrap gap-2">
            {BADGES.map(({ icon: Icon, label, crossed }) => (
              <div
                key={label}
                className="flex items-center gap-1.5 px-3 py-2 bg-surface border border-border rounded-full text-xs font-bold text-text-3 min-h-[36px]"
              >
                <Icon className={`w-3.5 h-3.5 ${crossed ? "text-text-4 line-through" : "text-blue"}`} />
                <span className={crossed ? "line-through text-text-4" : ""}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right column — floating tool cards (desktop only) */}
        <div className="hidden lg:block relative h-72 select-none" aria-hidden>
          {/* Subtle radial glow */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-56 h-56 rounded-full bg-blue/10 blur-3xl opacity-60" />
          </div>
          {FLOAT_CARDS.map(({ emoji, label, cls, bg }) => (
            <div
              key={label}
              className={`absolute flex items-center gap-2.5 px-4 py-3 rounded-2xl border shadow-lg backdrop-blur-sm ${bg} ${cls} transition-transform duration-700`}
            >
              <span className="text-xl">{emoji}</span>
              <span className="text-xs font-bold text-text-2 whitespace-nowrap">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── 2. Search Results (when searching) ─────────────────────────────── */}
      {isSearching && (
        <section className="space-y-5 animate-in fade-in duration-300">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <LayoutGrid className="w-4 h-4 text-blue" />
              <h2 className="text-sm font-black uppercase tracking-widest">
                {searchQuery
                  ? `Search results`
                  : CATEGORIES.find(c => c.id === activeCategory)?.label}
                <span className="ml-2 text-text-4 font-bold">({filteredTools.length})</span>
              </h2>
            </div>
            <button
              onClick={() => { setSearchQuery(""); setActiveCategory(null); }}
              className="text-xs font-bold text-blue hover:underline"
            >
              Clear
            </button>
          </div>

          {filteredTools.length === 0 ? (
            <div className="py-16 text-center space-y-3 border border-dashed border-border rounded-2xl">
              <Info className="w-8 h-8 text-text-4 mx-auto" />
              <p className="text-sm font-medium text-text-3">No tools found for "{searchQuery}"</p>
              <p className="text-xs text-text-4">Try different keywords or browse categories below.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTools.map(tool => (
                <ToolCard key={tool.id} tool={tool} compact />
              ))}
            </div>
          )}
        </section>
      )}

      {/* ── 3. Default content (when not searching) ────────────────────────── */}
      {!isSearching && (
        <div className="space-y-20 animate-in fade-in duration-500">

          {/* ── Popular Tools ─────────────────────────────────────────────── */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <h2 className="text-xl font-black">Popular Tools</h2>
              </div>
              <Link
                href="/calculators/"
                className="flex items-center gap-1 text-xs font-bold text-blue hover:underline"
              >
                View All <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {popularTools.map(tool => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </section>

          {/* ── Browse by Category ────────────────────────────────────────── */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LayoutGrid className="w-4 h-4 text-blue" />
                <h2 className="text-xl font-black">Browse by Category</h2>
              </div>
              <button
                onClick={() => {}}
                className="flex items-center gap-1 text-xs font-bold text-blue hover:underline"
              >
                View all <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {CATEGORIES.map(cat => {
                const count = (ALL_TOOLS as ToolEntry[]).filter(t => t.category === cat.id).length;
                return (
                  <Link
                    key={cat.id}
                    href={`/${cat.href}`}
                    className="group flex items-center gap-3 p-4 min-h-[72px] bg-surface border border-border rounded-2xl hover:border-blue hover:bg-blue/5 transition-all active:scale-[0.98]"
                  >
                    <div className="w-10 h-10 rounded-xl bg-bg border border-border flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-110 transition-transform">
                      {cat.emoji}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-text text-sm truncate group-hover:text-blue transition-colors">
                        {cat.label}
                      </div>
                      <div className="text-xs text-text-4">{count} tools</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* ── Recently Used ─────────────────────────────────────────────── */}
          {recentTools.length > 0 && (
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-text-3" />
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
                  Clear all
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {recentTools.map(tool => (
                  <ToolCard key={tool.id} tool={tool} compact />
                ))}
              </div>
            </section>
          )}

          {/* ── Privacy CTA + FAQ ─────────────────────────────────────────── */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-8 border-t border-border/50">

            {/* Privacy / Why KaruviLab */}
            <div className="relative overflow-hidden bg-gradient-to-br from-blue/5 to-blue/10 border border-blue/20 rounded-3xl p-8 space-y-5">
              <div className="absolute -right-8 -bottom-8 text-[120px] opacity-10 select-none" aria-hidden>🛡️</div>
              <ShieldCheck className="w-8 h-8 text-blue" />
              <div className="space-y-2">
                <h2 className="text-2xl font-black">Built for privacy<br />and performance.</h2>
                <p className="text-text-3 text-sm leading-relaxed">
                  Every tool runs entirely in your browser. No file uploads, no tracking cookies, no accounts.
                  Your data is yours — always.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { icon: "⚡", title: "Zero Latency",  desc: "Runs on your device hardware instantly." },
                  { icon: "🌐", title: "Local-First",   desc: "No cloud. Processing happens in-browser." },
                  { icon: "🎁", title: "Always Free",   desc: "No paywalls, no sign-up, no limits." },
                ].map(item => (
                  <div key={item.title} className="flex items-center gap-3">
                    <span className="text-lg">{item.icon}</span>
                    <div>
                      <span className="text-sm font-bold text-text">{item.title}</span>
                      <span className="text-text-4 text-xs"> — {item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ Accordion */}
            <div className="space-y-5">
              <h2 className="text-xl font-black">Frequently Asked Questions</h2>
              <div className="space-y-2">
                {FAQ.map((item, i) => (
                  <div key={i} className="border border-border rounded-xl overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between px-5 py-4 min-h-[52px] text-left font-bold text-sm text-text hover:text-blue transition-colors"
                    >
                      <span>{item.q}</span>
                      <ChevronRight
                        className={`w-4 h-4 flex-shrink-0 ml-2 transition-transform text-text-4 ${openFaq === i ? "rotate-90" : ""}`}
                      />
                    </button>
                    {openFaq === i && (
                      <div className="px-5 pb-4 text-sm text-text-3 leading-relaxed border-t border-border/50">
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
      <footer className="pt-12 border-t border-border/50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
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
            <ul className="space-y-2 text-xs font-bold">
              {[
                { label: "About",   href: "/about" },
                { label: "Guides",  href: "/help" },
                { label: "Privacy", href: "/privacy" },
              ].map(l => (
                <li key={l.href}><Link href={l.href} className="text-text-3 hover:text-blue transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-text-4">Support</h4>
            <ul className="space-y-2 text-xs font-bold">
              {[
                { label: "Bug Report", href: "/contact" },
                { label: "Terms",      href: "/terms" },
                { label: "Settings",   href: "/settings" },
              ].map(l => (
                <li key={l.href}><Link href={l.href} className="text-text-3 hover:text-blue transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border/20 text-[9px] font-black uppercase tracking-[0.2em] text-text-4">
          <p>© 2026 KaruviLab. All rights reserved.</p>
          <div className="flex items-center gap-6">
            {["Twitter", "GitHub", "Discord"].map(s => (
              <a key={s} href="#" className="hover:text-blue transition-colors">{s}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
