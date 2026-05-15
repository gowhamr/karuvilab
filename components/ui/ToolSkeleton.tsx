"use client";

import React from "react";

export function ToolSkeleton() {
  return (
    <div className="w-full space-y-8 animate-pulse">
      {/* Header Area */}
      <div className="space-y-4">
        <div className="h-10 w-1/3 bg-blue/10 rounded-2xl" />
        <div className="h-4 w-2/3 bg-text-4/10 rounded-xl" />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="h-[400px] w-full bg-surface border border-border rounded-3xl" />
          <div className="h-12 w-full bg-blue rounded-2xl opacity-20" />
        </div>
        <div className="h-[500px] w-full bg-surface border border-border rounded-3xl" />
      </div>

      {/* Bottom Features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 w-full bg-surface border border-border rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
