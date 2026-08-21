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
      className="fixed inset-0 z-modal bg-black/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Mermaid Diagram Viewer"
    >
      <div className="bg-surface border border-border rounded-3xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border bg-bg/50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-blue animate-pulse" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-text">
              Diagram Fullscreen Viewer
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            <div className="flex items-center bg-surface border border-border rounded-xl p-1 gap-1">
              <button
                onClick={handleZoomOut}
                className="p-1.5 hover:bg-hover rounded-lg text-text-3 hover:text-text transition-all"
                title="Zoom Out"
                aria-label="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono text-text-4 px-1 select-none">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                className="p-1.5 hover:bg-hover rounded-lg text-text-3 hover:text-text transition-all"
                title="Zoom In"
                aria-label="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={handleResetZoom}
                className="p-1.5 hover:bg-hover rounded-lg text-text-3 hover:text-text transition-all"
                title="Reset Zoom"
                aria-label="Reset Zoom"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-2 bg-surface border border-border rounded-xl text-xs font-semibold text-text-3 hover:text-blue hover:border-blue transition-all"
              title="Copy Mermaid Source"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-success" />
                  <span className="text-success">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Source</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadSvg}
              className="flex items-center gap-1.5 px-3 py-2 bg-blue text-white rounded-xl text-xs font-semibold hover:bg-blue/90 transition-all shadow-xs"
              title="Download SVG"
            >
              <Download className="w-3.5 h-3.5" />
              <span>SVG</span>
            </button>

            <button
              onClick={handleDownloadPng}
              className="flex items-center gap-1.5 px-3 py-2 bg-surface border border-border rounded-xl text-xs font-semibold text-text hover:text-blue hover:border-blue transition-all"
              title="Download PNG (High-DPI)"
            >
              <FileImage className="w-3.5 h-3.5" />
              <span>PNG</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 hover:bg-surface rounded-xl text-text-4 hover:text-text transition-all ml-2"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-h-0 overflow-auto p-8 flex items-center justify-center bg-bg/50 custom-scrollbar">
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
