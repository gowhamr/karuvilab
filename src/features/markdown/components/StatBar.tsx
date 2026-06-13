"use client";

import React from "react";
import { m } from "framer-motion";

interface StatBarProps {
  stats: {
    lines: number;
    words: number;
    chars: number;
    readMin: number;
  };
  goal?: number;
}

export function StatBar({ stats, goal = 500 }: StatBarProps) {
  const progress = Math.min(100, Math.round((stats.words / goal) * 100));

  return (
    <div className="flex flex-wrap items-center gap-4 px-4 py-2 bg-bg/50 border-t border-border text-xs font-bold text-text-4 uppercase tracking-widest">
      <div className="flex items-center gap-1">
        Lines: <span className="text-text">{stats.lines.toLocaleString()}</span>
      </div>
      <div className="flex items-center gap-1">
        Words: <span className="text-text">{stats.words.toLocaleString()}</span>
      </div>
      <div className="flex items-center gap-1">
        Chars: <span className="text-text">{stats.chars.toLocaleString()}</span>
      </div>
      <div className="flex items-center gap-1">
        Reading Time: <span className="text-text">{stats.readMin} min</span>
      </div>
      
      <div className="flex-1 min-w-[120px] flex items-center gap-2 max-w-xs ml-auto">
        <span className="text-tiny">Goal ({goal})</span>
        <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
          <m.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className={`h-full transition-colors ${progress >= 100 ? 'bg-success' : 'bg-blue'}`}
          />
        </div>
        <span className="min-w-[24px] text-right">{progress}%</span>
      </div>
    </div>
  );
}
