// src/tool-engine/types/ToolResult.ts

export type OutputType =
  | "download"
  | "preview"
  | "text"
  | "json"
  | "table"
  | "chart"
  | "custom";

export type ToolResultStatus = "success" | "error" | "cancelled";

export interface ToolResult {
  status:      ToolResultStatus;
  outputType:  OutputType;

  // Success payloads (one populated based on outputType)
  blob?:       Blob;            // download / preview
  text?:       string;          // text / json
  rows?:       unknown[][];     // table
  chartData?:  unknown;         // chart
  custom?:     unknown;         // custom renderer

  // Download metadata
  filename?:   string;
  mimeType?:   string;

  // Error
  error?:      string;          // user-safe message only — no stack traces

  // Metrics
  processingMs?: number;
  inputSizeBytes?: number;
  outputSizeBytes?: number;
}
