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
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 snap-x">
        <button
          onClick={() => onCategoryChange(null)}
          className={`
            relative flex-shrink-0 h-[38px] px-4 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all snap-start flex items-center justify-center
            ${!activeCategory 
              ? "text-white" 
              : "text-text-4 hover:text-text hover:bg-surface/80"}
          `}
        >
          {!activeCategory && (
            <m.div 
              layoutId="active-cat"
              className="absolute inset-0 bg-blue rounded-lg shadow-lg shadow-blue/25 -z-10"
              transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
            />
          )}
          All
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={`
              relative flex-shrink-0 h-[38px] flex items-center gap-2 px-4 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all snap-start
              ${activeCategory === cat.id 
                ? "text-white" 
                : "text-text-4 hover:text-text hover:bg-surface/80"}
            `}
          >
            {activeCategory === cat.id && (
              <m.div 
                layoutId="active-cat"
                className="absolute inset-0 bg-blue rounded-lg shadow-lg shadow-blue/25 -z-10"
                transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
              />
            )}
            <ToolIcon category={cat.id} className={`w-3.5 h-3.5 ${activeCategory === cat.id ? "text-white" : "opacity-60"}`} />
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
});
