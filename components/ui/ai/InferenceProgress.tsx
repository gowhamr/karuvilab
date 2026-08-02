"use client";

import React from 'react';
import { Cpu, ShieldCheck } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export interface InferenceProgressProps {
  stage: string;
  percent: number;
  backend?: string;
  onCancel?: () => void;
  className?: string;
}

export function InferenceProgress({
  stage,
  percent,
  backend = 'WebGPU / WASM',
  onCancel,
  className
}: InferenceProgressProps) {
  return (
    <div className={cn("p-6 bg-surface border border-border rounded-3xl space-y-4 text-center select-none", className)}>
      <div className="w-12 h-12 mx-auto rounded-2xl bg-blue/10 border border-blue/20 flex items-center justify-center text-blue animate-bounce">
        <Cpu className="w-6 h-6" />
      </div>

      <div className="space-y-1">
        <h3 className="text-sm font-bold text-text tracking-tight">{stage}</h3>
        <div className="flex items-center justify-center gap-2 text-xs text-text-muted font-mono">
          <span>{percent}% Complete</span>
          <span>•</span>
          <span className="text-blue font-semibold">{backend}</span>
        </div>
      </div>

      <div className="w-full max-w-md mx-auto h-2 bg-bg border border-border rounded-full overflow-hidden">
        <div
          className="h-full bg-blue transition-all duration-300 rounded-full"
          style={{ width: `${percent}%` }}
        />
      </div>

      {onCancel && (
        <button
          onClick={onCancel}
          className="px-3 py-1 rounded-lg border border-border text-text-muted hover:text-text hover:bg-surface-elevated text-xs font-semibold font-mono transition-colors"
        >
          Cancel Inference
        </button>
      )}

      <div className="flex items-center justify-center gap-1.5 text-tiny font-mono text-text-4 pt-1">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
        <span>100% In-Browser Hardware Accelerated Execution</span>
      </div>
    </div>
  );
}
