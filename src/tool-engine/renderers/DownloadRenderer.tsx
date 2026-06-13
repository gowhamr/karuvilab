// src/tool-engine/renderers/DownloadRenderer.tsx
"use client";

import React, { useEffect } from "react";
import { Download, CheckCircle2 } from "lucide-react";
import type { ToolResult } from "../types/ToolResult";
import { useDownload } from "../hooks/useDownload";

export default function DownloadRenderer({ result }: { result: ToolResult }) {
  const { download } = useDownload();

  // Auto-download on mount
  useEffect(() => {
    download(result);
  }, [result, download]);

  return (
    <div className="p-8 md:p-12 bg-mat-surface border border-mat-border shadow-mat-shine rounded-4xl flex flex-col items-center justify-center text-center space-y-6 min-h-[320px]">
      <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-2">
        <CheckCircle2 className="w-10 h-10" />
      </div>
      <div className="space-y-2 max-w-md">
        <h2 className="text-xl font-black text-text">Processing Complete!</h2>
        <p className="text-sm text-text-4 font-bold">
          Your file has been downloaded automatically.
        </p>
      </div>
      <button
        onClick={() => download(result)}
        className="mt-4 flex items-center gap-2 px-8 py-4 bg-brand-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-brand-primary/20"
      >
        <Download className="w-4 h-4" />
        Download Again
      </button>
      <p className="text-xs text-text-4 uppercase tracking-widest font-black">
        {result.filename}
      </p>
    </div>
  );
}
