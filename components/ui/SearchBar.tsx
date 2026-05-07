"use client";

import { useRef, useEffect } from "react";
import { Search, Command } from "lucide-react";
import { useSearchStore } from "@/src/store/useSearchStore";

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
    <div className="relative group max-w-2xl mx-auto w-full">
      <div className="absolute inset-0 bg-blue/10 blur-2xl opacity-0 group-focus-within:opacity-30 transition-opacity duration-500 -z-10" />
      
      <div className="relative flex items-center bg-elevated border border-border rounded-xl shadow-md focus-within:ring-4 focus-within:ring-blue/5 focus-within:border-blue/50 transition-all overflow-hidden">
        <div className="pl-5 text-text-4">
          <Search className="w-5 h-5" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => {
            // Optional: can trigger palette or just use local search
          }}
          placeholder={placeholder || "Search tools... (⌘K)"}
          className="w-full px-3 py-4 md:py-5 bg-transparent outline-none text-base md:text-lg text-text placeholder:text-text-4 font-bold"
        />

        <div className="pr-5 flex items-center gap-3">
          <button 
            onClick={() => setIsPaletteOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-2 py-1 bg-surface border border-border rounded-md text-[9px] font-black text-text-4 shadow-sm hover:bg-hover transition-colors"
          >
            <Command className="w-2.5 h-2.5" />
            <span>K</span>
          </button>
        </div>
      </div>
    </div>
  );
}
