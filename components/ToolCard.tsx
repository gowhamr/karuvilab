"use client";

import { memo } from "react";
import Link from "next/link";
import { ToolEntry, isNewTool } from "@/src/tool-registry";
import { ToolIcon } from "@/components/ui/Icons";
import { Zap } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { m } from "framer-motion";

interface ToolCardProps {
  tool: ToolEntry;
  compact?: boolean;
}

export const ToolCard = memo(function ToolCard({ tool, compact }: ToolCardProps) {
  return (
    <m.div
      className="relative w-full group"
      whileHover={{ 
        y: -4,
        scale: 1.02,
        transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] }
      }}
      whileTap={{ 
        scale: 0.98,
        transition: { type: "spring", stiffness: 400, damping: 25 }
      }}
      style={{ touchAction: 'manipulation' }}
    >
      <Link 
        href={`/${tool.href}`}
        className={cn(
          "relative flex flex-col bg-mat-surface border border-mat-border shadow-mat-shine overflow-hidden transition-all duration-300 ease-out",
          "hover:border-mat-border-focus hover:bg-mat-hover",
          compact 
            ? "min-h-[76px] md:min-h-[92px] p-2.5 md:p-3 rounded-xl md:rounded-2xl" 
            : "min-h-[100px] md:min-h-[136px] p-3.5 md:p-5 rounded-[20px] md:rounded-[24px]"
        )}
      >
        {/* Top Section: Icon & Badge */}
        <div className={cn("flex items-center justify-between", compact ? "mb-1" : "mb-2 md:mb-3.5")}>
          <div 
            className={cn(
              "bg-mat-base border border-mat-border flex items-center justify-center transition-transform duration-200 group-hover:scale-110",
              compact ? "w-7 h-7 rounded-[10px]" : "w-8 h-8 md:w-10 h-10 rounded-[12px] md:rounded-[14px]"
            )}
            aria-hidden="true"
          >
            <ToolIcon toolId={tool.id} category={tool.category} className={compact ? "w-3.5 h-3.5" : "w-4 h-4 md:w-5 h-5"} />
          </div>
          
          <div className="flex items-center gap-1">
            {tool.popular && (
              <div 
                className="px-1.5 py-0.5 rounded-full bg-brand-primary/5 border border-brand-primary/10 flex items-center gap-0.5"
                role="img"
                aria-label="Popular tool"
              >
                <Zap className="w-2.5 h-2.5 fill-current text-brand-primary" aria-hidden="true" />
                <span className={cn("text-[10px] font-bold uppercase tracking-widest text-brand-primary", compact ? "hidden" : "hidden md:inline")}>Hot</span>
              </div>
            )}

            {isNewTool(tool) && (
              <div 
                className="px-1.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-0.5"
                role="img"
                aria-label="New tool"
              >
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">New</span>
              </div>
            )}
          </div>
        </div>

        {/* Middle Section: Content */}
        <div className={cn("flex-1 min-w-0", compact ? "space-y-0.5" : "space-y-1")}>
          <h3 
            className={cn(
              "font-bold text-text transition-colors leading-tight tracking-tight truncate group-hover:text-brand-primary",
              compact ? "text-[13px] md:text-[14px]" : "text-[15px] md:text-[16px]"
            )}
            title={tool.name}
          >
            {tool.name}
          </h3>
          {!compact && (
            <p className="text-text-4 text-[13px] font-medium line-clamp-2 leading-relaxed transition-colors group-hover:text-text-3">
              {tool.desc}
            </p>
          )}
        </div>
      </Link>
    </m.div>
  );
});
