"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { TOOLS, CATEGORIES } from "@/src/tool-registry";
import { ToolCard } from "@/components/ToolCard";

export default function Home() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: Cmd/Ctrl + K to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filteredTools = useMemo(() => {
    return TOOLS.filter(tool => {
      const matchesSearch = 
        tool.name.toLowerCase().includes(search.toLowerCase()) ||
        tool.desc.toLowerCase().includes(search.toLowerCase()) ||
        tool.keywords.some(k => k.toLowerCase().includes(search.toLowerCase()));
      
      const matchesCategory = activeCategory ? tool.category === activeCategory : true;
      
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  const popularTools = useMemo(() => TOOLS.filter(t => t.popular), []);

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24">
      {/* Hero Section */}
      <section className="py-12 md:py-24 text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1]">
            Every tool you need, <br />
            <span className="text-blue bg-blue/5 px-4 rounded-2xl">right here.</span>
          </h1>
          <p className="text-xl md:text-2xl text-text-3 max-w-2xl mx-auto leading-relaxed">
            Fast, private, and secure browser-based tools. <br className="hidden md:block" />
            No data ever leaves your device.
          </p>
        </div>

        <div className="max-w-2xl mx-auto relative pt-8 group">
          <div className="absolute inset-0 bg-blue/20 blur-3xl opacity-0 group-focus-within:opacity-30 transition-opacity duration-500 -z-10" />
          <input
            ref={searchRef}
            type="text"
            placeholder="Search for a tool... (Press ⌘K)"
            className="w-full px-8 py-5 bg-surface border border-border rounded-2xl shadow-sm focus:ring-4 focus:ring-blue/10 focus:border-blue outline-none transition-all text-xl md:text-2xl placeholder:text-text-4"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="absolute right-6 top-[calc(2rem+18px)] flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1 px-2 py-1 bg-bg border border-border rounded-lg text-[10px] font-bold text-text-4">
              <span>⌘</span>
              <span>K</span>
            </div>
            <svg className="w-7 h-7 text-text-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="sticky top-[72px] z-20 bg-bg/80 backdrop-blur-md py-4 -mx-6 px-6 border-b border-border/0 transition-all flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => setActiveCategory(null)}
          className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all border ${!activeCategory ? "bg-blue text-white shadow-lg shadow-blue/25 border-blue" : "bg-surface border-border text-text-3 hover:border-blue hover:text-blue"}`}
        >
          All Tools
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all border ${activeCategory === cat.id ? "bg-blue text-white shadow-lg shadow-blue/25 border-blue" : "bg-surface border-border text-text-3 hover:border-blue hover:text-blue"}`}
          >
            <span className="mr-2">{cat.emoji}</span>
            {cat.label}
          </button>
        ))}
      </section>

      {/* Results */}
      <section className="animate-in fade-in duration-500 delay-150">
        {search || activeCategory ? (
          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h2 className="text-2xl font-bold">
                {filteredTools.length} {filteredTools.length === 1 ? "Result" : "Results"} found
              </h2>
              {search && (
                <button 
                  onClick={() => setSearch("")}
                  className="text-sm font-bold text-blue hover:underline"
                >
                  Clear search
                </button>
              )}
            </div>
            {filteredTools.length === 0 ? (
              <div className="py-24 text-center space-y-4">
                <div className="text-6xl">🔍</div>
                <h3 className="text-xl font-bold">No tools found for "{search}"</h3>
                <p className="text-text-4">Try searching for something else or browse categories.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTools.map(tool => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-24">
            {/* Popular Section */}
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-500/10 text-yellow-600 rounded-xl flex items-center justify-center text-xl shadow-inner">⭐</div>
                <h2 className="text-3xl font-black">Popular Tools</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {popularTools.map(tool => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </div>

            {/* Tool Guides / Blog-like Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h2 className="text-3xl font-black">Pro Tips & Guides</h2>
                <div className="space-y-6">
                  {[
                    {
                      title: "How to fix 'File Size Too Large' errors",
                      desc: "Most government portals have a 100KB or 500KB limit. Learn how to use our intelligent compression to hit the target every time without losing quality.",
                    },
                    {
                      title: "The Ultimate Guide to PDF Management",
                      desc: "From merging multiple documents to extracting specific pages, discover how to handle complex PDF workflows entirely in your browser.",
                    },
                    {
                      title: "Developer Workflow: Fast & Private",
                      desc: "Why upload sensitive JSON or Base64 data to unknown servers? Use KaruviLab's local tools to format, minify, and encode safely.",
                    }
                  ].map((guide, i) => (
                    <div key={i} className="group cursor-pointer space-y-2">
                      <h3 className="text-lg font-bold group-hover:text-blue transition-colors underline decoration-blue/20 decoration-2 underline-offset-4">{guide.title}</h3>
                      <p className="text-text-3 text-sm leading-relaxed">{guide.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <h2 className="text-3xl font-black">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  {[
                    {
                      q: "Are my files uploaded to a server?",
                      a: "No. KaruviLab uses 'Client-Side Processing'. This means all calculations happen on your computer. Your files never leave your device.",
                    },
                    {
                      q: "Is KaruviLab free to use?",
                      a: "Yes, 100% free. No subscriptions, no credits, and no hidden fees. We build these tools to help the community.",
                    },
                    {
                      q: "Can I use these tools on my mobile phone?",
                      a: "Yes! KaruviLab is fully responsive and works perfectly on Chrome, Safari, and Firefox on both iOS and Android.",
                    }
                  ].map((faq, i) => (
                    <div key={i} className="bg-surface border border-border p-5 rounded-2xl space-y-2">
                      <h3 className="font-bold text-sm">{faq.q}</h3>
                      <p className="text-text-3 text-sm leading-relaxed">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* All Categories */}
            {CATEGORIES.map(cat => {
              const catTools = TOOLS.filter(t => t.category === cat.id);
              if (catTools.length === 0) return null;
              return (
                <div key={cat.id} className="space-y-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue/10 text-blue rounded-xl flex items-center justify-center text-xl shadow-inner">{cat.emoji}</div>
                    <h2 className="text-3xl font-black">{cat.label}</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {catTools.map(tool => (
                      <ToolCard key={tool.id} tool={tool} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Footer Branding */}
      <footer className="pt-24 pb-12 text-center space-y-4 border-t border-border/50">
        <div className="font-bold text-2xl">
          <span className="text-blue">Karuvi</span>Lab
        </div>
        <p className="text-text-4 text-sm max-w-md mx-auto">
          Built for privacy and performance. All calculations and processing happen locally in your browser.
        </p>
      </footer>
    </div>
  );
}
