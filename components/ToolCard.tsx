"use client";

import Link from "next/link";
import { ToolEntry, CATEGORIES } from "@/src/tool-registry";
import { ToolIcon } from "@/components/ui/Icons";
import { ArrowRight, Star } from "lucide-react";

export function ToolCard({ tool }: { tool: ToolEntry }) {
  const categoryLabel = CATEGORIES.find(c => c.id === tool.category)?.label || tool.category;

  return (
    <Link 
      href={`/${tool.href}`}
      className="group relative flex flex-col p-6 bg-surface border border-border rounded-2xl hover:border-blue/50 hover:shadow-xl hover:shadow-blue/5 transition-all duration-300 ease-expo overflow-hidden"
    >
      {/* Decorative Glow */}
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue/5 blur-3xl rounded-full group-hover:bg-blue/10 transition-colors" />

      <div className="flex items-start justify-between mb-5">
        <div className="w-12 h-12 rounded-xl bg-bg border border-border flex items-center justify-center group-hover:scale-110 group-hover:bg-blue/5 group-hover:border-blue/20 transition-all duration-500">
          <ToolIcon category={tool.category} className="w-6 h-6 text-text-2 group-hover:text-blue transition-colors" />
        </div>
        
        <div className="flex items-center gap-2">
          {tool.popular && (
            <div className="flex items-center gap-1 px-2 py-1 bg-yellow-500/10 text-yellow-600 rounded-lg">
              <Star className="w-3 h-3 fill-current" />
              <span className="text-[10px] font-black uppercase tracking-wider">Popular</span>
            </div>
          )}
          <span className="text-[10px] font-black uppercase tracking-widest text-text-4 group-hover:text-blue transition-colors">
            {categoryLabel}
          </span>
        </div>
      </div>

      <div className="space-y-2 flex-1">
        <h3 className="font-bold text-xl text-text group-hover:text-blue transition-colors leading-tight">
          {tool.name}
        </h3>
        <p className="text-text-3 text-sm leading-relaxed line-clamp-2 font-medium">
          {tool.desc}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-4 group-hover:text-blue transition-all">
          Open Tool
        </span>
        <ArrowRight className="w-4 h-4 text-text-4 group-hover:text-blue group-hover:translate-x-1 transition-all" />
      </div>
    </Link>
  );
}
