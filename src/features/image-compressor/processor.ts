// src/features/image-compressor/processor.ts
import type { ToolProcessor } from "@/src/tool-engine/types";
import { workerOrchestrator } from "@/src/engine/workers/WorkerOrchestrator";
import { logger } from "@/src/lib/logger";

export interface ImageCompressorOptions {
  quality: number;
  format: "original" | "image/jpeg" | "image/png" | "image/webp" | "image/avif";
  maxWidth: number | null;
  [key: string]: unknown;
}

const processor: ToolProcessor<ImageCompressorOptions> = {
  metadata: {
    version: "1.0.0",
    engineVersion: "1.0.0",
  },

  validate(input: unknown): string | null {
    if (!input) return "No input provided.";
    const files = Array.isArray(input) ? input : [input];
    if (files.length === 0) return "No files provided.";
    if (!(files[0] instanceof File)) return "Invalid file object.";
    return null;
  },

  async execute(input: unknown, options: ImageCompressorOptions, signal: AbortSignal, onProgress: (progress: number) => void) {
    onProgress(0);

    const files = Array.isArray(input) ? input as File[] : [input as File];
    if (files.length === 0) throw new Error("No files to process.");

    const file = files[0]; // For single mode example. Batch mode would handle multiple.
    if (!file) throw new Error("File is undefined");

    let arrayBuffer: ArrayBuffer;
    
    try {
      arrayBuffer = await file.arrayBuffer();
    } catch (e) {
      throw new Error("Failed to read file.");
    }

    if (signal.aborted) throw new DOMException("Aborted", "AbortError");

    onProgress(20);

    let formatToUse = options.format;
    if (formatToUse === "original") {
      formatToUse = file.type as any;
      if (!["image/jpeg", "image/png", "image/webp", "image/avif"].includes(formatToUse)) {
        formatToUse = "image/webp"; // fallback
      }
    }

    try {
      // Dispatch to worker
      const uint8Array = await workerOrchestrator.dispatch(
        "compressImage",
        [arrayBuffer, formatToUse, options.quality],
        [arrayBuffer], // Transferable
        (p: any) => onProgress(20 + p.percent * 0.8), // Scale progress 20-100%
        signal
      ) as Uint8Array;

      if (signal.aborted) throw new DOMException("Aborted", "AbortError");

      onProgress(100);

      const outputBlob = new Blob([new Uint8Array(uint8Array)], { type: formatToUse });
      const newExt = formatToUse.split('/')[1];
      const newFilename = file.name.replace(/\.[^/.]+$/, "") + `-compressed.${newExt}`;

      return {
        status: "success",
        outputType: "download",
        blob: outputBlob,
        filename: newFilename,
        mimeType: formatToUse,
        inputSizeBytes: file.size,
        outputSizeBytes: outputBlob.size,
      };

    } catch (e: any) {
      if (e.name === "AbortError") throw e;
      
      logger.error("[ImageCompressorProcessor] Compression failed", e);
      return {
        status: "error",
        outputType: "download",
        error: "Image compression failed. The file might be corrupted or in an unsupported sub-format.",
      };
    }
  }
};

export default processor;
