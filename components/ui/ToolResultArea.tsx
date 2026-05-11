"use client";

import React from "react";
import { CopyButton } from "./CopyButton";
import { useToast } from "./Toast";

interface ToolResultAreaProps {
  label: string;
  value: string;
  onClear?: () => void;
  onDownload?: () => void;
  error?: string;
  language?: string;
}

export function ToolResultArea({ 
  label, 
  value, 
  onClear, 
  onDownload, 
  error,
  language
}: ToolResultAreaProps) {
  const { toast } = useToast();

  const handleDownload = () => {
    if (!value) return;
    const blob = new Blob([value], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `result-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast("Download started");
    onDownload?.();
  };

  return (
    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center justify-between">
        <div className="text-sm font-bold text-text-2 flex items-center gap-2">
          {label}
          {language && <span className="px-2 py-0.5 bg-blue/10 text-blue text-[10px] uppercase tracking-widest rounded-md font-black">{language}</span>}
        </div>
        <div className="flex items-center gap-2">
          {onClear && (
            <button
              onClick={onClear}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center text-text-4 hover:text-red-500 transition-colors rounded-lg"
              title="Clear"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
          {onDownload && (
            <button
              onClick={handleDownload}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center text-text-4 hover:text-blue transition-colors rounded-lg"
              title="Download"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          )}
          <CopyButton text={value} />
        </div>
      </div>

      {error ? (
        <div 
          role="alert"
          className="w-full px-4 py-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-xl text-red-600 dark:text-red-400 text-sm font-medium"
        >
          {error}
        </div>
      ) : (
        <div className="relative group">
          <div className="absolute inset-0 bg-blue/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          <div 
            aria-live="polite"
            className="w-full min-h-[120px] px-4 py-4 bg-bg border border-border rounded-xl font-mono text-sm text-text break-all whitespace-pre-wrap leading-relaxed ring-offset-bg focus-within:ring-2 focus-within:ring-blue/10"
          >
            {value || <span className="text-text-4 italic">Result will appear here...</span>}
          </div>
        </div>
      )}
    </div>
  );
}
