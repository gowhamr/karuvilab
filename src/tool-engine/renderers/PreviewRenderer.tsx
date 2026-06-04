// src/tool-engine/renderers/PreviewRenderer.tsx
"use client";

import React from "react";
import type { ToolResult } from "../types/ToolResult";

export default function PreviewRenderer({ result }: { result: ToolResult }) {
  if (!result.blob) return null;
  const url = URL.createObjectURL(result.blob);

  // Note: in a real implementation we would use useObjectUrlManager
  // to properly manage the lifecycle of this URL.

  return (
    <div className="bg-mat-surface border border-mat-border shadow-mat-shine rounded-[32px] overflow-hidden p-6 flex items-center justify-center">
      {result.mimeType?.startsWith("image/") ? (
        <img src={url} alt="Preview" className="max-w-full h-auto rounded-2xl" />
      ) : (
        <iframe src={url} className="w-full h-[600px] rounded-2xl border-none" />
      )}
    </div>
  );
}
