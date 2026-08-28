"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useObjectUrlManager, useAsyncSafeState } from "@/src/lib/hooks";
import { DropZone } from "@/components/ui/DropZone";
import { PrivacyBadge } from "@/components/system/PrivacyBadge";
import { formatError } from "@/src/lib/formatError";
import { loadAny, encodeBmp } from "@/src/format-utils";
import { formatBytes, downloadBlob, replaceExt } from "@/src/utils";
import { cn } from "@/src/lib/utils";
import { ToolWorkspace } from "@/components/ui/ToolWorkspace";
import {
  Download,
  RefreshCw,
  ImageIcon,
  Sparkles,
  AlertCircle,
  Info,
  FileImage,
  HardDrive,
  Check,
  Palette,
  AlertTriangle,
} from "lucide-react";

const BG_COLOR_OPTIONS = [
  { label: "White Fill", value: "#FFFFFF", desc: "Recommended for transparent images" },
  { label: "Black Fill", value: "#000000", desc: "Black background" },
  { label: "None (Canvas Alpha)", value: "transparent", desc: "Direct alpha to 24-bit RGB" },
];

export default function BmpConverterClient() {
  const { createUrl, revokeUrl } = useObjectUrlManager();

  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [loadedElement, setLoadedElement] = useState<HTMLImageElement | HTMLCanvasElement | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);

  const [bgColor, setBgColor] = useState<string>("#FFFFFF");
  const [isProcessing, setIsProcessing] = useAsyncSafeState<boolean>(false);
  const [convertedBlob, setConvertedBlob] = useState<Blob | null>(null);
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const convertedUrlRef = useRef<string | null>(null);

  // Update converted blob and create URL safely
  const updateConvertedUrl = useCallback(
    (blob: Blob) => {
      if (convertedUrlRef.current) {
        revokeUrl(convertedUrlRef.current);
      }
      const url = createUrl(blob);
      convertedUrlRef.current = url;
      setConvertedUrl(url);
      setConvertedBlob(blob);
    },
    [createUrl, revokeUrl]
  );

  // Perform actual BMP encoding
  const performConversion = useCallback(
    async (
      element: HTMLImageElement | HTMLCanvasElement,
      background: string
    ) => {
      setIsProcessing(true);
      setError(null);

      // Brief timeout to ensure UI updates processing spinner before CPU work
      await new Promise((resolve) => setTimeout(resolve, 50));

      try {
        const width = "naturalWidth" in element ? element.naturalWidth : element.width;
        const height = "naturalHeight" in element ? element.naturalHeight : element.height;

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

        // Fill background color if requested (prevents transparent PNGs/WebPs turning black)
        if (background !== "transparent") {
          ctx.fillStyle = background;
          ctx.fillRect(0, 0, width, height);
        }

        ctx.drawImage(element, 0, 0);

        const bmpBlob = encodeBmp(canvas);
        if (!bmpBlob || bmpBlob.size === 0) {
          throw new Error("BMP encoding produced an empty file.");
        }

        updateConvertedUrl(bmpBlob);
      } catch (err: unknown) {
        console.error("BMP conversion error:", err);
        setError(formatError(err));
      } finally {
        setIsProcessing(false);
      }
    },
    [setIsProcessing, updateConvertedUrl]
  );

  // Handle file drop/upload
  const handleFileSelect = async (files: File[]) => {
    if (!files || files.length === 0) return;
    const selectedFile = files[0];
    if (!selectedFile) return;

    // Reset current outputs
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

      const w = "naturalWidth" in element ? element.naturalWidth : element.width;
      const h = "naturalHeight" in element ? element.naturalHeight : element.height;
      setDimensions({ width: w, height: h });

      await performConversion(element, bgColor);
    } catch (err: unknown) {
      console.error("Image loading error:", err);
      setError(formatError(err));
      setIsProcessing(false);
    }
  };

  // Re-run conversion when background color changes
  useEffect(() => {
    if (loadedElement) {
      performConversion(loadedElement, bgColor);
    }
  }, [bgColor, loadedElement, performConversion]);

  // Reset tool
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

  // Trigger download with .bmp extension
  const handleDownload = () => {
    if (!convertedUrl || !file) return;
    const targetFilename = replaceExt(file.name, "bmp");
    downloadBlob(convertedUrl, targetFilename);
  };

  // File size metrics & expansion calculations
  const originalSize = file?.size || 0;
  const bmpSize = convertedBlob?.size || 0;
  const isBmpLarger = bmpSize > originalSize;
  const sizeRatio = originalSize > 0 && bmpSize > 0 ? (bmpSize / originalSize).toFixed(1) : "1.0";
  const isHuge = bmpSize > 10 * 1024 * 1024; // > 10MB

  return (
    <div className="w-full space-y-8 pb-16">
      {/* Header Info & Privacy */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-1 flex items-center gap-3">
            <Sparkles className="w-7 h-7 text-blue-500" />
            BMP Converter
          </h1>
          <p className="text-sm text-text-3 mt-1">
            Convert PNG, JPEG, WebP, HEIC & TIFF images into uncompressed Windows Bitmap (BMP) format.
          </p>
        </div>
        <PrivacyBadge />
      </div>

      {/* File Upload DropZone */}
      {!file ? (
        <ToolWorkspace
          layout="stacked"
          input={
            <DropZone
              onFilesSelected={handleFileSelect}
              accept="image/*,.heic,.heif,.tiff,.tif,.bmp"
              title="Drop image here to convert to BMP"
              description="Supports PNG, JPEG, WebP, HEIC, TIFF, GIF, and more"
            />
          }
        />
      ) : (
        <ToolWorkspace
          layout="split"
          input={
            <div className="space-y-6">
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
                        {dimensions.width} × {dimensions.height} px • {formatBytes(originalSize)}
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

              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-text-1 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-text-3" />
                  Original Image
                </span>
                <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-surface-2 text-text-3 border border-border uppercase">
                  {file.name.split(".").pop() || "ORIGINAL"}
                </span>
              </div>

              {/* Preview Box */}
              <div className="relative w-full flex-1 min-h-[260px] max-h-[380px] rounded-xl overflow-hidden border border-border bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] flex items-center justify-center p-4">
                {originalUrl && (
                  <img
                    src={originalUrl}
                    alt="Original Preview"
                    className="max-h-full max-w-full object-contain rounded-lg shadow-sm"
                  />
                )}
              </div>

              {/* Specs */}
              <div className="flex items-center justify-between text-xs text-text-2 pt-2 border-t border-border">
                <span>
                  Original Size: <strong className="text-text-1">{formatBytes(originalSize)}</strong>
                </span>
                {dimensions && (
                  <span>
                    Dimensions: <strong className="text-text-1">{dimensions.width} × {dimensions.height}</strong>
                  </span>
                )}
              </div>
            </div>
          }
          optionsPanel={
            <div className="space-y-3">
              <label className="text-sm font-medium text-text-1 flex items-center gap-2">
                <Palette className="w-4 h-4 text-blue-500" />
                Background Fill (For Transparent Images)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {BG_COLOR_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setBgColor(opt.value)}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-xl border text-left text-xs transition-all",
                      bgColor === opt.value
                        ? "bg-blue-500/10 border-blue-500 text-text-1 font-medium"
                        : "bg-surface-2 border-border text-text-2 hover:border-border/80"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-4 h-4 rounded-full border border-border shrink-0"
                        style={{
                          backgroundColor:
                            opt.value === "transparent" ? "#94a3b8" : opt.value,
                        }}
                      />
                      <div>
                        <p className="font-medium text-text-1">{opt.label}</p>
                        <p className="text-[10px] text-text-3">{opt.desc}</p>
                      </div>
                    </div>
                    {bgColor === opt.value && <Check className="w-4 h-4 text-blue-500 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          }
          output={
            <div className="flex flex-col space-y-4 h-full">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-text-1 flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-blue-500" />
                  BMP Bitmap Output
                </span>
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
                  24-BIT UNCOMPRESSED BMP
                </span>
              </div>

              {/* Preview Box */}
              <div className="relative flex-1 min-h-[260px] max-h-[380px] rounded-xl overflow-hidden border border-border bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] flex items-center justify-center p-4">
                {isProcessing && (
                  <div className="absolute inset-0 bg-surface/80 backdrop-blur-sm z-content flex flex-col items-center justify-center gap-2">
                    <RefreshCw className="w-7 h-7 text-blue-500 animate-spin" />
                    <span className="text-xs font-medium text-text-2">Encoding BMP pixels...</span>
                  </div>
                )}
                {convertedUrl ? (
                  <img
                    src={convertedUrl}
                    alt="BMP Converted Output Preview"
                    className="max-h-full max-w-full object-contain rounded-lg shadow-sm"
                  />
                ) : (
                  <div className="text-center text-text-muted">
                    <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-xs">BMP Preview will appear here</p>
                  </div>
                )}
              </div>

              {/* Converted Stats & Action Button */}
              <div className="space-y-3 pt-2 border-t border-border">
                <div className="flex items-center justify-between text-xs text-text-2">
                  <span>
                    BMP File Size:{" "}
                    <strong className="text-text-1">
                      {convertedBlob ? formatBytes(bmpSize) : "—"}
                    </strong>
                  </span>
                  <span>
                    Target Extension: <strong className="text-blue-500">.bmp</strong>
                  </span>
                </div>

                <button
                  onClick={handleDownload}
                  disabled={!convertedUrl || isProcessing}
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all duration-150 active:scale-[0.99]"
                >
                  <Download className="w-4 h-4" />
                  Download BMP Image
                </button>
              </div>
            </div>
          }
          infoPanel={
            <div className="space-y-4">
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-500">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold">Conversion Error</p>
                    <p className="mt-0.5 text-red-600 dark:text-red-400">{error}</p>
                  </div>
                </div>
              )}

              {convertedBlob && (isBmpLarger || isHuge) && (
                <div
                  className={cn(
                    "p-4 rounded-xl border flex items-start gap-3 text-sm",
                    isHuge
                      ? "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400"
                      : "bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400"
                  )}
                >
                  {isHuge ? (
                    <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-amber-500" />
                  ) : (
                    <Info className="w-5 h-5 shrink-0 mt-0.5 text-blue-500" />
                  )}
                  <div className="space-y-1">
                    <p className="font-semibold flex items-center gap-2">
                      <span>Uncompressed Bitmap Output</span>
                      <span className="px-2 py-0.5 text-xs font-bold rounded bg-amber-500/20 text-amber-600 dark:text-amber-300">
                        {sizeRatio}× size of original
                      </span>
                    </p>
                    <p className="text-xs leading-relaxed opacity-90">
                      BMP stores 24-bit raw RGB pixel data without compression. At{" "}
                      <strong>
                        {dimensions?.width} × {dimensions?.height}
                      </strong>{" "}
                      pixels, this BMP file uses <strong>{formatBytes(bmpSize)}</strong>. This large size is standard for uncompressed BMP image files.
                    </p>
                  </div>
                </div>
              )}
            </div>
          }
        />
      )}
    </div>
  );
}
