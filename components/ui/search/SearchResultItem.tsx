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

const CATEGORY_COLORS: Record<string, { bg: string, text: string, darkBg: string, darkText: string }> = {
  calculators: { bg: "bg-emerald-500/10", text: "text-emerald-600", darkBg: "dark:bg-emerald-500/20", darkText: "dark:text-emerald-400" },
  pdf: { bg: "bg-rose-500/10", text: "text-rose-600", darkBg: "dark:bg-rose-500/20", darkText: "dark:text-rose-400" },
  image: { bg: "bg-purple-500/10", text: "text-purple-600", darkBg: "dark:bg-purple-500/20", darkText: "dark:text-purple-400" },
  developer: { bg: "bg-indigo-500/10", text: "text-indigo-600", darkBg: "dark:bg-indigo-500/20", darkText: "dark:text-indigo-400" },
  security: { bg: "bg-amber-500/10", text: "text-amber-600", darkBg: "dark:bg-amber-500/20", darkText: "dark:text-amber-400" },
  utilities: { bg: "bg-teal-500/10", text: "text-teal-600", darkBg: "dark:bg-teal-500/20", darkText: "dark:text-teal-400" },
  seo: { bg: "bg-sky-500/10", text: "text-sky-600", darkBg: "dark:bg-sky-500/20", darkText: "dark:text-sky-400" },
  productivity: { bg: "bg-pink-500/10", text: "text-pink-600", darkBg: "dark:bg-pink-500/20", darkText: "dark:text-pink-400" }
};

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

  const catColor = CATEGORY_COLORS[tool.category.toLowerCase()] || {
    bg: "bg-gray-500/10",
    text: "text-gray-600",
    darkBg: "dark:bg-gray-500/20",
    darkText: "dark:text-gray-400"
  };

  return (
    <button
      onClick={onSelect}
      role="option"
      aria-selected={isFocused}
      className={cn(
        "w-full flex items-center gap-4 p-3 md:p-4 text-left transition-all duration-75 min-h-[56px] md:min-h-[64px] border-l-4",
        isFocused 
          ? "bg-surface border-brand-primary shadow-sm z-10" 
          : "bg-transparent border-transparent hover:bg-surface/50"
      )}
    >
      <div className={cn(
        "flex-shrink-0 w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center transition-all duration-150",
        isFocused 
          ? "bg-brand-primary text-white scale-105 shadow-sm" 
          : cn(catColor.bg, catColor.text, catColor.darkBg, catColor.darkText)
      )}>
        <ToolIcon category={tool.category} toolId={tool.id} className="w-5 h-5" />
      </div>
      
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <span className="text-sm md:text-base font-bold text-text truncate">
            {highlightText(tool.name, query)}
          </span>
          <span className={cn(
            "flex-shrink-0 text-[9px] font-semibold uppercase tracking-wider text-text-4 opacity-60",
            isFocused && "text-brand-primary opacity-90 font-black"
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
