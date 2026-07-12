"use client";

import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from "react";

export type ProgressStage = string;

export interface ProgressState {
  isProcessing: boolean;
  stage: ProgressStage | null;
  progress: number | null; // 0-100, null if not calculable
  estimatedTimeRemaining: number | null; // in seconds
  error: Error | null;
  isSuccess: boolean;
  type: "instant" | "short" | "medium" | "heavy" | null;
  onCancel?: (() => void) | undefined;
}

export interface ProgressContextType {
  state: ProgressState;
  startProcessing: (type?: ProgressState["type"], onCancel?: (() => void) | undefined) => void;
  setStage: (stage: ProgressStage) => void;
  setProgress: (progress: number | null, estimatedTimeRemaining?: number | null) => void;
  finishProcessing: (success?: boolean, error?: Error | null) => void;
  resetProgress: () => void;
}

const initialState: ProgressState = {
  isProcessing: false,
  stage: null,
  progress: null,
  estimatedTimeRemaining: null,
  error: null,
  isSuccess: false,
  type: null,
  onCancel: undefined,
};

const ProgressContext = createContext<ProgressContextType | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState>(initialState);

  const startProcessing = useCallback((type: ProgressState["type"] = "medium", onCancel?: (() => void) | undefined) => {
    setState({ ...initialState, isProcessing: true, type, onCancel });
  }, []);

  const setStage = useCallback((stage: ProgressStage) => {
    setState((prev) => ({ ...prev, stage }));
  }, []);

  const setProgress = useCallback((progress: number | null, estimatedTimeRemaining: number | null = null) => {
    setState((prev) => ({ ...prev, progress, estimatedTimeRemaining }));
  }, []);

  const finishProcessing = useCallback((success: boolean = true, error: Error | null = null) => {
    setState((prev) => ({
      ...prev,
      isProcessing: false,
      isSuccess: success,
      error,
    }));
  }, []);

  const resetProgress = useCallback(() => {
    setState(initialState);
  }, []);

  const value = useMemo(
    () => ({
      state,
      startProcessing,
      setStage,
      setProgress,
      finishProcessing,
      resetProgress,
    }),
    [state, startProcessing, setStage, setProgress, finishProcessing, resetProgress]
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error("useProgress must be used within a ProgressProvider");
  }
  return context;
}
