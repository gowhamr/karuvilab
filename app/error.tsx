"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);

    // Detect if this is a chunk loading error
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
    <div className="max-w-2xl mx-auto py-24 text-center space-y-6">
      <div className="text-8xl font-black text-red-500">Error</div>
      <h1 className="text-3xl font-bold">Something went wrong!</h1>
      <p className="text-text-3">
        An unexpected error occurred while rendering this page. We've been notified and are looking into it.
      </p>
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => reset()}
          className="px-6 py-3 bg-blue text-white font-bold rounded-xl hover:scale-102 transition-all"
        >
          Try again
        </button>
        <Link
          href="/"
          className="px-6 py-3 bg-bg border border-border text-text font-bold rounded-xl hover:bg-surface transition-all"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
