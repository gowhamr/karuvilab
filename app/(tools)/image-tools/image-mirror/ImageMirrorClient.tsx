"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { OutputFormat } from "@/src/lib/canvas-image-engine";
import { mirrorImage } from "@/src/lib/canvas-worker-client";
import { useObjectUrlManager, useAsyncSafeState } from "@/src/lib/hooks";
import { DropZone } from "@/components/ui/DropZone";
import { PrivacyBadge } from "@/components/system/PrivacyBadge";
import { formatError } from "@/src/lib/formatError";
import { m, AnimatePresence } from "framer-motion";
import {
  Download,
  FlipHorizontal,
  RotateCcw,
  Sparkles,
  AlertCircle,
  FileImage,
  Loader2,
} from "lucide-react";

const FORMAT_OPTIONS: { label: string; value: OutputFormat; ext: string }[] = [
  { label: "PNG", value: "image/png", ext: "png" },
  { label: "JPEG", value: "image/jpeg", ext: "jpg" },
  { label: "WebP", value: "image/webp", ext: "webp" },
];

export default function ImageMirrorClient() {
  const { createUrl, revokeUrl } = useObjectUrlManager();
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [mirroredUrl, setMirroredUrl] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [mirroredSize, setMirroredSize] = useState<number>(0);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("image/png");
  const [isProcessing, setIsProcessing] = useAsyncSafeState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const imgRef = useRef<HTMLImageElement | null>(null);

  const processMirror = useCallback(
    async (imgElement: HTMLImageElement, format: OutputFormat) => {
      setIsProcessing(true);
      setErrorMsg(null);

      try {
        const blob = await mirrorImage(imgElement, format, 0.92);
        const url = createUrl(blob);

        if (mirroredUrl) {
          revokeUrl(mirroredUrl);
        }

        setMirroredUrl(url);
        setMirroredSize(blob.size);
      } catch (err) {
        setErrorMsg(formatError(err));
      } finally {
        setIsProcessing(false);
      }
    },
    [createUrl, revokeUrl, mirroredUrl, setIsProcessing]
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
      if (mirroredUrl) revokeUrl(mirroredUrl);

      const url = createUrl(selectedFile);
      setFile(selectedFile);
      setOriginalUrl(url);
      setOriginalSize(selectedFile.size);
      setMirroredUrl(null);

      const img = new Image();
      
      img.onload = () => {
        imgRef.current = img;
        setDimensions({ width: img.naturalWidth, height: img.naturalHeight });
        processMirror(img, outputFormat);
      };
      img.onerror = (err) => {
        setErrorMsg(formatError(err || "Failed to load image."));
      };
      img.src = url;
    },
    [createUrl, revokeUrl, originalUrl, mirroredUrl, outputFormat, processMirror]
  );

  const handleFormatChange = (newFormat: OutputFormat) => {
    setOutputFormat(newFormat);
    if (imgRef.current) {
      processMirror(imgRef.current, newFormat);
    }
  };

  const handleReset = () => {
    if (originalUrl) revokeUrl(originalUrl);
    if (mirroredUrl) revokeUrl(mirroredUrl);
    imgRef.current = null;
    setFile(null);
    setOriginalUrl(null);
    setMirroredUrl(null);
    setDimensions(null);
    setOriginalSize(0);
    setMirroredSize(0);
    setErrorMsg(null);
  };

  const handleDownload = () => {
    if (!mirroredUrl || !file) return;
    const formatConfig = FORMAT_OPTIONS.find((f) => f.value === outputFormat) || FORMAT_OPTIONS[0];
    const baseName = file.name.replace(/\.[^.]+$/, "");
    const downloadName = `${baseName}-mirrored${formatConfig?.ext || '.png'}`;

    const a = document.createElement("a");
    a.href = mirroredUrl;
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
            Horizontal Mirror Reflection
          </h2>
          <p className="text-xs text-text-muted font-medium">
            Instantly flip images horizontally with pixel precision. 100% private.
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
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              {/* Output Format Selector */}
              <div className="space-y-2 w-full md:w-auto">
                <label className="text-xs font-bold uppercase tracking-widest text-text-3">
                  Output Format
                </label>
                <div className="flex gap-2 bg-bg p-1 rounded-2xl border border-border">
                  {FORMAT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleFormatChange(opt.value)}
                      disabled={isProcessing}
                      className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        outputFormat === opt.value
                          ? "bg-blue text-white shadow-sm"
                          : "text-text-3 hover:text-text"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
                <button
                  onClick={handleReset}
                  className="flex items-center justify-center gap-2 px-5 py-3 bg-bg hover:bg-surface border border-border text-text-3 font-bold rounded-xl text-xs transition-all hover:text-text"
                >
                  <RotateCcw className="w-4 h-4" />
                  Change File
                </button>

                <button
                  onClick={handleDownload}
                  disabled={!mirroredUrl || isProcessing}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-blue hover:bg-blue/90 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-blue/10 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-102 active:scale-98"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Download Mirrored Image
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Side-by-Side Comparison */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Original Card */}
            <div className="bg-surface border border-border p-6 rounded-3xl shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-text-3 flex items-center gap-2">
                    <FileImage className="w-4 h-4 text-text-muted" />
                    Original Image
                  </span>
                  {dimensions && (
                    <span className="text-xs font-semibold text-text-muted">
                      {dimensions.width} × {dimensions.height} px
                    </span>
                  )}
                </div>

                <div className="relative bg-bg border border-border rounded-2xl p-4 min-h-[300px] flex items-center justify-center overflow-hidden">
                  <img
                    src={originalUrl}
                    alt="Original"
                    className="max-h-80 w-auto max-w-full object-contain rounded-lg"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-text-muted pt-2 border-t border-border/50">
                <span className="truncate max-w-[200px]" title={file?.name}>
                  {file?.name}
                </span>
                <span className="font-bold">{formatFileSize(originalSize)}</span>
              </div>
            </div>

            {/* Mirrored Card */}
            <div className="bg-surface border border-border p-6 rounded-3xl shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-blue flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue" />
                    Mirrored Preview
                  </span>
                  {dimensions && (
                    <span className="text-xs font-semibold text-text-muted">
                      {dimensions.width} × {dimensions.height} px
                    </span>
                  )}
                </div>

                <div className="relative bg-bg border border-border rounded-2xl p-4 min-h-[300px] flex items-center justify-center overflow-hidden">
                  {isProcessing && (
                    <div className="absolute inset-0 bg-surface/80 backdrop-blur-xs flex flex-col items-center justify-center gap-2 z-content">
                      <Loader2 className="w-8 h-8 text-blue animate-spin" />
                      <span className="text-xs font-bold text-text-3">Reflecting Image...</span>
                    </div>
                  )}

                  {mirroredUrl ? (
                    <img
                      src={mirroredUrl}
                      alt="Mirrored"
                      className="max-h-80 w-auto max-w-full object-contain rounded-lg"
                    />
                  ) : (
                    <div className="text-text-muted text-xs font-semibold">
                      Generating mirror preview...
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-text-muted pt-2 border-t border-border/50">
                <span>Reflected horizontally</span>
                <span className="font-bold text-text-2">{formatFileSize(mirroredSize)}</span>
              </div>
            </div>
          </div>
        </m.div>
      )}
    </div>
  );
}
