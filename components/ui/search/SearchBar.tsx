// components/ui/search/SearchBar.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Search, Command } from "lucide-react";
import { useSearchStore } from "@/src/store/useSearchStore";
import { SearchOverlay } from "./SearchOverlay";
import { cn } from "@/src/lib/utils";
import { getDeviceCapabilities } from "@/src/utils";

export function SearchBar() {
  const isPaletteOpen = useSearchStore(state => state.isPaletteOpen);
  const setIsPaletteOpen = useSearchStore(state => state.setIsPaletteOpen);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(getDeviceCapabilities().isMobile);
    
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or / to open search
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsPaletteOpen(true);
      } else if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        setIsPaletteOpen(true);
      }
    };
    
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [setIsPaletteOpen]);

  return (
    <>
      {/* Desktop Persistent Button (Header) */}
      <button 
        onClick={() => setIsPaletteOpen(true)}
        aria-label="Search tools"
        className={cn(
          "group flex items-center justify-between gap-3 p-3 sm:px-4 sm:py-2 bg-mat-raised shadow-mat-shine border border-mat-border rounded-2xl text-sm font-medium text-text-4 hover:border-brand-primary/30 hover:bg-mat-hover transition-all outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/50",
          "w-full md:min-w-[240px] lg:min-w-[340px] h-[44px]"
        )}
      >
        <div className="flex items-center gap-2.5">
          <Search className="w-4 h-4 text-text-3 group-hover:text-brand-primary transition-colors" />
          <span className="hidden sm:inline">Search 100+ tools...</span>
          <span className="sm:hidden">Search...</span>
        </div>
        <div className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 bg-mat-base border border-mat-border rounded-lg text-[10px] font-mono font-bold text-text-3 group-hover:text-brand-primary transition-colors">
          <Command className="w-3 h-3" />
          <span>K</span>
        </div>
      </button>

      {/* Floating Action Button (Mobile Fallback) */}
      {isMobile && (
        <button
          onClick={() => setIsPaletteOpen(true)}
          className="fixed bottom-24 right-4 z-40 w-14 h-14 bg-brand-primary text-white rounded-full flex items-center justify-center shadow-lg shadow-brand-primary/30 hover:scale-105 active:scale-95 transition-all outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-primary"
          aria-label="Open search"
        >
          <Search className="w-6 h-6" />
        </button>
      )}

      {/* Full-screen Overlay */}
      <SearchOverlay 
        isOpen={isPaletteOpen} 
        onClose={() => setIsPaletteOpen(false)} 
      />
    </>
  );
}
