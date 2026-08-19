"use client";

import React from "react";
import { SegmentedControl } from "./SegmentedControl";
import { cn } from "@/src/lib/utils";

interface ToolWorkspaceProps<T extends string | number = string> {
  layout?: "split" | "stacked";
  tabs?: {
    options: Array<{ id: T; label: string; icon?: React.ReactNode }>;
    activeId: T;
    onChange: (id: T) => void;
  };
  input?: React.ReactNode;
  optionsPanel?: React.ReactNode;
  output?: React.ReactNode;
  infoPanel?: React.ReactNode;
  className?: string;
}

export function ToolWorkspace<T extends string | number = string>({
  layout = "split",
  tabs,
  input,
  optionsPanel,
  output,
  infoPanel,
  className
}: ToolWorkspaceProps<T>) {
  return (
    <div className={cn("w-full min-w-0 max-w-full space-y-6 sm:space-y-8 pb-12", className)}>
      {tabs && (
        <div className="flex justify-center w-full min-w-0">
          <SegmentedControl 
            options={tabs.options} 
            activeId={tabs.activeId} 
            onChange={tabs.onChange} 
          />
        </div>
      )}

      <div className={cn(
        "grid gap-4 sm:gap-6 md:gap-8 w-full min-w-0", 
        layout === "split" ? "lg:grid-cols-2" : "grid-cols-1"
      )}>
        <div className="space-y-4 sm:space-y-6 flex flex-col min-w-0 w-full">
          {input && (
            <div className="bg-surface border border-border p-3.5 sm:p-6 rounded-2xl sm:rounded-4xl shadow-sm space-y-4 min-w-0 w-full overflow-hidden">
              {input}
            </div>
          )}
          {optionsPanel && (
            <div className="bg-surface border border-border p-3.5 sm:p-6 rounded-2xl sm:rounded-4xl shadow-sm space-y-4 min-w-0 w-full overflow-hidden">
              {optionsPanel}
            </div>
          )}
        </div>
        
        {output && (
          <div className="space-y-4 sm:space-y-6 flex flex-col h-full min-w-0 w-full">
            <div className="bg-surface border border-border p-3.5 sm:p-6 rounded-2xl sm:rounded-4xl shadow-sm space-y-4 flex-1 min-w-0 w-full overflow-hidden">
              {output}
            </div>
          </div>
        )}
      </div>

      {infoPanel && (
        <div className="w-full">
          {infoPanel}
        </div>
      )}
    </div>
  );
}
