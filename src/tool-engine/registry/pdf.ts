// src/tool-engine/registry/pdf.ts
import { FileText } from "lucide-react";
import type { ToolConfig } from "../types/ToolConfig";

export const pdfMergerConfig: ToolConfig = {
  id:          "pdf-merger",
  name:        "PDF Merger",
  description: "Merge multiple PDF files into one, locally in your browser",
  category:    "pdf",
  tags:        ["merge", "combine", "join", "pdf", "document"],
  icon:        FileText,

  inputType:   "batch",
  validation: {
    formats:   ["PDF"],
    maxSizeMB: 500,
    maxFiles:  20,
  },

  capabilities: {
    multiFile:      true,
    downloadable:   true,
    previewable:    false,
    workerRequired: true,
  },

  emptyState: {
    icon:         FileText,
    headline:     "Drop PDF files here",
    subAction:    "or browse files",
    outcomeText:  "Merge PDFs into one file",
    sampleKey:    "pdfMerger",
    trustVariant: "B",
  },

  defaultOptions: {
    outputFilename: "merged.pdf",
  },

  processor: () =>
    import("@/src/features/pdf-merger/processor"),

  outputType: "download",

  seo: {
    title:       "PDF Merger — KaruviLab",
    description: "Merge PDF files locally. No upload. No account.",
    keywords:    ["pdf merger", "combine pdf", "merge pdf files"],
  },

  relatedTools: ["pdf-splitter", "pdf-to-word", "file-validator"],
};
