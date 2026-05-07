"use client";

import { useRef, useEffect } from "react";
import { Search, Command } from "lucide-react";
import { useSearchStore } from "@/src/store/useSearchStore";
import { motion } from "framer-motion";

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const setIsPaletteOpen = useSearchStore((state) => state.setIsPaletteOpen);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="relative group w-full max-w-2xl mx-auto">
      {/* Dynamic Glow Background */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue/20 via-indigo-500/10 to-blue/20 rounded-3xl blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-700 pointer-events-none" />
      
      <motion.div 
        whileHover={{ scale: 1.005 }}
        whileTap={{ scale: 0.995 }}
        className="relative flex items-center bg-surface border-2 border-border rounded-2xl shadow-2xl focus-within:border-blue focus-within:ring-4 focus-within:ring-blue/5 transition-all duration-300"
      >
        <div className="pl-5 text-text-4 group-focus-within:text-blue transition-colors">
          <Search className="w-5 h-5 md:w-6 md:h-6" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || "Search 100+ private tools... (⌘K)"}
          className="w-full px-4 py-4 md:py-5 bg-transparent outline-none text-base md:text-xl text-text placeholder:text-text-4 font-bold tracking-tight"
        />

        <div className="pr-5 hidden sm:flex items-center gap-2">
          <kbd className="flex items-center gap-1 px-2 py-1 bg-bg border border-border rounded-lg text-[10px] font-black text-text-4 shadow-sm">
            <Command className="w-3 h-3" />
            <span>K</span>
          </kbd>
        </div>
      </motion.div>
    </div>
  );
}

