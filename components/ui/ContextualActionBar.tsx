"use client";

import React from "react";
import { m, AnimatePresence } from "framer-motion";
import { useContextualActionBar } from "@/src/store/useContextualActionBar";
import { Loader2 } from "lucide-react";

export function ContextualActionBar() {
  const visible = useContextualActionBar((s) => s.visible);
  const config = useContextualActionBar((s) => s.config);

  if (!visible || !config) return null;

  return (
    <div 
      className="fixed bottom-[calc(60px+env(safe-area-inset-bottom,0px))] left-0 right-0 z-30 md:hidden px-4 pb-2"
    >
      <m.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 15 }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
        className="w-full bg-mat-surface/95 backdrop-blur-md border border-mat-border rounded-2xl p-3 shadow-2xl flex items-center justify-between"
      >
        {config.type === "idle" && (
          <button
            onClick={config.onClick}
            className="w-full h-11 bg-brand-primary text-white font-black rounded-xl text-xs uppercase tracking-widest hover:opacity-90 active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            {config.label}
          </button>
        )}

        {config.type === "processing" && (
          <div className="w-full flex items-center gap-4">
            <div className="flex-1 space-y-1.5">
              <div className="flex items-center justify-between text-tiny font-bold uppercase tracking-widest-sm text-text-3">
                <span className="flex items-center gap-1.5">
                  <Loader2 className="w-3 h-3 animate-spin text-brand-primary" />
                  {config.label || "Processing..."}
                </span>
                <span>{Math.round(config.progress)}%</span>
              </div>
              <div className="w-full h-1.5 bg-mat-base rounded-full overflow-hidden">
                <div 
                  className="h-full bg-brand-primary transition-all duration-250"
                  style={{ width: `${config.progress}%` }}
                />
              </div>
            </div>
            {config.onCancel && (
              <button
                onClick={config.onCancel}
                className="px-3 py-2 text-tiny font-bold uppercase tracking-widest-sm text-red-500 hover:bg-red-500/5 rounded-lg border border-red-500/10 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        )}

        {config.type === "done" && (
          <div className="w-full flex gap-2">
            <button
              onClick={config.onPrimaryClick}
              className="flex-1 h-11 bg-brand-primary text-white font-black rounded-xl text-xs uppercase tracking-widest hover:opacity-90 active:scale-98 transition-all flex items-center justify-center"
            >
              {config.primaryLabel}
            </button>
            {config.secondaryLabel && config.onSecondaryClick && (
              <button
                onClick={config.onSecondaryClick}
                className="flex-1 h-11 bg-mat-base border border-mat-border text-text font-black rounded-xl text-xs uppercase tracking-widest hover:bg-mat-hover active:scale-98 transition-all flex items-center justify-center"
              >
                {config.secondaryLabel}
              </button>
            )}
          </div>
        )}
      </m.div>
    </div>
  );
}
