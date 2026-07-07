"use client";
import { useState } from "react";
import { useToast } from "./Toast";
import { m } from "framer-motion";

export function CopyButton({ 
  text, 
  label = "Copy", 
  className,
  disabled 
}: { 
  text: string; 
  label?: string; 
  className?: string;
  disabled?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    if (disabled) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast("Failed to copy", "error");
    }
  };

  const motionProps = !disabled ? {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.95 }
  } : {};

  return (
    <m.button
      {...motionProps}
      onClick={handleCopy}
      disabled={disabled}
      aria-label={copied ? "Copied!" : label.toLowerCase().startsWith("copy") ? label : `Copy ${label}`}
      className={`
        min-h-11 px-3 py-2 text-sm font-bold rounded-lg transition-all border outline-none focus-visible:ring-2 focus-visible:ring-blue/20
        ${copied ? "bg-green-500/10 border-green-500/30 text-green-600" : "bg-surface border-border hov:border-blue hov:text-blue"}
        ${disabled ? "opacity-40 cursor-not-allowed grayscale" : ""}
        ${className || ""}
      `}
    >
      <div className="flex items-center gap-2">
        {copied ? (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
        )}
        <span aria-hidden="true">{copied ? "Copied!" : label}</span>
        <span className="sr-only" aria-live="polite">
          {copied ? "Copied to clipboard" : ""}
        </span>
      </div>
    </m.button>
  );
}
