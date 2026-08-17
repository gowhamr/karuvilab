"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Component } from "react";
import { AlertTriangle, RefreshCw, Flag } from "lucide-react";
import { useSupportStore } from "@/src/store/useSupportStore";
import { workerOrchestrator } from "@/src/engine/workers/WorkerOrchestrator";
import { logger } from "@/src/lib/logger";
export class ErrorBoundary extends Component {
    state = {
        hasError: false,
        showDetails: false,
    };
    static getDerivedStateFromError(error) {
        return { hasError: true, error, showDetails: false };
    }
    componentDidCatch(error, errorInfo) {
        logger.error("Component error boundary caught", { error, action: "error-boundary" });
        void errorInfo; // errorInfo logged via context above
        // Detect if this is a chunk loading error
        const isChunkError = error.message.includes("ChunkLoadError") ||
            error.message.toLowerCase().includes("loading chunk") ||
            error.message.toLowerCase().includes("loading failed");
        if (isChunkError) {
            const reloadKey = "karuvi.last_component_reload";
            const lastReload = parseInt(sessionStorage.getItem(reloadKey) || "0");
            const now = Date.now();
            if (now - lastReload > 5000) {
                sessionStorage.setItem(reloadKey, now.toString());
                setTimeout(() => {
                    if (typeof window !== 'undefined') {
                        workerOrchestrator.terminateAll();
                        window.location.reload();
                    }
                }, 500);
            }
        }
    }
    render() {
        if (this.state.hasError) {
            const errorMsg = this.state.error?.message || "Unknown error";
            const errorStack = this.state.error?.stack || "";
            return (this.props.fallback || (_jsxs("div", { role: "alert", "aria-live": "assertive", className: "flex flex-col items-center justify-center p-8 sm:p-12 bg-surface border border-border rounded-5xl space-y-8 text-center animate-in fade-in zoom-in-95 duration-500 shadow-2xl shadow-error/5 overflow-hidden", children: [_jsxs("div", { className: "w-20 h-20 rounded-2xl bg-error/10 flex items-center justify-center text-error relative", children: [_jsx(AlertTriangle, { className: "w-10 h-10", "aria-hidden": "true" }), _jsx("div", { className: "absolute inset-0 rounded-2xl border border-error/20 animate-ping", "aria-hidden": "true" })] }), _jsxs("div", { className: "space-y-3", children: [_jsx("h2", { className: "text-2xl font-black uppercase tracking-tight", children: "Technical Failure" }), _jsx("p", { className: "text-text-3 text-sm max-w-sm mx-auto font-medium leading-relaxed", children: "The tool encountered an unexpected critical error. Your data remains safe and local." })] }), _jsxs("div", { className: "flex flex-col gap-3 w-full max-w-sm", children: [_jsxs("button", { onClick: () => {
                                    this.setState({ hasError: false, error: undefined, showDetails: false });
                                }, "aria-label": "Retry loading this component", className: "w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary text-white rounded-2xl text-tiny font-bold uppercase tracking-widest-sm shadow-md shadow-primary/10 hover:bg-primary/90 active:scale-98 transition-all", children: [_jsx(RefreshCw, { className: "w-4 h-4", "aria-hidden": "true" }), "Retry Component"] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("button", { onClick: () => {
                                            if (typeof window !== 'undefined') {
                                                workerOrchestrator.terminateAll();
                                                window.location.reload();
                                            }
                                        }, "aria-label": "Reload the entire application", className: "flex items-center justify-center gap-2 px-4 py-3 bg-bg border border-border rounded-xl text-tiny font-bold uppercase tracking-widest-sm hover:border-primary/30 transition-all", children: [_jsx(RefreshCw, { className: "w-3 h-3", "aria-hidden": "true" }), "Reload App"] }), _jsxs("button", { onClick: () => useSupportStore.getState().openFeedback("bug", {
                                            error: errorMsg,
                                            stack: errorStack,
                                            metadata: {
                                                userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
                                                url: typeof window !== 'undefined' ? window.location.href : 'unknown'
                                            }
                                        }), "aria-label": "Report this bug to our team", className: "flex items-center justify-center gap-2 px-4 py-3 bg-bg border border-border rounded-xl text-tiny font-bold uppercase tracking-widest-sm hover:border-error/30 hover:text-error transition-all", children: [_jsx(Flag, { className: "w-3 h-3", "aria-hidden": "true" }), "Report Issue"] })] })] }), _jsxs("div", { className: "w-full max-w-md pt-4", children: [_jsx("button", { onClick: () => this.setState(s => ({ showDetails: !s.showDetails })), "aria-expanded": this.state.showDetails, "aria-controls": "error-details", className: "text-tiny font-bold uppercase tracking-widest-sm text-text-4 hover:text-primary transition-colors mb-4", children: this.state.showDetails ? "Hide Error Details" : "Show Error Details" }), this.state.showDetails && (_jsx("div", { id: "error-details", className: "text-left p-6 bg-bg border border-border rounded-2xl overflow-auto max-h-60 animate-in slide-in-from-top-4 duration-300", children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs font-black uppercase text-error mb-1", children: "Error Message" }), _jsx("code", { className: "text-xs font-mono text-text-2 break-all", children: errorMsg })] }), errorStack && (_jsxs("div", { children: [_jsx("p", { className: "text-xs font-black uppercase text-text-4 mb-1", children: "Stack Trace" }), _jsx("code", { className: "text-xs font-mono text-text-4 block whitespace-pre-wrap break-all leading-tight", children: errorStack })] }))] }) }))] })] })));
        }
        return this.props.children;
    }
}
