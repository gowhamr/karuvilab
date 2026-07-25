"use client";
import { useState, useRef, useId } from "react";
// Removed pdf-lib import
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
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [includeTotal, setIncludeTotal] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const inputClass = "w-full px-4 py-3 bg-bg border border-border rounded-xl focus:ring-2 focus:ring-blue outline-none transition-all";
  const POSITIONS: Position[] = ["bottom-center","bottom-right","bottom-left","top-center","top-right","top-left"];

  const handleFileChange = async (f?: File | null) => {
    if (!f) {
      setFile(null);
      setTotalPages(null);
      return;
    }
    setFile(f);
    try {
      const { workerManager } = await import("@/src/workers/manager");
      const bytes = await f.arrayBuffer();
      const count = await workerManager.getPdfPageCount(bytes);
      setTotalPages(count);
    } catch (e) {
      console.error("Failed to get total pages:", e);
    }
  };


  const addNumbers = async () => {
    if (!file) { setError("Please select a PDF file."); return; }
    setProcessing(true);
    setError("");
    try {
      const { workerManager } = await import("@/src/workers/manager");
      const bytes = await file.arrayBuffer();
      
      const finalSuffix = includeTotal && totalPages ? `${suffix} of ${totalPages}` : suffix;
      const outBytes = await workerManager.addPageNumbersToPdf(bytes, {
        startNum,
        prefix,
        suffix: finalSuffix,
        position,
        fontSize,
        colorHex: color,
      });

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
            className="bg-surface border-2 border-dashed border-border rounded-2xl p-4 sm:p-8 text-center cursor-pointer hover:border-blue transition-colors"
            onClick={() => fileRef.current?.click()}
            onDragOver={e => e.preventDefault()}
            onDrop={e => { e.preventDefault(); handleFileChange(e.dataTransfer.files?.[0]); }}
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
            <input ref={fileRef} type="file" accept=".pdf,application/pdf" className="hidden" onChange={e => handleFileChange(e.target.files?.[0])} />
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
                <input id={suffixId} type="text" className={inputClass} value={suffix} onChange={e => setSuffix(e.target.value)} placeholder="" />
              </div>
              <div className="col-span-3 flex items-center gap-2 mt-1">
                <input
                  type="checkbox"
                  id="includeTotal"
                  checked={includeTotal}
                  onChange={(e) => setIncludeTotal(e.target.checked)}
                  disabled={!totalPages}
                  className="rounded border-border text-blue focus:ring-blue cursor-pointer disabled:opacity-50"
                />
                <label htmlFor="includeTotal" className={`text-sm font-medium ${!totalPages ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                  Include total pages (e.g. Page 1 {suffix} of {totalPages || 'N'})
                </label>
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
              {`${prefix}${startNum}${includeTotal && totalPages ? `${suffix} of ${totalPages}` : suffix}`}
            </div>
          </div>
        </div>
      </div>

      {error && <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl text-red-600 text-sm">{error}</div>}

      <button
        onClick={addNumbers}
        disabled={!file || processing}
        className="w-full py-4 bg-blue text-white font-bold rounded-xl hover:scale-102 active:scale-98 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
      >
        {processing ? "Adding page numbers…" : "Add Page Numbers & Download"}
      </button>
    </div>
  );
}
