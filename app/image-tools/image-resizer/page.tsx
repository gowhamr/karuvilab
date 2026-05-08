"use client";
import { useState, useRef, useEffect } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";

const cat = CATEGORIES.find(c => c.id === "image")!;
type Mode = "fit" | "fill" | "stretch";

export default function ImageResizer() {
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [origW, setOrigW] = useState(0);
  const [origH, setOrigH] = useState(0);
  const [fileName, setFileName] = useState("image");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [lockRatio, setLockRatio] = useState(true);
  const [mode, setMode] = useState<Mode>("fit");
  const [resizedUrl, setResizedUrl] = useState<string | null>(null);
  const [resizedSize, setResizedSize] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const inputClass = "w-full px-4 py-3 bg-bg border border-border rounded-xl focus:ring-2 focus:ring-blue outline-none transition-all";

  const handleFile = (file: File) => {
    const url = URL.createObjectURL(file);
    setOriginalUrl(url);
    setFileName(file.name.replace(/\.[^.]+$/, ""));
    setResizedUrl(null);
    const img = new Image();
    img.onload = () => {
      setOrigW(img.naturalWidth);
      setOrigH(img.naturalHeight);
      setWidth(String(img.naturalWidth));
      setHeight(String(img.naturalHeight));
    };
    img.src = url;
  };

  const handleWidth = (val: string) => {
    setWidth(val);
    if (lockRatio && origW && origH && val) {
      const w = parseInt(val);
      if (!isNaN(w)) setHeight(String(Math.round(w * origH / origW)));
    }
  };

  const handleHeight = (val: string) => {
    setHeight(val);
    if (lockRatio && origW && origH && val) {
      const h = parseInt(val);
      if (!isNaN(h)) setWidth(String(Math.round(h * origW / origH)));
    }
  };

  const resize = () => {
    if (!originalUrl) return;
    const w = parseInt(width);
    const h = parseInt(height);
    if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) return;

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d")!;
    const img = new Image();
    img.onload = () => {
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, w, h);
      if (mode === "stretch") {
        ctx.drawImage(img, 0, 0, w, h);
      } else if (mode === "fill") {
        const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
        const sw = img.naturalWidth * scale;
        const sh = img.naturalHeight * scale;
        ctx.drawImage(img, (w - sw) / 2, (h - sh) / 2, sw, sh);
      } else {
        const scale = Math.min(w / img.naturalWidth, h / img.naturalHeight);
        const sw = img.naturalWidth * scale;
        const sh = img.naturalHeight * scale;
        ctx.drawImage(img, (w - sw) / 2, (h - sh) / 2, sw, sh);
      }
      canvas.toBlob(blob => {
        if (!blob) return;
        setResizedUrl(URL.createObjectURL(blob));
        setResizedSize((blob.size / 1024).toFixed(1) + " KB");
      }, "image/jpeg", 0.92);
    };
    img.src = originalUrl;
  };

  const download = () => {
    if (!resizedUrl) return;
    const a = document.createElement("a");
    a.href = resizedUrl;
    a.download = `${fileName}-${width}x${height}.jpg`;
    a.click();
  };

  return (
    <ToolShell
      title="Image Resizer"
      description="Resize images to exact dimensions with aspect ratio lock."
      category={cat}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          {/* Upload */}
          <div
            className="bg-surface border-2 border-dashed border-border rounded-2xl p-8 text-center cursor-pointer hover:border-blue transition-colors"
            onClick={() => fileRef.current?.click()}
            onDragOver={e => e.preventDefault()}
            onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }}
          >
            {originalUrl ? (
              <img src={originalUrl} alt="Original" className="mx-auto max-h-48 rounded-xl object-contain" />
            ) : (
              <>
                <div className="text-4xl mb-2">📐</div>
                <p className="font-semibold text-text-2">Drop image here or click to select</p>
                <p className="text-xs text-text-4 mt-1">{origW > 0 ? `${origW} × ${origH}px` : "Original dimensions will appear here"}</p>
              </>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
          </div>

          {origW > 0 && (
            <p className="text-xs text-text-4 text-center">Original: {origW} × {origH}px</p>
          )}

          {/* Options */}
          <div className="bg-surface border border-border p-5 rounded-2xl shadow-sm space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">Width (px)</label>
                <input type="number" className={inputClass} value={width} onChange={e => handleWidth(e.target.value)} placeholder="800" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Height (px)</label>
                <input type="number" className={inputClass} value={height} onChange={e => handleHeight(e.target.value)} placeholder="600" />
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input type="checkbox" checked={lockRatio} onChange={e => setLockRatio(e.target.checked)} className="rounded" />
              Lock aspect ratio
            </label>

            <div className="space-y-1">
              <label className="text-sm font-medium">Resize Mode</label>
              <div className="flex gap-2">
                {(["fit","fill","stretch"] as Mode[]).map(m => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold capitalize transition-colors ${mode === m ? "bg-blue text-white" : "bg-bg border border-border text-text-3 hover:border-blue hover:text-blue"}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
              <p className="text-xs text-text-4">
                {mode === "fit" ? "Scale to fit within dimensions, maintaining ratio." : mode === "fill" ? "Fill dimensions, cropping excess to maintain ratio." : "Stretch to exact dimensions (may distort)."}
              </p>
            </div>

            <button onClick={resize} disabled={!originalUrl} className="w-full py-4 bg-blue text-white font-bold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100">
              Resize Image
            </button>
          </div>
        </div>

        {/* Output */}
        <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-4">
          <h2 className="font-bold text-text-2 text-sm uppercase tracking-wider">Result</h2>
          {resizedUrl ? (
            <>
              <img src={resizedUrl} alt="Resized" className="mx-auto max-h-64 rounded-xl object-contain border border-border" />
              <div className="flex items-center justify-between text-sm text-text-3">
                <span>{width} × {height}px</span>
                <span>{resizedSize}</span>
              </div>
              <button onClick={download} className="w-full py-4 bg-blue text-white font-bold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all">
                Download Resized Image
              </button>
            </>
          ) : (
            <div className="flex items-center justify-center h-64 text-text-4 text-sm border-2 border-dashed border-border rounded-xl">
              Resized image will appear here
            </div>
          )}
        </div>
      </div>
    </ToolShell>
  );
}
