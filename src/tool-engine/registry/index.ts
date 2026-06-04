// src/tool-engine/registry/index.ts
import { imageCompressorConfig } from "./image";
import { pdfMergerConfig } from "./pdf";
import { base64Config } from "./developer";
import type { ToolConfig } from "../types/ToolConfig";

export const ALL_TOOL_CONFIGS: ToolConfig[] = [
  imageCompressorConfig,
  pdfMergerConfig,
  base64Config,
  // Add others here as they are migrated
];

export const toolConfigMap = new Map<string, ToolConfig>(
  ALL_TOOL_CONFIGS.map(config => [config.id, config])
);
