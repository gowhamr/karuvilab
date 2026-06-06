/**
 * components/ui/EmptyState.tsx
 * Version 4.1 — Deterministic trust rotation.
 */

"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { m, AnimatePresence, motion } from "framer-motion";
import { 
  LucideIcon, 
  X, 
  ShieldCheck, 
  CircleX as XCircleIcon,
  PlayCircle
} from "lucide-react";
import { useAnalyticsStore } from "@/src/store/analyticsStore";
import { SampleAssetKey, loadSample } from "@/src/data/sampleAssets";
import { cn } from "@/src/lib/utils";
import { useReducedMotion } from "framer-motion";

const TRUST_COPY: Record<"A" | "B" | "C", { title: string, desc: string }> = {
  A: { title: "Processing: 100% Local", desc: "No uploads. No account. No tracking." },
  B: { title: "Your files never leave this device", desc: "Privacy-first architecture. 100% secure." },
  C: { title: "Zero server contact. Ever.", desc: "Sandbox-isolated. Fully offline capable." }
} as const;

const TRUST_VARIANTS = ["A", "B", "C"] as const;

const dragStateClasses = {
  idle:     "border-dashed border-[--kv-mat-border]",
  hover:    "border-dashed border-[--kv-brand-primary]/40 bg-[--kv-brand-primary]/4",
  over:     "border-solid border-[--kv-brand-primary] bg-[--kv-brand-primary]/8",
  rejected: "border-solid border-red-500 bg-red-500/6",
} as const;

/**
 * Resolves trust variant for a tool.
 * If explicitly set in config → use it.
 * Otherwise → derive from toolId deterministically.
 */
function resolveTrustVariant(
  configured: "A" | "B" | "C" | undefined,
  toolId:     string
): "A" | "B" | "C" {
  if (configured) return configured;

  const index = toolId
    .split("")
    .reduce((sum, char) => sum + char.charCodeAt(0), 0)
    % TRUST_VARIANTS.length;

  return TRUST_VARIANTS[index] as "A" | "B" | "C";
}

interface EmptyStateProps {
  icon:         LucideIcon;
  headline:     string;
  toolType:     "file" | "text" | "generator" | "batch" | "viewer";
  toolId:       SampleAssetKey;
  onDrop:       (files: File[]) => void;
  dragState:    "idle" | "hover" | "over" | "rejected";
  formats?:     string[] | undefined;
  maxSize?:     string | undefined;
  maxFiles?:    string | undefined;
  subAction?: {
    label:    string;
    onClick:  () => void;
  } | undefined;
  trustVariant?: "A" | "B" | "C" | undefined;
  outcomeText?: string | undefined;
  sampleCTA?: {
    label:    string;
    onClick?: () => void;
  } | undefined;
  lastSession?: {
    label:      string;
    onRestore:  () => void;
    onDismiss:  () => void;
  };
  onDragOver?:  () => void;
  onDragLeave?: () => void;
  className?: string | undefined;
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
  subAction,
  trustVariant: configuredTrustVariant,
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

  const trustVariant = resolveTrustVariant(configuredTrustVariant, toolId);
  const trust = TRUST_COPY[trustVariant];

  const handleEngagement = useCallback(() => {
    if (!hasEngaged.current) {
      hasEngaged.current = true;
      recordEngagement(toolId);
    }
  }, [toolId, recordEngagement]);

  useEffect(() => {
    recordView(toolId);
    const handleExit = () => { if (!hasEngaged.current) recordBounce(toolId); };
    window.addEventListener("pagehide", handleExit);
    return () => { handleExit(); window.removeEventListener("pagehide", handleExit); };
  }, [toolId, recordView, recordBounce]);

  const handleSampleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    handleEngagement();
    if (sampleCTA?.onClick) {
      sampleCTA.onClick();
    } else {
      const sample = await loadSample(toolId);
      if (sample) {
        const files = Array.isArray(sample) ? sample : [sample instanceof File ? sample : new File([sample], "sample.txt")];
        onDrop(files);
      }
    }
  };

  const handleZoneClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleEngagement();
    if (dragState === "idle") {
      const input = document.createElement("input");
      input.type = "file";
      input.onchange = (ev) => {
        const files = Array.from((ev.target as HTMLInputElement).files || []);
        if (files.length > 0) onDrop(files);
      };
      input.click();
    }
  };

  const onBrowse = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (subAction?.onClick) {
      subAction.onClick();
    } else {
      handleZoneClick(e);
    }
  };

  useEffect(() => {
    if (dragState === "rejected") {
      setIsRejected(true);
      const timer = setTimeout(() => setIsRejected(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [dragState]);

  return (
    <motion.div layout className={cn("flex flex-col gap-4 w-full", className)}>
      <AnimatePresence>
        {lastSession && (
          <m.div
            layout
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center justify-between bg-mat-raised border border-mat-border-focus rounded-xl px-4 h-11 shadow-mat-shine"
            role="status"
            aria-live="polite"
          >
            <span className="text-sm text-text-3 font-bold truncate">↩ {lastSession.label} · Continue?</span>
            <div className="flex items-center gap-2">
              <button onClick={() => { handleEngagement(); lastSession.onRestore(); }} className="text-sm font-black text-brand-primary min-w-[44px] min-h-[44px]">Restore</button>
              <button onClick={lastSession.onDismiss} className="min-w-[44px] min-h-[44px] text-text-4"><X className="w-4 h-4" /></button>
            </div>
          </m.div>
        )}
      </AnimatePresence>

      <m.div
        layout
        onDragOver={(e) => { e.preventDefault(); onDragOver?.(); }}
        onDragLeave={onDragLeave}
        onDrop={(e) => { e.preventDefault(); handleEngagement(); }}
        onClick={handleZoneClick}
        className={cn(
          "relative flex flex-col items-center justify-center text-center transition-all duration-200 cursor-pointer border-2 rounded-[32px] p-8 md:p-12 min-h-[240px] md:min-h-[320px]",
          dragStateClasses[dragState || "idle"],
          (dragState === "rejected" || isRejected) && dragStateClasses.rejected,
          isRejected && "animate-shake"
        )}
      >
        <div className={cn("mb-6 p-6 rounded-3xl bg-mat-base border border-mat-border transition-all", dragState === "over" && "scale-110 text-brand-primary", isRejected && "text-error")}>
          {isRejected ? <XCircleIcon className="w-12 h-12" /> : <Icon className="w-12 h-12" />}
        </div>

        <h2 className="text-xl md:text-2xl font-black text-text mb-2 tracking-tight">
          {dragState === "over" ? `Release to process` : isRejected ? "File type not supported" : headline}
        </h2>

        <div className="mb-8 w-full max-w-xs px-4 flex justify-center">
          {/* Desktop */}
          <span className="hidden md:inline text-[14px] text-[--kv-brand-primary] cursor-pointer hover:underline"
                onClick={onBrowse}>
            or browse files
          </span>

          {/* Mobile */}
          <button
            onClick={onBrowse}
            className="md:hidden w-full h-[44px] rounded-lg border border-[--kv-mat-border] bg-transparent hover:bg-[--kv-mat-hover] text-[14px] font-medium text-[--kv-text] transition-colors duration-150"
          >
            Browse files
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {formats?.map(f => <span key={f} className="px-2 py-1 bg-mat-raised border border-mat-border rounded-md text-[12px] font-black uppercase text-text-3">{f}</span>)}
          {maxSize && <span className="text-[12px] font-bold text-text-4 px-2">Max: {maxSize}</span>}
        </div>

        <div className="mb-8 flex flex-col items-center gap-1">
          <div className="flex items-center gap-2 text-emerald-500">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-xs font-black uppercase tracking-widest">{trust.title}</span>
          </div>
          <p className="text-[12px] font-bold text-text-4 opacity-60">{trust.desc}</p>
        </div>

        {outcomeText && (
          <p className="text-[12px] text-[--kv-text-muted] italic mb-8">
            Result: {outcomeText.replace(/^Result:\s*/i, '').slice(0, 52)}
            {/* 52 chars + "Result: " prefix = 60 total */}
          </p>
        )}

        <button onClick={handleSampleClick} className="h-11 px-6 bg-brand-primary/10 border border-brand-primary/20 rounded-xl text-xs font-black uppercase tracking-widest text-brand-primary flex items-center gap-2">
          <PlayCircle className="w-4 h-4" /> {sampleCTA?.label || "Try Sample File"}
        </button>
      </m.div>

      <style jsx global>{`
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }
        .animate-shake { animation: shake 0.3s cubic-bezier(.36,.07,.19,.97) both; animation-iteration-count: 3; }
        @media (prefers-reduced-motion: reduce) { .animate-shake { animation: none; } }
      `}</style>
    </motion.div>
  );
}
