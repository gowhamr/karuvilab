"use client";
import { useState, useRef } from "react";
import Script from "next/script";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { CopyButton } from "@/components/ui/CopyButton";

declare const pdfjsLib: any;

const cat = CATEGORIES.find(c => c.id === "pdf")!;

export default function PdfToWordClient() {
  const [file, setFile] = useState<File | null>(null);
  const [libReady, setLibReady] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [text, setText] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const extract = async () => {
    if (!libReady) { setError("PDF library not loaded yet."); return; }
    if (!file) { setError("Please select a PDF file."); return; }
    setProcessing(true);
    setError("");
    setText("");
    try {
      pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.mjs";
      const bytes = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
      setPageCount(pdf.numPages);
      const lines: string[] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map((item: any) => item.str).join(" ");
        lines.push(`=== Page ${i} ===\n${pageText}`);
      }
      setText(lines.join("\n\n"));
    } catch (e: any) {
      setError(e?.message || "Failed to extract text.");
    }
    setProcessing(false);
  };

  const downloadTxt = () => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = (file?.name.replace(/\.pdf$/i, "") || "extracted") + ".txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.min.mjs" type="module" onLoad={() => setLibReady(true)} />
      
        {!libReady && <div className="bg-surface border border-border p-4 rounded-2xl text-sm text-text-3 flex items-center gap-2"><span className="animate-spin">⏳</span> Loading PDF.js library…</div>}

        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl text-sm text-yellow-700 dark:text-yellow-400">
          <strong>Note:</strong> True PDF-to-DOCX conversion requires server-side tools. This browser-based tool extracts all text content from your PDF as a .txt file, preserving page structure.
        </div>

        <div
          className="bg-surface border-2 border-dashed border-border rounded-2xl p-10 text-center cursor-pointer hover:border-blue transition-colors"
          onClick={() => fileRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) { setFile(f); setText(""); } }}
        >
          {file ? (
            <div className="space-y-1">
              <p className="font-semibold text-text-2">{file.name}</p>
              <p className="text-sm text-text-3">{(file.size / 1024).toFixed(0)} KB</p>
            </div>
          ) : (
            <>
              <div className="text-4xl mb-2">📝</div>
              <p className="font-semibold text-text-2">Drop a PDF here or click to select</p>
            </>
          )}
          <input ref={fileRef} type="file" accept=".pdf,application/pdf" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) { setFile(f); setText(""); } }} />
        </div>

        {error && <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl text-red-600 text-sm">{error}</div>}

        <button
          onClick={extract}
          disabled={!file || processing || !libReady}
          className="w-full py-4 bg-blue text-white font-bold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
        >
          {processing ? "Extracting text…" : "Extract Text"}
        </button>

        {text && (
          <div className="bg-surface border border-border p-5 rounded-2xl shadow-sm space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-bold text-text-2 text-sm uppercase tracking-wider flex-1">Extracted Text ({pageCount} pages)</h2>
              <CopyButton text={text} label="Copy Text" />
              <button onClick={downloadTxt} className="px-3 py-1.5 text-sm font-medium bg-blue text-white rounded-lg hover:opacity-90">
                Download .txt
              </button>
            </div>
            <textarea
              className="w-full px-4 py-3 bg-bg border border-border rounded-xl font-mono text-xs focus:ring-2 focus:ring-blue outline-none transition-all resize-none"
              rows={20}
              value={text}
              readOnly
            />
          </div>
        )}
      
    </>
  );
}
