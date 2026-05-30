"use client";
import { useState, useRef, useId } from "react";
import * as PDFLib from "pdf-lib";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { useObjectUrlManager } from "@/src/lib/hooks";
import { SliderField } from "@/components/ui/SliderField";

const cat = CATEGORIES.find(c => c.id === "pdf")!;

type Position = "bottom-center" | "bottom-right" | "bottom-left" | "top-center" | "top-right" | "top-left";

export default function PageNumberingClient() {
  const prefixId = useId();
  const startId = useId();
  const suffixId = useId();
  const colorId = useId();
  const { createUrl, revokeUrl } = useObjectUrlManager();
  const [file, setFile] = useState<File | null>(null);
  const [startNum, setStartNum] = useState(1);
  const [prefix, setPrefix] = useState("");
  const [suffix, setSuffix] = useState("");
  const [position, setPosition] = useState<Position>("bottom-center");
  const [fontSize, setFontSize] = useState(12);
  const [color, setColor] = useState("#333333");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const inputClass = "w-full px-4 py-3 bg-bg border border-border rounded-xl focus:ring-2 focus:ring-blue outline-none transition-all";
  const POSITIONS: Position[] = ["bottom-center","bottom-right","bottom-left","top-center","top-right","top-left"];

  const hexToRgb = (hex: string) => ({
    r: parseInt(hex.slice(1, 3), 16) / 255,
    g: parseInt(hex.slice(3, 5), 16) / 255,
    b: parseInt(hex.slice(5, 7), 16) / 255,
  });

  const addNumbers = async () => {
    if (!file) { setError("Please select a PDF file."); return; }
    setProcessing(true);
    setError("");
    try {
      const { PDFDocument, rgb } = PDFLib;
      const bytes = await file.arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      const pages = doc.getPages();
      const { r, g, b } = hexToRgb(color);
      const margin = 20;

      pages.forEach((page: any, i: number) => {
        const { width, height } = page.getSize();
        const numStr = `${prefix}${startNum + i}${suffix}`;
        const textWidth = numStr.length * fontSize * 0.5;
        let x: number, y: number;
        const isBottom = position.startsWith("bottom");
        y = isBottom ? margin : height - margin - fontSize;
        if (position.includes("center")) x = (width - textWidth) / 2;
        else if (position.includes("right")) x = width - textWidth - margin;
        else x = margin;
        page.drawText(numStr, { x, y, size: fontSize, color: rgb(r, g, b) });
      });

      const outBytes = await doc.save();
      const blob = new Blob([outBytes as any], { type: "application/pdf" });
      const url = createUrl(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name.replace(/\.pdf$/i, "") + "-numbered.pdf";
      a.click();
      revokeUrl(url);
    } catch (e: any) {
      setError(e?.message || "Failed to add page numbers.");
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
                <div className="text-4xl mb-2">📄</div>
                <p className="font-semibold text-text-2">Drop a PDF here</p>
              </>
            )}
            <input ref={fileRef} type="file" accept=".pdf,application/pdf" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) setFile(f); }} />
          </div>

          <div className="bg-surface border border-border p-5 rounded-2xl shadow-sm space-y-4">
            <h2 className="font-bold text-text-2 text-sm uppercase tracking-wider">Settings</h2>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label htmlFor={prefixId} className="text-sm font-medium">Prefix</label>
                <input id={prefixId} type="text" className={inputClass} value={prefix} onChange={e => setPrefix(e.target.value)} placeholder="Page " />
              </div>
              <div className="space-y-1">
                <label htmlFor={startId} className="text-sm font-medium">Start #</label>
                <input id={startId} type="number" className={inputClass} value={startNum} min={0} onChange={e => setStartNum(Number(e.target.value))} />
              </div>
              <div className="space-y-1">
                <label htmlFor={suffixId} className="text-sm font-medium">Suffix</label>
                <input id={suffixId} type="text" className={inputClass} value={suffix} onChange={e => setSuffix(e.target.value)} placeholder=" of N" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Position</label>
              <div className="grid grid-cols-3 gap-2">
                {POSITIONS.map(p => (
                  <button key={p} onClick={() => setPosition(p)} className={`py-2 rounded-xl text-xs font-medium capitalize transition-colors ${position === p ? "bg-blue text-white" : "bg-bg border border-border text-text-3 hover:border-blue"}`}>
                    {p.replace("-", " ")}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <SliderField
                id="fontSize"
                label="Font Size"
                min={8}
                max={24}
                value={fontSize}
                onChange={setFontSize}
                format={v => `${v}px`}
              />
              <div className="space-y-1">
                <label htmlFor={colorId} className="text-sm font-medium">Color</label>
                <div className="flex items-center gap-2">
                  <input id={colorId} type="color" value={color} onChange={e => setColor(e.target.value)} className="w-10 h-10 rounded-lg border border-border cursor-pointer" />
                  <input type="text" className="flex-1 px-3 py-2 bg-bg border border-border rounded-xl font-mono text-xs focus:ring-2 focus:ring-blue outline-none" value={color} onChange={e => setColor(e.target.value)} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-surface border border-border p-5 rounded-2xl shadow-sm space-y-3">
          <h2 className="font-bold text-text-2 text-sm uppercase tracking-wider">Preview</h2>
          <div className="bg-white dark:bg-zinc-900 border border-border rounded-xl aspect-[3/4] relative overflow-hidden">
            <div className="absolute inset-4 border-2 border-dashed border-gray-200 dark:border-zinc-700 rounded flex items-center justify-center">
              <span className="text-text-4 text-xs">Page content</span>
            </div>
            <div
              className="absolute text-xs font-mono"
              style={{
                color,
                fontSize: `${Math.max(8, fontSize * 0.7)}px`,
                ...(position === "bottom-center" ? { bottom: 8, left: "50%", transform: "translateX(-50%)" } :
                    position === "bottom-right" ? { bottom: 8, right: 8 } :
                    position === "bottom-left" ? { bottom: 8, left: 8 } :
                    position === "top-center" ? { top: 8, left: "50%", transform: "translateX(-50%)" } :
                    position === "top-right" ? { top: 8, right: 8 } :
                    { top: 8, left: 8 }),
              }}
            >
              {`${prefix}${startNum}${suffix}`}
            </div>
          </div>
        </div>
      </div>

      {error && <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl text-red-600 text-sm">{error}</div>}

      <button
        onClick={addNumbers}
        disabled={!file || processing}
        className="w-full py-4 bg-blue text-white font-bold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
      >
        {processing ? "Adding page numbers…" : "Add Page Numbers & Download"}
      </button>
    </div>
  );
}
