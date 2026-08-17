"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { SegmentedControl } from "./SegmentedControl";
import { cn } from "@/src/lib/utils";
export function ToolWorkspace({ layout = "split", tabs, input, optionsPanel, output, infoPanel, className }) {
    return (_jsxs("div", { className: cn("w-full space-y-8 pb-12", className), children: [tabs && (_jsx("div", { className: "flex justify-center w-full", children: _jsx(SegmentedControl, { options: tabs.options, activeId: tabs.activeId, onChange: tabs.onChange }) })), _jsxs("div", { className: cn("grid gap-6 md:gap-8", layout === "split" ? "lg:grid-cols-2" : "grid-cols-1"), children: [_jsxs("div", { className: "space-y-6 flex flex-col", children: [input && (_jsx("div", { className: "bg-surface border border-border p-4 sm:p-6 rounded-4xl shadow-sm space-y-4", children: input })), optionsPanel && (_jsx("div", { className: "bg-surface border border-border p-4 sm:p-6 rounded-4xl shadow-sm space-y-4", children: optionsPanel }))] }), output && (_jsx("div", { className: "space-y-6 flex flex-col h-full", children: _jsx("div", { className: "bg-surface border border-border p-4 sm:p-6 rounded-4xl shadow-sm space-y-4 flex-1", children: output }) }))] }), infoPanel && (_jsx("div", { className: "w-full", children: infoPanel }))] }));
}
