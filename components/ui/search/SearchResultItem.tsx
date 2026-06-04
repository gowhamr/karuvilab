// components/ui/search/SearchResultItem.tsx
import React, { memo } from "react";
import { SearchResult } from "@/src/lib/search/searchEngine";
import { ToolIcon } from "@/components/ui/Icons";
import { cn } from "@/src/lib/utils";

interface SearchResultItemProps {
  result: SearchResult;
  isFocused: boolean;
  onSelect: () => void;
  query: string;
}

export const SearchResultItem = memo(function SearchResultItem({
  result,
  isFocused,
  onSelect,
  query,
}: SearchResultItemProps) {
  const { tool } = result;

  // Simple highlighter function for exact query matches
  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) {
      return <span>{text}</span>;
    }
    const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return (
      <span>
        {parts.map((part, i) => 
          regex.test(part) ? (
            <mark key={i} className="bg-transparent text-blue font-black">{part}</mark>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </span>
    );
  };

  return (
    <button
      onClick={onSelect}
      role="option"
      aria-selected={isFocused}
      className={cn(
        "w-full flex items-center gap-4 p-3 md:p-4 text-left transition-all duration-75 min-h-[56px] md:min-h-[64px] border-l-4",
        isFocused 
          ? "bg-surface border-blue shadow-sm z-10" 
          : "bg-transparent border-transparent hover:bg-surface/50"
      )}
    >
      <div className={cn(
        "flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-colors",
        isFocused ? "bg-blue/10 text-blue" : "bg-bg text-text-3"
      )}>
        <ToolIcon category={tool.category} toolId={tool.id} className="w-5 h-5 md:w-6 md:h-6" />
      </div>
      
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <span className="text-sm md:text-base font-bold text-text truncate">
            {highlightText(tool.name, query)}
          </span>
          <span className="flex-shrink-0 text-[10px] md:text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-bg text-text-4">
            {tool.category}
          </span>
        </div>
        <span className="text-xs md:text-sm text-text-4 truncate">
          {tool.desc}
        </span>
      </div>
    </button>
  );
});
