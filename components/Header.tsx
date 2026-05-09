"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Search, Command, Menu, Laptop, WifiOff } from "lucide-react";
import { useSearchStore } from "@/src/store/useSearchStore";
import { m, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useOnlineStatus } from "@/src/lib/hooks";

export function Header() {
  const isOnline = useOnlineStatus();
  const { setIsPaletteOpen, setIsSidebarOpen } = useSearchStore();
  const { scrollY } = useScroll();
  
  const bg = useTransform(scrollY, [0, 50], [
    "rgba(var(--bg-rgb), 0)",
    "rgba(var(--bg-rgb), 0.8)"
  ]);
  const blurValue = useTransform(scrollY, [0, 50], [0, 16]);
  const blurFilter = useTransform(blurValue, (v) => v > 0 ? `blur(${v}px)` : "none");
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
      className="sticky top-0 z-40 w-full border-b border-transparent transition-all duration-300 h-[60px] md:h-[72px]"
    >
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 md:gap-8">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden p-2 -ml-2 text-text-3 hover:text-blue hover:bg-blue/5 rounded-lg transition-all"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl glass-icon flex items-center justify-center text-white shadow-lg shadow-ocean/25 group-hover:scale-105 group-active:scale-95 transition-all duration-300">
              <span className="brand-wordmark text-lg leading-none mt-0.5 drop-shadow-sm">K</span>
            </div>
            <div className="flex flex-col">
              <span className="brand-wordmark text-lg md:text-xl tracking-tight leading-none">
                KaruviLab
              </span>
              <div className="hairline-rule mt-1" />
            </div>
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

        <div className="flex items-center gap-2 md:gap-4">
          <button 
            onClick={() => setIsPaletteOpen(true)}
            aria-label="Search tools"
            className="group flex items-center justify-between gap-3 px-3 py-1.5 md:min-w-[160px] lg:min-w-[240px] bg-surface border border-border rounded-lg text-[11px] font-bold text-text-4 shadow-sm hover:border-blue/30 hover:text-blue hover:bg-blue/5 transition-all"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
              <span className="hidden md:inline">Quick search...</span>
            </div>
            <div className="hidden md:flex items-center gap-0.5 px-1 py-0.5 bg-bg border border-border rounded text-[9px] font-mono group-hover:border-blue/20">
              <Command className="w-2.5 h-2.5" />
              <span>K</span>
            </div>
          </button>
          
          <div className="h-4 w-px bg-border/50 hidden sm:block" />

          <AnimatePresence>
            {!isOnline && (
              <m.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
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


