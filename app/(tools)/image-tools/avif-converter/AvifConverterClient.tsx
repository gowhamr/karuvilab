"use client";

import { useState, useCallback, useEffect } from "react";
import { m, AnimatePresence } from "framer-motion";
import {
  Download,
  Sparkles,
  AlertTriangle,
  Loader2,
  FileImage,
  Trash2,
  Sliders,
  Info,
} from "lucide-react";
import { useObjectUrlManager, useAsyncSafeState } from "@/src/lib/hooks";
import { formatError } from "@/src/lib/formatError";
import { loadAny } from "@/src/format-utils";
import { formatFileSize } from "@/src/lib/file-utils";
import { downloadBlob, replaceExt } from "@/src/utils";
import { DropZone } from "@/components/ui/DropZone";
import { PrivacyBadge } from "@/components/system/PrivacyBadge";
import { SliderField } from "@/components/ui/SliderField";

export default function AvifConverterClient() {
  const { createUrl, revokeUrl } = useObjectUrlManager();

  // Input states
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [imageSource, setImageSource] = useState<HTMLImageElement | HTMLCanvasElement | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);

  // Configuration
  const [quality, setQuality] = useState<number>(80);

  // Result states
  const [isProcessing, setIsProcessing] = useAsyncSafeState<boolean>(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isFallback, setIsFallback] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Conversion core logic
  const processAvifConversion = useCallback(
    async (
      source: HTMLImageElement | HTMLCanvasElement,
      q: number
    ) => {
      setIsProcessing(true);
      setError(null);

      // Brief delay to allow UI spinner rendering before heavy sync operation
      await new Promise((r) => setTimeout(r, 60));

      try {
        const width = "naturalWidth" in source ? source.naturalWidth : source.width;
        const height = "naturalHeight" in source ? source.naturalHeight : source.height;

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          throw new Error("Could not create 2D canvas context.");
        }

        ctx.drawImage(source, 0, 0);

        const qualityFraction = Math.max(0.01, Math.min(1.0, q / 100));

        const blob = await new Promise<Blob | null>((resolve, reject) => {
          const timer = setTimeout(() => {
            reject(new Error("AVIF conversion timed out. Your browser may not support native AVIF encoding."));
          }, 15000);
          try {
            canvas.toBlob((b) => {
              clearTimeout(timer);
              resolve(b);
            }, "image/avif", qualityFraction);
          } catch (e) {
            clearTimeout(timer);
            reject(e);
          }
        });

        if (!blob) {
          throw new Error("Failed to encode canvas image to AVIF blob.");
        }

        const fallback = blob.type !== "image/avif";
        setIsFallback(fallback);
        setResultBlob(blob);

        const newUrl = createUrl(blob);
        setResultUrl(prev => {
          if (prev) revokeUrl(prev);
          return newUrl;
        });
      } catch (err: unknown) {
        console.error("AVIF conversion error:", err);
        setError(formatError(err));
      } finally {
        setIsProcessing(false);
      }
    },
    [createUrl, revokeUrl, setIsProcessing]
  );

  // Handle image upload via DropZone
  const handleFilesSelected = useCallback(
    async (files: FileList | File[]) => {
      const selectedFile = files[0];
      if (!selectedFile) return;

      setError(null);
      setIsProcessing(true);

      try {
        setOriginalUrl(prev => { if (prev) revokeUrl(prev); return createUrl(selectedFile); });
        setFile(selectedFile);
        setResultBlob(null);
        setResultUrl(prev => { if (prev) revokeUrl(prev); return null; });
        setIsFallback(false);

        // Load image using loadAny from format-utils
        const loaded = await loadAny(selectedFile);
        setImageSource(loaded);

        const w = "naturalWidth" in loaded ? loaded.naturalWidth : loaded.width;
        const h = "naturalHeight" in loaded ? loaded.naturalHeight : loaded.height;
        setDimensions({ width: w, height: h });

        await processAvifConversion(loaded, quality);
      } catch (err: unknown) {
        console.error("Failed to load image file:", err);
        setError(formatError(err));
      } finally {
        setIsProcessing(false);
      }
    },
    [createUrl, revokeUrl, quality, processAvifConversion, setIsProcessing]
  );

  // Debounced re-conversion on quality changes when an image source exists
  useEffect(() => {
    if (!imageSource || !file) return;

    const timer = setTimeout(() => {
      processAvifConversion(imageSource, quality);
    }, 350);

    return () => clearTimeout(timer);
  }, [quality, imageSource, file, processAvifConversion]);

  // Reset tool state
  const handleReset = useCallback(() => {
    if (originalUrl) revokeUrl(originalUrl);
    if (resultUrl) revokeUrl(resultUrl);

    setFile(null);
    setImageSource(null);
    setOriginalUrl(null);
    setResultBlob(null);
    setResultUrl(null);
    setDimensions(null);
    setIsFallback(false);
    setError(null);
  }, [originalUrl, resultUrl, revokeUrl]);

  // Download converted file
  const handleDownload = useCallback(() => {
    if (!resultBlob || !file) return;

    const outputName = replaceExt(file.name, "avif");
    if (resultUrl) {
      downloadBlob(resultUrl, outputName);
    } else {
      const tempUrl = createUrl(resultBlob);
      downloadBlob(tempUrl, outputName);
      revokeUrl(tempUrl);
    }
  }, [resultBlob, file, resultUrl, createUrl, revokeUrl]);

  const originalSize = file ? file.size : 0;
  const convertedSize = resultBlob ? resultBlob.size : 0;
  const percentSavings =
    originalSize > 0 && convertedSize > 0
      ? ((originalSize - convertedSize) / originalSize) * 100
      : 0;

  return (
    <div className="w-full mx-auto space-y-8">
      {/* Main Container */}
      {!file ? (
        <div className="space-y-6">
          <DropZone
            onFilesSelected={handleFilesSelected}
            accept="image/*,.heic,.heif,.tiff,.tif,.bmp"
            title="Drop image to convert to AVIF"
            description="Supports PNG, JPEG, WebP, GIF, HEIC, TIFF, BMP and more"
            icon={<FileImage className="w-10 h-10 text-blue" />}
            className="border-dashed border-2 hover:border-blue/50 transition-colors py-16"
          />

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-surface border border-border p-5 rounded-2xl space-y-2">
              <div className="w-8 h-8 rounded-xl bg-blue/10 flex items-center justify-center text-blue font-bold text-sm">
                ⚡
              </div>
              <h3 className="font-bold text-sm text-text">Next-Gen Compression</h3>
              <p className="text-xs text-text-muted font-medium leading-relaxed">
                AVIF provides superior compression efficiency compared to PNG, JPEG, and even WebP.
              </p>
            </div>

            <div className="bg-surface border border-border p-5 rounded-2xl space-y-2">
              <div className="w-8 h-8 rounded-xl bg-blue/10 flex items-center justify-center text-blue font-bold text-sm">
                🛡️
              </div>
              <h3 className="font-bold text-sm text-text">Zero Server Upload</h3>
              <p className="text-xs text-text-muted font-medium leading-relaxed">
                Your images are read and processed entirely in your browser memory for maximum privacy.
              </p>
            </div>

            <div className="bg-surface border border-border p-5 rounded-2xl space-y-2">
              <div className="w-8 h-8 rounded-xl bg-blue/10 flex items-center justify-center text-blue font-bold text-sm">
                🎯
              </div>
              <h3 className="font-bold text-sm text-text">Quality Precision</h3>
              <p className="text-xs text-text-muted font-medium leading-relaxed">
                Fine-tune quality settings to balance crystal-clear fidelity and file size reduction.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* File Toolbar */}
          <div className="bg-surface border border-border p-5 rounded-3xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue/10 flex items-center justify-center text-blue shrink-0">
                <FileImage className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-sm text-text truncate max-w-xs sm:max-w-md">
                  {file.name}
                </p>
                <div className="flex items-center gap-3 text-xs text-text-muted font-medium mt-0.5">
                  <span>{formatFileSize(file.size)}</span>
                  {dimensions && (
                    <>
                      <span>•</span>
                      <span>
                        {dimensions.width} × {dimensions.height} px
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 bg-surface-2 hover:bg-border border border-border rounded-xl text-xs font-bold text-text-3 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                Change Image
              </button>
            </div>
          </div>

          {/* Quality Controls */}
          <div className="bg-surface border border-border p-6 rounded-3xl space-y-4">
            <div className="flex items-center gap-2 text-text font-bold text-sm">
              <Sliders className="w-4 h-4 text-blue" />
              <span>Encoding Controls</span>
            </div>

            <SliderField
              id="avif-quality"
              label="Quality Level"
              min={1}
              max={100}
              step={1}
              value={quality}
              onChange={setQuality}
              format={(v) => `${v}%`}
            />

            <p className="text-xs text-text-muted font-medium flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-blue shrink-0" />
              AVIF encoding is computationally intensive. Higher quality settings may take longer to process.
            </p>
          </div>

          {/* Fallback Warning Alert */}
          <AnimatePresence>
            {isFallback && (
              <m.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-amber-500/10 border border-amber-500/30 p-5 rounded-2xl flex items-start gap-3 text-amber-600 dark:text-amber-400"
              >
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs font-medium">
                  <p className="font-bold text-sm">AVIF Encoding Not Supported</p>
                  <p>
                    Your current browser does not natively support exporting images to the AVIF format via HTML Canvas.
                    The converted output fell back to <strong>PNG format</strong>.
                  </p>
                  <p className="opacity-80">
                    To export native AVIF files, please use Chrome, Edge, or Firefox 93+.
                  </p>
                </div>
              </m.div>
            )}
          </AnimatePresence>

          {/* Error Message */}
          {error && (
            <div className="bg-error/10 border border-error/30 p-5 rounded-2xl flex items-center gap-3 text-error text-xs font-bold">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Side by Side Preview & Comparison */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Original Card */}
            <div className="bg-surface border border-border p-5 rounded-3xl space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-text-muted">
                    Original Image
                  </span>
                  <span className="text-xs font-bold px-2.5 py-1 bg-surface-2 rounded-lg text-text-3 border border-border">
                    {formatFileSize(originalSize)}
                  </span>
                </div>

                <div className="relative rounded-2xl overflow-hidden border border-border bg-surface-2 min-h-64 flex items-center justify-center p-4">
                  {originalUrl && (
                    <img
                      src={originalUrl}
                      alt="Original input"
                      className="max-h-72 w-full object-contain rounded-lg"
                    />
                  )}
                </div>
              </div>

              <div className="text-xs text-text-muted font-medium flex items-center justify-between pt-2">
                <span>Format: {file.type || "Image"}</span>
                {dimensions && (
                  <span>
                    {dimensions.width} × {dimensions.height}
                  </span>
                )}
              </div>
            </div>

            {/* AVIF Converted Card */}
            <div className="bg-surface border border-border p-5 rounded-3xl space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-blue flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    {isFallback ? "Fallback (PNG)" : "AVIF Output"}
                  </span>

                  {resultBlob && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2.5 py-1 bg-blue/10 text-blue rounded-lg border border-blue/20">
                        {formatFileSize(convertedSize)}
                      </span>
                      {percentSavings > 0 ? (
                        <span className="text-xs font-extrabold px-2.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg border border-emerald-500/20">
                          -{percentSavings.toFixed(1)}%
                        </span>
                      ) : percentSavings < 0 ? (
                        <span className="text-xs font-extrabold px-2.5 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-lg border border-amber-500/20">
                          +{Math.abs(percentSavings).toFixed(1)}%
                        </span>
                      ) : null}
                    </div>
                  )}
                </div>

                <div className="relative rounded-2xl overflow-hidden border border-border bg-surface-2 min-h-64 flex items-center justify-center p-4">
                  {isProcessing ? (
                    <div className="flex flex-col items-center justify-center gap-3 text-center p-8">
                      <Loader2 className="w-8 h-8 text-blue animate-spin" />
                      <div className="space-y-1">
                        <p className="font-bold text-sm text-text">Encoding to AVIF...</p>
                        <p className="text-xs text-text-muted font-medium">
                          Processing frame data in browser memory
                        </p>
                      </div>
                    </div>
                  ) : resultUrl ? (
                    <img
                      src={resultUrl}
                      alt="AVIF Converted preview"
                      className="max-h-72 w-full object-contain rounded-lg"
                    />
                  ) : (
                    <div className="text-xs text-text-muted font-medium">
                      No result generated yet.
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  onClick={handleDownload}
                  disabled={!resultBlob || isProcessing}
                  className="w-full py-3 px-5 bg-blue hover:bg-blue-hover disabled:opacity-50 text-white rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue/20 cursor-pointer disabled:cursor-not-allowed"
                >
                  <Download className="w-4 h-4" />
                  <span>Download {isFallback ? "Converted Image" : "AVIF Image"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
