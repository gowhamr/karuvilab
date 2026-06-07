// components/ui/search/SearchBar.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Search, Command } from "lucide-react";
import { useSearchStore } from "@/src/store/useSearchStore";
import { cn } from "@/src/lib/utils";
import { getDeviceCapabilities } from "@/src/utils";

interface SearchBarProps {
  variant?: "header" | "hero";
  className?: string;
}

export function SearchBar({ variant = "header", className }: SearchBarProps) {
  const setIsPaletteOpen = useSearchStore(state => state.setIsPaletteOpen);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(getDeviceCapabilities().isMobile);
  }, []);

  const isHero = variant === "hero";

  return (
    <>
      {/* Search Trigger Button */}
      <button 
        onClick={() => setIsPaletteOpen(true)}
        aria-label="Search tools"
        className={cn(
          "group flex items-center justify-between gap-3 bg-mat-raised shadow-mat-shine border border-mat-border transition-all outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/50",
          isHero 
            ? "p-4 sm:p-5 rounded-2xl h-[64px] sm:h-[80px] w-full text-lg sm:text-xl font-bold hover:border-brand-primary/40 hover:bg-mat-hover" 
            : "p-3 sm:px-4 sm:py-2 rounded-2xl h-[44px] w-full md:min-w-[240px] lg:min-w-[340px] text-sm font-medium hover:border-brand-primary/30 hover:bg-mat-hover",
          className
        )}
      >
        <div className="flex items-center gap-3 md:gap-4 flex-1">
          <Search className={cn(
            "text-text-3 group-hover:text-brand-primary transition-colors",
            isHero ? "w-6 h-6" : "w-4 h-4"
          )} />
          <span className="text-text-4">
            <span className="hidden sm:inline">Search 100+ tools...</span>
            <span className="sm:hidden">Search...</span>
          </span>
        </div>
        <div className={cn(
          "hidden sm:flex items-center gap-1.5 px-2 py-1 bg-mat-base border border-mat-border rounded-xl text-text-3 group-hover:text-brand-primary transition-colors",
          isHero ? "text-xs font-mono font-black" : "text-[10px] font-mono font-bold"
        )}>
          <Command className={cn(isHero ? "w-4 h-4" : "w-3 h-3")} />
          <span>K</span>
        </div>
      </button>
    </>
  );
}
