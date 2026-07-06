// src/tool-engine/core/OutputPanel.tsx

"use client";

import React, { lazy, Suspense } from "react";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";
import { ErrorView } from "./ErrorView";
import { logger } from "@/src/lib/logger";
import DownloadRenderer from "../renderers/DownloadRenderer";
import TextRenderer from "../renderers/TextRenderer";
import PreviewRenderer from "../renderers/PreviewRenderer";
import JsonRenderer from "../renderers/JsonRenderer";
import TableRenderer from "../renderers/TableRenderer";
import ChartRenderer from "../renderers/ChartRenderer";
import type { ToolConfig } from "../types/ToolConfig";
import type { ToolResult } from "../types/ToolResult";

interface OutputPanelProps {
  result: ToolResult;
  config: ToolConfig;
  onReset: () => void;
}

export function OutputPanel({ result, config, onReset }: OutputPanelProps) {
  if (result.status !== "success") return null;

  switch (result.outputType) {
    case "download":
      return <DownloadRenderer result={result} />;

    case "preview":
      return <PreviewRenderer result={result} />;

    case "text":
      return <TextRenderer result={result} />;

    case "json":
      return <JsonRenderer result={result} />;

    case "table":
      return <TableRenderer result={result} />;

    case "chart":
      return <ChartRenderer result={result} />;

    case "custom": {
      if (!config.customRenderer) {
        logger.error(
          "outputType=custom but no customRenderer in ToolConfig",
          { toolId: config.id, action: "OutputPanel.render" }
        );
        return <ErrorView error="Renderer not configured for this tool." onReset={onReset} />;
      }

      const CustomRenderer = lazy(
        () => config.customRenderer!()
                .then(m => ({ default: m.default }))
      );

      return (
        <Suspense fallback={<ToolSkeleton />}>
          <CustomRenderer result={result} />
        </Suspense>
      );
    }

    default: {
      logger.error(
        "OutputPanel received unknown outputType",
        {
          error: { outputType: (result as any).outputType },
          toolId:     config.id,
          action:     "OutputPanel.render"
        }
      );
      return <ErrorView error="An unexpected error occurred." onReset={onReset} />;
    }
  }
}
