// components/ui/search/SearchResultItem.tsx
import React, { memo } from "react";
import { SearchResult } from "@/src/lib/search/searchEngine";
import { ToolIcon } from "@/components/ui/Icons";
import { cn } from "@/src/lib/utils";
import { CATEGORIES } from "@/src/tool-registry";

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
            <mark key={i} className="bg-transparent text-brand-primary font-black">{part}</mark>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </span>
    );
  };

  const cat = CATEGORIES.find(c => c.id === tool.category.toLowerCase());
  const catHexColor = cat?.color || "#64748B";

  return (
    <button
      onClick={onSelect}
      role="option"
      aria-selected={isFocused}
      className={cn(
        "w-full flex items-center gap-4 p-3 md:p-4 text-left transition-all duration-75 min-h-14 md:min-h-16 border-l-4",
        isFocused 
          ? "bg-surface border-brand-primary shadow-sm z-content" 
          : "bg-transparent border-transparent hover:bg-surface/50"
      )}
     aria-label="Tool">
      <div 
        className={cn(
          "flex-shrink-0 w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center transition-all duration-150",
          isFocused && "bg-brand-primary text-white scale-105 shadow-sm"
        )}
        style={isFocused ? undefined : {
          backgroundColor: `${catHexColor}1a`, // 10% opacity
          color: catHexColor
        }}
      >
        <ToolIcon category={tool.category} toolId={tool.id} className="w-5 h-5" />
      </div>
      
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <span className="text-sm md:text-base font-bold text-text truncate">
            {highlightText(tool.name, query)}
          </span>
          <span className={cn(
            "flex-shrink-0 text-[10px] font-medium uppercase tracking-wider text-text-4 opacity-40 transition-all",
            isFocused && "text-brand-primary opacity-60 font-bold"
          )}>
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
