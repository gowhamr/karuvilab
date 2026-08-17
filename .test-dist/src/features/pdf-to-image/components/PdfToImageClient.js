"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback } from "react";
import { EngineLoader } from "@/components/system/EngineLoader";
import { DropZone } from "@/components/ui/DropZone";
import { Loader2, Download, Settings2 } from "lucide-react";
import { useObjectUrlManager } from "@/src/lib/hooks";
import { workerManager } from "@/src/workers/manager";
import { useRef } from "react";
export default function PdfToImageClient() {
    const [file, setFile] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [images, setImages] = useState([]);
    const [progress, setProgress] = useState("");
    const [progressPercent, setProgressPercent] = useState(0);
    const [error, setError] = useState("");
    const [format, setFormat] = useState("jpeg");
    const { createUrl, revokeUrl } = useObjectUrlManager();
    const abortControllerRef = useRef(null);
    const cancelProcess = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
            setProcessing(false);
            setProgress("");
            setError("Operation cancelled by user.");
        }
    }, []);
    const checkLib = useCallback(() => {
        return true;
    }, []);
    const convert = async () => {
        if (!file) {
            setError("Please select a PDF file.");
            return;
        }
        setProcessing(true);
        setError("");
        setProgressPercent(0);
        images.forEach(img => revokeUrl(img.url));
        setImages([]);
        const abortController = new AbortController();
        abortControllerRef.current = abortController;
        const { signal } = abortController;
        try {
            const pdfjsLib = await import("pdfjs-dist");
            const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
            const version = pdfjsLib.version || '6.2.108';
            const workerUrl = typeof window !== 'undefined'
                ? `${window.location.origin}${basePath}/pdf.worker.min.mjs?v=${version}`
                : `https://unpkg.com/pdfjs-dist@${version}/build/pdf.worker.min.mjs`;
            if (pdfjsLib.GlobalWorkerOptions) {
                pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;
            }
            if (pdfjsLib.default?.GlobalWorkerOptions) {
                pdfjsLib.default.GlobalWorkerOptions.workerSrc = workerUrl;
            }
            const bytes = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
            const totalPages = pdf.numPages;
            const extracted = [];
            for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
                if (signal.aborted)
                    throw new Error("Cancelled");
                setProgress(`Rendering page ${pageNum} of ${totalPages}...`);
                setProgressPercent((pageNum / totalPages) * 100);
                const page = await pdf.getPage(pageNum);
                const viewport = page.getViewport({ scale: 2.0 });
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                if (!ctx)
                    throw new Error("Could not create canvas context");
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                await page.render({ canvasContext: ctx, viewport, canvas: canvas }).promise;
                const blob = await new Promise((resolve) => {
                    canvas.toBlob(resolve, `image/${format}`, 0.9);
                });
                if (blob) {
                    extracted.push({
                        url: createUrl(blob),
                        width: canvas.width,
                        height: canvas.height,
                        page: pageNum
                    });
                }
            }
            setImages(extracted);
            setProgress("");
            setProgressPercent(0);
            if (extracted.length === 0)
                setError("Failed to convert any pages.");
        }
        catch (e) {
            console.error("PDF to Image conversion error:", e);
            setError(e?.message === "Cancelled" ? "Conversion cancelled." : (e?.message || "Failed to convert PDF pages."));
            setProgress("");
            setProgressPercent(0);
        }
        setProcessing(false);
        abortControllerRef.current = null;
    };
    const downloadAll = async () => {
        if (images.length === 0)
            return;
        if (images.length === 1) {
            const a = document.createElement("a");
            a.href = images[0].url;
            a.download = `page-1.${format}`;
            a.click();
            return;
        }
        setProgress("Preparing ZIP file...");
        setProcessing(true);
        const abortController = new AbortController();
        abortControllerRef.current = abortController;
        const { signal } = abortController;
        try {
            const files = {};
            for (let i = 0; i < images.length; i++) {
                if (signal.aborted)
                    throw new Error("Cancelled");
                const img = images[i];
                const res = await fetch(img.url, { signal });
                const buf = await res.arrayBuffer();
                files[`page-${img.page}.${format}`] = new Uint8Array(buf);
            }
            const transferList = Object.values(files).map(v => v.buffer);
            const zipData = await workerManager.runZip(files, undefined, signal);
            const blob = new Blob([zipData], { type: "application/zip" });
            const url = createUrl(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `converted-pages.zip`;
            a.click();
        }
        catch (e) {
            console.error("ZIP creation error:", e);
            if (e.name !== "AbortError" && e.message !== "Cancelled") {
                setError("Failed to create ZIP file.");
            }
        }
        setProgress("");
        setProcessing(false);
        abortControllerRef.current = null;
    };
    return (_jsx("div", { className: "space-y-8", children: _jsxs(EngineLoader, { checkInit: checkLib, loadingMessage: "Preparing PDF rendering engine...", errorMessage: "Failed to load PDF engine.", children: [_jsxs("div", { className: "bg-surface border border-border p-5 rounded-3xl shadow-sm space-y-6", children: [_jsxs("div", { className: "flex items-center gap-4 border-b border-border pb-4", children: [_jsx(Settings2, { className: "w-5 h-5 text-blue" }), _jsx("h3", { className: "font-bold text-text uppercase tracking-widest text-sm", children: "Conversion Settings" })] }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-6", children: _jsxs("div", { className: "space-y-3", children: [_jsx("label", { className: "text-xs font-bold text-text-3 uppercase tracking-widest block", children: "Output Format" }), _jsx("div", { className: "flex bg-surface-2 p-1 rounded-xl", children: ["jpeg", "png"].map((fmt) => (_jsx("button", { onClick: () => setFormat(fmt), className: `flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${format === fmt ? "bg-blue text-white shadow-md shadow-blue/20" : "text-text-3 hover:text-text hover:bg-surface-3"}`, children: fmt.toUpperCase() }, fmt))) })] }) })] }), _jsx(DropZone, { onFilesSelected: (files) => {
                        const f = files instanceof FileList ? files[0] : files[0];
                        if (f) {
                            setFile(f);
                            setImages([]);
                        }
                    }, accept: ".pdf,application/pdf", title: file ? file.name : "Drop a PDF here or click to select", description: file ? `${(file.size / 1024).toFixed(0)} KB` : "Supports standard PDF files", icon: _jsx("div", { className: "text-4xl", children: file ? "📄" : "🖼️" }) }), error && _jsx("div", { className: "p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl text-red-600 text-sm font-bold", children: error }), progress && (_jsxs("div", { className: "p-4 bg-surface border border-border rounded-xl space-y-3", children: [_jsxs("div", { className: "text-sm text-text-3 flex items-center gap-2 font-bold uppercase tracking-widest", children: [_jsx(Loader2, { className: "w-4 h-4 animate-spin text-blue" }), progress] }), progressPercent > 0 && (_jsx("div", { className: "w-full bg-surface-2 rounded-full h-1.5 overflow-hidden", children: _jsx("div", { className: "bg-blue h-1.5 rounded-full transition-all duration-300", style: { width: `${progressPercent}%` } }) }))] })), _jsxs("div", { className: "flex gap-4", children: [_jsx("button", { onClick: convert, disabled: !file || processing, className: "flex-1 py-4 bg-blue text-white font-black uppercase tracking-widest rounded-2xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-40 disabled:scale-100 shadow-lg shadow-blue/20", children: processing ? "Converting…" : "Convert to Images" }), processing && (_jsx("button", { onClick: cancelProcess, className: "px-8 py-4 bg-red-500/10 text-red-500 border border-red-500/20 font-black uppercase tracking-widest rounded-2xl hover:bg-red-500/20 active:scale-95 transition-all", children: "Cancel" }))] }), images.length > 0 && (_jsxs("div", { className: "bg-surface border border-border p-5 rounded-4xl shadow-sm space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("h2", { className: "font-black text-text-2 text-xs uppercase tracking-widest-lg", children: [images.length, " page", images.length !== 1 ? "s" : "", " converted"] }), _jsxs("button", { onClick: downloadAll, disabled: processing, className: "flex items-center gap-2 px-4 py-2 bg-blue text-white text-tiny font-bold uppercase tracking-widest-sm rounded-xl hover:opacity-90 transition-all shadow-md shadow-blue/10 disabled:opacity-50", children: [_jsx(Download, { className: "w-3.5 h-3.5" }), " Download All"] })] }), _jsx("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-4", children: images.map((img, i) => (_jsxs("div", { className: "bg-bg border border-border rounded-2xl overflow-hidden group flex flex-col", children: [_jsx("div", { className: "aspect-[1/1.4] bg-white flex items-center justify-center p-2 relative overflow-hidden", children: _jsx("img", { src: img.url, alt: `Converted page ${img.page}`, className: "max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500" }) }), _jsxs("div", { className: "p-3 bg-surface border-t border-border space-y-2 mt-auto", children: [_jsxs("p", { className: "text-tiny font-bold text-text-4 uppercase tracking-tighter", children: ["Page ", img.page] }), _jsxs("a", { href: img.url, download: `page-${img.page}.${format}`, className: "inline-flex items-center gap-1.5 text-tiny font-black text-blue uppercase tracking-widest hover:underline", children: [_jsx(Download, { size: 10 }), " Download"] })] })] }, i))) })] }))] }) }));
}
