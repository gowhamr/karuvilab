"use client";

import Link from "next/link";
import { ToolEntry, CATEGORIES } from "@/src/tool-registry";
import { ToolIcon } from "@/components/ui/Icons";
import { ArrowRight, Star } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface ToolCardProps {
  tool: ToolEntry;
  compact?: boolean;
}

export function ToolCard({ tool, compact }: ToolCardProps) {
  const categoryLabel = CATEGORIES.find(c => c.id === tool.category)?.label || tool.category;

  return (
    <Link 
      href={`/${tool.href}`}
      className={cn(
        "group relative flex flex-col bg-surface border border-border rounded-xl hover:border-blue/50 hover:shadow-lg hover:shadow-blue/5 transition-all duration-300 ease-expo overflow-hidden",
        compact ? "p-4" : "p-6"
      )}
    >
      <div className={cn("flex items-start justify-between", compact ? "mb-3" : "mb-5")}>
        <div className={cn(
          "rounded-lg bg-bg border border-border flex items-center justify-center group-hover:scale-110 group-hover:bg-blue/5 group-hover:border-blue/20 transition-all duration-500",
          compact ? "w-9 h-9" : "w-11 h-11"
        )}>
          <ToolIcon category={tool.category} className={cn("text-text-2 group-hover:text-blue transition-colors", compact ? "w-5 h-5" : "w-6 h-6")} />
        </div>
        
        <div className="flex items-center gap-1.5">
          {tool.popular && !compact && (
            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-yellow-500/10 text-yellow-600 rounded-md">
              <Star className="w-2.5 h-2.5 fill-current" />
              <span className="text-[9px] font-black uppercase tracking-wider">Popular</span>
            </div>
          )}
          <span className="text-[9px] font-black uppercase tracking-widest text-text-4 group-hover:text-blue transition-colors">
            {categoryLabel}
          </span>
        </div>
      </div>

      <div className="space-y-1 flex-1">
        <h3 className={cn("font-bold text-text group-hover:text-blue transition-colors leading-tight", compact ? "text-base" : "text-lg")}>
          {tool.name}
        </h3>
        {!compact && (
          <p className="text-text-3 text-xs leading-relaxed line-clamp-2 font-medium">
            {tool.desc}
          </p>
        )}
      </div>

      {!compact && (
        <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between">
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-text-4 group-hover:text-blue transition-all">
            Open
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-text-4 group-hover:text-blue group-hover:translate-x-0.5 transition-all" />
        </div>
      )}
    </Link>
  );
}
