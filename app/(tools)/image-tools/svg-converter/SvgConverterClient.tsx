"use client";

import { useState, useEffect, useCallback } from "react";
import { m } from "framer-motion";
import {
  Download,
  RotateCcw,
  Loader2,
  FileCode,
  Lock,
  Unlock,
  AlertCircle,
  ImageIcon,
  Maximize2,
  Palette,
  Sliders,
  Scaling,
} from "lucide-react";
import { useObjectUrlManager, useAsyncSafeState } from "@/src/lib/hooks";
import { formatError } from "@/src/lib/formatError";
import { loadAny } from "@/src/format-utils";
import { formatBytes, downloadBlob } from "@/src/utils";
import { blobManager } from "@/src/lib/blob-manager";
import { DropZone } from "@/components/ui/DropZone";
import { PrivacyBadge } from "@/components/system/PrivacyBadge";
import { ToolInput } from "@/components/ui/ToolInput";
import { ToolWorkspace } from "@/components/ui/ToolWorkspace";

const PRESET_SCALES = [
  { label: "0.5×", factor: 0.5 },
  { label: "1×", factor: 1.0 },
  { label: "2×", factor: 2.0 },
  { label: "4×", factor: 4.0 },
];

const PRESET_SIZES = [512, 1024, 2048, 4096];

const COLOR_PRESETS = [
  { label: "Transparent", value: "transparent" },
  { label: "White", value: "#ffffff" },
  { label: "Black", value: "#000000" },
  { label: "Dark Gray", value: "#1e293b" },
  { label: "Slate", value: "#f8fafc" },
];

export default function SvgConverterClient() {
  const { createUrl, revokeUrl } = useObjectUrlManager();

  // File state
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [loadedImage, setLoadedImage] = useState<HTMLImageElement | HTMLCanvasElement | null>(null);
  const [origWidth, setOrigWidth] = useState<number>(0);
  const [origHeight, setOrigHeight] = useState<number>(0);
  const [svgContentText, setSvgContentText] = useState<string | null>(null);

  // Target dimension state
  const [targetWidth, setTargetWidth] = useState<string>("");
  const [targetHeight, setTargetHeight] = useState<string>("");
  const [lockRatio, setLockRatio] = useState<boolean>(true);
  const [bgColor, setBgColor] = useState<string>("transparent");

  // Output / processing state
  const [isProcessing, setIsProcessing] = useAsyncSafeState<boolean>(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load SVG file
  const handleFileSelect = async (files: FileList | File[]) => {
    const selected = files instanceof FileList ? files[0] : files[0];
    if (!selected) return;

    // Reset previous object URLs
    if (originalUrl) revokeUrl(originalUrl);
    if (resultUrl) revokeUrl(resultUrl);

    setError(null);
    setResultBlob(null);
    setResultUrl(null);
    setFile(selected);

    const url = createUrl(selected);
    setOriginalUrl(url);

    try {
      setIsProcessing(true);
      // Read SVG text content for crisp high-res rasterization and dimension fallback
      let textContent: string | null = null;
      try {
        textContent = await selected.text();
        setSvgContentText(textContent);
      } catch {
        setSvgContentText(null);
      }

      // Load image via loadAny utility
      const loaded = await loadAny(selected);
      setLoadedImage(loaded);

      let w = "naturalWidth" in loaded ? loaded.naturalWidth : loaded.width;
      let h = "naturalHeight" in loaded ? loaded.naturalHeight : loaded.height;

      // Fallback dimension extraction from SVG DOM if natural dimensions missing or 0
      if ((!w || !h || w === 0 || h === 0) && textContent) {
        try {
          const parser = new DOMParser();
          const doc = parser.parseFromString(textContent, "image/svg+xml");
          const svgEl = doc.querySelector("svg");
          if (svgEl) {
            const viewBox = svgEl.getAttribute("viewBox");
            if (viewBox) {
              const parts = viewBox.trim().split(/[\s,]+/).map(Number);
              if (parts.length === 4 && parts[2]! > 0 && parts[3]! > 0) {
                w = parts[2]!;
                h = parts[3]!;
              }
            }
            if ((!w || !h) && svgEl.hasAttribute("width") && svgEl.hasAttribute("height")) {
              const attrW = parseFloat(svgEl.getAttribute("width") || "");
              const attrH = parseFloat(svgEl.getAttribute("height") || "");
              if (attrW > 0 && attrH > 0) {
                w = attrW;
                h = attrH;
              }
            }
          }
        } catch {
          // ignore parsing error
        }
      }

      if (!w || !h || w === 0 || h === 0) {
        w = 800;
        h = 800;
      }

      const intW = Math.round(w);
      const intH = Math.round(h);

      setOrigWidth(intW);
      setOrigHeight(intH);
      setTargetWidth(String(intW));
      setTargetHeight(String(intH));
    } catch (err) {
      setError(formatError(err || "Failed to parse SVG file."));
    } finally {
      setIsProcessing(false);
    }
  };

  // Target width handler
  const handleWidthChange = (val: string) => {
    setTargetWidth(val);
    if (lockRatio && origWidth > 0 && origHeight > 0 && val) {
      const parsedW = parseInt(val, 10);
      if (!isNaN(parsedW) && parsedW > 0) {
        setTargetHeight(String(Math.round((parsedW * origHeight) / origWidth)));
      }
    }
  };

  // Target height handler
  const handleHeightChange = (val: string) => {
    setTargetHeight(val);
    if (lockRatio && origWidth > 0 && origHeight > 0 && val) {
      const parsedH = parseInt(val, 10);
      if (!isNaN(parsedH) && parsedH > 0) {
        setTargetWidth(String(Math.round((parsedH * origWidth) / origHeight)));
      }
    }
  };

  // Apply Quick Scale (e.g. 0.5x, 1x, 2x, 4x)
  const applyScale = (factor: number) => {
    if (origWidth > 0 && origHeight > 0) {
      setTargetWidth(String(Math.round(origWidth * factor)));
      setTargetHeight(String(Math.round(origHeight * factor)));
    }
  };

  // Apply Quick Size (e.g. 512, 1024, 2048, 4096)
  const applyPresetWidth = (w: number) => {
    setTargetWidth(String(w));
    if (lockRatio && origWidth > 0 && origHeight > 0) {
      setTargetHeight(String(Math.round((w * origHeight) / origWidth)));
    }
  };

  // Rasterize SVG to Canvas and export PNG
  const rasterizeSvg = useCallback(async () => {
    if (!file || !loadedImage) return;

    const w = parseInt(targetWidth, 10);
    const h = parseInt(targetHeight, 10);

    if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) {
      setError("Please specify valid width and height dimensions.");
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);

      // Brief tick for smooth UI transition
      await new Promise((r) => setTimeout(r, 40));

      let imgElement: HTMLImageElement | HTMLCanvasElement = loadedImage;
      let tempObjectUrl: string | null = null;

      // Crisp vector scaling: modify SVG text width/height if available for vector crispness
      if (svgContentText) {
        try {
          const parser = new DOMParser();
          const doc = parser.parseFromString(svgContentText, "image/svg+xml");
          const svgEl = doc.querySelector("svg");
          if (svgEl) {
            if (!svgEl.hasAttribute("viewBox")) {
              const ow = origWidth || w;
              const oh = origHeight || h;
              svgEl.setAttribute("viewBox", `0 0 ${ow} ${oh}`);
            }
            svgEl.setAttribute("width", `${w}`);
            svgEl.setAttribute("height", `${h}`);

            const serializer = new XMLSerializer();
            const modifiedText = serializer.serializeToString(doc);
            const blob = new Blob([modifiedText], { type: "image/svg+xml;charset=utf-8" });
            tempObjectUrl = blobManager.create(blob);

            const scaledImg = new Image();
            await new Promise<void>((res, rej) => {
              scaledImg.onload = () => res();
              scaledImg.onerror = rej;
              scaledImg.src = tempObjectUrl!;
            });

            imgElement = scaledImg;
          }
        } catch {
          // Fall back to original loadedImage
          imgElement = loadedImage;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;

      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not initialize 2D canvas context.");

      ctx.clearRect(0, 0, w, h);

      // Apply background color if not transparent
      if (bgColor !== "transparent") {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, w, h);
      }

      ctx.drawImage(imgElement, 0, 0, w, h);

      if (tempObjectUrl) {
        blobManager.revoke(tempObjectUrl);
      }

      const pngBlob = await new Promise<Blob | null>((res) =>
        canvas.toBlob((b) => res(b), "image/png")
      );

      if (!pngBlob) throw new Error("Failed to export PNG blob from canvas.");

      if (resultUrl) revokeUrl(resultUrl);

      const url = createUrl(pngBlob);
      setResultBlob(pngBlob);
      setResultUrl(url);
    } catch (err) {
      setError(formatError(err || "Failed to convert SVG to PNG."));
    } finally {
      setIsProcessing(false);
    }
  }, [
    file,
    loadedImage,
    targetWidth,
    targetHeight,
    svgContentText,
    origWidth,
    origHeight,
    bgColor,
    createUrl,
    resultUrl,
    revokeUrl,
    setIsProcessing,
  ]);

  // Re-rasterize when dimensions or background change
  useEffect(() => {
    if (file && loadedImage && targetWidth && targetHeight) {
      const timeout = setTimeout(() => {
        rasterizeSvg();
      }, 150);
      return () => clearTimeout(timeout);
    }
  }, [targetWidth, targetHeight, bgColor, file, loadedImage, rasterizeSvg]);

  // Reset tool
  const handleReset = () => {
    if (originalUrl) revokeUrl(originalUrl);
    if (resultUrl) revokeUrl(resultUrl);

    setFile(null);
    setOriginalUrl(null);
    setLoadedImage(null);
    setSvgContentText(null);
    setOrigWidth(0);
    setOrigHeight(0);
    setTargetWidth("");
    setTargetHeight("");
    setResultBlob(null);
    setResultUrl(null);
    setError(null);
  };

  // Download converted PNG file
  const handleDownload = () => {
    if (!resultUrl || !file) return;
    const baseName = file.name.replace(/\.svg$/i, "");
    const filename = `${baseName}-${targetWidth}x${targetHeight}.png`;
    downloadBlob(resultUrl, filename);
  };

  return (
    <ToolWorkspace
      layout={file ? "split" : "stacked"}
      input={
        !file ? (
          <div className="w-full">
            <DropZone
              onFilesSelected={handleFileSelect}
              accept=".svg,image/svg+xml"
              title="Drop SVG file here or click to browse"
              description="Supports vector SVG files (.svg)"
              icon={<FileCode className="w-12 h-12 text-blue mx-auto" />}
              className="py-16"
            />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-widest text-text-3 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue" />
                Target Export Dimensions
              </label>
              <button
                type="button"
                onClick={() => setLockRatio(!lockRatio)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  lockRatio
                    ? "bg-blue/10 text-blue border border-blue/20"
                    : "bg-bg text-text-muted border border-border hover:text-text-3"
                }`}
                title={lockRatio ? "Aspect ratio locked" : "Aspect ratio unlocked"}
              >
                {lockRatio ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                <span>{lockRatio ? "Locked Ratio" : "Unlocked"}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <ToolInput
                label="Width (px)"
                type="number"
                value={targetWidth}
                onChange={handleWidthChange}
                placeholder="800"
              />
              <ToolInput
                label="Height (px)"
                type="number"
                value={targetHeight}
                onChange={handleHeightChange}
                placeholder="600"
              />
            </div>

            {/* Quick Scale Presets */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-text-3 flex items-center gap-1.5">
                <Scaling className="w-3.5 h-3.5 text-blue" />
                Scale Multiplier
              </label>
              <div className="grid grid-cols-4 gap-2">
                {PRESET_SCALES.map((ps) => (
                  <button
                    key={ps.label}
                    type="button"
                    onClick={() => applyScale(ps.factor)}
                    className="py-2 px-3 bg-bg hover:bg-surface border border-border hover:border-blue/50 rounded-xl text-xs font-bold text-text-2 hover:text-blue transition-all"
                  >
                    {ps.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Resolution Presets */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-text-3 flex items-center gap-1.5">
                <Maximize2 className="w-3.5 h-3.5 text-blue" />
                Preset Widths
              </label>
              <div className="grid grid-cols-4 gap-2">
                {PRESET_SIZES.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => applyPresetWidth(sz)}
                    className="py-2 px-3 bg-bg hover:bg-surface border border-border hover:border-blue/50 rounded-xl text-xs font-bold text-text-2 hover:text-blue transition-all"
                  >
                    {sz}px
                  </button>
                ))}
              </div>
            </div>
          </div>
        )
      }
      optionsPanel={
        file ? (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-widest text-text-3 flex items-center gap-2">
                  <Palette className="w-4 h-4 text-blue" />
                  Canvas Background
                </label>
                <span className="text-xs font-mono font-semibold text-text-3 uppercase">
                  {bgColor}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {COLOR_PRESETS.map((c) => {
                  const isSelected = bgColor.toLowerCase() === c.value.toLowerCase();
                  return (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setBgColor(c.value)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
                        isSelected
                          ? "bg-blue text-white border-blue shadow-sm"
                          : "bg-bg border-border text-text-3 hover:border-blue/50"
                      }`}
                    >
                      {c.value === "transparent" ? (
                        <div className="w-4 h-4 rounded border border-border bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:6px_6px]" />
                      ) : (
                        <div
                          className="w-4 h-4 rounded border border-border/50"
                          style={{ backgroundColor: c.value }}
                        />
                      )}
                      <span>{c.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleDownload}
                disabled={!resultUrl || isProcessing}
                className="w-full sm:flex-1 py-4 px-6 bg-blue text-white font-bold rounded-xl shadow-lg shadow-blue/20 hover:bg-blue/90 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all text-base"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Rasterizing...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Download PNG
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="w-full sm:w-auto py-4 px-6 bg-bg border border-border text-text-3 font-semibold rounded-xl hover:bg-surface hover:text-text flex items-center justify-center gap-2 transition-all text-base"
              >
                <RotateCcw className="w-5 h-5" />
                Change File
              </button>
            </div>
          </div>
        ) : null
      }
      output={
        file ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2 font-bold text-sm text-text">
                <ImageIcon className="w-4 h-4 text-blue" />
                PNG Result Preview
              </div>
              {isProcessing && (
                <div className="flex items-center gap-2 text-xs font-semibold text-blue animate-pulse">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Rendering Canvas...
                </div>
              )}
            </div>

            {/* Info stats banner */}
            <div className="grid grid-cols-2 gap-3 p-3 bg-bg border border-border rounded-xl text-xs">
              <div>
                <span className="text-text-muted font-medium block">Original SVG</span>
                <span className="font-bold text-text text-sm">
                  {origWidth} × {origHeight} px
                </span>
                {file && <span className="text-text-muted block mt-0.5">{formatBytes(file.size)}</span>}
              </div>

              <div className="border-l border-border pl-3">
                <span className="text-text-muted font-medium block">Rasterized PNG</span>
                <span className="font-bold text-blue text-sm">
                  {targetWidth && targetHeight ? `${targetWidth} × ${targetHeight} px` : "Calculating..."}
                </span>
                {resultBlob && (
                  <span className="text-text-muted block mt-0.5">{formatBytes(resultBlob.size)}</span>
                )}
              </div>
            </div>

            {/* Live Preview Display */}
            <div className="relative min-h-[320px] max-h-[520px] bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] rounded-xl border border-border p-4 flex items-center justify-center overflow-hidden">
              {isProcessing && (
                <div className="absolute inset-0 bg-surface/70 backdrop-blur-xs flex flex-col items-center justify-center gap-2 z-content">
                  <Loader2 className="w-8 h-8 text-blue animate-spin" />
                  <span className="text-xs font-bold text-text-3">Rasterizing Vector...</span>
                </div>
              )}

              {resultUrl ? (
                <m.img
                  key={resultUrl}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  src={resultUrl}
                  alt="Rasterized PNG Preview"
                  className="max-h-[480px] w-auto h-auto object-contain rounded-lg shadow-md border border-border/50"
                />
              ) : originalUrl ? (
                <img
                  src={originalUrl}
                  alt="SVG Original"
                  className="max-h-[480px] w-auto h-auto object-contain rounded-lg opacity-60"
                />
              ) : (
                <div className="text-center text-text-muted py-12">
                  <FileCode className="w-12 h-12 mx-auto mb-2 opacity-40" />
                  <p className="text-sm font-medium">Upload an SVG file to start</p>
                </div>
              )}
            </div>
          </div>
        ) : null
      }
      infoPanel={
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <PrivacyBadge message="100% Client-Side Conversion — SVG vector rendered locally" />
          </div>

          {/* Error Notice */}
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
        </div>
      }
    />
  );
}
