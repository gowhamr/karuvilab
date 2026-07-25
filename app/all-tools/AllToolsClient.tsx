"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ALL_TOOLS, CATEGORIES, ToolEntry, isNewTool } from "@/src/tool-registry";
import { ToolCard } from "@/components/ToolCard";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ToolIcon } from "@/components/ui/Icons";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useFavoriteStore } from "@/src/store/useFavoriteStore";
import { Grid, List, Search, ArrowUpDown, Sparkles } from "lucide-react";
import { cn } from "@/src/lib/utils";

type SortOption = "alphabetical" | "popular" | "newest" | "favorites";
type ViewMode = "grid" | "list";

export default function AllToolsClient() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortOption>("popular");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const favorites = useFavoriteStore(state => state.favorites);

  // Filter tools based on category & search query
  const filteredTools = useMemo(() => {
    return (ALL_TOOLS as ToolEntry[]).filter(tool => {
      const matchesCategory = activeCategory === "all" || tool.category === activeCategory;
      const matchesSearch = 
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  // Sort tools
  const sortedTools = useMemo(() => {
    const list = [...filteredTools];
    if (sortBy === "alphabetical") {
      return list.sort((a, b) => a.name.localeCompare(b.name));
    }
    if (sortBy === "newest") {
      return list.sort((a, b) => {
        const dateA = a.lastAdded ? new Date(a.lastAdded).getTime() : 0;
        const dateB = b.lastAdded ? new Date(b.lastAdded).getTime() : 0;
        return dateB - dateA;
      });
    }
    if (sortBy === "favorites") {
      return list.sort((a, b) => {
        const isFavA = favorites.includes(a.id) ? 1 : 0;
        const isFavB = favorites.includes(b.id) ? 1 : 0;
        return isFavB - isFavA;
      });
    }
    // "popular" sort
    return list.sort((a, b) => {
      const scoreA = (a.popular ? 2 : 0) + (favorites.includes(a.id) ? 1 : 0);
      const scoreB = (b.popular ? 2 : 0) + (favorites.includes(b.id) ? 1 : 0);
      return scoreB - scoreA;
    });
  }, [filteredTools, sortBy, favorites]);

  // Group tools based on active category
  const groupedTools = useMemo(() => {
    const groups: { title: string; tools: ToolEntry[] }[] = [];
    
    if (activeCategory === "all") {
      CATEGORIES.forEach(cat => {
        const toolsInCat = sortedTools.filter(t => t.category === cat.id);
        if (toolsInCat.length > 0) {
          groups.push({ title: cat.label, tools: toolsInCat });
        }
      });
      // Handle any tools that somehow don't match known categories
      const unknownTools = sortedTools.filter(t => !CATEGORIES.some(c => c.id === t.category));
      if (unknownTools.length > 0) {
        groups.push({ title: "Other", tools: unknownTools });
      }
    } else {
      const subCatMap: Record<string, ToolEntry[]> = {};
      sortedTools.forEach(tool => {
        const sub = tool.subCategory || 'Other';
        if (!subCatMap[sub]) subCatMap[sub] = [];
        subCatMap[sub].push(tool);
      });
      
      Object.keys(subCatMap).sort().forEach(sub => {
        const toolsForSub = subCatMap[sub];
        if (toolsForSub) {
          groups.push({ title: sub, tools: toolsForSub });
        }
      });
    }
    return groups;
  }, [sortedTools, activeCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6 pb-20 md:pb-12 space-y-8">
      {/* ── Header ── */}
      <div className="space-y-4">
        <Breadcrumbs title="All Tools" />
        <h1 className="text-h1 font-black font-poppins tracking-tight text-text-primary">Universal Toolkit</h1>
        <p className="text-text-secondary text-body max-w-3xl leading-relaxed">
          Explore our complete collection of privacy-first tools. No uploads, no accounts, just pure browser-side power.
        </p>
      </div>

      {/* ── Toolbar / Controls ── */}
      <Card variant="glass" padding="sm" className="flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" aria-hidden="true" />
          <input
            id="all-tools-search"
            type="search"
            placeholder="Search all tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search all tools"
            className="w-full pl-10 pr-4 py-2 bg-surface border border-divider rounded-input text-caption text-text-primary placeholder:text-text-secondary/50 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all h-10"
          />
        </div>

        {/* Sort & View Mode */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-text-secondary shrink-0" aria-hidden="true" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-surface border border-divider rounded-lg px-3 py-1.5 text-caption font-bold text-text-secondary outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 cursor-pointer h-10"
            >
              <option value="popular">Popular First</option>
              <option value="newest">Newest Added</option>
              <option value="alphabetical">Alphabetical</option>
              <option value="favorites">Favorites Pinned</option>
            </select>
          </div>

          <div className="flex items-center border border-divider rounded-lg overflow-hidden bg-surface h-10">
            <button
              onClick={() => setViewMode("grid")}
              aria-label="Switch to grid view"
              aria-pressed={viewMode === "grid"}
              className={cn(
                "p-2 text-text-secondary hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                viewMode === "grid" ? "bg-primary/10 text-primary" : ""
              )}
            >
              <Grid className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              aria-label="Switch to list view"
              aria-pressed={viewMode === "list"}
              className={cn(
                "p-2 text-text-secondary hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                viewMode === "list" ? "bg-primary/10 text-primary" : ""
              )}
            >
              <List className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </Card>

      {/* ── Category Filters ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 hide-scrollbar">
        <Button
          variant={activeCategory === "all" ? "primary" : "secondary"}
          size="sm"
          className="rounded-full shrink-0 font-poppins"
          onClick={() => setActiveCategory("all")}
        >
          All Categories
        </Button>
        {CATEGORIES.map((cat) => (
          <Button
            key={cat.id}
            variant={activeCategory === cat.id ? "primary" : "secondary"}
            size="sm"
            className="rounded-full shrink-0 font-poppins"
            onClick={() => setActiveCategory(cat.id)}
          >
            {cat.label}
          </Button>
        ))}
      </div>

      {/* ── Main Grid / List ── */}
      {sortedTools.length === 0 ? (
        <Card variant="glass" padding="lg" className="text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h2 className="text-title font-bold text-text-primary font-poppins">No tools match your criteria</h2>
          <p className="text-caption text-text-secondary max-w-sm mx-auto">
            Try resetting your search query or choosing a different category.
          </p>
        </Card>
      ) : (
        <div className="space-y-12">
          {groupedTools.map(group => (
            <section key={group.title} className="space-y-6">
              <h2 className="text-xl font-black uppercase tracking-widest text-primary flex items-center gap-3">
                <span className="w-8 h-px bg-primary/20" />
                {group.title}
              </h2>
              {viewMode === "grid" ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
                  {group.tools.map(tool => (
                    <ToolCard key={tool.id} tool={tool} compact />
                  ))}
                </div>
              ) : (
                <div className="space-y-2 max-w-4xl">
                  {group.tools.map(tool => (
                    <Link key={tool.id} href={tool.href}>
                      <Card variant="interactive" padding="sm" className="flex items-center justify-between gap-4 mb-2 group">
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="w-10 h-10 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform shrink-0">
                            <ToolIcon toolId={tool.id} category={tool.category} className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="text-body font-bold text-text-primary group-hover:text-primary transition-colors truncate">
                                {tool.name}
                              </h4>
                              {isNewTool(tool) && (
                                <Badge variant="primary" size="sm" className="text-[9px]">
                                  New
                                </Badge>
                              )}
                            </div>
                            <p className="text-caption text-text-secondary truncate max-w-xl hidden sm:block">
                              {tool.desc}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <Badge variant="neutral" size="sm" className="text-[10px]">
                            {tool.category}
                          </Badge>
                          {!tool.requiresNetwork && (
                            <Badge variant="success" size="sm" className="text-[10px] hidden sm:inline-flex">
                              Offline
                            </Badge>
                          )}
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
