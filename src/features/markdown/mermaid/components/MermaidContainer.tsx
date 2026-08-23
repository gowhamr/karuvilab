"use client";

import React, { useState } from "react";
import { Maximize2, Download, Code, Copy, Check, FileImage } from "lucide-react";
import { sanitizeHtml } from "@/src/lib/security";
import { blobManager } from "@/src/lib/blob-manager";
import { downloadSvgAsPng } from "../utils/export-image";
import { MermaidModal } from "./MermaidModal";

interface MermaidContainerProps {
  id: string;
  svg: string;
  source: string;
  diagramType?: string;
  renderTimeMs?: number | undefined;
  onRerender?: () => void;
}

export function MermaidContainer({
  id,
  svg,
  source,
  diagramType = "Mermaid",
  renderTimeMs,
}: MermaidContainerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSource, setShowSource] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopySource = () => {
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
    a.download = `mermaid-${id}-${Date.now()}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    blobManager.revoke(url);
  };

  const handleDownloadPng = async () => {
    if (!svg) return;
    await downloadSvgAsPng(svg, `mermaid-${id}-${Date.now()}.png`);
  };

  return (
    <>
      <figure
        id={id}
        className="my-6 bg-surface border border-border rounded-2xl overflow-hidden shadow-xs mermaid-container"
      >
        {/* Diagram Header */}
        <figcaption className="flex items-center justify-between px-4 py-2.5 bg-bg/80 border-b border-border select-none">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue animate-pulse" aria-hidden="true" />
            <span className="text-xs font-bold text-text-3 uppercase tracking-wider">
              {diagramType} Diagram
            </span>
            {renderTimeMs !== undefined && renderTimeMs > 0 && (
              <span className="hidden sm:inline-block px-2 py-0.5 bg-surface border border-border rounded-md text-[10px] font-mono text-text-4">
                {Math.round(renderTimeMs)}ms
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            <button
              onClick={() => setIsModalOpen(true)}
              className="p-1.5 hover:bg-surface rounded-lg text-text-4 hover:text-blue transition-all cursor-pointer"
              title="Expand Diagram (Fullscreen)"
              aria-label="Expand Diagram"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleDownloadSvg}
              className="p-1.5 hover:bg-surface rounded-lg text-text-4 hover:text-blue transition-all cursor-pointer"
              title="Download SVG"
              aria-label="Download SVG"
            >
              <Download className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleDownloadPng}
              className="p-1.5 hover:bg-surface rounded-lg text-text-4 hover:text-blue transition-all cursor-pointer"
              title="Download PNG (High-DPI)"
              aria-label="Download PNG"
            >
              <FileImage className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setShowSource(!showSource)}
              className={`p-1.5 hover:bg-surface rounded-lg transition-all cursor-pointer ${
                showSource ? "text-blue bg-surface" : "text-text-4 hover:text-text"
              }`}
              title={showSource ? "Hide Diagram Source" : "View Diagram Source"}
              aria-label="Toggle Diagram Source"
            >
              <Code className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleCopySource}
              className="p-1.5 hover:bg-surface rounded-lg text-text-4 hover:text-blue transition-all cursor-pointer"
              title={copied ? "Copied source code!" : "Copy Diagram Source"}
              aria-label="Copy Diagram Source"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-success" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </figcaption>

        {/* Inline Source Code Viewer */}
        {showSource && (
          <div className="p-3 bg-bg border-b border-border">
            <pre className="p-3 bg-surface/50 border border-border rounded-xl text-xs font-mono text-text-2 overflow-x-auto max-h-56 leading-relaxed">
              <code>{source}</code>
            </pre>
          </div>
        )}

        {/* Diagram Surface */}
        <div
          role="img"
          aria-label={`${diagramType} diagram`}
          className="p-6 overflow-x-auto flex justify-center bg-surface/30 min-w-0 max-w-full custom-scrollbar"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(svg) }}
        />
      </figure>

      {/* Fullscreen Expand Modal */}
      <MermaidModal
        svg={svg}
        source={source}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
