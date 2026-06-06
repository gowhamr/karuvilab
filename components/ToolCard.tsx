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
      className="relative w-full min-h-[130px] md:min-h-[180px] group"
      whileHover={{ 
        y: -4,
        scale: 1.02,
        transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] }
      }}
      whileTap={{ 
        scale: 0.98,
        transition: { type: "spring", stiffness: 400, damping: 25 }
      }}
    >
      <Link 
        href={`/${tool.href}`}
        className={cn(
          "relative flex flex-col min-h-[130px] md:min-h-[180px] bg-mat-surface border border-mat-border rounded-[32px] p-4 md:p-6 shadow-mat-shine overflow-hidden transition-all duration-300 ease-out",
          "hover:border-mat-border-focus hover:bg-mat-hover active:scale-[0.98]"
        )}
      >
        {/* Top Section: Icon & Badge */}
        <div className="flex items-center justify-between mb-2 md:mb-4">
          <div 
            className="w-9 h-9 md:w-11 md:h-11 rounded-[16px] bg-mat-base border border-mat-border flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
            aria-hidden="true"
          >
            <ToolIcon toolId={tool.id} category={tool.category} className="w-4 h-4 md:w-5 md:h-5" />
          </div>
          
          <div className="flex items-center gap-1.5">
            {tool.popular && (
              <div 
                className="px-2 py-0.5 rounded-full bg-brand-primary/5 border border-brand-primary/10 flex items-center gap-1"
                aria-label="Popular tool"
              >
                <Zap className="w-2.5 h-2.5 fill-current text-brand-primary" aria-hidden="true" />
                <span className="text-[11px] font-bold uppercase tracking-widest hidden md:inline text-brand-primary">Hot</span>
              </div>
            )}

            {isNewTool(tool) && (
              <div 
                className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1"
                aria-label="New tool"
              >
                <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-500">New</span>
              </div>
            )}
          </div>
        </div>

        {/* Middle Section: Content */}
        <div className="space-y-1 md:space-y-1.5 flex-1">
          <h3 className="font-bold text-[13px] md:text-base text-text transition-colors leading-tight tracking-tight truncate group-hover:text-brand-primary">
            {tool.name}
          </h3>
          <p className="text-text-4 text-[12px] font-medium line-clamp-2 md:line-clamp-3 leading-relaxed transition-colors group-hover:text-text-3">
            {tool.desc}
          </p>
        </div>
      </Link>
    </m.div>
  );
});
