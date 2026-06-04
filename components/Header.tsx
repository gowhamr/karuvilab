"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Menu, WifiOff } from "lucide-react";
import { useSearchStore } from "@/src/store/useSearchStore";
import { m, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { usePerformanceSettings, useOnlineStatus } from "@/src/lib/hooks";
import { usePathname } from "next/navigation";
import { KVLogo } from "@/components/ui/KVLogo";
import { SearchBar } from "@/components/ui/search/SearchBar";
import React from "react";

export function Header() {
  const isOnline = useOnlineStatus();
  const setIsSidebarOpen = useSearchStore(state => state.setIsSidebarOpen);
  const { scrollY } = useScroll();
  const { shouldBlur } = usePerformanceSettings();
  
  const bg = useTransform(scrollY, [0, 50], [
    "rgba(var(--bg-rgb), 0)",
    "rgba(var(--bg-rgb), 0.95)"
  ]);
  const blurValue = useTransform(scrollY, [0, 50], [0, 8]);
  const blurFilter = useTransform(blurValue, (v) => (shouldBlur && v > 0) ? `blur(${v}px)` : "none");
  const border = useTransform(scrollY, [0, 50], [
    "rgba(var(--border-rgb), 0)",
    "rgba(var(--border-rgb), 1)"
  ]);

  return (
    <m.header 
      style={{ 
        backgroundColor: bg,
        backdropFilter: blurFilter,
        WebkitBackdropFilter: blurFilter,
        borderBottomColor: border
      }}
      className="sticky top-0 z-40 w-full border-b border-transparent h-[60px] md:h-[72px]"
    >
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between gap-4 pt-safe">
        <div className="flex items-center gap-2 md:gap-8">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden min-w-[44px] min-h-[44px] -ml-2 text-text-3 hover:text-blue hover:bg-blue/5 rounded-lg transition-all flex items-center justify-center"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          <Link href="/" className="min-h-[44px] flex items-center">
            <KVLogo withText size="md" className="hidden md:flex" loading="eager" />
            <KVLogo size="md" className="md:hidden" loading="eager" />
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
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

        <div className="flex items-center gap-2 md:gap-4 flex-1 justify-end">
          <div className="hidden sm:block flex-1 max-w-md">
             <SearchBar />
          </div>
          <div className="sm:hidden flex-1 flex justify-end">
             <SearchBar />
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

          <ThemeToggle />
        </div>
      </div>
    </m.header>
  );
}


