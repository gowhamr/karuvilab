"use client";

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { cn } from '@/src/lib/utils';
import { highlightCode } from '@/src/lib/highlight';
import { Info } from 'lucide-react';

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
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  
  // Sync scroll
  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    const { scrollTop, scrollLeft } = e.currentTarget;
    if (preRef.current) {
      preRef.current.scrollTop = scrollTop;
      preRef.current.scrollLeft = scrollLeft;
    }
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = scrollTop;
    }
  };

  // Sync line numbers and pre on initial mount and value change
  useEffect(() => {
    if (textareaRef.current && preRef.current && lineNumbersRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
      preRef.current.scrollLeft = textareaRef.current.scrollLeft;
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  }, [value]);

  const isTooLarge = value.length > 100000; // 100KB threshold
  const highlighted = useMemo(() => {
    if (isTooLarge) return "";
    return highlightCode(value, language);
  }, [value, language, isTooLarge]);

  const lines = useMemo(() => value.split('\n'), [value]);
  const lineCount = lines.length;
  const lineNumbersString = useMemo(() => {
    return Array.from({ length: Math.min(lineCount, 5000) }).map((_, i) => i + 1).join('\n') + (lineCount > 5000 ? '\n...' : '');
  }, [lineCount]);

  return (
    <div className="flex flex-col h-full min-h-[300px] space-y-2 text-text">
      {isTooLarge && (
        <div className="flex items-center gap-2 px-4 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg text-[10px] text-amber-600 font-bold uppercase tracking-wider">
          <Info className="w-3.5 h-3.5" />
          Syntax highlighting disabled for performance (file &gt; 100KB)
        </div>
      )}
      <div className={cn("relative font-mono rounded-xl border border-border bg-bg overflow-hidden flex flex-1", className)} style={{ fontSize }}>
        {/* Line Numbers */}
        <div 
          ref={lineNumbersRef}
          className="bg-surface border-r border-border text-text-4 text-right py-4 px-3 select-none flex-shrink-0 min-w-[3.5rem] hidden sm:block overflow-hidden"
        >
          <pre className="leading-6 m-0 whitespace-pre opacity-50" style={{ fontSize: 'inherit' }}>
            {lineNumbersString}
          </pre>
        </div>

        <div className="relative flex-1 overflow-hidden">
          {/* Highlighted Layer */}
          {!isTooLarge && (
            <pre
              ref={preRef}
              aria-hidden="true"
              className={cn(
                "absolute inset-0 m-0 py-4 px-4 pointer-events-none leading-6 whitespace-pre overflow-hidden",
                wordWrap ? "whitespace-pre-wrap break-all" : "whitespace-pre"
              )}
              style={{ fontSize: 'inherit' }}
              dangerouslySetInnerHTML={{ __html: highlighted + '\n' }}
            />
          )}
          
          {/* Editor Layer */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onScroll={handleScroll}
            readOnly={readOnly}
            spellCheck={false}
            className={cn(
              "absolute inset-0 m-0 py-4 px-4 bg-transparent outline-none resize-none leading-6 w-full h-full font-mono overflow-auto custom-scrollbar",
              isTooLarge ? "text-text" : "text-transparent caret-text",
              wordWrap ? "whitespace-pre-wrap break-all" : "whitespace-pre"
            )}
            style={{ fontSize: 'inherit' }}
            aria-label="Code Editor"
          />
        </div>
      </div>
    </div>
  );
}
