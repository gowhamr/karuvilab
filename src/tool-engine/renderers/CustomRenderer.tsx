// src/tool-engine/renderers/CustomRenderer.tsx
"use client";

import React, { Suspense, useMemo } from "react";
import type { ToolResult } from "../types/ToolResult";
import type { ToolConfig } from "../types/ToolConfig";
import { Loader2 } from "lucide-react";

interface CustomRendererProps {
  result: ToolResult;
  config: ToolConfig;
}

const lazyCache = new WeakMap<() => Promise<unknown>, React.ComponentType<{ result: ToolResult }>>();

function getLazyComponent(customRenderer: () => Promise<unknown>): React.ComponentType<{ result: ToolResult }> {
  let cached = lazyCache.get(customRenderer);
  if (!cached) {
    cached = React.lazy(customRenderer as () => Promise<{ default: React.ComponentType<{ result: ToolResult }> }>);
    lazyCache.set(customRenderer, cached);
  }
  return cached;
}

export default function CustomRenderer({ result, config }: CustomRendererProps) {
  if (!config.customRenderer) {
    return <div className="p-8 text-center text-red-500">Missing customRenderer in ToolConfig.</div>;
  }

  const Component = getLazyComponent(config.customRenderer);

  return (
    <Suspense fallback={<div className="p-12 flex justify-center"><Loader2 className="animate-spin text-brand-primary" /></div>}>
      {React.createElement(Component, { result })}
    </Suspense>
  );
}
