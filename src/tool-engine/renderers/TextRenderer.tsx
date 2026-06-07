// src/tool-engine/renderers/TextRenderer.tsx
"use client";

import React from "react";
import type { ToolResult } from "../types/ToolResult";
import { CopyButton } from "@/components/ui/CopyButton";

export default function TextRenderer({ result }: { result: ToolResult }) {
  const text = result.text || "";

  return (
    <div className="bg-mat-surface border border-mat-border shadow-mat-shine rounded-4xl overflow-hidden flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b border-mat-border bg-mat-base/50">
        <h3 className="text-[11px] font-black uppercase tracking-widest text-text-4">Output</h3>
        <CopyButton text={text} />
      </div>
      <div className="p-6 overflow-auto max-h-[500px] custom-scrollbar bg-transparent">
        <pre className="text-sm font-mono text-text whitespace-pre-wrap word-break">
          {text}
        </pre>
      </div>
    </div>
  );
}
