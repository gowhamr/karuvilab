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
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public override render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div 
            role="alert" 
            aria-live="assertive"
            className="flex flex-col items-center justify-center p-12 bg-blue/5 border border-blue/10 rounded-3xl space-y-6 text-center animate-in fade-in zoom-in-95 duration-500"
          >
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-black">Something went wrong</h2>
              <p className="text-text-3 text-sm max-w-xs mx-auto">
                The tool encountered an unexpected error while processing. Your data remains private and was not sent anywhere.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
              <button
                onClick={() => {
                  this.setState({ hasError: false });
                  // Optionally trigger a re-render or notification
                }}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue/20 hover:scale-105 active:scale-95 transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                Retry Operation
              </button>
              <button
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.location.reload();
                  }
                }}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-surface border border-border rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue/5 hover:text-blue hover:border-blue/20 transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                Reset Tool
              </button>
              <button
                onClick={() => useSupportStore.getState().openFeedback("bug", { 
                  error: this.state.error?.message || "Unknown error",
                  stack: this.state.error?.stack
                })}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-surface border border-border rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue/5 hover:text-blue hover:border-blue/20 transition-all"
              >
                <Flag className="w-4 h-4" />
                Report
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
