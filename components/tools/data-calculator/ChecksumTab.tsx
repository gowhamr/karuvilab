"use client";

import React, { useState, useCallback } from "react";
import { useDataCalcStore } from "@/src/store/useDataCalcStore";
import { workerManager } from "@/src/workers/manager";
import { DropZone } from "@/components/ui/DropZone";
import { CopyButton } from "@/components/ui/CopyButton";
import { Fingerprint, LoaderCircle as Loader2, FileText, Type, ShieldCheck, CircleAlert as AlertCircle } from "lucide-react";
import { cn } from "@/src/lib/utils";

import { useShallow } from "zustand/react/shallow";

const ALGOS = ["MD5", "SHA-1", "SHA-256", "SHA-512"];

export function ChecksumTab() {
  const { 
    checksumAlgo, setChecksumAlgo, 
    checksumResult, setChecksumResult,
    checksumProgress, setChecksumProgress,
    isHashing, setIsHashing
  } = useDataCalcStore(useShallow(state => ({
    checksumAlgo: state.checksumAlgo,
    setChecksumAlgo: state.setChecksumAlgo,
    checksumResult: state.checksumResult,
    setChecksumResult: state.setChecksumResult,
    checksumProgress: state.checksumProgress,
    setChecksumProgress: state.setChecksumProgress,
    isHashing: state.isHashing,
    setIsHashing: state.setIsHashing
  })));

  const [textInput, setTextInput] = useState("");
  const [mode, setMode] = useState<'text' | 'file'>('text');
  const [error, setError] = useState<string | null>(null);

  const calculateHash = useCallback(async (input: string | File) => {
    setIsHashing(true);
    setChecksumResult(null);
    setChecksumProgress(0);
    setError(null);

    try {
      let result = "";
      if (typeof input === 'string') {
        const res = await workerManager.generateHashes(input, [checksumAlgo], undefined, (p) => {
          setChecksumProgress(p.percent);
        });
        result = res[checksumAlgo] || "";
      } else {
        const buffer = await input.arrayBuffer();
        result = await workerManager.generateFileHash(buffer, checksumAlgo, undefined, (p) => {
          setChecksumProgress(p.percent);
        });
      }
      setChecksumResult(result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to calculate checksum");
    } finally {
      setIsHashing(false);
      setChecksumProgress(100);
    }
  }, [checksumAlgo, setIsHashing, setChecksumResult, setChecksumProgress]);

  return (
    <div className="space-y-8">
      <div className="bg-surface border border-border p-8 rounded-[32px] shadow-sm space-y-8">
        <div className="flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center">
          <div className="flex gap-1 p-1 bg-bg border border-border rounded-2xl">
            <button
              onClick={() => setMode('text')}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                mode === 'text' ? "bg-surface text-blue shadow-sm" : "text-text-4 hover:text-text-2"
              )}
            >
              <Type className="w-3.5 h-3.5" />
              Text
            </button>
            <button
              onClick={() => setMode('file')}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                mode === 'file' ? "bg-surface text-blue shadow-sm" : "text-text-4 hover:text-text-2"
              )}
            >
              <FileText className="w-3.5 h-3.5" />
              File
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {ALGOS.map((algo) => (
              <button
                key={algo}
                onClick={() => setChecksumAlgo(algo)}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                  checksumAlgo === algo 
                    ? "bg-blue border-blue text-white shadow-lg shadow-blue/20" 
                    : "bg-bg border-border text-text-3 hover:border-blue hover:text-blue"
                )}
              >
                {algo}
              </button>
            ))}
          </div>
        </div>

        {mode === 'text' ? (
          <div className="space-y-4">
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Paste text here to generate checksum..."
              className="w-full h-40 px-6 py-4 bg-bg border border-border rounded-2xl focus:ring-2 focus:ring-blue outline-none transition-all font-mono text-sm resize-none"
            />
            <button
              disabled={!textInput || isHashing}
              onClick={() => calculateHash(textInput)}
              className="w-full py-4 bg-blue text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue/20 hover:bg-blue-600 transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-3"
            >
              {isHashing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
              Generate {checksumAlgo}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <DropZone
              onFilesSelected={(files) => {
                const f = files instanceof FileList ? files[0] : files[0];
                if (f) calculateHash(f);
              }}
              accept="*"
              description={`Drop a file here to compute its ${checksumAlgo} checksum locally.`}
            />
          </div>
        )}

        {isHashing && (
          <div className="space-y-3 animate-in fade-in duration-500">
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-text-4">
              <span className="flex items-center gap-2">
                <Loader2 className="w-3 h-3 animate-spin text-blue" />
                Computing Hash...
              </span>
              <span>{Math.round(checksumProgress)}%</span>
            </div>
            <div className="h-1.5 w-full bg-bg rounded-full overflow-hidden border border-border">
              <div 
                className="h-full bg-blue transition-all duration-300"
                style={{ width: `${checksumProgress}%` }}
              />
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 bg-error/5 border border-error/20 rounded-2xl flex items-center gap-3 text-error animate-in zoom-in-95 duration-300">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-xs font-bold">{error}</p>
          </div>
        )}

        {checksumResult && !isHashing && (
          <div className="space-y-4 animate-in slide-in-from-bottom-2 fade-in duration-500">
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-4 flex items-center gap-2">
                  <Fingerprint className="w-3 h-3" />
                  {checksumAlgo} Hash
                </label>
              </div>
              <div className="relative group">
                <div className="w-full px-6 py-4 bg-blue/5 border border-blue/20 rounded-2xl font-mono text-sm break-all pr-14 text-text">
                  {checksumResult}
                </div>
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <CopyButton text={checksumResult} />
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-[10px] text-text-3 font-medium bg-bg/50 p-3 rounded-xl border border-border/50">
              <ShieldCheck className="w-3.5 h-3.5 text-success" />
              <span>Computation completed entirely in your browser. Your data was never uploaded.</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-8 bg-surface border border-border rounded-[32px] space-y-4">
        <h3 className="text-xs font-black uppercase tracking-widest text-text flex items-center gap-2">
          <Settings2 className="w-4 h-4 text-text-4" />
          Technical Information
        </h3>
        <p className="text-xs text-text-3 leading-relaxed">
          The Checksum Generator uses the <strong>Web Crypto API</strong> for industry-standard hashing algorithms. For large files, it utilizes a <strong>Web Worker</strong> to process data in the background, ensuring the user interface remains responsive. This tool is perfect for verifying file integrity after downloads or comparing document versions.
        </p>
      </div>
    </div>
  );
}

function Settings2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 7h-9" />
      <path d="M14 17H5" />
      <circle cx="17" cy="17" r="3" />
      <circle cx="7" cy="7" r="3" />
    </svg>
  );
}
