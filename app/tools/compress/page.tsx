"use client";
import { useState, useRef } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";

const cat = CATEGORIES.find(c => c.id === "image")!;

interface CompressedImage {
  name: string;
  originalSize: number;
  compressedSize: number;
  originalUrl: string;
  compressedUrl: string;
  blob: Blob;
}

function fmtSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

export default function ImageCompressor() {
  const [quality, setQuality] = useState(80);
  const [format, setFormat] = useState<"image/jpeg" | "image/png" | "image/webp">("image/jpeg");
  const [results, setResults] = useState<CompressedImage[]>([]);
  const [processing, setProcessing] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const compressImage = async (file: File): Promise<CompressedImage> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const originalUrl = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          blob => {
            if (!blob) return reject(new Error("Failed to compress"));
            const compressedUrl = URL.createObjectURL(blob);
            const ext = format === "image/jpeg" ? ".jpg" : format === "image/webp" ? ".webp" : ".png";
            const name = file.name.replace(/\.[^.]+$/, "") + ext;
            resolve({
              name,
              originalSize: file.size,
              compressedSize: blob.size,
              originalUrl,
              compressedUrl,
              blob,
            });
          },
          format,
          quality / 100
        );
      };
      img.onerror = reject;
      img.src = originalUrl;
    });
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setProcessing(true);
    setResults([]);
    const arr = Array.from(files);
    const out: CompressedImage[] = [];
    for (const file of arr) {
      try {
        const r = await compressImage(file);
        out.push(r);
      } catch {}
    }
    setResults(out);
    setProcessing(false);
  };

  const download = (item: CompressedImage) => {
    const a = document.createElement("a");
    a.href = item.compressedUrl;
    a.download = item.name;
    a.click();
  };

  return (
    <ToolShell
      title="Image Compressor"
      description="Compress images in your browser using canvas — no upload needed."
      category={cat}
    >
      {/* Drop zone */}
      <div
        className="bg-surface border-2 border-dashed border-border rounded-2xl p-10 text-center cursor-pointer hover:border-blue transition-colors"
        onClick={() => fileInput.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
      >
        <div className="text-4xl mb-3">🖼️</div>
        <p className="font-semibold text-text-2">Drop images here or click to select</p>
        <p className="text-sm text-text-4 mt-1">Supports JPG, PNG, WebP</p>
        <input ref={fileInput} type="file" accept="image/*" multiple className="hidden" onChange={e => handleFiles(e.target.files)} />
      </div>

      {/* Options */}
      <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm">
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Quality</label>
              <span className="text-sm font-mono font-bold text-blue">{quality}%</span>
            </div>
            <input type="range" min={1} max={100} value={quality} onChange={e => setQuality(Number(e.target.value))} className="w-full" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Output Format</label>
            <select
              className="w-full px-4 py-3 bg-bg border border-border rounded-xl focus:ring-2 focus:ring-blue outline-none transition-all"
              value={format}
              onChange={e => setFormat(e.target.value as typeof format)}
            >
              <option value="image/jpeg">JPEG</option>
              <option value="image/png">PNG</option>
              <option value="image/webp">WebP</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => fileInput.current?.click()}
              className="w-full py-3 bg-blue text-white font-bold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all text-sm"
            >
              {processing ? "Compressing…" : "Select Files"}
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          {results.map((item, i) => {
            const saved = Math.round((1 - item.compressedSize / item.originalSize) * 100);
            return (
              <div key={i} className="bg-surface border border-border p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row gap-5">
                <div className="flex gap-4 flex-1">
                  <img src={item.compressedUrl} alt={item.name} className="w-20 h-20 object-cover rounded-xl flex-shrink-0" />
                  <div className="flex-1 min-w-0 space-y-1">
                    <p className="font-semibold truncate text-sm">{item.name}</p>
                    <div className="flex flex-wrap gap-3 text-xs">
                      <span className="text-text-3">Original: <strong>{fmtSize(item.originalSize)}</strong></span>
                      <span className="text-text-3">Compressed: <strong>{fmtSize(item.compressedSize)}</strong></span>
                      <span className={saved > 0 ? "text-green-500 font-bold" : "text-red-500 font-bold"}>
                        {saved > 0 ? `-${saved}% saved` : `+${Math.abs(saved)}% larger`}
                      </span>
                    </div>
                    <div className="w-full bg-bg rounded-full h-2 mt-2">
                      <div className="h-2 rounded-full bg-green-500 transition-all" style={{ width: `${Math.min(100, item.compressedSize / item.originalSize * 100)}%` }} />
                    </div>
                  </div>
                </div>
                <button onClick={() => download(item)} className="px-5 py-2 bg-blue text-white font-bold rounded-xl text-sm hover:opacity-90 self-start sm:self-center flex-shrink-0">
                  Download
                </button>
              </div>
            );
          })}
        </div>
      )}
    </ToolShell>
  );
}
