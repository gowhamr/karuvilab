"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { m, AnimatePresence } from "framer-motion";
import { useProgress } from "@/src/contexts/ProgressContext";
import { Spinner } from "./Spinner";
import { cn } from "@/src/lib/utils";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "./Button";
/**
 * ProgressBar: A simple horizontal progress bar component
 */
export function ProgressBar({ progress, className }) {
    const isIndeterminate = progress === null;
    return (_jsx("div", { className: cn("w-full h-2 bg-surface-elevated overflow-hidden rounded-full", className), children: isIndeterminate ? (_jsx("div", { className: "h-full bg-primary animate-pulse w-full rounded-full" })) : (_jsx("div", { className: "h-full bg-primary transition-all duration-300 ease-out rounded-full", style: { width: `${Math.min(100, Math.max(0, progress))}%` }, role: "progressbar", "aria-valuenow": progress, "aria-valuemin": 0, "aria-valuemax": 100 })) }));
}
/**
 * ProgressOverlay: Used for heavy tasks (>3s)
 */
export function ProgressOverlay() {
    const { state } = useProgress();
    if (!state.isProcessing || state.type !== "heavy")
        return null;
    return (_jsx(AnimatePresence, { children: _jsx(m.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "fixed inset-0 z-dropdown flex items-center justify-center bg-surface/80 backdrop-blur-sm p-4", "aria-busy": "true", "aria-live": "assertive", children: _jsxs(m.div, { initial: { scale: 0.95, opacity: 0, y: 10 }, animate: { scale: 1, opacity: 1, y: 0 }, exit: { scale: 0.95, opacity: 0, y: -10 }, className: "bg-surface border border-border shadow-2xl rounded-3xl p-8 max-w-sm w-full space-y-6 flex flex-col items-center text-center", children: [_jsx("div", { className: "w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center", children: _jsx(Loader2, { className: "w-8 h-8 text-primary animate-spin" }) }), _jsxs("div", { className: "space-y-2 w-full", children: [_jsx("h3", { className: "text-xl font-black text-text-primary", children: "Processing..." }), state.stage && (_jsx("p", { className: "text-sm font-bold text-text-secondary animate-pulse", children: state.stage }))] }), _jsx(ProgressBar, { progress: state.progress, className: "w-full" }), state.estimatedTimeRemaining !== null && (_jsxs("p", { className: "text-xs font-bold text-text-muted", children: ["Estimated time: ", Math.ceil(state.estimatedTimeRemaining), "s"] })), state.onCancel && (_jsx(Button, { variant: "danger", size: "sm", onClick: state.onCancel, className: "mt-4 w-full", children: "Cancel" }))] }) }) }));
}
/**
 * InlineProgress: Used for medium tasks (1-3s)
 */
export function InlineProgress() {
    const { state } = useProgress();
    if (!state.isProcessing || state.type !== "medium")
        return null;
    return (_jsx(AnimatePresence, { children: _jsxs(m.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: "auto" }, exit: { opacity: 0, height: 0 }, className: "flex items-center gap-3 p-4 bg-surface-elevated border border-border rounded-xl text-text-primary", "aria-busy": "true", "aria-live": "polite", children: [_jsx(Spinner, { size: "sm", className: "text-primary border-primary border-t-transparent" }), _jsx("span", { className: "text-sm font-bold", children: state.stage || "Processing..." })] }) }));
}
/**
 * ProgressButton: Replaces standard Button when short/medium task is running
 */
export function ProgressButton({ children, onClick, ...props }) {
    const { state } = useProgress();
    const isRunning = state.isProcessing;
    return (_jsx(Button, { ...props, onClick: onClick, disabled: props.disabled || isRunning, loading: props.loading || (isRunning && state.type === "short"), children: isRunning && state.type === "short" ? "Processing..." : children }));
}
/**
 * ProgressToast: Automatically triggers success/error toasts based on state
 */
export function ProgressToast() {
    const { state, resetProgress } = useProgress();
    useEffect(() => {
        if (!state.isProcessing && state.type !== null) {
            if (state.isSuccess) {
                toast.success("Completed", {
                    icon: _jsx(CheckCircle, { className: "w-5 h-5 text-success" }),
                });
            }
            else if (state.error) {
                toast.error(state.error.message || "Processing failed", {
                    icon: _jsx(XCircle, { className: "w-5 h-5 text-error" }),
                });
            }
            // We don't reset immediately to allow the user to see the success state if needed,
            // but in this model, we can reset after a small delay.
            const timer = setTimeout(() => {
                resetProgress();
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [state.isProcessing, state.isSuccess, state.error, state.type, resetProgress]);
    return null;
}
