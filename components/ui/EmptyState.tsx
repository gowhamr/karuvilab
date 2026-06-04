/**
 * components/ui/EmptyState.tsx
 * Version 4.0 — Final production empty state component for KaruviLab tools.
 * Supports Hybrid Material 2.0 design system and local analytics.
 */

"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { m, AnimatePresence, motion } from "framer-motion";
import { 
  LucideIcon, 
  Upload, 
  FileText, 
  Settings, 
  Layers, 
  Eye, 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  FileWarning, 
  CircleX as XCircleIcon,
  PlayCircle
} from "lucide-react";
import { useAnalyticsStore } from "@/src/store/analyticsStore";
import { SampleAssetKey, loadSample } from "@/src/data/sampleAssets";
import { cn } from "@/src/lib/utils";
import { usePerformanceSettings } from "@/src/lib/hooks";
import { useReducedMotion } from "framer-motion";

interface EmptyStateProps {
  // Required
  icon:         LucideIcon;
  headline:     string;
  toolType:     "file" | "text" | "generator" | "batch" | "viewer";
  toolId:       SampleAssetKey;
  onDrop:       (files: File[]) => void;
  dragState:    "idle" | "hover" | "over" | "rejected";

  // Constraints
  formats?:     string[];
  maxSize?:     string;
  maxFiles?:    string;
  outputFormats?: string[];

  // Sub-action
  subAction?: {
    label:    string;
    onClick:  () => void;
  };

  // Trust (rotate A/B/C to prevent banner blindness)
  trustVariant?: "A" | "B" | "C";

  // Outcome line (max 60 chars, verb-first)
  outcomeText?: string;

  // Sample CTA
  sampleCTA?: {
    label:    string;
    onClick?: () => void;
  };

  // Returning user
  lastSession?: {
    label:      string;
    onRestore:  () => void;
    onDismiss:  () => void;
  };

  // Events
  onDragOver?:  () => void;
  onDragLeave?: () => void;
  
  // Custom class
  className?: string;
}

export function EmptyState({
  icon: Icon,
  headline,
  toolType,
  toolId,
  onDrop,
  dragState,
  formats,
  maxSize,
  maxFiles,
  outputFormats,
  subAction,
  trustVariant = "A",
  outcomeText,
  sampleCTA,
  lastSession,
  onDragOver,
  onDragLeave,
  className
}: EmptyStateProps) {
  const { recordView, recordEngagement, recordBounce } = useAnalyticsStore();
  const shouldReduceMotion = useReducedMotion();
  const hasEngaged = useRef(false);
  const [isRejected, setIsRejected] = useState(false);

  // Record view on mount
  useEffect(() => {
    recordView(toolId);
    
    const handleExit = () => {
      if (!hasEngaged.current) {
        recordBounce(toolId);
      }
    };

    window.addEventListener("pagehide", handleExit);
    return () => {
      handleExit();
      window.removeEventListener("pagehide", handleExit);
    };
  }, [toolId, recordView, recordBounce]);

  const handleEngagement = useCallback(() => {
    if (!hasEngaged.current) {
      hasEngaged.current = true;
      recordEngagement(toolId);
    }
  }, [toolId, recordEngagement]);

  const handleSampleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    handleEngagement();
    if (sampleCTA?.onClick) {
      sampleCTA.onClick();
    } else {
      const sample = await loadSample(toolId);
      if (sample) {
        if (Array.isArray(sample)) {
          onDrop(sample);
        } else if (sample instanceof File) {
          onDrop([sample]);
        } else if (typeof sample === 'string') {
          // For text tools, we might need a different callback, 
          // but following the spec onDrop handles the sample logic.
          // In practice, text tools might use onPaste or similar.
          // For now, we wrap the string as a "virtual" file for consistency.
          const file = new File([sample], "sample.txt", { type: "text/plain" });
          onDrop([file]);
        }
      }
    }
  };

  const handleZoneClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleEngagement();
    if (subAction?.onClick) {
      subAction.onClick();
    }
  };

  // Effect for rejected state animation
  useEffect(() => {
    if (dragState === "rejected") {
      setIsRejected(true);
      const timer = setTimeout(() => setIsRejected(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [dragState]);

  const trustSignals = {
    A: { title: "100% Local Processing", desc: "No uploads. No account. No tracking." },
    B: { title: "Privacy First Architecture", desc: "Your data never leaves your device." },
    C: { title: "Secure Browser Execution", desc: "Sandbox-isolated. Fully offline capable." }
  };

  const trust = trustSignals[trustVariant];

  return (
    <motion.div layout className={cn("flex flex-col gap-4 w-full", className)}>
      {/* Layer 0: Returning User Banner */}
      <AnimatePresence>
        {lastSession && (
          <m.div
            layout
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-between bg-mat-raised border border-mat-border-focus rounded-xl px-4 h-11 shadow-mat-shine"
            role="status"
            aria-live="polite"
          >
            <span className="text-sm text-text-3 font-bold truncate">
              ↩ {lastSession.label} · Continue?
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => { handleEngagement(); lastSession.onRestore(); }}
                className="text-sm font-black text-brand-primary min-w-[44px] min-h-[44px] flex items-center justify-center hover:opacity-80 transition-opacity"
              >
                Restore
              </button>
              <button
                onClick={lastSession.onDismiss}
                aria-label="Dismiss restore banner"
                className="min-w-[44px] min-h-[44px] flex items-center justify-center text-text-4 hover:text-text transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </m.div>
        )}
      </AnimatePresence>

      {/* Main Empty Zone */}
      <m.div
        layout
        onDragOver={(e) => { e.preventDefault(); onDragOver?.(); }}
        onDragLeave={onDragLeave}
        onDrop={(e) => { e.preventDefault(); handleEngagement(); }}
        className={cn(
          "relative flex flex-col items-center justify-center text-center transition-all duration-200 cursor-pointer overflow-hidden",
          "border-2 border-dashed rounded-[32px] p-8 md:p-12 min-h-[240px] md:min-h-[320px]",
          dragState === "idle" && "border-mat-border bg-transparent hover:border-brand-primary/40 hover:bg-brand-primary/5",
          dragState === "over" && "border-brand-primary bg-brand-primary/10",
          dragState === "rejected" && "border-error bg-error/5 animate-shake",
          isRejected && "animate-shake"
        )}
        onClick={handleZoneClick}
      >
        {/* Layer 1: Zone Icon */}
        <div className={cn(
          "mb-6 p-6 rounded-3xl bg-mat-base border border-mat-border transition-all duration-300",
          dragState === "over" ? "scale-110 text-brand-primary border-brand-primary/30" : "text-text-4",
          isRejected && "text-error border-error/30"
        )}>
          {isRejected ? (
            <XCircleIcon className="w-12 h-12" />
          ) : (
            <Icon className="w-12 h-12" />
          )}
        </div>

        {/* Layer 2: Headline */}
        <h2 className={cn(
          "text-xl md:text-2xl font-black text-text mb-2 tracking-tight",
          dragState === "over" && "text-brand-primary"
        )}>
          {dragState === "over" ? `Release to ${headline.split(' ').pop()}` : 
           isRejected ? "File type not supported" : headline}
        </h2>

        {/* Layer 3: Sub-action */}
        <div className="mb-8">
           <button 
             className="md:hidden w-full h-11 px-6 bg-mat-raised border border-mat-border rounded-xl text-sm font-bold text-text-2 hover:bg-mat-hover transition-colors"
           >
             Browse files
           </button>
           <p className="hidden md:block text-sm font-bold text-text-4">
             or <span className="text-brand-primary hover:underline">browse files</span> from your device
           </p>
        </div>

        {/* Layer 4: Constraints */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {formats?.map(f => (
            <span key={f} className="px-2 py-1 bg-mat-raised border border-mat-border rounded-md text-[10px] font-black uppercase text-text-3">
              {f}
            </span>
          ))}
          {maxSize && (
            <span className="text-[10px] font-bold text-text-4 px-2">
              Max: {maxSize}
            </span>
          )}
        </div>

        {/* Layer 5: Trust Signal */}
        <div className="mb-8 flex flex-col items-center gap-1">
          <div className="flex items-center gap-2 text-emerald-500">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-xs font-black uppercase tracking-widest">{trust.title}</span>
          </div>
          <p className="text-[10px] font-bold text-text-4 opacity-60">
            {trust.desc}
          </p>
        </div>

        {/* Layer 6: Outcome Line */}
        {outcomeText && (
          <div className="mb-8 w-full max-w-[280px] border-t border-mat-border pt-4">
            <p className="text-[11px] font-bold text-text-4 truncate" title={outcomeText}>
              Result: {outcomeText.replace(/^Result:\s*/i, '')}
            </p>
          </div>
        )}

        {/* Layer 7: Sample CTA */}
        <button
          onClick={handleSampleClick}
          className="w-full md:w-auto h-11 px-6 bg-brand-primary/10 border border-brand-primary/20 rounded-xl text-xs font-black uppercase tracking-widest text-brand-primary hover:bg-brand-primary/20 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <PlayCircle className="w-4 h-4" />
          {sampleCTA?.label || "Try Sample File"}
        </button>
      </m.div>

      {/* Global CSS for shake animation if not present */}
      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.3s cubic-bezier(.36,.07,.19,.97) both;
          animation-iteration-count: 3;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-shake { animation: none; }
        }
      `}</style>
    </motion.div>
  );
}
