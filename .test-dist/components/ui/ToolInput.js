"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useId } from "react";
import { cn } from "@/src/lib/utils";
export function ToolInput({ label, value, onChange, placeholder, rows = 1, type = "text", inputMode, autoComplete, description, error, mono = false, id: providedId, readOnly, className, loading, style }) {
    const generatedId = useId();
    const id = providedId || generatedId;
    const descriptionId = `${id}-description`;
    const errorId = `${id}-error`;
    const baseClasses = cn("w-full px-4 py-3 bg-bg border rounded-input outline-none transition-all min-h-12 text-text-primary", mono ? "font-mono text-caption" : "text-body", // Force clean text sizing
    error
        ? "border-danger focus:ring-4 focus:ring-inset focus:ring-danger/10 focus:border-danger"
        : "border-divider focus:ring-4 focus:ring-inset focus:ring-primary/10 focus:border-primary", "placeholder:text-text-secondary/60", (readOnly || loading) && "bg-surface/50 cursor-default", loading && "opacity-50 pointer-events-none", className);
    return (_jsxs("div", { className: "space-y-2", children: [(label || description) && (_jsxs("div", { className: "flex justify-between items-end px-1", children: [label && _jsx("label", { htmlFor: id, className: "text-sm font-bold text-text-2", children: label }), description && (_jsx("span", { id: descriptionId, className: "text-xs text-text-4 uppercase font-black tracking-widest", children: description }))] })), rows > 1 ? (_jsx("textarea", { id: id, className: cn(baseClasses, "min-h-30 py-4"), style: style, rows: rows, placeholder: placeholder, value: value, onChange: (e) => onChange?.(e.target.value), readOnly: readOnly || loading, autoComplete: autoComplete, "aria-describedby": cn(description ? descriptionId : undefined, error ? errorId : undefined), "aria-invalid": !!error })) : (_jsx("input", { id: id, type: type, inputMode: inputMode, autoComplete: autoComplete, className: baseClasses, style: style, placeholder: placeholder, value: value, onChange: (e) => onChange?.(e.target.value), readOnly: readOnly || loading, "aria-describedby": cn(description ? descriptionId : undefined, error ? errorId : undefined), "aria-invalid": !!error })), error && (_jsx("p", { id: errorId, role: "alert", className: "px-1 text-xs text-danger font-bold", children: error }))] }));
}
