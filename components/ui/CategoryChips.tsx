"use client";

import { memo, useRef, useCallback, useEffect } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolIcon } from "./Icons";
import { m } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CategoryChipsProps {
  activeCategory: string | null;
  onCategoryChange: (id: string | null) => void;
}

export const CategoryChips = memo(function CategoryChips({ activeCategory, onCategoryChange }: CategoryChipsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const fadeLeftRef = useRef<HTMLDivElement>(null);
  const fadeRightRef = useRef<HTMLDivElement>(null);
  const btnLeftRef = useRef<HTMLButtonElement>(null);
  const btnRightRef = useRef<HTMLButtonElement>(null);

  const updateScrollState = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const scrollLeft = el.scrollLeft;
    const maxScroll = el.scrollWidth - el.clientWidth;

    const hasLeft = scrollLeft > 5;
    const hasRight = scrollLeft < maxScroll - 5;

    // Toggle left elements
    if (fadeLeftRef.current) fadeLeftRef.current.style.opacity = hasLeft ? "1" : "0";
    if (btnLeftRef.current) {
      if (hasLeft) {
        btnLeftRef.current.classList.add("md:group-hover/wrapper:opacity-100", "md:group-hover/wrapper:pointer-events-auto");
      } else {
        btnLeftRef.current.classList.remove("md:group-hover/wrapper:opacity-100", "md:group-hover/wrapper:pointer-events-auto");
      }
    }

    // Toggle right elements
    if (fadeRightRef.current) fadeRightRef.current.style.opacity = hasRight ? "1" : "0";
    if (btnRightRef.current) {
      if (hasRight) {
        btnRightRef.current.classList.add("md:group-hover/wrapper:opacity-100", "md:group-hover/wrapper:pointer-events-auto");
      } else {
        btnRightRef.current.classList.remove("md:group-hover/wrapper:opacity-100", "md:group-hover/wrapper:pointer-events-auto");
      }
    }
  }, []);

  const scrollLeft = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -220, behavior: "smooth" });
    }
  }, []);

  const scrollRight = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 220, behavior: "smooth" });
    }
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

    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    // Initial check with small delay to handle client layout calculations
    const timer = setTimeout(updateScrollState, 100);

    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
      clearTimeout(timer);
    };
  }, [updateScrollState]);

  // Center active category chip on load or state change
  useEffect(() => {
    const targetId = activeCategory ? `tab-${activeCategory}` : "tab-all";
    const activeEl = containerRef.current?.querySelector(`[id="${targetId}"]`);
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [activeCategory]);

  return (
    <div className="relative group/wrapper px-4 sm:px-0">
      {/* Left/Right Dynamic Fades */}
      <div 
        ref={fadeLeftRef}
        className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[--kv-mat-surface] to-transparent pointer-events-none z-10 opacity-0 transition-opacity duration-300"
      />
      <div 
        ref={fadeRightRef}
        className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[--kv-mat-surface] to-transparent pointer-events-none z-10 opacity-0 transition-opacity duration-300"
      />

      {/* Desktop Navigation Chevrons */}
      <button
        ref={btnLeftRef}
        onClick={scrollLeft}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-surface border border-border hidden md:flex items-center justify-center text-text-3 hover:text-text hover:bg-hover shadow-md z-20 hover:scale-105 transition-all duration-200 opacity-0 pointer-events-none focus-visible:opacity-100 focus-visible:pointer-events-auto outline-none focus-visible:ring-2 focus-visible:ring-blue/40"
        aria-label="Scroll categories left"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        ref={btnRightRef}
        onClick={scrollRight}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-surface border border-border hidden md:flex items-center justify-center text-text-3 hover:text-text hover:bg-hover shadow-md z-20 hover:scale-105 transition-all duration-200 opacity-0 pointer-events-none focus-visible:opacity-100 focus-visible:pointer-events-auto outline-none focus-visible:ring-2 focus-visible:ring-blue/40"
        aria-label="Scroll categories right"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      <div 
        ref={containerRef}
        role="tablist"
        aria-label="Filter by category"
        className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 snap-x scroll-smooth"
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
              : "text-[--kv-text-muted] hover:text-[--kv-text] hover:bg-[--kv-mat-hover] bg-[--kv-mat-surface] border border-[--kv-chip-border]"}
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
                : "text-[--kv-text-muted] hover:text-[--kv-text] hover:bg-[--kv-mat-hover] bg-[--kv-mat-surface] border border-[--kv-chip-border]"}
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
