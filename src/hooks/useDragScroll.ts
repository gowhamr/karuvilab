import { useRef, useCallback, useState, useEffect } from 'react';

export function useDragScroll<T extends HTMLElement>() {
  const containerRef = useRef<T>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);
  const [dragged, setDragged] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      // If the scroll is mostly vertical, map it to horizontal scroll
      if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, []);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    setDragged(false);
    startX.current = e.pageX - (containerRef.current?.offsetLeft || 0);
    scrollLeftStart.current = containerRef.current?.scrollLeft || 0;
    if (containerRef.current) {
      containerRef.current.style.cursor = 'grabbing';
      containerRef.current.classList.remove('scroll-smooth', 'snap-x', 'snap-mandatory');
    }
  }, []);

  const onMouseLeave = useCallback(() => {
    isDragging.current = false;
    if (containerRef.current) {
      containerRef.current.style.cursor = '';
      containerRef.current.classList.add('scroll-smooth', 'snap-x', 'snap-mandatory');
    }
  }, []);

  const onMouseUp = useCallback(() => {
    isDragging.current = false;
    if (containerRef.current) {
      containerRef.current.style.cursor = '';
      containerRef.current.classList.add('scroll-smooth', 'snap-x', 'snap-mandatory');
    }
    // Prevent immediate click after drag
    setTimeout(() => setDragged(false), 50);
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - (containerRef.current?.offsetLeft || 0);
    const walk = (x - startX.current) * 2; 
    if (Math.abs(walk) > 5) setDragged(true);
    if (containerRef.current) {
      containerRef.current.scrollLeft = scrollLeftStart.current - walk;
    }
  }, []);

  return {
    containerRef,
    events: {
      onMouseDown,
      onMouseLeave,
      onMouseUp,
      onMouseMove,
    },
    dragged,
  };
}
