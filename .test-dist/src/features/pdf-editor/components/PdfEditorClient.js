"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { DropZone } from "@/components/ui/DropZone";
import { getDeviceTier, getMaxFileSize } from "../utils/device";
import PdfWorkspace from "./PdfWorkspace";
export default function PdfEditorClient() {
    const [file, setFile] = useState(null);
    const [pendingFile, setPendingFile] = useState(null);
    const [warning, setWarning] = useState(null);
    const handleFileDrop = (files) => {
        if (!files || files.length === 0)
            return;
        const f = files[0];
        if (!f || f.type !== "application/pdf") {
            alert("Please upload a valid PDF file.");
            return;
        }
        const tier = getDeviceTier();
        const limit = getMaxFileSize(tier);
        if (f.size > limit) {
            setWarning({
                message: `This PDF is ${(f.size / (1024 * 1024)).toFixed(1)} MB, above the recommended limit for your device (${(limit / (1024 * 1024)).toFixed(0)} MB). Editing very large files can cause the browser tab to run out of memory and crash, which would lose any unsaved edits. Continue anyway?`,
                limitMb: limit / (1024 * 1024),
            });
            setPendingFile(f);
        }
        else {
            setFile(f);
        }
    };
    const acceptWarning = () => {
        if (pendingFile) {
            setFile(pendingFile);
            setPendingFile(null);
            setWarning(null);
        }
    };
    const cancelWarning = () => {
        setPendingFile(null);
        setWarning(null);
    };
    if (file) {
        return _jsx(PdfWorkspace, { file: file, onClear: () => setFile(null) });
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(DropZone, { onFilesSelected: handleFileDrop, accept: ".pdf,application/pdf", multiple: false, title: "Drop a PDF file here or click to add", description: "View and annotate your PDF", icon: _jsx("div", { className: "text-4xl", children: "\uD83D\uDCC4" }) }), warning && (_jsxs("div", { className: "bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 p-6 rounded-2xl shadow-sm space-y-4", children: [_jsxs("div", { className: "flex gap-4 items-start", children: [_jsx("div", { className: "text-orange-500 text-2xl", children: "\u26A0\uFE0F" }), _jsxs("div", { className: "space-y-2", children: [_jsx("h3", { className: "font-bold text-orange-800 dark:text-orange-200 uppercase tracking-wider text-sm", children: "Memory Warning" }), _jsx("p", { className: "text-sm text-orange-900 dark:text-orange-100 leading-relaxed", children: warning.message })] })] }), _jsxs("div", { className: "flex gap-3 justify-end mt-4", children: [_jsx("button", { onClick: cancelWarning, className: "px-5 py-2.5 rounded-xl font-bold bg-bg border border-border text-text-2 hover:bg-surface-2 transition-colors", children: "Cancel" }), _jsx("button", { onClick: acceptWarning, className: "px-5 py-2.5 rounded-xl font-bold bg-orange-500 text-white hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20", children: "Continue Anyway" })] })] }))] }));
}
