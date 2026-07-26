"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { resizeCanvas, Anchor, OutputFormat } from "@/src/lib/canvas-image-engine";
import { useObjectUrlManager } from "@/src/lib/hooks";
import { DropZone } from "@/components/ui/DropZone";
import { PrivacyBadge } from "@/components/system/PrivacyBadge";
import { formatError } from "@/src/lib/formatError";
import { ToolInput } from "@/components/ui/ToolInput";
import { cn } from "@/src/lib/utils";
import { m, AnimatePresence } from "framer-motion";
import {
  Download,
  RotateCcw,
  Maximize2,
  Palette,
  Grid,
  FileType,
  Check,
  Image as ImageIcon,
  RefreshCw,
  AlertCircle,
  ArrowUpLeft,
  ArrowUp,
  ArrowUpRight,
  ArrowLeft,
  Circle,
  ArrowRight,
  ArrowDownLeft,
  ArrowDown,
  ArrowDownRight,
  Sparkles,
} from "lucide-react";

const ANCHOR_GRID: { id: Anchor; label: string; icon: React.ReactNode }[] = [
  { id: "top-left", label: "Top Left", icon: <ArrowUpLeft className="w-5 h-5" /> },
  { id: "top-center", label: "Top Center", icon: <ArrowUp className="w-5 h-5" /> },
  { id: "top-right", label: "Top Right", icon: <ArrowUpRight className="w-5 h-5" /> },
  { id: "center-left", label: "Center Left", icon: <ArrowLeft className="w-5 h-5" /> },
  { id: "center", label: "Center", icon: <Circle className="w-4 h-4 fill-current" /> },
  { id: "center-right", label: "Center Right", icon: <ArrowRight className="w-5 h-5" /> },
  { id: "bottom-left", label: "Bottom Left", icon: <ArrowDownLeft className="w-5 h-5" /> },
  { id: "bottom-center", label: "Bottom Center", icon: <ArrowDown className="w-5 h-5" /> },
  { id: "bottom-right", label: "Bottom Right", icon: <ArrowDownRight className="w-5 h-5" /> },
];

const COLOR_PRESETS = [
  { label: "White", value: "#ffffff" },
  { label: "Black", value: "#000000" },
  { label: "Transparent", value: "transparent" },
  { label: "Slate", value: "#f8fafc" },
  { label: "Dark Slate", value: "#0f172a" },
  { label: "Blue", value: "#3b82f6" },
];

const FORMAT_OPTIONS: { id: OutputFormat; label: string; ext: string }[] = [
  { id: "image/png", label: "PNG", ext: "png" },
  { id: "image/jpeg", label: "JPEG", ext: "jpg" },
  { id: "image/webp", label: "WebP", ext: "webp" },
];

export default function CanvasResizeClient() {
  const { createUrl, revokeUrl } = useObjectUrlManager();

  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [origW, setOrigW] = useState<number>(0);
  const [origH, setOrigH] = useState<number>(0);

  const [widthInput, setWidthInput] = useState<string>("");
  const [heightInput, setHeightInput] = useState<string>("");
  const [anchor, setAnchor] = useState<Anchor>("center");
  const [bgColor, setBgColor] = useState<string>("#ffffff");
  const [format, setFormat] = useState<OutputFormat>("image/png");

  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultSize, setResultSize] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const imageRef = useRef<HTMLImageElement | null>(null);
  const resultUrlRef = useRef<string | null>(null);

  const handleFileSelect = (selectedFile: File) => {
    if (originalUrl) revokeUrl(originalUrl);
    if (resultUrlRef.current) {
      revokeUrl(resultUrlRef.current);
      resultUrlRef.current = null;
    }

    const url = createUrl(selectedFile);
    setOriginalUrl(url);
    setFile(selectedFile);
    const cleanName = selectedFile.name.replace(/\.[^.]+$/, "");
    setFileName(cleanName);
    setResultUrl(null);
    setResultSize("");
    setError(null);

    const img = new Image();
    
    img.onload = () => {
      imageRef.current = img;
      setOrigW(img.naturalWidth);
      setOrigH(img.naturalHeight);
      setWidthInput(String(img.naturalWidth));
      setHeightInput(String(img.naturalHeight));
    };
    img.onerror = () => {
      setError("Failed to load image. Please select a valid image file.");
    };
    img.src = url;
  };

  const processCanvasResize = useCallback(async () => {
    if (!imageRef.current) return;
    const w = parseInt(widthInput, 10);
    const h = parseInt(heightInput, 10);

    if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) {
      setError("Width and height must be positive numbers.");
      return;
    }

    if (w > 15000 || h > 15000) {
      setError("Dimensions exceed maximum supported limit (15,000 px).");
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);

      const blob = await resizeCanvas(
        imageRef.current,
        w,
        h,
        anchor,
        bgColor,
        format
      );

      const newUrl = createUrl(blob);
      if (resultUrlRef.current) {
        revokeUrl(resultUrlRef.current);
      }
      resultUrlRef.current = newUrl;
      setResultUrl(newUrl);

      const sizeInKb = (blob.size / 1024).toFixed(1);
      const sizeInMb = (blob.size / (1024 * 1024)).toFixed(2);
      setResultSize(blob.size > 1024 * 1024 ? `${sizeInMb} MB` : `${sizeInKb} KB`);
    } catch (err) {
      setError(formatError(err));
    } finally {
      setIsProcessing(false);
    }
  }, [widthInput, heightInput, anchor, bgColor, format, createUrl, revokeUrl]);

  useEffect(() => {
    if (imageRef.current && widthInput && heightInput) {
      const timer = setTimeout(() => {
        processCanvasResize();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [widthInput, heightInput, anchor, bgColor, format, processCanvasResize]);

  const resetAll = () => {
    if (originalUrl) revokeUrl(originalUrl);
    if (resultUrlRef.current) {
      revokeUrl(resultUrlRef.current);
      resultUrlRef.current = null;
    }
    setFile(null);
    setFileName("");
    setOriginalUrl(null);
    setOrigW(0);
    setOrigH(0);
    setWidthInput("");
    setHeightInput("");
    setAnchor("center");
    setBgColor("#ffffff");
    setFormat("image/png");
    setResultUrl(null);
    setResultSize("");
    setError(null);
    imageRef.current = null;
  };

  const handleQuickPreset = (type: string) => {
    if (!origW || !origH) return;
    switch (type) {
      case "reset":
        setWidthInput(String(origW));
        setHeightInput(String(origH));
        break;
      case "pad50":
        setWidthInput(String(origW + 100));
        setHeightInput(String(origH + 100));
        break;
      case "pad100":
        setWidthInput(String(origW + 200));
        setHeightInput(String(origH + 200));
        break;
      case "scale15":
        setWidthInput(String(Math.round(origW * 1.5)));
        setHeightInput(String(Math.round(origH * 1.5)));
        break;
      case "scale20":
        setWidthInput(String(Math.round(origW * 2)));
        setHeightInput(String(Math.round(origH * 2)));
        break;
      case "square": {
        const maxSide = Math.max(origW, origH);
        setWidthInput(String(maxSide));
        setHeightInput(String(maxSide));
        break;
      }
    }
  };

  const downloadImage = () => {
    if (!resultUrl) return;
    const w = parseInt(widthInput, 10) || origW;
    const h = parseInt(heightInput, 10) || origH;
    const matchedFormat = FORMAT_OPTIONS.find((f) => f.id === format);
    const ext = matchedFormat ? matchedFormat.ext : "png";

    const link = document.createElement("a");
    link.href = resultUrl;
    link.download = `${fileName || "canvas"}-resized-${w}x${h}.${ext}`;
    link.click();
  };

  const targetW = parseInt(widthInput, 10) || 0;
  const targetH = parseInt(heightInput, 10) || 0;
  const deltaW = targetW - origW;
  const deltaH = targetH - origH;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <PrivacyBadge message="Canvas resizing is processed 100% locally in your browser." />
        {file && (
          <button
            onClick={resetAll}
            className="inline-flex items-center gap-2 text-xs font-bold text-text-3 hover:text-text bg-bg border border-border px-3 py-2 rounded-xl transition-all hover:scale-102"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset & New File</span>
          </button>
        )}
      </div>

      {!file ? (
        <DropZone
          onFilesSelected={(files) => {
            const selected = files instanceof FileList ? files[0] : files[0];
            if (selected) handleFileSelect(selected);
          }}
          accept="image/*"
          title="Upload image to resize canvas"
          description="Drag & drop PNG, JPEG, WebP, or click to browse"
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-12 items-start">
          {/* Controls Column */}
          <div className="lg:col-span-6 space-y-6">
            {/* Canvas Dimensions Card */}
            <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Maximize2 className="w-5 h-5 text-blue" />
                  <h2 className="text-sm font-bold uppercase tracking-widest text-text">
                    Canvas Dimensions
                  </h2>
                </div>
                <span className="text-xs font-semibold text-text-muted">
                  Original: {origW} × {origH} px
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <ToolInput
                  label="Canvas Width (px)"
                  type="number"
                  value={widthInput}
                  onChange={(val) => setWidthInput(val)}
                  placeholder={String(origW)}
                />
                <ToolInput
                  label="Canvas Height (px)"
                  type="number"
                  value={heightInput}
                  onChange={(val) => setHeightInput(val)}
                  placeholder={String(origH)}
                />
              </div>

              {/* Dimension Change Badges */}
              {origW > 0 && targetW > 0 && targetH > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                  <span className="px-2.5 py-1 bg-bg border border-border rounded-lg text-text-3 font-mono font-medium">
                    Width: {deltaW >= 0 ? `+${deltaW}` : deltaW} px
                  </span>
                  <span className="px-2.5 py-1 bg-bg border border-border rounded-lg text-text-3 font-mono font-medium">
                    Height: {deltaH >= 0 ? `+${deltaH}` : deltaH} px
                  </span>
                </div>
              )}

              {/* Quick Presets */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-3 uppercase tracking-wider">
                  Quick Dimensions
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleQuickPreset("reset")}
                    className="px-3 py-1.5 bg-bg border border-border rounded-xl text-xs font-semibold text-text-3 hover:text-text transition-all"
                  >
                    Original (100%)
                  </button>
                  <button
                    onClick={() => handleQuickPreset("pad50")}
                    className="px-3 py-1.5 bg-bg border border-border rounded-xl text-xs font-semibold text-text-3 hover:text-text transition-all"
                  >
                    +50px Margin
                  </button>
                  <button
                    onClick={() => handleQuickPreset("pad100")}
                    className="px-3 py-1.5 bg-bg border border-border rounded-xl text-xs font-semibold text-text-3 hover:text-text transition-all"
                  >
                    +100px Margin
                  </button>
                  <button
                    onClick={() => handleQuickPreset("scale15")}
                    className="px-3 py-1.5 bg-bg border border-border rounded-xl text-xs font-semibold text-text-3 hover:text-text transition-all"
                  >
                    1.5× Canvas
                  </button>
                  <button
                    onClick={() => handleQuickPreset("scale20")}
                    className="px-3 py-1.5 bg-bg border border-border rounded-xl text-xs font-semibold text-text-3 hover:text-text transition-all"
                  >
                    2× Canvas
                  </button>
                  <button
                    onClick={() => handleQuickPreset("square")}
                    className="px-3 py-1.5 bg-bg border border-border rounded-xl text-xs font-semibold text-text-3 hover:text-text transition-all"
                  >
                    Square Max
                  </button>
                </div>
              </div>
            </div>

            {/* Anchor Position 3x3 Grid Card */}
            <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Grid className="w-5 h-5 text-blue" />
                  <h2 className="text-sm font-bold uppercase tracking-widest text-text">
                    Image Anchor Position
                  </h2>
                </div>
                <span className="text-xs font-bold text-blue uppercase tracking-wider">
                  {ANCHOR_GRID.find((a) => a.id === anchor)?.label}
                </span>
              </div>
              <p className="text-xs text-text-muted">
                Select where to pin your original image within the resized canvas workspace.
              </p>

              {/* 3x3 Visual Grid */}
              <div className="grid grid-cols-3 gap-2 max-w-[260px] mx-auto p-2 bg-bg border border-border rounded-2xl">
                {ANCHOR_GRID.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setAnchor(item.id)}
                    title={item.label}
                    aria-label={item.label}
                    className={cn(
                      "flex flex-col items-center justify-center h-14 rounded-xl font-bold transition-all text-xs gap-1",
                      anchor === item.id
                        ? "bg-blue text-white shadow-md shadow-blue/20 scale-105"
                        : "bg-surface text-text-3 hover:text-text hover:bg-surface/80 border border-border/40"
                    )}
                  >
                    {item.icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Background Color & Format Card */}
            <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm space-y-5">
              {/* Background Color */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Palette className="w-5 h-5 text-blue" />
                    <h2 className="text-sm font-bold uppercase tracking-widest text-text">
                      Canvas Background Color
                    </h2>
                  </div>
                  <span className="font-mono text-xs font-bold text-text-3">
                    {bgColor}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative flex-1 flex items-center gap-2">
                    <input
                      type="color"
                      value={bgColor === "transparent" ? "#ffffff" : bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-10 h-10 rounded-xl border border-border cursor-pointer p-1 bg-bg"
                    />
                    <input
                      type="text"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      placeholder="#ffffff or transparent"
                      className="w-full px-3 py-2 bg-bg border border-border rounded-xl text-sm font-mono text-text outline-none focus:border-blue"
                    />
                  </div>
                </div>

                {/* Swatches */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {COLOR_PRESETS.map((preset) => (
                    <button
                      key={preset.value}
                      onClick={() => setBgColor(preset.value)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all",
                        bgColor === preset.value
                          ? "border-blue bg-blue/10 text-blue font-bold"
                          : "border-border bg-bg text-text-3 hover:text-text"
                      )}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-border shadow-xs"
                        style={{
                          backgroundColor:
                            preset.value === "transparent"
                              ? "#ffffff"
                              : preset.value,
                          backgroundImage:
                            preset.value === "transparent"
                              ? "radial-gradient(#cbd5e1 1px, transparent 0)"
                              : "none",
                          backgroundSize: "4px 4px",
                        }}
                      />
                      <span>{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <hr className="border-border" />

              {/* Format Selector */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FileType className="w-5 h-5 text-blue" />
                  <h2 className="text-sm font-bold uppercase tracking-widest text-text">
                    Output Format
                  </h2>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {FORMAT_OPTIONS.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setFormat(f.id)}
                      className={cn(
                        "flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all border",
                        format === f.id
                          ? "bg-blue text-white border-blue shadow-sm"
                          : "bg-bg text-text-3 border-border hover:text-text"
                      )}
                    >
                      <span>{f.label}</span>
                      {format === f.id && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Preview & Output Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm space-y-6 sticky top-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-blue" />
                  <h2 className="text-sm font-bold uppercase tracking-widest text-text">
                    Live Preview
                  </h2>
                </div>
                {isProcessing && (
                  <div className="flex items-center gap-2 text-xs text-blue font-bold">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Updating…</span>
                  </div>
                )}
              </div>

              {error && (
                <div className="flex items-center gap-2 text-xs font-bold text-red-500 bg-red-500/10 p-3 rounded-xl border border-red-500/20">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Canvas Preview Container */}
              <div className="relative flex items-center justify-center min-h-[320px] max-h-[480px] p-4 bg-bg border border-border rounded-2xl overflow-hidden group">
                <div
                  className="absolute inset-0 opacity-40 pointer-events-none"
                  style={{
                    backgroundImage:
                      "linear-gradient(45deg, var(--border) 25%, transparent 25%), linear-gradient(-45deg, var(--border) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, var(--border) 75%), linear-gradient(-45deg, transparent 75%, var(--border) 75%)",
                    backgroundSize: "16px 16px",
                    backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px",
                  }}
                />

                <AnimatePresence mode="wait">
                  {resultUrl ? (
                    <m.img
                      key={resultUrl}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      src={resultUrl}
                      alt="Canvas Preview"
                      className="relative z-content max-h-[420px] w-auto max-w-full object-contain rounded-lg shadow-md border border-border/50"
                    />
                  ) : (
                    <div className="relative z-content text-center text-text-muted space-y-2">
                      <Sparkles className="w-8 h-8 mx-auto text-text-muted/50 animate-pulse" />
                      <p className="text-xs font-bold uppercase tracking-wider">
                        Generating preview…
                      </p>
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {/* Output Info Pill */}
              {targetW > 0 && targetH > 0 && (
                <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-bg border border-border rounded-xl text-xs">
                  <div className="flex items-center gap-2 font-bold text-text">
                    <span>Target Canvas:</span>
                    <span className="font-mono text-blue">
                      {targetW} × {targetH} px
                    </span>
                  </div>
                  {resultSize && (
                    <div className="flex items-center gap-2 font-bold text-text-3">
                      <span>Est. Size:</span>
                      <span className="font-mono text-text">{resultSize}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={downloadImage}
                  disabled={!resultUrl || isProcessing}
                  className="w-full py-4 bg-blue text-white font-bold rounded-xl hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md shadow-blue/20"
                >
                  <Download className="w-5 h-5" />
                  <span>Download Resized Canvas</span>
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={processCanvasResize}
                    disabled={isProcessing}
                    className="py-3 bg-bg border border-border text-text-3 hover:text-text font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <RefreshCw className={cn("w-4 h-4", isProcessing && "animate-spin")} />
                    <span>Re-process Canvas</span>
                  </button>
                  <button
                    onClick={resetAll}
                    className="py-3 bg-bg border border-border text-text-3 hover:text-text font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Select New Image</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
