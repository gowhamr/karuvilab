"use client";

import React, { useRef, useEffect, useMemo } from 'react';
import { cn } from '@/src/lib/utils';
import { DiffLine } from '@/src/workers/types';

interface DiffViewerProps {
  diff: DiffLine[];
  className?: string;
}

export function DiffViewer({ diff, className }: DiffViewerProps) {
  const [visibleCount, setVisibleCount] = React.useState(1000);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  // Sync scroll
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const other = e.currentTarget === leftRef.current ? rightRef.current : leftRef.current;
    if (other) {
      other.scrollTop = e.currentTarget.scrollTop;
      other.scrollLeft = e.currentTarget.scrollLeft;
    }
  };

  const leftLines = useMemo(() => diff.filter(d => d.type !== 'added'), [diff]);
  const rightLines = useMemo(() => diff.filter(d => d.type !== 'removed'), [diff]);

  // Actually, side-by-side usually needs to align lines. 
  // Let's use a table-based layout for simpler alignment.
  
  return (
    <div className={cn("bg-surface border border-border rounded-2xl overflow-hidden flex flex-col font-mono text-xs", className)}>
      <div className="flex bg-bg border-b border-border px-4 py-2 justify-between items-center text-[10px] font-black uppercase tracking-widest text-text-4">
        <div className="flex-1">Original</div>
        <div className="w-px h-4 bg-border mx-4" />
        <div className="flex-1">Modified</div>
      </div>
      
      <div 
        className="overflow-auto max-h-[600px] overscroll-contain"
        style={{ contentVisibility: 'auto', containIntrinsicSize: '0 600px' } as any}
      >
        <table className="w-full border-collapse">
          <tbody>
            {diff.slice(0, visibleCount).map((line, i) => (
              <tr key={i} className={cn(
                "group hover:bg-blue/5 transition-colors",
                line.type === 'added' ? "bg-green-500/10" : line.type === 'removed' ? "bg-red-500/10" : ""
              )}>
                {/* Left Side */}
                <td className="w-10 px-2 text-right text-text-4 border-r border-border select-none bg-surface/50">
                  {line.lineA || ""}
                </td>
                <td className="px-4 py-0.5 whitespace-pre min-w-[50%] border-r border-border">
                  {line.type !== 'added' ? line.text : ""}
                </td>
                
                {/* Right Side */}
                <td className="w-10 px-2 text-right text-text-4 border-r border-border select-none bg-surface/50">
                  {line.lineB || ""}
                </td>
                <td className="px-4 py-0.5 whitespace-pre min-w-[50%]">
                  {line.type !== 'removed' ? line.text : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {diff.length > visibleCount && (
          <div className="p-4 flex flex-col items-center gap-2 bg-bg/50 border-t border-border">
            <p className="text-[10px] text-text-4 uppercase font-bold">
              Showing {visibleCount} of {diff.length} lines for performance
            </p>
            <button 
              onClick={() => setVisibleCount(prev => prev + 2000)}
              className="px-6 py-2 bg-blue text-white text-[10px] font-black uppercase rounded-full hover:scale-105 active:scale-95 transition-all"
            >
              Load 2,000 more lines
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
