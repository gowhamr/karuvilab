"use client";
import { useState, useRef } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";

const cat = CATEGORIES.find(c => c.id === "image")!;

interface BulkItem {
  name: string;
  originalW: number;
  originalH: number;
  newW: number;
  newH: number;
  originalSize: number;
  url: string;
  blob: Blob;
  status: "pending" | "done" | "error";
}

function fmtSize(b: number) {
  if (b < 1024) return b + " B";
  if (b < 1048576) return (b / 1024).toFixed(1) + " KB";
  return (b / 1048576).toFixed(2) + " MB";
}

export default function BulkImageResizerClient() {
  const [targetW, setTargetW] = useState("800");
  const [targetH, setTargetH] = useState("");
  const [lockRatio, setLockRatio] = useState(true);
  const [items, setItems] = useState<BulkItem[]>([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const inputClass = "w-full px-4 py-3 bg-bg border border-border rounded-xl focus:ring-2 focus:ring-blue outline-none transition-all";

  const processFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setProcessing(true);
    setItems([]);
    setProgress(0);
    const arr = Array.from(files);
    const results: BulkItem[] = [];

    for (let i = 0; i < arr.length; i++) {
      const file = arr[i];
      try {
        const img = await new Promise<HTMLImageElement>((res, rej) => {
          const url = URL.createObjectURL(file);
          const im = new Image();
          im.onload = () => { res(im); };
          im.onerror = rej;
          im.src = url;
        });

        const origW = img.naturalWidth;
        const origH = img.naturalHeight;
        let nw = parseInt(targetW) || 0;
        let nh = parseInt(targetH) || 0;

        if (lockRatio) {
          if (nw && !nh) nh = Math.round(nw * origH / origW);
          else if (nh && !nw) nw = Math.round(nh * origW / origH);
          else if (nw && nh) {
            const scale = Math.min(nw / origW, nh / origH);
            nw = Math.round(origW * scale);
            nh = Math.round(origH * scale);
          }
        }
        if (!nw) nw = origW;
        if (!nh) nh = origH;

        const canvas = document.createElement("canvas");
        canvas.width = nw;
        canvas.height = nh;
        canvas.getContext("2d")!.drawImage(img, 0, 0, nw, nh);

        const blob = await new Promise<Blob>((res, rej) =>
          canvas.toBlob(b => b ? res(b) : rej(new Error("fail")), "image/jpeg", 0.9)
        );

        results.push({
          name: file.name.replace(/\.[^.]+$/, "") + "-resized.jpg",
          originalW: origW,
          originalH: origH,
          newW: nw,
          newH: nh,
          originalSize: file.size,
          url: URL.createObjectURL(blob),
          blob,
          status: "done",
        });
      } catch {
        results.push({
          name: file.name,
          originalW: 0, originalH: 0, newW: 0, newH: 0,
          originalSize: file.size, url: "", blob: new Blob(),
          status: "error",
        });
      }
      setProgress(Math.round(((i + 1) / arr.length) * 100));
    }
    setItems(results);
    setProcessing(false);
  };

  const downloadAll = () => {
    items.filter(x => x.status === "done").forEach(item => {
      const a = document.createElement("a");
      a.href = item.url;
      a.download = item.name;
      a.click();
    });
  };

  return (
    
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-surface border border-border p-5 rounded-2xl shadow-sm space-y-4">
            <h2 className="font-bold text-text-2 text-sm uppercase tracking-wider">Settings</h2>
            <div className="space-y-1">
              <label className="text-sm font-medium">Target Width (px)</label>
              <input type="number" className={inputClass} value={targetW} onChange={e => setTargetW(e.target.value)} placeholder="800" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Target Height (px)</label>
              <input type="number" className={inputClass} value={targetH} onChange={e => setTargetH(e.target.value)} placeholder="Auto" />
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input type="checkbox" checked={lockRatio} onChange={e => setLockRatio(e.target.checked)} className="rounded" />
              Maintain aspect ratio
            </label>
            <p className="text-xs text-text-4">Leave height blank to scale proportionally by width only.</p>
          </div>

          <div
            className="bg-surface border-2 border-dashed border-border rounded-2xl p-8 text-center cursor-pointer hover:border-blue transition-colors"
            onClick={() => fileRef.current?.click()}
            onDragOver={e => e.preventDefault()}
            onDrop={e => { e.preventDefault(); processFiles(e.dataTransfer.files); }}
          >
            <div className="text-3xl mb-2">📁</div>
            <p className="font-semibold text-text-2 text-sm">Drop images here</p>
            <p className="text-xs text-text-4 mt-1">or click to select multiple files</p>
            <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={e => processFiles(e.target.files)} />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          {processing && (
            <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Processing…</span>
                <span className="font-bold text-blue">{progress}%</span>
              </div>
              <div className="w-full bg-bg rounded-full h-3 overflow-hidden">
                <div className="h-3 rounded-full bg-blue transition-all duration-200" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          {items.length > 0 && (
            <div className="bg-surface border border-border p-5 rounded-2xl shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-text-2 text-sm uppercase tracking-wider">
                  Results ({items.filter(x => x.status === "done").length}/{items.length})
                </h2>
                <button onClick={downloadAll} className="px-4 py-2 bg-blue text-white text-sm font-bold rounded-xl hover:opacity-90">
                  Download All
                </button>
              </div>

              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {items.map((item, i) => (
                  <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border ${item.status === "error" ? "border-red-200 bg-red-50 dark:bg-red-900/10" : "border-border bg-bg"}`}>
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${item.status === "done" ? "bg-green-500" : "bg-red-500"}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className="text-xs text-text-4">
                        {item.status === "done"
                          ? `${item.originalW}×${item.originalH} → ${item.newW}×${item.newH}px · ${fmtSize(item.originalSize)}`
                          : "Error processing file"}
                      </p>
                    </div>
                    {item.status === "done" && (
                      <a href={item.url} download={item.name} className="text-xs text-blue hover:underline font-medium flex-shrink-0">
                        Save
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {items.length === 0 && !processing && (
            <div className="bg-surface border border-border p-12 rounded-2xl shadow-sm text-center text-text-4">
              <div className="text-4xl mb-3">📦</div>
              <p>Select images from the panel on the left to begin.</p>
            </div>
          )}
        </div>
      </div>
    
  );
}
