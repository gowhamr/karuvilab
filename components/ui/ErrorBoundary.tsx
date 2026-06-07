"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Flag } from "lucide-react";
import { useSupportStore } from "@/src/store/useSupportStore";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error | undefined;
  showDetails: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    showDetails: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, showDetails: false };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);

    // Detect if this is a chunk loading error
    const isChunkError = 
      error.message.includes("ChunkLoadError") || 
      error.message.toLowerCase().includes("loading chunk") ||
      error.message.toLowerCase().includes("loading failed");

    if (isChunkError) {
      const reloadKey = "karuvi.last_component_reload";
      const lastReload = parseInt(sessionStorage.getItem(reloadKey) || "0");
      const now = Date.now();
      
      if (now - lastReload > 5000) {
        sessionStorage.setItem(reloadKey, now.toString());
        setTimeout(() => window.location.reload(), 500);
      }
    }
  }

  public override render() {
    if (this.state.hasError) {
      const errorMsg = this.state.error?.message || "Unknown error";
      const errorStack = this.state.error?.stack || "";
      
      return (
        this.props.fallback || (
          <div 
            role="alert" 
            aria-live="assertive"
            className="flex flex-col items-center justify-center p-8 sm:p-12 bg-surface border border-border rounded-5xl space-y-8 text-center animate-in fade-in zoom-in-95 duration-500 shadow-2xl shadow-red-500/5 overflow-hidden"
          >
            <div className="w-20 h-20 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 relative">
              <AlertTriangle className="w-10 h-10" />
              <div className="absolute inset-0 rounded-2xl border border-red-500/20 animate-ping" />
            </div>
            
            <div className="space-y-3">
              <h2 className="text-2xl font-black uppercase tracking-tight">Technical Failure</h2>
              <p className="text-text-3 text-sm max-w-sm mx-auto font-medium leading-relaxed">
                The tool encountered an unexpected critical error. Your data remains safe and local.
              </p>
            </div>

            <div className="flex flex-col gap-3 w-full max-w-sm">
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: undefined, showDetails: false });
                }}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                Retry Component
              </button>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => typeof window !== 'undefined' && window.location.reload()}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-bg border border-border rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-blue/30 transition-all"
                >
                  <RefreshCw className="w-3 h-3" />
                  Reload App
                </button>
                <button
                  onClick={() => useSupportStore.getState().openFeedback("bug", { 
                    error: errorMsg,
                    stack: errorStack,
                    metadata: {
                      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
                      url: typeof window !== 'undefined' ? window.location.href : 'unknown'
                    }
                  })}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-bg border border-border rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-red-500/30 hover:text-red-500 transition-all"
                >
                  <Flag className="w-3 h-3" />
                  Report Issue
                </button>
              </div>
            </div>

            <div className="w-full max-w-md pt-4">
              <button 
                onClick={() => this.setState(s => ({ showDetails: !s.showDetails }))}
                className="text-[10px] font-black uppercase tracking-widest text-text-4 hover:text-blue transition-colors mb-4"
              >
                {this.state.showDetails ? "Hide Error Details" : "Show Error Details"}
              </button>
              
              {this.state.showDetails && (
                <div className="text-left p-6 bg-bg border border-border rounded-2xl overflow-auto max-h-60 animate-in slide-in-from-top-4 duration-300">
                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] font-black uppercase text-red-500 mb-1">Error Message</p>
                      <code className="text-xs font-mono text-text-2 break-all">{errorMsg}</code>
                    </div>
                    {errorStack && (
                      <div>
                        <p className="text-[10px] font-black uppercase text-text-4 mb-1">Stack Trace</p>
                        <code className="text-[10px] font-mono text-text-4 block whitespace-pre-wrap break-all leading-tight">
                          {errorStack}
                        </code>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
