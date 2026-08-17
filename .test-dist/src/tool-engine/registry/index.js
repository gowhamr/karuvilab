// src/tool-engine/registry/index.ts
import { imageCompressorConfig } from "./image";
import { pdfMergerConfig } from "./pdf";
import { base64Config } from "./developer";
export const ALL_TOOL_CONFIGS = [
    imageCompressorConfig,
    pdfMergerConfig,
    base64Config,
    // Add others here as they are migrated
];
export const toolConfigMap = new Map(ALL_TOOL_CONFIGS.map(config => [config.id, config]));
