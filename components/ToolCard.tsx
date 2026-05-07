"use client";

import Link from "next/link";
import { ToolEntry, CATEGORIES } from "@/src/tool-registry";
import { ToolIcon } from "@/components/ui/Icons";
import { ArrowRight, Star, ExternalLink } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { motion } from "framer-motion";

interface ToolCardProps {
  tool: ToolEntry;
  compact?: boolean;
}

export function ToolCard({ tool, compact }: ToolCardProps) {
  const categoryLabel = CATEGORIES.find(c => c.id === tool.category)?.label || tool.category;

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className="group relative"
    >
      {/* Background Glow */}
      <div className="absolute -inset-0.5 bg-gradient-to-br from-blue/20 to-indigo-500/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <Link 
        href={`/${tool.href}`}
        className={cn(
          "relative flex flex-col h-full bg-surface border border-border rounded-2xl p-5 gap-4 group-hover:border-blue/30 group-hover:shadow-2xl transition-all duration-300 overflow-hidden",
          compact && "p-4 gap-3"
        )}
      >
        <div className="flex items-start justify-between">
          <div className={cn(
            "w-10 h-10 rounded-xl bg-bg border border-border flex items-center justify-center text-text-2 group-hover:bg-blue/10 group-hover:border-blue/20 group-hover:text-blue transition-all duration-300",
            compact && "w-9 h-9"
          )}>
            <ToolIcon category={tool.category} className={cn("w-5 h-5", compact && "w-4 h-4")} />
          </div>
          
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-[10px] font-black uppercase text-blue tracking-wider">Open</span>
            <ExternalLink className="w-3 h-3 text-blue" />
          </div>
        </div>

        <div className="space-y-1.5">
          <h3 className={cn("font-bold text-text group-hover:text-blue transition-colors leading-tight", compact ? "text-base" : "text-lg md:text-xl")}>
            {tool.name}
          </h3>
          <p className="text-text-4 text-xs md:text-sm font-medium line-clamp-2 leading-relaxed">
            {tool.desc}
          </p>
        </div>

        <div className="mt-auto pt-2 flex items-center justify-between">
          <span className="text-[10px] font-bold text-text-4 px-2 py-0.5 bg-bg border border-border rounded-lg group-hover:border-blue/10 group-hover:text-blue/70 transition-all">
            {categoryLabel}
          </span>
          
          {tool.popular && (
            <div className="flex items-center gap-1 text-orange-500">
              <Star className="w-3 h-3 fill-current" />
              <span className="text-[9px] font-black uppercase">Popular</span>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

