"use client";

import { useState, useCallback, useRef } from "react";
import { flipImage, FlipDirection, OutputFormat } from "@/src/lib/canvas-image-engine";
import { useObjectUrlManager, useAsyncSafeState } from "@/src/lib/hooks";
import { DropZone } from "@/components/ui/DropZone";
import { PrivacyBadge } from "@/components/system/PrivacyBadge";
import { formatError } from "@/src/lib/formatError";
import { m, AnimatePresence } from "framer-motion";
import {
  Download,
  FlipHorizontal,
  FlipVertical,
  RefreshCw,
  RotateCcw,
  Sparkles,
  AlertCircle,
  FileImage,
  Loader2,
} from "lucide-react";

const DIRECTION_OPTIONS: { label: string; value: FlipDirection; icon: React.ComponentType<{ className?: string }> }[] = [
  { label: "Horizontal", value: "horizontal", icon: FlipHorizontal },
  { label: "Vertical", value: "vertical", icon: FlipVertical },
  { label: "Both", value: "both", icon: RefreshCw },
];

const FORMAT_OPTIONS: { label: string; value: OutputFormat; ext: string }[] = [
  { label: "PNG", value: "image/png", ext: "png" },
  { label: "JPEG", value: "image/jpeg", ext: "jpg" },
  { label: "WebP", value: "image/webp", ext: "webp" },
];

export default function ImageFlipClient() {
  const { createUrl, revokeUrl } = useObjectUrlManager();
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [flippedUrl, setFlippedUrl] = useState<string | null>(null);
  const [flipDirection, setFlipDirection] = useState<FlipDirection>("horizontal");
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("image/png");
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [flippedSize, setFlippedSize] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useAsyncSafeState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const imgRef = useRef<HTMLImageElement | null>(null);

  const processFlip = useCallback(
    async (imgElement: HTMLImageElement, direction: FlipDirection, format: OutputFormat) => {
      setIsProcessing(true);
      setErrorMsg(null);

      try {
        const blob = await flipImage(imgElement, direction, format, 0.92);
        const url = createUrl(blob);

        setFlippedUrl((prevUrl) => {
          if (prevUrl) revokeUrl(prevUrl);
          return url;
        });
        setFlippedSize(blob.size);
      } catch (err) {
        setErrorMsg(formatError(err));
      } finally {
        setIsProcessing(false);
      }
    },
    [createUrl, revokeUrl, setIsProcessing]
  );

  const handleFilesSelected = useCallback(
    (files: FileList | File[]) => {
      const selectedFile = files instanceof FileList ? files[0] : files[0];
      if (!selectedFile) return;

      if (!selectedFile.type.startsWith("image/")) {
        setErrorMsg("Please upload a valid image file.");
        return;
      }

      setErrorMsg(null);
      if (originalUrl) revokeUrl(originalUrl);
      if (flippedUrl) revokeUrl(flippedUrl);

      const url = createUrl(selectedFile);
      setFile(selectedFile);
      setOriginalUrl(url);
      setOriginalSize(selectedFile.size);
      setFlippedUrl(null);

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        imgRef.current = img;
        setDimensions({ width: img.naturalWidth, height: img.naturalHeight });
        processFlip(img, flipDirection, outputFormat);
      };
      img.onerror = (err) => {
        setErrorMsg(formatError(err || "Failed to load image."));
      };
      img.src = url;
    },
    [createUrl, revokeUrl, originalUrl, flippedUrl, flipDirection, outputFormat, processFlip]
  );

  const handleDirectionChange = (newDir: FlipDirection) => {
    setFlipDirection(newDir);
    if (imgRef.current) {
      processFlip(imgRef.current, newDir, outputFormat);
    }
  };

  const handleFormatChange = (newFormat: OutputFormat) => {
    setOutputFormat(newFormat);
    if (imgRef.current) {
      processFlip(imgRef.current, flipDirection, newFormat);
    }
  };

  const handleReset = () => {
    if (originalUrl) revokeUrl(originalUrl);
    if (flippedUrl) revokeUrl(flippedUrl);
    imgRef.current = null;
    setFile(null);
    setOriginalUrl(null);
    setFlippedUrl(null);
    setDimensions(null);
    setOriginalSize(0);
    setFlippedSize(0);
    setErrorMsg(null);
  };

  const handleDownload = () => {
    if (!flippedUrl || !file) return;
    const formatConfig = FORMAT_OPTIONS.find((f) => f.value === outputFormat) || FORMAT_OPTIONS[0];
    const baseName = file.name.replace(/\.[^.]+$/, "");
    const downloadName = `${baseName}-flipped-${flipDirection}${formatConfig?.ext || '.png'}`;

    const a = document.createElement("a");
    a.href = flippedUrl;
    a.download = downloadName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Header Info & Privacy Badge */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-black text-text tracking-tight flex items-center gap-2">
            <FlipHorizontal className="w-5 h-5 text-blue" />
            Image Transformation & Mirroring
          </h2>
          <p className="text-xs text-text-4 font-medium">
            Flip images horizontally, vertically, or both with full client-side privacy.
          </p>
        </div>
        <PrivacyBadge />
      </div>

      {/* Upload Zone when no image loaded */}
      {!originalUrl && (
        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <DropZone
            onFilesSelected={handleFilesSelected}
            accept="image/*"
            title="Drop image here or click to browse"
            description="Supports PNG, JPEG, WebP, GIF, SVG"
            icon={<FlipHorizontal className="w-10 h-10 text-blue" />}
            className="p-12 border-dashed border-2 border-border hover:border-blue/50 transition-colors"
          />
        </m.div>
      )}

      {/* Error Message Alert */}
      <AnimatePresence>
        {errorMsg && (
          <m.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-3 p-4 bg-error/10 border border-error/20 rounded-2xl text-error text-xs font-semibold"
          >
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMsg}</span>
          </m.div>
        )}
      </AnimatePresence>

      {/* Main Workspace when image is loaded */}
      {originalUrl && (
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Top Controls Toolbar */}
          <div className="bg-surface border border-border p-6 rounded-3xl shadow-sm space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Flip Direction Options */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-text-3 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue" />
                  Flip Direction
                </label>
                <div className="grid grid-cols-3 gap-2 bg-bg p-1 rounded-2xl border border-border">
                  {DIRECTION_OPTIONS.map((opt) => {
                    const IconComponent = opt.icon;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => handleDirectionChange(opt.value)}
                        disabled={isProcessing}
                        className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                          flipDirection === opt.value
                            ? "bg-blue text-white shadow-sm"
                            : "text-text-3 hover:text-text hover:bg-surface"
                        }`}
                      >
                        <IconComponent className="w-4 h-4 shrink-0" />
                        <span>{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Output Format Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-text-3">
                  Output Format
                </label>
                <div className="grid grid-cols-3 gap-2 bg-bg p-1 rounded-2xl border border-border">
                  {FORMAT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleFormatChange(opt.value)}
                      disabled={isProcessing}
                      className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        outputFormat === opt.value
                          ? "bg-blue text-white shadow-sm"
                          : "text-text-3 hover:text-text hover:bg-surface"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border">
              <div className="text-xs text-text-4 font-medium flex items-center gap-2">
                <FileImage className="w-4 h-4 text-text-3" />
                <span>{file?.name}</span>
                {dimensions && (
                  <span className="bg-bg px-2 py-0.5 rounded-md border border-border text-[11px]">
                    {dimensions.width} &times; {dimensions.height} px
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={handleReset}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 bg-bg hover:bg-surface border border-border text-text-3 font-bold rounded-xl text-xs transition-all hover:text-text"
                >
                  <RotateCcw className="w-4 h-4" />
                  Change File
                </button>

                <button
                  onClick={handleDownload}
                  disabled={!flippedUrl || isProcessing}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 bg-blue hover:bg-blue/90 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-blue/10 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-102 active:scale-98"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Download Flipped Image
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Live Preview Cards Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Original Image Card */}
            <div className="bg-surface border border-border p-5 rounded-3xl space-y-4 shadow-sm flex flex-col">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-text-3">
                  Original
                </span>
                <span className="text-xs text-text-4 font-medium bg-bg px-2.5 py-1 rounded-full border border-border">
                  {formatFileSize(originalSize)}
                </span>
              </div>
              <div className="flex-1 min-h-[240px] flex items-center justify-center bg-bg/50 border border-border/50 rounded-2xl p-4 overflow-hidden relative">
                <img
                  src={originalUrl}
                  alt="Original preview"
                  className="max-h-[360px] w-auto max-w-full object-contain rounded-lg shadow-sm"
                />
              </div>
            </div>

            {/* Flipped Result Card */}
            <div className="bg-surface border border-border p-5 rounded-3xl space-y-4 shadow-sm flex flex-col">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-blue flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Flipped Result ({flipDirection})
                </span>
                {flippedSize > 0 && (
                  <span className="text-xs text-text-4 font-medium bg-bg px-2.5 py-1 rounded-full border border-border">
                    {formatFileSize(flippedSize)}
                  </span>
                )}
              </div>
              <div className="flex-1 min-h-[240px] flex items-center justify-center bg-bg/50 border border-border/50 rounded-2xl p-4 overflow-hidden relative">
                {isProcessing ? (
                  <div className="flex flex-col items-center gap-3 text-text-4 text-xs font-medium py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-blue" />
                    <span>Flipping image...</span>
                  </div>
                ) : flippedUrl ? (
                  <img
                    src={flippedUrl}
                    alt="Flipped preview"
                    className="max-h-[360px] w-auto max-w-full object-contain rounded-lg shadow-sm"
                  />
                ) : (
                  <div className="text-xs text-text-4 font-medium">No preview available</div>
                )}
              </div>
            </div>
          </div>
        </m.div>
      )}
    </div>
  );
}
