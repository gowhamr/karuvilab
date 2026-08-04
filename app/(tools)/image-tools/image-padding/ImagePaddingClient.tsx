"use client";

import { useState, useEffect, useCallback } from "react";
import { PaddingConfig, OutputFormat } from "@/src/lib/canvas-image-engine";
import { addPadding } from "@/src/lib/canvas-worker-client";
import { useObjectUrlManager, useAsyncSafeState } from "@/src/lib/hooks";
import { DropZone } from "@/components/ui/DropZone";
import { PrivacyBadge } from "@/components/system/PrivacyBadge";
import { formatError } from "@/src/lib/formatError";
import { m } from "framer-motion";
import {
  Download,
  RotateCcw,
  Palette,
  Sliders,
  FileImage,
  Image as ImageIcon,
  Check,
  AlertCircle,
  Copy,
  Maximize2,
  Layers
} from "lucide-react";

type PaddingMode = "uniform" | "custom";

const COLOR_PRESETS = [
  { label: "White", value: "#ffffff" },
  { label: "Black", value: "#000000" },
  { label: "Transparent", value: "transparent" },
  { label: "Slate", value: "#f8fafc" },
  { label: "Dark", value: "#1e293b" },
  { label: "Blue", value: "#3b82f6" },
  { label: "Emerald", value: "#10b981" },
  { label: "Pink", value: "#ec4899" },
];

const PADDING_PRESETS = [0, 10, 20, 40, 60, 100];

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export default function ImagePaddingClient() {
  const { createUrl, revokeUrl } = useObjectUrlManager();

  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("image");
  const [origW, setOrigW] = useState<number>(0);
  const [origH, setOrigH] = useState<number>(0);

  const [paddedUrl, setPaddedUrl] = useState<string | null>(null);
  const [paddedSize, setPaddedSize] = useState<string>("");

  const [mode, setMode] = useState<PaddingMode>("uniform");
  const [uniformValue, setUniformValue] = useState<number>(40);
  const [paddingTop, setPaddingTop] = useState<number>(40);
  const [paddingRight, setPaddingRight] = useState<number>(40);
  const [paddingBottom, setPaddingBottom] = useState<number>(40);
  const [paddingLeft, setPaddingLeft] = useState<number>(40);

  const [bgColor, setBgColor] = useState<string>("#ffffff");
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("image/png");
  const [quality, setQuality] = useState<number>(0.92);

  const [processing, setProcessing] = useAsyncSafeState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedInfo, setCopiedInfo] = useState(false);

  const handleFile = (selectedFile: File) => {
    if (originalUrl) revokeUrl(originalUrl);
    if (paddedUrl) revokeUrl(paddedUrl);

    const url = createUrl(selectedFile);
    setOriginalUrl(url);
    setPaddedUrl(null);
    setFile(selectedFile);
    setFileName(selectedFile.name.replace(/\.[^.]+$/, ""));
    setError(null);

    const img = new Image();
    
    img.onload = () => {
      setOrigW(img.naturalWidth);
      setOrigH(img.naturalHeight);
    };
    img.onerror = () => {
      setError("Failed to read image file.");
    };
    img.src = url;
  };

  const handleUniformChange = (val: number) => {
    const safeVal = Math.max(0, isNaN(val) ? 0 : val);
    setUniformValue(safeVal);
    setPaddingTop(safeVal);
    setPaddingRight(safeVal);
    setPaddingBottom(safeVal);
    setPaddingLeft(safeVal);
  };

  const processPadding = useCallback(async () => {
    if (!file || !originalUrl) return;
    setProcessing(true);
    setError(null);

    try {
      const img = new Image();
      
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Failed to load source image into canvas"));
        img.src = originalUrl;
      });

      const padTop = mode === "uniform" ? uniformValue : paddingTop;
      const padRight = mode === "uniform" ? uniformValue : paddingRight;
      const padBottom = mode === "uniform" ? uniformValue : paddingBottom;
      const padLeft = mode === "uniform" ? uniformValue : paddingLeft;

      const paddingConfig: PaddingConfig = {
        top: Math.max(0, padTop),
        right: Math.max(0, padRight),
        bottom: Math.max(0, padBottom),
        left: Math.max(0, padLeft),
      };

      const blob = await addPadding(
        img,
        paddingConfig,
        bgColor,
        outputFormat,
        quality
      );

      const url = createUrl(blob);
      if (paddedUrl) revokeUrl(paddedUrl);
      setPaddedUrl(url);
      setPaddedSize(formatBytes(blob.size));
    } catch (err) {
      setError(formatError(err));
    } finally {
      setProcessing(false);
    }
  }, [
    file,
    originalUrl,
    mode,
    uniformValue,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
    bgColor,
    outputFormat,
    quality,
    paddedUrl,
    createUrl,
    revokeUrl,
    setProcessing,
  ]);

  useEffect(() => {
    if (!file || !originalUrl) return;
    const timer = setTimeout(() => {
      processPadding();
    }, 120);
    return () => clearTimeout(timer);
  }, [
    processPadding,
    file,
    originalUrl,
    mode,
    uniformValue,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
    bgColor,
    outputFormat,
    quality,
  ]);

  const padTop = mode === "uniform" ? uniformValue : paddingTop;
  const padRight = mode === "uniform" ? uniformValue : paddingRight;
  const padBottom = mode === "uniform" ? uniformValue : paddingBottom;
  const padLeft = mode === "uniform" ? uniformValue : paddingLeft;

  const targetW = origW + padLeft + padRight;
  const targetH = origH + padTop + padBottom;

  const getExtension = (fmt: OutputFormat) => {
    switch (fmt) {
      case "image/jpeg":
        return "jpg";
      case "image/webp":
        return "webp";
      case "image/png":
      default:
        return "png";
    }
  };

  const download = () => {
    if (!paddedUrl) return;
    const ext = getExtension(outputFormat);
    const a = document.createElement("a");
    a.href = paddedUrl;
    a.download = `${fileName}-padded.${ext}`;
    a.click();
  };

  const resetAll = () => {
    if (originalUrl) revokeUrl(originalUrl);
    if (paddedUrl) revokeUrl(paddedUrl);
    setFile(null);
    setOriginalUrl(null);
    setPaddedUrl(null);
    setPaddedSize("");
    setOrigW(0);
    setOrigH(0);
    setError(null);
  };

  const copyDimensionsInfo = () => {
    const text = `Original: ${origW}×${origH}px | Padded: ${targetW}×${targetH}px (+${padTop}t, +${padRight}r, +${padBottom}b, +${padLeft}l)`;
    navigator.clipboard.writeText(text);
    setCopiedInfo(true);
    setTimeout(() => setCopiedInfo(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Info Banner & Privacy Badge */}
      <div className="p-4 bg-surface border border-border rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue/10 text-blue rounded-xl">
            <Maximize2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-text-primary">Canvas Image Padding</h2>
            <p className="text-xs text-text-3">Add uniform or per-side margins with custom background color & format controls.</p>
          </div>
        </div>
        <PrivacyBadge message="100% Client-Side Processing" />
      </div>

      {!originalUrl ? (
        <div className="max-w-2xl mx-auto">
          <DropZone
            onFilesSelected={(files) => {
              const f = files instanceof FileList ? files[0] : files[0];
              if (f) handleFile(f);
            }}
            accept="image/*"
            title="Upload Image to Add Padding"
            description="Supports PNG, JPG, WebP, GIF, SVG and more"
            icon={<FileImage className="w-10 h-10 text-blue" />}
          />
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2 items-start">
          {/* Controls Column */}
          <div className="space-y-6">
            {/* Header with Change File button */}
            <div className="flex items-center justify-between bg-surface border border-border p-4 rounded-2xl">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-bg flex-shrink-0 border border-border">
                  <img src={originalUrl} alt="Source thumbnail" className="w-full h-full object-cover" />
                </div>
                <div className="truncate">
                  <p className="text-sm font-bold text-text-primary truncate">{fileName}</p>
                  <p className="text-xs text-text-muted font-medium">{origW} × {origH}px • {formatBytes(file?.size || 0)}</p>
                </div>
              </div>
              <button
                onClick={resetAll}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-text-3 hover:text-text-primary bg-bg hover:bg-border/50 border border-border rounded-xl transition-all flex-shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Change File
              </button>
            </div>

            {/* Main Configuration Card */}
            <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-blue" />
                  <h3 className="text-xs font-bold uppercase tracking-widest text-text-2">Padding Settings</h3>
                </div>

                {/* Mode Switcher: Uniform vs Custom */}
                <div className="flex bg-bg p-1 rounded-xl border border-border">
                  <button
                    onClick={() => {
                      setMode("uniform");
                      handleUniformChange(uniformValue);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      mode === "uniform"
                        ? "bg-blue text-white shadow-xs"
                        : "text-text-3 hover:text-text-primary"
                    }`}
                  >
                    Uniform
                  </button>
                  <button
                    onClick={() => setMode("custom")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      mode === "custom"
                        ? "bg-blue text-white shadow-xs"
                        : "text-text-3 hover:text-text-primary"
                    }`}
                  >
                    Custom Per-Side
                  </button>
                </div>
              </div>

              {/* Mode Controls */}
              {mode === "uniform" ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-text-2 uppercase tracking-wider">
                      Padding Amount (px)
                    </label>
                    <span className="text-sm font-mono font-bold text-blue bg-blue/10 px-2.5 py-0.5 rounded-lg">
                      {uniformValue}px
                    </span>
                  </div>

                  <input
                    type="range"
                    min={0}
                    max={250}
                    value={uniformValue}
                    onChange={(e) => handleUniformChange(parseInt(e.target.value) || 0)}
                    className="w-full accent-blue cursor-pointer"
                  />

                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min={0}
                      value={uniformValue || ''}
                      onChange={(e) => handleUniformChange(parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-2.5 bg-bg border border-border rounded-xl text-sm font-mono focus:ring-2 focus:ring-blue outline-none"
                      placeholder="40"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <span className="text-xs font-bold text-text-2 uppercase tracking-wider block">
                    Individual Padding Values (px)
                  </span>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-text-3">Top</label>
                      <input
                        type="number"
                        min={0}
                        value={paddingTop || ''}
                        onChange={(e) => setPaddingTop(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full px-3 py-2.5 bg-bg border border-border rounded-xl text-sm font-mono focus:ring-2 focus:ring-blue outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-text-3">Right</label>
                      <input
                        type="number"
                        min={0}
                        value={paddingRight || ''}
                        onChange={(e) => setPaddingRight(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full px-3 py-2.5 bg-bg border border-border rounded-xl text-sm font-mono focus:ring-2 focus:ring-blue outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-text-3">Bottom</label>
                      <input
                        type="number"
                        min={0}
                        value={paddingBottom || ''}
                        onChange={(e) => setPaddingBottom(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full px-3 py-2.5 bg-bg border border-border rounded-xl text-sm font-mono focus:ring-2 focus:ring-blue outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-text-3">Left</label>
                      <input
                        type="number"
                        min={0}
                        value={paddingLeft || ''}
                        onChange={(e) => setPaddingLeft(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full px-3 py-2.5 bg-bg border border-border rounded-xl text-sm font-mono focus:ring-2 focus:ring-blue outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Presets */}
              <div className="space-y-2 pt-1">
                <span className="text-xs font-bold text-text-muted uppercase tracking-wider block">
                  Quick Presets
                </span>
                <div className="flex flex-wrap gap-2">
                  {PADDING_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      onClick={() => {
                        if (mode === "uniform") {
                          handleUniformChange(preset);
                        } else {
                          setPaddingTop(preset);
                          setPaddingRight(preset);
                          setPaddingBottom(preset);
                          setPaddingLeft(preset);
                        }
                      }}
                      className="px-3 py-1.5 bg-bg hover:bg-border/60 border border-border rounded-xl text-xs font-mono font-medium text-text-2 transition-all hover:scale-105 active:scale-95"
                    >
                      {preset}px
                    </button>
                  ))}
                </div>
              </div>

              {/* Background Color Controls */}
              <div className="space-y-3 border-t border-border pt-4">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-blue" />
                  <h4 className="text-xs font-bold uppercase tracking-widest text-text-2">
                    Background Color
                  </h4>
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className="relative w-12 h-10 rounded-xl border border-border overflow-hidden flex-shrink-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2216%22%20height%3D%2216%22%20xmlns%3D%22http://www.w3.org/2000/svg%22%3E%3Crect%20width%3D%228%22%20height%3D%228%22%20fill%3D%22%23ccc%22/%3E%3Crect%20x%3D%228%22%20y%3D%228%22%20width%3D%228%22%20height%3D%228%22%20fill%3D%22%23ccc%22/%3E%3C/svg%3E')]"
                  >
                    <div
                      className="w-full h-full"
                      style={{
                        backgroundColor: bgColor === "transparent" ? "transparent" : bgColor,
                      }}
                    />
                    <input
                      type="color"
                      value={bgColor === "transparent" ? "#ffffff" : bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                    />
                  </div>

                  <input
                    type="text"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    placeholder="#ffffff or transparent"
                    className="flex-1 px-4 py-2.5 bg-bg border border-border rounded-xl text-sm font-mono focus:ring-2 focus:ring-blue outline-none"
                  />
                </div>

                {/* Color Swatch Presets */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {COLOR_PRESETS.map((c) => (
                    <button
                      key={c.label}
                      onClick={() => setBgColor(c.value)}
                      title={c.label}
                      className={`group relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                        bgColor === c.value
                          ? "border-blue ring-2 ring-blue/20 bg-blue/5 text-blue font-bold"
                          : "border-border bg-bg text-text-3 hover:border-border/80"
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/10 inline-block bg-[url('data:image/svg+xml,%3Csvg%20width%3D%228%22%20height%3D%228%22%20xmlns%3D%22http://www.w3.org/2000/svg%22%3E%3Crect%20width%3D%224%22%20height%3D%224%22%20fill%3D%22%23ccc%22/%3E%3Crect%20x%3D%224%22%20y%3D%224%22%20width%3D%224%22%20height%3D%224%22%20fill%3D%22%23ccc%22/%3E%3C/svg%3E')]"
                        style={{
                          backgroundColor: c.value === "transparent" ? "transparent" : c.value,
                        }}
                      />
                      <span>{c.label}</span>
                    </button>
                  ))}
                </div>

                {bgColor === "transparent" && outputFormat === "image/jpeg" && (
                  <p className="text-xs text-amber-600 bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    JPEG does not support transparency. Switch output format to PNG or WebP to keep transparent background.
                  </p>
                )}
              </div>

              {/* Format & Quality Selector */}
              <div className="space-y-4 border-t border-border pt-4">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue" />
                  <h4 className="text-xs font-bold uppercase tracking-widest text-text-2">
                    Export Format
                  </h4>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-bg p-1 rounded-xl border border-border">
                  {(["image/png", "image/jpeg", "image/webp"] as OutputFormat[]).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setOutputFormat(fmt)}
                      className={`py-2 rounded-lg text-xs font-bold uppercase transition-all ${
                        outputFormat === fmt
                          ? "bg-blue text-white shadow-xs"
                          : "text-text-3 hover:text-text-primary"
                      }`}
                    >
                      {getExtension(fmt)}
                    </button>
                  ))}
                </div>

                {outputFormat !== "image/png" && (
                  <div className="space-y-2 pt-1">
                    <div className="flex justify-between items-center text-xs font-bold text-text-3">
                      <span>Quality</span>
                      <span className="font-mono text-blue">{Math.round(quality * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min={0.1}
                      max={1.0}
                      step={0.05}
                      value={quality}
                      onChange={(e) => setQuality(parseFloat(e.target.value))}
                      className="w-full accent-blue cursor-pointer"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Result & Preview Column */}
          <div className="space-y-6">
            <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-blue" />
                  <h3 className="text-xs font-bold uppercase tracking-widest text-text-2">
                    Live Preview
                  </h3>
                </div>

                {paddedSize && (
                  <span className="text-xs font-mono font-bold text-text-3 bg-bg px-2.5 py-1 rounded-lg border border-border">
                    {paddedSize}
                  </span>
                )}
              </div>

              {/* Error banner */}
              {error && (
                <div className="p-3 bg-error/10 text-error text-xs rounded-xl border border-error/20 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Preview Box */}
              <div className="relative min-h-[300px] flex items-center justify-center p-4 rounded-xl border border-border bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2216%22%20height%3D%2216%22%20xmlns%3D%22http://www.w3.org/2000/svg%22%3E%3Crect%20width%3D%228%22%20height%3D%228%22%20fill%3D%22%23ccc%22/%3E%3Crect%20x%3D%228%22%20y%3D%228%22%20width%3D%228%22%20height%3D%228%22%20fill%3D%22%23ccc%22/%3E%3C/svg%3E')] overflow-hidden">
                {processing ? (
                  <div className="flex flex-col items-center gap-3 text-text-3">
                    <div className="w-8 h-8 border-3 border-blue border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs font-bold uppercase tracking-wider">Generating Canvas...</span>
                  </div>
                ) : paddedUrl ? (
                  <m.img
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    src={paddedUrl}
                    alt="Padded result"
                    className="max-h-[380px] w-auto max-w-full object-contain rounded-lg shadow-md"
                  />
                ) : (
                  <span className="text-xs text-text-muted font-bold uppercase tracking-widest">
                    Padded preview will appear here
                  </span>
                )}
              </div>

              {/* Dimensions Specs Card */}
              <div className="bg-bg border border-border p-4 rounded-xl space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-text-3 uppercase tracking-wider">Original Size</span>
                  <span className="font-mono text-text-2 font-semibold">{origW} × {origH} px</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-text-3 uppercase tracking-wider">Added Padding</span>
                  <span className="font-mono text-blue font-semibold">
                    T:{padTop}px R:{padRight}px B:{padBottom}px L:{padLeft}px
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs border-t border-border pt-2.5">
                  <span className="font-bold text-text-primary uppercase tracking-wider">Target Dimensions</span>
                  <span className="font-mono text-text-primary font-bold text-sm">
                    {targetW} × {targetH} px
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={download}
                  disabled={!paddedUrl || processing}
                  className="w-full py-4 bg-blue text-white font-bold rounded-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-md shadow-blue/10 disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
                >
                  <Download className="w-5 h-5" />
                  Download Padded {getExtension(outputFormat).toUpperCase()}
                </button>

                <button
                  onClick={copyDimensionsInfo}
                  className="w-full py-2.5 bg-bg hover:bg-border/40 border border-border text-text-3 hover:text-text-primary text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  {copiedInfo ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-500" />
                      Dimensions Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy Specs & Dimensions
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
