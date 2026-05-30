"use client";
import { useState, useRef, useId } from "react";
import * as PDFLib from "pdf-lib";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { useObjectUrlManager } from "@/src/lib/hooks";
import { SliderField } from "@/components/ui/SliderField";

const cat = CATEGORIES.find(c => c.id === "pdf")!;

export default function WatermarkPdfClient() {
  const textId = useId();
  const colorId = useId();
  const { createUrl, revokeUrl } = useObjectUrlManager();
  const [file, setFile] = useState<File | null>(null);
  const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL");
  const [opacity, setOpacity] = useState(0.3);
  const [fontSize, setFontSize] = useState(60);
  const [color, setColor] = useState("#cc0000");
  const [angle, setAngle] = useState(45);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const inputClass = "w-full px-4 py-3 bg-bg border border-border rounded-xl focus:ring-2 focus:ring-blue outline-none transition-all";

  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    return { r, g, b };
  };

  const addWatermark = async () => {
    if (!file) { setError("Please select a PDF file."); return; }
    if (!watermarkText.trim()) { setError("Please enter watermark text."); return; }
    setProcessing(true);
    setError("");
    try {
      const { PDFDocument, rgb, degrees } = PDFLib;
      const bytes = await file.arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      const pages = doc.getPages();
      const { r, g, b } = hexToRgb(color);

      for (const page of pages) {
        const { width, height } = page.getSize();
        page.drawText(watermarkText, {
          x: width / 2 - (watermarkText.length * fontSize * 0.3),
          y: height / 2,
          size: fontSize,
          color: rgb(r, g, b),
          opacity: opacity,
          rotate: degrees(angle),
        });
      }

      const outBytes = await doc.save();
      const blob = new Blob([outBytes as any], { type: "application/pdf" });
      const url = createUrl(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name.replace(/\.pdf$/i, "") + "-watermarked.pdf";
      a.click();
      setTimeout(() => revokeUrl(url), 100);
    } catch (e: any) {
      setError(e?.message || "Failed to add watermark.");
    }
    setProcessing(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div
            className="bg-surface border-2 border-dashed border-border rounded-2xl p-8 text-center cursor-pointer hover:border-blue transition-colors"
            onClick={() => fileRef.current?.click()}
            onDragOver={e => e.preventDefault()}
            onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) setFile(f); }}
          >
            {file ? (
              <div className="space-y-1">
                <p className="font-semibold text-text-2">{file.name}</p>
                <p className="text-sm text-text-3">{(file.size / 1024).toFixed(0)} KB</p>
              </div>
            ) : (
              <>
                <div className="text-4xl mb-2">💧</div>
                <p className="font-semibold text-text-2">Drop a PDF here or click to select</p>
              </>
            )}
            <input ref={fileRef} type="file" accept=".pdf,application/pdf" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) setFile(f); }} />
          </div>

          <div className="bg-surface border border-border p-5 rounded-2xl shadow-sm space-y-4">
            <h2 className="font-bold text-text-2 text-sm uppercase tracking-wider">Watermark Settings</h2>

            <div className="space-y-1">
              <label htmlFor={textId} className="text-sm font-medium">Watermark Text</label>
              <input id={textId} type="text" className={inputClass} value={watermarkText} onChange={e => setWatermarkText(e.target.value)} placeholder="CONFIDENTIAL" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label htmlFor={colorId} className="text-sm font-medium">Color</label>
                <div className="flex items-center gap-2">
                  <input id={colorId} type="color" value={color} onChange={e => setColor(e.target.value)} className="w-10 h-10 rounded-xl border border-border cursor-pointer" />
                  <input type="text" className="flex-1 px-3 py-2 bg-bg border border-border rounded-xl font-mono text-sm focus:ring-2 focus:ring-blue outline-none" value={color} onChange={e => setColor(e.target.value)} />
                </div>
              </div>
              <SliderField
                id="fontSize"
                label="Font Size"
                min={20}
                max={150}
                value={fontSize}
                onChange={setFontSize}
                format={v => `${v}px`}
              />
            </div>

            <SliderField
              id="opacity"
              label="Opacity"
              min={0.05}
              max={1}
              step={0.05}
              value={opacity}
              onChange={setOpacity}
              format={v => `${Math.round(v * 100)}%`}
            />

            <SliderField
              id="rotation"
              label="Rotation"
              min={-90}
              max={90}
              value={angle}
              onChange={setAngle}
              format={v => `${v}°`}
            />
          </div>
        </div>

        {/* Preview */}
        <div className="bg-surface border border-border p-5 rounded-2xl shadow-sm space-y-4">
          <h2 className="font-bold text-text-2 text-sm uppercase tracking-wider">Preview</h2>
          <div className="bg-white dark:bg-zinc-900 border border-border rounded-xl overflow-hidden aspect-[3/4] flex items-center justify-center relative">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span
                style={{
                  fontSize: `${Math.max(14, fontSize / 3)}px`,
                  color: color,
                  opacity: opacity,
                  transform: `rotate(-${angle}deg)`,
                  fontWeight: "bold",
                  letterSpacing: "0.05em",
                  whiteSpace: "nowrap",
                }}
              >
                {watermarkText || "WATERMARK"}
              </span>
            </div>
            <div className="text-text-4 text-xs">Page preview</div>
          </div>
        </div>
      </div>

      {error && <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl text-red-600 text-sm">{error}</div>}

      <button
        onClick={addWatermark}
        disabled={!file || processing}
        className="w-full py-4 bg-blue text-white font-bold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
      >
        {processing ? "Adding watermark…" : "Add Watermark & Download"}
      </button>
    </div>
  );
}
