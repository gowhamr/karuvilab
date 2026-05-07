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
        "group relative flex flex-col bg-surface border border-border rounded-2xl hover:border-blue/50 hover:shadow-xl hover:shadow-blue/10 transition-all duration-500 ease-expo overflow-hidden",
        compact ? "p-4 gap-3" : "p-6 gap-4"
      )}
    >
      <div className="flex items-start justify-between w-full">
        <div className={cn(
          "rounded-xl bg-bg border border-border flex items-center justify-center group-hover:scale-110 group-hover:bg-blue/5 group-hover:border-blue/20 transition-all duration-500",
          compact ? "w-10 h-10" : "w-12 h-12"
        )}>
          <ToolIcon category={tool.category} className={cn("text-text-2 group-hover:text-blue transition-colors", compact ? "w-5 h-5" : "w-6 h-6")} />
        </div>
        
        <button className="p-1.5 rounded-lg text-text-4 hover:text-yellow-500 hover:bg-yellow-500/5 transition-all">
          <Star className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-1.5 flex-1">
        <h3 className={cn("font-bold text-text group-hover:text-blue transition-colors leading-tight", compact ? "text-base" : "text-lg")}>
          {tool.name}
        </h3>
        <p className="text-text-3 text-xs leading-relaxed line-clamp-2 font-medium">
          {tool.desc}
        </p>
      </div>

      <div className="flex items-center">
        <span className="text-[10px] font-bold text-text-4 px-2 py-1 bg-bg border border-border rounded-lg group-hover:text-blue group-hover:border-blue/20 transition-all">
          {categoryLabel}
        </span>
      </div>
    </Link>
  );
}
