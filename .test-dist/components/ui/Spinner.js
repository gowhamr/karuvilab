"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from "@/src/lib/utils";
/**
 * A purely presentational spinner component.
 * Supports prefers-reduced-motion and uses Tailwind utility classes.
 */
export function Spinner({ className, size = "md" }) {
    const sizeClasses = {
        sm: "w-4 h-4 border",
        md: "w-6 h-6 border",
        lg: "w-10 h-10 border-4",
    };
    return (_jsx("div", { className: cn("animate-spin rounded-full border-blue border-t-transparent motion-reduce:animate-[spin_3s_linear_infinite]", sizeClasses[size], className), role: "status", "aria-label": "Loading", children: _jsx("span", { className: "sr-only", children: "Loading..." }) }));
}
