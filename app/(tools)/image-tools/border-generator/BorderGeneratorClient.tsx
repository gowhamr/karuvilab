"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { m, AnimatePresence } from "framer-motion";
import { Download, RotateCcw, Image as ImageIcon, Sparkles, AlertCircle, Check } from "lucide-react";

import { DropZone } from "@/components/ui/DropZone";
import { SliderField } from "@/components/ui/SliderField";
import { PrivacyBadge } from "@/components/system/PrivacyBadge";
import { useObjectUrlManager, useAsyncSafeState } from "@/src/lib/hooks";
import { formatError } from "@/src/lib/formatError";
import { addBorder, BorderConfig, OutputFormat } from "@/src/lib/canvas-image-engine";

const PRESET_COLORS = [
  "#000000",
  "#FFFFFF",
  "#3B82F6",
  "#EF4444",
  "#10B981",
  "#F59E0B",
  "#8B5CF6",
  "#64748B",
];

const BORDER_STYLES: { id: BorderConfig['style']; label: string }[] = [
  { id: "solid", label: "Solid" },
  { id: "dashed", label: "Dashed" },
  { id: "dotted", label: "Dotted" },
  { id: "double", label: "Double" },
];

const OUTPUT_FORMATS: { id: OutputFormat; label: string; ext: string }[] = [
  { id: "image/png", label: "PNG", ext: ".png" },
  { id: "image/jpeg", label: "JPEG", ext: ".jpg" },
  { id: "image/webp", label: "WebP", ext: ".webp" },
];

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function BorderGeneratorClient() {
  const { createUrl, revokeUrl } = useObjectUrlManager();

  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);
  const [rawFileName, setRawFileName] = useState<string>("");
  const [origDimensions, setOrigDimensions] = useState<{ width: number; height: number } | null>(null);

  // Border parameters
  const [borderWidth, setBorderWidth] = useState<number>(20);
  const [borderColor, setBorderColor] = useState<string>("#000000");
  const [borderStyle, setBorderStyle] = useState<BorderConfig['style']>("solid");
  const [borderRadius, setBorderRadius] = useState<number>(0);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("image/png");

  // Output state
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useAsyncSafeState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const prevResultUrlRef = useRef<string | null>(null);

  const handleFilesSelected = useCallback((files: FileList | File[]) => {
    const file = files[0];
    if (!file) return;

    if (originalUrl) revokeUrl(originalUrl);
    if (resultUrl) revokeUrl(resultUrl);

    setError(null);
    setResultUrl(null);
    setResultBlob(null);

    const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
    setRawFileName(nameWithoutExt);

    const url = createUrl(file);
    setOriginalUrl(url);

    const img = new Image();
    
    img.onload = () => {
      setImageElement(img);
      setOrigDimensions({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      setError("Failed to process the uploaded image.");
    };
    img.src = url;
  }, [createUrl, revokeUrl, originalUrl, resultUrl]);

  // Live render generator
  useEffect(() => {
    if (!imageElement) return;

    let isCancelled = false;
    setIsProcessing(true);

    const timer = setTimeout(async () => {
      try {
        const config: BorderConfig = {
          width: borderWidth,
          color: borderColor,
          style: borderStyle,
          radius: borderRadius,
        };

        const blob = await addBorder(imageElement, config, outputFormat, 0.92);
        if (isCancelled) return;

        const newUrl = createUrl(blob);
        if (prevResultUrlRef.current) {
          revokeUrl(prevResultUrlRef.current);
        }
        prevResultUrlRef.current = newUrl;

        setResultUrl(newUrl);
        setResultBlob(blob);
        setError(null);
      } catch (err) {
        if (!isCancelled) {
          setError(formatError(err));
        }
      } finally {
        if (!isCancelled) {
          setIsProcessing(false);
        }
      }
    }, 100);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [imageElement, borderWidth, borderColor, borderStyle, borderRadius, outputFormat, createUrl, revokeUrl, setIsProcessing]);

  const handleDownload = () => {
    if (!resultUrl) return;
    const currentFmt = OUTPUT_FORMATS.find((f) => f.id === outputFormat);
    const ext = currentFmt?.ext || ".png";
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = `${rawFileName || "image"}-bordered${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleReset = () => {
    if (originalUrl) revokeUrl(originalUrl);
    if (resultUrl) revokeUrl(resultUrl);
    if (prevResultUrlRef.current) revokeUrl(prevResultUrlRef.current);

    prevResultUrlRef.current = null;
    setImageElement(null);
    setOriginalUrl(null);
    setResultUrl(null);
    setResultBlob(null);
    setOrigDimensions(null);
    setError(null);
    setRawFileName("");
  };

  const finalDimensions = origDimensions
    ? {
        width: origDimensions.width + borderWidth * 2,
        height: origDimensions.height + borderWidth * 2,
      }
    : null;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Privacy Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black tracking-tight text-text">Decorative Border Generator</h2>
          <p className="text-sm text-text-4">Add custom borders, colors, styles, and rounded frames locally.</p>
        </div>
        <PrivacyBadge />
      </div>

      {!originalUrl ? (
        <div className="space-y-6">
          <DropZone
            onFilesSelected={handleFilesSelected}
            accept="image/*"
            title="Drop image here to add borders"
            description="Supports PNG, JPEG, WebP, GIF, and BMP"
            icon={<ImageIcon className="w-10 h-10 text-blue" />}
          />
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-12 items-start">
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-surface border border-border p-6 rounded-3xl space-y-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-text-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue" />
                  Border Settings
                </h3>
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-text-3 hover:text-text bg-bg border border-border rounded-xl transition-colors"
                  title="Change image"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Change File
                </button>
              </div>

              {/* Width Slider */}
              <SliderField
                id="border-width-slider"
                label="Border Width"
                min={1}
                max={100}
                value={borderWidth}
                onChange={setBorderWidth}
                format={(v) => `${v}px`}
              />

              {/* Color Picker */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-widest text-text-2 block">
                  Border Color
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setBorderColor(c)}
                      className={`w-8 h-8 rounded-full border border-border flex items-center justify-center transition-transform ${
                        borderColor.toLowerCase() === c.toLowerCase() ? "scale-110 ring-2 ring-blue ring-offset-2 ring-offset-surface" : "hover:scale-105"
                      }`}
                      style={{ backgroundColor: c }}
                      aria-label={`Select color ${c}`}
                    >
                      {borderColor.toLowerCase() === c.toLowerCase() && (
                        <Check className={`w-4 h-4 ${c.toLowerCase() === "#ffffff" ? "text-black" : "text-white"}`} />
                      )}
                    </button>
                  ))}

                  <div className="flex items-center gap-2 ml-auto">
                    <input
                      type="color"
                      value={borderColor}
                      onChange={(e) => setBorderColor(e.target.value)}
                      className="w-9 h-9 rounded-xl cursor-pointer border border-border bg-surface p-0.5"
                      aria-label="Custom color picker"
                    />
                    <input
                      type="text"
                      value={borderColor}
                      onChange={(e) => setBorderColor(e.target.value)}
                      className="w-24 bg-bg border border-border rounded-xl px-2.5 py-1.5 text-xs font-mono font-bold text-text uppercase text-center"
                      maxLength={7}
                    />
                  </div>
                </div>
              </div>

              {/* Style Selector */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-widest text-text-2 block">
                  Border Style
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {BORDER_STYLES.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setBorderStyle(style.id)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold capitalize transition-all border ${
                        borderStyle === style.id
                          ? "bg-blue text-white border-blue shadow-sm"
                          : "bg-bg text-text-3 border-border hover:border-blue/50 hover:text-text"
                      }`}
                    >
                      {style.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Radius Slider */}
              <SliderField
                id="border-radius-slider"
                label="Border Radius"
                min={0}
                max={100}
                value={borderRadius}
                onChange={setBorderRadius}
                format={(v) => `${v}px`}
              />

              {/* Output Format */}
              <div className="space-y-3 pt-2 border-t border-border">
                <label className="text-xs font-bold uppercase tracking-widest text-text-2 block">
                  Output Format
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {OUTPUT_FORMATS.map((fmt) => (
                    <button
                      key={fmt.id}
                      onClick={() => setOutputFormat(fmt.id)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                        outputFormat === fmt.id
                          ? "bg-blue text-white border-blue shadow-sm"
                          : "bg-bg text-text-3 border-border hover:border-blue/50 hover:text-text"
                      }`}
                    >
                      {fmt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Preview & Output Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-surface border border-border p-6 rounded-3xl space-y-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-text-2">
                  Live Preview
                </h3>
                {isProcessing && (
                  <span className="text-xs font-semibold text-blue animate-pulse flex items-center gap-1.5">
                    Rendering border…
                  </span>
                )}
              </div>

              {error && (
                <div className="flex items-center gap-2 p-4 text-xs font-semibold text-error bg-error/5 border border-error/20 rounded-2xl">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Image Preview Canvas Box */}
              <div className="relative min-h-[300px] max-h-[500px] flex items-center justify-center p-6 bg-bg border border-border rounded-2xl overflow-hidden checkerboard-bg">
                {resultUrl ? (
                  <m.img
                    key={resultUrl}
                    initial={{ opacity: 0.8, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    src={resultUrl}
                    alt="Bordered preview"
                    className="max-h-[440px] max-w-full object-contain drop-shadow-md rounded-lg"
                  />
                ) : (
                  <div className="text-center text-text-4 text-xs font-bold uppercase tracking-wider space-y-2">
                    <ImageIcon className="w-8 h-8 mx-auto opacity-40 animate-pulse" />
                    <p>Generating preview...</p>
                  </div>
                )}
              </div>

              {/* Metadata Info */}
              {finalDimensions && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-bg border border-border rounded-2xl text-xs font-medium">
                  <div>
                    <span className="text-text-4 block uppercase text-[10px] font-bold tracking-wider">Original</span>
                    <span className="text-text font-bold">{origDimensions?.width} × {origDimensions?.height} px</span>
                  </div>
                  <div>
                    <span className="text-text-4 block uppercase text-[10px] font-bold tracking-wider">Output Size</span>
                    <span className="text-text font-bold">{finalDimensions.width} × {finalDimensions.height} px</span>
                  </div>
                  {resultBlob && (
                    <div className="col-span-2 sm:col-span-1">
                      <span className="text-text-4 block uppercase text-[10px] font-bold tracking-wider">File Size</span>
                      <span className="text-text font-bold">{formatFileSize(resultBlob.size)}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={handleDownload}
                  disabled={!resultUrl || isProcessing}
                  className="w-full py-4 bg-blue text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100 shadow-md shadow-blue/10"
                >
                  <Download className="w-5 h-5" />
                  Download Bordered Image
                </button>

                <button
                  onClick={handleReset}
                  className="w-full py-3 bg-bg border border-border text-text-3 font-bold rounded-xl hover:text-text hover:bg-surface-2 transition-all flex items-center justify-center gap-2 text-xs"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset / Choose Different Image
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
