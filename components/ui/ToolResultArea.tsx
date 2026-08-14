"use client";

import React from "react";
import { CopyButton } from "./CopyButton";
import { useToast } from "./Toast";
import { useObjectUrlManager } from "@/src/lib/hooks";
import { cn } from "@/src/lib/utils";

interface ToolResultAreaProps {
  label: string;
  value: string;
  onClear?: (() => void) | undefined;
  onDownload?: (() => void) | undefined;
  downloadFilename?: string | undefined;
  downloadMimeType?: string | undefined;
  error?: string | undefined;
  language?: string | undefined;
  className?: string | undefined;
  contentClassName?: string | undefined;
}

export function ToolResultArea({ 
  label, 
  value, 
  onClear, 
  onDownload,
  downloadFilename,
  downloadMimeType,
  error,
  language,
  className,
  contentClassName
}: ToolResultAreaProps) {
  const { toast } = useToast();
  const { createUrl, revokeUrl } = useObjectUrlManager();

  const handleDownload = () => {
    if (!value) return;
    if (onDownload) {
      onDownload();
      return;
    }
    const blob = new Blob([value], { type: downloadMimeType || "text/plain" });
    const url = createUrl(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = downloadFilename || `result-${Date.now()}.txt`;
    a.click();
    revokeUrl(url);
    toast("Download started");
  };

  return (
    <div className={cn("space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300 flex flex-col h-full", className)}>
      <div className="flex items-center justify-between">
        <div className="text-sm font-bold text-text-2 flex items-center gap-2">
          {label}
          {language && <span className="px-2 py-1 bg-blue/10 text-blue text-xs uppercase font-black tracking-widest rounded-lg">{language}</span>}
        </div>
        <div className="flex items-center gap-2">
          {onClear && (
            <button
              onClick={onClear}
              className="min-w-11 min-h-11 flex items-center justify-center text-text-4 hover:text-red-500 transition-colors rounded-lg focus-visible:ring-2 focus-visible:ring-red-500/20 outline-none"
              title="Clear"
              aria-label={`Clear ${label}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
          {onDownload && (
            <button
              onClick={handleDownload}
              className="min-w-11 min-h-11 flex items-center justify-center text-text-4 hover:text-blue transition-colors rounded-lg focus-visible:ring-2 focus-visible:ring-blue/20 outline-none"
              title="Download"
              aria-label={`Download ${label}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          )}
          <CopyButton text={value} aria-label={`Copy ${label}`} />
        </div>
      </div>

      {error ? (
        <div 
          role="alert"
          aria-live="assertive"
          className="w-full px-4 py-3 bg-error/5 border border-error/20 rounded-xl text-error text-sm font-medium"
        >
          {error}
        </div>
      ) : (
        <div className="relative group flex-1 flex flex-col">
          <div 
            aria-live="polite"
            role="region"
            aria-label={`${label} result`}
            tabIndex={0}
            className={cn("w-full flex-1 min-h-30 px-4 py-4 bg-bg border border-border rounded-xl font-mono text-sm text-text break-all whitespace-pre-wrap leading-relaxed ring-offset-bg focus-within:ring-2 focus-within:ring-blue/10 outline-none focus:border-blue overflow-auto", contentClassName)}
          >
            {value || <span className="text-text-4 italic" aria-hidden="true">Result will appear here...</span>}
            {!value && <span className="sr-only">Result will appear here.</span>}
          </div>
        </div>
      )}
    </div>
  );
}
