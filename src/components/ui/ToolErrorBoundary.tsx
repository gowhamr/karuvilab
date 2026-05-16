"use client";

import React, { Component, ReactNode } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ToolErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Tool Error Boundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false } as unknown as Pick<State, "hasError">);
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  override render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center p-8 bg-surface border border-border rounded-2xl max-w-lg mx-auto my-8 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-semibold text-text mb-2">Something went wrong</h2>
          <p className="text-text-2 text-center mb-6 max-w-md">
            The tool encountered an unexpected error. Your data is safe, but the tool needs to be restarted.
          </p>
          <button
            onClick={this.handleReset}
            className="flex items-center px-4 py-2 bg-blue text-white rounded-lg hover:bg-blue-dark transition-colors"
          >
            <RefreshCcw className="w-4 h-4 mr-2" />
            Restart Tool
          </button>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded w-full overflow-auto text-xs text-left">
              <pre className="text-red-500">{this.state.error.message}</pre>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
