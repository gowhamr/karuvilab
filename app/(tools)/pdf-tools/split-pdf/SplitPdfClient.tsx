"use client";
import { useState, useRef } from "react";
import * as PDFLib from "pdf-lib";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { useObjectUrlManager } from "@/src/lib/hooks";

import { DropZone } from "@/components/ui/DropZone";

const cat = CATEGORIES.find(c => c.id === "pdf")!;

function parseRanges(input: string, maxPage: number): number[][] {
  const parts = input.split(",").map(s => s.trim()).filter(Boolean);
  const out: number[][] = [];
  for (const p of parts) {
    if (p.includes("-")) {
      const [a, b] = p.split("-").map(n => parseInt(n.trim()));
      if (a === undefined || b === undefined) continue;
      if (!isNaN(a) && !isNaN(b) && a >= 1 && b <= maxPage && a <= b) {
        const pages: number[] = [];
        for (let i = a; i <= b; i++) pages.push(i - 1);
        out.push(pages);
      }
    } else {
      const n = parseInt(p);
      if (!isNaN(n) && n >= 1 && n <= maxPage) out.push([n - 1]);
    }
  }
  return out;
}

export default function SplitPdfClient() {
  const { createUrl, revokeUrl } = useObjectUrlManager();
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [ranges, setRanges] = useState("1-3, 4-6");
  const [splitAll, setSplitAll] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const loadFile = async (files: FileList | File[]) => {
    const f = files[0];
    if (!f) return;
    setFile(f);
    setError("");
    try {
      const { PDFDocument } = PDFLib;
      const bytes = await f.arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      setPageCount(doc.getPageCount());
    } catch { setPageCount(0); }
  };

  const split = async () => {
    if (!file) { setError("Please select a PDF file."); return; }
    setProcessing(true);
    setError("");
    try {
      const { PDFDocument } = PDFLib;
      const bytes = await file.arrayBuffer();
      const srcDoc = await PDFDocument.load(bytes);
      const total = srcDoc.getPageCount();
      setPageCount(total);

      const groups = splitAll
        ? Array.from({ length: total }, (_, i) => [i])
        : parseRanges(ranges, total);

      if (groups.length === 0) { setError("No valid page ranges found."); setProcessing(false); return; }

      for (let g = 0; g < groups.length; g++) {
        const newDoc = await PDFDocument.create();
        const pages = await newDoc.copyPages(srcDoc, groups[g]!);
        pages.forEach((p: any) => newDoc.addPage(p));
        const outBytes = await newDoc.save();
        const blob = new Blob([outBytes as any], { type: "application/pdf" });
        const url = createUrl(blob);
        const a = document.createElement("a");
        a.href = url;
        const label = splitAll ? `page-${groups[g]![0]! + 1}` : `part-${g + 1}`;
        a.download = `${file.name.replace(/\.pdf$/i, "")}-${label}.pdf`;
        a.click();
        setTimeout(() => revokeUrl(url), 100);
        await new Promise(r => setTimeout(r, 150));
      }
    } catch (e: any) {
      setError(e?.message || "Failed to split PDF.");
    }
    setProcessing(false);
  };

  return (
    <div className="space-y-6">
      <div
        className="bg-surface border-2 border-dashed border-border rounded-2xl p-10 text-center cursor-pointer hover:border-blue transition-colors"
        onClick={() => fileRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { 
          e.preventDefault(); 
          const files = e.dataTransfer.files;
          if (files && files.length > 0) {
            const f = files[0];
            if (f && (f.type === "application/pdf" || f.name.endsWith(".pdf"))) {
              loadFile(files);
            }
          }
        }}
      >
        {file ? (
          <div className="space-y-1">
            <p className="font-semibold text-text-2">{file.name}</p>
            <p className="text-sm text-text-3">{pageCount > 0 ? `${pageCount} pages · ` : ""}{(file.size / 1024).toFixed(0)} KB</p>
          </div>
        ) : (
          <>
            <div className="text-4xl mb-2">✂️</div>
            <p className="font-semibold text-text-2">Drop a PDF here or click to select</p>
          </>
        )}
        <input ref={fileRef} type="file" accept=".pdf,application/pdf" className="hidden" onChange={e => { if (e.target.files) loadFile(e.target.files); }} />
      </div>

      <div className="bg-surface border border-border p-5 rounded-2xl shadow-sm space-y-4">
        <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
          <input type="checkbox" checked={splitAll} onChange={e => setSplitAll(e.target.checked)} className="rounded" />
          Split into individual pages (one file per page)
        </label>
        {!splitAll && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Page Ranges</label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-bg border border-border rounded-xl focus:ring-2 focus:ring-blue outline-none transition-all font-mono"
              value={ranges}
              onChange={e => setRanges(e.target.value)}
              placeholder="e.g. 1-3, 5, 7-9"
            />
            <p className="text-xs text-text-4">Each range becomes a separate PDF. Examples: <code>1-5</code>, <code>2</code>, <code>1-3, 5, 7-10</code>
              {pageCount > 0 ? ` · ${pageCount} total pages` : ""}</p>
          </div>
        )}
      </div>

      {error && <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl text-red-600 text-sm">{error}</div>}

      <button
        onClick={split}
        disabled={!file || processing}
        className="w-full py-4 bg-blue text-white font-bold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
      >
        {processing ? "Splitting…" : "Split PDF"}
      </button>
    </div>
  );
}