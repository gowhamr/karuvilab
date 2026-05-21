"use client";

import { memo } from "react";
import Link from "next/link";
import { ToolEntry } from "@/src/tool-registry";
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
      className="relative w-full h-[130px] md:h-[180px] group"
      whileHover={{ 
        y: -4,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      whileTap={{ scale: 0.98 }}
    >
      <Link 
        href={`/${tool.href}`}
        className={cn(
          "relative flex flex-col h-full bg-surface border border-border rounded-[24px] p-4 md:p-6 shadow-sm overflow-hidden transition-all duration-300",
          "hover:border-blue/30 hover:bg-blue/[0.01] hover:shadow-lg dark:hover:shadow-blue/5"
        )}
      >
        {/* Top Section: Icon & Badge */}
        <div className="flex items-center justify-between mb-2 md:mb-4">
          <div 
            className="w-9 h-9 md:w-11 md:h-11 rounded-[16px] bg-bg border border-border flex items-center justify-center transition-all duration-300 group-hover:bg-blue/5 group-hover:border-blue/20 group-hover:scale-110"
            aria-hidden="true"
          >
            <ToolIcon toolId={tool.id} category={tool.category} className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 group-hover:rotate-3" />
          </div>
          
          {tool.popular && (
            <m.div 
              initial={{ opacity: 0.8, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              className="px-2 py-0.5 rounded-full bg-blue/5 border border-blue/10 flex items-center gap-1"
              aria-label="Popular tool"
            >
              <Zap className="w-2.5 h-2.5 fill-current text-blue animate-pulse" aria-hidden="true" />
              <span className="text-[7px] font-bold uppercase tracking-widest hidden md:inline text-blue">Hot</span>
            </m.div>
          )}
        </div>

        {/* Middle Section: Content */}
        <div className="space-y-1 md:space-y-1.5 flex-1">
          <h3 className="font-bold text-[13px] md:text-base text-text transition-colors leading-tight tracking-tight truncate group-hover:text-blue">
            {tool.name}
          </h3>
          <p className="text-text-4 text-[10px] md:text-[12px] font-medium line-clamp-2 md:line-clamp-3 leading-relaxed transition-opacity group-hover:text-text-3">
            {tool.desc}
          </p>
        </div>
      </Link>
    </m.div>
  );
});
