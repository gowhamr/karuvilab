// src/tool-engine/types/ToolOptions.ts

export interface ToolOptionsSchema {
  // Typed options passed to processor.execute()
  // Each tool defines its own — engine passes through without inspection
  // Must be serializable (no functions, no DOM refs)
  [key: string]: unknown;
}
