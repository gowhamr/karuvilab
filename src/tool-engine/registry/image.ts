// src/tool-engine/registry/image.ts
import { Image as ImageIcon } from "lucide-react";
import type { ToolConfig } from "../types/ToolConfig";

export const imageCompressorConfig: ToolConfig = {
  id:          "image-compressor",
  name:        "Image Compressor",
  description: "Compress PNG, JPG and WebP images locally in your browser",
  category:    "image",
  tags:        ["compress", "optimize", "shrink", "reduce", "image", "photo"],
  icon:        ImageIcon,

  inputType:   "file",
  validation: {
    formats:   ["PNG", "JPG", "WEBP"],
    maxSizeMB: 50,
    maxFiles:  20,
  },

  capabilities: {
    multiFile:      true,
    downloadable:   true,
    previewable:    true,
    workerRequired: true,
  },

  emptyState: {
    icon:         ImageIcon,
    headline:     "Drop images here",
    subAction:    "or browse files",
    outcomeText:  "Download optimized images",
    sampleKey:    "imageCompressor",
    trustVariant: "A",
  },

  defaultOptions: {
    quality:   80,
    format:    "original",
    maxWidth:  null,
  },

  processor: () =>
    import("@/src/features/image-compressor/processor"),

  outputType: "download",

  seo: {
    title:       "Image Compressor — KaruviLab",
    description: "Compress PNG, JPG and WebP images locally. No upload.",
    keywords:    ["image compressor", "compress png", "reduce image size"],
    canonical:   "/image-tools/image-compressor",
    ogImage:     "/icons/icon-512.png",
  },

  relatedTools: ["image-resizer", "color-palette-extractor", "image-converter"],
};
