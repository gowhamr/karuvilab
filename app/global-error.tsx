"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

/**
 * KaruviLab Root Error Boundary
 * This is the 'last resort' error page that wraps the entire HTML/Body.
 * It detects chunk loading failures and automatically reloads the page.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Critical Error:", error);

    // Detect if this is a chunk loading error (common after new deployments)
    const isChunkError = 
      error.message.includes("ChunkLoadError") || 
      error.message.toLowerCase().includes("loading chunk") ||
      error.message.toLowerCase().includes("loading failed");

    if (isChunkError) {
      console.warn("Chunk error detected. Triggering automatic reload...");
      
      // Prevent infinite reload loops
      const reloadKey = "karuvi.last_reload";
      const lastReload = parseInt(sessionStorage.getItem(reloadKey) || "0");
      const now = Date.now();
      
      if (now - lastReload > 5000) { // Only auto-reload if last one was > 5s ago
        sessionStorage.setItem(reloadKey, now.toString());
        setTimeout(() => window.location.reload(), 1000);
      }
    }
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-[#020617] text-[#F8FAFC] antialiased">
        <div className="min-h-screen flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full space-y-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="relative inline-flex mx-auto">
              <div className="absolute -inset-4 bg-red-500/10 blur-2xl rounded-full" />
              <div className="w-20 h-20 bg-[#0F172A] border border-red-500/20 rounded-2xl flex items-center justify-center text-red-500 relative">
                <AlertTriangle className="w-10 h-10" />
              </div>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl font-black tracking-tight">System Error</h1>
              <p className="text-[#94A3B8] font-medium leading-relaxed">
                KaruviLab encountered a critical failure while loading the application shell. 
                We are attempting to recover automatically.
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-4">
              <button
                onClick={() => reset()}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#4F46E5] text-white font-black rounded-2xl text-sm uppercase tracking-widest shadow-lg shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <RefreshCcw className="w-4 h-4" />
                Reload Application
              </button>
              
              <button
                onClick={() => window.location.href = "/"}
                className="w-full px-6 py-4 bg-[#0F172A] border border-[#1E293B] text-[#F8FAFC] font-black rounded-2xl text-sm uppercase tracking-widest hover:bg-[#020617] transition-all"
              >
                Go to Home
              </button>
            </div>
            
            {error.digest && (
              <div className="pt-8">
                <code className="text-[10px] font-mono text-[#64748B] uppercase tracking-widest opacity-50">
                  ID: {error.digest}
                </code>
              </div>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}
