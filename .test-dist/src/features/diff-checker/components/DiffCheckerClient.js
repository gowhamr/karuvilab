"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo, useRef, useCallback } from "react";
import { CopyButton } from "@/components/ui/CopyButton";
import { Upload, AlignJustify, Columns, Eye, EyeOff } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useToast } from "@/components/ui/Toast";
function charDiff(a, b) {
    const la = a.split("");
    const lb = b.split("");
    const m = la.length;
    const n = lb.length;
    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    for (let i = m - 1; i >= 0; i--)
        for (let j = n - 1; j >= 0; j--)
            dp[i][j] = la[i] === lb[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    const partsA = [];
    const partsB = [];
    let i = 0, j = 0;
    while (i < m && j < n) {
        if (la[i] === lb[j]) {
            partsA.push({ text: la[i], changed: false });
            partsB.push({ text: lb[j], changed: false });
            i++;
            j++;
        }
        else if (dp[i + 1][j] >= dp[i][j + 1]) {
            partsA.push({ text: la[i], changed: true });
            i++;
        }
        else {
            partsB.push({ text: lb[j], changed: true });
            j++;
        }
    }
    while (i < m) {
        partsA.push({ text: la[i++], changed: true });
    }
    while (j < n) {
        partsB.push({ text: lb[j++], changed: true });
    }
    return { a: partsA, b: partsB };
}
function computeDiff(a, b, ignoreWs) {
    const normalize = (s) => ignoreWs ? s.trim() : s;
    const linesA = a.split("\n");
    const linesB = b.split("\n");
    const m = linesA.length;
    const n = linesB.length;
    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    for (let i = m - 1; i >= 0; i--)
        for (let j = n - 1; j >= 0; j--)
            dp[i][j] = normalize(linesA[i]) === normalize(linesB[j])
                ? dp[i + 1][j + 1] + 1
                : Math.max(dp[i + 1][j], dp[i][j + 1]);
    const result = [];
    let i = 0, j = 0, lineA = 1, lineB = 1;
    while (i < m && j < n) {
        if (normalize(linesA[i]) === normalize(linesB[j])) {
            result.push({ type: "equal", text: linesA[i], lineA: lineA++, lineB: lineB++ });
            i++;
            j++;
        }
        else if (dp[i + 1][j] >= dp[i][j + 1]) {
            result.push({ type: "removed", text: linesA[i], lineA: lineA++ });
            i++;
        }
        else {
            result.push({ type: "added", text: linesB[j], lineB: lineB++ });
            j++;
        }
    }
    while (i < m) {
        result.push({ type: "removed", text: linesA[i++], lineA: lineA++ });
    }
    while (j < n) {
        result.push({ type: "added", text: linesB[j++], lineB: lineB++ });
    }
    return result;
}
function toUnifiedDiff(diff) {
    return diff.map(l => l.type === "added" ? `+ ${l.text}` :
        l.type === "removed" ? `- ${l.text}` :
            `  ${l.text}`).join("\n");
}
function CharDiffLine({ text, type, otherText }) {
    const parts = useMemo(() => {
        const r = charDiff(type === "removed" ? text : otherText, type === "removed" ? otherText : text);
        return type === "removed" ? r.a : r.b;
    }, [text, otherText, type]);
    const isChanged = parts.some(p => p.changed);
    if (!isChanged)
        return _jsx("span", { className: "whitespace-pre", children: text });
    return (_jsx("span", { className: "whitespace-pre", children: parts.map((p, i) => p.changed
            ? _jsx("mark", { className: cn("rounded-sm", type === "removed" ? "bg-red-500/40 text-red-200" : "bg-green-500/40 text-green-200"), children: p.text }, i)
            : _jsx("span", { children: p.text }, i)) }));
}
function DropArea({ id, label, value, onChange }) {
    const inputRef = useRef(null);
    const [dragging, setDragging] = useState(false);
    const { toast } = useToast();
    const handleChange = useCallback((v) => {
        if (v.length > 500000) {
            toast("Text exceeds maximum 500KB limit for diffing", "error");
            onChange(v.slice(0, 500000));
        }
        else {
            onChange(v);
        }
    }, [onChange, toast]);
    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        if (!file)
            return;
        const reader = new FileReader();
        reader.onload = ev => handleChange(ev.target?.result ?? "");
        reader.readAsText(file);
    }, [handleChange]);
    return (_jsxs("div", { className: cn("bg-surface border rounded-2xl p-5 space-y-3 transition-colors", dragging ? "border-blue bg-blue/5" : "border-border"), onDragOver: e => { e.preventDefault(); setDragging(true); }, onDragLeave: () => setDragging(false), onDrop: handleDrop, children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("label", { htmlFor: id, className: "text-sm font-bold text-text-2", children: label }), _jsxs("button", { type: "button", onClick: () => inputRef.current?.click(), className: "flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-border bg-bg text-text-4 hover:text-blue hover:border-blue/40 text-xs font-bold transition-colors", "aria-label": `Upload file for ${label}`, children: [_jsx(Upload, { className: "w-3 h-3" }), " Upload File"] }), _jsx("input", { ref: inputRef, type: "file", accept: "text/*,.json,.ts,.js,.md,.yaml,.yml,.csv,.xml,.html,.css", className: "hidden", onChange: e => {
                            const file = e.target.files?.[0];
                            if (!file)
                                return;
                            const reader = new FileReader();
                            reader.onload = ev => handleChange(ev.target?.result ?? "");
                            reader.readAsText(file);
                        } })] }), _jsx("textarea", { id: id, "aria-label": label, className: cn("w-full px-4 py-3 bg-bg border border-border rounded-xl font-mono text-sm focus:ring-2 focus:ring-blue outline-none transition-all resize-none", dragging && "ring-2 ring-blue"), rows: 20, placeholder: dragging ? "Drop to load file..." : `Paste ${label.toLowerCase()} text or drop a file…`, value: value, onChange: e => handleChange(e.target.value) })] }));
}
export default function DiffCheckerClient() {
    const [textA, setTextA] = useState("");
    const [textB, setTextB] = useState("");
    const [ignoreWs, setIgnoreWs] = useState(false);
    const [viewMode, setViewMode] = useState("split");
    const [showEqual, setShowEqual] = useState(true);
    const [charLevel, setCharLevel] = useState(true);
    const diff = useMemo(() => (textA || textB) ? computeDiff(textA, textB, ignoreWs) : null, [textA, textB, ignoreWs]);
    const stats = useMemo(() => {
        if (!diff)
            return null;
        return {
            added: diff.filter(l => l.type === "added").length,
            removed: diff.filter(l => l.type === "removed").length,
            equal: diff.filter(l => l.type === "equal").length,
        };
    }, [diff]);
    // Build paired lines for char-level diff (removed immediately followed by added)
    const pairedDiff = useMemo(() => {
        if (!diff)
            return null;
        const pairs = [];
        for (let i = 0; i < diff.length; i++) {
            const cur = diff[i];
            const next = diff[i + 1];
            if (cur.type === "removed" && next?.type === "added") {
                pairs.push({ line: cur, partner: next.text });
                pairs.push({ line: next, partner: cur.text });
                i++;
            }
            else {
                pairs.push({ line: cur });
            }
        }
        return pairs;
    }, [diff]);
    const filteredDiff = useMemo(() => {
        if (!pairedDiff)
            return null;
        return showEqual ? pairedDiff : pairedDiff.filter(p => p.line.type !== "equal");
    }, [pairedDiff, showEqual]);
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsx(DropArea, { id: "diff-original", label: "Original", value: textA, onChange: setTextA }), _jsx(DropArea, { id: "diff-modified", label: "Modified", value: textB, onChange: setTextB })] }), diff && stats && (_jsxs("div", { className: "bg-surface border border-border rounded-2xl p-4 space-y-4", children: [_jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [_jsxs("div", { className: "flex items-center gap-2 text-sm", children: [_jsx("span", { className: "w-3 h-3 rounded-sm bg-green-500/20 border border-green-500/30 inline-block" }), _jsxs("span", { className: "text-green-600 dark:text-green-400 font-bold", children: ["+", stats.added, " added"] })] }), _jsxs("div", { className: "flex items-center gap-2 text-sm", children: [_jsx("span", { className: "w-3 h-3 rounded-sm bg-red-500/20 border border-red-500/30 inline-block" }), _jsxs("span", { className: "text-red-500 font-bold", children: ["\u2212", stats.removed, " removed"] })] }), _jsx("div", { className: "flex items-center gap-2 text-sm text-text-4", children: _jsxs("span", { className: "font-bold", children: [stats.equal, " unchanged"] }) }), _jsx("div", { className: "ml-auto flex flex-wrap gap-2", children: _jsx(CopyButton, { text: toUnifiedDiff(diff), label: "Copy Unified Diff" }) })] }), _jsxs("div", { className: "flex flex-wrap gap-2 border-t border-border/40 pt-3", children: [_jsxs("div", { className: "flex rounded-xl border border-border overflow-hidden", children: [_jsxs("button", { onClick: () => setViewMode("split"), className: cn("px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 transition-colors", viewMode === "split" ? "bg-blue text-white" : "bg-bg text-text-3 hover:bg-surface"), "aria-pressed": viewMode === "split", children: [_jsx(Columns, { className: "w-3 h-3" }), " Split"] }), _jsxs("button", { onClick: () => setViewMode("unified"), className: cn("px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 transition-colors", viewMode === "unified" ? "bg-blue text-white" : "bg-bg text-text-3 hover:bg-surface"), "aria-pressed": viewMode === "unified", children: [_jsx(AlignJustify, { className: "w-3 h-3" }), " Unified"] })] }), _jsx("button", { onClick: () => setIgnoreWs(v => !v), "aria-pressed": ignoreWs, className: cn("px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors", ignoreWs ? "bg-blue/10 border-blue text-blue" : "bg-bg border-border text-text-3 hover:border-blue/40"), children: "Ignore Whitespace" }), _jsx("button", { onClick: () => setCharLevel(v => !v), "aria-pressed": charLevel, className: cn("px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors", charLevel ? "bg-blue/10 border-blue text-blue" : "bg-bg border-border text-text-3 hover:border-blue/40"), children: "Char-level Diff" }), _jsxs("button", { onClick: () => setShowEqual(v => !v), className: "px-3 py-1.5 rounded-xl border border-border bg-bg text-text-3 hover:border-blue/40 text-xs font-bold flex items-center gap-1.5 transition-colors", "aria-pressed": showEqual, children: [showEqual ? _jsx(EyeOff, { className: "w-3 h-3" }) : _jsx(Eye, { className: "w-3 h-3" }), showEqual ? "Hide" : "Show", " Unchanged"] })] })] })), filteredDiff && (_jsx("div", { className: "bg-surface border border-border rounded-2xl overflow-hidden", children: _jsx("div", { className: "overflow-auto max-h-[65vh] custom-scrollbar", children: viewMode === "unified" ? (_jsx("table", { className: "w-full text-sm font-mono", children: _jsx("tbody", { children: filteredDiff.map(({ line }, i) => (_jsxs("tr", { className: line.type === "added" ? "bg-green-500/10" : line.type === "removed" ? "bg-red-500/10" : "", children: [_jsx("td", { className: "w-10 px-2 py-0.5 text-right text-text-4 text-xs border-r border-border select-none", children: line.lineA ?? "" }), _jsx("td", { className: "w-10 px-2 py-0.5 text-right text-text-4 text-xs border-r border-border select-none", children: line.lineB ?? "" }), _jsx("td", { className: `px-3 py-0.5 w-4 border-r border-border font-bold ${line.type === "added" ? "text-green-500" : line.type === "removed" ? "text-red-500" : "text-text-4"}`, children: line.type === "added" ? "+" : line.type === "removed" ? "−" : " " }), _jsx("td", { className: `px-3 py-0.5 ${line.type === "added" ? "text-green-700 dark:text-green-300" : line.type === "removed" ? "text-red-600 dark:text-red-300" : "text-text"}`, children: charLevel && (line.type === "added" || line.type === "removed") && filteredDiff[i]
                                            ? _jsx(CharDiffLine, { text: line.text, type: line.type, otherText: filteredDiff[i].partner ?? line.text })
                                            : _jsx("span", { className: "whitespace-pre", children: line.text }) })] }, i))) }) })) : (_jsxs("div", { className: "grid grid-cols-2 divide-x divide-border", children: [_jsx("table", { className: "w-full text-sm font-mono", children: _jsx("tbody", { children: filteredDiff.map(({ line, partner }, i) => {
                                        if (line.type === "added")
                                            return (_jsxs("tr", { className: "h-[1.5rem]", children: [_jsx("td", { className: "w-10 px-2 py-0.5 text-right text-text-4 text-xs border-r border-border select-none" }), _jsx("td", { className: "px-3 py-0.5 bg-green-500/5" })] }, i));
                                        return (_jsxs("tr", { className: line.type === "removed" ? "bg-red-500/10" : "", children: [_jsx("td", { className: "w-10 px-2 py-0.5 text-right text-text-4 text-xs border-r border-border select-none", children: line.lineA ?? "" }), _jsx("td", { className: `px-3 py-0.5 ${line.type === "removed" ? "text-red-600 dark:text-red-300" : "text-text"}`, children: charLevel && line.type === "removed" && partner
                                                        ? _jsx(CharDiffLine, { text: line.text, type: "removed", otherText: partner })
                                                        : _jsx("span", { className: "whitespace-pre", children: line.text }) })] }, i));
                                    }) }) }), _jsx("table", { className: "w-full text-sm font-mono", children: _jsx("tbody", { children: filteredDiff.map(({ line, partner }, i) => {
                                        if (line.type === "removed")
                                            return (_jsxs("tr", { className: "h-[1.5rem]", children: [_jsx("td", { className: "w-10 px-2 py-0.5 text-right text-text-4 text-xs border-r border-border select-none" }), _jsx("td", { className: "px-3 py-0.5 bg-red-500/5" })] }, i));
                                        return (_jsxs("tr", { className: line.type === "added" ? "bg-green-500/10" : "", children: [_jsx("td", { className: "w-10 px-2 py-0.5 text-right text-text-4 text-xs border-r border-border select-none", children: line.lineB ?? "" }), _jsx("td", { className: `px-3 py-0.5 ${line.type === "added" ? "text-green-700 dark:text-green-300" : "text-text"}`, children: charLevel && line.type === "added" && partner
                                                        ? _jsx(CharDiffLine, { text: line.text, type: "added", otherText: partner })
                                                        : _jsx("span", { className: "whitespace-pre", children: line.text }) })] }, i));
                                    }) }) })] })) }) }))] }));
}
