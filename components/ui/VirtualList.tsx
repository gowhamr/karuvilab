"use client";

import React, { useRef, useState, useEffect, ReactNode } from "react";

interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  renderItem: (item: T, index: number) => ReactNode;
  overscan?: number;
  className?: string;
}

export function VirtualList<T>({ 
  items, 
  itemHeight, 
  renderItem, 
  overscan = 3, 
  className = "" 
}: VirtualListProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // We only care about scrolling inside this container
    // However, if the container doesn't have overflow-y, it might be the parent scrolling.
    // Assuming the parent handles scrolling, we attach to the nearest scroll parent.
    const scrollParent = getScrollParent(container);
    if (!scrollParent) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollTop(scrollParent === window ? window.scrollY : (scrollParent as HTMLElement).scrollTop);
          ticking = false;
        });
        ticking = true;
      }
    };

    const handleResize = () => {
      setContainerHeight(scrollParent === window ? window.innerHeight : (scrollParent as HTMLElement).clientHeight);
    };

    scrollParent.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    
    handleResize();
    // Invoke immediately to initialize scrollTop
    setScrollTop(scrollParent === window ? window.scrollY : (scrollParent as HTMLElement).scrollTop);

    return () => {
      scrollParent.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const totalHeight = items.length * itemHeight;
  
  // Calculate visible range
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const visibleItems = [];
  for (let i = startIndex; i <= endIndex; i++) {
    visibleItems.push(
      <div 
        key={i}
        style={{
          position: "absolute",
          top: i * itemHeight,
          left: 0,
          right: 0,
          height: itemHeight
        }}
      >
        {renderItem(items[i]!, i)}
      </div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      className={className} 
      style={{ height: totalHeight, position: "relative", width: "100%" }}
    >
      {visibleItems}
    </div>
  );
}

function getScrollParent(node: HTMLElement | null): HTMLElement | Window {
  if (!node || node === document.body || node === document.documentElement) {
    return window;
  }
  const overflowY = window.getComputedStyle(node).overflowY;
  if (overflowY === "auto" || overflowY === "scroll" || overflowY === "overlay") {
    return node;
  }
  return getScrollParent(node.parentElement);
}
