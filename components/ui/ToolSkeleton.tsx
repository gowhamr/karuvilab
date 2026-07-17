"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/src/lib/utils";

const SkeletonBlock = ({ className }: { className?: string }) => (
  <div className={cn("shimmer-wrapper bg-surface border border-border rounded-2xl", className)} />
);

export interface ToolSkeletonProps {
  variant?: "default" | "dashboard" | "single-card" | "table" | "calculator";
  delayMs?: number;
}

export function ToolSkeleton({ 
  variant = "default",
  delayMs = 150 
}: ToolSkeletonProps) {
  const [show, setShow] = useState(delayMs === 0);

  useEffect(() => {
    if (delayMs === 0) return;
    const timer = setTimeout(() => setShow(true), delayMs);
    return () => clearTimeout(timer);
  }, [delayMs]);

  if (!show) return null;

  let content;
  
  if (variant === "dashboard") {
    content = (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SkeletonBlock className="h-32 w-full" />
          <SkeletonBlock className="h-32 w-full" />
          <SkeletonBlock className="h-32 w-full" />
        </div>
        <SkeletonBlock className="h-96 w-full rounded-4xl" />
      </div>
    );
  } else if (variant === "single-card") {
    content = (
      <div className="max-w-2xl mx-auto">
        <SkeletonBlock className="h-[500px] w-full rounded-4xl" />
      </div>
    );
  } else if (variant === "table") {
    content = (
      <div className="space-y-4">
        <SkeletonBlock className="h-16 w-full rounded-2xl" />
        <SkeletonBlock className="h-96 w-full rounded-3xl" />
      </div>
    );
  } else if (variant === "calculator") {
    content = (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        <div className="lg:col-span-4 lg:col-start-1 space-y-6">
          <SkeletonBlock className="h-[600px] w-full rounded-4xl" />
        </div>
        <div className="lg:col-span-8 lg:col-start-5 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SkeletonBlock className="h-32 w-full rounded-2xl" />
            <SkeletonBlock className="h-32 w-full rounded-2xl" />
            <SkeletonBlock className="h-32 w-full rounded-2xl" />
            <SkeletonBlock className="h-32 w-full rounded-2xl" />
          </div>
          <SkeletonBlock className="h-96 w-full rounded-4xl" />
        </div>
      </div>
    );
  } else {
    // Default split-pane for input/result layout
    content = (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
        <div className="space-y-6 sm:space-y-8">
          <SkeletonBlock className="h-96 w-full rounded-4xl" />
          <SkeletonBlock className="h-14 w-full bg-blue/10 border-blue/20 rounded-2xl" />
        </div>
        <SkeletonBlock className="h-[500px] lg:h-full w-full rounded-4xl" />
      </div>
    );
  }

  return (
    <div 
      role="status" 
      aria-label="Loading tool content..."
      aria-busy="true"
      aria-live="polite"
      className="w-full animate-in fade-in duration-500"
    >
      {content}
    </div>
  );
}
