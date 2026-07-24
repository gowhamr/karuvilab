"use client";

import { useState, useEffect, useRef } from "react";
import { m, AnimatePresence } from "framer-motion";
import {
  RotateCw,
  RotateCcw,
  RefreshCw,
  Download,
  Trash2,
  Palette,
  Sliders,
  ImageIcon,
  Sparkles,
  Check,
  Zap,
} from "lucide-react";
import { rotateImage, OutputFormat } from "@/src/lib/canvas-image-engine";
import { useObjectUrlManager } from "@/src/lib/hooks";
import { DropZone } from "@/components/ui/DropZone";
import { PrivacyBadge } from "@/components/system/PrivacyBadge";
import { formatError } from "@/src/lib/formatError";
import { SliderField } from "@/components/ui/SliderField";

const PRESET_ANGLES = [
  { label: "90°", value: 90 },
  { label: "180°", value: 180 },
  { label: "270°", value: 270 },
];

const PRESET_COLORS = [
  { id: "transparent", label: "Transparent", hex: "transparent" },
  { id: "white", label: "White", hex: "#ffffff" },
  { id: "black", label: "Black", hex: "#000000" },
  { id: "slate", label: "Slate", hex: "#0f172a" },
  { id: "gray", label: "Light Gray", hex: "#f1f5f9" },
];

const OUTPUT_FORMATS: { label: string; value: OutputFormat; ext: string }[] = [
  { label: "PNG", value: "image/png", ext: "png" },
  { label: "JPEG", value: "image/jpeg", ext: "jpg" },
  { label: "WebP", value: "image/webp", ext: "webp" },
];

const CHECKERBOARD_BG = {
  backgroundImage: `linear-gradient(45deg, #cbd5e1 25%, transparent 25%), 
                    linear-gradient(-45deg, #cbd5e1 25%, transparent 25%), 
                    linear-gradient(45deg, transparent 75%, #cbd5e1 75%), 
                    linear-gradient(-45deg, transparent 75%, #cbd5e1 75%)`,
  backgroundSize: "20px 20px",
  backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
};

export default function AdvancedRotateClient() {
  const { createUrl, revokeUrl } = useObjectUrlManager();

  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("image");
  const [fileSize, setFileSize] = useState<string>("");
  const [origWidth, setOrigWidth] = useState<number>(0);
  const [origHeight, setOrigHeight] = useState<number>(0);
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);

  // Rotation parameters
  const [degrees, setDegrees] = useState<number>(0);
  const [bgColor, setBgColor] = useState<string>("transparent");
  const [customColor, setCustomColor] = useState<string>("#4f46e5");
  const [isCustomColor, setIsCustomColor] = useState<boolean>(false);
  const [format, setFormat] = useState<OutputFormat>("image/png");
  const [quality, setQuality] = useState<number>(92);

  // Output states
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultSize, setResultSize] = useState<string>("");
  const [resultWidth, setResultWidth] = useState<number>(0);
  const [resultHeight, setResultHeight] = useState<number>(0);
  const [processing, setProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Handle image upload
  const handleFilesSelected = (files: File[] | FileList) => {
    const selectedFile = files instanceof FileList ? files[0] : files[0];
    if (!selectedFile) return;

    if (originalUrl) revokeUrl(originalUrl);
    if (resultUrl) revokeUrl(resultUrl);

    const url = createUrl(selectedFile);
    setOriginalUrl(url);
    setFile(selectedFile);
    setFileName(selectedFile.name.replace(/\.[^.]+$/, ""));
    setFileSize((selectedFile.size / 1024).toFixed(1) + " KB");
    setResultUrl(null);
    setError(null);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      setImageElement(img);
      setOrigWidth(img.naturalWidth);
      setOrigHeight(img.naturalHeight);
    };
    img.onerror = () => {
      setError("Failed to load image. Please try a different file.");
    };
    img.src = url;
  };

  // Re-run rotation when params change
  useEffect(() => {
    if (!imageElement) return;

    let active = true;
    setProcessing(true);

    const activeBgColor = isCustomColor ? customColor : bgColor;
    // Fall back transparent to white for JPEG
    const effectiveBgColor =
      format === "image/jpeg" && activeBgColor === "transparent"
        ? "#ffffff"
        : activeBgColor;

    const timer = setTimeout(() => {
      rotateImage(imageElement, degrees, effectiveBgColor, format, quality / 100)
        .then((blob) => {
          if (!active) return;
          const newUrl = createUrl(blob);
          if (resultUrl) revokeUrl(resultUrl);

          setResultUrl(newUrl);
          setResultSize((blob.size / 1024).toFixed(1) + " KB");

          // Calculate bounding box dimensions
          const rad = (degrees * Math.PI) / 180;
          const sin = Math.abs(Math.sin(rad));
          const cos = Math.abs(Math.cos(rad));
          const newW = Math.ceil(origWidth * cos + origHeight * sin);
          const newH = Math.ceil(origWidth * sin + origHeight * cos);
          setResultWidth(newW);
          setResultHeight(newH);

          setProcessing(false);
          setError(null);
        })
        .catch((err) => {
          if (!active) return;
          setError(formatError(err));
          setProcessing(false);
        });
    }, 40);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [imageElement, degrees, bgColor, customColor, isCustomColor, format, quality]);

  const handleResetFile = () => {
    if (originalUrl) revokeUrl(originalUrl);
    if (resultUrl) revokeUrl(resultUrl);

    setFile(null);
    setOriginalUrl(null);
    setImageElement(null);
    setResultUrl(null);
    setDegrees(0);
    setBgColor("transparent");
    setIsCustomColor(false);
    setError(null);
  };

  const handleDownload = () => {
    if (!resultUrl) return;
    const selectedFormatObj = OUTPUT_FORMATS.find((f) => f.value === format);
    const ext = selectedFormatObj ? selectedFormatObj.ext : "png";
    const link = document.createElement("a");
    link.href = resultUrl;
    link.download = `${fileName}-rotated-${degrees}deg.${ext}`;
    link.click();
  };

  const handleRotateStep = (step: number) => {
    setDegrees((prev) => (prev + step + 360) % 360);
  };

  return (
    <div className="space-y-6">
      <PrivacyBadge message="100% Private. Image rotation runs entirely inside your browser." />

      {!originalUrl ? (
        <DropZone
          onFilesSelected={handleFilesSelected}
          accept="image/*"
          title="Drop image here or click to browse"
          description="Supports PNG, JPEG, WebP, GIF, SVG and more"
          icon={<RotateCw className="w-10 h-10 text-blue" />}
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Controls Column */}
          <div className="space-y-6">
            <div className="bg-surface border border-border p-6 md:p-8 rounded-2xl shadow-sm space-y-6">
              {/* File details & Reset */}
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div className="space-y-1">
                  <h3 className="font-bold text-text truncate max-w-[220px] sm:max-w-[280px]">
                    {fileName}
                  </h3>
                  <p className="text-xs text-text-4">
                    Original: {origWidth} × {origHeight}px ({fileSize})
                  </p>
                </div>
                <button
                  onClick={handleResetFile}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-bg border border-border text-xs font-bold text-text-3 hover:text-text hover:border-blue/40 transition-colors"
                  title="Change Image"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Change</span>
                </button>
              </div>

              {/* Angle Control */}
              <div className="space-y-4">
                <SliderField
                  id="angle-slider"
                  label="Rotation Angle"
                  min={0}
                  max={360}
                  step={1}
                  value={degrees}
                  onChange={setDegrees}
                  format={(v) => `${v}°`}
                />

                {/* Quick Presets */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-text-3">
                    Quick Angle Presets
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    {PRESET_ANGLES.map((preset) => (
                      <button
                        key={preset.value}
                        onClick={() => setDegrees(preset.value)}
                        className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                          degrees === preset.value
                            ? "bg-blue text-white border-blue shadow-sm"
                            : "bg-bg text-text-3 border-border hover:border-blue/50 hover:text-text"
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                    <button
                      onClick={() => setDegrees(0)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                        degrees === 0
                          ? "bg-blue text-white border-blue shadow-sm"
                          : "bg-bg text-text-3 border-border hover:border-blue/50 hover:text-text"
                      }`}
                    >
                      Reset (0°)
                    </button>
                  </div>
                </div>

                {/* Nudge Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleRotateStep(-90)}
                    className="flex-1 py-2 px-3 bg-bg border border-border rounded-xl text-xs font-bold text-text-3 hover:text-text hover:border-blue/40 transition-all flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>-90°</span>
                  </button>
                  <button
                    onClick={() => handleRotateStep(-1)}
                    className="py-2 px-3 bg-bg border border-border rounded-xl text-xs font-bold text-text-3 hover:text-text hover:border-blue/40 transition-all"
                  >
                    -1°
                  </button>
                  <button
                    onClick={() => handleRotateStep(1)}
                    className="py-2 px-3 bg-bg border border-border rounded-xl text-xs font-bold text-text-3 hover:text-text hover:border-blue/40 transition-all"
                  >
                    +1°
                  </button>
                  <button
                    onClick={() => handleRotateStep(90)}
                    className="flex-1 py-2 px-3 bg-bg border border-border rounded-xl text-xs font-bold text-text-3 hover:text-text hover:border-blue/40 transition-all flex items-center justify-center gap-1.5"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>+90°</span>
                  </button>
                </div>
              </div>

              {/* Background Color Picker */}
              <div className="space-y-3 pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-text-3">
                    Exposed Corner Color
                  </span>
                  {format === "image/jpeg" && (
                    <span className="text-[11px] font-semibold text-amber-500">
                      JPEG uses solid background
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {PRESET_COLORS.map((c) => {
                    const isSelected = !isCustomColor && bgColor === c.hex;
                    return (
                      <button
                        key={c.id}
                        onClick={() => {
                          setIsCustomColor(false);
                          setBgColor(c.hex);
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                          isSelected
                            ? "border-blue bg-blue/10 text-blue ring-1 ring-blue"
                            : "border-border bg-bg text-text-3 hover:border-blue/40 hover:text-text"
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-border shadow-xs"
                          style={{
                            backgroundColor:
                              c.hex === "transparent" ? "#ffffff" : c.hex,
                          }}
                        />
                        <span>{c.label}</span>
                      </button>
                    );
                  })}

                  {/* Custom color picker */}
                  <label
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer transition-all ${
                      isCustomColor
                        ? "border-blue bg-blue/10 text-blue ring-1 ring-blue"
                        : "border-border bg-bg text-text-3 hover:border-blue/40 hover:text-text"
                    }`}
                  >
                    <input
                      type="color"
                      value={customColor}
                      onChange={(e) => {
                        setCustomColor(e.target.value);
                        setIsCustomColor(true);
                      }}
                      className="w-4 h-4 rounded cursor-pointer border-0 bg-transparent p-0"
                    />
                    <span>Custom</span>
                  </label>
                </div>
              </div>

              {/* Output Format & Quality */}
              <div className="space-y-4 pt-4 border-t border-border">
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-text-3">
                    Output Format
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {OUTPUT_FORMATS.map((f) => (
                      <button
                        key={f.value}
                        onClick={() => setFormat(f.value)}
                        className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                          format === f.value
                            ? "bg-blue text-white border-blue shadow-sm"
                            : "bg-bg text-text-3 border-border hover:border-blue/50 hover:text-text"
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {format !== "image/png" && (
                  <SliderField
                    id="quality-slider"
                    label="Compression Quality"
                    min={10}
                    max={100}
                    step={1}
                    value={quality}
                    onChange={setQuality}
                    format={(v) => `${v}%`}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Result / Preview Column */}
          <div className="space-y-6">
            <div className="bg-surface border border-border p-6 md:p-8 rounded-2xl shadow-sm space-y-6 flex flex-col h-full justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-text-3">
                    Rotated Preview
                  </h3>
                  {processing ? (
                    <span className="flex items-center gap-1.5 text-xs text-blue font-bold">
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      Rendering...
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-text-4">
                      {degrees}° Angle
                    </span>
                  )}
                </div>

                {error ? (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-xs font-bold text-red-600">
                    {error}
                  </div>
                ) : (
                  <div
                    className="relative w-full h-72 sm:h-80 rounded-xl border border-border overflow-hidden flex items-center justify-center p-4"
                    style={CHECKERBOARD_BG}
                  >
                    {resultUrl ? (
                      <img
                        src={resultUrl}
                        alt="Rotated result"
                        className="max-h-full max-w-full object-contain drop-shadow-md rounded transition-all duration-150"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-text-4 gap-2">
                        <RefreshCw className="w-6 h-6 animate-spin text-blue" />
                        <span className="text-xs font-bold">
                          Generating preview...
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Output Specifications */}
                {resultWidth > 0 && (
                  <div className="grid grid-cols-2 gap-3 p-4 bg-bg border border-border rounded-xl text-xs">
                    <div>
                      <span className="text-text-4 font-medium block">
                        New Canvas Dimensions
                      </span>
                      <span className="text-text font-bold">
                        {resultWidth} × {resultHeight}px
                      </span>
                    </div>
                    <div>
                      <span className="text-text-4 font-medium block">
                        Estimated File Size
                      </span>
                      <span className="text-text font-bold">
                        {resultSize || "Calculating..."}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Download Action */}
              <button
                onClick={handleDownload}
                disabled={!resultUrl || processing}
                className="w-full py-4 bg-blue text-white font-bold rounded-xl hover:opacity-95 active:scale-98 transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
              >
                <Download className="w-5 h-5" />
                <span>Download Rotated Image</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
