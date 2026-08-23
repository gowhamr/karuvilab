"use client";

import React, { useState } from "react";
import { X, ZoomIn, ZoomOut, RotateCcw, Download, Copy, Check, FileImage } from "lucide-react";
import { sanitizeHtml } from "@/src/lib/security";
import { blobManager } from "@/src/lib/blob-manager";
import { downloadSvgAsPng } from "../utils/export-image";

interface MermaidModalProps {
  svg: string;
  source: string;
  isOpen: boolean;
  onClose: () => void;
}

export function MermaidModal({ svg, source, isOpen, onClose }: MermaidModalProps) {
  const [zoom, setZoom] = useState(1);
  const [copied, setCopied] = useState(false);

  // Close on Escape key press
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.25, 3));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.5));
  const handleResetZoom = () => setZoom(1);

  const handleCopy = () => {
    navigator.clipboard.writeText(source);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSvg = () => {
    if (!svg) return;
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = blobManager.create(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mermaid-diagram-${Date.now()}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    blobManager.revoke(url);
  };

  const handleDownloadPng = async () => {
    if (!svg) return;
    await downloadSvgAsPng(svg, `mermaid-diagram-${Date.now()}.png`);
  };

  return (
    <div
      className="fixed inset-0 z-modal bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Mermaid Diagram Viewer"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-surface border border-border rounded-2xl sm:rounded-3xl w-full max-w-5xl h-[90vh] sm:h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="px-3 sm:px-6 py-2.5 sm:py-4 border-b border-border bg-bg/50 flex items-center justify-between gap-2 shrink-0 max-w-full min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-blue animate-pulse shrink-0" />
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-text truncate">
              Diagram Viewer
            </h3>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Zoom Controls */}
            <div className="flex items-center bg-surface border border-border rounded-xl p-0.5 sm:p-1 gap-0.5 sm:gap-1">
              <button
                onClick={handleZoomOut}
                className="p-1 sm:p-1.5 hover:bg-hover rounded-lg text-text-3 hover:text-text transition-all cursor-pointer"
                title="Zoom Out (-25%)"
                aria-label="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
              <span className="text-[10px] sm:text-xs font-mono text-text-4 px-0.5 sm:px-1 select-none">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                className="p-1 sm:p-1.5 hover:bg-hover rounded-lg text-text-3 hover:text-text transition-all cursor-pointer"
                title="Zoom In (+25%)"
                aria-label="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
              <button
                onClick={handleResetZoom}
                className="p-1 sm:p-1.5 hover:bg-hover rounded-lg text-text-3 hover:text-text transition-all cursor-pointer"
                title="Reset Zoom (100%)"
                aria-label="Reset Zoom to 100%"
              >
                <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>

            {/* Copy Source Button */}
            <button
              onClick={handleCopy}
              className="p-1.5 sm:p-2 bg-surface border border-border rounded-xl text-text-3 hover:text-blue hover:border-blue transition-all cursor-pointer"
              title={copied ? "Source code copied!" : "Copy Mermaid Source"}
              aria-label="Copy Mermaid Source"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-success" />
              ) : (
                <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              )}
            </button>

            {/* SVG Export Button */}
            <button
              onClick={handleDownloadSvg}
              className="p-1.5 sm:p-2 bg-blue text-white rounded-xl hover:bg-blue/90 transition-all shadow-xs cursor-pointer"
              title="Download Vector SVG"
              aria-label="Download SVG"
            >
              <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {/* PNG Export Button */}
            <button
              onClick={handleDownloadPng}
              className="p-1.5 sm:p-2 bg-surface border border-border rounded-xl text-text hover:text-blue hover:border-blue transition-all cursor-pointer"
              title="Download High-DPI PNG"
              aria-label="Download PNG"
            >
              <FileImage className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {/* Exit / Close Modal Button */}
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 bg-surface hover:bg-error/10 border border-border hover:border-error/30 rounded-xl text-text-4 hover:text-error transition-all ml-0.5 sm:ml-1 cursor-pointer"
              title="Exit Fullscreen (Esc)"
              aria-label="Exit Fullscreen Viewer"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-h-0 overflow-auto p-4 sm:p-8 flex items-center justify-center bg-bg/50 custom-scrollbar">
          <div
            style={{ transform: `scale(${zoom})`, transformOrigin: "center center" }}
            className="transition-transform duration-150 flex items-center justify-center max-w-full"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(svg) }}
          />
        </div>
      </div>
    </div>
  );
}
