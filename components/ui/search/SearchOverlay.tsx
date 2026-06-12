// components/ui/search/SearchOverlay.tsx
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { searchTools } from '@/src/lib/search/searchEngine';
import { useSearchStore } from '@/src/store/useSearchStore';
import { ALL_TOOLS } from '@/src/registry';
import { SearchResults } from './SearchResults';
import { Search, X } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import { supportsBlur } from '@/src/lib/deviceCapability';
import { cn } from "@/src/lib/utils";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [blurEnabled, setBlurEnabled] = useState(false);
  
  const [query, setQuery] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  
  const { 
    recentQueries, 
    popularToolsMap, 
    addRecentQuery, 
    removeRecentQuery, 
    clearRecentQueries, 
    incrementToolVisit 
  } = useSearchStore(useShallow(s => ({
    recentQueries: s.recentQueries,
    popularToolsMap: s.popularTools,
    addRecentQuery: s.addRecentQuery,
    removeRecentQuery: s.removeRecentQuery,
    clearRecentQueries: s.clearRecentQueries,
    incrementToolVisit: s.incrementToolVisit
  })));

  // Compute popular tools for zero-state
  const popularTools = useMemo(() => {
    return Object.entries(popularToolsMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([id]) => ALL_TOOLS.find(t => t.id === id))
      .filter(Boolean) as any[];
  }, [popularToolsMap]);

  // Execute search (synchronous, fast)
  const results = useMemo(() => searchTools(query), [query]);

  // Reset state on open/close
  useEffect(() => {
    if (isOpen) {
      setBlurEnabled(supportsBlur());
      setQuery('');
      setFocusedIndex(-1);
      // Autofocus input
      setTimeout(() => {
        const input = inputRef.current;
        if (input) input.focus();
      }, 50);
    } else {
      const input = inputRef.current;
      if (input) input.blur();
    }
  }, [isOpen]);

  const handleSelect = (toolId: string) => {
    const tool = ALL_TOOLS.find(t => t.id === toolId);
    if (tool) {
      if (query.trim()) addRecentQuery(query);
      incrementToolVisit(toolId);
      router.push(`/${tool.href}`);
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
      return;
    }

    if (!query.trim() && results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (focusedIndex >= 0 && focusedIndex < results.length && results[focusedIndex]) {
        handleSelect(results[focusedIndex]!.tool.id);
      } else if (results.length > 0 && results[0]) {
        handleSelect(results[0]!.tool.id);
      }
    }
  };

  // Prevent background scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {/* NOTE: z-50 shared across modal overlays (SearchOverlay, QRModal, TimezoneSearchModal, SessionRestoredBanner). Safe because only one modal renders at a time. */}
      {isOpen && (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex flex-col bg-mat-base sm:bg-black/85 sm:backdrop-blur-md sm:p-4 md:p-12 lg:p-24"
          onClick={onClose}
        >
          <m.div
            initial={{ y: -8, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: -8, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={cn(
              "flex-1 sm:flex-none flex flex-col",
              "w-full overflow-hidden",
              "bg-mat-base sm:bg-mat-surface",
              "sm:rounded-2xl sm:max-w-2xl sm:mx-auto",
              "sm:max-h-[600px]",
              "sm:border sm:border-mat-border sm:shadow-2xl"
            )}
            onClick={e => e.stopPropagation()}
          >
            {/* Search Input Header */}
            <div className="flex-shrink-0 flex items-center h-[56px] px-4 border-b border-mat-border bg-mat-surface">
              <Search className="w-5 h-5 text-[--kv-text-muted] shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={e => {
                  setQuery(e.target.value);
                  setFocusedIndex(-1);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search 100+ tools..."
                className="flex-1 h-full bg-transparent border-none outline-none text-[16px] font-medium text-[--kv-text] placeholder:text-[--kv-text-muted] px-3"
                autoComplete="off"
                spellCheck={false}
                autoCorrect="off"
              />
              {query && (
                <button
                  onClick={() => { setQuery(''); const input = inputRef.current; if(input) input.focus(); }}
                  className="w-11 h-11 flex items-center justify-center text-[--kv-text-muted] hover:text-[--kv-text] rounded-full transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onClose}
                className="sm:hidden min-w-[44px] min-h-[44px] flex items-center justify-center text-[14px] font-semibold text-brand-primary ml-1"
              >
                Cancel
              </button>
              <div className="hidden sm:flex items-center justify-center w-10 h-10">
                <kbd className="px-2 py-1 bg-bg border border-border rounded text-[10px] font-mono font-bold text-text-4 uppercase">Esc</kbd>
              </div>
            </div>

            {/* Results Area */}
            <div className="flex-1 overflow-y-auto overscroll-contain bg-mat-base sm:bg-transparent">
              <SearchResults
                results={results}
                query={query}
                focusedIndex={focusedIndex}
                onSelect={handleSelect}
                recentQueries={recentQueries}
                onSelectRecent={setQuery}
                onRemoveRecent={removeRecentQuery}
                onClearRecent={clearRecentQueries}
                popularTools={popularTools}
              />
            </div>

            {/* Footer Hints (Desktop only) */}
            <div className="hidden sm:flex flex-shrink-0 items-center justify-center h-10 border-t border-mat-border bg-mat-surface/30 gap-4 text-[10px] font-bold text-text-4 uppercase tracking-widest">
               <span className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 bg-mat-base border border-mat-border rounded">↑↓</kbd> Navigate</span>
               <span className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 bg-mat-base border border-mat-border rounded">↵</kbd> Open</span>
               <span className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 bg-mat-base border border-mat-border rounded">F11</kbd> Focus Mode</span>
               <span className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 bg-mat-base border border-mat-border rounded">Esc</kbd> Close</span>
            </div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
