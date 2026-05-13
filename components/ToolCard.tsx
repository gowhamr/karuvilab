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
      className="relative w-full h-[130px] md:h-[180px]"
    >
      <Link 
        href={`/${tool.href}`}
        className={cn(
          "relative flex flex-col h-full bg-surface border border-border rounded-[24px] p-4 md:p-6 shadow-sm overflow-hidden transition-colors duration-300"
        )}
      >
        {/* Top Section: Icon & Badge */}
        <div className="flex items-center justify-between mb-2 md:mb-4">
          <div 
            className="w-9 h-9 md:w-11 md:h-11 rounded-[16px] bg-bg border border-border flex items-center justify-center transition-all duration-300"
            aria-hidden="true"
          >
            <ToolIcon toolId={tool.id} category={tool.category} className="w-4 h-4 md:w-5 md:h-5" />
          </div>
          
          {tool.popular && (
            <div 
              className="px-2 py-0.5 rounded-full bg-blue/5 border border-blue/10 flex items-center gap-1"
              aria-label="Popular tool"
            >
              <Zap className="w-2.5 h-2.5 fill-current text-blue" aria-hidden="true" />
              <span className="text-[7px] font-bold uppercase tracking-widest hidden md:inline text-blue">Hot</span>
            </div>
          )}
        </div>

        {/* Middle Section: Content */}
        <div className="space-y-1 md:space-y-1.5 flex-1">
          <h3 className="font-bold text-[13px] md:text-base text-text transition-colors leading-tight tracking-tight truncate">
            {tool.name}
          </h3>
          <p className="text-text-4 text-[10px] md:text-[12px] font-medium line-clamp-2 md:line-clamp-3 leading-relaxed transition-opacity">
            {tool.desc}
          </p>
        </div>
      </Link>
    </m.div>
  );
});
