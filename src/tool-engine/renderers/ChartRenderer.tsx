// src/tool-engine/renderers/ChartRenderer.tsx
"use client";

import React from "react";
import type { ToolResult } from "../types/ToolResult";

export default function ChartRenderer({ result }: { result: ToolResult }) {
  // Placeholder for a real chart implementation (e.g., Recharts, Chart.js)
  return (
    <div className="bg-mat-surface border border-mat-border shadow-mat-shine rounded-4xl overflow-hidden p-12 text-center text-text-4">
      <div className="w-16 h-16 bg-blue/10 text-blue rounded-2xl flex items-center justify-center mx-auto mb-4">
        {/* Chart Icon */}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
      </div>
      <p className="font-bold">Chart Rendering requires a charting library.</p>
      <p className="text-sm">Data payload received: {JSON.stringify(result.chartData).slice(0, 50)}...</p>
    </div>
  );
}
