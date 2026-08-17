/**
 * components/ui/EmptyState.tsx
 * Version 4.2 — Deterministic trust rotation + Accessibility fixes.
 */
"use client";
import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useRef, useState, useCallback } from "react";
import { m, AnimatePresence } from "framer-motion";
import { X, ShieldCheck, CircleX as XCircleIcon, PlayCircle } from "lucide-react";
import { useAnalyticsStore } from "@/src/store/analyticsStore";
import { loadSample } from "@/src/data/sampleAssets";
import { cn } from "@/src/lib/utils";
const TRUST_COPY = {
    A: { title: "Processing: 100% Local", desc: "No uploads. No account. No tracking." },
    B: { title: "Your files never leave this device", desc: "Privacy-first architecture. 100% secure." },
    C: { title: "Zero server contact. Ever.", desc: "Sandbox-isolated and locally executed." }
};
const TRUST_VARIANTS = ["A", "B", "C"];
const dragStateClasses = {
    idle: "border-dashed border-mat-border",
    hover: "border-dashed border-brand-primary/40 bg-brand-primary/10",
    over: "border-solid border-brand-primary bg-brand-primary/15",
    rejected: "border-solid border-danger bg-danger/10",
};
function resolveTrustVariant(configured, toolId) {
    if (configured)
        return configured;
    const index = toolId
        .split("")
        .reduce((sum, char) => sum + char.charCodeAt(0), 0)
        % TRUST_VARIANTS.length;
    return TRUST_VARIANTS[index];
}
export function EmptyState({ icon: Icon, headline, toolType, toolId, onDrop, dragState, formats, maxSize, maxFiles, subAction, trustVariant: configuredTrustVariant, outcomeText, sampleCTA, lastSession, onDragOver, onDragLeave, className }) {
    const recordView = useAnalyticsStore(s => s.recordView);
    const recordEngagement = useAnalyticsStore(s => s.recordEngagement);
    const recordBounce = useAnalyticsStore(s => s.recordBounce);
    const hasEngaged = useRef(false);
    const [isRejected, setIsRejected] = useState(false);
    const fileInputRef = useRef(null);
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
        const handleExit = () => { if (!hasEngaged.current)
            recordBounce(toolId); };
        window.addEventListener("pagehide", handleExit);
        return () => { handleExit(); window.removeEventListener("pagehide", handleExit); };
    }, [toolId, recordView, recordBounce]);
    const onBrowse = useCallback((e) => {
        e.stopPropagation();
        handleEngagement();
        if (subAction?.onClick) {
            subAction.onClick();
        }
        else {
            fileInputRef.current?.click();
        }
    }, [handleEngagement, subAction]);
    const handleInputChange = useCallback((e) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            onDrop(files);
        }
        e.target.value = ''; // Reset
    }, [onDrop]);
    const handleSampleClick = useCallback(async (e) => {
        e.stopPropagation();
        handleEngagement();
        if (sampleCTA?.onClick) {
            sampleCTA.onClick();
        }
        else {
            const sample = await loadSample(toolId);
            if (sample) {
                const files = Array.isArray(sample) ? sample : [sample instanceof File ? sample : new File([sample], "sample.txt")];
                onDrop(files);
            }
        }
    }, [handleEngagement, sampleCTA, toolId, onDrop]);
    useEffect(() => {
        if (dragState === "rejected") {
            Promise.resolve().then(() => {
                setIsRejected(true);
            });
            const timer = setTimeout(() => setIsRejected(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [dragState]);
    return (_jsxs(m.div, { layout: true, className: cn("flex flex-col gap-4 w-full", className), children: [_jsx(AnimatePresence, { children: lastSession && (_jsxs(m.div, { layout: true, initial: { opacity: 0, y: -8 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 }, className: "flex items-center justify-between bg-mat-raised border border-mat-border-focus rounded-xl px-4 h-11 shadow-mat-shine", role: "status", "aria-live": "polite", children: [_jsxs("span", { className: "text-sm text-text-3 font-bold truncate", children: ["\u21A9 ", lastSession.label, " \u00B7 Continue?"] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { onClick: () => { handleEngagement(); lastSession.onRestore(); }, className: "text-sm font-black text-brand-primary min-w-11 min-h-11", children: "Restore" }), _jsx("button", { onClick: lastSession.onDismiss, className: "min-w-11 min-h-11 text-text-4", "aria-label": "Dismiss session restore", children: _jsx(X, { className: "w-4 h-4", "aria-hidden": "true" }) })] })] })) }), _jsxs(m.div, { layout: true, onDragOver: (e) => { e.preventDefault(); onDragOver?.(); }, onDragLeave: onDragLeave, onDrop: (e) => { e.preventDefault(); handleEngagement(); }, onClick: onBrowse, tabIndex: 0, role: "button", "aria-label": `${headline}. Click or drop files here.`, onKeyDown: (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onBrowse(e);
                    }
                }, className: cn("relative flex flex-col items-center justify-center text-center transition-all duration-200 cursor-pointer border rounded-4xl p-8 md:p-12 min-h-60 md:min-h-80 group", dragStateClasses[dragState || "idle"], (dragState === "rejected" || isRejected) && dragStateClasses.rejected, isRejected && "animate-shake"), "aria-dropeffect": "copy", children: [_jsx("input", { ref: fileInputRef, type: "file", className: "hidden", onChange: handleInputChange, multiple: toolType === 'batch' || toolType === 'file', accept: formats?.join(','), "aria-hidden": "true" }), _jsx("div", { className: cn("mb-6 p-6 rounded-3xl bg-mat-base border border-mat-border transition-all", dragState === "over" && "scale-110 text-brand-primary", isRejected && "text-error"), children: isRejected ? _jsx(XCircleIcon, { className: "w-12 h-12", "aria-hidden": "true" }) : _jsx(Icon, { className: "w-12 h-12", "aria-hidden": "true" }) }), _jsx("h2", { className: "text-xl md:text-2xl font-black text-text mb-2 tracking-tight", children: dragState === "over" ? `Release to process` : isRejected ? "File type not supported" : headline }), _jsx("div", { className: "mb-8 w-full max-w-xs px-4 flex justify-center", children: _jsx("span", { className: "text-sm text-brand-primary font-medium group-hover:underline", children: subAction?.label || (toolType === "file" || toolType === "batch" ? "Click to browse files" : "Click to get started") }) }), _jsxs("div", { className: "flex flex-wrap items-center justify-center gap-2 mb-8", children: [formats?.map(f => _jsx("span", { className: "px-2 py-1 bg-mat-raised border border-mat-border rounded-md text-xs font-black uppercase text-text-3", children: f }, f)), maxSize && _jsxs("span", { className: "text-xs font-bold text-text-4 px-2", children: ["Max: ", maxSize] })] }), _jsxs("div", { className: "flex items-center gap-3 bg-mat-raised/50 border border-mat-border rounded-2xl px-5 py-4 mb-4 select-none max-w-sm", children: [_jsx("div", { className: "p-2.5 rounded-xl bg-success/10 border border-success/20 text-success shrink-0", children: _jsx(ShieldCheck, { className: "w-5 h-5", "aria-hidden": "true" }) }), _jsxs("div", { className: "text-left", children: [_jsx("h3", { className: "text-sm font-black tracking-tight text-text leading-snug", children: trust.title }), _jsx("p", { className: "text-xs font-bold text-text-4", children: trust.desc })] })] }), outcomeText && (_jsxs("p", { className: "text-xs text-text-muted italic mb-8", children: ["Result: ", outcomeText.replace(/^Result:\s*/i, '').slice(0, 52)] }))] }), _jsxs("button", { onClick: handleSampleClick, className: "h-11 px-6 bg-brand-primary/10 border border-brand-primary/20 rounded-xl text-tiny font-bold uppercase tracking-widest-sm text-brand-primary flex items-center gap-2 hover:bg-brand-primary/20 transition-colors self-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary", "aria-label": sampleCTA?.label || "Try a sample file", children: [_jsx(PlayCircle, { className: "w-4 h-4", "aria-hidden": "true" }), " ", sampleCTA?.label || "Try Sample File"] })] }));
}
