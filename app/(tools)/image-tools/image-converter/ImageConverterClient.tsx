"use client";
import { useState, useRef } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { useObjectUrlManager } from "@/src/lib/hooks";

const cat = CATEGORIES.find(c => c.id === "image")!;
type Format = "image/jpeg" | "image/png" | "image/webp" | "image/bmp";

const FORMATS: { label: string; value: Format; ext: string; lossy: boolean }[] = [
  { label: "JPEG", value: "image/jpeg", ext: ".jpg", lossy: true },
  { label: "PNG", value: "image/png", ext: ".png", lossy: false },
  { label: "WebP", value: "image/webp", ext: ".webp", lossy: true },
  { label: "BMP", value: "image/bmp", ext: ".bmp", lossy: false },
];

interface ConvertedFile {
  name: string;
  originalSize: number;
  newSize: number;
  url: string;
  blob: Blob;
}

function fmtSize(b: number) {
  if (b < 1024) return b + " B";
  if (b < 1048576) return (b / 1024).toFixed(1) + " KB";
  return (b / 1048576).toFixed(2) + " MB";
}

export default function ImageConverterClient() {
  const { createUrl, revokeUrl } = useObjectUrlManager();
  const [targetFmt, setTargetFmt] = useState<Format>("image/webp");
  const [quality, setQuality] = useState(85);
  const [results, setResults] = useState<ConvertedFile[]>([]);
  const [processing, setProcessing] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  const fmtInfo = FORMATS.find(f => f.value === targetFmt)!;

  const convert = async (files: FileList | null) => {
    if (!files?.length) return;
    setProcessing(true);
    
    // Revoke previous URLs
    results.forEach(res => revokeUrl(res.url));
    setResults([]);

    const out: ConvertedFile[] = [];
    for (const file of Array.from(files)) {
      const tempUrl = createUrl(file);
      try {
        const img = await new Promise<HTMLImageElement>((res, rej) => {
          const i = new Image();
          i.onload = () => res(i);
          i.onerror = rej;
          i.src = tempUrl;
        });
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        canvas.getContext("2d")!.drawImage(img, 0, 0);
        revokeUrl(tempUrl);

        const blob = await new Promise<Blob>((res, rej) =>
          canvas.toBlob(b => b ? res(b) : rej(new Error("fail")), targetFmt, quality / 100)
        );
        out.push({
          name: file.name.replace(/\.[^.]+$/, "") + fmtInfo.ext,
          originalSize: file.size,
          newSize: blob.size,
          url: createUrl(blob),
          blob,
        });
      } catch {
        revokeUrl(tempUrl);
      }
    }
    setResults(out);
    setProcessing(false);
  };

  const dl = (item: ConvertedFile) => {
    const a = document.createElement("a");
    a.href = item.url;
    a.download = item.name;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div
        className="bg-surface border-2 border-dashed border-border rounded-2xl p-10 text-center cursor-pointer hover:border-blue transition-colors"
        onClick={() => ref.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); convert(e.dataTransfer.files); }}
      >
        <div className="text-4xl mb-3">🔄</div>
        <p className="font-semibold text-text-2">Drop images or click to select</p>
        <p className="text-sm text-text-4 mt-1">Supports JPG, PNG, WebP, BMP</p>
        <input ref={ref} type="file" accept="image/*" multiple className="hidden" onChange={e => convert(e.target.files)} />
      </div>

      <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm">
        <div className="grid gap-6 sm:grid-cols-3 items-end">
          <div className="space-y-2">
            <label className="text-sm font-medium">Convert To</label>
            <div className="flex gap-2 flex-wrap">
              {FORMATS.map(f => (
                <button
                  key={f.value}
                  onClick={() => setTargetFmt(f.value)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${targetFmt === f.value ? "bg-blue text-white" : "bg-bg border border-border text-text-3 hover:border-blue hover:text-blue"}`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          {fmtInfo.lossy && (
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Quality</label>
                <span className="text-sm font-mono font-bold text-blue">{quality}%</span>
              </div>
              <input type="range" min={1} max={100} value={quality} onChange={e => setQuality(Number(e.target.value))} className="w-full" />
            </div>
          )}
          <button
            onClick={() => ref.current?.click()}
            className="w-full py-3 bg-blue text-white font-bold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all text-sm"
          >
            {processing ? "Converting…" : "Select Files"}
          </button>
        </div>
      </div>

      {results.length > 0 && (
        <div className="space-y-3">
          {results.map((item, i) => {
            const diff = item.newSize - item.originalSize;
            const pct = Math.abs(Math.round((diff / item.originalSize) * 100));
            return (
              <div key={i} className="bg-surface border border-border p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <img src={item.url} alt="" className="w-16 h-16 object-cover rounded-xl flex-shrink-0" />
                <div className="flex-1 min-w-0 space-y-1">
                  <p className="font-semibold text-sm truncate">{item.name}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-text-3">
                    <span>Before: <strong>{fmtSize(item.originalSize)}</strong></span>
                    <span>After: <strong>{fmtSize(item.newSize)}</strong></span>
                    <span className={diff < 0 ? "text-green-500 font-bold" : "text-text-3"}>
                      {diff < 0 ? `-${pct}% smaller` : diff === 0 ? "Same size" : `+${pct}% larger`}
                    </span>
                  </div>
                </div>
                <button onClick={() => dl(item)} className="px-5 py-2 bg-blue text-white font-bold rounded-xl text-sm hover:opacity-90 flex-shrink-0">
                  Download
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
