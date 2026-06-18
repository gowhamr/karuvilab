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
      className="relative w-full flex-1 flex flex-col group"
      whileHover={{
        y: -3,
        transition: { duration: 0.18, ease: [0.16, 1, 0.3, 1] },
      }}
      whileTap={{
        scale: 0.97,
        transition: { type: "spring", stiffness: 400, damping: 28 },
      }}
      style={{ touchAction: "manipulation" }}
    >
      <Link
        href={`/${tool.href}`}
        className={cn(
          // Base
          "relative flex flex-col flex-1 h-full bg-mat-surface border border-mat-border",
          "overflow-hidden transition-all duration-150 ease-out",
          // Hover
          "hover:border-blue/30 hover:bg-mat-hover hover:shadow-md",
          // Focus
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2",
          // Size
          compact
            ? "min-h-[5.5rem] md:min-h-24 p-3 md:p-3.5 rounded-2xl gap-2"
            : "min-h-28 md:min-h-36 p-4 md:p-5 rounded-3xl gap-3"
        )}
      >
        {/* Subtle top shimmer */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        />

        {/* Icon */}
        <div
          className={cn(
            "rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110 shrink-0",
            "bg-blue/5 border border-blue/10 text-blue",
            compact
              ? "w-9 h-9"
              : "w-11 h-11 md:w-12 md:h-12"
          )}
          aria-hidden="true"
        >
          <ToolIcon
            toolId={tool.id}
            category={tool.category}
            className={compact ? "w-4 h-4" : "w-5 h-5 md:w-6 md:h-6"}
          />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0 flex flex-col justify-center gap-0.5">
          <h3
            className={cn(
              "font-bold text-text leading-tight tracking-tight line-clamp-2 text-balance",
              "group-hover:text-brand-primary transition-colors duration-150",
              compact ? "text-[13px]" : "text-[14px]"
            )}
            title={tool.name}
          >
            {tool.name}
          </h3>
          {!compact && (
            <p className="text-[11px] text-text-muted font-medium line-clamp-2 leading-relaxed">
              {tool.desc}
            </p>
          )}
          {compact && (
            <p className="text-[10px] text-text-muted font-medium line-clamp-2 leading-snug">
              {tool.desc}
            </p>
          )}
        </div>
      </Link>
    </m.div>
  );
});
