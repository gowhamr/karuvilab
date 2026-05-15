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
        className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-1.5 py-1"
      >
        <button
          role="tab"
          aria-selected={!activeCategory}
          onClick={() => onCategoryChange(null)}
          className={`
            relative flex-shrink-0 h-[38px] px-4 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-blue/20
            ${!activeCategory 
              ? "text-white" 
              : "text-text-4 hover:text-text hover:bg-surface/80 bg-surface/40 sm:bg-transparent"}
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
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            role="tab"
            aria-selected={activeCategory === cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={`
              relative flex-shrink-0 h-[38px] flex items-center gap-2 px-4 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all outline-none focus-visible:ring-2 focus-visible:ring-blue/20
              ${activeCategory === cat.id 
                ? "text-white" 
                : "text-text-4 hover:text-text hover:bg-surface/80 bg-surface/40 sm:bg-transparent"}
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
          </button>
        ))}
      </div>
    </div>
  );
});
