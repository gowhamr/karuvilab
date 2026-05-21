"use client";

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { cn } from '@/src/lib/utils';
import { highlightCode } from '@/src/lib/highlight';

interface SyntaxEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  className?: string;
  wordWrap?: boolean;
  fontSize?: number;
  readOnly?: boolean;
}

export function SyntaxEditor({
  value,
  onChange,
  language,
  className,
  wordWrap = true,
  fontSize = 14,
  readOnly = false,
}: SyntaxEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  
  // Sync scroll
  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (preRef.current) {
      preRef.current.scrollTop = e.currentTarget.scrollTop;
      preRef.current.scrollLeft = e.currentTarget.scrollLeft;
    }
  };

  const isTooLarge = value.length > 100000; // 100KB threshold
  const highlighted = useMemo(() => {
    if (isTooLarge) return highlightCode(value.slice(0, 1000) + "\n... [Highlighting disabled for large file for performance] ...", language);
    return highlightCode(value, language);
  }, [value, language, isTooLarge]);

  const lineCount = useMemo(() => value.split('\n').length, [value]);

  return (
    <div className={cn("relative font-mono rounded-xl border border-border bg-bg overflow-hidden flex", className)} style={{ fontSize }}>
      {/* Line Numbers */}
      <div className="bg-surface border-r border-border text-text-4 text-right py-4 px-3 select-none flex-shrink-0 min-w-[3rem] hidden sm:block">
        <div className="leading-6 overflow-hidden" style={{ height: lineCount * 24 }}>
          {Array.from({ length: Math.min(lineCount, 1000) }).map((_, i) => (
            <div key={i} className="h-6">{i + 1}</div>
          ))}
          {lineCount > 1000 && <div className="h-6">...</div>}
        </div>
      </div>

      <div className="relative flex-1 overflow-hidden">
        <pre
          ref={preRef}
          aria-hidden="true"
          className={cn(
            "absolute inset-0 m-0 py-4 px-4 pointer-events-none leading-6 whitespace-pre",
            wordWrap ? "whitespace-pre-wrap break-all" : "whitespace-pre overflow-auto"
          )}
          dangerouslySetInnerHTML={{ __html: highlighted + '\n' }}
        />
        
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onScroll={handleScroll}
          readOnly={readOnly}
          spellCheck={false}
          className={cn(
            "absolute inset-0 m-0 py-4 px-4 bg-transparent text-transparent caret-text outline-none resize-none leading-6 w-full h-full font-mono",
            wordWrap ? "whitespace-pre-wrap break-all" : "whitespace-pre"
          )}
          aria-label="Code Editor"
        />
      </div>
    </div>
  );
}
