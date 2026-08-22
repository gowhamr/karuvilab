"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import { m } from "framer-motion";
import { cn } from "@/src/lib/utils";
/**
 * A unified, accessible segmented control (tabs) for tool modes and settings.
 */
export const SegmentedControl = React.memo(function SegmentedControl(props) {
    const { options, activeId, onChange, className, disabled, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledby } = props;
    const id = React.useId();
    return (_jsx("div", { role: "radiogroup", "aria-label": ariaLabel, "aria-labelledby": ariaLabelledby, className: cn("flex p-1 bg-bg border border-border rounded-2xl w-fit", disabled && "opacity-50 pointer-events-none", className), children: options.map((option) => {
            const isActive = activeId === option.id;
            return (_jsxs("button", { role: "radio", id: `tab-${option.id}`, "aria-checked": isActive, tabIndex: isActive ? 0 : -1, disabled: disabled, onClick: () => !disabled && onChange(option.id), className: cn("relative flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all outline-none focus-visible:ring-2 focus-visible:ring-blue/20", isActive ? "text-white" : "text-text-4 hover:text-text hover:bg-surface/50", disabled && "cursor-not-allowed", option.className), children: [isActive && (_jsx(m.div, { layoutId: `segmented-active-${id}`, className: "absolute inset-0 bg-blue rounded-xl shadow-md shadow-blue/10 z-base", transition: { type: "spring", bounce: 0.2, duration: 0.6 } })), option.icon && (_jsx("span", { className: cn("relative z-content transition-transform", isActive && "scale-110"), children: option.icon })), _jsx("span", { className: "relative z-content", children: option.label })] }, String(option.id)));
        }) }));
});
