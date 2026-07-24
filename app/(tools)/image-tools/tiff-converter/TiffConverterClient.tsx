"use client";

import { useState, useCallback } from "react";
import { useObjectUrlManager, useAsyncSafeState } from "@/src/lib/hooks";
import { DropZone } from "@/components/ui/DropZone";
import { PrivacyBadge } from "@/components/system/PrivacyBadge";
import { formatError } from "@/src/lib/formatError";
import { formatBytes } from "@/src/utils";
import { loadAny, loadTiff, encodeTiff } from "@/src/format-utils";
import { m, AnimatePresence } from "framer-motion";
import {
  Download,
  RefreshCw,
  FileImage,
  ArrowRight,
  Sparkles,
  Check,
  AlertCircle,
  Sliders,
  Layers,
  Info,
  Loader2
} from "lucide-react";

type TargetFormat = "image/png" | "image/jpeg" | "image/webp" | "image/tiff";

interface FormatOption {
  id: TargetFormat;
  label: string;
  ext: string;
  badgeColor: string;
  description: string;
}

const TARGET_OPTIONS: FormatOption[] = [
  {
    id: "image/png",
    label: "PNG",
    ext: "png",
    badgeColor: "bg-sky-500/10 text-sky-500 border-sky-500/20",
    description: "Lossless, transparent web format"
  },
  {
    id: "image/jpeg",
    label: "JPEG",
    ext: "jpg",
    badgeColor: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    description: "Compressed, smaller file size"
  },
  {
    id: "image/webp",
    label: "WebP",
    ext: "webp",
    badgeColor: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    description: "Modern, high-efficiency web image"
  },
  {
    id: "image/tiff",
    label: "TIFF",
    ext: "tif",
    badgeColor: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    description: "Professional, uncompressed format"
  }
];

async function ensureUtifLoaded(): Promise<void> {
  if (typeof window === "undefined") return;
  if ((window as any).UTIF) return;

  return new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-utif-script="true"]');
    if (existing) {
      let interval: NodeJS.Timeout;
      const timeout = setTimeout(() => {
        clearInterval(interval);
        reject(new Error("TIFF converter engine initialization timed out."));
      }, 10000);
      interval = setInterval(() => {
        if ((window as any).UTIF) {
          clearTimeout(timeout);
          clearInterval(interval);
          resolve();
        }
      }, 100);
      return;
    }

    const script = document.createElement("script");
    script.setAttribute("data-utif-script", "true");
    script.src = "https://cdn.jsdelivr.net/npm/utif@3.1.0/UTIF.js";
    script.async = true;
    script.onload = () => {
      if ((window as any).UTIF) {
        resolve();
      } else {
        reject(new Error("TIFF engine failed to initialize."));
      }
    };
    script.onerror = () => {
      const fallbackScript = document.createElement("script");
      fallbackScript.setAttribute("data-utif-script", "true");
      fallbackScript.src = "https://unpkg.com/utif@3.1.0/UTIF.js";
      fallbackScript.async = true;
      fallbackScript.onload = () => {
        if ((window as any).UTIF) resolve();
        else reject(new Error("TIFF engine failed to initialize from fallback CDN."));
      };
      fallbackScript.onerror = () => {
        reject(new Error("Failed to load TIFF processor engine. Please check your network connection."));
      };
      document.body.appendChild(fallbackScript);
    };
    document.body.appendChild(script);
  });
}

function elementToCanvas(el: HTMLImageElement | HTMLCanvasElement): HTMLCanvasElement {
  if (el instanceof HTMLCanvasElement) {
    return el;
  }
  const canvas = document.createElement("canvas");
  canvas.width = el.naturalWidth || el.width;
  canvas.height = el.naturalHeight || el.height;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.drawImage(el, 0, 0);
  }
  return canvas;
}

export default function TiffConverterClient() {
  const { createUrl } = useObjectUrlManager();

  const [file, setFile] = useState<File | null>(null);
  const [inputPreviewUrl, setInputPreviewUrl] = useState<string | null>(null);
  const [inputFormatLabel, setInputFormatLabel] = useState<string>("");
  const [isInputTiff, setIsInputTiff] = useState<boolean>(false);
  const [origDimensions, setOrigDimensions] = useState<{ width: number; height: number } | null>(null);
  const [sourceCanvas, setSourceCanvas] = useState<HTMLCanvasElement | null>(null);

  const [targetFormat, setTargetFormat] = useState<TargetFormat>("image/png");
  const [quality, setQuality] = useState<number>(90);

  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const [isProcessing, setIsProcessing] = useAsyncSafeState(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const convertCanvas = useCallback(
    async (canvas: HTMLCanvasElement, format: TargetFormat, qual: number) => {
      try {
        setIsProcessing(true);
        const formatLabel = format === "image/tiff" ? "TIFF" : (format.split("/")[1]?.toUpperCase() || "UNKNOWN");
        setLoadingMessage(`Converting image to ${formatLabel}...`);
        setErrorMsg(null);

        let blob: Blob;
        if (format === "image/tiff") {
          await ensureUtifLoaded();
          blob = encodeTiff(canvas);
        } else {
          blob = await new Promise<Blob>((resolve, reject) => {
            canvas.toBlob(
              (b) => (b ? resolve(b) : reject(new Error("Failed to encode image canvas"))),
              format,
              qual / 100
            );
          });
        }

        const url = createUrl(blob);
        setResultBlob(blob);
        setResultUrl(url);
      } catch (err: any) {
        console.error("TIFF conversion error:", err);
        setErrorMsg(formatError(err));
      } finally {
        setIsProcessing(false);
      }
    },
    [createUrl, setIsProcessing]
  );
  const handleFileSelect = useCallback(
    async (files: File[]) => {
      if (!files || files.length === 0) return;
      const selectedFile = files[0];
      if (!selectedFile) return;

      try {
        setIsProcessing(true);
        setLoadingMessage("Processing uploaded file...");
        setErrorMsg(null);
        setFile(selectedFile);

        const ext = (selectedFile.name.split(".").pop() || "").toLowerCase();
        const isTiff =
          ext === "tiff" ||
          ext === "tif" ||
          selectedFile.type === "image/tiff" ||
          selectedFile.type === "image/x-tiff";

        setIsInputTiff(isTiff);
        setInputFormatLabel(isTiff ? "TIFF" : ext.toUpperCase() || "IMAGE");

        let canvas: HTMLCanvasElement;
        let previewUrl: string;
        const initialTarget: TargetFormat = isTiff ? "image/png" : "image/tiff";
        setTargetFormat(initialTarget);

        if (isTiff) {
          setLoadingMessage("Initializing TIFF engine & decoding image...");
          await ensureUtifLoaded();
          canvas = await loadTiff(selectedFile);

          setLoadingMessage("Generating visual preview...");
          const previewBlob = await new Promise<Blob>((res, rej) => {
            canvas.toBlob(
              (b) => (b ? res(b) : rej(new Error("Failed to generate preview from TIFF"))),
              "image/png"
            );
          });
          previewUrl = createUrl(previewBlob);
        } else {
          setLoadingMessage("Decoding image file...");
          const loaded = await loadAny(selectedFile);
          canvas = elementToCanvas(loaded);
          previewUrl = createUrl(selectedFile);
        }

        setSourceCanvas(canvas);
        setInputPreviewUrl(previewUrl);
        setOrigDimensions({ width: canvas.width, height: canvas.height });

        await convertCanvas(canvas, initialTarget, quality);
      } catch (err: any) {
        console.error("File processing error:", err);
        setErrorMsg(formatError(err));
      } finally {
        setIsProcessing(false);
      }
    },
    [createUrl, convertCanvas, quality, setIsProcessing]
  );

  const handleFormatChange = (newFormat: TargetFormat) => {
    setTargetFormat(newFormat);
    if (sourceCanvas) {
      convertCanvas(sourceCanvas, newFormat, quality);
    }
  };

  const handleQualityChange = (newQuality: number) => {
    setQuality(newQuality);
    if (sourceCanvas && (targetFormat === "image/jpeg" || targetFormat === "image/webp")) {
      convertCanvas(sourceCanvas, targetFormat, newQuality);
    }
  };

  const handleReset = () => {
    setFile(null);
    setInputPreviewUrl(null);
    setSourceCanvas(null);
    setResultBlob(null);
    setResultUrl(null);
    setOrigDimensions(null);
    setErrorMsg(null);
    setIsProcessing(false);
  };

  const handleDownload = () => {
    if (!resultUrl || !file || !resultBlob) return;
    const targetOpt = TARGET_OPTIONS.find((t) => t.id === targetFormat);
    const targetExt = targetOpt ? targetOpt.ext : "png";
    const cleanBase = file.name.replace(/\.[^.]+$/, "");
    const downloadName = `${cleanBase}_converted.${targetExt}`;

    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = downloadName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const getTargetOptions = () => {
    if (isInputTiff) {
      return TARGET_OPTIONS.filter((t) => t.id !== "image/tiff");
    }
    return TARGET_OPTIONS;
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <PrivacyBadge />

      {errorMsg && (
        <m.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 flex items-center gap-3 text-sm"
        >
          <AlertCircle className="w-5 h-5 shrink-0" />
          <div className="flex-1">{errorMsg}</div>
        </m.div>
      )}

      {!file ? (
        <div className="space-y-6">
          <DropZone
            onFilesSelected={handleFileSelect}
            accept=".tiff,.tif,.png,.jpg,.jpeg,.webp,.bmp,.heic,.gif,image/*"
            title="Drop image to convert to or from TIFF"
            subtitle="Supports TIFF, TIF, PNG, JPEG, WebP, BMP, HEIC, and GIF"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-surface border border-border space-y-2">
              <div className="flex items-center gap-2 text-blue font-semibold text-sm">
                <Layers className="w-4 h-4" />
                <span>Lossless Quality</span>
              </div>
              <p className="text-xs text-text-muted">
                TIFF preserves absolute maximum image detail, making it ideal for professional photography, archives, and printing.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-surface border border-border space-y-2">
              <div className="flex items-center gap-2 text-emerald-500 font-semibold text-sm">
                <Sparkles className="w-4 h-4" />
                <span>Auto-Detection Mode</span>
              </div>
              <p className="text-xs text-text-muted">
                Drop a TIFF image to convert to web formats (PNG/JPEG/WebP), or drop any standard image to convert it into a TIFF.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-surface border border-border space-y-2">
              <div className="flex items-center gap-2 text-amber-500 font-semibold text-sm">
                <Info className="w-4 h-4" />
                <span>100% Private & Local</span>
              </div>
              <p className="text-xs text-text-muted">
                All decoding and encoding happens directly inside your browser memory using WebAssembly & pure JavaScript.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <m.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-6"
          >
            {/* Header info bar */}
            <div className="p-4 rounded-2xl bg-surface border border-border flex flex-wrap items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2.5 rounded-xl bg-blue/10 text-blue shrink-0">
                  <FileImage className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-text truncate max-w-xs md:max-w-md">
                    {file.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-text-muted mt-0.5">
                    <span className="px-2 py-0.5 rounded-full bg-border/50 font-medium uppercase text-[10px]">
                      {inputFormatLabel}
                    </span>
                    <span>•</span>
                    <span>{formatBytes(file.size)}</span>
                    {origDimensions && (
                      <>
                        <span>•</span>
                        <span>
                          {origDimensions.width} × {origDimensions.height} px
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="hidden sm:inline-flex px-3 py-1 rounded-full bg-blue/10 text-blue font-semibold text-xs border border-blue/20">
                  {isInputTiff ? "TIFF → Standard Format" : "Standard Format → TIFF"}
                </span>
                <button
                  onClick={handleReset}
                  className="px-3 py-1.5 rounded-xl bg-border/40 hover:bg-border/70 text-text text-xs font-semibold flex items-center gap-1.5 transition-colors active:scale-95"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Change Image</span>
                </button>
              </div>
            </div>

            {/* Target Settings */}
            <div className="p-5 rounded-2xl bg-surface border border-border space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-text">
                  <Sliders className="w-4 h-4 text-blue" />
                  <span>Output Conversion Settings</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-2">
                    Target Format
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {getTargetOptions().map((opt) => {
                      const active = targetFormat === opt.id;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => handleFormatChange(opt.id)}
                          className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                            active
                              ? "bg-blue/10 border-blue text-blue font-bold shadow-sm"
                              : "bg-surface border-border text-text hover:border-blue/40"
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="text-sm font-semibold">{opt.label}</span>
                            {active && <Check className="w-4 h-4 text-blue" />}
                          </div>
                          <span className="text-[10px] text-text-muted mt-1 leading-tight">
                            {opt.description}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {(targetFormat === "image/jpeg" || targetFormat === "image/webp") && (
                  <div className="space-y-2 flex flex-col justify-center">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-text-muted">Image Quality</span>
                      <span className="text-blue font-bold">{quality}%</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={100}
                      value={quality}
                      onChange={(e) => handleQualityChange(Number(e.target.value))}
                      className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-blue"
                    />
                    <div className="flex justify-between text-[10px] text-text-muted">
                      <span>Smaller file</span>
                      <span>Higher quality</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Dual Previews Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Original Preview */}
              <div className="p-4 rounded-2xl bg-surface border border-border space-y-3 flex flex-col">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-text uppercase tracking-wider">
                    Original Preview
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-border/50 text-text font-semibold text-[10px]">
                    {inputFormatLabel}
                  </span>
                </div>

                <div className="flex-1 min-h-[240px] max-h-[360px] rounded-xl bg-border/20 border border-border/50 overflow-hidden flex items-center justify-center p-2 relative bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px]">
                  {inputPreviewUrl ? (
                    <img
                      src={inputPreviewUrl}
                      alt="Original input preview"
                      className="max-h-[320px] w-auto max-w-full object-contain rounded-lg shadow-sm"
                    />
                  ) : (
                    <Loader2 className="w-6 h-6 animate-spin text-blue" />
                  )}
                </div>

                <div className="pt-2 flex justify-between text-xs text-text-muted border-t border-border/40">
                  <span>Size: {formatBytes(file.size)}</span>
                  {origDimensions && (
                    <span>
                      {origDimensions.width} × {origDimensions.height} px
                    </span>
                  )}
                </div>
              </div>

              {/* Converted Preview */}
              <div className="p-4 rounded-2xl bg-surface border border-border space-y-3 flex flex-col">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-text uppercase tracking-wider">
                    Converted Preview
                  </span>
                  {resultBlob && (
                    <span className="px-2 py-0.5 rounded-md bg-blue/10 text-blue font-bold text-[10px]">
                      {targetFormat === "image/tiff"
                        ? "TIFF"
                        : (targetFormat.split("/")[1]?.toUpperCase() || "UNKNOWN")}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-h-[240px] max-h-[360px] rounded-xl bg-border/20 border border-border/50 overflow-hidden flex items-center justify-center p-2 relative bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px]">
                  {isProcessing ? (
                    <div className="flex flex-col items-center gap-2 text-text-muted p-4 text-center">
                      <Loader2 className="w-8 h-8 animate-spin text-blue" />
                      <span className="text-xs font-medium">{loadingMessage}</span>
                    </div>
                  ) : resultUrl ? (
                    <img
                      src={resultUrl}
                      alt="Converted output preview"
                      className="max-h-[320px] w-auto max-w-full object-contain rounded-lg shadow-sm"
                    />
                  ) : (
                    <span className="text-xs text-text-muted">No converted preview</span>
                  )}
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-text-muted border-t border-border/40">
                  {resultBlob ? (
                    <>
                      <span>Size: {formatBytes(resultBlob.size)}</span>
                      {(() => {
                        const diff = resultBlob.size - file.size;
                        const pct = ((Math.abs(diff) / file.size) * 100).toFixed(1);
                        const isSmaller = diff < 0;
                        return (
                          <span
                            className={`font-semibold px-2 py-0.5 rounded-md text-[10px] ${
                              isSmaller
                                ? "bg-emerald-500/10 text-emerald-500"
                                : "bg-amber-500/10 text-amber-500"
                            }`}
                          >
                            {isSmaller ? `-${pct}% smaller` : `+${pct}% larger`}
                          </span>
                        );
                      })()}
                    </>
                  ) : (
                    <span>Ready to convert</span>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Action Bar */}
            <div className="p-4 rounded-2xl bg-surface border border-border flex flex-wrap items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-2 text-xs text-text-muted">
                <Sparkles className="w-4 h-4 text-blue" />
                <span>
                  Ready to download in{" "}
                  <strong>
                    {targetFormat === "image/tiff"
                      ? "TIFF"
                      : (targetFormat.split("/")[1]?.toUpperCase() || "UNKNOWN")}
                  </strong>{" "}
                  format.
                </span>
              </div>

              <button
                onClick={handleDownload}
                disabled={!resultUrl || isProcessing}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue hover:bg-blue/90 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue/20 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
              >
                <Download className="w-4 h-4" />
                <span>Download Converted Image</span>
              </button>
            </div>
          </m.div>
        </AnimatePresence>
      )}
    </div>
  );
}
