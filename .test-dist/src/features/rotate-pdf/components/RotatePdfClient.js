"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { useObjectUrlManager } from "@/src/lib/hooks";
import { DropZone } from "@/components/ui/DropZone";
import { Checkbox } from "@/components/ui/Checkbox";
import { workerManager } from "@/src/workers/manager";
import { useProgress } from "@/src/contexts/ProgressContext";
import { PdfPagePreview } from "@/components/ui/PdfPagePreview";
const cat = CATEGORIES.find(c => c.id === "pdf");
export default function RotatePdfClient() {
    const [file, setFile] = useState(null);
    const [pageCount, setPageCount] = useState(0);
    const [rotateAll, setRotateAll] = useState(true);
    const [allAngle, setAllAngle] = useState(90);
    const [pageAngles, setPageAngles] = useState([]);
    const [error, setError] = useState("");
    const fileRef = useRef(null);
    const { createUrl, revokeUrl } = useObjectUrlManager();
    const { state: progressState, startProcessing, setStage, setProgress, finishProcessing } = useProgress();
    const [abortController, setAbortController] = useState(null);
    const loadFile = async (f) => {
        setFile(f);
        setError("");
        try {
            const bytes = await f.arrayBuffer();
            const count = await workerManager.getPdfPageCount(bytes);
            setPageCount(count);
            setPageAngles(Array(count).fill(90));
        }
        catch {
            setPageCount(0);
        }
    };
    const rotate = async () => {
        if (!file) {
            setError("Please select a PDF file.");
            return;
        }
        const controller = new AbortController();
        setAbortController(controller);
        startProcessing("heavy");
        setStage("Preparing to rotate...");
        setProgress(0);
        setError("");
        try {
            const bytes = await file.arrayBuffer();
            if (pageAngles.length === 0)
                setPageAngles(Array(pageCount).fill(90));
            const outBytes = await workerManager.rotatePdf(bytes, rotateAll, allAngle, pageAngles, (p) => {
                setStage(p.message || "Rotating...");
                setProgress(p.percent);
            }, controller.signal);
            const blob = new Blob([outBytes], { type: "application/pdf" });
            const url = createUrl(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = file.name.replace(/\.pdf$/i, "") + "-rotated.pdf";
            a.click();
            revokeUrl(url);
        }
        catch (e) {
            if (e.message === "Task cancelled") {
                setError("Rotate cancelled.");
            }
            else {
                setError(e?.message || "Failed to rotate PDF.");
            }
        }
        finally {
            finishProcessing(true);
            setAbortController(null);
        }
    };
    const cancelRotate = () => {
        abortController?.abort();
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(DropZone, { onFilesSelected: (files) => { const f = files[0]; if (f)
                    loadFile(f); }, accept: ".pdf,application/pdf", multiple: false, title: file ? file.name : "Select PDF File", subtitle: file ? `${pageCount > 0 ? `${pageCount} pages · ` : ""}${(file.size / 1024).toFixed(0)} KB` : "Drag and drop your PDF here" }), _jsxs("div", { className: "bg-surface border border-border p-6 md:p-8 rounded-4xl shadow-sm space-y-6", children: [_jsx(Checkbox, { label: "Rotate all pages by the same angle", checked: rotateAll, onChange: e => setRotateAll(e.target.checked) }), rotateAll ? (_jsxs("div", { className: "space-y-4", children: [_jsx("label", { className: "text-sm font-bold text-text-2", children: "Rotation Angle" }), _jsx("div", { className: "flex gap-3 flex-wrap", children: [90, 180, 270, -90].map(a => (_jsx("button", { onClick: () => setAllAngle(a), className: `px-6 py-3 rounded-xl text-sm font-bold transition-all ${allAngle === a ? "bg-blue text-white shadow-lg shadow-blue/20" : "bg-bg border border-border text-text-3 hover:border-blue hover:text-blue"}`, children: a === -90 ? "−90° (CCW)" : `${a}° CW` }, a))) })] })) : (pageCount > 0 && (_jsxs("div", { className: "space-y-4", children: [_jsx("label", { className: "text-sm font-bold text-text-2", children: "Per-page rotation" }), _jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar p-2", children: Array.from({ length: pageCount }, (_, i) => (_jsxs("div", { className: "flex flex-col items-center gap-3 bg-bg border border-border rounded-2xl p-4 cursor-pointer hover:border-blue transition-colors group", onClick: () => { const a = [...pageAngles]; a[i] = ((a[i] || 90) + 90) % 360; setPageAngles(a); }, title: "Click to rotate 90\u00B0 clockwise", children: [_jsx("div", { className: "relative w-full aspect-[1/1.4] bg-surface flex items-center justify-center overflow-hidden rounded-xl border border-border/50 group-hover:shadow-md transition-shadow", children: file && _jsx(PdfPagePreview, { file: file, pageIndex: i + 1, width: 120, rotation: pageAngles[i] || 90, className: "max-w-full max-h-full object-contain" }) }), _jsxs("div", { className: "flex flex-col items-center", children: [_jsxs("span", { className: "text-tiny font-bold uppercase tracking-widest-sm text-text-3 group-hover:text-blue transition-colors", children: ["Page ", i + 1] }), _jsxs("span", { className: "text-[10px] font-medium text-text-4", children: [pageAngles[i] || 90, "\u00B0"] })] })] }, i))) })] })))] }), error && _jsx("div", { className: "p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs font-bold uppercase tracking-wider text-center", children: error }), _jsxs("div", { className: "flex gap-4", children: [_jsx("button", { onClick: rotate, disabled: !file || progressState.isProcessing, className: "flex-1 py-4 bg-blue text-white font-black rounded-xl hover:scale-102 active:scale-98 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100 shadow-lg shadow-blue/20", children: progressState.isProcessing ? "Rotating…" : "Rotate & Download" }), progressState.isProcessing && (_jsx("button", { onClick: cancelRotate, className: "px-6 py-4 bg-red-500/10 text-red-500 font-bold rounded-xl hover:bg-red-500/20 transition-all", children: "Cancel" }))] })] }));
}
