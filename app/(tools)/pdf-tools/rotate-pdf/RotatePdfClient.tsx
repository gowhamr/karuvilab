"use client";
import { useState, useRef } from "react";
import * as PDFLib from "pdf-lib";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";

const cat = CATEGORIES.find(c => c.id === "pdf")!;

export default function RotatePdfClient() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [rotateAll, setRotateAll] = useState(true);
  const [allAngle, setAllAngle] = useState(90);
  const [pageAngles, setPageAngles] = useState<number[]>([]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const loadFile = async (f: File) => {
    setFile(f);
    setError("");
    try {
      const { PDFDocument } = PDFLib;
      const bytes = await f.arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      const count = doc.getPageCount();
      setPageCount(count);
      setPageAngles(Array(count).fill(90));
    } catch { setPageCount(0); }
  };

  const rotate = async () => {
    if (!file) { setError("Please select a PDF file."); return; }
    setProcessing(true);
    setError("");
    try {
      const { PDFDocument, degrees } = PDFLib;
      const bytes = await file.arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      const pages = doc.getPages();
      const count = pages.length;
      if (pageAngles.length === 0) setPageAngles(Array(count).fill(90));
      pages.forEach((page: any, i: number) => {
        const angle = rotateAll ? allAngle : (pageAngles[i] || 90);
        const current = page.getRotation().angle;
        page.setRotation(degrees((current + angle) % 360));
      });
      const outBytes = await doc.save();
      const blob = new Blob([outBytes as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name.replace(/\.pdf$/i, "") + "-rotated.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      setError(e?.message || "Failed to rotate PDF.");
    }
    setProcessing(false);
  };

  return (
    <div className="space-y-6">
      <div
        className="bg-surface border-2 border-dashed border-border rounded-2xl p-10 text-center cursor-pointer hover:border-blue transition-colors"
        onClick={() => fileRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) loadFile(f); }}
      >
        {file ? (
          <div className="space-y-1">
            <p className="font-semibold text-text-2">{file.name}</p>
            <p className="text-sm text-text-3">{pageCount > 0 ? `${pageCount} pages · ` : ""}{(file.size / 1024).toFixed(0)} KB</p>
          </div>
        ) : (
          <>
            <div className="text-4xl mb-2">🔄</div>
            <p className="font-semibold text-text-2">Drop a PDF here or click to select</p>
          </>
        )}
        <input ref={fileRef} type="file" accept=".pdf,application/pdf" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) loadFile(f); }} />
      </div>

      <div className="bg-surface border border-border p-5 rounded-2xl shadow-sm space-y-4">
        <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
          <input type="checkbox" checked={rotateAll} onChange={e => setRotateAll(e.target.checked)} className="rounded" />
          Rotate all pages by the same angle
        </label>

        {rotateAll ? (
          <div className="space-y-2">
            <label className="text-sm font-medium">Rotation Angle</label>
            <div className="flex gap-3 flex-wrap">
              {[90, 180, 270, -90].map(a => (
                <button
                  key={a}
                  onClick={() => setAllAngle(a)}
                  className={`px-5 py-2 rounded-xl text-sm font-semibold transition-colors ${allAngle === a ? "bg-blue text-white" : "bg-bg border border-border text-text-3 hover:border-blue hover:text-blue"}`}
                >
                  {a === -90 ? "−90° (CCW)" : `${a}° CW`}
                </button>
              ))}
            </div>
          </div>
        ) : (
          pageCount > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Per-page rotation</label>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {Array.from({ length: pageCount }, (_, i) => (
                  <div key={i} className="flex items-center gap-3 bg-bg border border-border rounded-xl px-4 py-2">
                    <span className="text-sm font-medium w-16 flex-shrink-0">Page {i + 1}</span>
                    <select
                      className="flex-1 px-3 py-1.5 bg-bg border border-border rounded-lg text-sm focus:ring-2 focus:ring-blue outline-none"
                      value={pageAngles[i] || 90}
                      onChange={e => { const a = [...pageAngles]; a[i] = Number(e.target.value); setPageAngles(a); }}
                    >
                      <option value={90}>90° CW</option>
                      <option value={180}>180°</option>
                      <option value={270}>270° CW</option>
                      <option value={-90}>−90° (CCW)</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )
        )}
      </div>

      {error && <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl text-red-600 text-sm">{error}</div>}

      <button
        onClick={rotate}
        disabled={!file || processing}
        className="w-full py-4 bg-blue text-white font-bold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
      >
        {processing ? "Rotating…" : "Rotate & Download"}
      </button>
    </div>
  );
}
