// src/tool-engine/core/ActionBar.tsx
"use client";

import React from "react";
import { RefreshCcw, Share2, Download, Copy } from "lucide-react";
import type { ToolResult } from "../types/ToolResult";
import type { ToolConfig } from "../types/ToolConfig";
import { useDownload } from "../hooks/useDownload";
import { CopyButton } from "@/components/ui/CopyButton";
import { useToast } from "@/components/ui/Toast";

interface ActionBarProps {
  result: ToolResult | null;
  config: ToolConfig;
  onReset: () => void;
}

export function ActionBar({ result, config, onReset }: ActionBarProps) {
  const { download } = useDownload();
  const { toast } = useToast();

  if (!result || result.status !== "success") return null;

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `KV - ${config.name}`,
          url: window.location.href,
        });
      } else {
        throw new Error("Share not supported");
      }
    } catch {
      navigator.clipboard.writeText(window.location.href);
      toast("Link copied to clipboard", "success");
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-150 fill-mode-both mt-4">
      {config.capabilities.downloadable && result.outputType !== "download" && result.blob && (
        <button
          onClick={() => download(result)}
          className="flex items-center gap-2 px-6 py-3 bg-brand-primary text-white rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-brand-primary/20"
        >
          <Download className="w-4 h-4" />
          Download
        </button>
      )}

      {result.outputType === "text" && result.text && (
        <CopyButton 
          text={result.text} 
          className="px-6 py-3 bg-mat-raised border border-mat-border rounded-xl text-xs font-black uppercase tracking-widest text-text-2 hover:bg-mat-hover hover:text-text transition-colors shadow-mat-shine"
          label="Copy Result"
        />
      )}

      <button
        onClick={onReset}
        className="flex items-center gap-2 px-6 py-3 bg-mat-raised border border-mat-border rounded-xl text-xs font-black uppercase tracking-widest text-text-2 hover:bg-mat-hover hover:text-text transition-colors shadow-mat-shine ml-auto"
      >
        <RefreshCcw className="w-4 h-4" />
        Process Another
      </button>

      <button
        onClick={handleShare}
        className="flex items-center gap-2 px-4 py-3 bg-mat-raised border border-mat-border rounded-xl text-text-3 hover:bg-mat-hover hover:text-brand-primary transition-colors shadow-mat-shine"
        aria-label="Share Tool"
      >
        <Share2 className="w-4 h-4" />
      </button>
    </div>
  );
}
