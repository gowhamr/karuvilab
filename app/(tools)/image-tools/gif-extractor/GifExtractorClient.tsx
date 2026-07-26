"use client";

import { useState, useCallback, useEffect } from "react";
import { m, AnimatePresence } from "framer-motion";
import {
  Film,
  Download,
  FileArchive,
  RefreshCw,
  Layers,
  ZoomIn,
  Copy,
  Check,
  AlertCircle,
  Grid,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  Info,
  CheckSquare,
  Square,
  Eye,
  EyeOff,
} from "lucide-react";
import { DropZone } from "@/components/ui/DropZone";
import { PrivacyBadge } from "@/components/system/PrivacyBadge";
import { useObjectUrlManager, useAsyncSafeState } from "@/src/lib/hooks";
import { formatError } from "@/src/lib/formatError";
import { extractGifFrames } from "@/src/format-utils";
import { blobManager } from "@/src/lib/blob-manager";

interface FrameItem {
  id: number; // 1-indexed
  blob: Blob;
  url: string;
  sizeFormatted: string;
  sizeBytes: number;
  width: number;
  height: number;
}

const CHECKERBOARD_BG = {
  backgroundImage: `linear-gradient(45deg, #cbd5e1 25%, transparent 25%), 
                    linear-gradient(-45deg, #cbd5e1 25%, transparent 25%), 
                    linear-gradient(45deg, transparent 75%, #cbd5e1 75%), 
                    linear-gradient(-45deg, transparent 75%, #cbd5e1 75%)`,
  backgroundSize: "16px 16px",
  backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px",
};

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

function getImageDimensions(blob: Blob): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const url = blobManager.create(blob);
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      blobManager.revoke(url);
    };
    img.onerror = () => {
      resolve({ width: 0, height: 0 });
      blobManager.revoke(url);
    };
    img.src = url;
  });
}

export default function GifExtractorClient() {
  const { createUrl, revokeUrl } = useObjectUrlManager();

  const [file, setFile] = useAsyncSafeState<File | null>(null);
  const [gifUrl, setGifUrl] = useAsyncSafeState<string | null>(null);
  const [frames, setFrames] = useAsyncSafeState<FrameItem[]>([]);
  const [isExtracting, setIsExtracting] = useAsyncSafeState<boolean>(false);
  const [extractProgress, setExtractProgress] = useAsyncSafeState<string>("");
  const [error, setError] = useAsyncSafeState<string | null>(null);
  const [totalFrameCount, setTotalFrameCount] = useAsyncSafeState<number>(0);
  const [isCapped, setIsCapped] = useAsyncSafeState<boolean>(false);

  // Selection & Grid settings
  const [selectedIds, setSelectedIds] = useAsyncSafeState<Set<number>>(new Set());
  const [columnCount, setColumnCount] = useAsyncSafeState<number>(4);
  const [showOriginalPreview, setShowOriginalPreview] = useAsyncSafeState<boolean>(false);
  const [isZipping, setIsZipping] = useAsyncSafeState<boolean>(false);
  const [copiedFrameId, setCopiedFrameId] = useAsyncSafeState<number | null>(null);

  // Lightbox Modal state
  const [activeModalIndex, setActiveModalIndex] = useAsyncSafeState<number | null>(null);

  const resetAll = useCallback(() => {
    if (gifUrl) revokeUrl(gifUrl);
    frames.forEach((f) => revokeUrl(f.url));
    setFile(null);
    setGifUrl(null);
    setFrames([]);
    setIsExtracting(false);
    setExtractProgress("");
    setError(null);
    setTotalFrameCount(0);
    setIsCapped(false);
    setSelectedIds(new Set());
    setActiveModalIndex(null);
  }, [gifUrl, frames, revokeUrl, setFile, setGifUrl, setFrames, setIsExtracting, setExtractProgress, setError, setTotalFrameCount, setIsCapped, setSelectedIds, setActiveModalIndex]);

  const processFile = useCallback(
    async (selectedFile: File) => {
      resetAll();
      setFile(selectedFile);
      const mainUrl = createUrl(selectedFile);
      setGifUrl(mainUrl);
      setIsExtracting(true);
      setError(null);
      setExtractProgress("Decoding GIF animation frames...");

      try {
        const rawBlobs = await extractGifFrames(selectedFile);

        if (!rawBlobs || rawBlobs.length === 0) {
          throw new Error("No frames could be extracted from this image. Ensure it is a valid animated GIF.");
        }

        const totalCount = rawBlobs.length;
        setTotalFrameCount(totalCount);

        // Cap at 100 frames for memory safety
        const safeBlobs = rawBlobs.slice(0, 100);
        if (totalCount > 100) {
          setIsCapped(true);
        }

        setExtractProgress("Processing extracted frames...");

        const frameItems: FrameItem[] = [];
        for (let i = 0; i < safeBlobs.length; i++) {
          const blob = safeBlobs[i]!;
          const frameUrl = createUrl(blob);
          const { width, height } = await getImageDimensions(blob);

          frameItems.push({
            id: i + 1,
            blob,
            url: frameUrl,
            sizeFormatted: formatBytes(blob.size),
            sizeBytes: blob.size,
            width,
            height,
          });
        }

        setFrames(frameItems);
        // Select all by default
        setSelectedIds(new Set(frameItems.map((f) => f.id)));
      } catch (err: unknown) {
        setError(formatError(err));
      } finally {
        setIsExtracting(false);
        setExtractProgress("");
      }
    },
    [resetAll, setFile, createUrl, setGifUrl, setIsExtracting, setError, setExtractProgress, setTotalFrameCount, setIsCapped, setFrames, setSelectedIds]
  );

  const handleFilesSelected = (files: FileList | File[]) => {
    const selectedFile = files instanceof FileList ? files[0] : files[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  // Toggle single frame selection
  const toggleSelectFrame = (id: number) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  // Toggle select all
  const toggleSelectAll = () => {
    if (selectedIds.size === frames.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(frames.map((f) => f.id)));
    }
  };

  // Download single frame
  const downloadSingleFrame = (frame: FrameItem) => {
    const baseName = file?.name.replace(/\.[^.]+$/, "") || "gif";
    const fileName = `${baseName}_frame_${String(frame.id).padStart(3, "0")}.png`;
    const a = document.createElement("a");
    a.href = frame.url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Copy single frame to clipboard
  const copyFrameToClipboard = async (frame: FrameItem) => {
    try {
      if (!navigator.clipboard || typeof ClipboardItem === "undefined") {
        throw new Error("Copying images is not supported in this browser context.");
      }
      await navigator.clipboard.write([
        new ClipboardItem({
          [frame.blob.type || "image/png"]: frame.blob,
        }),
      ]);
      setCopiedFrameId(frame.id);
      setTimeout(() => setCopiedFrameId(null), 2000);
    } catch (err) {
      alert(formatError(err));
    }
  };

  // Download ZIP
  const handleDownloadZip = async (targetFrames?: FrameItem[]) => {
    const framesToZip = targetFrames || frames.filter((f) => selectedIds.has(f.id));
    if (framesToZip.length === 0) return;

    setIsZipping(true);
    try {
      const baseName = file?.name.replace(/\.[^.]+$/, "") || "gif";
      const filesData: Record<string, Uint8Array> = {};

      for (const frame of framesToZip) {
        const arrayBuffer = await frame.blob.arrayBuffer();
        const fileName = `${baseName}_frame_${String(frame.id).padStart(3, "0")}.png`;
        filesData[fileName] = new Uint8Array(arrayBuffer);
      }
      
      const { workerManager } = await import("@/src/workers/manager");
      const zipped = await workerManager.runZip(filesData);
      const zipBlob = new Blob([zipped as unknown as BlobPart], { type: "application/zip" });
      const downloadUrl = blobManager.create(zipBlob);

      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `${baseName}_extracted_frames.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      blobManager.revoke(downloadUrl);
    } catch (err) {
      setError("Failed to create ZIP archive: " + formatError(err));
    } finally {
      setIsZipping(false);
    }
  };

  // Keyboard navigation for Lightbox modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeModalIndex === null) return;

      if (e.key === "Escape") {
        setActiveModalIndex(null);
      } else if (e.key === "ArrowLeft") {
        setActiveModalIndex(activeModalIndex !== null && activeModalIndex > 0 ? activeModalIndex - 1 : frames.length - 1);
      } else if (e.key === "ArrowRight") {
        setActiveModalIndex(activeModalIndex !== null && activeModalIndex < frames.length - 1 ? activeModalIndex + 1 : 0);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeModalIndex, frames.length, setActiveModalIndex]);

  const activeModalFrame = activeModalIndex !== null ? frames[activeModalIndex] : null;

  return (
    <div className="w-full space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-surface p-4 rounded-2xl border border-border shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue/10 text-blue flex items-center justify-center font-bold">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground">GIF Frame Extractor</h2>
            <p className="text-xs text-text-muted">Split animated GIFs into high-resolution PNG frames in browser</p>
          </div>
        </div>
        <PrivacyBadge />
      </div>

      {/* No file selected state */}
      {!file && !isExtracting && (
        <div className="space-y-6">
          <DropZone
            onFilesSelected={handleFilesSelected}
            accept="image/gif,.gif"
            multiple={false}
            title="Drop GIF image here"
            description="Supports animated .gif files. Processed 100% locally."
            icon={<Film className="w-8 h-8" />}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-surface border border-border space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-semibold text-sm">
                1
              </div>
              <h3 className="text-sm font-semibold text-foreground">Zero Upload</h3>
              <p className="text-xs text-text-muted">Your GIF stays on your device. Extraction happens inside your browser engine.</p>
            </div>
            <div className="p-4 rounded-2xl bg-surface border border-border space-y-2">
              <div className="w-8 h-8 rounded-lg bg-blue/10 text-blue flex items-center justify-center font-semibold text-sm">
                2
              </div>
              <h3 className="text-sm font-semibold text-foreground">Full Resolution PNG</h3>
              <p className="text-xs text-text-muted">Frames are decoded pixel-perfect directly into lossless PNG files.</p>
            </div>
            <div className="p-4 rounded-2xl bg-surface border border-border space-y-2">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center font-semibold text-sm">
                3
              </div>
              <h3 className="text-sm font-semibold text-foreground">ZIP Archive Export</h3>
              <p className="text-xs text-text-muted">Download individual frames or export all frames bundled as a ZIP package.</p>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isExtracting && (
        <div className="flex flex-col items-center justify-center p-12 bg-surface rounded-3xl border border-border space-y-4 text-center">
          <m.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="w-12 h-12 rounded-full border-4 border-blue/20 border-t-blue"
          />
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground">Extracting Frames</h3>
            <p className="text-xs text-text-muted">{extractProgress}</p>
          </div>
        </div>
      )}

      {/* Error Banner */}
      <AnimatePresence>
        {error && (
          <m.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-2xl bg-error/10 border border-error/20 text-error flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-sm font-bold">Frame Extraction Failed</h4>
                <p className="text-xs text-error/90 leading-relaxed">{error}</p>
                {error.includes("ImageDecoder") && (
                  <div className="mt-2 text-xs bg-error/10 p-2.5 rounded-xl border border-error/20 space-y-1">
                    <p className="font-semibold">Browser Compatibility Note:</p>
                    <p>
                      Native GIF frame decoding requires the WebCodecs <code className="font-mono bg-error/20 px-1 rounded">ImageDecoder</code> API.
                      This feature is supported in Chrome, Edge, Brave, Opera, and Android Chrome. If you are using Firefox or Safari, please try switching to a Chromium-based browser.
                    </p>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={resetAll}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-error/20 hover:bg-error/30 transition-colors shrink-0"
            >
              Try Another File
            </button>
          </m.div>
        )}
      </AnimatePresence>

      {/* Extracted Frames View */}
      {!isExtracting && frames.length > 0 && (
        <div className="space-y-6">
          {/* File summary & Controls header */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-surface p-5 rounded-3xl border border-border shadow-xs">
            <div className="flex flex-wrap items-center gap-4">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-foreground truncate max-w-[280px]">
                  {file?.name}
                </h3>
                <div className="flex items-center gap-2 text-xs text-text-muted font-medium">
                  <span>{formatBytes(file?.size || 0)}</span>
                  <span>•</span>
                  <span className="text-blue font-bold">{totalFrameCount} Frames Total</span>
                </div>
              </div>

              {isCapped && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-semibold">
                  <Info className="w-4 h-4" />
                  <span>Showing first 100 frames for browser safety</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setShowOriginalPreview(!showOriginalPreview)}
                className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl bg-bg hover:bg-surface-hover border border-border text-foreground transition-colors"
              >
                {showOriginalPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span>{showOriginalPreview ? "Hide Original GIF" : "Preview Original GIF"}</span>
              </button>

              <button
                onClick={resetAll}
                className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl bg-bg hover:bg-surface-hover border border-border text-foreground transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>New GIF</span>
              </button>
            </div>
          </div>

          {/* Collapsible Original GIF preview */}
          <AnimatePresence>
            {showOriginalPreview && gifUrl && (
              <m.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="p-5 bg-surface rounded-3xl border border-border flex flex-col items-center gap-3 overflow-hidden"
              >
                <div className="flex items-center justify-between w-full text-xs font-bold text-text-muted">
                  <span>Original Animated GIF Preview</span>
                  <button
                    onClick={() => setShowOriginalPreview(false)}
                    className="p-1 rounded-lg hover:bg-bg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-3 rounded-2xl bg-bg border border-border" style={CHECKERBOARD_BG}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={gifUrl}
                    alt="Original GIF"
                    className="max-h-64 object-contain rounded-xl"
                  />
                </div>
              </m.div>
            )}
          </AnimatePresence>

          {/* Action Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-surface p-4 rounded-2xl border border-border">
            <div className="flex items-center gap-3">
              <button
                onClick={toggleSelectAll}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-xl bg-bg hover:bg-surface-hover border border-border text-foreground transition-colors"
              >
                {selectedIds.size === frames.length ? (
                  <CheckSquare className="w-4 h-4 text-blue" />
                ) : (
                  <Square className="w-4 h-4 text-text-muted" />
                )}
                <span>
                  {selectedIds.size === frames.length ? "Deselect All" : `Select All (${frames.length})`}
                </span>
              </button>

              <span className="text-xs text-text-muted font-semibold">
                {selectedIds.size} of {frames.length} selected
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Grid Column Selector */}
              <div className="hidden sm:flex items-center gap-1 bg-bg p-1 rounded-xl border border-border">
                <Grid className="w-3.5 h-3.5 text-text-muted ml-1.5" />
                {[2, 3, 4, 6].map((cols) => (
                  <button
                    key={cols}
                    onClick={() => setColumnCount(cols)}
                    className={`px-2 py-1 text-xs font-bold rounded-lg transition-colors ${
                      columnCount === cols
                        ? "bg-surface text-blue shadow-xs"
                        : "text-text-muted hover:text-foreground"
                    }`}
                  >
                    {cols} col
                  </button>
                ))}
              </div>

              {/* Download ZIP Button */}
              <button
                onClick={() => handleDownloadZip()}
                disabled={isZipping || selectedIds.size === 0}
                className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-blue text-white hover:opacity-90 disabled:opacity-50 transition-all shadow-xs"
              >
                {isZipping ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <FileArchive className="w-4 h-4" />
                )}
                <span>
                  {selectedIds.size === frames.length
                    ? "Download All as ZIP"
                    : `Download Selected ZIP (${selectedIds.size})`}
                </span>
              </button>
            </div>
          </div>

          {/* Grid of Extracted Frames */}
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
            }}
          >
            {frames.map((frame, index) => {
              const isSelected = selectedIds.has(frame.id);
              const isCopied = copiedFrameId === frame.id;

              return (
                <m.div
                  key={frame.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: Math.min(index * 0.02, 0.5) }}
                  className={`group relative flex flex-col justify-between rounded-2xl bg-surface border transition-all duration-200 overflow-hidden ${
                    isSelected
                      ? "border-blue ring-2 ring-blue/20 shadow-xs"
                      : "border-border hover:border-border/80"
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between p-3 border-b border-border/50 bg-bg/50">
                    <button
                      onClick={() => toggleSelectFrame(frame.id)}
                      className="flex items-center gap-2 text-xs font-bold text-foreground hover:text-blue transition-colors"
                    >
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-blue shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-text-muted shrink-0" />
                      )}
                      <span>Frame #{frame.id}</span>
                    </button>

                    <span className="text-[11px] font-medium text-text-muted">
                      {frame.width > 0 ? `${frame.width}×${frame.height}` : ""}
                    </span>
                  </div>

                  {/* Thumbnail area */}
                  <div
                    onClick={() => setActiveModalIndex(index)}
                    className="relative flex items-center justify-center p-3 h-48 cursor-pointer overflow-hidden group/thumb"
                    style={CHECKERBOARD_BG}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={frame.url}
                      alt={`Frame ${frame.id}`}
                      className="max-h-full max-w-full object-contain rounded-lg transition-transform duration-200 group-hover/thumb:scale-105"
                    />

                    {/* Hover Overlay Zoom Button */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center text-white gap-2 font-semibold text-xs">
                      <ZoomIn className="w-5 h-5" />
                      <span>Inspect</span>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="flex items-center justify-between p-2.5 bg-surface border-t border-border/50 gap-2">
                    <span className="text-[11px] text-text-muted font-mono pl-1">
                      {frame.sizeFormatted}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => copyFrameToClipboard(frame)}
                        title="Copy image to clipboard"
                        className="p-1.5 rounded-lg bg-bg hover:bg-surface-hover text-text-muted hover:text-foreground border border-border transition-colors"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => downloadSingleFrame(frame)}
                        title="Download PNG frame"
                        className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-lg bg-blue/10 hover:bg-blue/20 text-blue transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>PNG</span>
                      </button>
                    </div>
                  </div>
                </m.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Lightbox / Frame Inspection Modal */}
      <AnimatePresence>
        {activeModalFrame && activeModalIndex !== null && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-dropdown bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setActiveModalIndex(null)}
          >
            <m.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-4xl w-full bg-surface border border-border rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-bg/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue/10 text-blue flex items-center justify-center font-bold text-xs">
                    #{activeModalFrame.id}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">
                      Frame {activeModalFrame.id} of {frames.length}
                    </h3>
                    <p className="text-xs text-text-muted font-mono">
                      {activeModalFrame.width}×{activeModalFrame.height} px • {activeModalFrame.sizeFormatted}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyFrameToClipboard(activeModalFrame)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-bg hover:bg-surface-hover border border-border text-foreground transition-colors"
                  >
                    {copiedFrameId === activeModalFrame.id ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-500" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy Image</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => downloadSingleFrame(activeModalFrame)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-blue text-white hover:opacity-90 transition-opacity"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PNG</span>
                  </button>

                  <button
                    onClick={() => setActiveModalIndex(null)}
                    className="p-2 rounded-xl bg-bg hover:bg-surface-hover text-text-muted hover:text-foreground transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Body / Image View */}
              <div
                className="relative flex-1 flex items-center justify-center p-8 overflow-auto min-h-[300px]"
                style={CHECKERBOARD_BG}
              >
                {/* Previous Frame Button */}
                <button
                  onClick={() =>
                    setActiveModalIndex(activeModalIndex > 0 ? activeModalIndex - 1 : frames.length - 1)
                  }
                  className="absolute left-4 p-3 rounded-full bg-surface/90 border border-border shadow-md text-foreground hover:bg-surface transition-all z-content"
                  title="Previous Frame (Left Arrow)"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeModalFrame.url}
                  alt={`Frame ${activeModalFrame.id}`}
                  className="max-h-[65vh] max-w-full object-contain rounded-2xl shadow-lg"
                />

                {/* Next Frame Button */}
                <button
                  onClick={() =>
                    setActiveModalIndex(activeModalIndex < frames.length - 1 ? activeModalIndex + 1 : 0)
                  }
                  className="absolute right-4 p-3 rounded-full bg-surface/90 border border-border shadow-md text-foreground hover:bg-surface transition-all z-content"
                  title="Next Frame (Right Arrow)"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Footer Navigation */}
              <div className="flex items-center justify-between px-6 py-3 border-t border-border bg-bg/50 text-xs text-text-muted">
                <span>Tip: Use Left & Right Arrow keys to navigate frames</span>
                <span>
                  {activeModalIndex + 1} / {frames.length}
                </span>
              </div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
