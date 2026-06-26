"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { m, AnimatePresence } from "framer-motion";
import { ToolEntry, ALL_TOOLS } from "@/src/tool-registry";
import { Clock, Play, Pin, ChevronRight, Heart, Sparkles } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { ToolIcon } from "./Icons";

interface QuickActionsProps {
  continueTool: ToolEntry | null | undefined;
  recentTools: ToolEntry[];
  favoriteTools: ToolEntry[];
}

export function QuickActionsDashboard({ continueTool, recentTools, favoriteTools }: QuickActionsProps) {
  const isEmpty = !continueTool && recentTools.length === 0 && favoriteTools.length === 0;

  if (isEmpty) {
    return (
      <div className="bg-surface border border-border rounded-3xl p-6 md:p-8 text-center flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-blue/10 flex items-center justify-center text-blue">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-black text-text">Start exploring your toolkit</h2>
          <p className="text-sm text-text-muted mt-1 max-w-sm mx-auto">
            Tools you use frequently or mark as favorite will appear here for quick access.
          </p>
        </div>
        <Link 
          href="/all-tools"
          className="mt-2 inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-blue text-white text-sm font-bold hover:bg-blue-dark transition-all"
        >
          Browse All Tools <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-3xl p-4 md:p-6 space-y-8 shadow-sm">
      
      {/* ── Continue Working ── */}
      {continueTool && (
        <section>
          <div className="flex items-center gap-2 mb-3 px-1">
            <Play className="w-3.5 h-3.5 text-blue" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-text-2">Continue Working</h3>
          </div>
          <Link
            href={continueTool.href}
            className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-bg border border-border hover:border-blue/30 hover:bg-blue/5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                <ToolIcon category={continueTool.category} className="w-6 h-6 text-text" />
              </div>
              <div>
                <h4 className="text-base font-bold text-text group-hover:text-blue transition-colors">
                  {continueTool.name}
                </h4>
                <p className="text-xs text-text-muted mt-0.5">
                  Last used recently
                </p>
              </div>
            </div>
            <div className="inline-flex items-center justify-center h-9 px-4 rounded-lg bg-blue text-white text-xs font-bold sm:w-auto w-full group-hover:shadow-md group-hover:shadow-blue/20 transition-all">
              Resume
            </div>
          </Link>
        </section>
      )}

      {/* ── Favorites (Pinned) ── */}
      {favoriteTools.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3 px-1">
            <Heart className="w-3.5 h-3.5 text-rose-500" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-text-2">Favorites</h3>
          </div>
          <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar pb-2 -mx-2 px-2 snap-x">
            {favoriteTools.map(tool => (
              <Link
                key={`fav-${tool.id}`}
                href={tool.href}
                className="group flex items-center gap-2.5 min-w-[140px] px-3.5 py-2.5 rounded-xl bg-bg border border-border hover:border-border-focus hover:bg-mat-hover transition-all shrink-0 snap-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue"
              >
                <ToolIcon category={tool.category} className="w-4 h-4 text-text-3 group-hover:text-rose-500 transition-colors" />
                <span className="text-sm font-semibold text-text truncate">{tool.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Recent ── */}
      {recentTools.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3 px-1">
            <Clock className="w-3.5 h-3.5 text-text-muted" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-text-2">Recent</h3>
          </div>
          <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar pb-2 -mx-2 px-2 snap-x">
            {recentTools.map(tool => (
              <Link
                key={`rec-${tool.id}`}
                href={tool.href}
                className="group flex items-center gap-2.5 min-w-[140px] px-3.5 py-2.5 rounded-xl bg-bg border border-border hover:border-border-focus hover:bg-mat-hover transition-all shrink-0 snap-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue"
              >
                <div className="w-6 h-6 rounded-md bg-surface border border-border flex items-center justify-center shrink-0 group-hover:border-blue/30 transition-colors">
                  <ToolIcon category={tool.category} className="w-3.5 h-3.5 text-text-3 group-hover:text-blue" />
                </div>
                <span className="text-sm font-medium text-text-2 group-hover:text-text truncate">{tool.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
