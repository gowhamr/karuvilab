// components/ui/search/SearchOverlay.tsx
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { searchTools } from '@/src/lib/search/searchEngine';
import { searchSystemActions } from '@/src/lib/search/systemActions';
import { useSearchStore } from '@/src/store/useSearchStore';
import { useFavoriteStore } from '@/src/store/useFavoriteStore';
import { ALL_TOOLS } from '@/src/tool-registry';
import { SearchResults } from './SearchResults';
import { Search, X, Clipboard } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import { supportsBlur } from '@/src/lib/deviceCapability';
import { cn } from "@/src/lib/utils";
import { useFocusTrap } from '@/src/lib/a11y/useFocusTrap';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

export function SearchOverlay({ isOpen, onClose, initialQuery = "" }: SearchOverlayProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  useFocusTrap(containerRef, isOpen);
  const [blurEnabled, setBlurEnabled] = useState(false);
  
  const [query, setQuery] = useState(initialQuery);
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

  const favorites = useFavoriteStore(s => s.favorites);

  // Compute favorite tools
  const favoriteTools = useMemo(() => {
    return favorites
      .map(id => ALL_TOOLS.find((t: any) => t.id === id))
      .filter(Boolean) as any[];
  }, [favorites]);

  // Compute popular tools for zero-state
  const popularTools = useMemo(() => {
    return Object.entries(popularToolsMap)
      .sort((a, b) => b[1] - a[1])
      .filter(([id]) => !favorites.includes(id)) // Don't duplicate favorites in popular
      .slice(0, 8)
      .map(([id]) => ALL_TOOLS.find((t: any) => t.id === id))
      .filter(Boolean) as any[];
  }, [popularToolsMap, favorites]);

  // Check if system command
  const isSystemAction = query.trim().startsWith('>');
  const systemActions = useMemo(() => isSystemAction ? searchSystemActions(query) : [], [query, isSystemAction]);

  // Execute search (synchronous, fast)
  const results = useMemo(() => isSystemAction ? [] : searchTools(query), [query, isSystemAction]);

  const handleSystemAction = (actionId: string) => {
    const action = systemActions.find(a => a.id === actionId);
    if (action) {
      action.action();
      onClose();
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]!;
      setQuery(`> process ${file.name}`);
      // Wait for a bit to let the query update visually before auto-routing
      setTimeout(async () => {
        // Auto-detect based on extension or mime
        const ext = file.name.split('.').pop()?.toLowerCase();
        let toolId = 'all-tools';
        if (ext === 'pdf') toolId = 'pdf-tools';
        else if (['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(ext || '')) toolId = 'image-tools';
        else if (ext === 'json') toolId = 'json-formatter';
        else if (ext === 'csv') toolId = 'csv-json-converter';
        else if (ext === 'xml') toolId = 'xml-formatter';
        else if (ext === 'sql') toolId = 'sql-formatter';
        
        const tool = ALL_TOOLS.find((t: any) => t.id === toolId || t.href.includes(toolId));
        if (tool) {
           router.push(`/${tool.href}`);
           onClose();
        }
      }, 500);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  useEffect(() => {
    if (isOpen) {
      Promise.resolve().then(() => {
        setBlurEnabled(supportsBlur());
        setQuery('');
        setFocusedIndex(-1);
      });
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
    const tool = ALL_TOOLS.find((t: any) => t.id === toolId);
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

    const totalItems = isSystemAction ? systemActions.length : results.length;
    if (!query.trim() && totalItems === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex(prev => (prev < totalItems - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (isSystemAction) {
        if (focusedIndex >= 0 && focusedIndex < systemActions.length) {
          handleSystemAction(systemActions[focusedIndex]!.id);
        } else if (systemActions.length > 0) {
          handleSystemAction(systemActions[0]!.id);
        }
      } else {
        if (focusedIndex >= 0 && focusedIndex < results.length && results[focusedIndex]) {
          handleSelect(results[focusedIndex]!.tool.id);
        } else if (results.length > 0 && results[0]) {
          handleSelect(results[0]!.tool.id);
        }
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
      {/* NOTE: z-modal shared across modal overlays (SearchOverlay, QRModal, TimezoneSearchModal, SessionRestoredBanner). Safe because only one modal renders at a time. */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-modal-backdrop bg-mat-base/80 sm:bg-black/85 sm:backdrop-blur-md cursor-pointer"
            onClick={onClose}
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-modal flex flex-col sm:p-4 md:p-12 lg:p-24 pointer-events-none">
              <m.div
              role="dialog"
              aria-modal="true"
              aria-label="Search tools"
              ref={containerRef}
              initial={{ y: -8, scale: 0.98 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: -8, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={cn(
                "flex-1 sm:flex-none flex flex-col pointer-events-auto",
                "w-full overflow-hidden",
                "bg-mat-base sm:bg-mat-surface",
                "sm:rounded-2xl sm:max-w-2xl sm:mx-auto",
                "sm:max-h-full",
                "sm:border sm:border-mat-border sm:shadow-2xl"
              )}
              onClick={e => e.stopPropagation()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              {/* Search Input Header */}
              <div className="flex-shrink-0 flex items-center h-14 px-4 border-b border-mat-border bg-mat-surface">
                {isSystemAction ? (
                  <span className="text-xl font-bold text-brand-primary mr-2" aria-hidden="true">{'>'}</span>
                ) : (
                  <Search className="w-5 h-5 text-text-muted shrink-0" aria-hidden="true" />
                )}
                <input
                  ref={inputRef}
                  id="search-overlay-input"
                  role="combobox"
                  aria-autocomplete="list"
                  aria-expanded={results.length > 0 || isSystemAction}
                  aria-haspopup="listbox"
                  aria-controls="search-results-list"
                  aria-activedescendant={focusedIndex >= 0 ? `search-result-${focusedIndex}` : undefined}
                  value={query}
                  onChange={e => {
                    setQuery(e.target.value);
                    setFocusedIndex(-1);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Search 100+ tools..."
                  className="flex-1 h-full bg-transparent border-none outline-none text-base font-medium text-text placeholder:text-text-muted px-3"
                  autoComplete="off"
                  spellCheck={false}
                  autoCorrect="off"
                />
                {!query && (
                  <button
                    onClick={async () => {
                      try {
                        const text = await navigator.clipboard.readText();
                        if (text) {
                          setQuery(text);
                          setFocusedIndex(-1);
                        }
                      } catch {}
                    }}
                    aria-label="Paste from clipboard"
                    className="flex items-center gap-1 min-h-11 px-2.5 py-1 text-xs font-bold text-blue hover:bg-blue/5 rounded-lg transition-colors mr-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue"
                  >
                    <Clipboard className="w-3.5 h-3.5" aria-hidden="true" />
                    <span className="hidden sm:inline">Paste</span>
                  </button>
                )}
                {query && (
                  <button
                    onClick={() => { setQuery(''); const input = inputRef.current; if(input) input.focus(); }}
                    className="w-11 h-11 flex items-center justify-center text-text-muted hover:text-text rounded-full transition-colors"
                    aria-label="Clear search query"
                  >
                    <X className="w-4 h-4" aria-hidden="true" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  aria-label="Cancel search"
                  className="sm:hidden min-w-11 min-h-11 flex items-center justify-center text-sm font-semibold text-brand-primary ml-1"
                >
                  Cancel
                </button>
                <div className="hidden sm:flex items-center justify-center w-10 h-10">
                  <kbd className="px-2 py-1 bg-bg border border-border rounded text-xs font-mono font-bold text-text-4 uppercase">Esc</kbd>
                </div>
              </div>

              {/* Results Area */}
              <div className="flex-1 overflow-y-auto overscroll-contain bg-mat-base sm:bg-transparent">
                {isSystemAction ? (
                  <div className="py-2" role="listbox">
                    {systemActions.map((action, index) => (
                      <button
                        key={action.id}
                        onClick={() => handleSystemAction(action.id)}
                        role="option"
                        aria-selected={index === focusedIndex}
                        className={cn(
                          "w-full flex items-center gap-4 p-3 md:p-4 text-left transition-all duration-75 min-h-14 border-l-4",
                          index === focusedIndex 
                            ? "bg-surface border-brand-primary shadow-sm" 
                            : "bg-transparent border-transparent hover:bg-surface/50"
                        )}
                      >
                        <div className={cn(
                          "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-150",
                          index === focusedIndex ? "bg-brand-primary text-white scale-105 shadow-sm" : "bg-brand-primary/10 text-brand-primary"
                        )}>
                          <span className="text-xl">⚡</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-sm md:text-base font-bold text-text truncate">
                            {action.name}
                          </span>
                        </div>
                      </button>
                    ))}
                    {systemActions.length === 0 && (
                      <div className="p-8 text-center text-text-4">No system actions found.</div>
                    )}
                  </div>
                ) : (
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
                    favoriteTools={favoriteTools}
                  />
                )}
              </div>

              {/* Footer Hints (Desktop only) */}
              <div className="hidden sm:flex flex-shrink-0 items-center justify-center h-10 border-t border-mat-border bg-mat-surface/30 gap-4 text-xs font-bold text-text-4 uppercase tracking-widest">
                 <span className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 bg-mat-base border border-mat-border rounded">↑↓</kbd> Navigate</span>
                 <span className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 bg-mat-base border border-mat-border rounded">↵</kbd> Open</span>
                 <span className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 bg-mat-base border border-mat-border rounded">F11</kbd> Focus Mode</span>
                 <span className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 bg-mat-base border border-mat-border rounded">Esc</kbd> Close</span>
              </div>
            </m.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
