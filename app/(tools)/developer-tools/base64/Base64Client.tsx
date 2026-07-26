"use client";

import { useState, useMemo, useRef } from "react";
import { ToolInput } from "@/components/ui/ToolInput";
import { ToolResultArea } from "@/components/ui/ToolResultArea";
import { b64EncodeUtf8, b64DecodeUtf8 } from "@/src/utils";
import { DropZone } from "@/components/ui/DropZone";
import { useObjectUrlManager } from "@/src/lib/hooks";
import { FileText, Download, Loader2, AlertCircle, FileCode } from "lucide-react";

function toBase64(text: string, urlSafe: boolean): string {
  try {
    const b64 = b64EncodeUtf8(text);
    return urlSafe ? b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "") : b64;
  } catch (e) {
    throw new Error("Encoding failed");
  }
}

function fromBase64(b64: string): string {
  try {
    return b64DecodeUtf8(b64);
  } catch (e) {
    throw new Error("Invalid Base64 input");
  }
}

export default function Base64Client() {
  const [tab, setTab] = useState<"encode" | "decode">("encode");
  const [inputType, setInputType] = useState<"text" | "file">("text");
  
  // Text state
  const [input, setInput] = useState("");
  const [urlSafe, setUrlSafe] = useState(false);

  // File state
  const { createUrl, revokeUrl } = useObjectUrlManager();
  const [file, setFile] = useState<File | null>(null);
  const [fileResult, setFileResult] = useState<{ blob: Blob; name: string } | null>(null);
  const [fileError, setFileError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Text Logic
  const { output, error } = useMemo(() => {
    if (inputType !== "text" || !input) return { output: "", error: "" };
    if (input.length > 5 * 1024 * 1024) return { output: "", error: "Input text exceeds 5MB limit" };
    if (tab === "encode") {
      try {
        return { output: toBase64(input, urlSafe), error: "" };
      } catch (e: any) {
        return { output: "", error: e.message };
      }
    } else {
      try {
        return { output: fromBase64(input), error: "" };
      } catch (e: any) {
        return { output: "", error: e.message };
      }
    }
  }, [input, tab, urlSafe, inputType]);

  const handleDownloadText = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "text/plain" });
    const url = createUrl(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = tab === "encode" ? "encoded.b64.txt" : "decoded.txt";
    a.click();
  };

  // File Logic
  const handleFileProcess = async () => {
    if (!file) return;
    setIsProcessing(true);
    setFileError("");
    setFileResult(null);

    try {
      if (tab === "encode") {
        const buffer = await file.arrayBuffer();
        const bytes = new Uint8Array(buffer);
        let binary = "";
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]!);
        }
        let b64 = btoa(binary);
        if (urlSafe) {
          b64 = b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
        }
        const blob = new Blob([b64], { type: "text/plain" });
        setFileResult({ blob, name: file.name + ".b64.txt" });
      } else {
        const text = await file.text();
        let cleaned = text.replace(/\s+/g, "");
        // Convert url-safe back to standard
        cleaned = cleaned.replace(/-/g, "+").replace(/_/g, "/");
        // Pad with equals if necessary
        while (cleaned.length % 4 !== 0) {
          cleaned += "=";
        }
        
        const res = await fetch(`data:application/octet-stream;base64,${cleaned}`);
        if (!res.ok) throw new Error("Invalid Base64 data");
        const blob = await res.blob();
        
        let outName = file.name.replace(/\.b64\.txt$|\.txt$/, "");
        if (outName === file.name) outName += ".decoded.bin";
        
        setFileResult({ blob, name: outName });
      }
    } catch (err: any) {
      console.error(err);
      setFileError(err.message || "File processing failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileDownload = () => {
    if (!fileResult) return;
    const url = createUrl(fileResult.blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileResult.name;
    a.click();
  };

  return (
    <div className="bg-surface border border-border p-6 md:p-8 rounded-3xl shadow-sm space-y-8">
      {/* Top Controls: Mode & Input Type */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Tab Switcher (Encode/Decode) */}
        <div className="flex p-1 bg-bg border border-border rounded-2xl w-fit">
          {(["encode", "decode"] as const).map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setFileResult(null); setFileError(""); }}
              className={`px-6 py-2 rounded-xl text-sm font-black transition-all ${tab === t ? "bg-blue text-white shadow-md shadow-blue/10" : "text-text-3 hover:text-text"}`}
            >
              {t === "encode" ? "Encode" : "Decode"}
            </button>
          ))}
        </div>

        {/* Type Switcher (Text/File) */}
        <div className="flex p-1 bg-bg border border-border rounded-2xl w-fit">
          <button
            onClick={() => setInputType("text")}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${inputType === "text" ? "bg-surface-2 text-text shadow-sm" : "text-text-3 hover:text-text"}`}
          >
            Text Mode
          </button>
          <button
            onClick={() => setInputType("file")}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${inputType === "file" ? "bg-surface-2 text-text shadow-sm" : "text-text-3 hover:text-text"}`}
          >
            File Mode
          </button>
        </div>
      </div>

      {inputType === "text" ? (
        <>
          {/* Text Input Section */}
          <div className="space-y-6">
            <ToolInput
              label={tab === "encode" ? "Plain Text" : "Base64 Input"}
              value={input}
              onChange={setInput}
              placeholder={tab === "encode" ? "Enter text to encode..." : "Paste Base64 string..."}
              rows={6}
              mono
              description={tab === "encode" ? "UTF-8 Supported" : "Automatic Padding"}
            />

            <label className="flex items-center gap-3 cursor-pointer select-none group w-fit">
              <div
                onClick={() => setUrlSafe(v => !v)}
                className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all group-hover:scale-110 ${urlSafe ? "bg-blue border-blue shadow-md shadow-blue/10" : "border-border bg-bg"}`}
              >
                {urlSafe && (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <div className="space-y-0.5">
                <span className="text-sm font-bold text-text-2">URL-safe Base64</span>
                <p className="text-xs text-text-muted font-medium uppercase tracking-tighter">+→-, /→_, no padding</p>
              </div>
            </label>
          </div>

          {/* Text Result Section */}
          <div className="pt-4 border-t border-border/50">
            <ToolResultArea
              label={tab === "encode" ? "Base64 Output" : "Decoded Text"}
              value={output}
              error={error}
              onClear={() => setInput("")}
              onDownload={handleDownloadText}
              language={tab === "encode" ? "Base64" : "UTF-8"}
            />
          </div>
        </>
      ) : (
        <>
          {/* File Input Section */}
          <div className="space-y-6">
            <DropZone
              onFilesSelected={(files) => {
                const f = files instanceof FileList ? files[0] : files[0];
                if (f) { 
                  if (f.size > 10 * 1024 * 1024) {
                    setFileError("File exceeds 10MB limit");
                    setFile(null);
                  } else {
                    setFile(f); setFileResult(null); setFileError(""); 
                  }
                }
              }}
              accept={tab === "encode" ? "*" : ".txt,.b64,text/plain"}
              title={file ? file.name : (tab === "encode" ? "Drop a file to encode" : "Drop a Base64 text file to decode")}
              description={file ? `${(file.size / 1024).toFixed(0)} KB` : (tab === "encode" ? "Supports any file format" : "Supports .txt, .b64")}
              icon={<div className="text-4xl">{file ? "📁" : "📄"}</div>}
            />

            <label className="flex items-center gap-3 cursor-pointer select-none group w-fit">
              <div
                onClick={() => setUrlSafe(v => !v)}
                className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all group-hover:scale-110 ${urlSafe ? "bg-blue border-blue shadow-md shadow-blue/10" : "border-border bg-bg"}`}
              >
                {urlSafe && (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <div className="space-y-0.5">
                <span className="text-sm font-bold text-text-2">URL-safe Base64</span>
                <p className="text-xs text-text-muted font-medium uppercase tracking-tighter">+→-, /→_, no padding</p>
              </div>
            </label>

            {fileError && (
              <div className="p-4 bg-error/5 border border-error/10 rounded-2xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-error shrink-0 mt-0.5" />
                <p className="text-sm font-bold text-error">{fileError}</p>
              </div>
            )}

            <button
              onClick={handleFileProcess}
              disabled={!file || isProcessing}
              className="w-full py-4 bg-blue text-white font-black uppercase tracking-widest rounded-2xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-40 disabled:scale-100 shadow-lg shadow-blue/20 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                tab === "encode" ? "Encode File" : "Decode File"
              )}
            </button>
          </div>

          {/* File Result Section */}
          {fileResult && (
            <div className="bg-surface border border-border p-4 sm:p-8 rounded-4xl shadow-sm space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 sm:gap-4">
                <div className="flex items-center gap-4 w-full sm:w-auto min-w-0">
                  <div className="w-12 h-12 shrink-0 bg-success/10 rounded-2xl flex items-center justify-center">
                    <FileCode className="w-6 h-6 text-success" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-black text-text uppercase tracking-widest text-sm truncate">Processing Complete</h3>
                    <p className="text-xs font-bold text-text-muted uppercase tracking-tighter truncate">{fileResult.name}</p>
                  </div>
                </div>
                <button
                  onClick={handleFileDownload}
                  className="flex w-full sm:w-auto items-center justify-center gap-2 px-6 py-3 bg-success text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:opacity-90 transition-all shadow-lg shadow-success/20 shrink-0"
                >
                  <Download className="w-4 h-4" /> Download
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
