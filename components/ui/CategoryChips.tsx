"use client";

import { CATEGORIES } from "@/src/tool-registry";
import { ToolIcon } from "./Icons";
import { motion } from "framer-motion";

interface CategoryChipsProps {
  activeCategory: string | null;
  onCategoryChange: (id: string | null) => void;
}

export function CategoryChips({ activeCategory, onCategoryChange }: CategoryChipsProps) {
  return (
    <div className="relative">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 snap-x snap-mandatory">
        <button
          onClick={() => onCategoryChange(null)}
          className={`
            relative flex-shrink-0 px-5 py-2 rounded-xl text-xs font-black transition-all border snap-start
            ${!activeCategory 
              ? "text-blue border-blue/20 bg-blue/5 shadow-sm" 
              : "bg-surface border-border text-text-4 hover:border-blue/30 hover:text-blue hover:bg-blue/5"}
          `}
        >
          {!activeCategory && (
            <motion.div 
              layoutId="active-pill"
              className="absolute inset-0 border-2 border-blue rounded-xl -z-10"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          All Tools
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={`
              relative flex-shrink-0 flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-black transition-all border snap-start
              ${activeCategory === cat.id 
                ? "text-blue border-blue/20 bg-blue/5 shadow-sm" 
                : "bg-surface border-border text-text-4 hover:border-blue/30 hover:text-blue hover:bg-blue/5"}
            `}
          >
            {activeCategory === cat.id && (
              <motion.div 
                layoutId="active-pill"
                className="absolute inset-0 border-2 border-blue rounded-xl -z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <ToolIcon category={cat.id} className={`w-3.5 h-3.5 transition-colors ${activeCategory === cat.id ? "text-blue" : "group-hover:text-blue"}`} />
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}

