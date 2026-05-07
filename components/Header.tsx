"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Search, Command, Laptop } from "lucide-react";
import { useSearchStore } from "@/src/store/useSearchStore";
import { motion, useScroll, useTransform } from "framer-motion";

export function Header() {
  const setIsPaletteOpen = useSearchStore((state) => state.setIsPaletteOpen);
  const { scrollY } = useScroll();
  
  const borderOpacity = useTransform(scrollY, [0, 20], [0, 1]);
  const backdropBlur = useTransform(scrollY, [0, 20], [0, 24]);
  const bgOpacity = useTransform(scrollY, [0, 20], [0, 0.7]);

  return (
    <motion.header 
      style={{ 
        borderBottomColor: `rgba(var(--border-rgb, 30, 41, 59), ${borderOpacity.get()})`,
        backdropFilter: `blur(${backdropBlur.get()}px)`,
        backgroundColor: `rgba(var(--bg-rgb), ${bgOpacity.get()})`
      }}
      className="sticky top-0 z-50 w-full border-b border-transparent transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 h-14 md:h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-blue flex items-center justify-center text-white shadow-lg shadow-blue/20 group-hover:scale-110 transition-transform duration-500">
              <Laptop className="w-4 h-4" />
            </div>
            <span className="font-black text-lg tracking-tighter">
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
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-text-3 hover:text-blue hover:bg-blue/5 transition-all"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex-1 max-w-md hidden md:block">
          <button 
            onClick={() => setIsPaletteOpen(true)}
            className="w-full flex items-center justify-between px-4 py-1.5 bg-surface/50 border border-border rounded-xl text-xs font-bold text-text-4 shadow-sm hover:border-blue/30 hover:text-blue transition-all group"
          >
            <div className="flex items-center gap-3">
              <Search className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
              <span>Search tools...</span>
            </div>
            <kbd className="flex items-center gap-1 px-1.5 py-0.5 bg-bg border border-border rounded text-[10px] font-mono">
              <Command className="w-2.5 h-2.5" />
              K
            </kbd>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsPaletteOpen(true)}
            className="md:hidden p-2 text-text-3 hover:text-blue transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>
          
          <div className="h-4 w-px bg-border mx-2 hidden sm:block" />

          <ThemeToggle />
        </div>
      </div>
    </motion.header>
  );
}

