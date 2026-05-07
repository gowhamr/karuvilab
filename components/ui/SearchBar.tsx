"use client";

import { useRef, useEffect } from "react";
import { Search, Command } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder }: SearchBarProps) {
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
    <div className="relative group max-w-2xl mx-auto w-full">
      <div className="absolute inset-0 bg-blue/20 blur-3xl opacity-0 group-focus-within:opacity-40 transition-opacity duration-500 -z-10" />
      
      <div className="relative flex items-center bg-elevated border border-border rounded-2xl shadow-lg focus-within:ring-4 focus-within:ring-blue/10 focus-within:border-blue transition-all overflow-hidden">
        <div className="pl-6 text-text-4">
          <Search className="w-6 h-6" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || "Search for a tool... (Press ⌘K)"}
          className="w-full px-4 py-5 md:py-6 bg-transparent outline-none text-lg md:text-xl text-text placeholder:text-text-4 font-medium"
        />

        <div className="pr-6 flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 bg-surface border border-border rounded-lg text-[10px] font-bold text-text-4 shadow-sm">
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>
        </div>
      </div>
    </div>
  );
}
