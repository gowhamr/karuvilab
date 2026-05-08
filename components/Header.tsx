"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Search, Command, Menu, Laptop } from "lucide-react";
import { useSearchStore } from "@/src/store/useSearchStore";
import { motion, useScroll, useTransform } from "framer-motion";

export function Header() {
  const { setIsPaletteOpen, setIsSidebarOpen } = useSearchStore();
  const { scrollY } = useScroll();
  
  const bgOpacity = useTransform(scrollY, [0, 50], [0, 0.8]);
  const blur = useTransform(scrollY, [0, 50], [0, 16]);
  const borderOpacity = useTransform(scrollY, [0, 50], [0, 1]);

  return (
    <motion.header 
      style={{ 
        backgroundColor: `rgba(var(--bg-rgb), ${bgOpacity.get()})`,
        backdropFilter: `blur(${blur.get()}px)`,
        borderBottomColor: `rgba(var(--border-rgb), ${borderOpacity.get()})`
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

          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-blue flex items-center justify-center text-white shadow-lg shadow-blue/25 group-hover:scale-105 group-active:scale-95 transition-all duration-300">
              <Laptop className="w-4 h-4" />
            </div>
            <span className="font-black text-base md:text-lg tracking-tight">
              <span className="text-blue">Karuvi</span>Lab
            </span>
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

          <ThemeToggle />
        </div>
      </div>
    </motion.header>
  );
}


