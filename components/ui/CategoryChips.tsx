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
    <div className="relative px-4 sm:px-0">
      <div 
        role="tablist"
        aria-label="Filter by category"
        className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 snap-x"
      >
        <m.button
          role="tab"
          aria-selected={!activeCategory}
          onClick={() => onCategoryChange(null)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          className={`
            relative flex-shrink-0 h-[44px] px-6 rounded-xl text-[12px] font-black uppercase tracking-widest transition-colors snap-start flex items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-blue/20
            ${!activeCategory 
              ? "text-white" 
              : "text-text-4 hover:text-text hover:bg-surface/80"}
          `}
        >
          {!activeCategory && (
            <m.div 
              layoutId="active-cat"
              className="absolute inset-0 bg-blue rounded-xl -z-10 shadow-lg shadow-blue/20"
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
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            className={`
              relative flex-shrink-0 h-[44px] flex items-center gap-2.5 px-6 rounded-xl text-[12px] font-black uppercase tracking-widest transition-colors snap-start outline-none focus-visible:ring-2 focus-visible:ring-blue/20
              ${activeCategory === cat.id 
                ? "text-white" 
                : "text-text-4 hover:text-text hover:bg-surface/80"}
            `}
          >
            {activeCategory === cat.id && (
              <m.div 
                layoutId="active-cat"
                className="absolute inset-0 rounded-xl -z-10 shadow-lg"
                style={{ 
                  backgroundColor: cat.color,
                  boxShadow: `0 8px 16px -4px ${cat.color}40`
                }}
                transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
              />
            )}
            <ToolIcon category={cat.id} className={`w-4 h-4 ${activeCategory === cat.id ? "text-white" : "opacity-60"}`} aria-hidden="true" />
            {cat.label}
          </m.button>
        ))}
      </div>
    </div>
  );
});
