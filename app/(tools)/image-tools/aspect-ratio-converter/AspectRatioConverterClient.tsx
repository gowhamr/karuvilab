"use client";

import { useState, useEffect, useCallback } from "react";
import {
  convertAspectRatio,
  ASPECT_RATIO_PRESETS,
  OutputFormat,
  AspectRatioPreset,
} from "@/src/lib/canvas-image-engine";
import { convertAspectRatio } from "@/src/lib/canvas-worker-client";
import { useObjectUrlManager, useAsyncSafeState } from "@/src/lib/hooks";
import { DropZone } from "@/components/ui/DropZone";
import { PrivacyBadge } from "@/components/system/PrivacyBadge";
import { formatError } from "@/src/lib/formatError";
import { m } from "framer-motion";
import {
  Download,
  RotateCcw,
  Crop,
  Maximize2,
  Palette,
  FileType,
  Check,
  Loader2,
  CircleAlert as AlertCircle,
  Sparkles,
  Ratio,
  ImageIcon,
  ArrowRight,
} from "lucide-react";

const PRESET_HINTS: Record<string, string> = {
  "1:1": "Square • IG Post",
  "4:3": "Standard",
  "3:4": "Portrait",
  "16:9": "Widescreen • YouTube",
  "9:16": "Story • TikTok",
  "3:2": "Classic Photo",
  "2:3": "Tall Portrait",
  "21:9": "Ultrawide",
};

const COLOR_PRESETS = [
  { label: "White", value: "#ffffff" },
  { label: "Black", value: "#000000" },
  { label: "Slate", value: "#f8fafc" },
  { label: "Dark", value: "#0f172a" },
  { label: "Gray", value: "#e2e8f0" },
  { label: "Blue", value: "#3b82f6" },
  { label: "Emerald", value: "#10b981" },
  { label: "Purple", value: "#8b5cf6" },
];

const FORMAT_OPTIONS: { label: string; value: OutputFormat; ext: string }[] = [
  { label: "PNG", value: "image/png", ext: ".png" },
  { label: "JPEG", value: "image/jpeg", ext: ".jpg" },
  { label: "WebP", value: "image/webp", ext: ".webp" },
];

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export default function AspectRatioConverterClient() {
  const { createUrl, revokeUrl } = useObjectUrlManager();

  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [originalImg, setOriginalImg] = useState<HTMLImageElement | null>(null);
  const [origDimensions, setOrigDimensions] = useState<{ width: number; height: number } | null>(null);

  const [selectedPreset, setSelectedPreset] = useState<AspectRatioPreset>(ASPECT_RATIO_PRESETS[0]!);
  const [mode, setMode] = useState<"crop" | "pad">("crop");
  const [bgColor, setBgColor] = useState<string>("#ffffff");
  const [format, setFormat] = useState<OutputFormat>("image/png");

  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultDimensions, setResultDimensions] = useState<{ width: number; height: number } | null>(null);

  const [isProcessing, setIsProcessing] = useAsyncSafeState(false);
  const [error, setError] = useState<string | null>(null);

  // File Upload Handler
  const handleFileSelect = (files: FileList | File[]) => {
    const selected = files instanceof FileList ? files[0] : files[0];
    if (!selected) return;

    if (originalUrl) revokeUrl(originalUrl);
    if (resultUrl) revokeUrl(resultUrl);

    setError(null);
    setFile(selected);
    setResultBlob(null);
    setResultUrl(null);
    setResultDimensions(null);

    const url = createUrl(selected);
    setOriginalUrl(url);

    const img = new Image();
    
    img.onload = () => {
      setOriginalImg(img);
      setOrigDimensions({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      setError("Failed to load image. Please select a valid image file.");
    };
    img.src = url;
  };

  // Convert Aspect Ratio
  const processImage = useCallback(async () => {
    if (!originalImg || !file) return;

    try {
      setIsProcessing(true);
      setError(null);

      const blob = await convertAspectRatio(
        originalImg,
        selectedPreset.width,
        selectedPreset.height,
        mode,
        bgColor,
        format
      );

      const url = createUrl(blob);

      const origW = originalImg.naturalWidth;
      const origH = originalImg.naturalHeight;
      const currentRatio = origW / origH;
      const targetRatio = selectedPreset.width / selectedPreset.height;

      let resW = 0;
      let resH = 0;

      if (mode === "crop") {
        if (currentRatio > targetRatio) {
          resH = origH;
          resW = Math.round(origH * targetRatio);
        } else {
          resW = origW;
          resH = Math.round(origW / targetRatio);
        }
      } else {
        if (currentRatio > targetRatio) {
          resW = origW;
          resH = Math.round(origW / targetRatio);
        } else {
          resH = origH;
          resW = Math.round(origH * targetRatio);
        }
      }

      setResultDimensions({ width: resW, height: resH });
      setResultBlob(blob);
      setResultUrl(prev => { if (prev) revokeUrl(prev); return url; });
    } catch (err) {
      setError(formatError(err));
    } finally {
      setIsProcessing(false);
    }
  }, [originalImg, file, selectedPreset, mode, bgColor, format, createUrl, revokeUrl, setIsProcessing]);

  // Re-process when parameters change
  useEffect(() => {
    if (originalImg && file) {
      processImage();
    }
  }, [selectedPreset, mode, bgColor, format, originalImg, file, processImage]);

  // Reset tool state
  const handleReset = () => {
    if (originalUrl) revokeUrl(originalUrl);
    if (resultUrl) revokeUrl(resultUrl);

    setFile(null);
    setOriginalUrl(null);
    setOriginalImg(null);
    setOrigDimensions(null);
    setResultBlob(null);
    setResultUrl(null);
    setResultDimensions(null);
    setError(null);
  };

  // Download converted image
  const handleDownload = () => {
    if (!resultUrl || !file) return;
    const fmtObj = FORMAT_OPTIONS.find((f) => f.value === format) || FORMAT_OPTIONS[0];
    const baseName = file.name.replace(/\.[^.]+$/, "");
    const ratioLabel = selectedPreset.label.replace(":", "x");
    const filename = `${baseName}-${ratioLabel}-${mode}${fmtObj?.ext || '.png'}`;

    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-8">
      {/* Privacy & Engine Badge */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <PrivacyBadge message="100% Client-Side Canvas Engine — Images never leave your device" />
      </div>

      {/* Error display */}
      {error && (
        <m.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 text-red-600 rounded-xl text-sm"
        >
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </m.div>
      )}

      {/* Main Container */}
      {!file ? (
        <div className="max-w-2xl mx-auto">
          <DropZone
            onFilesSelected={handleFileSelect}
            accept="image/*"
            title="Drop image here or click to browse"
            description="Supports PNG, JPEG, WebP, GIF, SVG and BMP"
            icon={<Ratio className="w-12 h-12 text-blue mx-auto" />}
            className="py-16"
          />
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2 items-start">
          {/* Controls Column */}
          <div className="space-y-6">
            {/* Presets Selection */}
            <div className="bg-surface border border-border p-6 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-widest text-text-3 flex items-center gap-2">
                  <Ratio className="w-4 h-4 text-blue" />
                  Aspect Ratio Presets
                </label>
                <span className="text-xs font-semibold text-blue bg-blue/10 px-2.5 py-1 rounded-full">
                  {selectedPreset.label} ({selectedPreset.width}:{selectedPreset.height})
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {ASPECT_RATIO_PRESETS.map((preset) => {
                  const isSelected = selectedPreset.label === preset.label;
                  const hint = PRESET_HINTS[preset.label];
                  return (
                    <button
                      key={preset.label}
                      onClick={() => setSelectedPreset(preset)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? "bg-blue text-white border-blue shadow-sm ring-2 ring-blue/30"
                          : "bg-bg border-border text-text hover:border-blue/50"
                      }`}
                    >
                      <span className="text-base font-bold">{preset.label}</span>
                      {hint && (
                        <span
                          className={`text-[10px] font-medium mt-0.5 truncate max-w-full ${
                            isSelected ? "text-white/80" : "text-text-muted"
                          }`}
                        >
                          {hint}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mode Toggle */}
            <div className="bg-surface border border-border p-6 rounded-2xl space-y-4">
              <label className="text-xs font-bold uppercase tracking-widest text-text-3 flex items-center gap-2">
                <Crop className="w-4 h-4 text-blue" />
                Fitting Mode
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setMode("crop")}
                  className={`flex items-start gap-3 p-4 rounded-xl border transition-all text-left ${
                    mode === "crop"
                      ? "bg-blue/10 border-blue text-text ring-1 ring-blue"
                      : "bg-bg border-border text-text-3 hover:border-border/80"
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg ${
                      mode === "crop" ? "bg-blue text-white" : "bg-surface text-text-3"
                    }`}
                  >
                    <Crop className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-text">Crop</div>
                    <div className="text-xs text-text-muted mt-0.5">Center-crop to fit ratio</div>
                  </div>
                </button>

                <button
                  onClick={() => setMode("pad")}
                  className={`flex items-start gap-3 p-4 rounded-xl border transition-all text-left ${
                    mode === "pad"
                      ? "bg-blue/10 border-blue text-text ring-1 ring-blue"
                      : "bg-bg border-border text-text-3 hover:border-border/80"
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg ${
                      mode === "pad" ? "bg-blue text-white" : "bg-surface text-text-3"
                    }`}
                  >
                    <Maximize2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-text">Pad</div>
                    <div className="text-xs text-text-muted mt-0.5">Add background to fit</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Background Color Picker (For Pad Mode) */}
            {mode === "pad" && (
              <m.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-surface border border-border p-6 rounded-2xl space-y-4 overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-widest text-text-3 flex items-center gap-2">
                    <Palette className="w-4 h-4 text-blue" />
                    Padding Background Color
                  </label>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-5 h-5 rounded-full border border-border shadow-inner"
                      style={{ backgroundColor: bgColor }}
                    />
                    <span className="text-xs font-mono font-semibold text-text-3 uppercase">
                      {bgColor}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {COLOR_PRESETS.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => setBgColor(c.value)}
                      title={c.label}
                      className={`w-8 h-8 rounded-xl border transition-all flex items-center justify-center ${
                        bgColor.toLowerCase() === c.value.toLowerCase()
                          ? "border-blue ring-2 ring-blue/30 scale-110"
                          : "border-border hover:scale-105"
                      }`}
                      style={{ backgroundColor: c.value }}
                    >
                      {bgColor.toLowerCase() === c.value.toLowerCase() && (
                        <Check
                          className={`w-4 h-4 ${
                            c.value === "#ffffff" || c.value === "#e2e8f0" || c.value === "#f8fafc"
                              ? "text-black"
                              : "text-white"
                          }`}
                        />
                      )}
                    </button>
                  ))}

                  <div className="relative inline-flex items-center">
                    <input
                      type="color"
                      value={bgColor.startsWith("#") ? bgColor : "#ffffff"}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-8 h-8 rounded-xl border border-border cursor-pointer opacity-0 absolute inset-0"
                    />
                    <div className="w-8 h-8 rounded-xl border border-border bg-bg flex items-center justify-center text-text-3 hover:border-blue/50 pointer-events-none">
                      <Palette className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </m.div>
            )}

            {/* Output Format Selector */}
            <div className="bg-surface border border-border p-6 rounded-2xl space-y-4">
              <label className="text-xs font-bold uppercase tracking-widest text-text-3 flex items-center gap-2">
                <FileType className="w-4 h-4 text-blue" />
                Output Format
              </label>

              <div className="grid grid-cols-3 gap-3">
                {FORMAT_OPTIONS.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setFormat(f.value)}
                    className={`py-3 px-4 rounded-xl border font-bold text-sm transition-all ${
                      format === f.value
                        ? "bg-blue text-white border-blue shadow-sm"
                        : "bg-bg border-border text-text-3 hover:border-blue/50"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={handleDownload}
                disabled={!resultUrl || isProcessing}
                className="w-full sm:flex-1 py-4 px-6 bg-blue text-white font-bold rounded-xl shadow-lg shadow-blue/20 hover:bg-blue/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all text-base"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Download Converted Image
                  </>
                )}
              </button>

              <button
                onClick={handleReset}
                className="w-full sm:w-auto py-4 px-6 bg-bg border border-border text-text-3 font-semibold rounded-xl hover:bg-surface hover:text-text flex items-center justify-center gap-2 transition-all text-base"
              >
                <RotateCcw className="w-5 h-5" />
                Change Image
              </button>
            </div>
          </div>

          {/* Preview Column */}
          <div className="space-y-6">
            <div className="bg-surface border border-border p-6 rounded-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-2 font-bold text-sm text-text">
                  <ImageIcon className="w-4 h-4 text-blue" />
                  Live Preview
                </div>
                {isProcessing && (
                  <div className="flex items-center gap-2 text-xs font-semibold text-blue animate-pulse">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Rendering Canvas...
                  </div>
                )}
              </div>

              {/* Dimension Comparison Banner */}
              {origDimensions && (
                <div className="grid grid-cols-2 gap-3 p-3 bg-bg border border-border rounded-xl text-xs">
                  <div>
                    <span className="text-text-muted font-medium block">Original Size</span>
                    <span className="font-bold text-text text-sm">
                      {origDimensions.width} × {origDimensions.height} px
                    </span>
                    {file && <span className="text-text-muted block mt-0.5">{formatBytes(file.size)}</span>}
                  </div>

                  <div className="border-l border-border pl-3">
                    <span className="text-text-muted font-medium block">Target Result ({selectedPreset.label})</span>
                    <span className="font-bold text-blue text-sm">
                      {resultDimensions ? `${resultDimensions.width} × ${resultDimensions.height} px` : "Calculating..."}
                    </span>
                    {resultBlob && (
                      <span className="text-text-muted block mt-0.5">{formatBytes(resultBlob.size)}</span>
                    )}
                  </div>
                </div>
              )}

              {/* Main Image Container */}
              <div className="relative min-h-[320px] max-h-[520px] bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] rounded-xl border border-border p-4 flex items-center justify-center overflow-hidden">
                {isProcessing && (
                  <div className="absolute inset-0 bg-surface/70 backdrop-blur-xs flex flex-col items-center justify-center gap-2 z-content">
                    <Loader2 className="w-8 h-8 text-blue animate-spin" />
                    <span className="text-xs font-bold text-text-3">Applying Aspect Ratio...</span>
                  </div>
                )}

                {resultUrl ? (
                  <m.img
                    key={resultUrl}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    src={resultUrl}
                    alt="Converted Preview"
                    className="max-h-[480px] w-auto h-auto object-contain rounded-lg shadow-md border border-border/50"
                  />
                ) : originalUrl ? (
                  <img
                    src={originalUrl}
                    alt="Original Image"
                    className="max-h-[480px] w-auto h-auto object-contain rounded-lg opacity-60"
                  />
                ) : (
                  <div className="text-center text-text-muted py-12">
                    <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-40" />
                    <p className="text-sm font-medium">Upload an image to start converting</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
