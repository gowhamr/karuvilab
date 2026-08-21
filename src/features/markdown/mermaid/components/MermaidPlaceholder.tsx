"use client";

import React from "react";
import { Loader2 } from "lucide-react";

interface MermaidPlaceholderProps {
  label?: string;
}

export function MermaidPlaceholder({ label = "Rendering diagram..." }: MermaidPlaceholderProps) {
  return (
    <div className="my-6 p-8 bg-surface border border-border rounded-2xl flex flex-col items-center justify-center gap-3 min-h-36 animate-pulse">
      <Loader2 className="w-6 h-6 text-blue animate-spin" />
      <span className="text-xs font-semibold text-text-4 uppercase tracking-widest">{label}</span>
    </div>
  );
}
