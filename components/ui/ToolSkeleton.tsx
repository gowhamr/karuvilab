"use client";

import React from "react";
import { cn } from "@/src/lib/utils";

const SkeletonBlock = ({ className }: { className?: string }) => (
  <div className={cn("shimmer-wrapper bg-surface border border-border rounded-2xl", className)} />
);

export function ToolSkeleton() {
  return (
    <div className="w-full space-y-8 sm:space-y-12 animate-in fade-in duration-500">
      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
        <div className="space-y-6 sm:space-y-8">
          <SkeletonBlock className="h-[400px] w-full rounded-[32px]" />
          <SkeletonBlock className="h-14 w-full bg-blue/10 border-blue/20 rounded-2xl" />
        </div>
        <SkeletonBlock className="h-[500px] w-full rounded-[32px]" />
      </div>

      {/* Bottom Features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
        {[1, 2, 3].map((i) => (
          <SkeletonBlock key={i} className="h-32 w-full rounded-[24px] sm:rounded-[32px]" />
        ))}
      </div>
    </div>
  );
}
