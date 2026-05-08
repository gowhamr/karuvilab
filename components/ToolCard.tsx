"use client";

import Link from "next/link";
import { ToolEntry, CATEGORIES } from "@/src/tool-registry";
import { ToolIcon } from "@/components/ui/Icons";
import { Star, ExternalLink, Zap } from "lucide-react";
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
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", damping: 15, stiffness: 300 }}
      className="group relative h-full min-h-[120px] md:min-h-[160px]"
    >
      {/* Background Glow */}
      <div className="absolute -inset-[0.5px] bg-gradient-to-br from-blue/20 to-transparent rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <Link 
        href={`/${tool.href}`}
        className={cn(
          "relative flex flex-col h-full bg-surface border border-border/50 rounded-2xl p-4 md:p-5 gap-3 group-hover:border-blue/30 group-hover:shadow-premium transition-all duration-300 overflow-hidden"
        )}
      >
        <div className="flex items-center justify-between">
          <div className="w-7 h-7 rounded-lg bg-blue/5 border border-blue/10 flex items-center justify-center text-blue group-hover:bg-blue group-hover:text-white transition-all duration-300">
            <ToolIcon category={tool.category} className="w-3.5 h-3.5" />
          </div>
          
          {tool.popular && (
            <div className="flex items-center gap-1 text-blue/40 group-hover:text-blue transition-colors">
              <Zap className="w-2.5 h-2.5 fill-current" />
            </div>
          )}
        </div>

        <div className="space-y-1">
          <h3 className="font-bold text-[13px] md:text-sm text-text group-hover:text-blue transition-colors leading-tight tracking-tight">
            {tool.name}
          </h3>
          <p className="text-text-4 text-[11px] font-medium line-clamp-2 leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity">
            {tool.desc}
          </p>
        </div>

        <div className="mt-auto pt-2 flex items-center justify-between border-t border-border/10">
          <span className="text-[8px] font-black uppercase tracking-widest text-text-4">
            {categoryLabel}
          </span>
          
          <ExternalLink className="w-3 h-3 text-text-4 opacity-0 group-hover:opacity-100 transition-all translate-x-1 group-hover:translate-x-0" />
        </div>
      </Link>
    </motion.div>
  );

}


