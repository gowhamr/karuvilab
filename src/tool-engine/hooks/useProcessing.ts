// src/tool-engine/hooks/useProcessing.ts
import { useCallback, useRef } from "react";
import { useToolStore } from "../store/toolStore";
import type { ToolConfig } from "../types/ToolConfig";
import type { ToolResult } from "../types/ToolResult";
import { logger } from "@/src/lib/logger";

export function useProcessing(config: ToolConfig) {
  const setPhase = useToolStore(s => s.setPhase);
  const setProgress = useToolStore(s => s.setProgress);
  const setResult = useToolStore(s => s.setResult);
  const setError = useToolStore(s => s.setError);

  const abortControllerRef = useRef<AbortController | null>(null);

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  const process = useCallback(async (input: unknown, options: any) => {
    cancel(); // Cancel any existing process
    
    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    const signal = abortController.signal;

    setPhase("validating");
    
    try {
      const processorModule = await config.processor();
      const processor = processorModule.default;

      // 1. Validation
      const validationError = processor.validate(input);
      if (validationError) {
        setError(validationError);
        return;
      }

      setPhase("processing");
      setProgress(0);

      // 2. Execution
      // The execute method itself handles dispatching to WorkerOrchestrator
      // and falling back to main thread if necessary, based on capabilities.
      const result = await processor.execute(
        input, 
        options, 
        signal, 
        (p) => setProgress(p)
      );

      if (signal.aborted) {
        throw new DOMException("Aborted", "AbortError");
      }

      if (result.status === "error") {
        setError(result.error || "An unknown error occurred during processing.");
      } else {
        setProgress(100);
        setResult(result);
      }
    } catch (e: any) {
      if (e.name === "AbortError") {
        setPhase("idle"); // reset to idle on cancel
      } else {
        logger.error(`[useProcessing] Error in tool ${config.id}:`, e);
        setError(e.message || "An unexpected error occurred.");
      }
    } finally {
      if (abortControllerRef.current === abortController) {
        abortControllerRef.current = null;
      }
    }
  }, [config, setPhase, setProgress, setResult, setError, cancel]);

  return { process, cancel };
}
