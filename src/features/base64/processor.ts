// src/features/base64/processor.ts
import type { ToolProcessor, ToolResult } from "@/src/tool-engine/types";
import { b64EncodeUtf8, b64DecodeUtf8 } from "@/src/utils";

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
    onProgress(0);
    
    if (signal.aborted) throw new DOMException("Aborted", "AbortError");

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
      };
    } catch (e: any) {
      return {
        status: "error",
        outputType: "text",
        error: options.mode === "encode" ? "Encoding failed." : "Invalid Base64 input.",
      };
    }
  }
};

export default processor;
