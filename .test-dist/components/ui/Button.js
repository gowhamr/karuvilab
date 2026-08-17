"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef } from "react";
import { cn } from "@/src/lib/utils";
import { Loader2 } from "lucide-react";
export const Button = forwardRef(({ children, className, variant = "primary", size = "md", loading = false, disabled, type = "button", ...props }, ref) => {
    return (_jsxs("button", { ref: ref, type: type, disabled: disabled || loading, className: cn("inline-flex items-center justify-center font-bold tracking-tight transition-all duration-150 outline-none select-none", "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg", "active:scale-[0.97] active:shadow-inner disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100", 
        // Radius: Button 16px (rounded-btn)
        "rounded-btn", 
        // Touch target minimum: md/lg sizes are 48px, sm is 38px (with layout padding fallback)
        size === "sm" && "h-[38px] px-4 text-caption gap-1.5", size === "md" && "h-12 px-5 text-body gap-2", size === "lg" && "h-14 px-6 text-title gap-2.5", 
        // Variants
        variant === "primary" && [
            "bg-primary text-white shadow-lg shadow-primary/20",
            "hover:bg-primary/90 hover:shadow-primary/30",
        ], variant === "secondary" && [
            "bg-surface-elevated border border-divider text-text-secondary",
            "hover:bg-surface-elevated/80 hover:text-text-primary hover:border-text-secondary/20",
        ], variant === "ghost" && [
            "bg-transparent text-text-secondary",
            "hover:bg-surface-elevated hover:text-text-primary",
        ], variant === "danger" && [
            "bg-danger text-text-primary shadow-lg shadow-danger/20",
            "hover:bg-danger/90 hover:shadow-danger/30",
        ], className), ...props, children: [loading && _jsx(Loader2, { className: "w-4 h-4 animate-spin shrink-0", "aria-hidden": "true" }), children] }));
});
Button.displayName = "Button";
