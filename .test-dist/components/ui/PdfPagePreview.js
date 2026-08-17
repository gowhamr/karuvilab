"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { blobManager } from "@/src/lib/blob-manager";
export function PdfPagePreview({ file, pageIndex, width = 150, rotation = 0, className = "" }) {
    const canvasRef = useRef(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        let active = true;
        let objectUrl = null;
        let loadingTask = null;
        const renderPage = async () => {
            try {
                setLoading(true);
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
                let docParams;
                if (file instanceof ArrayBuffer) {
                    docParams = { data: file };
                }
                else {
                    objectUrl = blobManager.create(file);
                    docParams = { url: objectUrl };
                }
                loadingTask = pdfjsLib.getDocument(docParams);
                const pdfDoc = await loadingTask.promise;
                if (!active)
                    return;
                const page = await pdfDoc.getPage(pageIndex);
                if (!active)
                    return;
                const canvas = canvasRef.current;
                if (!canvas)
                    return;
                const ctx = canvas.getContext("2d");
                if (!ctx)
                    return;
                const viewportUnscaled = page.getViewport({ scale: 1.0 });
                const scale = width / viewportUnscaled.width;
                const viewport = page.getViewport({ scale });
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                const renderContext = {
                    canvasContext: ctx,
                    viewport: viewport,
                };
                await page.render(renderContext).promise;
                if (active)
                    setLoading(false);
            }
            catch (err) {
                // Suppress errors from cancelled rendering
                if (active)
                    console.error("Failed to render PDF page preview:", err);
            }
        };
        renderPage();
        return () => {
            active = false;
            if (objectUrl)
                blobManager.revoke(objectUrl);
            if (loadingTask) {
                try {
                    loadingTask.destroy();
                }
                catch (e) { }
            }
        };
    }, [file, pageIndex, width]);
    return (_jsxs("div", { className: `relative flex items-center justify-center ${className}`, style: { width }, children: [_jsx("canvas", { ref: canvasRef, className: "block max-w-full shadow-sm rounded border border-border bg-white", style: {
                    transform: `rotate(${rotation}deg)`,
                    transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)"
                } }), loading && (_jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-bg/50 backdrop-blur-sm rounded", children: _jsx(Loader2, { className: "w-5 h-5 animate-spin text-blue" }) }))] }));
}
