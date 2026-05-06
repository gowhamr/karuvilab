"use client";

import { useState, useMemo } from "react";
import { TOOLS, CATEGORIES } from "@/src/tool-registry";
import { ToolCard } from "@/components/ToolCard";

export default function Home() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

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
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Hero Section */}
      <section className="py-12 text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-black tracking-tight">
          Every tool you need, <span className="text-blue">right here.</span>
        </h1>
        <p className="text-xl text-text-3 max-w-2xl mx-auto">
          Fast, private, and secure browser-based tools for developers, designers, and everyone else. No data ever leaves your device.
        </p>

        <div className="max-w-xl mx-auto relative pt-8">
          <input
            type="text"
            placeholder="Search for a tool (e.g., 'PDF', 'JSON', 'Age')"
            className="w-full px-6 py-4 bg-surface border border-border rounded-2xl shadow-sm focus:ring-2 focus:ring-blue focus:border-blue outline-none transition-all text-lg"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="absolute right-4 top-[calc(2rem+14px)] text-text-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => setActiveCategory(null)}
          className={`px-4 py-2 rounded-full font-medium transition-all ${!activeCategory ? "bg-blue text-white shadow-md shadow-blue/20" : "bg-surface border border-border text-text-2 hover:border-blue hover:text-blue"}`}
        >
          All Tools
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-full font-medium transition-all ${activeCategory === cat.id ? "bg-blue text-white shadow-md shadow-blue/20" : "bg-surface border border-border text-text-2 hover:border-blue hover:text-blue"}`}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </section>

      {/* Results */}
      <section>
        {search || activeCategory ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">
              {filteredTools.length} {filteredTools.length === 1 ? "Result" : "Results"} found
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools.map(tool => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-16">
            {/* Popular Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <span className="p-2 bg-yellow-500/10 text-yellow-600 rounded-lg">⭐</span>
                Popular Tools
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {popularTools.map(tool => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </div>

            {/* All Categories */}
            {CATEGORIES.map(cat => {
              const catTools = TOOLS.filter(t => t.category === cat.id);
              return (
                <div key={cat.id} className="space-y-6">
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                    <span className="p-2 bg-blue/10 text-blue rounded-lg">{cat.emoji}</span>
                    {cat.label}
                  </h2>
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
    </div>
  );
}
