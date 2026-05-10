"use client";
import { useState, useRef } from "react";
import * as PDFLib from "pdf-lib";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";

const cat = CATEGORIES.find(c => c.id === "pdf")!;

function fmtSize(b: number) {
  if (b < 1024) return b + " B";
  if (b < 1048576) return (b / 1024).toFixed(1) + " KB";
  return (b / 1048576).toFixed(2) + " MB";
}

export default function CompressPdfClient() {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [resultSize, setResultSize] = useState(0);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const compress = async () => {
    if (!file) { setError("Please select a PDF file."); return; }
    setProcessing(true);
    setError("");
    setResultUrl(null);
    try {
      const { PDFDocument } = PDFLib;
      const bytes = await file.arrayBuffer();
      const doc = await PDFDocument.load(bytes, { updateMetadata: false });
      // Re-save with pdf-lib (removes redundant objects, rebuilds xref)
      const outBytes = await doc.save({ useObjectStreams: true });
      const blob = new Blob([outBytes as any], { type: "application/pdf" });
      setResultSize(blob.size);
      setResultUrl(URL.createObjectURL(blob));
    } catch (e: any) {
      setError(e?.message || "Failed to compress PDF.");
    }
    setProcessing(false);
  };

  const download = () => {
    if (!resultUrl || !file) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = file.name.replace(/\.pdf$/i, "") + "-compressed.pdf";
    a.click();
  };

  const saved = file && resultSize ? Math.round((1 - resultSize / file.size) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl text-sm text-yellow-700 dark:text-yellow-400">
        <strong>Note:</strong> Browser-based PDF compression re-encodes the PDF structure. Results vary — PDFs with large embedded images may not compress significantly without image re-encoding.
      </div>

      <div
        className="bg-surface border-2 border-dashed border-border rounded-2xl p-10 text-center cursor-pointer hover:border-blue transition-colors"
        onClick={() => fileRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) setFile(f); }}
      >
        {file ? (
          <div className="space-y-1">
            <p className="font-semibold text-text-2">{file.name}</p>
            <p className="text-sm text-text-3">{fmtSize(file.size)}</p>
          </div>
        ) : (
          <>
            <div className="text-4xl mb-2">📉</div>
            <p className="font-semibold text-text-2">Drop a PDF here or click to select</p>
          </>
        )}
        <input ref={fileRef} type="file" accept=".pdf,application/pdf" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) { setFile(f); setResultUrl(null); } }} />
      </div>

      {error && <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl text-red-600 text-sm">{error}</div>}

      {resultUrl && file && (
        <div className="bg-surface border border-border p-5 rounded-2xl shadow-sm space-y-3">
          <h2 className="font-bold text-text-2 text-sm uppercase tracking-wider">Result</h2>
          <div className="flex flex-wrap gap-4 text-sm">
            <span>Original: <strong>{fmtSize(file.size)}</strong></span>
            <span>Compressed: <strong>{fmtSize(resultSize)}</strong></span>
            <span className={saved > 0 ? "text-green-500 font-bold" : "text-text-3"}>
              {saved > 0 ? `-${saved}% saved` : "No size reduction (file already optimized)"}
            </span>
          </div>
          <button onClick={download} className="w-full py-4 bg-blue text-white font-bold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all">
            Download Compressed PDF
          </button>
        </div>
      )}

      <button
        onClick={compress}
        disabled={!file || processing}
        className="w-full py-4 bg-blue text-white font-bold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
      >
        {processing ? "Compressing…" : "Compress PDF"}
      </button>
    </div>
  );
}
