"use client";

import { useState, useRef } from "react";
import { useToast } from "@/components/ui/Toast";
import { useObjectUrlManager } from "@/src/lib/hooks";
import { DropZone } from "@/components/ui/DropZone";
import { FileText, Download, Loader2, AlertCircle, FileCode } from "lucide-react";
import mammoth from "mammoth";
import * as PDFLib from "pdf-lib";

export default function WordToPdfClient() {
  const { toast } = useToast();
  const { createUrl, revokeUrl } = useObjectUrlManager();
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ blob: Blob; name: string } | null>(null);

  const handleFiles = (files: FileList | File[]) => {
    const f = files instanceof FileList ? files[0] : files[0];
    if (f) {
      setFile(f);
      setResult(null);
      setError(null);
    }
  };

  const convert = async () => {
    if (!file) return;
    setProcessing(true);
    setError(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      
      // Extract text/html using mammoth
      // Note: mammoth extracts HTML/Text from docx reliably in browser
      const { value: text } = await mammoth.extractRawText({ arrayBuffer });
      
      if (!text.trim()) {
        throw new Error("The document seems to be empty or unreadable.");
      }

      // Create PDF using pdf-lib
      const pdfDoc = await PDFLib.PDFDocument.create();
      const timesRomanFont = await pdfDoc.embedFont(PDFLib.StandardFonts.TimesRoman);
      
      // Simple text wrapping and pagination logic
      const pageSize = { width: 595.28, height: 841.89 }; // A4
      let page = pdfDoc.addPage([pageSize.width, pageSize.height]);
      const { width, height } = page.getSize();
      const fontSize = 12;
      const margin = 50;
      const maxWidth = width - margin * 2;
      
      let y = height - margin;
      
      const lines = text.split("\n");
      
      for (const line of lines) {
        if (!line.trim()) {
          y -= fontSize;
          continue;
        }

        // Very basic text wrapping
        const words = line.split(" ");
        let currentLine = "";
        
        for (const word of words) {
          const testLine = currentLine ? `${currentLine} ${word}` : word;
          const textWidth = timesRomanFont.widthOfTextAtSize(testLine, fontSize);
          
          if (textWidth > maxWidth) {
            page.drawText(currentLine, { x: margin, y, size: fontSize, font: timesRomanFont });
            y -= fontSize * 1.2;
            currentLine = word;
            
            if (y < margin) {
              page = pdfDoc.addPage([pageSize.width, pageSize.height]);
              y = height - margin;
            }
          } else {
            currentLine = testLine;
          }
        }
        
        if (currentLine) {
          page.drawText(currentLine, { x: margin, y, size: fontSize, font: timesRomanFont });
          y -= fontSize * 1.2;
        }

        if (y < margin) {
          page = pdfDoc.addPage([pageSize.width, pageSize.height]);
          y = height - margin;
        }
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
      const name = file.name.replace(/\.docx$/i, "") + ".pdf";
      
      setResult({ blob, name });
      toast("Conversion successful!");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to convert document.");
      toast("Conversion failed", "error");
    } finally {
      setProcessing(false);
    }
  };

  const download = () => {
    if (!result) return;
    const url = createUrl(result.blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = result.name;
    a.click();
    revokeUrl(url);
  };

  return (
    <div className="space-y-8">
      <DropZone
        onFilesSelected={handleFiles}
        accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        title={file ? file.name : "Drop Word document here"}
        description={file ? `${(file.size / 1024).toFixed(0)} KB` : "Supports .docx files"}
        icon={<div className="text-4xl">{file ? "📝" : "📄"}</div>}
      />

      {error && (
        <div className="p-4 bg-error/5 border border-error/10 rounded-2xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-error shrink-0 mt-0.5" />
          <p className="text-sm font-bold text-error">{error}</p>
        </div>
      )}

      <button
        onClick={convert}
        disabled={!file || processing}
        className="w-full py-4 bg-blue text-white font-black uppercase tracking-widest rounded-2xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-40 disabled:scale-100 shadow-lg shadow-blue/20 flex items-center justify-center gap-2"
      >
        {processing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Converting...
          </>
        ) : (
          "Convert to PDF"
        )}
      </button>

      {result && (
        <div className="bg-surface border border-border p-8 rounded-4xl shadow-sm space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-success/10 rounded-2xl flex items-center justify-center">
                <FileCode className="w-6 h-6 text-success" />
              </div>
              <div>
                <h3 className="font-black text-text uppercase tracking-widest text-sm">Conversion Ready</h3>
                <p className="text-[10px] font-bold text-text-4 uppercase tracking-tighter">{result.name}</p>
              </div>
            </div>
            <button
              onClick={download}
              className="flex items-center gap-2 px-6 py-3 bg-success text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:opacity-90 transition-all shadow-lg shadow-success/20"
            >
              <Download className="w-4 h-4" /> Download PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
