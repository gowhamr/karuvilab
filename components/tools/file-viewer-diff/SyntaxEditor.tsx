"use client";

import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { cn } from '@/src/lib/utils';
import { highlightCode } from '@/src/lib/highlight';
import { Info, Copy, Check } from 'lucide-react';
import DOMPurify from 'isomorphic-dompurify';
import { m, AnimatePresence, useReducedMotion } from 'framer-motion';

interface SyntaxEditorProps {
  value: string;
  onChange?: (value: string) => void;
  language: string;
  className?: string;
  wordWrap?: boolean;
  fontSize?: number;
  readOnly?: boolean;
  showLineNumbers?: boolean;
}

export function SyntaxEditor({
  value,
  onChange,
  language,
  className,
  wordWrap = true,
  fontSize = 13,
  readOnly = false,
  showLineNumbers = true,
}: SyntaxEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  
  const [hoveredLine, setHoveredLine] = useState<number | null>(null);
  const [copiedLine, setCopiedLine] = useState<number | null>(null);

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

  useEffect(() => {
    if (textareaRef.current && preRef.current && lineNumbersRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
      preRef.current.scrollLeft = textareaRef.current.scrollLeft;
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  }, [value]);

  const isTooLarge = value.length > 100000;
  const [isHighlighting, setIsHighlighting] = useState(false);

  const highlighted = useMemo(() => {
    if (isTooLarge || !value) return "";
    // Simulate highlighting delay if needed, but here it's sync
    return highlightCode(value, language);
  }, [value, language, isTooLarge]);

  const lines = useMemo(() => value.split('\n'), [value]);
  const lineCount = lines.length;

  const copyLine = useCallback((lineText: string, index: number) => {
    navigator.clipboard.writeText(lineText);
    setCopiedLine(index);
    setTimeout(() => setCopiedLine(null), 2000);
  }, []);

  if (!value && !readOnly) {
    return (
      <m.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center h-full min-h-[400px] bg-surface border border-dashed border-border rounded-4xl text-center p-12"
      >
        <div className="w-16 h-16 bg-bg rounded-2xl flex items-center justify-center mb-6 shadow-sm">
          <Copy className="w-8 h-8 text-text-4" />
        </div>
        <h3 className="text-xl font-black text-text mb-2 tracking-tight">Drop a file to begin</h3>
        <p className="text-sm text-text-4 max-w-[240px] leading-relaxed">
          Paste your code or drag a file here to view with syntax highlighting.
        </p>
      </m.div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-[400px] space-y-3 group/editor">
      {isTooLarge && (
        <m.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[10px] text-amber-600 font-black uppercase tracking-[0.15em]"
        >
          <Info className="w-4 h-4" />
          Performance Mode: Syntax highlighting disabled for large files (&gt;100KB)
        </m.div>
      )}

      <div 
        className={cn(
          "relative font-mono rounded-2xl border border-border bg-bg overflow-hidden flex flex-1 shadow-inner", 
          className
        )} 
        style={{ fontSize, fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}
      >
        {/* Line Numbers Gutter */}
        {showLineNumbers && (
          <div 
            ref={lineNumbersRef}
            className="bg-surface/50 border-r border-border text-text-4 text-right py-4 px-4 select-none flex-shrink-0 min-w-[4rem] hidden sm:block overflow-hidden sticky left-0 z-10"
          >
            {lines.map((_, i) => (
              <div 
                key={i} 
                className={cn(
                  "leading-7 h-7 pr-1 transition-colors duration-200",
                  hoveredLine === i ? "text-blue font-bold" : "opacity-40"
                )}
              >
                {i + 1}
              </div>
            ))}
          </div>
        )}

        <div className="relative flex-1 overflow-hidden">
          {/* Shimmer Loading State */}
          <AnimatePresence>
            {isHighlighting && !shouldReduceMotion && (
              <m.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-20 pointer-events-none"
              >
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={i} className="h-7 w-full px-4 py-2">
                    <div className="h-full bg-surface-2 rounded shimmer-wrapper opacity-20" style={{ width: `${Math.random() * 60 + 20}%` }} />
                  </div>
                ))}
              </m.div>
            )}
          </AnimatePresence>

          {/* Highlighted Layer */}
          {!isTooLarge && (
            <pre
              ref={preRef}
              aria-hidden="true"
              className={cn(
                "absolute inset-0 m-0 py-4 px-6 pointer-events-none leading-7 whitespace-pre overflow-hidden custom-scrollbar-thin",
                wordWrap ? "whitespace-pre-wrap break-all" : "whitespace-pre"
              )}
              style={{ fontSize: 'inherit', color: 'var(--kv-text)' }}
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(highlighted) + '\n' }}
            />
          )}
          
          {/* Interaction Layer (Overlay for line hover/copy) */}
          <div className="absolute inset-0 pointer-events-none z-10 py-4">
             {lines.map((lineText, i) => (
               <div 
                 key={i} 
                 className={cn(
                   "relative h-7 leading-7 px-6 group/line transition-colors duration-150",
                   hoveredLine === i && "bg-blue/5 border-l-2 border-blue -ml-[2px]"
                 )}
                 onMouseEnter={() => setHoveredLine(i)}
                 onMouseLeave={() => setHoveredLine(null)}
               >
                 {hoveredLine === i && (
                   <button
                     onClick={() => copyLine(lineText, i)}
                     className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 bg-surface border border-border rounded-lg shadow-sm text-text-4 hover:text-blue hover:border-blue transition-all pointer-events-auto active:scale-90"
                     aria-label="Copy line"
                   >
                     {copiedLine === i ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                   </button>
                 )}
               </div>
             ))}
          </div>

          {/* Editor Layer */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            onScroll={handleScroll}
            readOnly={readOnly}
            spellCheck={false}
            className={cn(
              "absolute inset-0 m-0 py-4 px-6 bg-transparent outline-none resize-none leading-7 w-full h-full font-mono overflow-auto custom-scrollbar-thin transition-colors",
              isTooLarge ? "text-text" : "text-transparent caret-blue",
              wordWrap ? "whitespace-pre-wrap break-all" : "whitespace-pre"
            )}
            style={{ fontSize: 'inherit', lineHeight: '1.75rem' }}
            aria-label="Code Editor"
          />
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar-thin::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        .custom-scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar-thin::-webkit-scrollbar-thumb {
          background: var(--kv-border);
          border-radius: 4px;
        }
        .custom-scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: var(--kv-text-muted);
        }
      `}</style>
    </div>
  );
}
