"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { useObjectUrlManager } from "@/src/lib/hooks";
import { Checkbox } from "@/components/ui/Checkbox";
import { ToolInput } from "@/components/ui/ToolInput";
import { workerManager } from "@/src/workers/manager";
import { useProgress } from "@/src/contexts/ProgressContext";
import { useToast } from "@/components/ui/Toast";
import { DropZone } from "@/components/ui/DropZone";
import { PrivacyBadge } from "@/components/system/PrivacyBadge";
const cat = CATEGORIES.find(c => c.id === "pdf");
function parseRanges(input, maxPage) {
    const parts = input.split(",").map(s => s.trim()).filter(Boolean);
    const out = [];
    for (const p of parts) {
        if (p.includes("-")) {
            const [a, b] = p.split("-").map(n => parseInt(n.trim()));
            if (a === undefined || b === undefined)
                continue;
            if (!isNaN(a) && !isNaN(b) && a >= 1 && b <= maxPage && a <= b) {
                const pages = [];
                for (let i = a; i <= b; i++)
                    pages.push(i - 1);
                out.push(pages);
            }
        }
        else {
            const n = parseInt(p);
            if (!isNaN(n) && n >= 1 && n <= maxPage)
                out.push([n - 1]);
        }
    }
    return out;
}
export default function SplitPdfClient() {
    const { createUrl, revokeUrl } = useObjectUrlManager();
    const fileRef = useRef(null);
    const [file, setFile] = useState(null);
    const [pageCount, setPageCount] = useState(0);
    const [ranges, setRanges] = useState("1-3, 4-6");
    const [splitAll, setSplitAll] = useState(false);
    const { state: progressState, startProcessing, setStage, setProgress, finishProcessing } = useProgress();
    const [error, setError] = useState("");
    const [abortController, setAbortController] = useState(null);
    const { toast } = useToast();
    const loadFile = async (files) => {
        const f = files[0];
        if (!f)
            return;
        if (f.type !== "application/pdf" && !f.name.endsWith(".pdf")) {
            toast(`Invalid file type: ${f.name}. Only PDFs are allowed.`, "error");
            return;
        }
        if (f.size > 100 * 1024 * 1024) {
            toast(`File too large: ${f.name}. Maximum size is 100MB.`, "error");
            return;
        }
        setFile(f);
        setError("");
        try {
            const bytes = await f.arrayBuffer();
            const count = await workerManager.getPdfPageCount(bytes);
            setPageCount(count);
        }
        catch {
            setPageCount(0);
        }
    };
    const split = async () => {
        if (!file) {
            setError("Please select a PDF file.");
            return;
        }
        const controller = new AbortController();
        setAbortController(controller);
        startProcessing("heavy");
        setStage("Preparing to split...");
        setProgress(0);
        try {
            const bytes = await file.arrayBuffer();
            const result = await workerManager.splitPdf(bytes, splitAll, ranges, (p) => {
                setStage(p.message || "Splitting...");
                setProgress(p.percent);
            }, controller.signal);
            const mime = result.ext === "zip" ? "application/zip" : "application/pdf";
            const blob = new Blob([result.data], { type: mime });
            const url = createUrl(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${file.name.replace(/\.pdf$/i, "")}-split.${result.ext}`;
            a.click();
            // Revoke after a longer delay (5s) for larger zips to start downloading
            // KL-06: Let useObjectUrlManager handle cleanup
        }
        catch (e) {
            if (e.message === "Task cancelled") {
                setError("Split cancelled.");
                finishProcessing(false, new Error("Split cancelled."));
            }
            else {
                setError(e?.message || "Failed to split PDF.");
                finishProcessing(false, new Error(e?.message || "Failed to split PDF."));
            }
        }
        finally {
            finishProcessing(true);
            setAbortController(null);
        }
    };
    const cancelSplit = () => {
        abortController?.abort();
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(PrivacyBadge, { message: "Processed entirely in your browser" }), _jsx(DropZone, { onFilesSelected: (files) => {
                    if (files && files.length > 0) {
                        const f = files[0];
                        if (f && (f.type === "application/pdf" || f.name.endsWith(".pdf"))) {
                            loadFile(files);
                        }
                    }
                }, accept: ".pdf,application/pdf", multiple: false, title: file ? file.name : "Select PDF File", subtitle: file ? `${pageCount > 0 ? `${pageCount} pages · ` : ""}${(file.size / 1024).toFixed(0)} KB` : "Drag and drop your PDF here" }), _jsxs("div", { className: "bg-surface border border-border p-6 md:p-8 rounded-4xl shadow-sm space-y-6", children: [_jsx(Checkbox, { label: "Split into individual pages (one file per page)", checked: splitAll, onChange: e => setSplitAll(e.target.checked) }), !splitAll && (_jsxs("div", { className: "space-y-3", children: [_jsx(ToolInput, { label: "Page Ranges", value: ranges, onChange: setRanges, placeholder: "e.g. 1-3, 5, 7-9", mono: true, description: pageCount > 0 ? `${pageCount} total pages` : undefined }), _jsxs("p", { className: "text-xs font-bold text-text-4 uppercase tracking-wider leading-relaxed", children: ["Each range becomes a separate PDF. Examples: ", _jsx("code", { className: "text-blue", children: "1-5" }), ", ", _jsx("code", { className: "text-blue", children: "2" }), ", ", _jsx("code", { className: "text-blue", children: "1-3, 5, 7-10" })] })] }))] }), error && _jsx("div", { className: "p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs font-bold uppercase tracking-wider text-center", children: error }), _jsxs("div", { className: "flex gap-4", children: [_jsx("button", { onClick: split, disabled: !file || progressState.isProcessing, className: "flex-1 py-4 bg-blue text-white font-black rounded-xl hover:scale-102 active:scale-98 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100 shadow-lg shadow-blue/20 flex flex-col items-center justify-center gap-1", children: progressState.isProcessing ? "Processing..." : "Split PDF" }), progressState.isProcessing && (_jsx("button", { onClick: cancelSplit, className: "px-6 py-4 bg-red-500/10 text-red-500 font-bold rounded-xl hover:bg-red-500/20 transition-all", children: "Cancel" }))] })] }));
}
