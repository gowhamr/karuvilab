// src/tool-engine/core/OutputPanel.tsx
"use client";

import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import type { ToolResult } from "../types/ToolResult";
import { Loader2 } from "lucide-react";

// Lazy load all renderers
const DownloadRenderer = dynamic(() => import("../renderers/DownloadRenderer"), { ssr: false });
const TextRenderer = dynamic(() => import("../renderers/TextRenderer"), { ssr: false });
const PreviewRenderer = dynamic(() => import("../renderers/PreviewRenderer"), { ssr: false });
const JsonRenderer = dynamic(() => import("../renderers/JsonRenderer"), { ssr: false });
const TableRenderer = dynamic(() => import("../renderers/TableRenderer"), { ssr: false });
const ChartRenderer = dynamic(() => import("../renderers/ChartRenderer"), { ssr: false });

interface OutputPanelProps {
  result: ToolResult | null;
}

export function OutputPanel({ result }: OutputPanelProps) {
  if (!result || result.status !== "success") return null;

  const renderContent = () => {
    switch (result.outputType) {
      case "download":
        return <DownloadRenderer result={result} />;
      case "text":
        return <TextRenderer result={result} />;
      case "preview": 
        return <PreviewRenderer result={result} />;
      case "json": 
        return <JsonRenderer result={result} />;
      case "table": 
        return <TableRenderer result={result} />;
      case "chart": 
        return <ChartRenderer result={result} />;
      // case "custom": 
      //   We would need ToolConfig here to pass to CustomRenderer
      default:
        return (
          <div className="p-8 text-center text-text-4">
            Unsupported output type: {result.outputType}
          </div>
        );
    }
  };

  return (
    <Suspense 
      fallback={
        <div className="p-12 flex justify-center bg-mat-surface border border-mat-border rounded-[32px] shadow-mat-shine">
          <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
        </div>
      }
    >
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {renderContent()}
      </div>
    </Suspense>
  );
}
