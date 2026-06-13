"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";

export default function ToolError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Tool Error Boundary:", error);

    // Detect if this is a chunk loading error
    const isChunkError = 
      error.message.includes("ChunkLoadError") || 
      error.message.toLowerCase().includes("loading chunk") ||
      error.message.toLowerCase().includes("loading failed");

    if (isChunkError) {
      const reloadKey = "karuvi.last_tool_reload";
      const lastReload = parseInt(sessionStorage.getItem(reloadKey) || "0");
      const now = Date.now();
      
      if (now - lastReload > 5000) {
        sessionStorage.setItem(reloadKey, now.toString());
        setTimeout(() => window.location.reload(), 500);
      }
    }
  }, [error]);

  return (
    <div className="max-w-xl mx-auto py-32 px-4 text-center space-y-8">
      <div className="relative inline-flex">
        <div className="absolute -inset-4 bg-red-500/10 blur-2xl rounded-full" />
        <div className="w-20 h-20 bg-surface border border-red-500/20 rounded-2xl flex items-center justify-center text-red-500 relative">
          <AlertTriangle className="w-10 h-10" />
        </div>
      </div>

      <div className="space-y-3">
        <h1 className="text-3xl font-black tracking-tight">Something went wrong</h1>
        <p className="text-text-3 font-medium">
          We encountered an error while loading this tool. This might be a temporary issue or a problem with the tool's logic.
        </p>
      </div>

      {error.digest && (
        <div className="px-4 py-2 bg-bg border border-border rounded-lg inline-block">
          <code className="text-xs font-mono text-text-4 uppercase tracking-widest">
            ID: {error.digest}
          </code>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
        <button
          onClick={reset}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-blue text-white font-black rounded-xl hover:scale-105 transition-all shadow-md shadow-blue/10"
        >
          <RefreshCcw className="w-4 h-4" />
          Try Again
        </button>
        <Link
          href="/"
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-surface border border-border text-text font-black rounded-xl hover:bg-bg transition-all"
        >
          <Home className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
