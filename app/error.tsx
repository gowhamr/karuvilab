"use client";

import { useEffect } from "react";
import Link from "next/link";
import { logger } from "@/src/lib/logger";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";


export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error(error.message, { action: "page-error", error });

    // Auto-recover from chunk loading errors (stale deploys)
    const isChunkError =
      error.message.includes("ChunkLoadError") ||
      error.message.toLowerCase().includes("loading chunk") ||
      error.message.toLowerCase().includes("loading failed");

    if (isChunkError) {
      const reloadKey = "karuvi.last_page_reload";
      const lastReload = parseInt(sessionStorage.getItem(reloadKey) || "0");
      const now = Date.now();

      if (now - lastReload > 5000) {
        sessionStorage.setItem(reloadKey, now.toString());
        setTimeout(() => window.location.reload(), 500);
      }
    }
  }, [error]);

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="min-h-[60vh] flex flex-col items-center justify-center max-w-2xl mx-auto px-4 py-24 text-center space-y-8"
    >
      <div className="w-20 h-20 rounded-full bg-error/10 flex items-center justify-center">
        <AlertTriangle className="w-10 h-10 text-error" aria-hidden="true" />
      </div>

      <div className="space-y-3">
        <h1 className="text-3xl font-black tracking-tight text-text">Something went wrong</h1>
        <p className="text-text-3 leading-relaxed max-w-md mx-auto">
          An unexpected error occurred while rendering this page.
          {error.digest && (
            <span className="block mt-2 text-xs font-mono text-text-4 opacity-60">
              Error ID: {error.digest}
            </span>
          )}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={() => reset()}
          aria-label="Retry loading this page"
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:opacity-90 active:scale-95 transition-all min-h-11 shadow-lg shadow-primary/20"
        >
          <RefreshCw className="w-4 h-4" aria-hidden="true" />
          Try again
        </button>
        <Link
          href="/"
          className="flex items-center gap-2 px-6 py-3 bg-surface border border-border text-text font-bold rounded-xl hover:bg-surface-elevated active:scale-95 transition-all min-h-11"
        >
          <Home className="w-4 h-4" aria-hidden="true" />
          Back to home
        </Link>
      </div>
    </div>
  );
}
