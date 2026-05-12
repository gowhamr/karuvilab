"use client";

import { memo } from "react";
import Link from "next/link";
import { ToolEntry, CATEGORIES, getToolColor } from "@/src/tool-registry";
import { ToolIcon } from "@/components/ui/Icons";
import { ArrowRight, Zap } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { m } from "framer-motion";

interface ToolCardProps {
  tool: ToolEntry;
  compact?: boolean;
}

export const ToolCard = memo(function ToolCard({ tool, compact }: ToolCardProps) {
  const categoryLabel = CATEGORIES.find(c => c.id === tool.category)?.label || tool.category;
  const color = getToolColor(tool);

  return (
    <m.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", damping: 20, stiffness: 400 }}
      className="group relative w-full h-[130px] md:h-[180px]"
      style={{ 
        '--tool-color': color,
        '--tool-color-glow': `${color}66`,
        '--tool-color-glow-soft': `${color}33`,
      } as any}
    >
      {/* Dynamic Background Glow */}
      <div 
        className="absolute -inset-1 rounded-[24px] blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-700" 
        style={{ background: `linear-gradient(to bottom right, ${color}33, transparent, ${color}0D)` }}
      />
      
      <Link 
        href={`/${tool.href}`}
        className={cn(
          "relative flex flex-col h-full bg-surface dark:bg-white/[0.03] border border-border/40 dark:border-white/5 rounded-[24px] p-4 md:p-6 premium-card-shadow overflow-hidden transition-colors duration-300"
        )}
        style={{ borderColor: 'var(--border-color)' } as any}
      >
        <style jsx>{`
          a { --border-color: var(--border); }
          a:hover { --border-color: ${color}4D; }
          :global([data-theme="dark"]) a { --border-color: rgba(255,255,255,0.05); }
          :global([data-theme="dark"]) a:hover { --border-color: ${color}4D; }
        `}</style>

        {/* Top Section: Icon & Badge */}
        <div className="flex items-center justify-between mb-2 md:mb-4">
          <div 
            className="w-9 h-9 md:w-11 md:h-11 rounded-[16px] border flex items-center justify-center transition-all duration-500 group-hover:bg-[var(--tool-color)] group-hover:text-white group-hover:neon-glow-dynamic"
            style={{ 
              backgroundColor: `${color}0D`, 
              borderColor: `${color}1A`,
              color: color,
            }}
            aria-hidden="true"
          >
            <ToolIcon toolId={tool.id} category={tool.category} className="w-4 h-4 md:w-5 md:h-5" />
          </div>
          
          {tool.popular && (
            <div 
              className="px-2 py-0.5 rounded-full border flex items-center gap-1"
              style={{ backgroundColor: `${color}0D`, borderColor: `${color}1A` }}
              aria-label="Popular tool"
            >
              <Zap className="w-2.5 h-2.5 fill-current" style={{ color: color }} aria-hidden="true" />
              <span className="text-[7px] font-black uppercase tracking-widest hidden md:inline" style={{ color: color }}>Hot</span>
            </div>
          )}
        </div>

        {/* Middle Section: Content */}
        <div className="space-y-1 md:space-y-1.5 flex-1">
          <h3 className="font-black text-[13px] md:text-base text-text dark:text-white/90 group-hover:text-[var(--tool-color)] transition-colors leading-tight tracking-tight truncate">
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
          <div 
            className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-bg dark:bg-white/5 border border-border/40 dark:border-white/5 flex items-center justify-center group-hover:bg-[var(--tool-color)] group-hover:border-[var(--tool-color)] group-hover:text-white transition-all duration-300 transform group-hover:translate-x-1"
            aria-hidden="true"
          >
            <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
          </div>
        </div>
      </Link>
    </m.div>
  );
});
