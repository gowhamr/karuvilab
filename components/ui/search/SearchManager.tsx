// components/ui/search/SearchManager.tsx
"use client";

import React, { useEffect } from "react";
import { useSearchStore } from "@/src/store/useSearchStore";
import { SearchOverlay } from "./SearchOverlay";

export function SearchManager() {
  const isPaletteOpen = useSearchStore(state => state.isPaletteOpen);
  const setIsPaletteOpen = useSearchStore(state => state.setIsPaletteOpen);

  useEffect(() => {
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
    <SearchOverlay 
      isOpen={isPaletteOpen} 
      onClose={() => setIsPaletteOpen(false)} 
    />
  );
}
