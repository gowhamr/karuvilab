"use client";

import React from 'react';
import { HardDrive, Download, CheckCircle2, RefreshCw } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export interface ModelStatusBadgeProps {
  isCached: boolean;
  isDownloading?: boolean;
  isUpdating?: boolean;
  sizeMB?: number;
  className?: string;
}

export function ModelStatusBadge({
  isCached,
  isDownloading = false,
  isUpdating = false,
  sizeMB,
  className
}: ModelStatusBadgeProps) {
  if (isDownloading) {
    return (
      <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue/10 border border-blue/20 text-blue text-tiny font-mono font-bold animate-pulse", className)}>
        <Download className="w-3 h-3" />
        <span>Downloading AI Model...</span>
      </div>
    );
  }

  if (isUpdating) {
    return (
      <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-tiny font-mono font-bold animate-spin", className)}>
        <RefreshCw className="w-3 h-3" />
        <span>Updating Model...</span>
      </div>
    );
  }

  if (isCached) {
    return (
      <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-tiny font-mono font-bold", className)}>
        <CheckCircle2 className="w-3 h-3" />
        <span>Cached Offline {sizeMB ? `(${sizeMB} MB)` : ''}</span>
      </div>
    );
  }

  return (
    <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface border border-border text-text-muted text-tiny font-mono font-semibold", className)}>
      <HardDrive className="w-3 h-3" />
      <span>Download Required {sizeMB ? `(${sizeMB} MB)` : ''}</span>
    </div>
  );
}
