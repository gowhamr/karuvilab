"use client";

import React from "react";
import { LucideIcon, Upload, ShieldCheck } from "lucide-react";
import { m } from "framer-motion";
import { cn } from "@/src/lib/utils";

interface MediaEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  acceptedFormats: string[];
  onFileSelect: () => void;
  className?: string;
}

export function MediaEmptyState({
  icon: Icon,
  title,
  description,
  acceptedFormats,
  onFileSelect,
  className,
}: MediaEmptyStateProps) {
  return (
    <m.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "p-12 sm:p-20 bg-surface border border-border rounded-4xl text-center space-y-8 flex flex-col items-center justify-center min-h-[400px] shadow-sm",
        className
      )}
    >
      <div className="relative">
        <m.div 
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, -5, 5, 0]
          }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="w-24 h-24 bg-blue/10 rounded-3xl flex items-center justify-center text-blue relative z-10"
        >
          <Icon className="w-12 h-12" />
        </m.div>
        <div className="absolute -inset-4 bg-blue/5 blur-2xl rounded-full animate-pulse" />
      </div>

      <div className="space-y-3 max-w-sm">
        <h2 className="font-black text-2xl tracking-tight text-text">{title}</h2>
        <p className="text-sm font-bold text-text-4 uppercase leading-relaxed tracking-wider">
          {description}
        </p>
      </div>

      <div className="space-y-4 w-full max-w-xs">
        <button
          onClick={onFileSelect}
          className="w-full flex items-center justify-center gap-3 py-4 bg-blue text-white rounded-2xl font-black uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-blue/20"
        >
          <Upload className="w-5 h-5" />
          Choose File
        </button>
        
        <div className="flex items-center justify-center gap-2 py-2 px-4 bg-bg rounded-xl border border-border">
          <ShieldCheck className="w-3.5 h-3.5 text-success" />
          <span className="text-[9px] font-black text-text-4 uppercase tracking-[0.1em]">
            No upload — Processed 100% locally
          </span>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {acceptedFormats.map((fmt) => (
          <span 
            key={fmt}
            className="px-2.5 py-1 bg-bg border border-border rounded-lg text-[9px] font-mono font-black text-text-4 uppercase tracking-tighter"
          >
            {fmt}
          </span>
        ))}
      </div>
    </m.div>
  );
}
