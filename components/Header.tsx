"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Menu, Search } from "lucide-react";
import { useSearchStore } from "@/src/store/useSearchStore";
import { m } from "framer-motion";
import { usePerformanceSettings } from "@/src/lib/hooks";
import { usePathname } from "next/navigation";
import { KVLogo } from "@/components/ui/KVLogo";
import { SearchBar } from "@/components/ui/search/SearchBar";
import { cn } from "@/src/lib/utils";
import React, { useState, useEffect, useRef } from "react";

import { useFullscreenContext } from '@/src/contexts/FullscreenContext';
import { OfflineSyncIndicator } from "./system/OfflineSyncIndicator";

export function Header() {
  const { isFullscreen } = useFullscreenContext();
  const setIsSidebarOpen = useSearchStore(state => state.setIsSidebarOpen);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const themeToggleRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname() || "";

  if (isFullscreen) return null;

  useEffect(() => {
    const el = themeToggleRef.current;
    if (!el) return;

    const updateAriaLabel = () => {
      const btn = el.querySelector("button");
      if (btn) {
        btn.setAttribute("aria-label", "Toggle theme");
      }
    };

    updateAriaLabel();

    const observer = new MutationObserver(updateAriaLabel);
    observer.observe(el, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header 
      className={cn(
        "sticky top-0 z-40 w-full h-15 md:h-18 bg-mat-base transition-colors duration-300",
        scrolled ? "border-b border-mat-border" : "border-b border-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 h-full flex items-center justify-between gap-1.5 sm:gap-4 pt-safe">
        <div className="flex items-center gap-2 md:gap-8 flex-shrink-0">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden min-w-11 min-h-11 -ml-2 text-text-3 hover:text-blue hover:bg-blue/5 rounded-lg transition-all flex items-center justify-center"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          <Link href="/" className="min-h-11 flex items-center">
            {/* Desktop: Full Logo with Image and Subtext */}
            <KVLogo withText size="md" className="hidden md:flex" loading="lazy" />
            
            {/* Mobile: Just the 'KaruviLab' text for maximum space efficiency */}
            <div className="md:hidden flex items-center">
              <span className="font-dm-serif font-black text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-text via-text to-text-3">
                KaruviLab
              </span>
            </div>
          </Link>

          <nav 
            className="hidden xl:flex items-center gap-1"
            onMouseLeave={() => setHoveredLink(null)}
          >
            {[
              { label: "Calculators", href: "/calculators" },
              { label: "PDF Tools", href: "/pdf-tools" },
              { label: "Image Tools", href: "/image-tools" },
            ].map((link) => {
              const isActive = pathname.startsWith(link.href);
              const isHovered = hoveredLink === link.href;

              return (
                <Link 
                  key={link.label}
                  href={link.href}
                  onMouseEnter={() => setHoveredLink(link.href)}
                  className={cn(
                    "relative flex items-center h-12 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors z-10",
                    isActive || isHovered ? "text-blue" : "text-text-3 hover:text-blue"
                  )}
                >
                  {((hoveredLink === link.href) || (!hoveredLink && isActive)) && (
                    <m.div
                      layoutId="header-nav-pill"
                      className="absolute inset-0 bg-blue/5 rounded-lg -z-10"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Center Search - Desktop Only */}
        <div className="hidden md:flex flex-1 justify-center max-w-xl mx-auto px-4">
           <SearchBar className="md:min-w-72 lg:min-w-96" />
        </div>

        <div className="flex items-center gap-1.5 md:gap-4 flex-shrink-0 justify-end">
          {/* Search Trigger - Mobile Only */}
          <div className="md:hidden flex items-center">
             <button 
                onClick={() => useSearchStore.getState().setIsPaletteOpen(true)}
                className="h-11 px-4 flex items-center gap-2 bg-[--kv-mat-surface] hover:bg-[--kv-mat-hover] border border-border/60 rounded-full text-text-2 hover:text-blue transition-all shadow-sm"
                aria-label="Search tools"
             >
                <Search className="w-4 h-4 text-text-3" />
                <span className="text-sm font-medium text-text-3">Search</span>
             </button>
          </div>

          <div className="h-4 w-px bg-border/50 hidden sm:block" />
          
          <OfflineSyncIndicator />

          <div ref={themeToggleRef} className="flex">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}


