"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef } from "react";
import { cn } from "@/src/lib/utils";
export const Card = forwardRef(({ children, className, variant = "default", padding = "md", ...props }, ref) => {
    return (_jsx("div", { ref: ref, className: cn("border transition-all duration-200 overflow-hidden", 
        // Radius: Cards 22px (rounded-card)
        "rounded-card", 
        // Variants
        variant === "default" && "bg-surface border-divider", variant === "elevated" && "bg-surface-elevated border-divider shadow-lg shadow-black/20", variant === "glass" && [
            "bg-surface/60 backdrop-blur-md border-divider/50",
            "shadow-lg shadow-black/10",
        ], variant === "interactive" && [
            "bg-surface border-divider hover:border-primary/30 hover:bg-surface-elevated/40",
            "cursor-pointer active:scale-[0.99]",
        ], 
        // Padding scale
        padding === "none" && "p-0", padding === "sm" && "p-4", // 16px
        padding === "md" && "p-6", // 24px
        padding === "lg" && "p-8", // 32px
        className), ...props, children: children }));
});
Card.displayName = "Card";
