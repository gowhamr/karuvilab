// src/tool-engine/renderers/CustomRenderer.tsx
"use client";

import React, { Suspense } from "react";
import type { ToolResult } from "../types/ToolResult";
import { Loader2 } from "lucide-react";

interface CustomRendererProps {
  result: ToolResult;
  config: any; // We'd pass ToolConfig here in the real OutputPanel
}

export default function CustomRenderer({ result, config }: CustomRendererProps) {
  if (!config.customRenderer) {
    return <div className="p-8 text-center text-red-500">Missing customRenderer in ToolConfig.</div>;
  }

  // Next.js dynamic requires static strings, so the config must return the dynamic component
  // We can't dynamically import from a string at runtime easily without next/dynamic rules.
  // The config already provides `customRenderer: () => Promise<{default: Component}>`
  
  const Component = React.lazy(config.customRenderer);

  return (
    <Suspense fallback={<div className="p-12 flex justify-center"><Loader2 className="animate-spin text-brand-primary" /></div>}>
      <Component result={result} />
    </Suspense>
  );
}
