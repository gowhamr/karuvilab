export type ImageFormat = "image/jpeg" | "image/png" | "image/webp" | "image/bmp" | "image/avif";

export interface ImageFormatOption {
  label: string;
  value: ImageFormat;
  ext: string;
  lossy: boolean;
}

export type ConversionPreset = "fast" | "balanced" | "high-quality";

export interface ConversionSettings {
  format: ImageFormat;
  quality: number;
  preset: ConversionPreset;
}

export const IMAGE_FORMATS: ImageFormatOption[] = [
  { label: "JPEG", value: "image/jpeg", ext: ".jpg", lossy: true },
  { label: "PNG", value: "image/png", ext: ".png", lossy: false },
  { label: "WebP", value: "image/webp", ext: ".webp", lossy: true },
  { label: "AVIF", value: "image/avif", ext: ".avif", lossy: true },
  { label: "BMP", value: "image/bmp", ext: ".bmp", lossy: false },
];

export const PRESETS: Record<ConversionPreset, { label: string; quality: number; description: string }> = {
  "fast": { label: "Fast", quality: 60, description: "Lower quality, smaller file size" },
  "balanced": { label: "Balanced", quality: 85, description: "Good balance of quality and size" },
  "high-quality": { label: "High Quality", quality: 95, description: "Maximum quality, larger file size" },
};
