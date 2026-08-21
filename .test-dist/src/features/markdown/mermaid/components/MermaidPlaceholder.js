"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Loader2 } from "lucide-react";
export function MermaidPlaceholder({ label = "Rendering diagram..." }) {
    return (_jsxs("div", { className: "my-6 p-8 bg-surface border border-border rounded-2xl flex flex-col items-center justify-center gap-3 min-h-36 animate-pulse", children: [_jsx(Loader2, { className: "w-6 h-6 text-blue animate-spin" }), _jsx("span", { className: "text-xs font-semibold text-text-4 uppercase tracking-widest", children: label })] }));
}
