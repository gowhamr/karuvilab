"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import { cn } from "@/src/lib/utils";
export function Checkbox({ label, className, id, ...props }) {
    const generatedId = React.useId();
    const finalId = id || generatedId;
    return (_jsxs("label", { className: cn("flex items-center gap-3 cursor-pointer group py-2.5 min-h-11", className), children: [_jsxs("div", { className: "relative flex items-center justify-center w-6 h-6 flex-shrink-0", children: [_jsx("input", { type: "checkbox", id: finalId, className: "peer appearance-none w-6 h-6 rounded-sm border border-border bg-bg checked:bg-blue checked:border-blue transition-all cursor-pointer outline-none focus-visible:ring-4 focus-visible:ring-blue/10", ...props }), _jsx("svg", { className: "absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none stroke-[4]", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round", children: _jsx("polyline", { points: "20 6 9 17 4 12" }) })] }), _jsx("span", { className: "text-sm font-bold text-text-2 select-none group-hover:text-text transition-colors pt-0.5", children: label })] }));
}
