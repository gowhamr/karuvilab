// src/tool-engine/core/ErrorView.tsx
"use client";

import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorViewProps {
  error: string | null;
  onReset: () => void;
}

export function ErrorView({ error, onReset }: ErrorViewProps) {
  return (
    <div className="p-8 md:p-12 bg-mat-surface border border-mat-border shadow-mat-shine rounded-[32px] flex flex-col items-center justify-center text-center space-y-6 min-h-[320px]">
      <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-2 animate-shake">
        <AlertCircle className="w-8 h-8" />
      </div>
      <div className="space-y-2 max-w-md">
        <h2 className="text-xl font-black text-text">Processing Failed</h2>
        <p className="text-sm text-red-400 font-medium">
          {error || "An unknown error occurred."}
        </p>
      </div>
      <button
        onClick={onReset}
        autoFocus
        className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
      >
        <RefreshCw className="w-4 h-4" />
        Try again
      </button>
    </div>
  );
}
