"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { Search, ChevronDown, Check, Globe } from "lucide-react";
import { m, AnimatePresence } from "framer-motion";
import { cn } from "@/src/lib/utils";

interface CurrencyOption {
  code: string;
  name: string;
}

interface CurrencySelectProps {
  label: string;
  value: string;
  onChange: (code: string) => void;
  options: CurrencyOption[];
  popularCodes: string[];
}

export function CurrencySelect({ label, value, onChange, options, popularCodes }: CurrencySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredOptions = useMemo(() => {
    const q = search.toLowerCase();
    
    // Split into popular and others
    const popular = options.filter(opt => popularCodes.includes(opt.code));
    const others = options.filter(opt => !popularCodes.includes(opt.code));
    
    // Sort others alphabetically
    others.sort((a, b) => a.code.localeCompare(b.code));
    
    const all = [...popular, ...others];
    
    if (!q) return all;
    
    return all.filter(opt => 
      opt.code.toLowerCase().includes(q) || 
      opt.name.toLowerCase().includes(q)
    );
  }, [options, search, popularCodes]);

  const selectedOption = useMemo(() => 
    options.find(opt => opt.code === value), 
    [options, value]
  );

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset search when opening
  useEffect(() => {
    if (isOpen) setSearch("");
  }, [isOpen]);

  return (
    <div className="flex-1 flex flex-col gap-2 relative" ref={containerRef}>
      <label className="text-[10px] font-black uppercase tracking-widest text-text-4 ml-1">{label}</label>
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        className={cn(
          "w-full flex items-center justify-between px-4 py-4 bg-bg border border-border rounded-xl transition-all text-left",
          isOpen ? "ring-2 ring-blue border-transparent" : "hover:border-blue/30"
        )}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue/5 border border-blue/10 flex items-center justify-center text-blue shrink-0">
             <span className="text-[10px] font-black">{value}</span>
          </div>
          <div className="min-w-0">
            <div className="text-sm font-bold text-text truncate">{value}</div>
            <div className="text-[10px] text-text-4 font-medium truncate uppercase tracking-tighter">
              {selectedOption?.name || "Select Currency"}
            </div>
          </div>
        </div>
        <ChevronDown className={cn("w-4 h-4 text-text-4 transition-transform duration-300", isOpen && "rotate-180")} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <m.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 400 }}
            className="absolute top-full left-0 right-0 z-[100] mt-2 bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[380px]"
          >
            {/* Search Header */}
            <div className="p-3 bg-bg/50 border-b border-border sticky top-0 z-10 backdrop-blur-sm">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-4" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search currencies..."
                  className="w-full pl-9 pr-4 py-2.5 bg-surface border border-border rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue outline-none transition-all"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* List */}
            <div className="overflow-y-auto p-2 space-y-1 custom-scrollbar">
              {filteredOptions.length === 0 ? (
                <div className="py-8 text-center text-text-4 text-[10px] font-black uppercase tracking-widest">
                  No match found
                </div>
              ) : (
                <>
                  {/* Prioritized/Search items */}
                  {filteredOptions.map((opt) => {
                    const isPopular = popularCodes.includes(opt.code) && !search;
                    return (
                      <button
                        key={opt.code}
                        onClick={() => {
                          onChange(opt.code);
                          setIsOpen(false);
                        }}
                        className={cn(
                          "w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-left group",
                          value === opt.code 
                            ? "bg-blue text-white shadow-lg shadow-blue/20" 
                            : "hover:bg-bg"
                        )}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black flex-shrink-0 border",
                            value === opt.code 
                              ? "bg-white/20 border-white/10" 
                              : "bg-surface border-border"
                          )}>
                            {opt.code}
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold truncate">
                              {opt.code}
                              {isPopular && (
                                <span className="ml-1.5 inline-flex items-center gap-0.5 px-1 py-0.5 rounded bg-blue/10 text-blue text-[7px] font-black uppercase tracking-tighter">
                                  Top
                                </span>
                              )}
                            </div>
                            <div className={cn(
                              "text-[9px] truncate font-medium uppercase tracking-tighter",
                              value === opt.code ? "text-white/70" : "text-text-4"
                            )}>
                              {opt.name}
                            </div>
                          </div>
                        </div>
                        {value === opt.code && <Check className="w-3 h-3 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </>
              )}
            </div>

            {/* Footer Tip */}
            {!search && (
              <div className="px-4 py-2 bg-bg/30 border-t border-border flex items-center gap-2">
                <Globe className="w-2.5 h-2.5 text-text-4" />
                <span className="text-[8px] font-black text-text-4 uppercase tracking-[0.1em]">
                  {options.length} world currencies available
                </span>
              </div>
            )}
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
