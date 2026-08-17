"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useWorkflowStore } from "@/src/store/useWorkflowStore";
import { getToolColor } from "@/src/tool-registry";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { m } from "framer-motion";
export function WorkflowSuggestions() {
    const suggestions = useWorkflowStore(state => state.suggestions);
    if (suggestions.length === 0)
        return null;
    return (_jsxs("div", { className: "mt-12 space-y-6", children: [_jsxs("div", { className: "flex items-center gap-2 text-blue font-black uppercase tracking-widest-lg text-xs", children: [_jsx(Sparkles, { className: "w-4 h-4" }), "Next in Workflow"] }), _jsx("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4", children: suggestions.map((tool, idx) => (_jsx(m.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { delay: idx * 0.1 }, children: _jsxs(Link, { href: tool.href, onClick: () => {
                            useWorkflowStore.getState().routeToTarget(tool.id);
                        }, className: "group block bg-surface border border-border p-5 rounded-2xl hover:border-blue transition-all hover:shadow-md hover:shadow-blue/5 relative overflow-hidden h-full", children: [_jsx("div", { className: "absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 opacity-5 group-hover:opacity-10 transition-opacity", style: { backgroundColor: getToolColor(tool), borderRadius: '100%' } }), _jsxs("div", { className: "space-y-3 relative", children: [_jsx("div", { className: "w-10 h-10 rounded-xl flex items-center justify-center text-xl", style: { backgroundColor: `${getToolColor(tool)}15`, color: getToolColor(tool) }, children: tool?.icon || '🛠️' }), _jsxs("div", { children: [_jsx("h4", { className: "font-black text-sm group-hover:text-blue transition-colors line-clamp-1", children: tool.name }), _jsx("p", { className: "text-xs text-text-4 font-medium line-clamp-2 mt-1", children: tool.desc })] }), _jsxs("div", { className: "flex items-center gap-1 text-xs font-black text-blue uppercase tracking-widest pt-1", children: ["Try Now ", _jsx(ArrowRight, { className: "w-3 h-3 group-hover:translate-x-1 transition-transform" })] })] })] }) }, tool.id))) })] }));
}
