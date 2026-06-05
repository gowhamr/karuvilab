// src/features/base64/processor.ts
import type { ToolProcessor, ToolResult } from "@/src/tool-engine/types";
import { b64EncodeUtf8, b64DecodeUtf8 } from "@/src/utils";
import { logger } from "@/src/lib/logger";

interface Base64Options extends Record<string, unknown> {
  mode: "encode" | "decode";
  urlSafe: boolean;
}

const processor: ToolProcessor<Base64Options> = {
  metadata: {
    version: "1.0.0",
    engineVersion: "1.0.0",
  },

  validate(input: unknown): string | null {
    if (typeof input !== "string" || input.trim().length === 0) {
      return "Please provide valid text to process.";
    }
    return null;
  },

  async execute(input: string, options: Base64Options, signal: AbortSignal, onProgress: (p: number) => void): Promise<ToolResult> {
    const start = performance.now();
    onProgress(0);
    
    if (signal.aborted) {
      return {
        status: "cancelled",
        outputType: "text",
        processingMs: performance.now() - start,
      };
    }

    try {
      let output = "";
      
      if (options.mode === "encode") {
        onProgress(30);
        const b64 = b64EncodeUtf8(input);
        output = options.urlSafe 
          ? b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "") 
          : b64;
      } else {
        onProgress(30);
        output = b64DecodeUtf8(input);
      }

      onProgress(100);

      return {
        status: "success",
        outputType: "text",
        text: output,
        mimeType: "text/plain",
        processingMs: performance.now() - start,
      };
    } catch (e: any) {
      logger.error("Base64 processing failed", {
        toolId: "base64",
        action: "execute",
        error: e.message
      });
      return {
        status: "error",
        outputType: "text",
        error: options.mode === "encode" ? "Encoding failed." : "Invalid Base64 input.",
        processingMs: performance.now() - start,
      };
    }
  }
};

export default processor;
