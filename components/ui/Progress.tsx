"use client";

import React, { useEffect } from "react";
import { m, AnimatePresence } from "framer-motion";
import { useProgress } from "@/src/contexts/ProgressContext";
import { Spinner } from "./Spinner";
import { cn } from "@/src/lib/utils";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Button, ButtonProps } from "./Button";

/**
 * ProgressBar: A simple horizontal progress bar component
 */
export function ProgressBar({ progress, className }: { progress: number | null; className?: string }) {
  const isIndeterminate = progress === null;
  return (
    <div className={cn("w-full h-2 bg-surface-elevated overflow-hidden rounded-full", className)}>
      {isIndeterminate ? (
        <div className="h-full bg-primary animate-pulse w-full rounded-full" />
      ) : (
        <div
          className="h-full bg-primary transition-all duration-300 ease-out rounded-full"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      )}
    </div>
  );
}

/**
 * ProgressOverlay: Used for heavy tasks (>3s)
 */
export function ProgressOverlay() {
  const { state } = useProgress();

  if (!state.isProcessing || state.type !== "heavy") return null;

  return (
    <AnimatePresence>
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-dropdown flex items-center justify-center bg-surface/80 backdrop-blur-sm p-4"
        aria-busy="true"
        aria-live="assertive"
      >
        <m.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: -10 }}
          className="bg-surface border border-border shadow-2xl rounded-3xl p-8 max-w-sm w-full space-y-6 flex flex-col items-center text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>

          <div className="space-y-2 w-full">
            <h3 className="text-xl font-black text-text-primary">Processing...</h3>
            {state.stage && (
              <p className="text-sm font-bold text-text-secondary animate-pulse">{state.stage}</p>
            )}
          </div>

          <ProgressBar progress={state.progress} className="w-full" />

          {state.estimatedTimeRemaining !== null && (
            <p className="text-xs font-bold text-text-muted">
              Estimated time: {Math.ceil(state.estimatedTimeRemaining)}s
            </p>
          )}

          {state.onCancel && (
            <Button variant="danger" size="sm" onClick={state.onCancel} className="mt-4 w-full">
              Cancel
            </Button>
          )}
        </m.div>
      </m.div>
    </AnimatePresence>
  );
}

/**
 * InlineProgress: Used for medium tasks (1-3s)
 */
export function InlineProgress() {
  const { state } = useProgress();

  if (!state.isProcessing || state.type !== "medium") return null;

  return (
    <AnimatePresence>
      <m.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        className="flex items-center gap-3 p-4 bg-surface-elevated border border-border rounded-xl text-text-primary"
        aria-busy="true"
        aria-live="polite"
      >
        <Spinner size="sm" className="text-primary border-primary border-t-transparent" />
        <span className="text-sm font-bold">{state.stage || "Processing..."}</span>
      </m.div>
    </AnimatePresence>
  );
}

/**
 * ProgressButton: Replaces standard Button when short/medium task is running
 */
export function ProgressButton({
  children,
  onClick,
  ...props
}: ButtonProps & { onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void | Promise<void> }) {
  const { state } = useProgress();
  const isRunning = state.isProcessing;

  return (
    <Button
      {...props}
      onClick={onClick}
      disabled={props.disabled || isRunning}
      loading={props.loading || (isRunning && state.type === "short")}
    >
      {isRunning && state.type === "short" ? "Processing..." : children}
    </Button>
  );
}

/**
 * ProgressToast: Automatically triggers success/error toasts based on state
 */
export function ProgressToast() {
  const { state, resetProgress } = useProgress();

  useEffect(() => {
    if (!state.isProcessing && state.type !== null) {
      if (state.isSuccess) {
        toast.success("Completed", {
          icon: <CheckCircle className="w-5 h-5 text-success" />,
        });
      } else if (state.error) {
        toast.error(state.error.message || "Processing failed", {
          icon: <XCircle className="w-5 h-5 text-error" />,
        });
      }
      // We don't reset immediately to allow the user to see the success state if needed,
      // but in this model, we can reset after a small delay.
      const timer = setTimeout(() => {
        resetProgress();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [state.isProcessing, state.isSuccess, state.error, state.type, resetProgress]);

  return null;
}
