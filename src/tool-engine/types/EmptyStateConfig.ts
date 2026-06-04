// src/tool-engine/types/EmptyStateConfig.ts
import type { LucideIcon } from "lucide-react";
import type { SampleAssetKey } from "@/src/data/sampleAssets";

export interface ToolEmptyStateConfig {
  icon?:        LucideIcon;    // defaults to category icon if omitted
  headline:     string;        // "Drop images here"
  subAction?:   string;        // "or browse files" — omit for text tools
  outcomeText:  string;        // "Download optimized images" (≤60 chars)
  sampleKey:    SampleAssetKey; // wired to SAMPLE_ASSETS registry
  trustVariant?: "A" | "B" | "C";
}
