"use client";

import { memo, useCallback, useEffect, useState } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolIcon } from "./Icons";
import { m } from "framer-motion";
import { useDragScroll } from "@/src/hooks/useDragScroll";

interface CategoryChipsProps {
  activeCategory: string | null;
  onCategoryChange: (id: string | null) => void;
}

export const CategoryChips = memo(function CategoryChips({ activeCategory, onCategoryChange }: CategoryChipsProps) {
  const { containerRef, events, dragged } = useDragScroll<HTMLDivElement>();
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
    [containerRef]
  );

  // Center active category chip on load or state change
  useEffect(() => {
    const targetId = activeCategory ? `tab-${activeCategory}` : "tab-all";
    const activeEl = containerRef.current?.querySelector(`[id="${targetId}"]`);
    if (activeEl) {
      // Use scrollTo for more reliable centering than scrollIntoView which can sometimes trigger vertical scroll
      const container = containerRef.current!;
      const target = activeEl as HTMLElement;
      const scrollLeft = target.offsetLeft - (container.clientWidth / 2) + (target.clientWidth / 2);
      container.scrollTo({ left: scrollLeft, behavior: "smooth" });
    }
  }, [activeCategory, containerRef]);

  return (
    <div className="relative group/wrapper w-auto overflow-hidden">
      <div 
        ref={containerRef}
        role="tablist"
        aria-label="Filter by category"
        {...events}
        className="flex items-center gap-3 overflow-x-auto no-scrollbar py-3 px-4 md:px-8 snap-x snap-mandatory scroll-smooth w-full relative z-content select-none"
      >
        <button
          role="tab"
          id="tab-all"
          aria-selected={!activeCategory}
          aria-controls="tool-grid-panel"
          onClick={(e) => {
            if (dragged) {
              e.preventDefault();
              return;
            }
            onCategoryChange(null);
          }}
          onKeyDown={(e) => handleKeyDown(e, 0)}
          tabIndex={!activeCategory ? 0 : -1}
          className={`
            relative flex-shrink-0 min-h-11 py-2 px-4 rounded-full text-tiny font-bold uppercase tracking-widest-sm transition-all snap-start flex items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-blue/40
            hover:scale-105 hover:-translate-y-px active:scale-95
            ${!activeCategory 
              ? "text-white shadow-md shadow-blue/15" 
              : "text-text-muted hover:text-text hover:bg-mat-hover bg-mat-surface shadow-sm"}
          `}
        >
          {!activeCategory && (
            <m.div 
              layoutId="active-cat"
              className="absolute inset-0 bg-blue rounded-full z-behind shadow-md shadow-blue/20"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className="relative z-base">All</span>
        </button>
        {CATEGORIES.map((cat, index) => (
          <button
            key={cat.id}
            role="tab"
            id={`tab-${cat.id}`}
            aria-selected={activeCategory === cat.id}
            aria-controls="tool-grid-panel"
            onClick={(e) => {
              if (dragged) {
                e.preventDefault();
                return;
              }
              onCategoryChange(cat.id);
            }}
            onKeyDown={(e) => handleKeyDown(e, index + 1)}
            tabIndex={activeCategory === cat.id ? 0 : -1}
            className={`
              relative flex-shrink-0 min-h-11 flex items-center gap-2.5 py-2 px-4 rounded-full text-tiny font-bold uppercase tracking-widest-sm transition-all snap-start outline-none focus-visible:ring-2 focus-visible:ring-blue/40
              hover:scale-105 hover:-translate-y-px active:scale-95
              ${activeCategory === cat.id 
                ? "text-white" 
                : "text-text-muted hover:text-text hover:bg-mat-hover bg-mat-surface shadow-sm"}
            `}
          >
            {activeCategory === cat.id && (
              <m.div 
                layoutId="active-cat"
                className="absolute inset-0 rounded-full z-behind shadow-md shadow-black/10"
                style={{ 
                  backgroundColor: cat.color
                }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <ToolIcon category={cat.id} className={`relative z-base w-3.5 h-3.5 ${activeCategory === cat.id ? "text-white" : "text-text-4 group-hover:text-text"}`} aria-hidden="true" />
            <span className="relative z-base whitespace-nowrap">{cat.label}</span>
          </button>
        ))}
        {/* Large spacer for right gutter to ensure last item clears the fade and feels spacious */}
        <div className="w-12 md:w-32 shrink-0 pointer-events-none" aria-hidden="true" />
      </div>
    </div>
  );
});
