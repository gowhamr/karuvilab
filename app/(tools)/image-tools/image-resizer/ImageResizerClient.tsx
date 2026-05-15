"use client";
import { useState, useRef, useEffect } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { useObjectUrlManager } from "@/src/lib/hooks";

import { DropZone } from "@/components/ui/DropZone";
import { Checkbox } from "@/components/ui/Checkbox";
import { ToolInput } from "@/components/ui/ToolInput";

const cat = CATEGORIES.find(c => c.id === "image")!;
type Mode = "fit" | "fill" | "stretch";

export default function ImageResizerClient() {
  const { createUrl, revokeUrl } = useObjectUrlManager();
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

  const handleFile = (file: File) => {
    if (originalUrl) revokeUrl(originalUrl);
    const url = createUrl(file);
    setOriginalUrl(url);
    setFileName(file.name.replace(/\.[^.]+$/, ""));
    if (resizedUrl) revokeUrl(resizedUrl);
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
        if (resizedUrl) revokeUrl(resizedUrl);
        setResizedUrl(createUrl(blob));
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
    
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <DropZone
            onFilesSelected={(files) => {
              const f = files instanceof FileList ? files[0] : files[0];
              if (f) handleFile(f);
            }}
            accept="image/*"
            title={originalUrl ? fileName : "Drop image or click to select"}
            description={originalUrl ? `${origW} × ${origH}px` : "Original dimensions will appear here"}
            icon={originalUrl ? (
              <img src={originalUrl} alt="Original" className="mx-auto max-h-48 rounded-xl object-contain" />
            ) : (
              <div className="text-4xl">📐</div>
            )}
          />

          {origW > 0 && (
            <p className="text-xs text-text-4 text-center">Original: {origW} × {origH}px</p>
          )}

          {/* Options */}
          <div className="bg-surface border border-border p-6 md:p-8 rounded-[32px] shadow-sm space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <ToolInput
                label="Width (px)"
                type="number"
                value={width}
                onChange={handleWidth}
                placeholder="800"
              />
              <ToolInput
                label="Height (px)"
                type="number"
                value={height}
                onChange={handleHeight}
                placeholder="600"
              />
            </div>

            <Checkbox
              label="Lock aspect ratio"
              checked={lockRatio}
              onChange={e => setLockRatio(e.target.checked)}
            />

            <div className="space-y-3">
              <label className="text-sm font-bold text-text-2">Resize Mode</label>
              <div className="flex gap-2">
                {(["fit","fill","stretch"] as Mode[]).map(m => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`flex-1 py-3 rounded-xl text-xs font-bold capitalize transition-colors ${mode === m ? "bg-blue text-white" : "bg-bg border border-border text-text-3 hover:border-blue hover:text-blue"}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
              <p className="text-[10px] font-bold text-text-4 uppercase tracking-wider">
                {mode === "fit" ? "Scale to fit within dimensions, maintaining ratio." : mode === "fill" ? "Fill dimensions, cropping excess to maintain ratio." : "Stretch to exact dimensions (may distort)."}
              </p>
            </div>

            <button onClick={resize} disabled={!originalUrl} className="w-full py-4 bg-blue text-white font-bold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100">
              Resize Image
            </button>
          </div>
        </div>

        {/* Output */}
        <div className="bg-surface border border-border p-6 md:p-8 rounded-[32px] shadow-sm space-y-6">
          <h2 className="font-black text-text-2 text-sm uppercase tracking-widest">Result</h2>
          {resizedUrl ? (
            <>
              <img src={resizedUrl} alt="Resized" className="mx-auto max-h-64 rounded-xl object-contain border border-border" />
              <div className="flex items-center justify-between text-xs font-bold text-text-4 uppercase tracking-wider">
                <span>{width} × {height}px</span>
                <span>{resizedSize}</span>
              </div>
              <button onClick={download} className="w-full py-4 bg-blue text-white font-bold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all">
                Download Resized Image
              </button>
            </>
          ) : (
            <div className="flex items-center justify-center h-64 text-text-4 text-xs font-bold uppercase tracking-widest border-2 border-dashed border-border rounded-2xl">
              Resized image will appear here
            </div>
          )}
        </div>
      </div>
    
  );
}
