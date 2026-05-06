"use client";
import { useState, useRef } from "react";
import Script from "next/script";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";

declare const PDFLib: any;

const cat = CATEGORIES.find(c => c.id === "pdf")!;

interface PdfFile { name: string; file: File; }

export default function MergePdf() {
  const [files, setFiles] = useState<PdfFile[]>([]);
  const [libReady, setLibReady] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const addFiles = (fl: FileList | null) => {
    if (!fl) return;
    setFiles(prev => [...prev, ...Array.from(fl).map(f => ({ name: f.name, file: f }))]);
  };

  const removeFile = (i: number) => setFiles(f => f.filter((_, idx) => idx !== i));

  const moveUp = (i: number) => {
    if (i === 0) return;
    setFiles(f => { const a = [...f]; [a[i-1], a[i]] = [a[i], a[i-1]]; return a; });
  };

  const moveDown = (i: number) => {
    setFiles(f => { if (i >= f.length - 1) return f; const a = [...f]; [a[i], a[i+1]] = [a[i+1], a[i]]; return a; });
  };

  const merge = async () => {
    if (!libReady) { setError("PDF library not loaded yet. Please wait."); return; }
    if (files.length < 2) { setError("Please add at least 2 PDF files to merge."); return; }
    setProcessing(true);
    setError("");
    try {
      const { PDFDocument } = PDFLib;
      const merged = await PDFDocument.create();
      for (const { file } of files) {
        const bytes = await file.arrayBuffer();
        const doc = await PDFDocument.load(bytes);
        const pageIndices = doc.getPageIndices();
        const pages = await merged.copyPages(doc, pageIndices);
        pages.forEach((p: any) => merged.addPage(p));
      }
      const bytes = await merged.save();
      const blob = new Blob([bytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "merged.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      setError(e?.message || "Failed to merge PDFs.");
    }
    setProcessing(false);
  };

  return (
    <>
      <Script src="https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js" onLoad={() => setLibReady(true)} />
      <ToolShell title="Merge PDF" description="Combine multiple PDF files into one — all processing happens in your browser." category={cat}>
        {!libReady && (
          <div className="bg-surface border border-border p-4 rounded-2xl text-sm text-text-3 flex items-center gap-2">
            <span className="animate-spin">⏳</span> Loading PDF library…
          </div>
        )}

        <div
          className="bg-surface border-2 border-dashed border-border rounded-2xl p-10 text-center cursor-pointer hover:border-blue transition-colors"
          onClick={() => fileRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); addFiles(e.dataTransfer.files); }}
        >
          <div className="text-4xl mb-2">📄</div>
          <p className="font-semibold text-text-2">Drop PDF files here or click to add</p>
          <p className="text-sm text-text-4 mt-1">Add multiple PDFs — they will be merged in order</p>
          <input ref={fileRef} type="file" accept=".pdf,application/pdf" multiple className="hidden" onChange={e => addFiles(e.target.files)} />
        </div>

        {files.length > 0 && (
          <div className="bg-surface border border-border p-5 rounded-2xl shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-text-2 text-sm uppercase tracking-wider">Files ({files.length}) — drag to reorder</h2>
              <button onClick={() => setFiles([])} className="text-xs text-red-500 hover:text-red-600 font-medium">Clear all</button>
            </div>
            {files.map((f, i) => (
              <div key={i} className="flex items-center gap-3 bg-bg border border-border rounded-xl px-4 py-3">
                <span className="text-xs font-bold text-text-4 w-5 text-center">{i + 1}</span>
                <div className="flex flex-col gap-0.5 flex-shrink-0">
                  <button onClick={() => moveUp(i)} disabled={i === 0} className="text-xs text-text-4 hover:text-blue disabled:opacity-30">▲</button>
                  <button onClick={() => moveDown(i)} disabled={i === files.length - 1} className="text-xs text-text-4 hover:text-blue disabled:opacity-30">▼</button>
                </div>
                <p className="flex-1 font-medium text-sm truncate">{f.name}</p>
                <p className="text-xs text-text-4">{(f.file.size / 1024).toFixed(0)} KB</p>
                <button onClick={() => removeFile(i)} className="text-red-400 hover:text-red-600 text-sm font-bold flex-shrink-0">✕</button>
              </div>
            ))}
          </div>
        )}

        {error && <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl text-red-600 text-sm">{error}</div>}

        <button
          onClick={merge}
          disabled={files.length < 2 || processing || !libReady}
          className="w-full py-4 bg-blue text-white font-bold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
        >
          {processing ? "Merging…" : `Merge ${files.length} PDF${files.length !== 1 ? "s" : ""}`}
        </button>
      </ToolShell>
    </>
  );
}
