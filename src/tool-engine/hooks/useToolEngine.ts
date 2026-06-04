// src/tool-engine/hooks/useToolEngine.ts
import { useCallback, useEffect } from "react";
import { useToolStore } from "../store/toolStore";
import { useAnalytics } from "./useAnalytics";
import { useProcessing } from "./useProcessing";
import { useFileInput } from "./useFileInput";
import type { ToolConfig } from "../types/ToolConfig";

export function useToolEngine(config: ToolConfig) {
  const phase = useToolStore(s => s.phase);
  const progress = useToolStore(s => s.progress);
  const result = useToolStore(s => s.result);
  const error = useToolStore(s => s.error);
  const dragState = useToolStore(s => s.dragState);
  const resetStore = useToolStore(s => s.reset);

  const { trackView, trackEngagement, trackConversion } = useAnalytics(config.id);
  const { process, cancel } = useProcessing(config);
  const { validateFiles } = useFileInput(config.validation);

  // Auto-reset store on mount to ensure clean state
  useEffect(() => {
    resetStore();
    trackView();
    return () => {
      cancel();
    };
  }, [config.id, resetStore, cancel, trackView]);

  // Track conversions when result changes to success
  useEffect(() => {
    if (phase === "done" && result && result.status === "success") {
      trackConversion();
    }
  }, [phase, result, trackConversion]);

  const handleInput = useCallback(async (input: unknown, options: any = config.defaultOptions) => {
    trackEngagement();

    // If file input, run validation
    if (config.inputType === "file" || config.inputType === "batch") {
      const files = Array.isArray(input) ? input : [input];
      if (!validateFiles(files as File[])) {
        return; // Validation failed, error is set in store
      }
    }

    await process(input, options);
  }, [config, trackEngagement, validateFiles, process]);

  return {
    phase,
    progress,
    result,
    error,
    dragState,
    handleInput,
    cancel,
    reset: resetStore,
  };
}
