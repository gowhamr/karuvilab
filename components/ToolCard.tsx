"use client";

import { memo } from "react";
import Link from "next/link";
import { ToolEntry } from "@/src/tool-registry";
import { ToolIcon } from "@/components/ui/Icons";
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
          "relative flex flex-col bg-mat-surface border border-mat-border shadow-sm overflow-hidden transition-all duration-150 ease-out",
          "hover:border-mat-border-focus hover:bg-mat-hover",
          compact 
            ? "min-h-20 md:min-h-24 p-2 md:p-3 rounded-2xl" 
            : "min-h-24 md:min-h-32 p-4 md:p-6 rounded-4xl"
        )}
      >
        {/* Top Section: Icon */}
        <div className={compact ? "mb-1" : "mb-2 md:mb-4"}>
          <div 
            className={cn(
              "bg-mat-base flex items-center justify-center transition-transform duration-200 group-hover:scale-110",
              compact ? "w-8 h-8 rounded-lg md:rounded-md" : "w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-sm"
            )}
            aria-hidden="true"
          >
            <ToolIcon toolId={tool.id} category={tool.category} className={compact ? "w-4 h-4" : "w-5 h-5 md:w-6 h-6"} />
          </div>
        </div>

        {/* Middle Section: Content */}
        <div className={cn("flex-1 min-w-0 flex flex-col justify-center", compact ? "gap-0.5" : "gap-1")}>
          <div className="flex items-center gap-2">
            <h3 
              className={cn(
                "font-bold text-text transition-colors leading-tight tracking-tight truncate group-hover:text-brand-primary",
                compact ? "text-sm md:text-sm" : "text-base md:text-base"
              )}
              title={tool.name}
            >
              {tool.name}
            </h3>
          </div>
          <p className="text-text-muted text-xs md:text-sm font-medium line-clamp-2 leading-relaxed">
            {tool.desc}
          </p>
        </div>
      </Link>
    </m.div>
  );
});
