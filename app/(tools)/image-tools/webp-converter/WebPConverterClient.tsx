"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useObjectUrlManager, useAsyncSafeState } from "@/src/lib/hooks";
import { DropZone } from "@/components/ui/DropZone";
import { PrivacyBadge } from "@/components/system/PrivacyBadge";
import { formatError } from "@/src/lib/formatError";
import { loadAny } from "@/src/format-utils";
import { formatBytes } from "@/src/utils";
import { cn } from "@/src/lib/utils";
import { m, AnimatePresence } from "framer-motion";
import {
  Download,
  RefreshCw,
  Sliders,
  ImageIcon,
  Sparkles,
  AlertCircle,
  Check,
  Zap,
  TrendingDown,
  Info,
  FileImage,
  ArrowRight,
} from "lucide-react";

const QUALITY_PRESETS = [
  { label: "Max Compress", value: 60, desc: "Smallest size" },
  { label: "Balanced", value: 80, desc: "Recommended" },
  { label: "High Quality", value: 95, desc: "Near lossless" },
];

export default function WebPConverterClient() {
  const { createUrl, revokeUrl } = useObjectUrlManager();

  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [loadedElement, setLoadedElement] = useState<HTMLImageElement | HTMLCanvasElement | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);

  const [quality, setQuality] = useState<number>(80);
  const [isProcessing, setIsProcessing] = useAsyncSafeState(false);
  const [convertedBlob, setConvertedBlob] = useState<Blob | null>(null);
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const convertedUrlRef = useRef<string | null>(null);

  // Clean up previous URLs
  const updateConvertedUrl = useCallback((blob: Blob) => {
    if (convertedUrlRef.current) {
      revokeUrl(convertedUrlRef.current);
    }
    const url = createUrl(blob);
    convertedUrlRef.current = url;
    setConvertedUrl(url);
    setConvertedBlob(blob);
  }, [createUrl, revokeUrl]);

  // Convert canvas/image to WebP
  const performConversion = useCallback(async (
    element: HTMLImageElement | HTMLCanvasElement,
    q: number
  ) => {
    setIsProcessing(true);
    setError(null);
    try {
      const width = element instanceof HTMLImageElement ? (element.naturalWidth || element.width) : element.width;
      const height = element instanceof HTMLImageElement ? (element.naturalHeight || element.height) : element.height;

      if (!width || !height) {
        throw new Error("Unable to determine image dimensions.");
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        throw new Error("Could not initialize 2D rendering context.");
      }

      ctx.drawImage(element, 0, 0);

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => {
            if (b) resolve(b);
            else reject(new Error("Failed to encode canvas to WebP format."));
          },
          "image/webp",
          q / 100
        );
      });

      updateConvertedUrl(blob);
    } catch (err) {
      setError(formatError(err));
    } finally {
      setIsProcessing(false);
    }
  }, [setIsProcessing, updateConvertedUrl]);

  // Handle initial file selection
  const handleFileSelect = async (files: File[]) => {
    if (!files || files.length === 0) return;
    const selectedFile = files[0];
    if (!selectedFile) return;
    
    // Reset state
    if (originalUrl) revokeUrl(originalUrl);
    if (convertedUrlRef.current) {
      revokeUrl(convertedUrlRef.current);
      convertedUrlRef.current = null;
    }
    setConvertedUrl(null);
    setConvertedBlob(null);
    setError(null);

    setFile(selectedFile);
    const origUrl = createUrl(selectedFile);
    setOriginalUrl(origUrl);

    setIsProcessing(true);
    try {
      const element = await loadAny(selectedFile);
      setLoadedElement(element);

      const w = element instanceof HTMLImageElement ? (element.naturalWidth || element.width) : element.width;
      const h = element instanceof HTMLImageElement ? (element.naturalHeight || element.height) : element.height;
      setDimensions({ width: w, height: h });

      await performConversion(element, quality);
    } catch (err) {
      setError(formatError(err));
      setIsProcessing(false);
    }
  };

  // Re-convert when quality changes
  useEffect(() => {
    if (loadedElement) {
      const timeoutId = setTimeout(() => {
        performConversion(loadedElement, quality);
      }, 150);
      return () => clearTimeout(timeoutId);
    }
  }, [quality, loadedElement, performConversion]);

  // Reset tool state
  const handleReset = () => {
    if (originalUrl) revokeUrl(originalUrl);
    if (convertedUrlRef.current) {
      revokeUrl(convertedUrlRef.current);
      convertedUrlRef.current = null;
    }
    setFile(null);
    setOriginalUrl(null);
    setLoadedElement(null);
    setDimensions(null);
    setConvertedBlob(null);
    setConvertedUrl(null);
    setError(null);
  };

  // Download output image
  const handleDownload = () => {
    if (!convertedUrl || !file) return;
    const cleanName = file.name.replace(/\.[^.]+$/, "");
    const a = document.createElement("a");
    a.href = convertedUrl;
    a.download = `${cleanName}.webp`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Size savings calculation
  const originalSize = file?.size || 0;
  const webpSize = convertedBlob?.size || 0;
  const sizeDiff = webpSize - originalSize;
  const percentSaved = originalSize > 0 ? Math.round(((originalSize - webpSize) / originalSize) * 100) : 0;
  const isSmaller = sizeDiff < 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Header Info & Privacy */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-1 flex items-center gap-3">
            <Sparkles className="w-7 h-7 text-blue-500" />
            WebP Converter
          </h1>
          <p className="text-sm text-text-3 mt-1">
            Convert PNG, JPEG, HEIC, TIFF & BMP images to lightweight, web-optimized WebP.
          </p>
        </div>
        <PrivacyBadge />
      </div>

      {/* Upload DropZone when no file loaded */}
      {!file ? (
        <DropZone
          onFilesDrop={handleFileSelect}
          accept="image/*,.heic,.heif,.tiff,.tif,.bmp"
          title="Drop image here to convert to WebP"
          subtitle="Supports PNG, JPEG, HEIC, TIFF, BMP, WebP, GIF"
        />
      ) : (
        <div className="space-y-6">
          {/* Top Control Panel & Reset Button */}
          <div className="p-6 bg-surface border border-border rounded-2xl shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-500">
                  <FileImage className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-text-1 truncate max-w-xs sm:max-w-md">
                    {file.name}
                  </h3>
                  {dimensions && (
                    <p className="text-xs text-text-3">
                      {dimensions.width} × {dimensions.height} px • {formatBytes(file.size)}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-text-2 bg-surface-2 hover:bg-surface-3 rounded-xl border border-border transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Change Image
              </button>
            </div>

            {/* Quality Slider & Presets */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <label className="text-sm font-medium text-text-1 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-blue-500" />
                  WebP Quality: <span className="text-blue-500 font-bold">{quality}%</span>
                </label>
                <div className="flex flex-wrap items-center gap-1.5">
                  {QUALITY_PRESETS.map((preset) => (
                    <button
                      key={preset.value}
                      onClick={() => setQuality(preset.value)}
                      className={cn(
                        "px-3 py-1 text-xs font-medium rounded-lg border transition-all",
                        quality === preset.value
                          ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                          : "bg-surface-2 text-text-2 border-border hover:border-blue-500/50"
                      )}
                    >
                      {preset.label} ({preset.value}%)
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full h-2 bg-surface-3 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={quality}
                  onChange={(e) => {
                    const val = Math.min(100, Math.max(1, Number(e.target.value)));
                    setQuality(val);
                  }}
                  className="w-16 px-2.5 py-1 text-center text-sm font-medium bg-surface-2 border border-border rounded-lg text-text-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-500">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold">Conversion Error</p>
                <p className="mt-0.5 text-red-400">{error}</p>
              </div>
            </div>
          )}

          {/* Side-by-Side Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Card: Original */}
            <div className="p-5 bg-surface border border-border rounded-2xl shadow-sm flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-text-1 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-text-3" />
                  Original Image
                </span>
                <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-surface-2 text-text-3 border border-border">
                  {file.type || file.name.split('.').pop()?.toUpperCase() || "Original"}
                </span>
              </div>

              {/* Preview Box */}
              <div className="relative flex-1 min-h-[260px] max-h-[400px] rounded-xl overflow-hidden border border-border bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] flex items-center justify-center p-4">
                {originalUrl && (
                  <img
                    src={originalUrl}
                    alt="Original Preview"
                    className="max-h-full max-w-full object-contain rounded-lg shadow-sm"
                  />
                )}
              </div>

              {/* File Info */}
              <div className="flex items-center justify-between text-xs text-text-2 pt-2 border-t border-border">
                <span>Size: <strong className="text-text-1">{formatBytes(originalSize)}</strong></span>
                {dimensions && <span>Dimensions: <strong className="text-text-1">{dimensions.width} × {dimensions.height}</strong></span>}
              </div>
            </div>

            {/* Right Card: WebP Output */}
            <div className="p-5 bg-surface border border-border rounded-2xl shadow-sm flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-text-1 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-500" />
                  WebP Output
                </span>
                {convertedBlob && (
                  <span
                    className={cn(
                      "px-2.5 py-0.5 text-xs font-semibold rounded-full flex items-center gap-1 border",
                      isSmaller
                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                    )}
                  >
                    {isSmaller ? <TrendingDown className="w-3.5 h-3.5" /> : null}
                    {isSmaller ? `${percentSaved}% Smaller` : `+${Math.abs(percentSaved)}% Size`}
                  </span>
                )}
              </div>

              {/* Preview Box */}
              <div className="relative flex-1 min-h-[260px] max-h-[400px] rounded-xl overflow-hidden border border-border bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] flex items-center justify-center p-4">
                {isProcessing && (
                  <div className="absolute inset-0 bg-surface/80 backdrop-blur-sm z-content flex flex-col items-center justify-center gap-2">
                    <RefreshCw className="w-7 h-7 text-blue-500 animate-spin" />
                    <span className="text-xs font-medium text-text-2">Converting to WebP...</span>
                  </div>
                )}
                {convertedUrl ? (
                  <img
                    src={convertedUrl}
                    alt="WebP Converted Preview"
                    className="max-h-full max-w-full object-contain rounded-lg shadow-sm"
                  />
                ) : (
                  <div className="text-center text-text-4">
                    <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-xs">WebP Preview will appear here</p>
                  </div>
                )}
              </div>

              {/* Converted Stats & Download Button */}
              <div className="space-y-3 pt-2 border-t border-border">
                <div className="flex items-center justify-between text-xs text-text-2">
                  <span>WebP Size: <strong className="text-text-1">{convertedBlob ? formatBytes(webpSize) : "—"}</strong></span>
                  <span>Target Format: <strong className="text-emerald-500">WEBP</strong></span>
                </div>

                <button
                  onClick={handleDownload}
                  disabled={!convertedUrl || isProcessing}
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all duration-150 active:scale-[0.99]"
                >
                  <Download className="w-4 h-4" />
                  Download WebP Image
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
