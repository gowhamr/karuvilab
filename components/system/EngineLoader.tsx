"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Loader2, AlertCircle, RefreshCw, ArrowLeft, WifiOff, CheckCircle2 } from "lucide-react";
import { m, AnimatePresence } from "framer-motion";

interface EngineLoaderProps {
  /**
   * Function to check if the engine is already initialized.
   */
  checkInit: () => boolean;
  /**
   * The actual tool component to render once ready.
   */
  children: React.ReactNode;
  /**
   * Optional loading message.
   */
  loadingMessage?: string;
  /**
   * Optional error message.
   */
  errorMessage?: string;
  /**
   * Timeout in milliseconds before showing an error. Default 10s.
   */
  timeout?: number;
}

/**
 * Enhanced EngineLoader Component
 * Implements KaruviLab UX loading standards:
 * - Dynamic stage message cycling (every 1.5-2s)
 * - Indeterminate progress bar
 * - Slow network detection notice (>3s)
 * - Offline status detection & badge
 * - Error state with Retry + Go Back actions
 */
export function EngineLoader({
  checkInit,
  children,
  loadingMessage = "Preparing processing engine...",
  errorMessage = "Failed to load engine. Please check your connection.",
  timeout = 10000,
}: EngineLoaderProps) {
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [isOffline, setIsOffline] = useState(false);

  // Monitor online / offline state
  useEffect(() => {
    setIsOffline(typeof navigator !== "undefined" ? !navigator.onLine : false);
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const check = useCallback(() => {
    if (checkInit()) {
      Promise.resolve().then(() => {
        setIsReady(true);
        setHasError(false);
      });
      return true;
    }
    return false;
  }, [checkInit]);

  useEffect(() => {
    if (check()) return;

    const startTime = Date.now();
    const tickInterval = setInterval(() => {
      setElapsedMs(Date.now() - startTime);
      if (check()) {
        clearInterval(tickInterval);
      }
    }, 100);

    const timeoutId = setTimeout(() => {
      if (!checkInit()) {
        setHasError(true);
        clearInterval(tickInterval);
        if (process.env.NODE_ENV === 'development') {
          console.error(`[EngineLoader] Timeout reached after ${timeout}ms`);
        }
      }
    }, timeout);

    return () => {
      clearInterval(tickInterval);
      clearTimeout(timeoutId);
    };
  }, [check, checkInit, timeout, retryCount]);

  const currentStageMessage = useMemo(() => {
    if (elapsedMs < 1500) {
      return loadingMessage;
    } else if (elapsedMs < 3500) {
      return "Initializing Web Worker & Local Engine...";
    } else if (elapsedMs < 6000) {
      return "🐢 Slow network detected. Still loading resources...";
    } else {
      return "Almost ready, finalizing tool setup...";
    }
  }, [elapsedMs, loadingMessage]);

  const handleRetry = useCallback(() => {
    setHasError(false);
    setIsReady(false);
    setElapsedMs(0);
    setRetryCount(prev => prev + 1);
  }, []);

  const handleGoBack = useCallback(() => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "/";
    }
  }, []);

  if (isReady) return <>{children}</>;

  return (
    <AnimatePresence mode="wait">
      {hasError ? (
        <m.div
          key="error"
          role="alert"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="p-8 md:p-12 bg-error/5 border border-error/20 rounded-4xl text-center space-y-6 max-w-lg mx-auto shadow-sm"
        >
          <div className="w-14 h-14 bg-error/10 rounded-2xl flex items-center justify-center mx-auto text-error">
            <AlertCircle className="w-7 h-7" aria-hidden="true" />
          </div>

          <div className="space-y-2">
            <h3 className="font-black text-text tracking-tight text-lg">Couldn't Load Tool Engine</h3>
            <p className="text-xs font-medium text-text-muted leading-relaxed max-w-sm mx-auto">
              {errorMessage}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={handleRetry}
              aria-label="Retry engine initialization"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-error text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all active:scale-95 shadow-md shadow-error/10 cursor-pointer min-h-11"
            >
              <RefreshCw className="w-4 h-4" aria-hidden="true" />
              Retry Initialization
            </button>
            <button
              onClick={handleGoBack}
              aria-label="Go back to previous page"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-surface border border-border text-text hover:bg-surface-elevated rounded-xl text-xs font-bold uppercase tracking-widest transition-all active:scale-95 cursor-pointer min-h-11"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              Go Back
            </button>
          </div>
        </m.div>
      ) : (
        <m.div
          key="loading"
          role="status"
          aria-live="polite"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="p-8 md:p-12 bg-surface border border-border rounded-4xl text-center space-y-6 max-w-md mx-auto shadow-sm"
        >
          <div className="relative w-14 h-14 bg-blue/10 rounded-2xl flex items-center justify-center mx-auto text-blue">
            <Loader2 className="w-7 h-7 animate-spin" aria-hidden="true" />
          </div>

          <div className="space-y-3">
            <p className="text-xs font-black text-blue uppercase tracking-widest leading-relaxed min-h-[32px] flex items-center justify-center">
              {currentStageMessage}
            </p>

            {/* Indeterminate Animated Progress Bar */}
            <div className="w-full h-1.5 bg-surface-elevated border border-border/50 rounded-full overflow-hidden relative">
              <div className="absolute inset-y-0 bg-blue rounded-full w-1/3 animate-pulse bg-gradient-to-r from-blue/40 via-blue to-blue/40" />
            </div>

            {/* Stage checklists */}
            <div className="pt-2 flex flex-col items-center gap-1.5 text-[11px] text-text-4 font-mono">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
                <span>UI Shell Ready</span>
              </div>
              <div className="flex items-center gap-1.5">
                {elapsedMs > 1500 ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
                ) : (
                  <span className="w-3.5 h-3.5 rounded-full border border-blue/40 border-t-transparent animate-spin shrink-0" />
                )}
                <span>Worker Threads & Cache</span>
              </div>
            </div>

            {/* Offline badge */}
            {isOffline && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-bold rounded-full mt-2">
                <WifiOff className="w-3 h-3" />
                <span>Offline Mode • Using Local Cached Assets</span>
              </div>
            )}
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
