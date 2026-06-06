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

  // Detect mobile for modal behavior
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
      if (!isMobile && containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile]);

  // Reset search when opening
  useEffect(() => {
    if (isOpen) setSearch("");
  }, [isOpen]);

  const dropdownContent = (
    <m.div
      initial={{ opacity: 0, y: isMobile ? 20 : 10, scale: isMobile ? 1 : 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: isMobile ? 20 : 10, scale: isMobile ? 1 : 0.95 }}
      transition={{ type: "spring", damping: 25, stiffness: 400 }}
      className={cn(
        "z-[200] bg-surface border border-border shadow-2xl flex flex-col",
        isMobile 
          ? "fixed inset-x-4 top-[10%] bottom-[10%] rounded-[32px] max-h-[80vh]" 
          : "absolute top-full left-0 right-0 mt-2 rounded-2xl max-h-[420px]"
      )}
    >
      {/* Search Header */}
      <div className="p-4 bg-bg/50 border-b border-border sticky top-0 z-10 backdrop-blur-md">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-4" />
          <input
            autoFocus
            type="text"
            placeholder="Search currencies..."
            className="w-full pl-11 pr-4 py-3 bg-surface border border-border rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue outline-none transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* List */}
      <div className="overflow-y-auto p-2 space-y-1 custom-scrollbar flex-1">
        {filteredOptions.length === 0 ? (
          <div className="py-12 text-center text-text-4 text-xs font-black uppercase tracking-widest">
            No currencies found
          </div>
        ) : (
          filteredOptions.map((opt) => {
            const isPopular = popularCodes.includes(opt.code) && !search;
            return (
              <button
                key={opt.code}
                onClick={() => {
                  onChange(opt.code);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all text-left group",
                  value === opt.code 
                    ? "bg-blue text-white shadow-lg shadow-blue/20" 
                    : "hover:bg-bg"
                )}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0 border transition-colors",
                    value === opt.code 
                      ? "bg-white/20 border-white/10" 
                      : "bg-surface border-border group-hover:border-blue/20"
                  )}>
                    {opt.code}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold truncate flex items-center gap-2">
                      {opt.code}
                      {isPopular && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-blue/10 text-blue text-[7px] font-black uppercase tracking-tighter">
                          Top
                        </span>
                      )}
                    </div>
                    <div className={cn(
                      "text-[10px] truncate font-medium uppercase tracking-tighter",
                      value === opt.code ? "text-blue-light" : "text-text-4"
                    )}>
                      {opt.name}
                    </div>
                  </div>
                </div>
                {value === opt.code && <Check className="w-4 h-4 flex-shrink-0" />}
              </button>
            );
          })
        )}
      </div>

      {/* Footer Info */}
      <div className="px-6 py-3 bg-bg/30 border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="w-3 h-3 text-text-4" />
          <span className="text-[9px] font-black text-text-4 uppercase tracking-widest">
            {options.length} Assets Available
          </span>
        </div>
        {isMobile && (
          <button 
            onClick={() => setIsOpen(false)}
            className="text-[9px] font-black text-blue uppercase tracking-widest hover:underline"
          >
            Close
          </button>
        )}
      </div>
    </m.div>
  );

  return (
    <div className="flex-1 flex flex-col gap-3 relative" ref={containerRef}>
      <label className="text-[10px] font-black uppercase tracking-widest text-text-4 ml-1">{label}</label>
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        className={cn(
          "w-full flex items-center justify-between px-5 py-5 bg-bg border border-border rounded-2xl transition-all text-left group",
          isOpen ? "ring-4 ring-blue/10 border-blue shadow-lg" : "hover:border-blue/30"
        )}
      >
        <div className="flex items-center gap-4">
          <div className={cn(
            "w-10 h-10 rounded-xl border flex items-center justify-center transition-all",
            isOpen ? "bg-blue text-white border-blue shadow-lg shadow-blue/20" : "bg-blue/5 border-blue/10 text-blue"
          )}>
             <span className="text-xs font-black">{value}</span>
          </div>
          <div className="min-w-0">
            <div className="text-base font-black text-text truncate tracking-tight">{value}</div>
            <div className="text-[10px] text-text-4 font-bold truncate uppercase tracking-widest">
              {selectedOption?.name || "Select Currency"}
            </div>
          </div>
        </div>
        <ChevronDown className={cn("w-5 h-5 text-text-4 transition-transform duration-500", isOpen && "rotate-180")} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for depth and closing */}
            <m.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[150] bg-black/40 backdrop-blur-sm"
            />
            {dropdownContent}
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
