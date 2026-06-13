"use client";

import { memo, useRef, useCallback, useEffect } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolIcon } from "./Icons";
import { m } from "framer-motion";

interface CategoryChipsProps {
  activeCategory: string | null;
  onCategoryChange: (id: string | null) => void;
}

export const CategoryChips = memo(function CategoryChips({ activeCategory, onCategoryChange }: CategoryChipsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const fadeLeftRef = useRef<HTMLDivElement>(null);
  const fadeRightRef = useRef<HTMLDivElement>(null);

  const updateScrollState = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const scrollLeft = el.scrollLeft;
    const maxScroll = el.scrollWidth - el.clientWidth;

    const hasLeft = scrollLeft > 5;
    const hasRight = scrollLeft < maxScroll - 5;

    // Toggle gradient fades
    if (fadeLeftRef.current) fadeLeftRef.current.style.opacity = hasLeft ? "1" : "0";
    if (fadeRightRef.current) fadeRightRef.current.style.opacity = hasRight ? "1" : "0";
  }, []);

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

  // Monitor scroll for fades & arrows
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    updateScrollState();

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) {
        el.scrollLeft += e.deltaY;
      }
    };

    el.addEventListener("scroll", updateScrollState, { passive: true });
    el.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("resize", updateScrollState);

    // Initial check with small delay to handle client layout calculations
    const timer = setTimeout(updateScrollState, 100);

    return () => {
      el.removeEventListener("scroll", updateScrollState);
      el.removeEventListener("wheel", handleWheel);
      window.removeEventListener("resize", updateScrollState);
      clearTimeout(timer);
    };
  }, [updateScrollState]);

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
  }, [activeCategory]);

  return (
    <div className="relative group/wrapper w-[calc(100%+2rem)] -ml-4 md:w-[calc(100%+4rem)] md:-ml-8 overflow-hidden">
      {/* Left/Right Dynamic Fades — Purely visual indicators */}
      <div 
        ref={fadeLeftRef}
        className="absolute left-0 top-0 bottom-0 w-12 md:w-20 bg-gradient-to-r from-bg via-bg/90 to-transparent pointer-events-none z-30 opacity-0 transition-opacity duration-300"
      />
      <div 
        ref={fadeRightRef}
        className="absolute right-0 top-0 bottom-0 w-12 md:w-20 bg-gradient-to-l from-bg via-bg/90 to-transparent pointer-events-none z-30 opacity-0 transition-opacity duration-300"
      />

      <div 
        ref={containerRef}
        role="tablist"
        aria-label="Filter by category"
        className="flex items-center gap-3 overflow-x-auto no-scrollbar py-3 px-4 md:px-8 snap-x snap-mandatory scroll-smooth w-full relative z-10"
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
            relative flex-shrink-0 min-h-[44px] py-2 px-4 rounded-full text-xs font-black uppercase tracking-[0.1em] transition-all snap-start flex items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-blue/40
            ${!activeCategory 
              ? "text-white shadow-md shadow-blue/15" 
              : "text-[--kv-text-muted] hover:text-[--kv-text] hover:bg-mat-hover bg-mat-surface shadow-sm"}
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
              relative flex-shrink-0 min-h-[44px] flex items-center gap-2.5 py-2 px-4 rounded-full text-xs font-black uppercase tracking-[0.1em] transition-all snap-start outline-none focus-visible:ring-2 focus-visible:ring-blue/40
              ${activeCategory === cat.id 
                ? "text-white" 
                : "text-[--kv-text-muted] hover:text-[--kv-text] hover:bg-mat-hover bg-mat-surface shadow-sm"}
            `}
          >
            {activeCategory === cat.id && (
              <m.div 
                layoutId="active-cat"
                className="absolute inset-0 rounded-full -z-10"
                style={{ 
                  backgroundColor: cat.color,
                  boxShadow: `0 4px 12px -2px ${cat.color}25`
                }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <ToolIcon category={cat.id} className={`w-3.5 h-3.5 ${activeCategory === cat.id ? "text-white" : "text-text-4 group-hover:text-text"}`} aria-hidden="true" />
            <span className="whitespace-nowrap">{cat.label}</span>
          </m.button>
        ))}
        {/* Large spacer for right gutter to ensure last item clears the fade and feels spacious */}
        <div className="w-12 md:w-32 shrink-0 pointer-events-none" aria-hidden="true" />
      </div>
    </div>
  );
});
