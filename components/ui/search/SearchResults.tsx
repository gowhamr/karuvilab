// components/ui/search/SearchResults.tsx
import React, { memo } from "react";
import { SearchResult } from "@/src/lib/search/searchEngine";
import { SearchResultItem } from "./SearchResultItem";

interface SearchResultsProps {
  results: SearchResult[];
  query: string;
  focusedIndex: number;
  onSelect: (id: string) => void;
  recentQueries?: string[];
  onSelectRecent?: (query: string) => void;
  onRemoveRecent?: (query: string) => void;
  onClearRecent?: () => void;
  popularTools?: any[];
  favoriteTools?: any[];
}

export const SearchResults = memo(function SearchResults({
  results,
  query,
  focusedIndex,
  onSelect,
  recentQueries = [],
  onSelectRecent,
  onRemoveRecent,
  onClearRecent,
  popularTools = [],
  favoriteTools = []
}: SearchResultsProps) {

  if (!query.trim()) {
    return (
      <div className="p-2 space-y-6">
        {favoriteTools.length > 0 && (
          <div className="space-y-3">
            <h3 className="px-4 text-tiny font-bold uppercase tracking-widest-sm text-text-4">Favorites</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 px-2">
              {favoriteTools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => onSelect(tool.id)}
                  className="flex flex-col items-center justify-center gap-2 p-4 h-22 bg-blue/5 hover:bg-blue/10 border border-blue/20 rounded-2xl transition-colors active:scale-95 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-bg flex items-center justify-center text-blue group-hover:scale-110 transition-transform">
                     <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <span className="text-xs font-bold text-text text-center leading-tight truncate w-full px-1">{tool.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {recentQueries.length > 0 && (
          <div className="space-y-1">
            <h3 className="px-4 text-tiny font-bold uppercase tracking-widest-sm text-text-4 mb-2">Recent Searches</h3>
            <div className="space-y-0.5">
              {recentQueries.map((q) => (
                <div key={q} className="flex items-center group">
                  <button 
                    className="flex-1 flex items-center gap-3 px-4 py-3 min-h-11 hover:bg-surface rounded-xl text-sm font-medium text-text-3 hover:text-text transition-colors text-left"
                    onClick={() => onSelectRecent?.(q)}
                  >
                    <svg className="w-4 h-4 text-text-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {q}
                  </button>
                  <button 
                    className="w-11 h-11 flex items-center justify-center text-text-4 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-colors opacity-0 group-hover:opacity-100 md:opacity-100"
                    onClick={(e) => { e.stopPropagation(); onRemoveRecent?.(q); }}
                    aria-label="Remove recent search"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            {recentQueries.length > 0 && (
              <button 
                onClick={onClearRecent}
                className="mx-4 mt-2 text-xs font-bold text-text-4 hover:text-red-500 transition-colors"
              >
                Clear recent
              </button>
            )}
          </div>
        )}

        {popularTools.length > 0 && (
          <div className="space-y-3">
            <h3 className="px-4 text-tiny font-bold uppercase tracking-widest-sm text-text-4">Popular Tools</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 px-2">
              {popularTools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => onSelect(tool.id)}
                  className="flex flex-col items-center justify-center gap-2 p-4 h-22 bg-surface hover:bg-surface-hover border border-border rounded-2xl transition-colors active:scale-95"
                >
                  <div className="w-8 h-8 rounded-lg bg-bg flex items-center justify-center text-text-3">
                     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <span className="text-xs font-bold text-text text-center leading-tight truncate w-full px-1">{tool.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="p-8 text-center space-y-6">
        <div className="w-16 h-16 bg-bg rounded-full flex items-center justify-center mx-auto text-text-4">
           <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10V3L4 14h7v7l9-11h-7z" />
           </svg>
        </div>
        <div>
          <p className="text-text font-bold mb-1">No tools found for "{query}"</p>
          <p className="text-sm text-text-4">Try: compress, convert, merge, or browse all tools.</p>
        </div>
        
        {popularTools.length > 0 && (
          <div className="pt-8 border-t border-border">
            <h3 className="text-tiny font-bold uppercase tracking-widest-sm text-text-4 mb-4 text-left">Suggested Tools</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {popularTools.slice(0, 4).map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => onSelect(tool.id)}
                  className="flex items-center gap-3 p-3 bg-surface hover:bg-surface-hover border border-border rounded-xl transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-bg flex items-center justify-center text-text-3 shrink-0">
                     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <span className="text-sm font-bold text-text truncate">{tool.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Grouping logic based on matchType and score could go here, 
  // but a simple list sorted by score (handled in searchEngine) is often cleaner.
  // We will just render the list flat for performance and simplicity, 
  // relying on the searchEngine's sorting.

  return (
    <div className="py-2" role="listbox">
      {results.map((result, index) => (
        <SearchResultItem
          key={result.tool.id}
          result={result}
          isFocused={index === focusedIndex}
          onSelect={() => onSelect(result.tool.id)}
          query={query}
        />
      ))}
    </div>
  );
});
