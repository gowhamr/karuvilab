// src/tool-engine/types/ToolConfig.ts
import type { LucideIcon } from "lucide-react";
import type { ToolProcessor } from "./ToolProcessor";
import type { OutputType, ToolResult } from "./ToolResult";
import type { ToolOptionsSchema } from "./ToolOptions";
import type { ToolEmptyStateConfig } from "./EmptyStateConfig";

export interface ToolValidation {
  formats?:    string[];       // ["PNG", "JPG", "WEBP"]
  maxSizeMB?:  number;         // 50
  maxFiles?:   number;         // 20
  // Validator runs BEFORE processor.execute()
  // Returns null if valid, string error message if invalid
  validate?:   (files: File[]) => string | null;
}

export interface ToolCapabilities {
  multiFile:       boolean;
  downloadable:    boolean;
  previewable:     boolean;
  workerRequired:  boolean;
  supportsText?:   boolean;    // text paste input
  supportsStream?: boolean;    // streaming output
}

export interface ToolConfig<
  TOptions extends ToolOptionsSchema = ToolOptionsSchema
> {
  // Identity
  id:          string;
  name:        string;
  description: string;
  category:    "image" | "pdf" | "video" | "audio" | "developer"
               | "security" | "utility" | "calculator" | "generator";
  tags:        string[];     // for search engine synonym matching
  icon?:       LucideIcon;

  // Input
  inputType:   "file" | "text" | "generator" | "batch";
  validation:  ToolValidation;

  // Capabilities
  capabilities: ToolCapabilities;

  // Empty state (wired to KV Empty State v4)
  emptyState:   ToolEmptyStateConfig;

  // Options schema + defaults
  defaultOptions: TOptions;

  // Processor — lazy loaded, never in initial bundle
  processor: () => Promise<{ default: ToolProcessor<TOptions> }>;

  // Output
  outputType:   OutputType;

  // Custom renderer (only when outputType === "custom")
  customRenderer?: () => Promise<{
    default: React.ComponentType<{ result: ToolResult }>;
  }>;

  // SEO
  seo: {
    title:       string;
    description: string;
    keywords:    string[];
  };

  // Related tools (for discovery — min 3 required)
  relatedTools: string[];   // tool IDs
}
