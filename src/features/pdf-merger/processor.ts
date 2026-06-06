// src/features/pdf-merger/processor.ts
import type { ToolProcessor, ToolResult } from "@/src/tool-engine/types";
import { workerOrchestrator } from "@/src/engine/workers/WorkerOrchestrator";
import { logger } from "@/src/lib/logger";

export interface PdfMergerOptions {
  outputFilename: string;
  [key: string]: unknown;
}

const processor: ToolProcessor<PdfMergerOptions> = {
  metadata: {
    version: "1.0.0",
    engineVersion: "1.0.0",
  },

  validate(input: unknown): string | null {
    if (!input) return "No input provided.";
    const files = Array.isArray(input) ? input : [input];
    if (files.length < 2) return "Please provide at least 2 PDF files to merge.";
    if (!files.every(f => f instanceof File)) return "Invalid file objects.";
    if (!files.every(f => f.type === "application/pdf")) return "All files must be PDFs.";
    return null;
  },

  async execute(input: unknown, options: PdfMergerOptions, signal: AbortSignal, onProgress: (progress: number) => void): Promise<ToolResult> {
    const start = performance.now();
    onProgress(0);

    const files = Array.isArray(input) ? input as File[] : [input as File];
    
    // Read all files as ArrayBuffers
    const arrayBuffers: ArrayBuffer[] = [];
    let totalSize = 0;

    for (let i = 0; i < files.length; i++) {
      if (signal.aborted) {
        return {
          status: "cancelled",
          outputType: "download",
          processingMs: performance.now() - start,
        };
      }
      try {
        const file = files[i];
        if (!file) continue;
        const buffer = await file.arrayBuffer();
        arrayBuffers.push(buffer);
        totalSize += buffer.byteLength;
        onProgress((i / files.length) * 20); // First 20% is reading
      } catch (e) {
        return {
          status: "error",
          outputType: "download",
          error: `Failed to read file: ${files[i]?.name}`,
          processingMs: performance.now() - start,
        };
      }
    }

    if (signal.aborted) {
      return {
        status: "cancelled",
        outputType: "download",
        processingMs: performance.now() - start,
      };
    }

    try {
      // Dispatch to worker
      const uint8Array = await workerOrchestrator.dispatch(
        "mergePdfs",
        [arrayBuffers],
        arrayBuffers, // Transferables
        (p: any) => onProgress(20 + p.percent * 0.8), // Scale progress 20-100%
        signal,
        true,
        2,
        500,
        60000
      ) as Uint8Array;

      if (signal.aborted) {
        return {
          status: "cancelled",
          outputType: "download",
          processingMs: performance.now() - start,
        };
      }

      onProgress(100);

      const outputBlob = new Blob([new Uint8Array(uint8Array)], { type: "application/pdf" });
      const filename = options.outputFilename || "merged.pdf";

      return {
        status: "success",
        outputType: "download",
        blob: outputBlob,
        filename: filename,
        mimeType: "application/pdf",
        inputSizeBytes: totalSize,
        outputSizeBytes: outputBlob.size,
        processingMs: performance.now() - start,
      };

    } catch (e: any) {
      if (e.name === "AbortError") {
        return {
          status: "cancelled",
          outputType: "download",
          processingMs: performance.now() - start,
        };
      }
      
      logger.error("[PdfMergerProcessor] Merge failed", {
        toolId: "pdf-merger",
        action: "execute",
        error: e.message
      });
      return {
        status: "error",
        outputType: "download",
        error: "PDF merge failed. Ensure all files are valid, unencrypted PDFs.",
        processingMs: performance.now() - start,
      };
    }
  }
};

export default processor;
