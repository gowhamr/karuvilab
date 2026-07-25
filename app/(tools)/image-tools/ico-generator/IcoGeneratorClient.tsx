"use client";

import { useState, useEffect, useCallback } from "react";
import { loadAny, encodeIco } from "@/src/format-utils";
import { useObjectUrlManager, useAsyncSafeState } from "@/src/lib/hooks";
import { DropZone } from "@/components/ui/DropZone";
import { PrivacyBadge } from "@/components/system/PrivacyBadge";
import { formatError } from "@/src/lib/formatError";
import { m, AnimatePresence } from "framer-motion";
import {
  Download,
  RotateCcw,
  Maximize2,
  Palette,
  Loader2,
  AlertCircle,
  Sparkles,
  ImageIcon,
  Check,
  Scaling,
  Layers,
  Info,
} from "lucide-react";

export type IcoSize = 16 | 32 | 48 | 64 | 128 | 256;

export interface IcoSizeOption {
  size: IcoSize;
  label: string;
  desc: string;
}

const ICO_SIZES: IcoSizeOption[] = [
  { size: 16, label: "16×16", desc: "Small Favicon" },
  { size: 32, label: "32×32", desc: "Standard Icon / Favicon" },
  { size: 48, label: "48×48", desc: "Desktop Icon" },
  { size: 64, label: "64×64", desc: "High DPI Favicon" },
  { size: 128, label: "128×128", desc: "Large App Icon" },
  { size: 256, label: "256×256", desc: "HD Windows Icon" },
];

export type FitMode = "contain" | "cover" | "stretch";

const FIT_MODES: { mode: FitMode; label: string; desc: string }[] = [
  { mode: "contain", label: "Fit / Contain", desc: "Preserve aspect ratio with padding" },
  { mode: "cover", label: "Crop / Cover", desc: "Fill square by cropping center" },
  { mode: "stretch", label: "Stretch", desc: "Scale directly to square size" },
];

const COLOR_PRESETS = [
  { label: "Transparent", value: "transparent" },
  { label: "White", value: "#ffffff" },
  { label: "Black", value: "#000000" },
  { label: "Slate", value: "#0f172a" },
  { label: "Blue", value: "#2563eb" },
];

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export default function IcoGeneratorClient() {
  const { createUrl, revokeUrl } = useObjectUrlManager();

  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [loadedImg, setLoadedImg] = useState<HTMLImageElement | HTMLCanvasElement | null>(null);
  const [origDimensions, setOrigDimensions] = useState<{ width: number; height: number } | null>(null);

  const [selectedSize, setSelectedSize] = useState<IcoSize>(32);
  const [fitMode, setFitMode] = useState<FitMode>("contain");
  const [bgColor, setBgColor] = useState<string>("transparent");

  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useAsyncSafeState(false);
  const [error, setError] = useState<string | null>(null);

  // File Upload Handler
  const handleFileSelect = async (files: FileList | File[]) => {
    const selected = files instanceof FileList ? files[0] : files[0];
    if (!selected) return;

    if (originalUrl) revokeUrl(originalUrl);
    if (resultUrl) revokeUrl(resultUrl);

    setError(null);
    setFile(selected);
    setResultBlob(null);
    setResultUrl(null);
    setLoadedImg(null);

    const origUrl = createUrl(selected);
    setOriginalUrl(origUrl);

    setIsGenerating(true);
    try {
      const loaded = await loadAny(selected);
      setLoadedImg(loaded);
      setOrigDimensions({ width: loaded.width, height: loaded.height });
    } catch (err) {
      setError(`Failed to load image: ${formatError(err)}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Generator Function
  const generateIcoImage = useCallback(
    async (img: HTMLImageElement | HTMLCanvasElement, size: IcoSize, mode: FitMode, bg: string) => {
      setIsGenerating(true);
      setError(null);

      try {
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d", { alpha: true });

        if (!ctx) {
          throw new Error("Could not initialize 2D canvas context.");
        }

        ctx.clearRect(0, 0, size, size);

        if (bg !== "transparent") {
          ctx.fillStyle = bg;
          ctx.fillRect(0, 0, size, size);
        }

        const imgW = img.width;
        const imgH = img.height;

        let dx = 0;
        let dy = 0;
        let dw = size;
        let dh = size;

        if (mode === "contain") {
          const scale = Math.min(size / imgW, size / imgH);
          dw = imgW * scale;
          dh = imgH * scale;
          dx = (size - dw) / 2;
          dy = (size - dh) / 2;
        } else if (mode === "cover") {
          const scale = Math.max(size / imgW, size / imgH);
          dw = imgW * scale;
          dh = imgH * scale;
          dx = (size - dw) / 2;
          dy = (size - dh) / 2;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, dx, dy, dw, dh);

        const icoBlob = await encodeIco(canvas);

        const newUrl = createUrl(icoBlob);
        setResultBlob(icoBlob);
        setResultUrl((prev) => {
          if (prev) revokeUrl(prev);
          return newUrl;
        });
      } catch (err) {
        setError(`ICO generation failed: ${formatError(err)}`);
      } finally {
        setIsGenerating(false);
      }
    },
    [createUrl, revokeUrl, setIsGenerating]
  );

  // Trigger ICO generation whenever loaded image or settings change
  useEffect(() => {
    if (loadedImg) {
      generateIcoImage(loadedImg, selectedSize, fitMode, bgColor);
    }
  }, [loadedImg, selectedSize, fitMode, bgColor, generateIcoImage]);

  // Reset tool state
  const handleReset = () => {
    if (originalUrl) revokeUrl(originalUrl);
    if (resultUrl) revokeUrl(resultUrl);
    setFile(null);
    setOriginalUrl(null);
    setLoadedImg(null);
    setOrigDimensions(null);
    setResultBlob(null);
    setResultUrl(null);
    setError(null);
  };

  // Download ICO
  const handleDownload = () => {
    if (!resultUrl || !file) return;
    const baseName = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
    const downloadName = `${baseName}_${selectedSize}x${selectedSize}.ico`;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = downloadName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Privacy Badge moved to top right corner conceptually or just rendered inline if needed, but since it's global let's just place it nicely if we want, or remove it since ToolShell handles it. We'll leave it out since ToolShell is the main header. */}
      {/* Main Container */}
      {!file ? (
        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl border border-border p-6 shadow-sm"
        >
          <DropZone
            onFilesSelected={handleFileSelect}
            accept="image/*"
            title="Drop your image here to create an ICO file"
            subtitle="Supports PNG, JPG, WebP, AVIF, HEIC, TIFF, BMP, GIF"
          />
        </m.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Settings Panel (Left Column) */}
          <m.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-5 space-y-5 bg-card rounded-2xl border border-border p-5 shadow-sm"
          >
            {/* Header with Change File */}
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-500" />
                <span className="font-semibold text-sm">Icon Settings</span>
              </div>
              <button
                onClick={handleReset}
                className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface border border-border"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Change Image
              </button>
            </div>

            {/* Size Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Maximize2 className="w-3.5 h-3.5 text-blue-500" />
                Icon Size
              </label>
              <div className="grid grid-cols-3 gap-2">
                {ICO_SIZES.map((option) => (
                  <button
                    key={option.size}
                    onClick={() => setSelectedSize(option.size)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      selectedSize === option.size
                        ? "bg-blue-500/10 border-blue-500 text-blue-600 dark:text-blue-400 font-semibold shadow-sm"
                        : "bg-surface border-border hover:border-blue-500/50 text-foreground"
                    }`}
                  >
                    <div className="text-sm font-bold">{option.label}</div>
                    <div className="text-[10px] text-muted-foreground truncate">{option.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Fit Mode Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Scaling className="w-3.5 h-3.5 text-blue-500" />
                Scaling / Fit Mode
              </label>
              <div className="grid grid-cols-3 gap-2">
                {FIT_MODES.map((item) => (
                  <button
                    key={item.mode}
                    onClick={() => setFitMode(item.mode)}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      fitMode === item.mode
                        ? "bg-blue-500/10 border-blue-500 text-blue-600 dark:text-blue-400 font-semibold shadow-sm"
                        : "bg-surface border-border hover:border-blue-500/50 text-foreground"
                    }`}
                  >
                    <div className="text-xs font-medium">{item.label}</div>
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                <Info className="w-3 h-3 text-muted-foreground" />
                {FIT_MODES.find((m) => m.mode === fitMode)?.desc}
              </p>
            </div>

            {/* Background Color Option */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-blue-500" />
                Background Fill
              </label>
              <div className="flex flex-wrap gap-2">
                {COLOR_PRESETS.map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() => setBgColor(preset.value)}
                    className={`px-3 py-1.5 text-xs rounded-lg border transition-all flex items-center gap-1.5 ${
                      bgColor === preset.value
                        ? "bg-blue-500/10 border-blue-500 text-blue-600 dark:text-blue-400 font-semibold"
                        : "bg-surface border-border hover:border-blue-500/40 text-foreground"
                    }`}
                  >
                    {preset.value !== "transparent" ? (
                      <span
                        className="w-3 h-3 rounded-full border border-border inline-block"
                        style={{ backgroundColor: preset.value }}
                      />
                    ) : (
                      <span className="w-3 h-3 rounded-full border border-border inline-block bg-[linear-gradient(45deg,#ccc_25%,transparent_25%),linear-gradient(-45deg,#ccc_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#ccc_75%),linear-gradient(-45deg,transparent_75%,#ccc_75%)] bg-[length:6px_6px]" />
                    )}
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </m.div>

          {/* Preview & Download Panel (Right Column) */}
          <m.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-7 space-y-5 flex flex-col"
          >
            {/* Error banner */}
            <AnimatePresence>
              {error && (
                <m.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </m.div>
              )}
            </AnimatePresence>

            {/* Preview Card */}
            <div className="bg-card rounded-2xl border border-border p-5 shadow-sm flex-1 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <span className="font-semibold text-sm flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-blue-500" />
                    Preview & Output
                  </span>
                  {resultBlob && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                      <Check className="w-3 h-3" /> Ready
                    </span>
                  )}
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Original Image Info */}
                  <div className="p-4 rounded-xl bg-surface border border-border space-y-3">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Original Image
                    </div>
                    {originalUrl && (
                      <div className="w-full h-32 rounded-lg border border-border/60 bg-[linear-gradient(45deg,#f0f0f0_25%,transparent_25%),linear-gradient(-45deg,#f0f0f0_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f0f0f0_75%),linear-gradient(-45deg,transparent_75%,#f0f0f0_75%)] dark:bg-[linear-gradient(45deg,#222_25%,transparent_25%),linear-gradient(-45deg,#222_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#222_75%),linear-gradient(-45deg,transparent_75%,#222_75%)] bg-[length:12px_12px] flex items-center justify-center p-2 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={originalUrl}
                          alt="Original"
                          className="max-h-full max-w-full object-contain rounded"
                        />
                      </div>
                    )}
                    <div className="text-xs space-y-1 text-muted-foreground">
                      <div className="font-medium text-foreground truncate">{file.name}</div>
                      <div>Size: {formatBytes(file.size)}</div>
                      {origDimensions && (
                        <div>
                          Dimensions: {origDimensions.width} × {origDimensions.height} px
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Generated ICO Preview */}
                  <div className="p-4 rounded-xl bg-surface border border-border space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Generated ICO ({selectedSize}×{selectedSize})
                      </div>
                      <div className="mt-3 w-full h-32 rounded-lg border border-border/60 bg-[linear-gradient(45deg,#f0f0f0_25%,transparent_25%),linear-gradient(-45deg,#f0f0f0_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f0f0f0_75%),linear-gradient(-45deg,transparent_75%,#f0f0f0_75%)] dark:bg-[linear-gradient(45deg,#222_25%,transparent_25%),linear-gradient(-45deg,#222_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#222_75%),linear-gradient(-45deg,transparent_75%,#222_75%)] bg-[length:12px_12px] flex items-center justify-center p-2 relative overflow-hidden">
                        {isGenerating ? (
                          <div className="flex flex-col items-center gap-2 text-muted-foreground text-xs">
                            <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                            <span>Encoding ICO...</span>
                          </div>
                        ) : resultUrl ? (
                          <div className="flex flex-col items-center gap-2">
                            {/* Actual pixel size view + zoomed view */}
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={resultUrl}
                              alt="Generated ICO Preview"
                              className="max-h-24 max-w-24 object-contain shadow-sm"
                              style={{ imageRendering: selectedSize <= 32 ? "pixelated" : "auto" }}
                            />
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">No preview available</span>
                        )}
                      </div>
                    </div>

                    <div className="text-xs space-y-1 text-muted-foreground">
                      <div className="font-medium text-foreground">
                        Format: ICO (Windows Icon)
                      </div>
                      <div>Dimensions: {selectedSize} × {selectedSize} px</div>
                      {resultBlob && <div>File Size: {formatBytes(resultBlob.size)}</div>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Download Button */}
              <button
                onClick={handleDownload}
                disabled={!resultUrl || isGenerating}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating ICO...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Download {selectedSize}×{selectedSize} .ico
                  </>
                )}
              </button>
            </div>
          </m.div>
        </div>
      )}
    </div>
  );
}
