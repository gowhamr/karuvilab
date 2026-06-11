"use client";

import { memo, useRef, useCallback } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolIcon } from "./Icons";
import { m } from "framer-motion";

interface CategoryChipsProps {
  activeCategory: string | null;
  onCategoryChange: (id: string | null) => void;
}

export const CategoryChips = memo(function CategoryChips({ activeCategory, onCategoryChange }: CategoryChipsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, currentIndex: number) => {
      const items = containerRef.current?.querySelectorAll('[role="tab"]');
      if (!items) return;

      let nextIndex = currentIndex;

      if (e.key === "ArrowRight") {
        e.preventDefault();
        nextIndex = (currentIndex + 1) % items.length;
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        nextIndex = (currentIndex - 1 + items.length) % items.length;
      } else if (e.key === "Home") {
        e.preventDefault();
        nextIndex = 0;
      } else if (e.key === "End") {
        e.preventDefault();
        nextIndex = items.length - 1;
      }

      if (nextIndex !== currentIndex) {
        (items[nextIndex] as HTMLElement).focus();
      }
    },
    []
  );

  return (
    <div className="relative px-4 sm:px-0">
      <div 
        ref={containerRef}
        role="tablist"
        aria-label="Filter by category"
        className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 snap-x"
      >
        <m.button
          role="tab"
          id="tab-all"
          aria-selected={!activeCategory}
          aria-controls="tool-grid-panel"
          onClick={() => onCategoryChange(null)}
          onKeyDown={(e) => handleKeyDown(e, 0)}
          tabIndex={!activeCategory ? 0 : -1}
          whileHover={{ scale: 1.05, y: -1 }}
          whileTap={{ scale: 0.95 }}
          className={`
            relative flex-shrink-0 h-[40px] px-6 rounded-full text-[11px] font-black uppercase tracking-[0.1em] transition-all snap-start flex items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-blue/40
            ${!activeCategory 
              ? "text-white shadow-lg shadow-blue/30" 
              : "text-text-3 hover:text-text hover:bg-mat-hover border border-mat-border"}
          `}
        >
          {!activeCategory && (
            <m.div 
              layoutId="active-cat"
              className="absolute inset-0 bg-gradient-to-r from-blue to-blue-dark rounded-full -z-10"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          All
        </m.button>
        {CATEGORIES.map((cat, index) => (
          <m.button
            key={cat.id}
            role="tab"
            id={`tab-${cat.id}`}
            aria-selected={activeCategory === cat.id}
            aria-controls="tool-grid-panel"
            onClick={() => onCategoryChange(cat.id)}
            onKeyDown={(e) => handleKeyDown(e, index + 1)}
            tabIndex={activeCategory === cat.id ? 0 : -1}
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.95 }}
            className={`
              relative flex-shrink-0 h-[40px] flex items-center gap-2.5 px-6 rounded-full text-[11px] font-black uppercase tracking-[0.1em] transition-all snap-start outline-none focus-visible:ring-2 focus-visible:ring-blue/40
              ${activeCategory === cat.id 
                ? "text-white" 
                : "text-text-3 hover:text-text hover:bg-mat-hover border border-mat-border"}
            `}
          >
            {activeCategory === cat.id && (
              <m.div 
                layoutId="active-cat"
                className="absolute inset-0 rounded-full -z-10"
                style={{ 
                  backgroundColor: cat.color,
                  boxShadow: `0 8px 20px -4px ${cat.color}60`
                }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <ToolIcon category={cat.id} className={`w-3.5 h-3.5 ${activeCategory === cat.id ? "text-white" : "text-text-4 group-hover:text-text"}`} aria-hidden="true" />
            <span className="whitespace-nowrap">{cat.label}</span>
          </m.button>
        ))}
      </div>
    </div>
  );
});
