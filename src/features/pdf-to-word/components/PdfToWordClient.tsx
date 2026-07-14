"use client";
import { useState, useRef, useCallback } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { CopyButton } from "@/components/ui/CopyButton";
import { useObjectUrlManager } from "@/src/lib/hooks";
import { useToast } from "@/components/ui/Toast";
import { FileText, Download, Loader2, AlertCircle } from "lucide-react";
import { EngineLoader } from "@/components/system/EngineLoader";
import { workerOrchestrator } from "@/src/engine/workers/WorkerOrchestrator";
import { logger } from "@/src/lib/logger";
import { useProgress } from "@/src/contexts/ProgressContext";


export default function PdfToWordClient() {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const { state: progressState, startProcessing, setStage, finishProcessing } = useProgress();
  const [text, setText] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const { createUrl, revokeUrl } = useObjectUrlManager();

  const checkLib = useCallback(() => {
    return true; // Library is running in the worker, so it's always ready
  }, []);

  const extract = async () => {
    if (!file) { setError("Please select a PDF file."); return; }
    startProcessing("heavy");
    setStage("Preparing to extract...");
    setError("");
    setText("");
    try {
      const bytes = await file.arrayBuffer();
      
      const extractedText = await workerOrchestrator.dispatch<string>(
        "extractTextFromPdf",
        [bytes],
        [bytes],
        (p: any) => setStage(p.message || "Extracting...")
      );

      setText(extractedText);
      const pages = extractedText.split("\n\n--- Page Break ---\n\n");
      setPageCount(pages.length);
      toast("Text extracted successfully!");
    } catch (e: any) {
      console.error("PDF extraction error:", e);
      setError(e?.message || "Failed to extract text.");
      finishProcessing(false, new Error(e?.message || "Failed to extract text."));
    } finally {
      finishProcessing(true);
    }
  };

  const downloadDocx = async () => {
    if (!text) return;
    startProcessing("short");
    setStage("Preparing to generate DOCX...");
    try {
      const docxBytes = await workerOrchestrator.dispatch<Uint8Array>(
        "generateDocxFromText",
        [text],
        [],
        (p: any) => setStage(p.message || "Generating...")
      );
      
      const blob = new Blob([docxBytes as any], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
      const url = createUrl(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = (file?.name.replace(/\.pdf$/i, "") || "converted") + ".docx";
      a.click();
      revokeUrl(url);
      toast("Word document downloaded!");
    } catch (err) {
      logger.error("DOCX Generation error:", { error: err });
      toast("Failed to generate .docx", "error");
      finishProcessing(false, err as Error);
    } finally {
      finishProcessing(true);
    }
  };

  return (
    <div className="space-y-6">
      <EngineLoader
        checkInit={checkLib}
        loadingMessage="Preparing extraction engine..."
        errorMessage="Failed to load PDF extraction engine."
      >
        <>
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
            disabled={!file || progressState.isProcessing}
            className="w-full py-4 bg-blue text-white font-black uppercase tracking-widest rounded-2xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-40 disabled:scale-100 shadow-lg shadow-blue/20"
          >
            {progressState.isProcessing ? "Extracting content..." : "Extract PDF Content"}
          </button>

          {text && (
            <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="space-y-1">
                  <h2 className="font-black text-text text-sm uppercase tracking-widest">Extracted Content</h2>
                  <p className="text-xs font-bold text-text-4 uppercase tracking-tighter">{pageCount} Pages found</p>
                </div>
                <div className="flex gap-2">
                  <CopyButton text={text} label="Copy Text" />
                  <button 
                    onClick={downloadDocx} 
                    className="flex items-center gap-2 px-4 py-2 bg-success text-white rounded-xl font-black uppercase tracking-widest text-xs hover:opacity-90 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" /> Download .docx
                  </button>
                </div>
              </div>
              <textarea
                className="w-full px-4 py-3 bg-bg border border-border rounded-2xl font-mono text-xs focus:ring-2 focus:ring-blue outline-none transition-all resize-none min-h-72"
                value={text}
                readOnly
              />
            </div>
          )}
        </>
      </EngineLoader>
    </div>
  );
}
