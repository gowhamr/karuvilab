"use client";

import React, { useState } from "react";
import { AlertCircle, Code, RotateCcw, Copy, Check, ShieldAlert, Cpu, Clock, HelpCircle } from "lucide-react";
import { MermaidErrorKind } from "../types";

interface MermaidErrorCardProps {
  error: string;
  source: string;
  errorKind?: MermaidErrorKind | undefined;
  onRetry?: () => void;
}

export function MermaidErrorCard({ error, source, errorKind = "RENDER_ERROR", onRetry }: MermaidErrorCardProps) {
  const [showSource, setShowSource] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(source);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getErrorBadge = () => {
    switch (errorKind) {
      case "COMPLEXITY_LIMIT":
        return {
          label: "Complexity Limit Exceeded",
          icon: Cpu,
        };
      case "TIMEOUT":
        return {
          label: "Render Timeout",
          icon: Clock,
        };
      case "UNSUPPORTED_DIAGRAM":
        return {
          label: "Unsupported Diagram Syntax",
          icon: HelpCircle,
        };
      case "SANITIZATION_ERROR":
        return {
          label: "Security Violation",
          icon: ShieldAlert,
        };
      case "SYNTAX_ERROR":
      default:
        return {
          label: "Diagram Syntax Error",
          icon: AlertCircle,
        };
    }
  };

  const badge = getErrorBadge();
  const Icon = badge.icon;

  return (
    <div className="my-6 border border-error/20 bg-error/5 rounded-2xl overflow-hidden shadow-xs">
      <div className="px-4 py-3 bg-error/10 border-b border-error/20 flex items-center justify-between">
        <div className="flex items-center gap-2 text-error text-xs font-bold">
          <Icon className="w-4 h-4 shrink-0" />
          <span>{badge.label}</span>
        </div>
        <div className="flex items-center gap-2">
          {onRetry && (
            <button
              onClick={onRetry}
              className="flex items-center gap-1 px-2.5 py-1 bg-surface border border-border rounded-lg text-text-3 hover:text-blue hover:border-blue transition-all text-xs font-semibold"
              title="Retry rendering diagram"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Retry</span>
            </button>
          )}
          <button
            onClick={() => setShowSource(!showSource)}
            className="flex items-center gap-1 px-2.5 py-1 bg-surface border border-border rounded-lg text-text-3 hover:text-blue hover:border-blue transition-all text-xs font-semibold"
          >
            <Code className="w-3 h-3" />
            <span>{showSource ? "Hide Source" : "View Source"}</span>
          </button>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <p className="text-xs text-text-2 font-mono break-words bg-surface/50 p-2.5 rounded-lg border border-border/50">
          {error}
        </p>

        {showSource && (
          <div className="relative mt-2">
            <pre className="p-3 bg-bg border border-border rounded-xl text-xs font-mono text-text-2 overflow-x-auto max-h-60 leading-relaxed">
              <code>{source}</code>
            </pre>
            <button
              onClick={handleCopy}
              className="absolute right-2 top-2 p-1.5 bg-surface border border-border rounded-lg text-text-muted hover:text-blue transition-all"
              title="Copy source"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
