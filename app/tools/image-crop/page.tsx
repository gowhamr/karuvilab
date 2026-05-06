"use client";
import { useState, useRef, useEffect } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";

const cat = CATEGORIES.find(c => c.id === "image")!;

const PRESETS = [
  { label: "Free", w: 0, h: 0 },
  { label: "1:1", w: 1, h: 1 },
  { label: "4:3", w: 4, h: 3 },
  { label: "16:9", w: 16, h: 9 },
  { label: "3:4", w: 3, h: 4 },
  { label: "9:16", w: 9, h: 16 },
];

export default function ImageCrop() {
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [origW, setOrigW] = useState(0);
  const [origH, setOrigH] = useState(0);
  const [fileName, setFileName] = useState("image");
  const [cropX, setCropX] = useState(0);
  const [cropY, setCropY] = useState(0);
  const [cropW, setCropW] = useState(0);
  const [cropH, setCropH] = useState(0);
  const [preset, setPreset] = useState("Free");
  const [croppedUrl, setCroppedUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const inputClass = "w-full px-4 py-3 bg-bg border border-border rounded-xl focus:ring-2 focus:ring-blue outline-none transition-all";

  const handleFile = (file: File) => {
    const url = URL.createObjectURL(file);
    setOriginalUrl(url);
    setFileName(file.name.replace(/\.[^.]+$/, ""));
    setCroppedUrl(null);
    const img = new Image();
    img.onload = () => {
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      setOrigW(w);
      setOrigH(h);
      setCropX(0);
      setCropY(0);
      setCropW(w);
      setCropH(h);
    };
    img.src = url;
  };

  const applyPreset = (label: string) => {
    setPreset(label);
    const p = PRESETS.find(x => x.label === label)!;
    if (!origW || !origH || p.w === 0) return;
    const ratio = p.w / p.h;
    const imgRatio = origW / origH;
    let w: number, h: number;
    if (ratio > imgRatio) {
      w = origW;
      h = Math.round(origW / ratio);
    } else {
      h = origH;
      w = Math.round(origH * ratio);
    }
    const x = Math.round((origW - w) / 2);
    const y = Math.round((origH - h) / 2);
    setCropX(x);
    setCropY(y);
    setCropW(w);
    setCropH(h);
  };

  const handleCropWChange = (val: string) => {
    const w = parseInt(val) || 0;
    setCropW(w);
    const p = PRESETS.find(x => x.label === preset);
    if (p && p.w && p.h) {
      setCropH(Math.round(w * p.h / p.w));
    }
  };

  const handleCropHChange = (val: string) => {
    const h = parseInt(val) || 0;
    setCropH(h);
    const p = PRESETS.find(x => x.label === preset);
    if (p && p.w && p.h) {
      setCropW(Math.round(h * p.w / p.h));
    }
  };

  const doCrop = () => {
    if (!originalUrl || !cropW || !cropH) return;
    const canvas = document.createElement("canvas");
    canvas.width = cropW;
    canvas.height = cropH;
    const ctx = canvas.getContext("2d")!;
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
      canvas.toBlob(blob => {
        if (blob) setCroppedUrl(URL.createObjectURL(blob));
      }, "image/jpeg", 0.92);
    };
    img.src = originalUrl;
  };

  const download = () => {
    if (!croppedUrl) return;
    const a = document.createElement("a");
    a.href = croppedUrl;
    a.download = `${fileName}-cropped-${cropW}x${cropH}.jpg`;
    a.click();
  };

  // Preview overlay scale
  const previewMaxW = 400;
  const scale = origW > 0 ? Math.min(1, previewMaxW / origW) : 1;

  return (
    <ToolShell
      title="Image Crop"
      description="Crop images to exact dimensions or preset aspect ratios."
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
            <div className="text-4xl mb-2">✂️</div>
            <p className="font-semibold text-text-2">Drop image or click to select</p>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
          </div>

          {/* Image preview with crop overlay */}
          {originalUrl && origW > 0 && (
            <div className="bg-surface border border-border rounded-2xl overflow-hidden p-4">
              <div className="relative inline-block" style={{ width: origW * scale, height: origH * scale }}>
                <img src={originalUrl} alt="" style={{ width: origW * scale, height: origH * scale, display: "block" }} />
                {cropW > 0 && cropH > 0 && (
                  <div
                    className="absolute border-2 border-blue bg-blue/10"
                    style={{
                      left: cropX * scale,
                      top: cropY * scale,
                      width: cropW * scale,
                      height: cropH * scale,
                    }}
                  />
                )}
              </div>
            </div>
          )}

          {/* Preset buttons */}
          {origW > 0 && (
            <div className="flex flex-wrap gap-2">
              {PRESETS.map(p => (
                <button
                  key={p.label}
                  onClick={() => applyPreset(p.label)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${preset === p.label ? "bg-blue text-white" : "bg-bg border border-border text-text-3 hover:border-blue hover:text-blue"}`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          {origW > 0 && (
            <div className="bg-surface border border-border p-5 rounded-2xl shadow-sm space-y-4">
              <h2 className="font-bold text-text-2 text-sm uppercase tracking-wider">Crop Parameters</h2>
              <p className="text-xs text-text-4">Original: {origW} × {origH}px</p>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-text-3">X (left)</label>
                  <input type="number" className={inputClass} value={cropX} min={0} max={origW - 1} onChange={e => setCropX(Math.max(0, parseInt(e.target.value) || 0))} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-text-3">Y (top)</label>
                  <input type="number" className={inputClass} value={cropY} min={0} max={origH - 1} onChange={e => setCropY(Math.max(0, parseInt(e.target.value) || 0))} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-text-3">Width</label>
                  <input type="number" className={inputClass} value={cropW} min={1} max={origW} onChange={e => handleCropWChange(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-text-3">Height</label>
                  <input type="number" className={inputClass} value={cropH} min={1} max={origH} onChange={e => handleCropHChange(e.target.value)} />
                </div>
              </div>

              <button onClick={doCrop} className="w-full py-4 bg-blue text-white font-bold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all">
                Crop Image
              </button>
            </div>
          )}

          <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-4">
            <h2 className="font-bold text-text-2 text-sm uppercase tracking-wider">Cropped Preview</h2>
            {croppedUrl ? (
              <>
                <img src={croppedUrl} alt="Cropped" className="mx-auto max-h-64 rounded-xl object-contain border border-border" />
                <p className="text-xs text-text-4 text-center">{cropW} × {cropH}px</p>
                <button onClick={download} className="w-full py-4 bg-blue text-white font-bold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all">
                  Download Cropped Image
                </button>
              </>
            ) : (
              <div className="flex items-center justify-center h-48 border-2 border-dashed border-border rounded-xl text-text-4 text-sm">
                Crop preview will appear here
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolShell>
  );
}
