"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo, useEffect, useCallback } from "react";
import { CopyButton } from "@/components/ui/CopyButton";
import { ToolInput } from "@/components/ui/ToolInput";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { usePersistentState } from "@/src/lib/hooks";
import { Code, Network, Info, FileJson, Layers, Sparkles, ChevronRight, ChevronDown, ArrowRightLeft, Braces } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { workerManager } from "@/src/workers/manager";
import { StatusBadge } from "@/components/system/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { PrivacyBadge } from "@/components/system/PrivacyBadge";
import { useAnalyticsStore } from "@/src/store/analyticsStore";
import { formatError } from "@/src/lib/formatError";
import { useFocusModeIntegration } from '@/src/contexts/FocusModeControlsContext';
import { useWorkflowIntegration } from "@/src/lib/workflow-hook";
import { WorkflowSuggestions } from "@/components/ui/WorkflowSuggestions";
// ── Helpers ──────────────────────────────────────────────────────────────────
function sortKeysDeep(val) {
    if (Array.isArray(val))
        return val.map(sortKeysDeep);
    if (val !== null && typeof val === "object") {
        return Object.fromEntries(Object.keys(val)
            .sort()
            .map(k => [k, sortKeysDeep(val[k])]));
    }
    return val;
}
function jsonToTs(val, depth = 0) {
    const indent = "  ".repeat(depth);
    const innerIndent = "  ".repeat(depth + 1);
    if (val === null)
        return "null";
    if (Array.isArray(val)) {
        if (val.length === 0)
            return "never[]";
        const itemType = jsonToTs(val[0], depth);
        return `Array<${itemType}>`;
    }
    if (typeof val === "object") {
        const entries = Object.entries(val);
        if (entries.length === 0)
            return "Record<string, never>";
        const lines = entries.map(([k, v]) => `${innerIndent}${/^[a-zA-Z_$][\w$]*$/.test(k) ? k : JSON.stringify(k)}: ${jsonToTs(v, depth + 1)};`);
        return `{\n${lines.join("\n")}\n${indent}}`;
    }
    if (typeof val === "string")
        return "string";
    if (typeof val === "number")
        return "number";
    if (typeof val === "boolean")
        return "boolean";
    return "unknown";
}
function jsonToYaml(val, depth = 0) {
    const indent = "  ".repeat(depth);
    if (val === null)
        return "null";
    if (typeof val === "boolean" || typeof val === "number")
        return String(val);
    if (typeof val === "string") {
        if (val.includes("\n") || val.includes(":") || val.startsWith("{") || val.startsWith("[")) {
            return `|\n${val.split("\n").map(l => `${indent}  ${l}`).join("\n")}`;
        }
        return val;
    }
    if (Array.isArray(val)) {
        if (val.length === 0)
            return "[]";
        return val.map(item => `\n${indent}- ${jsonToYaml(item, depth + 1)}`).join("");
    }
    if (typeof val === "object") {
        const entries = Object.entries(val);
        if (entries.length === 0)
            return "{}";
        return entries.map(([k, v]) => {
            const valStr = jsonToYaml(v, depth + 1);
            const isBlock = typeof v === "object" && v !== null;
            return `\n${indent}${k}:${isBlock ? valStr : ` ${valStr}`}`;
        }).join("");
    }
    return String(val);
}
const MAX_ITEMS = 100;
function TreeNode({ value, depth = 0, maxAutoExpandDepth = 10 }) {
    const [collapsed, setCollapsed] = useState(depth >= maxAutoExpandDepth);
    const [showAll, setShowAll] = useState(false);
    if (value === null)
        return _jsx("span", { className: "text-text-4", children: "null" });
    if (typeof value === "boolean")
        return _jsx("span", { className: "text-blue font-bold", children: String(value) });
    if (typeof value === "number")
        return _jsx("span", { className: "text-emerald-500 font-mono", children: value });
    if (typeof value === "string")
        return _jsxs("span", { className: "text-amber-500", children: ["\"", value, "\""] });
    if (Array.isArray(value)) {
        if (value.length === 0)
            return _jsx("span", { className: "text-text-3", children: "[]" });
        const items = showAll ? value : value.slice(0, MAX_ITEMS);
        const hasMore = value.length > MAX_ITEMS && !showAll;
        return (_jsxs("span", { className: "font-mono", children: [_jsx("button", { onClick: () => setCollapsed(c => !c), "aria-label": collapsed ? "Expand array" : "Collapse array", className: "text-text-4 hover:text-blue transition-colors text-xs mr-1 inline-flex items-center justify-center w-4 h-4 rounded hover:bg-blue/5", children: collapsed ? _jsx(ChevronRight, { size: 10 }) : _jsx(ChevronDown, { size: 10 }) }), _jsx("span", { className: "text-text-3", children: "[" }), collapsed
                    ? _jsxs("button", { className: "text-text-4 hover:text-text transition-colors italic text-xs px-1", onClick: () => setCollapsed(false), "aria-label": `Show ${value.length} items`, children: [value.length, " items"] })
                    : (_jsxs("div", { className: "ml-4 border-l border-border/30 pl-4 my-1", children: [items.map((item, i) => (_jsxs("div", { className: "flex items-start gap-1", children: [_jsx(TreeNode, { value: item, depth: depth + 1, maxAutoExpandDepth: maxAutoExpandDepth }), i < value.length - 1 ? _jsx("span", { className: "text-text-4", children: "," }) : null] }, i))), hasMore && (_jsxs("button", { onClick: () => setShowAll(true), className: "text-blue hover:underline text-tiny font-bold uppercase tracking-widest-sm mt-2 block", children: ["+ Show all ", value.length, " items"] }))] })), _jsx("span", { className: "text-text-3", children: "]" })] }));
    }
    if (typeof value === "object") {
        const entries = Object.entries(value);
        if (entries.length === 0)
            return _jsx("span", { className: "text-text-3", children: "{}" });
        const items = showAll ? entries : entries.slice(0, MAX_ITEMS);
        const hasMore = entries.length > MAX_ITEMS && !showAll;
        return (_jsxs("span", { className: "font-mono", children: [_jsx("button", { onClick: () => setCollapsed(c => !c), "aria-label": collapsed ? "Expand object" : "Collapse object", className: "text-text-4 hover:text-blue transition-colors text-xs mr-1 inline-flex items-center justify-center w-4 h-4 rounded hover:bg-blue/5", children: collapsed ? _jsx(ChevronRight, { size: 10 }) : _jsx(ChevronDown, { size: 10 }) }), _jsx("span", { className: "text-text-3", children: "{" }), collapsed
                    ? _jsxs("button", { className: "text-text-4 hover:text-text transition-colors italic text-xs px-1", onClick: () => setCollapsed(false), "aria-label": `Show ${entries.length} keys`, children: [entries.length, " keys"] })
                    : (_jsxs("div", { className: "ml-4 border-l border-border/30 pl-4 my-1", children: [items.map(([k, v], i) => (_jsxs("div", { className: "flex items-start gap-1", children: [_jsxs("span", { className: "text-blue font-bold flex-shrink-0", children: ["\"", k, "\""] }), _jsx("span", { className: "text-text-3 flex-shrink-0", children: ": " }), _jsx(TreeNode, { value: v, depth: depth + 1, maxAutoExpandDepth: maxAutoExpandDepth }), i < entries.length - 1 ? _jsx("span", { className: "text-text-4", children: "," }) : null] }, k))), hasMore && (_jsxs("button", { onClick: () => setShowAll(true), className: "text-blue hover:underline text-tiny font-bold uppercase tracking-widest-sm mt-2 block", children: ["+ Show all ", entries.length, " keys"] }))] })), _jsx("span", { className: "text-text-3", children: "}" })] }));
    }
    return _jsx("span", { children: String(value) });
}
export default function JSONFormatterClient() {
    const recordConversion = useAnalyticsStore(s => s.recordConversion);
    const [state, setState, isLoaded] = usePersistentState("json-formatter", {
        mode: "beautify",
        input: "",
        indent: 2,
        view: "raw",
        sortKeys: false,
    });
    const [fontSize, setFontSize] = useState(13);
    const [wordWrap, setWordWrap] = useState(false);
    const { mode, input, indent, view, sortKeys } = state;
    const [isProcessing, setIsProcessing] = useState(false);
    const [result, setResult] = useState({
        output: "", error: null, parsed: null
    });
    const [dragState, setDragState] = useState('idle');
    const setMode = useCallback((m) => setState(prev => ({ ...prev, mode: m, view: "raw" })), [setState]);
    const setInput = useCallback((i) => setState(prev => ({ ...prev, input: i })), [setState]);
    const setIndent = useCallback((v) => setState(prev => ({ ...prev, indent: v })), [setState]);
    const setView = useCallback((v) => setState(prev => ({ ...prev, view: v })), [setState]);
    const setSortKeys = useCallback((v) => setState(prev => ({ ...prev, sortKeys: v })), [setState]);
    const { suggestedText } = useWorkflowIntegration("json-formatter");
    useEffect(() => {
        if (suggestedText) {
            Promise.resolve().then(() => {
                setInput(suggestedText);
            });
        }
    }, [suggestedText, setInput]);
    useEffect(() => {
        if (!input.trim()) {
            Promise.resolve().then(() => {
                setResult({ output: "", error: null, parsed: null });
                setIsProcessing(false);
            });
            return;
        }
        const abortController = new AbortController();
        const run = async () => {
            if (input.length > 5 * 1024 * 1024) {
                setResult({ output: "", error: { message: "Input text exceeds 5MB limit" }, parsed: null });
                setIsProcessing(false);
                return;
            }
            if (input.length < 500 * 1024) {
                setIsProcessing(false);
                try {
                    const obj = JSON.parse(input);
                    let out = "";
                    if (mode === "minify") {
                        out = JSON.stringify(obj);
                        setResult({ output: out, error: null, parsed: obj });
                        recordConversion("jsonFormatter");
                    }
                    else {
                        const spaces = indent === "tab" ? "\t" : indent;
                        out = JSON.stringify(obj, null, spaces);
                        setResult({ output: out, error: null, parsed: obj });
                        recordConversion("jsonFormatter");
                    }
                }
                catch (e) {
                    const msg = e.message;
                    const lineMatch = msg.match(/position (\d+)/);
                    let errorData = { message: msg };
                    if (lineMatch) {
                        const pos = Number(lineMatch[1]);
                        const line = input.slice(0, pos).split("\n").length;
                        errorData = { message: msg, line };
                    }
                    setResult({ output: "", error: errorData, parsed: null });
                }
            }
            else {
                setIsProcessing(true);
                try {
                    const res = (await workerManager.processJson(input, mode, indent, abortController.signal));
                    if (!abortController.signal.aborted) {
                        if (res.error) {
                            const msg = res.error.message;
                            const lineMatch = msg.match(/position (\d+)/);
                            if (lineMatch) {
                                const pos = Number(lineMatch[1]);
                                res.error.line = input.slice(0, pos).split("\n").length;
                            }
                        }
                        setResult(res);
                        if (!res.error)
                            recordConversion("jsonFormatter");
                        setIsProcessing(false);
                    }
                }
                catch (err) {
                    if (!abortController.signal.aborted) {
                        setResult({ output: "", error: { message: formatError(err) }, parsed: null });
                        setIsProcessing(false);
                    }
                }
            }
        };
        run();
        return () => abortController.abort();
    }, [input, mode, indent, recordConversion]);
    // Derived: TypeScript interface and YAML outputs
    const tsOutput = useMemo(() => {
        if (!result.parsed)
            return "";
        const sorted = sortKeys ? sortKeysDeep(result.parsed) : result.parsed;
        return `interface Root ${jsonToTs(sorted, 0)}`;
    }, [result.parsed, sortKeys]);
    const yamlOutput = useMemo(() => {
        if (!result.parsed)
            return "";
        const sorted = sortKeys ? sortKeysDeep(result.parsed) : result.parsed;
        return jsonToYaml(sorted).trim();
    }, [result.parsed, sortKeys]);
    // The output shown to the user (raw view — also respects sortKeys)
    const displayOutput = useMemo(() => {
        if (!result.parsed || !result.output)
            return result.output;
        if (!sortKeys)
            return result.output;
        const sorted = sortKeysDeep(result.parsed);
        const spaces = indent === "tab" ? "\t" : indent;
        return mode === "minify" ? JSON.stringify(sorted) : JSON.stringify(sorted, null, spaces);
    }, [result, sortKeys, indent, mode]);
    const activeOutput = view === "typescript" ? tsOutput : view === "yaml" ? yamlOutput : displayOutput;
    useFocusModeIntegration({
        charCount: displayOutput.length,
        lineCount: displayOutput ? displayOutput.split('\n').length : 0,
        language: "json",
        onFontSizeChange: setFontSize,
        onWrapToggle: () => setWordWrap(v => !v)
    });
    const { error, parsed } = result;
    if (!isLoaded)
        return _jsx("div", { className: "animate-pulse h-full bg-surface/50 rounded-4xl border border-border" });
    return (_jsx("div", { className: "w-full", children: _jsxs("div", { className: "space-y-12 w-full", children: [_jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8 items-start", children: [_jsx("div", { className: "lg:col-span-2 space-y-8", children: _jsxs("div", { className: "bg-surface border border-border rounded-4xl p-6 sm:p-8 shadow-sm space-y-8 relative overflow-hidden", children: [isProcessing && (_jsx("div", { className: "absolute top-0 left-0 w-full h-1 bg-blue/10 overflow-hidden", children: _jsx("div", { className: "h-full bg-blue animate-progress w-full" }) })), _jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-border/50", children: [_jsxs("h2", { className: "text-sm font-black uppercase tracking-widest text-text flex items-center gap-3", children: [_jsx(FileJson, { className: "w-4 h-4 text-blue" }), "Source JSON"] }), _jsx(SegmentedControl, { "aria-label": "Format Mode", options: [
                                                    { id: "beautify", label: "Beautify", icon: _jsx(Sparkles, { className: "w-3 h-3" }) },
                                                    { id: "minify", label: "Minify", icon: _jsx(Layers, { className: "w-3 h-3" }) }
                                                ], activeId: mode, onChange: setMode })] }), _jsx(ToolInput, { label: "Input Data", value: input, onChange: setInput, placeholder: 'Paste JSON here, e.g. {"name":"KaruviLab"}', rows: 12, mono: true, style: { fontSize: `${fontSize}px` }, error: error?.message, description: error?.line ? `Error on line ${error.line}` : undefined, loading: isProcessing })] }) }), _jsxs("aside", { className: "space-y-6 lg:sticky lg:top-8", children: [_jsx("h2", { className: "text-tiny font-bold uppercase tracking-widest-sm text-text-4 px-2", children: "Settings" }), _jsxs("div", { className: "bg-surface border border-border rounded-4xl p-6 space-y-6 shadow-sm", children: [mode === "beautify" && (_jsxs("div", { className: "space-y-4", children: [_jsx("p", { className: "text-tiny font-bold uppercase tracking-widest-sm text-text-3", children: "Indentation" }), _jsx("div", { className: "flex flex-wrap gap-2", children: [2, 4, "tab"].map(v => (_jsx("button", { onClick: () => setIndent(v), "aria-pressed": indent === v, className: cn("px-4 py-2 rounded-xl text-xs font-bold transition-all border", indent === v
                                                            ? "bg-blue border-blue text-white shadow-lg"
                                                            : "bg-mat-hover border-border text-text-2 hover:border-blue/30"), children: v === "tab" ? "Tab" : `${v} Spc` }, String(v)))) })] })), _jsxs("div", { className: "space-y-2", children: [_jsx("p", { className: "text-tiny font-bold uppercase tracking-widest-sm text-text-3", children: "Transform" }), _jsxs("button", { onClick: () => setSortKeys(!sortKeys), "aria-pressed": sortKeys, className: cn("w-full flex items-center justify-between px-4 py-2.5 rounded-xl border text-xs font-bold transition-all", sortKeys ? "bg-blue/10 border-blue text-blue" : "bg-bg border-border text-text-2 hover:border-blue/30"), children: ["Sort Keys A\u2013Z", _jsx("span", { className: cn("w-8 h-4 rounded-full transition-colors relative", sortKeys ? "bg-blue" : "bg-border"), children: _jsx("span", { className: cn("absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform", sortKeys ? "left-[18px]" : "left-0.5") }) })] })] }), _jsxs("div", { className: "p-4 bg-blue/5 border border-blue/10 rounded-2xl space-y-3", children: [_jsxs("div", { className: "flex items-center gap-2 text-blue", children: [_jsx(Info, { className: "w-3 h-3" }), _jsx("span", { className: "text-tiny font-black uppercase tracking-widest text-blue-dark", children: "Pro Tip" })] }), _jsxs("p", { className: "text-xs text-text-3 leading-relaxed font-medium", children: ["Switch to ", _jsx("span", { className: "text-blue font-bold", children: "Tree View" }), " in the results area to explore complex nested objects."] })] })] })] })] }), _jsxs("div", { className: "space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [_jsxs("div", { className: "flex items-center gap-3 flex-wrap", children: [_jsxs("h2", { className: "text-sm font-black uppercase tracking-widest-lg text-blue flex items-center gap-3", children: [_jsx(Code, { className: "w-4 h-4" }), "Output"] }), _jsx(StatusBadge, { status: isProcessing ? "processing" : error ? "error" : result.output ? "complete" : "idle" }), _jsx(PrivacyBadge, { message: "Local processing", className: "hidden sm:inline-flex" })] }), _jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [_jsx(SegmentedControl, { "aria-label": "Output View", options: [
                                                { id: "raw", label: "Raw", icon: _jsx(FileJson, { className: "w-3 h-3" }) },
                                                { id: "tree", label: "Tree", icon: _jsx(Network, { className: "w-3 h-3" }) },
                                                { id: "typescript", label: "TS", icon: _jsx(Braces, { className: "w-3 h-3" }) },
                                                { id: "yaml", label: "YAML", icon: _jsx(ArrowRightLeft, { className: "w-3 h-3" }) },
                                            ], activeId: view, onChange: setView, disabled: isProcessing }), _jsx("div", { className: "w-px h-6 bg-border hidden sm:block" }), _jsx(CopyButton, { text: activeOutput, disabled: isProcessing || !activeOutput })] })] }), _jsx("div", { className: "bg-surface border border-border rounded-4xl p-2 shadow-sm min-h-96 relative", children: (!displayOutput && !isProcessing && !error) ? (_jsx(EmptyState, { toolId: "jsonFormatter", icon: Code, headline: "Paste JSON here", toolType: "text", onDrop: (files) => {
                                    const reader = new FileReader();
                                    reader.onload = (e) => setInput(e.target?.result);
                                    if (files[0])
                                        reader.readAsText(files[0]);
                                }, dragState: dragState, onDragOver: () => setDragState('over'), onDragLeave: () => setDragState('idle'), outcomeText: "Result: Format and validate JSON instantly", sampleCTA: { label: "Try Sample JSON" } })) : isProcessing ? (_jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center p-12 text-center space-y-4 text-blue", children: [_jsx("div", { className: "w-12 h-12 bg-blue/10 rounded-full flex items-center justify-center animate-pulse", children: _jsx(FileJson, { size: 24 }) }), _jsx("p", { className: "text-sm font-black uppercase tracking-widest text-text", children: "Processing Data..." })] })) : view === "tree" && parsed !== null ? (_jsx("div", { className: "p-4 sm:p-6 w-full overflow-hidden", children: _jsx("div", { className: "w-full px-4 sm:px-6 py-4 bg-bg border border-border rounded-2xl overflow-x-auto overflow-y-auto max-h-[50vh] custom-scrollbar", children: _jsx("div", { className: "min-w-max", children: _jsx(TreeNode, { value: sortKeys ? sortKeysDeep(parsed) : parsed, depth: 0, maxAutoExpandDepth: 10 }) }) }) })) : (view === "typescript" || view === "yaml") && parsed !== null ? (_jsx("textarea", { readOnly: true, "aria-label": view === "typescript" ? "TypeScript interface output" : "YAML output", className: `w-full min-h-96 p-6 sm:p-8 bg-transparent font-mono text-text-2 resize-none outline-none custom-scrollbar whitespace-pre overflow-x-auto`, style: { fontSize: `${fontSize}px` }, value: activeOutput, placeholder: "Results will appear here..." })) : (_jsx("textarea", { readOnly: true, "aria-label": "Formatted JSON output", className: `w-full min-h-96 p-6 sm:p-8 bg-transparent font-mono text-text-2 resize-none outline-none custom-scrollbar ${wordWrap ? 'whitespace-pre-wrap' : 'whitespace-pre overflow-x-auto'}`, style: { fontSize: `${fontSize}px` }, value: displayOutput, placeholder: "Results will appear here..." })) }), _jsx(WorkflowSuggestions, {})] })] }) }));
}
