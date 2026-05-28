"use client";

import { memo } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolIcon } from "./Icons";
import { m } from "framer-motion";

interface CategoryChipsProps {
  activeCategory: string | null;
  onCategoryChange: (id: string | null) => void;
}

export const CategoryChips = memo(function CategoryChips({ activeCategory, onCategoryChange }: CategoryChipsProps) {
  return (
    <div className="relative">
      <div 
        role="tablist"
        aria-label="Filter by category"
        className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 snap-x"
      >
        <m.button
          role="tab"
          aria-selected={!activeCategory}
          onClick={() => onCategoryChange(null)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`
            relative flex-shrink-0 h-[38px] px-4 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors snap-start flex items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-blue/20
            ${!activeCategory 
              ? "text-white" 
              : "text-text-4 hov:text-text hov:bg-surface/80"}
          `}
        >
          {!activeCategory && (
            <m.div 
              layoutId="active-cat"
              className="absolute inset-0 bg-blue rounded-lg -z-10"
              transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
            />
          )}
          All
        </m.button>
        {CATEGORIES.map(cat => (
          <m.button
            key={cat.id}
            role="tab"
            aria-selected={activeCategory === cat.id}
            onClick={() => onCategoryChange(cat.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`
              relative flex-shrink-0 h-[38px] flex items-center gap-2 px-4 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors snap-start outline-none focus-visible:ring-2 focus-visible:ring-blue/20
              ${activeCategory === cat.id 
                ? "text-white" 
                : "text-text-4 hov:text-text hov:bg-surface/80"}
            `}
          >
            {activeCategory === cat.id && (
              <m.div 
                layoutId="active-cat"
                className="absolute inset-0 rounded-lg -z-10"
                style={{ 
                  backgroundColor: cat.color,
                }}
                transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
              />
            )}
            <ToolIcon category={cat.id} className={`w-3.5 h-3.5 ${activeCategory === cat.id ? "text-white" : "opacity-60"}`} aria-hidden="true" />
            {cat.label}
          </m.button>
        ))}
      </div>
    </div>
  );
});
