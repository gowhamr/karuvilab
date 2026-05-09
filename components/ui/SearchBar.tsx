"use client";

import { useRef, useEffect, memo } from "react";
import { Search, Command } from "lucide-react";
import { m } from "framer-motion";

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export const SearchBar = memo(function SearchBar({ value, onChange, placeholder }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

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
    <div className="relative group w-full">
      {/* Background Glow */}
      <div className="absolute -inset-1 bg-blue/10 rounded-xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      <m.div 
        className="relative h-[56px] md:h-[64px] flex items-center bg-surface border border-border rounded-xl shadow-premium focus-within:border-blue/40 focus-within:ring-4 focus-within:ring-blue/5 transition-all duration-300"
      >
        <div className="pl-5 text-text-4 group-focus-within:text-blue transition-colors">
          <Search className="w-5 h-5" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || "Search tools... (⌘K)"}
          aria-label="Search tools"
          className="w-full h-full px-4 bg-transparent outline-none text-sm md:text-base text-text placeholder:text-text-4 font-bold tracking-tight"
        />

        <div className="pr-4 hidden sm:flex items-center">
          <div className="flex items-center gap-1 px-1.5 py-1 bg-bg border border-border rounded-lg text-[9px] font-mono font-black text-text-4 shadow-sm group-focus-within:border-blue/20 group-focus-within:text-blue/60 transition-colors">
            <Command className="w-2.5 h-2.5" />
            <span>K</span>
          </div>
        </div>
      </m.div>
    </div>
  );
});
