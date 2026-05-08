"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex flex-col items-center justify-center p-12 bg-blue/5 border border-blue/10 rounded-3xl space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-black">Something went wrong</h2>
              <p className="text-text-3 text-sm max-w-xs mx-auto">
                The tool encountered an unexpected error while processing. Your data remains private and was not sent anywhere.
              </p>
            </div>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="flex items-center gap-2 px-6 py-3 bg-blue text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue/20 hover:scale-105 active:scale-95 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
