"use client";
import { useState, useRef } from "react";
import * as PDFLib from "pdf-lib";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { useObjectUrlManager } from "@/src/lib/hooks";
import { Checkbox } from "@/components/ui/Checkbox";

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
  const { createUrl, revokeUrl } = useObjectUrlManager();

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
      const url = createUrl(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name.replace(/\.pdf$/i, "") + "-rotated.pdf";
      a.click();
      revokeUrl(url);
    } catch (e: any) {
      setError(e?.message || "Failed to rotate PDF.");
    }
    setProcessing(false);
  };

  return (
    <div className="space-y-6">
      <div
        className="bg-surface border-2 border-dashed border-border rounded-[32px] p-10 text-center cursor-pointer hover:border-blue transition-colors group"
        onClick={() => fileRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) loadFile(f); }}
      >
        {file ? (
          <div className="space-y-1">
            <p className="font-bold text-text-2">{file.name}</p>
            <p className="text-xs font-bold text-text-4 uppercase tracking-wider">{pageCount > 0 ? `${pageCount} pages · ` : ""}{(file.size / 1024).toFixed(0)} KB</p>
          </div>
        ) : (
          <>
            <div className="text-4xl mb-4 transition-transform group-hover:scale-110">🔄</div>
            <p className="font-bold text-text-2">Drop a PDF here or click to select</p>
            <p className="text-[10px] font-bold text-text-4 uppercase tracking-widest mt-2">Maximum file size: 50MB</p>
          </>
        )}
        <input ref={fileRef} type="file" accept=".pdf,application/pdf" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) loadFile(f); }} />
      </div>

      <div className="bg-surface border border-border p-6 md:p-8 rounded-[32px] shadow-sm space-y-6">
        <Checkbox
          label="Rotate all pages by the same angle"
          checked={rotateAll}
          onChange={e => setRotateAll(e.target.checked)}
        />

        {rotateAll ? (
          <div className="space-y-4">
            <label className="text-sm font-bold text-text-2">Rotation Angle</label>
            <div className="flex gap-3 flex-wrap">
              {[90, 180, 270, -90].map(a => (
                <button
                  key={a}
                  onClick={() => setAllAngle(a)}
                  className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${allAngle === a ? "bg-blue text-white shadow-lg shadow-blue/20" : "bg-bg border border-border text-text-3 hover:border-blue hover:text-blue"}`}
                >
                  {a === -90 ? "−90° (CCW)" : `${a}° CW`}
                </button>
              ))}
            </div>
          </div>
        ) : (
          pageCount > 0 && (
            <div className="space-y-4">
              <label className="text-sm font-bold text-text-2">Per-page rotation</label>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {Array.from({ length: pageCount }, (_, i) => (
                  <div key={i} className="flex items-center gap-4 bg-bg border border-border rounded-xl px-5 py-3">
                    <span className="text-xs font-black uppercase tracking-widest text-text-4 w-20 flex-shrink-0">Page {i + 1}</span>
                    <select
                      className="flex-1 px-4 py-2 bg-surface border border-border rounded-lg text-sm font-bold focus:ring-4 focus:ring-blue/10 focus:border-blue outline-none transition-all cursor-pointer"
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

      {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs font-bold uppercase tracking-wider text-center">{error}</div>}

      <button
        onClick={rotate}
        disabled={!file || processing}
        className="w-full py-4 bg-blue text-white font-black rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100 shadow-lg shadow-blue/20"
      >
        {processing ? "Rotating…" : "Rotate & Download"}
      </button>
    </div>
  );
}
