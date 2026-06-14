// src/tool-engine/renderers/JsonRenderer.tsx
"use client";

import React from "react";
import type { ToolResult } from "../types/ToolResult";
import { CopyButton } from "@/components/ui/CopyButton";

export default function JsonRenderer({ result }: { result: ToolResult }) {
  const jsonText = result.text || "";

  return (
    <div className="bg-mat-surface border border-mat-border shadow-mat-shine rounded-4xl overflow-hidden flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b border-mat-border bg-mat-base/50">
        <h3 className="text-xs font-black uppercase tracking-widest text-text-4">JSON Output</h3>
        <CopyButton text={jsonText} />
      </div>
      <div className="p-6 overflow-auto max-h-full custom-scrollbar bg-transparent">
        <pre className="text-sm font-mono text-blue whitespace-pre-wrap word-break">
          {jsonText}
        </pre>
      </div>
    </div>
  );
}
