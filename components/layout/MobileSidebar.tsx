"use client";

import React, { useEffect, useState, useRef } from "react";
import { m, useMotionValue, useTransform, animate, PanInfo, useDragControls, AnimatePresence } from "framer-motion";
import { useSearchStore } from "@/src/store/useSearchStore";
import { Backdrop } from "./Backdrop";
import { cn } from "@/src/lib/utils";

const SIDEBAR_WIDTH = 280;

interface MobileSidebarProps {
  children: React.ReactNode;
}

export function MobileSidebar({ children }: MobileSidebarProps) {
  const isOpen = useSearchStore(state => state.isSidebarOpen);
  const setIsOpen = useSearchStore(state => state.setIsSidebarOpen);
  const dragControls = useDragControls();
  const sidebarRef = useRef<HTMLElement>(null);
  
  const x = useMotionValue(-SIDEBAR_WIDTH);
  const backdropOpacity = useTransform(x, [-SIDEBAR_WIDTH, 0], [0, 1]);

  // Sync with store
  useEffect(() => {
    if (isOpen) {
      animate(x, 0, { type: "spring", damping: 30, stiffness: 300, mass: 0.8 });
      document.body.classList.add("sidebar-open");
      
      // Focus first element on open
      const timer = setTimeout(() => {
        const focusable = sidebarRef.current?.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusable) (focusable as HTMLElement).focus();
      }, 100);
      return () => clearTimeout(timer);
    } else {
      animate(x, -SIDEBAR_WIDTH, { type: "spring", damping: 30, stiffness: 300, mass: 0.8 });
      document.body.classList.remove("sidebar-open");
    }
  }, [isOpen, x]);

  // Keyboard accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;
    if (e.key === "Escape") {
      setIsOpen(false);
      return;
    }
    if (e.key !== "Tab") return;

    const focusable = sidebarRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable || focusable.length === 0) return;

    const first = focusable[0] as HTMLElement;
    const last = focusable[focusable.length - 1] as HTMLElement;

    if (e.shiftKey) {
      if (document.activeElement === first) {
        last.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === last) {
        first.focus();
        e.preventDefault();
      }
    }
  };

  const handleDragEnd = (_: any, info: PanInfo) => {
    const { offset, velocity } = info;
    
    // Snapping logic: easier to trigger
    if (offset.x > 50 || velocity.x > 300) {
      setIsOpen(true);
    } else if (offset.x < -50 || velocity.x < -300) {
      setIsOpen(false);
    } else {
      // Return to current state
      animate(x, isOpen ? 0 : -SIDEBAR_WIDTH, { type: "spring", damping: 30, stiffness: 300 });
    }
  };

  return (
    <div className="md:hidden">
      {/* Edge Trigger Zone (Larger hit area, higher z-index) */}
      {!isOpen && (
        <div 
          className="fixed top-0 left-0 bottom-0 w-8 z-[100] touch-none"
          onPointerDown={(e) => {
            dragControls.start(e);
          }}
        />
      )}

      {/* Backdrop */}
      <AnimatePresence>
        {(isOpen || x.get() > -SIDEBAR_WIDTH) && (
          <Backdrop onClick={() => setIsOpen(false)} opacity={backdropOpacity} />
        )}
      </AnimatePresence>

      <m.aside
        ref={sidebarRef}
        onKeyDown={handleKeyDown}
        drag="x"
        dragControls={dragControls}
        dragConstraints={{ left: -SIDEBAR_WIDTH, right: 0 }}
        dragElastic={0.1}
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        style={{ x }}
        role="dialog"
        aria-modal={isOpen}
        tabIndex={-1}
        aria-label="Navigation Sidebar"
        className={cn(
          "fixed top-0 left-0 bottom-0 w-[280px] bg-surface/80 backdrop-blur-xl border-r border-border z-[70] rounded-r-2xl shadow-2xl flex flex-col touch-none overflow-hidden outline-none",
          "dark:bg-surface/90"
        )}
      >
        {/* Inner shadow for physical feel */}
        <div className="absolute inset-y-0 right-0 w-px bg-white/5 dark:bg-white/10" />
        
        <div className="flex-1 flex flex-col h-full">
           {children}
        </div>
      </m.aside>
    </div>
  );
}
