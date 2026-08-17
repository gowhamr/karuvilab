"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
// Removed pdf-lib import
import { CATEGORIES } from "@/src/tool-registry";
import { useObjectUrlManager } from "@/src/lib/hooks";
import { DropZone } from "@/components/ui/DropZone";
const cat = CATEGORIES.find(c => c.id === "pdf");
export default function ImageToPdfClient() {
    const { createUrl, revokeUrl } = useObjectUrlManager();
    const [images, setImages] = useState([]);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState("");
    const [pageSize, setPageSize] = useState("fit");
    const addImages = (fl) => {
        if (!fl)
            return;
        const items = Array.from(fl).map(f => ({
            name: f.name,
            file: f,
            url: createUrl(f),
        }));
        setImages(prev => [...prev, ...items]);
    };
    const remove = (i) => {
        const item = images[i];
        if (item)
            revokeUrl(item.url);
        setImages(a => a.filter((_, idx) => idx !== i));
    };
    const clearAll = () => {
        images.forEach(img => revokeUrl(img.url));
        setImages([]);
    };
    const moveUp = (i) => { if (i === 0)
        return; setImages(a => { const n = [...a]; const t = n[i - 1]; n[i - 1] = n[i]; n[i] = t; return n; }); };
    const moveDown = (i) => setImages(a => { if (i >= a.length - 1)
        return a; const n = [...a]; const t = n[i]; n[i] = n[i + 1]; n[i + 1] = t; return n; });
    const PAGE_SIZES = { a4: [595.28, 841.89], letter: [612, 792] };
    const convert = async () => {
        if (images.length === 0) {
            setError("Please add at least one image.");
            return;
        }
        setProcessing(true);
        setError("");
        try {
            const items = await Promise.all(images.map(async (item) => ({
                buffer: await item.file.arrayBuffer(),
                mime: item.file.type
            })));
            const { workerManager } = await import("@/src/workers/manager");
            const bytes = await workerManager.convertImagesToPdf(items, pageSize, (progress) => {
                // Progress reporting can be added here
            });
            const blob = new Blob([bytes], { type: "application/pdf" });
            const url = createUrl(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "images.pdf";
            a.click();
            revokeUrl(url);
        }
        catch (e) {
            setError(e?.message || "Failed to create PDF.");
        }
        setProcessing(false);
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(DropZone, { onFilesSelected: addImages, accept: "image/jpeg,image/png,image/webp", multiple: true, title: "Drop images here or click to select", description: "JPG and PNG supported (WebP will be converted)", icon: _jsx("div", { className: "text-4xl", children: "\uD83D\uDDBC\uFE0F" }) }), images.length > 0 && (_jsxs("div", { className: "bg-surface border border-border p-5 rounded-2xl shadow-sm space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("h2", { className: "font-bold text-text-2 text-sm uppercase tracking-wider", children: ["Images (", images.length, ")"] }), _jsx("button", { onClick: clearAll, className: "text-xs text-red-500 hover:text-red-600 font-medium", children: "Clear all" })] }), _jsx("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3", children: images.map((img, i) => (_jsxs("div", { className: "relative group bg-bg border border-border rounded-xl overflow-hidden", children: [_jsx("img", { src: img.url, alt: img.name, className: "w-full h-24 object-cover" }), _jsxs("div", { className: "p-2 flex items-center justify-between", children: [_jsxs("div", { className: "flex gap-1", children: [_jsx("button", { "aria-label": "Move item up", onClick: () => moveUp(i), className: "text-xs text-text-4 hover:text-blue", children: "\u25B2" }), _jsx("button", { "aria-label": "Move item down", onClick: () => moveDown(i), className: "text-xs text-text-4 hover:text-blue", children: "\u25BC" })] }), _jsx("button", { "aria-label": "Remove item", onClick: () => remove(i), className: "text-red-400 hover:text-red-600 text-xs font-bold", children: "\u2715" })] }), _jsx("div", { className: "absolute top-1 left-1 bg-blue text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center", children: i + 1 })] }, i))) })] })), _jsxs("div", { className: "bg-surface border border-border p-5 rounded-2xl shadow-sm", children: [_jsx("label", { className: "text-sm font-medium", children: "Page Size" }), _jsx("div", { className: "flex gap-2 mt-2", children: ["fit", "a4", "letter"].map(s => (_jsx("button", { onClick: () => setPageSize(s), className: `px-4 py-2 rounded-xl text-sm font-medium transition-colors ${pageSize === s ? "bg-blue text-white" : "bg-bg border border-border text-text-3 hover:border-blue hover:text-blue"}`, children: s === "fit" ? "Fit Image" : s.toUpperCase() }, s))) })] }), error && _jsx("div", { className: "p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl text-red-600 text-sm", children: error }), _jsx("button", { onClick: convert, disabled: images.length === 0 || processing, className: "w-full py-4 bg-blue text-white font-bold rounded-xl hover:scale-102 active:scale-98 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100", children: processing ? "Creating PDF…" : `Convert ${images.length} image${images.length !== 1 ? "s" : ""} to PDF` })] }));
}
