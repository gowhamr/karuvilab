"use client";

import React from "react";
import { AlertTriangle, WifiOff, FileWarning, RefreshCw, FilePlus } from "lucide-react";
import { m, AnimatePresence } from "framer-motion";
import { cn } from "@/src/lib/utils";

interface MediaErrorBannerProps {
  title: string;
  description: string;
  retryAction?: () => void;
  changeFileAction?: () => void;
  errorCode?: string;
  className?: string;
}

export function MediaErrorBanner({
  title,
  description,
  retryAction,
  changeFileAction,
  errorCode,
  className,
}: MediaErrorBannerProps) {
  const getIcon = () => {
    if (errorCode === "UNSUPPORTED_FORMAT") return <FileWarning className="w-5 h-5 text-error" />;
    if (errorCode === "ENGINE_LOAD_FAILED") return <WifiOff className="w-5 h-5 text-amber-500" />;
    return <AlertTriangle className="w-5 h-5 text-error" />;
  };

  return (
    <m.div
      role="alert"
      aria-live="assertive"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "p-6 rounded-4xl border-l-4 shadow-sm backdrop-blur-md flex flex-col md:flex-row gap-6 items-start md:items-center justify-between",
        errorCode === "ENGINE_LOAD_FAILED" 
          ? "bg-amber-500/5 border-amber-500/40 text-warning" 
          : "bg-error/5 border-error/40 text-danger",
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div className={cn(
          "p-3 rounded-2xl shrink-0",
          errorCode === "ENGINE_LOAD_FAILED" ? "bg-amber-500/10" : "bg-error/10"
        )}>
          {getIcon()}
        </div>
        <div className="space-y-1">
          <h3 className="font-black text-sm uppercase tracking-widest leading-none">{title}</h3>
          <p className="text-xs font-bold opacity-70 leading-relaxed">{description}</p>
          {errorCode && (
            <span className="inline-block mt-2 px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/5 text-micro font-mono font-black uppercase tracking-tighter opacity-50">
              Error Code: {errorCode}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
        {retryAction && (
          <button
            onClick={retryAction}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue text-white rounded-xl text-tiny font-bold uppercase tracking-widest-sm-lg hover:opacity-90 active:scale-95 transition-all shadow-md shadow-blue/10"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry
          </button>
        )}
        {changeFileAction && (
          <button
            onClick={changeFileAction}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-surface border border-border text-text-2 rounded-xl text-tiny font-bold uppercase tracking-widest-sm-lg hover:border-blue/50 transition-all active:scale-95 shadow-sm"
          >
            <FilePlus className="w-3.5 h-3.5" />
            Try Different File
          </button>
        )}
      </div>
    </m.div>
  );
}
