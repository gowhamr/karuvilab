"use client";
import { useState, useRef } from "react";
import Script from "next/script";
import { CATEGORIES } from "@/src/tool-registry";
import { CopyButton } from "@/components/ui/CopyButton";
import { useObjectUrlManager } from "@/src/lib/hooks";
import { useToast } from "@/components/ui/Toast";
import { FileText, Download, Loader2 } from "lucide-react";

declare const pdfjsLib: any;

export default function PdfToWordClient() {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [libReady, setLibReady] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [text, setText] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const { createUrl, revokeUrl } = useObjectUrlManager();

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
        lines.push(pageText);
      }
      setText(lines.join("\n\n"));
      toast("Text extracted successfully!");
    } catch (e: any) {
      setError(e?.message || "Failed to extract text.");
    }
    setProcessing(false);
  };

  const downloadDocx = async () => {
    if (!text) return;
    setProcessing(true);
    try {
      // Dynamically import docx from esm.sh
      const docx = await new Function('return import("https://esm.sh/docx")')();
      const { Document, Packer, Paragraph, TextRun } = docx;

      const doc = new Document({
        sections: [{
          properties: {},
          children: text.split("\n\n").map(paragraph => 
            new Paragraph({
              children: [new TextRun(paragraph)],
            })
          ),
        }],
      });

      const blob = await Packer.toBlob(doc);
      const url = createUrl(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = (file?.name.replace(/\.pdf$/i, "") || "converted") + ".docx";
      a.click();
      revokeUrl(url);
      toast("Word document downloaded!");
    } catch (err) {
      console.error(err);
      toast("Failed to generate .docx", "error");
    }
    setProcessing(false);
  };

  return (
    <div className="space-y-6">
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.min.mjs" type="module" onLoad={() => setLibReady(true)} />
      
      {!libReady && (
        <div className="bg-blue/5 border border-blue/10 p-4 rounded-2xl text-sm text-blue flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          Preparing extraction engine...
        </div>
      )}

      <div
        className="bg-surface border-2 border-dashed border-border rounded-[32px] p-12 text-center cursor-pointer hover:border-blue transition-all group"
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
        <div className="bg-surface border border-border p-6 rounded-[24px] shadow-sm space-y-4">
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
    </div>
  );
}
