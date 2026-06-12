/**
 * components/ui/EmptyState.tsx
 * Version 4.2 — Deterministic trust rotation + Accessibility fixes.
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
  hover:    "border-dashed border-brand-primary/40 bg-brand-primary/10",
  over:     "border-solid border-brand-primary bg-brand-primary/15",
  rejected: "border-solid border-red-500 bg-red-500/10",
} as const;

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
  formats?:     string[];
  maxSize?:     string;
  maxFiles?:    string;
  subAction?: {
    label:    string;
    onClick:  () => void;
  };
  trustVariant?: "A" | "B" | "C";
  outcomeText?: string;
  sampleCTA?: {
    label:    string;
    onClick?: () => void;
  };
  lastSession?: {
    label:      string;
    onRestore:  () => void;
    onDismiss:  () => void;
  };
  onDragOver?:  () => void;
  onDragLeave?: () => void;
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
  subAction,
  trustVariant: configuredTrustVariant,
  outcomeText,
  sampleCTA,
  lastSession,
  onDragOver,
  onDragLeave,
  className
}: EmptyStateProps) {
  const recordView = useAnalyticsStore(s => s.recordView);
  const recordEngagement = useAnalyticsStore(s => s.recordEngagement);
  const recordBounce = useAnalyticsStore(s => s.recordBounce);
  const hasEngaged = useRef(false);
  const [isRejected, setIsRejected] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const onBrowse = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    handleEngagement();
    if (subAction?.onClick) {
      subAction.onClick();
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onDrop(files);
    }
    e.target.value = ''; // Reset
  };

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
              <button onClick={lastSession.onDismiss} className="min-w-[44px] min-h-[44px] text-text-4" aria-label="Dismiss session restore"><X className="w-4 h-4" /></button>
            </div>
          </m.div>
        )}
      </AnimatePresence>

      <m.div
        layout
        onDragOver={(e) => { e.preventDefault(); onDragOver?.(); }}
        onDragLeave={onDragLeave}
        onDrop={(e) => { e.preventDefault(); handleEngagement(); }}
        onClick={onBrowse}
        tabIndex={0}
        role="button"
        aria-label={`${headline}. Click or drop files here.`}
        onKeyDown={(e: React.KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onBrowse(e);
          }
        }}
        className={cn(
          "relative flex flex-col items-center justify-center text-center transition-all duration-200 cursor-pointer border rounded-4xl p-8 md:p-12 min-h-[240px] md:min-h-[320px] group",
          dragStateClasses[dragState || "idle"],
          (dragState === "rejected" || isRejected) && dragStateClasses.rejected,
          isRejected && "animate-shake"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleInputChange}
          multiple={toolType === 'batch' || toolType === 'file'}
          accept={formats?.join(',')}
          aria-hidden="true"
        />

        <div className={cn("mb-6 p-6 rounded-3xl bg-mat-base border border-mat-border transition-all", dragState === "over" && "scale-110 text-brand-primary", isRejected && "text-error")}>
          {isRejected ? <XCircleIcon className="w-12 h-12" /> : <Icon className="w-12 h-12" />}
        </div>

        <h2 className="text-xl md:text-2xl font-black text-text mb-2 tracking-tight">
          {dragState === "over" ? `Release to process` : isRejected ? "File type not supported" : headline}
        </h2>

        <div className="mb-8 w-full max-w-xs px-4 flex justify-center">
          <span className="text-[14px] text-brand-primary font-medium group-hover:underline">
            {subAction?.label || (toolType === "file" || toolType === "batch" ? "Click to browse files" : "Click to get started")}
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {formats?.map(f => <span key={f} className="px-2 py-1 bg-mat-raised border border-mat-border rounded-md text-[12px] font-black uppercase text-text-3">{f}</span>)}
          {maxSize && <span className="text-[12px] font-bold text-text-4 px-2">Max: {maxSize}</span>}
        </div>

        {/* Dynamic Trust Badge */}
        <div className="flex items-center gap-3 bg-mat-raised/50 border border-mat-border rounded-2xl px-5 py-4 mb-4 select-none max-w-sm">
          <div className="p-2.5 rounded-xl bg-success/10 border border-success/20 text-success shrink-0">
            <ShieldCheck className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="text-left">
            <h4 className="text-[13px] font-black tracking-tight text-text leading-snug">{trust.title}</h4>
            <p className="text-[12px] font-bold text-text-4">{trust.desc}</p>
          </div>
        </div>

        {outcomeText && (
          <p className="text-[12px] text-[--kv-text-muted] italic mb-8">
            Result: {outcomeText.replace(/^Result:\s*/i, '').slice(0, 52)}
          </p>
        )}

        <button 
          onClick={handleSampleClick} 
          className="h-11 px-6 bg-brand-primary/10 border border-brand-primary/20 rounded-xl text-xs font-black uppercase tracking-widest text-brand-primary flex items-center gap-2 hover:bg-brand-primary/20 transition-colors"
        >
          <PlayCircle className="w-4 h-4" aria-hidden="true" /> {sampleCTA?.label || "Try Sample File"}
        </button>
      </m.div>
    </motion.div>
  );
}
