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
      whileHover={{ y: -2, scale: 1.005 }}
      whileTap={{ scale: 0.99 }}
      className="group relative h-full"
    >
      {/* Background Glow */}
      <div className="absolute -inset-0.5 bg-gradient-to-br from-blue/15 to-indigo-500/5 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <Link 
        href={`/${tool.href}`}
        className={cn(
          "relative flex flex-col h-full bg-surface border border-border rounded-xl p-3 md:p-4 gap-3 group-hover:border-blue/30 group-hover:shadow-xl transition-all duration-300 overflow-hidden"
        )}
      >
        <div className="flex items-start justify-between">
          <div className="w-8 h-8 rounded-lg bg-bg border border-border flex items-center justify-center text-text-3 group-hover:bg-blue/10 group-hover:border-blue/20 group-hover:text-blue transition-all duration-300">
            <ToolIcon category={tool.category} className="w-4 h-4" />
          </div>
          
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <ExternalLink className="w-3 h-3 text-blue" />
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="font-bold text-text group-hover:text-blue transition-colors leading-tight text-sm md:text-base">
            {tool.name}
          </h3>
          <p className="text-text-4 text-[11px] font-medium line-clamp-2 leading-relaxed">
            {tool.desc}
          </p>
        </div>

        <div className="mt-auto pt-1 flex items-center justify-between">
          <span className="text-[9px] font-black text-text-4 px-1.5 py-0.5 bg-bg border border-border rounded-md group-hover:border-blue/10 group-hover:text-blue/70 transition-all">
            {categoryLabel}
          </span>
          
          {tool.popular && (
            <div className="flex items-center gap-1 text-orange-500">
              <Star className="w-2.5 h-2.5 fill-current" />
              <span className="text-[8px] font-black uppercase">Popular</span>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );

}

