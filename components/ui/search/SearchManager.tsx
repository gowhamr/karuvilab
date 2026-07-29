// components/ui/search/SearchManager.tsx
"use client";

import React, { useEffect } from "react";
import { useSearchStore } from "@/src/store/useSearchStore";
import { SearchOverlay } from "./SearchOverlay";

export function SearchManager() {
  const isPaletteOpen  = useSearchStore(state => state.isPaletteOpen);
  const setIsPaletteOpen = useSearchStore(state => state.setIsPaletteOpen);
  // Read the prefilled query set by Paste & Detect (or any other caller)
  const pendingQuery   = useSearchStore(state => state.searchQuery);
  const setSearchQuery = useSearchStore(state => state.setSearchQuery);

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

  const handleClose = () => {
    setIsPaletteOpen(false);
    // Clear pending query so next Ctrl+K open starts blank
    setSearchQuery('');
  };

  return (
    <SearchOverlay 
      isOpen={isPaletteOpen} 
      onClose={handleClose}
      initialQuery={pendingQuery}
    />
  );
}
