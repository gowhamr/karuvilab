"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { useToast } from "@/components/ui/Toast";
import { useObjectUrlManager } from "@/src/lib/hooks";
import { DropZone } from "@/components/ui/DropZone";
import { Download, Loader2, AlertCircle, FileCode } from "lucide-react";
import { workerOrchestrator } from "@/src/engine/workers/WorkerOrchestrator";
import { useProgress } from "@/src/contexts/ProgressContext";
export default function WordToPdfClient() {
    const { toast } = useToast();
    const { createUrl, revokeUrl } = useObjectUrlManager();
    const [file, setFile] = useState(null);
    const { state: progressState, startProcessing, setStage, finishProcessing } = useProgress();
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);
    const handleFiles = (files) => {
        const f = files instanceof FileList ? files[0] : files[0];
        if (f) {
            setFile(f);
            setResult(null);
            setError(null);
        }
    };
    const convert = async () => {
        if (!file)
            return;
        startProcessing("heavy");
        setStage("Converting to PDF...");
        setError(null);
        try {
            const arrayBuffer = await file.arrayBuffer();
            // Dispatch conversion to Worker Pool
            const pdfBytes = await workerOrchestrator.dispatch("convertDocxToPdf", [arrayBuffer], [arrayBuffer] // transferables
            );
            const blob = new Blob([pdfBytes.buffer], { type: "application/pdf" });
            const name = file.name.replace(/\.docx$/i, "") + ".pdf";
            setResult({ blob, name });
            toast("Conversion successful!");
        }
        catch (err) {
            console.error(err);
            setError(err.message || "Failed to convert document.");
            toast("Conversion failed", "error");
            finishProcessing(false, new Error(err.message || "Failed to convert document."));
        }
        finally {
            finishProcessing(true);
        }
    };
    const download = () => {
        if (!result)
            return;
        const url = createUrl(result.blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = result.name;
        a.click();
        // KL-06: Let useObjectUrlManager handle the cleanup on unmount to prevent 0-byte downloads
    };
    return (_jsxs("div", { className: "space-y-8", children: [_jsx(DropZone, { onFilesSelected: handleFiles, accept: ".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document", title: file ? file.name : "Drop Word document here", description: file ? `${(file.size / 1024).toFixed(0)} KB` : "Supports .docx files", icon: _jsx("div", { className: "text-4xl", children: file ? "📝" : "📄" }) }), error && (_jsxs("div", { className: "p-4 bg-error/5 border border-error/10 rounded-2xl flex items-start gap-3", children: [_jsx(AlertCircle, { className: "w-5 h-5 text-error shrink-0 mt-0.5" }), _jsx("p", { className: "text-sm font-bold text-error", children: error })] })), _jsx("button", { onClick: convert, disabled: !file || progressState.isProcessing, className: "w-full py-4 bg-blue text-white font-black uppercase tracking-widest rounded-2xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-40 disabled:scale-100 shadow-lg shadow-blue/20 flex items-center justify-center gap-2", "aria-label": "Loader2", children: progressState.isProcessing ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "w-5 h-5 animate-spin" }), "Converting..."] })) : ("Convert to PDF") }), result && (_jsx("div", { className: "bg-surface border border-border p-8 rounded-4xl shadow-sm space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "w-12 h-12 bg-success/10 rounded-2xl flex items-center justify-center", children: _jsx(FileCode, { className: "w-6 h-6 text-success" }) }), _jsxs("div", { children: [_jsx("h3", { className: "font-black text-text uppercase tracking-widest text-sm", children: "Conversion Ready" }), _jsx("p", { className: "text-xs font-bold text-text-4 uppercase tracking-tighter", children: result.name })] })] }), _jsxs("button", { onClick: download, className: "flex items-center gap-2 px-6 py-3 bg-success text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:opacity-90 transition-all shadow-lg shadow-success/20", children: [_jsx(Download, { className: "w-4 h-4" }), " Download PDF"] })] }) }))] }));
}
