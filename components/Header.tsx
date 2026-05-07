"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Search, Command, Star, Menu } from "lucide-react";
import { useSearchStore } from "@/src/store/useSearchStore";

export function Header() {
  const pathname = usePathname();
  const setIsPaletteOpen = useSearchStore((state) => state.setIsPaletteOpen);

  return (
    <header className="sticky top-0 z-[100] w-full border-b border-border bg-surface/80 backdrop-blur-md">
      <div className="max-w-[1440px] mx-auto h-[64px] flex items-center justify-between px-4 sm:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-black text-xl tracking-tighter">
          <div className="w-8 h-8 rounded-lg bg-blue flex items-center justify-center text-white shadow-lg shadow-blue/20">
            <Command className="w-5 h-5" />
          </div>
          <span className="hidden sm:inline">Karuvi<span className="text-blue">Lab</span></span>
        </Link>

        {/* Center Search (Only visible on non-home or scroll) */}
        <div className="flex-1 max-w-md mx-8 hidden md:block">
          <button
            onClick={() => setIsPaletteOpen(true)}
            className="w-full flex items-center justify-between px-4 py-2 bg-elevated border border-border rounded-xl text-text-4 hover:border-blue/50 transition-all group"
          >
            <div className="flex items-center gap-3">
              <Search className="w-4 h-4" />
              <span className="text-sm font-bold">Search tools...</span>
            </div>
            <div className="flex items-center gap-1.5 px-1.5 py-0.5 bg-surface border border-border rounded-md text-[10px] font-black">
              <Command className="w-2.5 h-2.5" />
              <span>K</span>
            </div>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-text-3 hover:bg-hover hover:text-text transition-all">
            <Star className="w-4 h-4" />
            <span>Favorites</span>
          </button>
          
          <div className="w-px h-6 bg-border mx-2 hidden sm:block" />
          
          <ThemeToggle />
          
          <button className="md:hidden p-2 hover:bg-hover rounded-xl transition-all">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
}
