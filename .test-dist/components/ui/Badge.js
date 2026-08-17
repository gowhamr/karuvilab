"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from "@/src/lib/utils";
export function Badge({ children, className, variant = "neutral", size = "md", ...props }) {
    return (_jsx("span", { className: cn("inline-flex items-center font-bold tracking-wider uppercase select-none rounded-full whitespace-nowrap", 
        // Sizes
        size === "sm" && "px-2 py-0.5 text-tiny", size === "md" && "px-2.5 py-1 text-caption", 
        // Variants
        variant === "primary" && "bg-primary/10 text-primary border border-primary/20", variant === "secondary" && "bg-secondary/10 text-secondary border border-secondary/20", variant === "success" && "bg-success/10 text-success border border-success/20", variant === "warning" && "bg-warning/10 text-warning border border-warning/20", variant === "danger" && "bg-danger/10 text-danger border border-danger/20", variant === "neutral" && "bg-surface-elevated text-text-secondary border border-divider", variant === "glass" && "bg-white/5 backdrop-blur-sm text-text-primary border border-white/10", className), ...props, children: children }));
}
