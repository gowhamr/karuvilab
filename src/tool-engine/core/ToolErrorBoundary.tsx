// src/tool-engine/core/ToolErrorBoundary.tsx
import React, { Component, ReactNode } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { logger } from "@/src/lib/logger";

interface Props {
  children: ReactNode;
  toolId: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ToolErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error(`[ToolErrorBoundary] Tool ${this.props.toolId} crashed:`, { 
      toolId: this.props.toolId,
      action: 'error_boundary_catch',
      error: { message: error.message, stack: error.stack, info: errorInfo }
    });
  }


  private reset = () => {
    this.setState({ hasError: false, error: null });
  };

  public override render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 bg-mat-surface border border-mat-border shadow-mat-shine rounded-4xl flex flex-col items-center justify-center text-center space-y-6">
          <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-2">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div className="space-y-2 max-w-md">
            <h2 className="text-xl font-black text-text">An unexpected error occurred</h2>
            <p className="text-sm text-text-4">
              We encountered a problem while running this tool. Our team has been notified.
            </p>
          </div>
          <button
            onClick={this.reset}
            autoFocus
            className="flex items-center gap-2 px-6 py-3 bg-mat-raised border border-mat-border rounded-xl text-sm font-bold text-text-2 hover:bg-mat-hover hover:text-text transition-colors outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/50"
          >
            <RefreshCw className="w-4 h-4" />
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
