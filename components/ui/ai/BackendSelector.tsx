"use client";

import React from 'react';
import { ModelBackend } from '@/src/ai/types';
import { Cpu, Zap } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export interface BackendSelectorProps {
  selectedBackend: ModelBackend | 'auto';
  onSelect: (backend: ModelBackend | 'auto') => void;
  className?: string;
}

export function BackendSelector({
  selectedBackend,
  onSelect,
  className
}: BackendSelectorProps) {
  const options: Array<{ id: ModelBackend | 'auto'; label: string; desc: string }> = [
    { id: 'auto', label: 'Auto (Recommended)', desc: 'Detect best hardware acceleration' },
    { id: 'webgpu', label: 'WebGPU', desc: 'Hardware GPU Shader pipeline' },
    { id: 'wasm', label: 'WASM SIMD', desc: 'Multi-threaded CPU vector execution' }
  ];

  return (
    <div className={cn("p-4 bg-surface border border-border rounded-2xl space-y-3 font-sans", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-blue" />
          <h4 className="text-xs font-bold text-text uppercase tracking-wider">AI Execution Backend</h4>
        </div>
        <span className="text-tiny font-mono text-text-muted">Client Side Only</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onSelect(opt.id)}
            className={cn(
              "p-2.5 rounded-xl border text-left transition-all space-y-0.5 cursor-pointer",
              selectedBackend === opt.id
                ? "bg-blue/10 border-blue/40 text-text shadow-sm"
                : "bg-surface-elevated/40 border-border/60 text-text-muted hover:border-border hover:text-text"
            )}
          >
            <div className="text-xs font-bold text-text">{opt.label}</div>
            <div className="text-[10px] text-text-muted font-mono leading-tight">{opt.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
