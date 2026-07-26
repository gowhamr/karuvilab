"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { loadHeic } from "@/src/format-utils";
import { useObjectUrlManager, useAsyncSafeState } from "@/src/lib/hooks";
import { DropZone } from "@/components/ui/DropZone";
import { PrivacyBadge } from "@/components/system/PrivacyBadge";
import { formatError } from "@/src/lib/formatError";
import { m, AnimatePresence } from "framer-motion";
import {
  Download,
  RotateCcw,
  Sparkles,
  Loader2,
  CircleAlert as AlertCircle,
  FileImage,
  Sliders,
  Check,
  Copy,
  Layers,
  ArrowRight,
  Eye,
  Maximize2,
} from "lucide-react";

interface ConvertedFileItem {
  id: string;
  originalFile: File;
  originalName: string;
  originalSize: number;
  imageElement: HTMLImageElement | null;
  dimensions: { width: number; height: number } | null;
  jpegBlob: Blob | null;
  jpegUrl: string | null;
  jpegSize: number;
  status: "idle" | "decoding" | "exporting" | "done" | "error";
  errorMessage: string | null;
}

/**
 * Dynamically ensures that the window.heic2any library is loaded.
 * If not present, loads it from standard CDN endpoints.
 */
async function ensureHeic2Any(): Promise<void> {
  if (typeof window === "undefined") return;
  if ((window as any).heic2any) return;

  return new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector('script[src*="heic2any"]');
    if (existingScript) {
      const handleLoad = () => resolve();
      const handleError = () => reject(new Error("Failed to load HEIC decoder module."));
      existingScript.addEventListener("load", handleLoad, { once: true });
      existingScript.addEventListener("error", handleError, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/heic2any@0.0.4/dist/heic2any.min.js";
    script.onload = () => resolve();
    script.onerror = () => {
      const fallbackScript = document.createElement("script");
      fallbackScript.src = "https://unpkg.com/heic2any@0.0.4/dist/heic2any.min.js";
      fallbackScript.onload = () => resolve();
      fallbackScript.onerror = () =>
        reject(
          new Error(
            "Failed to load HEIC decoder from CDN. Please check your internet connection."
          )
        );
      document.head.appendChild(fallbackScript);
    };
    document.head.appendChild(script);
  });
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function getJpgFilename(filename: string): string {
  const baseName = filename.replace(/\.(heic|heif)$/i, "");
  return baseName.endsWith(".jpg") || baseName.endsWith(".jpeg")
    ? baseName
    : `${baseName}.jpg`;
}

export default function HeicConverterClient() {
  const { createUrl, revokeUrl } = useObjectUrlManager();

  const [items, setItems] = useState<ConvertedFileItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [quality, setQuality] = useState<number>(0.95);
  const [isProcessing, setIsProcessing] = useAsyncSafeState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [statusText, setStatusText] = useState<string>("");

  const activeItem = items[selectedIndex] || null;

  // Render canvas to JPEG blob for a given decoded image
  const renderJpeg = useCallback(
    async (
      img: HTMLImageElement,
      targetQuality: number
    ): Promise<{ blob: Blob; width: number; height: number }> => {
      const w = img.naturalWidth || img.width;
      const h = img.naturalHeight || img.height;

      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        throw new Error("Unable to create 2D canvas context for JPEG export.");
      }

      // Fill white background for JPEG opacity
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);

      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((b) => resolve(b), "image/jpeg", targetQuality);
      });

      if (!blob) {
        throw new Error("Failed to export canvas to JPEG format.");
      }

      return { blob, width: w, height: h };
    },
    []
  );

  // Process a list of uploaded HEIC/HEIF files
  const processFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileList = Array.from(files).filter((f) =>
        /\.(heic|heif)$/i.test(f.name) || /heic|heif/i.test(f.type)
      );

      if (fileList.length === 0) {
        setGlobalError("Please select valid .heic or .heif photo files.");
        return;
      }

      setGlobalError(null);
      setIsProcessing(true);

      // Clean up previous item URLs
      items.forEach((item) => {
        if (item.jpegUrl) revokeUrl(item.jpegUrl);
      });

      const initialItems: ConvertedFileItem[] = fileList.map((f, idx) => ({
        id: `${f.name}-${Date.now()}-${idx}`,
        originalFile: f,
        originalName: f.name,
        originalSize: f.size,
        imageElement: null,
        dimensions: null,
        jpegBlob: null,
        jpegUrl: null,
        jpegSize: 0,
        status: "decoding",
        errorMessage: null,
      }));

      setItems(initialItems);
      setSelectedIndex(0);

      try {
        setStatusText("Loading HEIC decoder engine...");
        await ensureHeic2Any();

        for (let i = 0; i < initialItems.length; i++) {
          const currentItem = initialItems[i]!;
          setStatusText(
            `Decoding HEIC photo ${i + 1} of ${initialItems.length}...`
          );

          try {
            // Load HEIC using format-utils loadHeic
            const imgEl = await loadHeic(currentItem.originalFile);
            
            setStatusText(
              `Converting photo ${i + 1} to high-quality JPEG...`
            );

            const { blob, width, height } = await renderJpeg(imgEl, quality);
            const url = createUrl(blob);

            setItems((prev) =>
              prev.map((item, idx) =>
                idx === i
                  ? {
                      ...item,
                      imageElement: imgEl,
                      dimensions: { width, height },
                      jpegBlob: blob,
                      jpegUrl: url,
                      jpegSize: blob.size,
                      status: "done",
                    }
                  : item
              )
            );
          } catch (err: unknown) {
            const errStr = formatError(err);
            setItems((prev) =>
              prev.map((item, idx) =>
                idx === i
                  ? {
                      ...item,
                      status: "error",
                      errorMessage: errStr,
                    }
                  : item
              )
            );
          }
        }
      } catch (err: unknown) {
        setGlobalError(formatError(err));
      } finally {
        setIsProcessing(false);
        setStatusText("");
      }
    },
    [items, quality, createUrl, revokeUrl, renderJpeg, setIsProcessing]
  );

  // Handle re-export when quality slider changes
  const handleQualityChange = useCallback(
    async (newQuality: number) => {
      setQuality(newQuality);

      if (items.length === 0) return;

      // Re-encode existing decoded images at new quality level
      const updatedItems = await Promise.all(
        items.map(async (item) => {
          if (!item.imageElement || item.status !== "done") return item;
          try {
            const { blob } = await renderJpeg(item.imageElement, newQuality);
            if (item.jpegUrl) revokeUrl(item.jpegUrl);
            const newUrl = createUrl(blob);
            return {
              ...item,
              jpegBlob: blob,
              jpegUrl: newUrl,
              jpegSize: blob.size,
            };
          } catch {
            return item;
          }
        })
      );

      setItems(updatedItems);
    },
    [items, renderJpeg, createUrl, revokeUrl]
  );

  // Download a single converted file
  const handleDownload = useCallback((item: ConvertedFileItem) => {
    if (!item.jpegUrl) return;
    const a = document.createElement("a");
    a.href = item.jpegUrl;
    a.download = getJpgFilename(item.originalName);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, []);

  // Download all successfully converted files
  const handleDownloadAll = useCallback(() => {
    items.forEach((item) => {
      if (item.status === "done" && item.jpegUrl) {
        const a = document.createElement("a");
        a.href = item.jpegUrl;
        a.download = getJpgFilename(item.originalName);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    });
  }, [items]);

  // Copy converted image to clipboard
  const handleCopyImage = useCallback(async (item: ConvertedFileItem) => {
    if (!item.jpegBlob) return;
    try {
      if (navigator.clipboard && typeof ClipboardItem !== "undefined") {
        // Most browsers require image/png for ClipboardItem
        const canvas = document.createElement("canvas");
        if (item.dimensions) {
          canvas.width = item.dimensions.width;
          canvas.height = item.dimensions.height;
          const ctx = canvas.getContext("2d");
          if (ctx && item.imageElement) {
            ctx.drawImage(item.imageElement, 0, 0);
            const pngBlob = await new Promise<Blob | null>((res) =>
              canvas.toBlob((b) => res(b), "image/png")
            );
            if (pngBlob) {
              await navigator.clipboard.write([
                new ClipboardItem({ "image/png": pngBlob }),
              ]);
              setCopiedId(item.id);
              setTimeout(() => setCopiedId(null), 2000);
            }
          }
        }
      }
    } catch {
      // Fallback if clipboard API is restricted
    }
  }, []);

  // Reset converter state
  const handleReset = useCallback(() => {
    items.forEach((item) => {
      if (item.jpegUrl) revokeUrl(item.jpegUrl);
    });
    setItems([]);
    setSelectedIndex(0);
    setGlobalError(null);
    setIsProcessing(false);
    setStatusText("");
  }, [items, revokeUrl, setIsProcessing]);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Top Banner / Privacy */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-surface border border-border p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue/10 text-blue rounded-xl font-bold">
            <FileImage className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-text">HEIC Photo Converter</h2>
            <p className="text-xs text-text-muted font-medium">
              Directly converts iPhone & Apple photos to JPEG locally in your browser
            </p>
          </div>
        </div>
        <PrivacyBadge message="100% Offline & Private" />
      </div>

      {/* Main Upload / Conversion Area */}
      {items.length === 0 ? (
        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <DropZone
            onFilesSelected={processFiles}
            accept=".heic,.heif,image/heic,image/heif"
            multiple={true}
            title="Drop HEIC or HEIF photos here"
            description="or click to browse from iPhone, Mac, or PC (.heic, .heif)"
            icon={<FileImage className="w-10 h-10 text-blue" />}
          />

          {/* Feature highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="bg-surface/50 border border-border/60 p-3.5 rounded-xl text-center">
              <Sparkles className="w-4 h-4 text-blue mx-auto mb-1.5" />
              <div className="text-xs font-bold text-text">Zero Quality Loss</div>
              <div className="text-[11px] text-text-muted">Configurable JPEG output up to 100% quality</div>
            </div>
            <div className="bg-surface/50 border border-border/60 p-3.5 rounded-xl text-center">
              <Layers className="w-4 h-4 text-blue mx-auto mb-1.5" />
              <div className="text-xs font-bold text-text">Batch Processing</div>
              <div className="text-[11px] text-text-muted">Convert multiple iPhone photos at once</div>
            </div>
            <div className="bg-surface/50 border border-border/60 p-3.5 rounded-xl text-center">
              <ArrowRight className="w-4 h-4 text-blue mx-auto mb-1.5" />
              <div className="text-xs font-bold text-text">Instant Download</div>
              <div className="text-[11px] text-text-muted">Generates standard .jpg files instantly</div>
            </div>
          </div>
        </m.div>
      ) : (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="bg-surface border border-border p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1 min-w-[240px]">
              <Sliders className="w-4 h-4 text-blue shrink-0" />
              <div className="flex-1 space-y-1">
                <div className="flex justify-between text-xs font-bold text-text">
                  <span>JPEG Quality</span>
                  <span className="text-blue">{Math.round(quality * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.50"
                  max="1.00"
                  step="0.05"
                  value={quality}
                  onChange={(e) => handleQualityChange(parseFloat(e.target.value))}
                  disabled={isProcessing}
                  className="w-full h-2 bg-bg rounded-lg appearance-none cursor-pointer accent-blue disabled:opacity-50"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              {items.length > 1 && (
                <button
                  onClick={handleDownloadAll}
                  disabled={isProcessing}
                  className="px-4 py-2 bg-blue text-white rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-blue/90 transition-colors shadow-sm disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download All ({items.filter((i) => i.status === "done").length})
                </button>
              )}

              <button
                onClick={handleReset}
                className="px-4 py-2 bg-bg border border-border text-text hover:text-blue hover:border-blue/30 rounded-xl font-bold text-xs flex items-center gap-2 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Change Photos
              </button>
            </div>
          </div>

          {/* Loading Indicator during processing */}
          {isProcessing && (
            <div className="bg-blue/5 border border-blue/20 p-4 rounded-2xl flex items-center gap-3 animate-pulse">
              <Loader2 className="w-5 h-5 text-blue animate-spin shrink-0" />
              <span className="text-xs font-bold text-blue">{statusText}</span>
            </div>
          )}

          {/* Active Item Preview & Details */}
          {activeItem && activeItem.status === "done" && activeItem.jpegUrl && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Image Preview Box */}
              <div className="lg:col-span-2 bg-surface border border-border rounded-2xl p-4 flex flex-col items-center justify-center min-h-[340px] relative group overflow-hidden">
                <img
                  src={activeItem.jpegUrl}
                  alt={activeItem.originalName}
                  className="max-h-[460px] w-auto object-contain rounded-xl shadow-md transition-transform duration-200"
                />

                <button
                  onClick={() => setIsFullscreen(true)}
                  className="absolute top-4 right-4 p-2 bg-bg/80 backdrop-blur border border-border/50 text-text rounded-xl opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue hover:text-white"
                  title="View Fullscreen"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>

                <div className="absolute bottom-4 left-4 right-4 bg-bg/80 backdrop-blur border border-border/50 p-2.5 rounded-xl flex items-center justify-between text-xs text-text-muted font-medium">
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-bold text-text truncate">
                      {activeItem.originalName}
                    </span>
                  </div>
                  {activeItem.dimensions && (
                    <span className="shrink-0 bg-blue/10 text-blue font-bold px-2 py-0.5 rounded-md">
                      {activeItem.dimensions.width} × {activeItem.dimensions.height} px
                    </span>
                  )}
                </div>
              </div>

              {/* Conversion Summary & Action Panel */}
              <div className="bg-surface border border-border p-6 rounded-2xl flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-text uppercase tracking-wider">
                    Conversion Summary
                  </h3>

                  {/* Size Comparison Card */}
                  <div className="bg-bg border border-border p-4 rounded-xl space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-text-muted font-medium">Original HEIC</span>
                      <span className="font-bold text-text">
                        {formatBytes(activeItem.originalSize)}
                      </span>
                    </div>

                    <div className="w-full bg-border h-px" />

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-text-muted font-medium">Converted JPEG</span>
                      <span className="font-bold text-blue">
                        {formatBytes(activeItem.jpegSize)}
                      </span>
                    </div>

                    {activeItem.originalSize > 0 && activeItem.jpegSize > 0 && (
                      <div className="pt-1 text-[11px] text-emerald-500 font-bold flex items-center justify-between">
                        <span>Size Diff</span>
                        <span>
                          {activeItem.jpegSize < activeItem.originalSize
                            ? `-${Math.round(
                                ((activeItem.originalSize - activeItem.jpegSize) /
                                  activeItem.originalSize) *
                                  100
                              )}% saved`
                            : `+${Math.round(
                                ((activeItem.jpegSize - activeItem.originalSize) /
                                  activeItem.originalSize) *
                                  100
                              )}%`}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Details List */}
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-border/50 text-text-muted font-medium">
                      <span>Format</span>
                      <span className="text-text font-bold uppercase">JPEG (.jpg)</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-border/50 text-text-muted font-medium">
                      <span>Compression Quality</span>
                      <span className="text-text font-bold">
                        {Math.round(quality * 100)}%
                      </span>
                    </div>
                    <div className="flex justify-between py-1 text-text-muted font-medium">
                      <span>Output File</span>
                      <span className="text-blue font-bold truncate max-w-[160px]">
                        {getJpgFilename(activeItem.originalName)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => handleDownload(activeItem)}
                    className="w-full py-3 bg-blue hover:bg-blue/90 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue/20"
                  >
                    <Download className="w-4 h-4" />
                    Download JPG Photo
                  </button>

                  <button
                    onClick={() => handleCopyImage(activeItem)}
                    className="w-full py-2.5 bg-bg hover:bg-surface border border-border text-text rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    {copiedId === activeItem.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-500">Copied to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-text-muted" />
                        Copy Image
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Batch Thumbnail Selector if multiple files */}
          {items.length > 1 && (
            <div className="bg-surface border border-border p-4 rounded-2xl space-y-3">
              <div className="text-xs font-bold text-text flex items-center justify-between">
                <span>All Uploaded Photos ({items.length})</span>
                <span className="text-text-muted font-normal">
                  Click photo to select & preview
                </span>
              </div>

              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
                {items.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedIndex(idx)}
                    className={`relative shrink-0 w-24 h-24 rounded-xl border-2 overflow-hidden transition-all text-left ${
                      selectedIndex === idx
                        ? "border-blue ring-2 ring-blue/20 shadow-md"
                        : "border-border hover:border-text-4 opacity-75 hover:opacity-100"
                    }`}
                  >
                    {item.jpegUrl ? (
                      <img
                        src={item.jpegUrl}
                        alt={item.originalName}
                        className="w-full h-full object-cover"
                      />
                    ) : item.status === "decoding" || item.status === "exporting" ? (
                      <div className="w-full h-full bg-bg flex items-center justify-center">
                        <Loader2 className="w-5 h-5 text-blue animate-spin" />
                      </div>
                    ) : (
                      <div className="w-full h-full bg-error/5 flex items-center justify-center p-1 text-center">
                        <AlertCircle className="w-5 h-5 text-error" />
                      </div>
                    )}

                    <div className="absolute bottom-0 inset-x-0 bg-bg/90 backdrop-blur p-1 text-[10px] font-bold text-text truncate">
                      {item.originalName}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Global Error Banner */}
      <AnimatePresence>
        {globalError && (
          <m.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="p-4 bg-error/10 border border-error/20 rounded-2xl flex items-center gap-3 text-xs font-bold text-error"
          >
            <AlertCircle className="w-5 h-5 shrink-0" />
            <div className="flex-1">{globalError}</div>
          </m.div>
        )}
      </AnimatePresence>

      {/* Fullscreen Lightbox Modal */}
      {isFullscreen && activeItem && activeItem.jpegUrl && (
        <div
          className="fixed inset-0 z-dropdown bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setIsFullscreen(false)}
        >
          <div className="relative max-w-full max-h-full">
            <img
              src={activeItem.jpegUrl}
              alt={activeItem.originalName}
              className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
            />
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 p-3 bg-white/20 text-white rounded-full font-bold hover:bg-white/40 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
