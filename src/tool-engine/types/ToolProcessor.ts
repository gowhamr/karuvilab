// src/tool-engine/types/ToolProcessor.ts
import { ToolOptionsSchema } from "./ToolOptions";
import { ToolResult } from "./ToolResult";

export interface ToolProcessorMetadata {
  version: string;
  engineVersion: string;
  author?: string;
}

export interface ToolProcessor<
  TOptions extends ToolOptionsSchema = ToolOptionsSchema
> {
  metadata: ToolProcessorMetadata;

  // Validate input BEFORE processing
  // Returns null if valid, error string if invalid
  // Called by engine before execute() — never skipped
  validate(input: unknown): string | null;

  // Execute processing — runs in Web Worker context
  // No UI imports. No React. No DOM access.
  execute(
    input:      unknown,
    options:    TOptions,
    signal:     AbortSignal,
    onProgress: (progress: number) => void
  ): Promise<ToolResult>;
}
