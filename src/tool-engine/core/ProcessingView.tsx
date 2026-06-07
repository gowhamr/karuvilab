// src/tool-engine/core/ProcessingView.tsx
"use client";

import React from "react";
import { m } from "framer-motion";
import { Loader2 } from "lucide-react";

interface ProcessingViewProps {
  progress: number;
  onCancel?: () => void;
}

export function ProcessingView({ progress, onCancel }: ProcessingViewProps) {
  return (
    <div className="p-8 md:p-12 bg-mat-surface border border-mat-border shadow-mat-shine rounded-4xl flex flex-col items-center justify-center text-center space-y-8 min-h-[320px]">
      <div className="w-16 h-16 bg-brand-primary/10 text-brand-primary rounded-full flex items-center justify-center mb-4">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
      
      <div className="space-y-4 w-full max-w-md">
        <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest">
          <span className="text-text-3">Processing locally...</span>
          <span className="text-brand-primary">{Math.round(progress)}%</span>
        </div>
        
        <div className="h-2 w-full bg-mat-raised border border-mat-border rounded-full overflow-hidden">
          <m.div 
            className="h-full bg-brand-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "easeOut", duration: 0.2 }}
          />
        </div>
      </div>

      {onCancel && (
        <button
          onClick={onCancel}
          className="mt-4 px-8 py-3 bg-mat-raised border border-mat-border rounded-xl text-xs font-bold text-text-3 hover:bg-mat-hover hover:text-text transition-colors"
        >
          Cancel
        </button>
      )}
    </div>
  );
}
