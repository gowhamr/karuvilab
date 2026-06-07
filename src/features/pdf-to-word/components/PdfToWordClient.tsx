"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { CopyButton } from "@/components/ui/CopyButton";
import { useObjectUrlManager } from "@/src/lib/hooks";
import { useToast } from "@/components/ui/Toast";
import { FileText, Download, Loader2, AlertCircle } from "lucide-react";
import { EngineLoader } from "@/components/system/EngineLoader";

import { Document, Packer, Paragraph, TextRun } from "docx";

declare const pdfjsLib: any;

export default function PdfToWordClient() {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [libReady, setLibReady] = useState(false);
  const [libError, setLibError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [text, setText] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const { createUrl, revokeUrl } = useObjectUrlManager();

  // Robust ESM Loader for PDF.js
  useEffect(() => {
    async function initLib() {
      if (typeof window === 'undefined') return;
      if (typeof (window as any).pdfjsLib !== 'undefined') {
        setLibReady(true);
        return;
      }

      try {
        // Try local sync first
        let pdfjs;
        try {
          // @ts-ignore
          pdfjs = await import(/* webpackIgnore: true */ "/pdf.min.mjs");
        } catch (e) {
          // Fallback to CDN
          // @ts-ignore
          pdfjs = await import(/* webpackIgnore: true */ "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.4.149/pdf.min.mjs");
        }
        
        (window as any).pdfjsLib = pdfjs;

        // Configure Worker Source
        try {
          (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
        } catch (err) {
          (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc = "https://unpkg.com/pdfjs-dist@5.4.149/build/pdf.worker.min.mjs";
        }

        setLibReady(true);
      } catch (err) {
        console.error("Failed to load PDF.js engine:", err);
        setLibError("Failed to load PDF engine. Please check your connection.");
      }
    }
    initLib();
  }, []);

  const checkLib = useCallback(() => {
    return typeof (window as any).pdfjsLib !== 'undefined';
  }, []);

  const extract = async () => {
    if (!checkLib()) { setError("PDF library not loaded yet."); return; }
    if (!file) { setError("Please select a PDF file."); return; }
    setProcessing(true);
    setError("");
    setText("");
    try {
      try {
        pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
      } catch (err) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.4.149/pdf.worker.min.mjs";
      }
      
      const bytes = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
      setPageCount(pdf.numPages);
      const allText: string[] = [];
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        
        // Group items by their vertical position (Y coordinate) to detect lines/paragraphs
        let lastY = -1;
        let pageLines: string[] = [];
        let currentLine: string[] = [];

        for (const item of (content.items as any[])) {
          if (lastY !== -1 && Math.abs(item.transform[5] - lastY) > 5) {
            pageLines.push(currentLine.join(" "));
            currentLine = [];
          }
          currentLine.push(item.str);
          lastY = item.transform[5];
        }
        if (currentLine.length > 0) pageLines.push(currentLine.join(" "));
        
        allText.push(pageLines.join("\n"));
      }
      
      setText(allText.join("\n\n--- Page Break ---\n\n"));
      toast("Text extracted successfully!");
    } catch (e: any) {
      console.error("PDF extraction error:", e);
      setError(e?.message || "Failed to extract text.");
    }
    setProcessing(false);
  };

  const downloadDocx = async () => {
    if (!text) return;
    setProcessing(true);
    try {
      const sections = text.split("\n\n--- Page Break ---\n\n").map(pageContent => ({
        properties: {},
        children: pageContent.split("\n").map(line => 
          new Paragraph({
            children: [new TextRun({ text: line, size: 24 })],
            spacing: { after: 200 }
          })
        ),
      }));

      const doc = new Document({ sections });
      const blob = await Packer.toBlob(doc);
      
      const url = createUrl(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = (file?.name.replace(/\.pdf$/i, "") || "converted") + ".docx";
      a.click();
      revokeUrl(url);
      toast("Word document downloaded!");
    } catch (err) {
      console.error("DOCX Generation error:", err);
      toast("Failed to generate .docx", "error");
    }
    setProcessing(false);
  };

  return (
    <div className="space-y-6">
      <EngineLoader
        checkInit={checkLib}
        loadingMessage="Preparing extraction engine..."
        errorMessage={libError || "Failed to load PDF extraction engine."}
      >
        <div
          className="bg-surface border-2 border-dashed border-border rounded-4xl p-12 text-center cursor-pointer hover:border-blue transition-all group"
          onClick={() => fileRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) { setFile(f); setText(""); } }}
        >
          {file ? (
            <div className="space-y-2">
              <div className="w-16 h-16 bg-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-blue" />
              </div>
              <p className="font-black text-lg text-text">{file.name}</p>
              <p className="text-xs font-bold text-text-4 uppercase tracking-widest">{(file.size / 1024).toFixed(0)} KB</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-bg rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <Download className="w-8 h-8 text-text-4 group-hover:text-blue transition-colors" />
              </div>
              <div>
                <p className="font-black text-xl text-text">Drop PDF here</p>
                <p className="text-sm font-medium text-text-4">or click to browse files</p>
              </div>
            </div>
          )}
          <input ref={fileRef} type="file" accept=".pdf,application/pdf" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) { setFile(f); setText(""); } }} />
        </div>

        {error && <div className="p-4 bg-error/5 border border-error/10 rounded-xl text-error text-xs font-bold">{error}</div>}

        <button
          onClick={extract}
          disabled={!file || processing || !libReady}
          className="w-full py-4 bg-blue text-white font-black uppercase tracking-widest rounded-2xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-40 disabled:scale-100 shadow-lg shadow-blue/20"
        >
          {processing ? "Extracting content..." : "Extract PDF Content"}
        </button>

        {text && (
          <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="space-y-1">
                <h2 className="font-black text-text text-sm uppercase tracking-widest">Extracted Content</h2>
                <p className="text-[10px] font-bold text-text-4 uppercase tracking-tighter">{pageCount} Pages found</p>
              </div>
              <div className="flex gap-2">
                <CopyButton text={text} label="Copy Text" />
                <button 
                  onClick={downloadDocx} 
                  className="flex items-center gap-2 px-4 py-2 bg-success text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:opacity-90 transition-all"
                >
                  <Download className="w-3.5 h-3.5" /> Download .docx
                </button>
              </div>
            </div>
            <textarea
              className="w-full px-4 py-3 bg-bg border border-border rounded-2xl font-mono text-xs focus:ring-2 focus:ring-blue outline-none transition-all resize-none min-h-[300px]"
              value={text}
              readOnly
            />
          </div>
        )}
      </EngineLoader>
    </div>
  );
}
