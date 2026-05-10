"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";

const cat = CATEGORIES.find(c => c.id === "image")!;

function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

function colorDiff(r1: number, g1: number, b1: number, r2: number, g2: number, b2: number): number {
  return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
}

export default function BgRemoverClient() {
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [tolerance, setTolerance] = useState(40);
  const [fileName, setFileName] = useState("image");
  const [processing, setProcessing] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  const handleFile = (file: File) => {
    const url = URL.createObjectURL(file);
    setOriginalUrl(url);
    setResultUrl(null);
    setFileName(file.name.replace(/\.[^.]+$/, ""));
  };

  const removeBackground = useCallback(() => {
    if (!originalUrl) return;
    setProcessing(true);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const [tr, tg, tb] = hexToRgb(bgColor);

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2];
        const diff = colorDiff(r, g, b, tr, tg, tb);
        if (diff <= tolerance) {
          data[i + 3] = 0;
        } else if (diff <= tolerance * 1.5) {
          const alpha = Math.round(((diff - tolerance) / (tolerance * 0.5)) * 255);
          data[i + 3] = Math.min(data[i + 3], alpha);
        }
      }

      ctx.putImageData(imageData, 0, 0);
      canvas.toBlob(blob => {
        if (blob) setResultUrl(URL.createObjectURL(blob));
        setProcessing(false);
      }, "image/png");
    };
    img.src = originalUrl;
  }, [originalUrl, bgColor, tolerance]);

  const download = () => {
    if (!resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = `${fileName}-no-bg.png`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-blue/10 border border-blue/30 rounded-2xl text-sm space-y-1">
        <p className="font-semibold">Simple Mode (Color Threshold)</p>
        <p className="text-text-3">This tool uses canvas pixel color matching to remove backgrounds. Select the background color and adjust tolerance. For complex/gradient backgrounds, AI-powered removal (requires <code className="text-xs bg-bg px-1 rounded">@imgly/background-removal</code>) is not included in offline mode.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
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
                <div className="text-4xl mb-2">🎨</div>
                <p className="font-semibold text-text-2">Drop image here</p>
                <p className="text-xs text-text-4 mt-1">Best for solid/white backgrounds</p>
              </>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
          </div>

          <div className="bg-surface border border-border p-5 rounded-2xl shadow-sm space-y-4">
            <h2 className="font-bold text-text-2 text-sm uppercase tracking-wider">Settings</h2>

            <div className="space-y-2">
              <label className="text-sm font-medium">Background Color to Remove</label>
              <div className="flex items-center gap-3">
                <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-12 h-12 rounded-xl border border-border cursor-pointer" />
                <input
                  type="text"
                  className="flex-1 px-4 py-3 bg-bg border border-border rounded-xl focus:ring-2 focus:ring-blue outline-none transition-all font-mono text-sm"
                  value={bgColor}
                  onChange={e => setBgColor(e.target.value)}
                />
              </div>
              <p className="text-xs text-text-4">Click the color swatch to pick, or type a hex value. Common: #ffffff (white), #000000 (black).</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Tolerance</label>
                <span className="text-sm font-mono font-bold text-blue">{tolerance}</span>
              </div>
              <input type="range" min={0} max={255} value={tolerance} onChange={e => setTolerance(Number(e.target.value))} className="w-full" />
              <p className="text-xs text-text-4">Higher tolerance removes more colors. Start at 40 for solid backgrounds.</p>
            </div>

            <button
              onClick={removeBackground}
              disabled={!originalUrl || processing}
              className="w-full py-4 bg-blue text-white font-bold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
            >
              {processing ? "Processing…" : "Remove Background"}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-4">
            <h2 className="font-bold text-text-2 text-sm uppercase tracking-wider">Result (PNG with transparency)</h2>
            {resultUrl ? (
              <>
                <div className="bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2216%22%20height%3D%2216%22%20xmlns%3D%22http://www.w3.org/2000/svg%22%3E%3Crect%20width%3D%228%22%20height%3D%228%22%20fill%3D%22%23ccc%22/%3E%3Crect%20x%3D%228%22%20y%3D%228%22%20width%3D%228%22%20height%3D%228%22%20fill%3D%22%23ccc%22/%3E%3C/svg%3E')] rounded-xl overflow-hidden">
                  <img src={resultUrl} alt="Result" className="mx-auto max-h-64 object-contain" />
                </div>
                <button onClick={download} className="w-full py-4 bg-blue text-white font-bold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all">
                  Download PNG
                </button>
              </>
            ) : (
              <div className="flex items-center justify-center h-64 border-2 border-dashed border-border rounded-xl text-text-4 text-sm text-center p-6">
                Result with transparent background will appear here
              </div>
            )}
          </div>

          <div className="bg-surface border border-border p-5 rounded-2xl shadow-sm space-y-3">
            <h2 className="font-bold text-text-2 text-sm uppercase tracking-wider">Tips</h2>
            <ul className="text-sm text-text-3 space-y-2">
              <li className="flex gap-2"><span className="text-blue flex-shrink-0">•</span>Works best on images with a uniform, solid background color.</li>
              <li className="flex gap-2"><span className="text-blue flex-shrink-0">•</span>For white backgrounds: set color to #ffffff, tolerance 30–50.</li>
              <li className="flex gap-2"><span className="text-blue flex-shrink-0">•</span>Increase tolerance if edges still have background artifacts.</li>
              <li className="flex gap-2"><span className="text-blue flex-shrink-0">•</span>The result is saved as PNG to preserve transparency.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
