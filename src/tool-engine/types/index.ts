// src/tool-engine/types/index.ts
export * from "./ToolOptions";
export * from "./ToolResult";
export * from "./ToolProcessor";
export * from "./EmptyStateConfig";
export * from "./ToolConfig";

export interface LastSession {
  toolId: string;
  timestamp: number;
  inputSummary: string;
  resultSummary?: string;
  options?: Record<string, unknown>;
}
