// src/tool-engine/registry/developer.ts
import { Code } from "lucide-react";
import type { ToolConfig } from "../types/ToolConfig";

export const base64Config: ToolConfig = {
  id:          "base64",
  name:        "Base64 Encoder/Decoder",
  description: "Encode and decode text to Base64 format locally in your browser",
  category:    "developer",
  tags:        ["base64", "encode", "decode", "binary", "text", "developer"],
  icon:        Code,

  inputType:   "text",
  validation: {
    maxSizeMB: 10,
  },

  capabilities: {
    multiFile:      false,
    downloadable:   true,
    previewable:    false,
    workerRequired: false, // Small enough to run on main thread if needed
    supportsText:   true,
  },

  emptyState: {
    icon:         Code,
    headline:     "Paste text to Base64",
    outcomeText:  "Encode or decode text instantly",
    sampleKey:    "base64Encoder",
    trustVariant: "C",
  },

  defaultOptions: {
    mode: "encode",
    urlSafe: false,
  },

  processor: () =>
    import("@/src/features/base64/processor"),

  outputType: "text",

  seo: {
    title:       "Base64 Encoder & Decoder — KaruviLab",
    description: "Encode text to Base64 or decode Base64 strings locally. URL-safe support.",
    keywords:    ["base64 encoder", "base64 decoder", "url safe base64"],
    canonical:   "/developer-tools/base64",
    ogImage:     "/icons/icon-512.png",
  },

  relatedTools: ["json-formatter", "hash-generator", "url-cleaner"],
};
