"use client";
import { useState, useRef } from "react";
// Removed pdf-lib import
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { useObjectUrlManager } from "@/src/lib/hooks";

import { DropZone } from "@/components/ui/DropZone";

const cat = CATEGORIES.find(c => c.id === "pdf")!;

interface ImageItem { name: string; file: File; url: string; }

export default function ImageToPdfClient() {
  const { createUrl, revokeUrl } = useObjectUrlManager();
  const [images, setImages] = useState<ImageItem[]>([]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [pageSize, setPageSize] = useState<"a4" | "letter" | "fit">("fit");

  const addImages = (fl: FileList | File[] | null) => {
    if (!fl) return;
    const items: ImageItem[] = Array.from(fl).map(f => ({
      name: f.name,
      file: f,
      url: createUrl(f),
    }));
    setImages(prev => [...prev, ...items]);
  };

  const remove = (i: number) => {
    const item = images[i];
    if (item) revokeUrl(item.url);
    setImages(a => a.filter((_, idx) => idx !== i));
  };
  
  const clearAll = () => {
    images.forEach(img => revokeUrl(img.url));
    setImages([]);
  };

  const moveUp = (i: number) => { if (i === 0) return; setImages(a => { const n = [...a]; const t = n[i-1]!; n[i-1] = n[i]!; n[i] = t; return n; }); };
  const moveDown = (i: number) => setImages(a => { if (i >= a.length - 1) return a; const n = [...a]; const t = n[i]!; n[i] = n[i+1]!; n[i+1] = t; return n; });

  const PAGE_SIZES: Record<string, [number, number]> = { a4: [595.28, 841.89], letter: [612, 792] };

  const convert = async () => {
    if (images.length === 0) { setError("Please add at least one image."); return; }
    setProcessing(true);
    setError("");
    try {
      const items = await Promise.all(images.map(async (item) => ({
        buffer: await item.file.arrayBuffer(),
        mime: item.file.type
      })));

      const { workerManager } = await import("@/src/workers/manager");
      const bytes = await workerManager.convertImagesToPdf(
        items,
        pageSize,
        (progress) => {
          // Progress reporting can be added here
        }
      );
      
      const blob = new Blob([bytes as any], { type: "application/pdf" });
      const url = createUrl(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "images.pdf";
      a.click();
      revokeUrl(url);
    } catch (e: any) {
      setError(e?.message || "Failed to create PDF.");
    }
    setProcessing(false);
  };

  return (
    <div className="space-y-6">
      <DropZone
        onFilesSelected={addImages}
        accept="image/jpeg,image/png,image/webp"
        multiple
        title="Drop images here or click to select"
        description="JPG and PNG supported (WebP will be converted)"
        icon={<div className="text-4xl">🖼️</div>}
      />

      {images.length > 0 && (
        <div className="bg-surface border border-border p-5 rounded-2xl shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-text-2 text-sm uppercase tracking-wider">Images ({images.length})</h2>
            <button onClick={clearAll} className="text-xs text-red-500 hover:text-red-600 font-medium">Clear all</button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {images.map((img, i) => (
              <div key={i} className="relative group bg-bg border border-border rounded-xl overflow-hidden">
                <img src={img.url} alt={img.name} className="w-full h-24 object-cover" />
                <div className="p-2 flex items-center justify-between">
                  <div className="flex gap-1">
                    <button aria-label="Move item up" onClick={() => moveUp(i)} className="text-xs text-text-4 hover:text-blue">▲</button>
                    <button aria-label="Move item down" onClick={() => moveDown(i)} className="text-xs text-text-4 hover:text-blue">▼</button>
                  </div>
                  <button aria-label="Remove item" onClick={() => remove(i)} className="text-red-400 hover:text-red-600 text-xs font-bold">✕</button>
                </div>
                <div className="absolute top-1 left-1 bg-blue text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{i + 1}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-surface border border-border p-5 rounded-2xl shadow-sm">
        <label className="text-sm font-medium">Page Size</label>
        <div className="flex gap-2 mt-2">
          {(["fit","a4","letter"] as const).map(s => (
            <button key={s} onClick={() => setPageSize(s)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${pageSize === s ? "bg-blue text-white" : "bg-bg border border-border text-text-3 hover:border-blue hover:text-blue"}`}>
              {s === "fit" ? "Fit Image" : s.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl text-red-600 text-sm">{error}</div>}

      <button
        onClick={convert}
        disabled={images.length === 0 || processing}
        className="w-full py-4 bg-blue text-white font-bold rounded-xl hover:scale-102 active:scale-98 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
      >
        {processing ? "Creating PDF…" : `Convert ${images.length} image${images.length !== 1 ? "s" : ""} to PDF`}
      </button>
    </div>
  );
}
