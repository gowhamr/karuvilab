"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
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
 * Standard EngineLoader Component
 * Wraps any external script or dynamic import with a loading state, 
 * a timeout, and an error fallback.
 */
export function EngineLoader({
  checkInit,
  children,
  loadingMessage = "Preparing engine...",
  errorMessage = "Failed to load engine. Please check your connection.",
  timeout = 10000,
}: EngineLoaderProps) {
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const check = useCallback(() => {
    if (checkInit()) {
      setIsReady(true);
      setHasError(false);
      return true;
    }
    return false;
  }, [checkInit]);

  useEffect(() => {
    if (check()) return;

    const intervalId = setInterval(() => {
      if (check()) {
        clearInterval(intervalId);
      }
    }, 100);

    const timeoutId = setTimeout(() => {
      if (!checkInit()) {
        setHasError(true);
        clearInterval(intervalId);
        if (process.env.NODE_ENV === 'development') {
          console.error(`[EngineLoader] Timeout reached after ${timeout}ms`);
        }
      }
    }, timeout);

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [check, checkInit, timeout, retryCount]);

  const handleRetry = () => {
    setHasError(false);
    setIsReady(false);
    setRetryCount(prev => prev + 1);
  };

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
          className="p-8 bg-error/5 border border-error/10 rounded-4xl text-center space-y-4"
        >
          <div className="w-12 h-12 bg-error/10 rounded-2xl flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6 text-error" />
          </div>
          <div className="space-y-1">
            <h3 className="font-black text-text uppercase tracking-widest text-sm">Engine Load Failure</h3>
            <p className="text-xs font-bold text-text-4 uppercase leading-relaxed max-w-xs mx-auto">
              {errorMessage}
            </p>
          </div>
          <button
            onClick={handleRetry}
            className="flex items-center gap-2 px-6 py-2.5 bg-error text-white rounded-xl text-tiny font-bold uppercase tracking-widest-sm-lg hover:opacity-90 transition-all mx-auto active:scale-95 shadow-md shadow-error/10"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry Initialization
          </button>
        </m.div>
      ) : (
        <m.div
          key="loading"
          role="status"
          aria-live="polite"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="p-12 bg-surface border border-border rounded-4xl text-center space-y-4"
        >
          <div className="w-12 h-12 bg-blue/10 rounded-2xl flex items-center justify-center mx-auto">
            <Loader2 className="w-6 h-6 text-blue animate-spin" />
          </div>
          <p className="text-xs font-black text-blue uppercase tracking-widest-2xl animate-pulse">
            {loadingMessage}
          </p>
        </m.div>
      )}
    </AnimatePresence>
  );
}
