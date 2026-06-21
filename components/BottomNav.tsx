"use client";

import React, { memo, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, LayoutGrid, Settings } from "lucide-react";
import { useSearchStore } from "@/src/store/useSearchStore";
import { m } from "framer-motion";
import { useFullscreenContext } from "@/src/contexts/FullscreenContext";

const NAV_ITEMS = [
  { label: "Home", href: "/", icon: Home },
  { label: "Search", action: "search", icon: Search },
  { label: "Tools", action: "menu", icon: LayoutGrid },
  { label: "Settings", href: "/settings", icon: Settings },
];

export const BottomNav = memo(function BottomNav() {
  const { isFullscreen } = useFullscreenContext();
  const pathname = usePathname();
  const setIsPaletteOpen = useSearchStore(state => state.setIsPaletteOpen);
  const setIsSidebarOpen = useSearchStore(state => state.setIsSidebarOpen);

  const handleSearch = useCallback(() => setIsPaletteOpen(true), [setIsPaletteOpen]);
  const handleMenu = useCallback(() => setIsSidebarOpen(true), [setIsSidebarOpen]);

  if (isFullscreen) return null;

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-nav md:hidden bg-surface border-t border-border px-4 pb-safe-bottom shadow-[0_-4px_16px_rgba(0,0,0,0.06)] dark:shadow-none !opacity-100"
      style={{ 
        contain: 'layout style paint'
      }}
    >
      <div className="flex items-center justify-between h-16 max-w-md mx-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = item.href === pathname;

          if (item.action === "search") {
            return (
              <m.button
                key={item.label}
                whileTap={{ scale: 0.95 }}
                onClick={handleSearch}
                className="flex flex-col items-center justify-center gap-1 text-text-4 hover:text-brand-primary transition-colors min-w-12 min-h-12 outline-none"
                aria-label="Search"
              >
                <div className="p-2.5 rounded-xl hover:bg-mat-hover transition-colors">
                  <Icon className="w-5 h-5 text-text-3" />
                </div>
              </m.button>
            );
          }

          if (item.action === "menu") {
            return (
              <m.button
                key={item.label}
                whileTap={{ scale: 0.95 }}
                onClick={handleMenu}
                className="flex flex-col items-center justify-center gap-1 text-text-4 hover:text-brand-primary transition-colors min-w-12 min-h-12 outline-none"
                aria-label="Menu"
              >
                <div className="p-2.5 rounded-xl hover:bg-mat-hover transition-colors">
                  <Icon className="w-5 h-5 text-text-3" />
                </div>
              </m.button>
            );
          }

          return (
            <m.div key={item.label} whileTap={{ scale: 0.95 }}>
              <Link
                href={item.href!}
                aria-label={item.label}
                aria-current={isActive ? "page" : undefined}
                className={`flex flex-col items-center justify-center gap-1 transition-all min-w-12 min-h-12 outline-none ${
                  isActive ? "text-brand-primary" : "text-text-4 hover:text-text"
                }`}
              >
                <div className={`relative flex flex-col items-center p-2.5 rounded-xl transition-all ${
                  isActive 
                    ? "text-brand-primary" 
                    : "bg-transparent text-text-4 hover:bg-mat-hover"
                }`}>
                  <Icon className="w-5 h-5" fill={isActive ? "currentColor" : "none"} />
                  {isActive && (
                    <m.div 
                      layoutId="nav-indicator"
                      className="absolute bottom-1 w-1 h-1 rounded-full bg-brand-primary shadow-[0_0_8px_rgba(79,70,229,0.8)]"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </div>
              </Link>
            </m.div>
          );
        })}
      </div>
    </nav>
  );
});
