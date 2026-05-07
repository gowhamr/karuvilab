"use client";

import { CATEGORIES } from "@/src/tool-registry";
import { ToolIcon } from "./Icons";

interface CategoryChipsProps {
  activeCategory: string | null;
  onCategoryChange: (id: string | null) => void;
}

export function CategoryChips({ activeCategory, onCategoryChange }: CategoryChipsProps) {
  return (
    <div className="relative -mx-6 px-6">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 snap-x snap-mandatory">
        <button
          onClick={() => onCategoryChange(null)}
          className={`
            flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-bold transition-all border snap-start
            ${!activeCategory 
              ? "bg-blue text-white shadow-lg shadow-blue/25 border-blue" 
              : "bg-elevated border-border text-text-3 hover:border-blue hover:text-blue hover:bg-hover"}
          `}
        >
          All Tools
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={`
              flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all border snap-start
              ${activeCategory === cat.id 
                ? "bg-blue text-white shadow-lg shadow-blue/25 border-blue" 
                : "bg-elevated border-border text-text-3 hover:border-blue hover:text-blue hover:bg-hover"}
            `}
          >
            <ToolIcon category={cat.id} className="w-4 h-4" />
            {cat.label}
          </button>
        ))}
      </div>
      
      {/* Scroll Fade Indicators */}
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-bg to-transparent pointer-events-none lg:hidden" />
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-bg to-transparent pointer-events-none lg:hidden" />
    </div>
  );
}
