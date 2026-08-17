"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useId } from "react";
// Removed pdf-lib import
import { CATEGORIES } from "@/src/tool-registry";
import { useObjectUrlManager } from "@/src/lib/hooks";
import { SliderField } from "@/components/ui/SliderField";
import { DropZone } from "@/components/ui/DropZone";
const cat = CATEGORIES.find(c => c.id === "pdf");
export default function PageNumberingClient() {
    const prefixId = useId();
    const startId = useId();
    const suffixId = useId();
    const colorId = useId();
    const { createUrl, revokeUrl } = useObjectUrlManager();
    const [file, setFile] = useState(null);
    const [startNum, setStartNum] = useState(1);
    const [prefix, setPrefix] = useState("");
    const [suffix, setSuffix] = useState("");
    const [position, setPosition] = useState("bottom-center");
    const [fontSize, setFontSize] = useState(12);
    const [color, setColor] = useState("#333333");
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState("");
    const [totalPages, setTotalPages] = useState(null);
    const [includeTotal, setIncludeTotal] = useState(false);
    const fileRef = useRef(null);
    const inputClass = "w-full px-4 py-3 bg-bg border border-border rounded-xl focus:ring-2 focus:ring-blue outline-none transition-all";
    const POSITIONS = ["bottom-center", "bottom-right", "bottom-left", "top-center", "top-right", "top-left"];
    const handleFileChange = async (f) => {
        if (!f) {
            setFile(null);
            setTotalPages(null);
            return;
        }
        setFile(f);
        try {
            const { workerManager } = await import("@/src/workers/manager");
            const bytes = await f.arrayBuffer();
            const count = await workerManager.getPdfPageCount(bytes);
            setTotalPages(count);
        }
        catch (e) {
            console.error("Failed to get total pages:", e);
        }
    };
    const addNumbers = async () => {
        if (!file) {
            setError("Please select a PDF file.");
            return;
        }
        setProcessing(true);
        setError("");
        try {
            const { workerManager } = await import("@/src/workers/manager");
            const bytes = await file.arrayBuffer();
            const finalSuffix = includeTotal && totalPages ? `${suffix} of ${totalPages}` : suffix;
            const outBytes = await workerManager.addPageNumbersToPdf(bytes, {
                startNum,
                prefix,
                suffix: finalSuffix,
                position,
                fontSize,
                colorHex: color,
            });
            const blob = new Blob([outBytes], { type: "application/pdf" });
            const url = createUrl(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = file.name.replace(/\.pdf$/i, "") + "-numbered.pdf";
            a.click();
            revokeUrl(url);
        }
        catch (e) {
            setError(e?.message || "Failed to add page numbers.");
        }
        setProcessing(false);
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "grid gap-6 lg:grid-cols-2", children: [_jsxs("div", { className: "space-y-4", children: [_jsx(DropZone, { onFilesSelected: (files) => handleFileChange(files[0]), accept: ".pdf,application/pdf", multiple: false, title: file ? file.name : "Select PDF File", subtitle: file ? `${(file.size / 1024).toFixed(0)} KB` : "Drag and drop your PDF here" }), _jsxs("div", { className: "bg-surface border border-border p-5 rounded-2xl shadow-sm space-y-4", children: [_jsx("h2", { className: "font-bold text-text-2 text-sm uppercase tracking-wider", children: "Settings" }), _jsxs("div", { className: "grid grid-cols-3 gap-3", children: [_jsxs("div", { className: "space-y-1", children: [_jsx("label", { htmlFor: prefixId, className: "text-sm font-medium", children: "Prefix" }), _jsx("input", { id: prefixId, type: "text", className: inputClass, value: prefix, onChange: e => setPrefix(e.target.value), placeholder: "Page " })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { htmlFor: startId, className: "text-sm font-medium", children: "Start #" }), _jsx("input", { id: startId, type: "number", className: inputClass, value: startNum, min: 0, onChange: e => setStartNum(Number(e.target.value)) })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { htmlFor: suffixId, className: "text-sm font-medium", children: "Suffix" }), _jsx("input", { id: suffixId, type: "text", className: inputClass, value: suffix, onChange: e => setSuffix(e.target.value), placeholder: "" })] }), _jsxs("div", { className: "col-span-3 flex items-center gap-2 mt-1", children: [_jsx("input", { type: "checkbox", id: "includeTotal", checked: includeTotal, onChange: (e) => setIncludeTotal(e.target.checked), disabled: !totalPages, className: "rounded border-border text-blue focus:ring-blue cursor-pointer disabled:opacity-50" }), _jsxs("label", { htmlFor: "includeTotal", className: `text-sm font-medium ${!totalPages ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`, children: ["Include total pages (e.g. Page 1 ", suffix, " of ", totalPages || 'N', ")"] })] })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-sm font-medium", children: "Position" }), _jsx("div", { className: "grid grid-cols-3 gap-2", children: POSITIONS.map(p => (_jsx("button", { onClick: () => setPosition(p), className: `py-2 rounded-xl text-xs font-medium capitalize transition-colors ${position === p ? "bg-blue text-white" : "bg-bg border border-border text-text-3 hover:border-blue"}`, children: p.replace("-", " ") }, p))) })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsx(SliderField, { id: "fontSize", label: "Font Size", min: 8, max: 24, value: fontSize, onChange: setFontSize, format: v => `${v}px` }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { htmlFor: colorId, className: "text-sm font-medium", children: "Color" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { id: colorId, type: "color", value: color, onChange: e => setColor(e.target.value), className: "w-10 h-10 rounded-lg border border-border cursor-pointer" }), _jsx("input", { type: "text", className: "flex-1 px-3 py-2 bg-bg border border-border rounded-xl font-mono text-xs focus:ring-2 focus:ring-blue outline-none", value: color, onChange: e => setColor(e.target.value) })] })] })] })] })] }), _jsxs("div", { className: "bg-surface border border-border p-5 rounded-2xl shadow-sm space-y-3", children: [_jsx("h2", { className: "font-bold text-text-2 text-sm uppercase tracking-wider", children: "Preview" }), _jsxs("div", { className: "bg-white dark:bg-zinc-900 border border-border rounded-xl aspect-[3/4] relative overflow-hidden", children: [_jsx("div", { className: "absolute inset-4 border-2 border-dashed border-gray-200 dark:border-zinc-700 rounded flex items-center justify-center", children: _jsx("span", { className: "text-text-4 text-xs", children: "Page content" }) }), _jsx("div", { className: "absolute text-xs font-mono", style: {
                                            color,
                                            fontSize: `${Math.max(8, fontSize * 0.7)}px`,
                                            ...(position === "bottom-center" ? { bottom: 8, left: "50%", transform: "translateX(-50%)" } :
                                                position === "bottom-right" ? { bottom: 8, right: 8 } :
                                                    position === "bottom-left" ? { bottom: 8, left: 8 } :
                                                        position === "top-center" ? { top: 8, left: "50%", transform: "translateX(-50%)" } :
                                                            position === "top-right" ? { top: 8, right: 8 } :
                                                                { top: 8, left: 8 }),
                                        }, children: `${prefix}${startNum}${includeTotal && totalPages ? `${suffix} of ${totalPages}` : suffix}` })] })] })] }), error && _jsx("div", { className: "p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl text-red-600 text-sm", children: error }), _jsx("button", { onClick: addNumbers, disabled: !file || processing, className: "w-full py-4 bg-blue text-white font-bold rounded-xl hover:scale-102 active:scale-98 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100", children: processing ? "Adding page numbers…" : "Add Page Numbers & Download" })] }));
}
