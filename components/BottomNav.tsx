"use client";

import React, { memo, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, LayoutGrid, Settings } from "lucide-react";
import { useSearchStore } from "@/src/store/useSearchStore";
import { m } from "framer-motion";

const NAV_ITEMS = [
  { label: "Home", href: "/", icon: Home },
  { label: "Search", action: "search", icon: Search },
  { label: "Tools", action: "menu", icon: LayoutGrid },
  { label: "Settings", href: "/settings", icon: Settings },
];

import { useFullscreenContext } from '@/src/contexts/FullscreenContext';

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
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden kv-glass border-t border-[--kv-mat-border] rounded-t-[24px] px-6 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom,0px))]"
      style={{ 
        contain: 'layout style paint',
        backgroundColor: 'var(--kv-glass-bg)',
        backdropFilter: 'var(--kv-glass-blur)',
        WebkitBackdropFilter: 'var(--kv-glass-blur)'
      }}
    >
      <div className="flex items-center justify-between h-full max-w-md mx-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = item.href === pathname;

          if (item.action === "search") {
            return (
              <m.button
                key={item.label}
                whileTap={{ scale: 0.95 }}
                onClick={handleSearch}
                className="flex flex-col items-center justify-center gap-1 text-text-4 hover:text-brand-primary transition-colors min-w-[48px] min-h-[48px]"
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
                className="flex flex-col items-center justify-center gap-1 text-text-4 hover:text-brand-primary transition-colors min-w-[48px] min-h-[48px]"
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
                className={`flex flex-col items-center justify-center gap-1 transition-all min-w-[48px] min-h-[48px] ${
                  isActive ? "text-brand-primary" : "text-text-4 hover:text-text"
                }`}
              >
                <div className={`p-2.5 rounded-xl transition-all ${
                  isActive 
                    ? "bg-brand-primary/10 text-brand-primary" 
                    : "bg-transparent text-text-4 hover:bg-mat-hover"
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
              </Link>
            </m.div>
          );
        })}
      </div>
    </nav>
  );
});
