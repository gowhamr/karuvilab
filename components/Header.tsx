"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Menu, WifiOff, Search } from "lucide-react";
import { useSearchStore } from "@/src/store/useSearchStore";
import { m, useScroll, useTransform, AnimatePresence, useMotionTemplate } from "framer-motion";
import { usePerformanceSettings, useOnlineStatus } from "@/src/lib/hooks";
import { usePathname } from "next/navigation";
import { KVLogo } from "@/components/ui/KVLogo";
import { SearchBar } from "@/components/ui/search/SearchBar";
import { cn } from "@/src/lib/utils";
import React, { useState, useEffect, useRef } from "react";

export function Header() {
  const isOnline = useOnlineStatus();
  const setIsSidebarOpen = useSearchStore(state => state.setIsSidebarOpen);
  const [scrolled, setScrolled] = useState(false);
  const themeToggleRef = useRef<HTMLDivElement>(null);

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
        "sticky top-0 z-40 w-full h-[60px] md:h-[72px] bg-mat-base transition-colors duration-300",
        scrolled ? "border-b border-mat-border" : "border-b border-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between gap-4 pt-safe">
        <div className="flex items-center gap-2 md:gap-8 flex-shrink-0">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden min-w-[44px] min-h-[44px] -ml-2 text-text-3 hover:text-blue hover:bg-blue/5 rounded-lg transition-all flex items-center justify-center"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          <Link href="/" className="min-h-[44px] flex items-center">
            {/* Desktop: Full Logo with Image and Subtext */}
            <KVLogo withText size="md" className="hidden md:flex" loading="eager" />
            
            {/* Mobile: Just the 'KaruviLab' text for maximum space efficiency */}
            <div className="md:hidden flex items-center">
              <span className="font-dm-serif font-black text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-text via-text to-text-3">
                KaruviLab
              </span>
            </div>
          </Link>

          <nav className="hidden xl:flex items-center gap-1">
            {[
              { label: "Calculators", href: "/calculators" },
              { label: "PDF Tools", href: "/pdf-tools" },
              { label: "Image Tools", href: "/image-tools" },
            ].map((link) => (
              <Link 
                key={link.label}
                href={link.href}
                className="flex items-center h-12 px-3 rounded-lg text-[11px] font-bold text-text-3 hover:text-blue hover:bg-blue/5 transition-all uppercase tracking-wider"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Center Search - Desktop Only */}
        <div className="hidden md:flex flex-1 justify-center max-w-xl mx-auto px-4">
           <SearchBar className="md:min-w-[280px] lg:min-w-[400px]" />
        </div>

        <div className="flex items-center gap-2 md:gap-4 flex-shrink-0 justify-end">
          {/* Search Trigger - Mobile Only */}
          <div className="md:hidden flex items-center">
             <button 
                onClick={() => useSearchStore.getState().setIsPaletteOpen(true)}
                className="w-11 h-11 flex items-center justify-center text-text-3 hover:text-blue hover:bg-blue/5 rounded-xl transition-all"
                aria-label="Search tools"
             >
                <Search className="w-5 h-5" />
             </button>
          </div>

          <div className="h-4 w-px bg-border/50 hidden sm:block" />
          
          <AnimatePresence>
            {!isOnline && (
              <m.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center gap-1.5 px-2 py-1 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg text-[10px] font-bold uppercase tracking-wider"
              >
                <WifiOff className="w-3 h-3" />
                <span className="hidden xs:inline">Offline</span>
              </m.div>
            )}
          </AnimatePresence>

          <div ref={themeToggleRef} className="flex">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}


