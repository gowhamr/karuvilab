// src/tool-engine/core/ToolShell.tsx
"use client";

import React, { useMemo } from "react";
import { MotionConfig } from "framer-motion";
import { ToolErrorBoundary } from "./ToolErrorBoundary";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProcessingView } from "./ProcessingView";
import { ErrorView } from "./ErrorView";
import { OutputPanel } from "./OutputPanel";
import { ActionBar } from "./ActionBar";
import { useToolEngine } from "../hooks/useToolEngine";
import { toolConfigMap } from "../registry";
import type { ToolConfig } from "../types/ToolConfig";
import { Settings as SettingsIcon } from "lucide-react";
import { ToolIcon } from "@/components/ui/Icons";
import { notFound } from "next/navigation";

interface ToolShellProps {
  toolId: string;
}

export function ToolShell({ toolId }: ToolShellProps) {
  const config = toolConfigMap.get(toolId);

  if (!config) {
    notFound();
    return null;
  }

  const { 
    phase, 
    progress, 
    result, 
    error, 
    dragState, 
    handleInput, 
    cancel, 
    reset 
  } = useToolEngine(config);

  const emptyStateIcon = useMemo(() => {
    if (config.emptyState.icon) return config.emptyState.icon;
    // Fallback to generic icon or category icon
    return SettingsIcon;
  }, [config.emptyState.icon]);

  return (
    <ToolErrorBoundary toolId={config.id}>
      <MotionConfig reducedMotion="user">
        <div className="flex flex-col gap-4 p-4 md:p-8 max-w-5xl mx-auto w-full">
          {/* Header */}
          <div className="flex flex-col mb-4 md:mb-8 space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-mat-surface border border-mat-border shadow-mat-shine flex items-center justify-center">
                <ToolIcon toolId={config.id} category={config.category} className="w-5 h-5 text-brand-primary" />
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-text tracking-tight">
                {config.name}
              </h1>
            </div>
            <p className="text-sm text-text-4 font-medium max-w-2xl">
              {config.description}
            </p>
          </div>

          {/* Phase Routing */}
          <div className="flex-1 w-full min-h-[320px]">
            {phase === "idle" && (
              <EmptyState 
                icon={emptyStateIcon}
                headline={config.emptyState.headline}
                toolType={config.inputType}
                toolId={config.emptyState.sampleKey}
                onDrop={handleInput}
                dragState={dragState}
                formats={config.validation.formats}
                {...(config.validation.maxSizeMB ? { maxSize: `${config.validation.maxSizeMB}MB` } : {})}
                {...(config.validation.maxFiles ? { maxFiles: `${config.validation.maxFiles} files` } : {})}
                {...(config.emptyState.subAction ? {
                  subAction: {
                    label: config.emptyState.subAction,
                    onClick: () => {
                      const fileInput = document.createElement("input");
                      fileInput.type = "file";
                      if (config.capabilities.multiFile) fileInput.multiple = true;
                      if (config.validation.formats) {
                        fileInput.accept = config.validation.formats.map(f => `.${f.toLowerCase()}`).join(",");
                      }
                      fileInput.onchange = (e) => {
                        const files = Array.from((e.target as HTMLInputElement).files || []);
                        if (files.length > 0) handleInput(files);
                      };
                      fileInput.click();
                    }
                  }
                } : {})}
                trustVariant={config.emptyState.trustVariant}
                outcomeText={config.emptyState.outcomeText}
                sampleCTA={{ label: `Try Sample ${config.inputType === 'file' ? 'File' : 'Data'}` }}
                // onDragOver and onDragLeave are handled by useFileInput but we can wire them if needed
              />
            )}

            {phase === "validating" && <ProcessingView progress={0} />}
            {phase === "processing" && <ProcessingView progress={progress} onCancel={cancel} />}
            {phase === "error" && <ErrorView error={error} onReset={reset} />}
            {phase === "done" && <OutputPanel result={result} />}
          </div>

          {/* Actions */}
          {phase === "done" && (
            <ActionBar 
              result={result} 
              config={config} 
              onReset={reset} 
            />
          )}

        </div>
      </MotionConfig>
    </ToolErrorBoundary>
  );
}
