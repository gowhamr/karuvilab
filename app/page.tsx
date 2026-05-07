"use client";

import { useState, useMemo, useEffect } from "react";
import { TOOLS, CATEGORIES, getRecentTools, ToolEntry } from "@/src/tool-registry";
import { ToolCard } from "@/components/ToolCard";
import { SearchBar } from "@/components/ui/SearchBar";
import { CategoryChips } from "@/components/ui/CategoryChips";
import { TrustIndicators } from "@/components/ui/TrustIndicators";
import { ToolIcon } from "@/components/ui/Icons";
import { ChevronRight, LayoutGrid, Sparkles, History, HelpCircle, Info } from "lucide-react";

export default function Home() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [recentTools, setRecentTools] = useState<ToolEntry[]>([]);

  useEffect(() => {
    setRecentTools(getRecentTools().slice(0, 4));
  }, []);

  const filteredTools = useMemo(() => {
    if (!search && !activeCategory) return [];
    
    return TOOLS.filter(tool => {
      const matchesSearch = search ? (
        tool.name.toLowerCase().includes(search.toLowerCase()) ||
        tool.desc.toLowerCase().includes(search.toLowerCase()) ||
        tool.keywords.some(k => k.toLowerCase().includes(search.toLowerCase()))
      ) : true;
      
      const matchesCategory = activeCategory ? tool.category === activeCategory : true;
      
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  const popularTools = useMemo(() => TOOLS.filter(t => t.popular).slice(0, 6), []);

  return (
    <div className="max-w-6xl mx-auto space-y-16 pb-24">
      {/* 1. Hero & Search - Unified Focus */}
      <section className="pt-8 md:pt-16 pb-8 space-y-10 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
            Professional tools, <span className="text-blue">private by design.</span>
          </h1>
          <p className="text-lg md:text-xl text-text-3 max-w-2xl mx-auto font-medium">
            Fast, browser-based utilities for developers and creators.
          </p>
        </div>

        <div className="space-y-6">
          <SearchBar value={search} onChange={setSearch} />
          <TrustIndicators />
        </div>
      </section>

      {/* 2. Dynamic Content Area */}
      {(search || activeCategory) ? (
        <section className="space-y-8 animate-in fade-in duration-500">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-2">
              <LayoutGrid className="w-5 h-5 text-blue" />
              <h2 className="text-xl font-black uppercase tracking-widest">
                {search ? 'Search Results' : CATEGORIES.find(c => c.id === activeCategory)?.label}
                <span className="ml-3 text-text-4 font-bold text-sm">({filteredTools.length})</span>
              </h2>
            </div>
            <button 
              onClick={() => { setSearch(""); setActiveCategory(null); }}
              className="text-xs font-black uppercase tracking-widest text-blue hover:underline"
            >
              Clear filters
            </button>
          </div>
          
          {filteredTools.length === 0 ? (
            <div className="py-20 text-center space-y-6 bg-elevated border border-border rounded-3xl">
              <div className="w-16 h-16 bg-bg border border-border rounded-2xl flex items-center justify-center mx-auto">
                <Info className="w-8 h-8 text-text-4" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">No tools match your search</h3>
                <p className="text-text-4 max-w-xs mx-auto text-sm">Try using different keywords or browse our categories below.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools.map(tool => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          )}
        </section>
      ) : (
        <div className="space-y-20 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
          
          {/* 3. Recently Used & Popular - Discovery Layer */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-500" />
                  <h2 className="text-xl font-black uppercase tracking-widest">Popular Right Now</h2>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {popularTools.map(tool => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </div>

            {recentTools.length > 0 && (
              <aside className="space-y-8">
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5 text-blue" />
                  <h2 className="text-xl font-black uppercase tracking-widest">Recent</h2>
                </div>
                <div className="space-y-3">
                  {recentTools.map(tool => (
                    <ToolCard key={tool.id} tool={tool} />
                  ))}
                </div>
              </aside>
            )}
          </div>

          {/* 4. Categorized Explorer */}
          <section className="space-y-10">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <LayoutGrid className="w-5 h-5 text-blue" />
                <h2 className="text-xl font-black uppercase tracking-widest">Explore by Category</h2>
              </div>
              <CategoryChips activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
              {CATEGORIES.map(cat => (
                <div key={cat.id} className="group p-8 bg-elevated border border-border rounded-3xl hover:border-blue/30 transition-all">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-bg border border-border flex items-center justify-center group-hover:bg-blue/10 transition-colors">
                      <ToolIcon category={cat.id} className="w-6 h-6 text-blue" />
                    </div>
                    <ChevronRight className="w-5 h-5 text-text-4 group-hover:text-blue group-hover:translate-x-1 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-black">{cat.label}</h3>
                    <p className="text-text-4 text-sm font-medium leading-relaxed">{cat.description}</p>
                  </div>
                  <div className="mt-8 flex flex-wrap gap-2">
                    {TOOLS.filter(t => t.category === cat.id).slice(0, 3).map(t => (
                      <span key={t.id} className="text-[10px] font-black uppercase tracking-wider px-2 py-1 bg-bg border border-border rounded-md text-text-4">
                        {t.name}
                      </span>
                    ))}
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-1 text-blue">
                      +{TOOLS.filter(t => t.category === cat.id).length - 3} more
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 5. SEO & Reliability Section */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 border-t border-border/50">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-blue" />
                <h2 className="text-xl font-black uppercase tracking-widest">Built for Privacy</h2>
              </div>
              <div className="space-y-4">
                {[
                  {
                    title: "Local-First Execution",
                    desc: "Your data never leaves your device. All calculations, image processing, and file modifications happen directly in your browser.",
                  },
                  {
                    title: "No Account Required",
                    desc: "Start using any tool instantly. We don't track your identity, and we don't store your sensitive information on any server.",
                  },
                  {
                    title: "Enterprise Grade Performance",
                    desc: "Engineered with Next.js 16 and Rust-powered workers for maximum speed, even when handling large files or complex logic.",
                  }
                ].map((item, i) => (
                  <div key={i} className="bg-surface border border-border p-6 rounded-2xl space-y-2">
                    <h3 className="font-bold text-text">{item.title}</h3>
                    <p className="text-text-3 text-sm leading-relaxed font-medium">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue" />
                <h2 className="text-xl font-black uppercase tracking-widest">Frequently Asked</h2>
              </div>
              <div className="space-y-4">
                {[
                  {
                    q: "Is KaruviLab free for commercial use?",
                    a: "Yes. All tools on KaruviLab are 100% free for both personal and commercial projects. No hidden costs or limits.",
                  },
                  {
                    q: "How secure is my data on this platform?",
                    a: "Since the processing is client-side, your data stays within your browser's memory. It's as secure as your local machine.",
                  },
                  {
                    q: "Can I use these tools offline?",
                    a: "Once loaded, many of our tools work offline thanks to Service Worker technology and local-first logic.",
                  }
                ].map((faq, i) => (
                  <div key={i} className="group p-6 space-y-2 border-l-2 border-border hover:border-blue transition-colors">
                    <h3 className="font-bold text-text group-hover:text-blue transition-colors">{faq.q}</h3>
                    <p className="text-text-3 text-sm leading-relaxed font-medium">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}

      {/* 6. Professional Footer */}
      <footer className="pt-20 pb-10 border-t border-border/50">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2 space-y-6">
            <div className="font-black text-3xl tracking-tighter">
              <span className="text-blue">Karuvi</span>Lab
            </div>
            <p className="text-text-4 text-sm font-medium leading-relaxed max-w-sm">
              The world's fastest, most private browser-side toolkit. No uploads. No tracking. Just pure performance.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-text-4">Platform</h4>
            <ul className="space-y-2 text-sm font-bold">
              <li><a href="/about" className="text-text-3 hover:text-blue">About Us</a></li>
              <li><a href="/help" className="text-text-3 hover:text-blue">How it works</a></li>
              <li><a href="/privacy" className="text-text-3 hover:text-blue">Privacy Policy</a></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-text-4">Support</h4>
            <ul className="space-y-2 text-sm font-bold">
              <li><a href="/contact" className="text-text-3 hover:text-blue">Report a Bug</a></li>
              <li><a href="/terms" className="text-text-3 hover:text-blue">Terms of Service</a></li>
              <li><a href="/settings" className="text-text-3 hover:text-blue">Preferences</a></li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-border/30 text-[10px] font-black uppercase tracking-[0.2em] text-text-4">
          <p>© 2026 KaruviLab. All rights reserved.</p>
          <div className="flex items-center gap-8">
            <a href="#" className="hover:text-blue transition-colors">Twitter</a>
            <a href="#" className="hover:text-blue transition-colors">GitHub</a>
            <a href="#" className="hover:text-blue transition-colors">Discord</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
