"use client";
import { useState, useRef } from "react";
import * as PDFLib from "pdf-lib";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";

const cat = CATEGORIES.find(c => c.id === "pdf")!;

interface ImageItem { name: string; file: File; url: string; }

export default function ImageToPdf() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [pageSize, setPageSize] = useState<"a4" | "letter" | "fit">("fit");
  const fileRef = useRef<HTMLInputElement>(null);

  const addImages = (fl: FileList | null) => {
    if (!fl) return;
    const items: ImageItem[] = Array.from(fl).map(f => ({
      name: f.name,
      file: f,
      url: URL.createObjectURL(f),
    }));
    setImages(prev => [...prev, ...items]);
  };

  const remove = (i: number) => setImages(a => a.filter((_, idx) => idx !== i));
  const moveUp = (i: number) => { if (i === 0) return; setImages(a => { const n = [...a]; [n[i-1], n[i]] = [n[i], n[i-1]]; return n; }); };
  const moveDown = (i: number) => setImages(a => { if (i >= a.length - 1) return a; const n = [...a]; [n[i], n[i+1]] = [n[i+1], n[i]]; return n; });

  const PAGE_SIZES = { a4: [595.28, 841.89], letter: [612, 792] };

  const convert = async () => {
    if (images.length === 0) { setError("Please add at least one image."); return; }
    setProcessing(true);
    setError("");
    try {
      const { PDFDocument } = PDFLib;
      const pdf = await PDFDocument.create();
      for (const item of images) {
        const bytes = await item.file.arrayBuffer();
        const mime = item.file.type;
        let img;
        if (mime === "image/png") img = await pdf.embedPng(bytes);
        else img = await pdf.embedJpg(bytes);
        const { width: iw, height: ih } = img;
        let pw = iw, ph = ih;
        if (pageSize === "a4") { [pw, ph] = PAGE_SIZES.a4; }
        else if (pageSize === "letter") { [pw, ph] = PAGE_SIZES.letter; }
        const page = pdf.addPage([pw, ph]);
        const scale = Math.min(pw / iw, ph / ih);
        const dw = iw * scale, dh = ih * scale;
        page.drawImage(img, { x: (pw - dw) / 2, y: (ph - dh) / 2, width: dw, height: dh });
      }
      const bytes = await pdf.save();
      const blob = new Blob([bytes as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "images.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      setError(e?.message || "Failed to create PDF.");
    }
    setProcessing(false);
  };

  return (
    <ToolShell title="Image to PDF" description="Convert JPG, PNG, or WebP images into a single PDF file." category={cat}>
      <div
        className="bg-surface border-2 border-dashed border-border rounded-2xl p-10 text-center cursor-pointer hover:border-blue transition-colors"
        onClick={() => fileRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); addImages(e.dataTransfer.files); }}
      >
        <div className="text-4xl mb-2">🖼️</div>
        <p className="font-semibold text-text-2">Drop images here or click to select</p>
        <p className="text-sm text-text-4 mt-1">JPG and PNG supported (WebP will be converted)</p>
        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" onChange={e => addImages(e.target.files)} />
      </div>

      {images.length > 0 && (
        <div className="bg-surface border border-border p-5 rounded-2xl shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-text-2 text-sm uppercase tracking-wider">Images ({images.length})</h2>
            <button onClick={() => setImages([])} className="text-xs text-red-500 hover:text-red-600 font-medium">Clear all</button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {images.map((img, i) => (
              <div key={i} className="relative group bg-bg border border-border rounded-xl overflow-hidden">
                <img src={img.url} alt={img.name} className="w-full h-24 object-cover" />
                <div className="p-2 flex items-center justify-between">
                  <div className="flex gap-1">
                    <button onClick={() => moveUp(i)} className="text-xs text-text-4 hover:text-blue">▲</button>
                    <button onClick={() => moveDown(i)} className="text-xs text-text-4 hover:text-blue">▼</button>
                  </div>
                  <button onClick={() => remove(i)} className="text-red-400 hover:text-red-600 text-xs font-bold">✕</button>
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
        className="w-full py-4 bg-blue text-white font-bold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
      >
        {processing ? "Creating PDF…" : `Convert ${images.length} image${images.length !== 1 ? "s" : ""} to PDF`}
      </button>
    </ToolShell>
  );
}
