"use client";

import React, { memo, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Layers, Grid, Settings } from "lucide-react";
import { useSearchStore } from "@/src/store/useSearchStore";
import { m, AnimatePresence } from "framer-motion";
import { useFullscreenContext } from "@/src/contexts/FullscreenContext";

const NAV_ITEMS = [
  { label: "Home", href: "/", icon: Home },
  { label: "Search", action: "search", icon: Search },
  { label: "Workbench", href: "/workbench", icon: Layers },
  { label: "All Tools", href: "/all-tools", icon: Grid },
  { label: "Settings", href: "/settings", icon: Settings },
];

export const BottomNav = memo(function BottomNav() {
  const { isFullscreen } = useFullscreenContext();
  const pathname = usePathname() || "";
  const setIsPaletteOpen = useSearchStore(state => state.setIsPaletteOpen);

  const handleSearch = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsPaletteOpen(true);
  }, [setIsPaletteOpen]);

  if (isFullscreen) return null;

  return (
    <nav
      className="fixed left-4 right-4 z-nav md:hidden bg-surface/80 backdrop-blur-lg border border-divider rounded-fab py-2 px-3 shadow-xl shadow-black/20"
      style={{ bottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))' }}
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-between max-w-md mx-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = item.href ? (item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)) : false;

          if (item.action === "search") {
            return (
              <button
                key={item.label}
                onClick={handleSearch}
                className="relative flex flex-col items-center justify-center text-text-secondary hover:text-primary transition-colors w-12 h-12 outline-none rounded-full focus-visible:ring-2 focus-visible:ring-primary"
                aria-label="Search"
              >
                <Icon className="w-5 h-5" strokeWidth={2} />
                <span className="sr-only">Search</span>
              </button>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href!}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
              className="relative flex flex-col items-center justify-center w-12 h-12 outline-none rounded-full focus-visible:ring-2 focus-visible:ring-primary group"
            >
              <div className="relative flex items-center justify-center transition-transform active:scale-95">
                <Icon 
                  className={`w-5 h-5 transition-colors duration-150 ${
                    isActive ? "text-primary" : "text-text-secondary group-hover:text-text-primary"
                  }`} 
                  strokeWidth={2} 
                />
                
                <AnimatePresence>
                  {isActive && (
                    <m.span 
                      layoutId="mobile-nav-dot"
                      className="absolute -bottom-1.5 w-1 h-1 rounded-full bg-primary"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </AnimatePresence>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
});
