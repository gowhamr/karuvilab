"use client";

import Link from "next/link";
import { ToolEntry, CATEGORIES } from "@/src/tool-registry";
import { ToolIcon } from "@/components/ui/Icons";
import { ArrowRight, Star, Zap } from "lucide-react";
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
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", damping: 20, stiffness: 400 }}
      className="group relative w-full h-[130px] md:h-[180px]"
    >
      {/* Dynamic Background Glow */}
      <div className="absolute -inset-1 bg-gradient-to-br from-blue/20 via-transparent to-blue/5 rounded-[24px] blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      <Link 
        href={`/${tool.href}`}
        className={cn(
          "relative flex flex-col h-full bg-surface dark:bg-white/[0.03] border border-border/40 dark:border-white/5 rounded-[24px] p-4 md:p-6 premium-card-shadow overflow-hidden transition-colors duration-300 group-hover:border-blue/30"
        )}
      >
        {/* Top Section: Icon & Badge */}
        <div className="flex items-center justify-between mb-2 md:mb-4">
          <div className="w-9 h-9 md:w-11 md:h-11 rounded-[16px] bg-blue/5 dark:bg-blue/10 border border-blue/10 flex items-center justify-center text-blue group-hover:bg-blue group-hover:text-white group-hover:neon-glow transition-all duration-500">
            <ToolIcon category={tool.category} className="w-4 h-4 md:w-5 md:h-5" />
          </div>
          
          {tool.popular && (
            <div className="px-2 py-0.5 rounded-full bg-blue/5 border border-blue/10 flex items-center gap-1">
              <Zap className="w-2.5 h-2.5 text-blue fill-current" />
              <span className="text-[7px] font-black uppercase tracking-widest text-blue hidden md:inline">Hot</span>
            </div>
          )}
        </div>

        {/* Middle Section: Content */}
        <div className="space-y-1 md:space-y-1.5 flex-1">
          <h3 className="font-black text-[13px] md:text-base text-text dark:text-white/90 group-hover:text-blue transition-colors leading-tight tracking-tight truncate">
            {tool.name}
          </h3>
          <p className="text-text-4 dark:text-white/40 text-[10px] md:text-[12px] font-bold line-clamp-2 md:line-clamp-3 leading-relaxed transition-opacity">
            {tool.desc}
          </p>
        </div>

        {/* Bottom Section: Meta & Quick Action */}
        <div className="mt-2 md:mt-4 pt-2 md:pt-4 flex items-center justify-between border-t border-border/10 dark:border-white/5">
          <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-text-4 dark:text-white/30 truncate pr-2">
            {categoryLabel}
          </span>
          
          {/* Quick Action Button */}
          <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-bg dark:bg-white/5 border border-border/40 dark:border-white/5 flex items-center justify-center group-hover:bg-blue group-hover:border-blue group-hover:text-white transition-all duration-300 transform group-hover:translate-x-1">
            <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
