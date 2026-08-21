"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { Maximize2, Download, Code, Copy, Check, FileImage } from "lucide-react";
import { sanitizeHtml } from "@/src/lib/security";
import { blobManager } from "@/src/lib/blob-manager";
import { downloadSvgAsPng } from "../utils/export-image";
import { MermaidModal } from "./MermaidModal";
export function MermaidContainer({ id, svg, source, diagramType = "Mermaid", renderTimeMs, }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showSource, setShowSource] = useState(false);
    const [copied, setCopied] = useState(false);
    const handleCopySource = () => {
        navigator.clipboard.writeText(source);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    const handleDownloadSvg = () => {
        if (!svg)
            return;
        const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
        const url = blobManager.create(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `mermaid-${id}-${Date.now()}.svg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        blobManager.revoke(url);
    };
    const handleDownloadPng = async () => {
        if (!svg)
            return;
        await downloadSvgAsPng(svg, `mermaid-${id}-${Date.now()}.png`);
    };
    return (_jsxs(_Fragment, { children: [_jsxs("figure", { id: id, className: "my-6 bg-surface border border-border rounded-2xl overflow-hidden shadow-xs mermaid-container", children: [_jsxs("figcaption", { className: "flex items-center justify-between px-4 py-2.5 bg-bg/80 border-b border-border select-none", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "w-2 h-2 rounded-full bg-blue animate-pulse", "aria-hidden": "true" }), _jsxs("span", { className: "text-xs font-bold text-text-3 uppercase tracking-wider", children: [diagramType, " Diagram"] }), renderTimeMs !== undefined && renderTimeMs > 0 && (_jsxs("span", { className: "hidden sm:inline-block px-2 py-0.5 bg-surface border border-border rounded-md text-[10px] font-mono text-text-4", children: [Math.round(renderTimeMs), "ms"] }))] }), _jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx("button", { onClick: () => setIsModalOpen(true), className: "p-1.5 hover:bg-surface rounded-lg text-text-4 hover:text-blue transition-all", title: "Expand Diagram (Fullscreen)", "aria-label": "Expand Diagram", children: _jsx(Maximize2, { className: "w-3.5 h-3.5" }) }), _jsx("button", { onClick: handleDownloadSvg, className: "p-1.5 hover:bg-surface rounded-lg text-text-4 hover:text-blue transition-all", title: "Download SVG", "aria-label": "Download SVG", children: _jsx(Download, { className: "w-3.5 h-3.5" }) }), _jsx("button", { onClick: handleDownloadPng, className: "p-1.5 hover:bg-surface rounded-lg text-text-4 hover:text-blue transition-all", title: "Download PNG (High-DPI)", "aria-label": "Download PNG", children: _jsx(FileImage, { className: "w-3.5 h-3.5" }) }), _jsx("button", { onClick: () => setShowSource(!showSource), className: `p-1.5 hover:bg-surface rounded-lg transition-all ${showSource ? "text-blue bg-surface" : "text-text-4 hover:text-text"}`, title: "View Mermaid Source", "aria-label": "View Mermaid Source", children: _jsx(Code, { className: "w-3.5 h-3.5" }) }), _jsx("button", { onClick: handleCopySource, className: "flex items-center gap-1 px-2.5 py-1 bg-surface border border-border rounded-lg text-text-muted hover:text-blue hover:border-blue transition-all text-xs font-semibold", title: "Copy Diagram Source", "aria-label": "Copy Diagram Source", children: copied ? (_jsxs(_Fragment, { children: [_jsx(Check, { className: "w-3 h-3 text-success" }), _jsx("span", { className: "text-success", children: "Copied" })] })) : (_jsxs(_Fragment, { children: [_jsx(Copy, { className: "w-3 h-3" }), _jsx("span", { children: "Source" })] })) })] })] }), showSource && (_jsx("div", { className: "p-3 bg-bg border-b border-border", children: _jsx("pre", { className: "p-3 bg-surface/50 border border-border rounded-xl text-xs font-mono text-text-2 overflow-x-auto max-h-56 leading-relaxed", children: _jsx("code", { children: source }) }) })), _jsx("div", { role: "img", "aria-label": `${diagramType} diagram`, className: "p-6 overflow-x-auto flex justify-center bg-surface/30 min-w-0 max-w-full custom-scrollbar", dangerouslySetInnerHTML: { __html: sanitizeHtml(svg) } })] }), _jsx(MermaidModal, { svg: svg, source: source, isOpen: isModalOpen, onClose: () => setIsModalOpen(false) })] }));
}
