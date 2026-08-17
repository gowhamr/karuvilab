"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useRef, useCallback } from "react";
import { CopyButton } from "@/components/ui/CopyButton";
import { useObjectUrlManager } from "@/src/lib/hooks";
import { useToast } from "@/components/ui/Toast";
import { Download } from "lucide-react";
import { EngineLoader } from "@/components/system/EngineLoader";
import { workerOrchestrator } from "@/src/engine/workers/WorkerOrchestrator";
import { logger } from "@/src/lib/logger";
import { useProgress } from "@/src/contexts/ProgressContext";
import { DropZone } from "@/components/ui/DropZone";
export default function PdfToWordClient() {
    const { toast } = useToast();
    const [file, setFile] = useState(null);
    const { state: progressState, startProcessing, setStage, finishProcessing } = useProgress();
    const [text, setText] = useState("");
    const [pageCount, setPageCount] = useState(0);
    const [error, setError] = useState("");
    const fileRef = useRef(null);
    const { createUrl, revokeUrl } = useObjectUrlManager();
    const checkLib = useCallback(() => {
        return true; // Library is running in the worker, so it's always ready
    }, []);
    const extract = async () => {
        if (!file) {
            setError("Please select a PDF file.");
            return;
        }
        startProcessing("heavy");
        setStage("Preparing to extract...");
        setError("");
        setText("");
        try {
            const bytes = await file.arrayBuffer();
            const extractedText = await workerOrchestrator.dispatch("extractTextFromPdf", [bytes], [bytes], (p) => setStage(p.message || "Extracting..."));
            setText(extractedText);
            const pages = extractedText.split("\n\n--- Page Break ---\n\n");
            setPageCount(pages.length);
            toast("Text extracted successfully!");
        }
        catch (e) {
            console.error("PDF extraction error:", e);
            setError(e?.message || "Failed to extract text.");
            finishProcessing(false, new Error(e?.message || "Failed to extract text."));
        }
        finally {
            finishProcessing(true);
        }
    };
    const downloadDocx = async () => {
        if (!text)
            return;
        startProcessing("short");
        setStage("Preparing to generate DOCX...");
        try {
            const docxBytes = await workerOrchestrator.dispatch("generateDocxFromText", [text], [], (p) => setStage(p.message || "Generating..."));
            const blob = new Blob([docxBytes], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
            const url = createUrl(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = (file?.name.replace(/\.pdf$/i, "") || "converted") + ".docx";
            a.click();
            // KL-06: Let useObjectUrlManager handle the cleanup on unmount to prevent 0-byte downloads
            toast("Word document downloaded!");
        }
        catch (err) {
            logger.error("DOCX Generation error:", { error: err });
            toast("Failed to generate .docx", "error");
            finishProcessing(false, err);
        }
        finally {
            finishProcessing(true);
        }
    };
    return (_jsx("div", { className: "space-y-6", children: _jsx(EngineLoader, { checkInit: checkLib, loadingMessage: "Preparing extraction engine...", errorMessage: "Failed to load PDF extraction engine.", children: _jsxs(_Fragment, { children: [_jsx(DropZone, { onFilesSelected: (files) => { const f = files[0]; if (f) {
                            setFile(f);
                            setText("");
                        } }, accept: ".pdf,application/pdf", multiple: false, title: file ? file.name : "Drop PDF here", subtitle: file ? `${(file.size / 1024).toFixed(0)} KB` : "or click to browse files" }), error && _jsx("div", { className: "p-4 bg-error/5 border border-error/10 rounded-xl text-error text-xs font-bold", children: error }), _jsx("button", { onClick: extract, disabled: !file || progressState.isProcessing, className: "w-full py-4 bg-blue text-white font-black uppercase tracking-widest rounded-2xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-40 disabled:scale-100 shadow-lg shadow-blue/20", children: progressState.isProcessing ? "Extracting content..." : "Extract PDF Content" }), text && (_jsxs("div", { className: "bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500", children: [_jsxs("div", { className: "flex items-center justify-between gap-4 flex-wrap", children: [_jsxs("div", { className: "space-y-1", children: [_jsx("h2", { className: "font-black text-text text-sm uppercase tracking-widest", children: "Extracted Content" }), _jsxs("p", { className: "text-xs font-bold text-text-4 uppercase tracking-tighter", children: [pageCount, " Pages found"] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(CopyButton, { text: text, label: "Copy Text" }), _jsxs("button", { onClick: downloadDocx, className: "flex items-center gap-2 px-4 py-2 bg-success text-white rounded-xl font-black uppercase tracking-widest text-xs hover:opacity-90 transition-all", children: [_jsx(Download, { className: "w-3.5 h-3.5" }), " Download .docx"] })] })] }), _jsx("textarea", { className: "w-full px-4 py-3 bg-bg border border-border rounded-2xl font-mono text-xs focus:ring-2 focus:ring-blue outline-none transition-all resize-none min-h-72", value: text, readOnly: true })] }))] }) }) }));
}
