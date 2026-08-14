"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { CopyButton } from "@/components/ui/CopyButton";
import { workerManager } from "@/src/workers/manager";
import { TaskProgress } from "@/src/workers/types";
import { DropZone } from "@/components/ui/DropZone";
import { useToast } from "@/components/ui/Toast";
import { ToolWorkspace } from "@/components/ui/ToolWorkspace";
import { ToolInput } from "@/components/ui/ToolInput";
import { ToolResultArea } from "@/components/ui/ToolResultArea";
import { 
  Hash, 
  FileCode, 
  Terminal, 
  Trash2, 
  ShieldCheck,
  Lock,
  Zap,
  Loader2,
  Clock
} from "lucide-react";
import { m, AnimatePresence } from "framer-motion";
import { cn } from "@/src/lib/utils";

const ALGOS = ["MD5", "SHA-1", "SHA-224", "SHA-256", "SHA-384", "SHA-512"];

interface HashResult {
  algo: string;
  value: string;
  error?: string;
  loading?: boolean;
}

export default function HashGeneratorClient() {
  const [mode, setMode] = useState<"text" | "file">("text");
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [hmacKey, setHmacKey] = useState("");
  const [useHmac, setHmac] = useState(false);
  const [selectedAlgos, setSelectedAlgos] = useState<string[]>(["SHA-256"]);
  const [encoding, setEncoding] = useState<'hex' | 'base64'>('hex');
  const [results, setHashes] = useState<Record<string, HashResult>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<TaskProgress | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const { toast } = useToast();

  const toggleAlgo = (algo: string) => {
    setSelectedAlgos(prev => 
      prev.includes(algo) ? prev.filter(a => a !== algo) : [...prev, algo]
    );
  };

  const generateHashes = useCallback(async () => {
    if ((mode === "text" && !text) || (mode === "file" && !file)) {
      setHashes({});
      return;
    }

    if (mode === "text" && text.length > 5 * 1024 * 1024) {
      toast("Text input is too large. Maximum size is 5MB.", "error");
      return;
    }

    if (abortControllerRef.current) abortControllerRef.current.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsProcessing(true);
    setProgress({ percent: 0, message: "Initializing..." });

    const newResults: Record<string, HashResult> = {};
    selectedAlgos.forEach(a => {
      newResults[a] = { algo: a, value: "", loading: true };
    });
    setHashes(newResults);

    try {
      if (mode === "text") {
        if (useHmac) {
          for (const algo of selectedAlgos) {
            if (algo === "MD5") {
              setHashes(prev => ({ ...prev, [algo]: { algo, value: "", error: "MD5 HMAC not supported" } }));
              continue;
            }
            const res = await workerManager.generateHmac(text, hmacKey, algo, encoding, undefined, controller.signal);
            setHashes(prev => ({ ...prev, [algo]: { algo, value: res } }));
          }
        } else {
          const res = await workerManager.generateHashes(text, selectedAlgos, encoding, (p) => setProgress(p), controller.signal);
          const final: Record<string, HashResult> = {};
          Object.entries(res).forEach(([algo, value]) => {
            final[algo] = { algo, value };
          });
          setHashes(final);
        }
      } else if (mode === "file" && file) {
        const buffer = await file.arrayBuffer();
        for (const algo of selectedAlgos) {
          let value = "";
          try {
            if (useHmac) {
              if (algo === "MD5") {
                setHashes(prev => ({ ...prev, [algo]: { algo, value: "", error: "MD5 HMAC not supported" } }));
                continue;
              }
              value = await workerManager.generateFileHmac(buffer.slice(0), hmacKey, algo, encoding, undefined, controller.signal);
            } else {
              value = await workerManager.generateFileHash(buffer.slice(0), algo, encoding, undefined, controller.signal);
            }
            setHashes(prev => ({ ...prev, [algo]: { algo, value } }));
          } catch (e: any) {
            setHashes(prev => ({ ...prev, [algo]: { algo, value: "", error: e.message } }));
          }
        }
      }
    } catch (err: any) {
      if (err.message !== "Task cancelled") {
        console.error("Hash generation failed", err);
      }
    } finally {
      setIsProcessing(false);
      setProgress(null);
    }
  }, [mode, text, file, selectedAlgos, hmacKey, useHmac, encoding, toast]);

  useEffect(() => {
    if (mode === "text") {
      const timer = setTimeout(() => generateHashes(), 300);
      return () => clearTimeout(timer);
    }
  }, [text, mode, generateHashes]);

  useEffect(() => {
    if (mode === "file" || useHmac || selectedAlgos.length > 0 || encoding) {
      generateHashes();
    }
  }, [mode, file, useHmac, selectedAlgos, encoding, generateHashes]);

  const handleFiles = (files: File[] | FileList) => {
    const f = files instanceof FileList ? files[0] : files[0];
    if (!f) return;
    if (f.size > 100 * 1024 * 1024) {
      toast(`File too large: ${f.name}. Maximum size is 100MB.`, "error");
      return;
    }
    setFile(f);
  };

  return (
    <ToolWorkspace
      layout="split"
      tabs={{
        options: [
          { id: "text", label: "Text", icon: <Hash size={16} /> },
          { id: "file", label: "File", icon: <FileCode size={16} /> }
        ],
        activeId: mode,
        onChange: (id) => setMode(id as "text" | "file")
      }}
      input={
        <div className="flex flex-col h-full space-y-4">
          <AnimatePresence mode="wait">
            {mode === "text" ? (
              <m.div
                key="text-input"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col h-full space-y-2"
              >
                <div className="flex justify-between items-center px-1">
                  <span className="text-sm font-bold text-text-2">Enter Text Content</span>
                  <div className="flex gap-4">
                    <span className="text-xs font-mono font-bold text-blue">{text.length} chars</span>
                    <button 
                      onClick={() => setText("")}
                      className="text-xs font-bold text-red-500 hover:underline"
                    >
                      Clear
                    </button>
                  </div>
                </div>
                <ToolInput
                  value={text}
                  onChange={setText}
                  placeholder="Type or paste content here..."
                  mono
                  className="flex-1 min-h-52 resize-none"
                />
              </m.div>
            ) : (
              <m.div
                key="file-input"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col h-full space-y-4"
              >
                <DropZone
                  onFilesSelected={handleFiles}
                  accept="*"
                  multiple={false}
                  title="Drop a file to hash"
                  description="All file types supported. Local processing only."
                  className="flex-1 min-h-52"
                />
                {file && (
                  <div className="bg-bg border border-border px-6 py-4 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue/10 flex items-center justify-center text-blue">
                         <FileCode size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold truncate max-w-52">{file.name}</p>
                        <p className="text-tiny font-bold uppercase tracking-widest-sm text-text-muted">{(file.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setFile(null)}
                      className="p-2 text-text-muted hover:text-red-500 transition-all rounded-lg"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                )}
              </m.div>
            )}
          </AnimatePresence>
        </div>
      }
      optionsPanel={
        <div className="space-y-6">
          <h3 className="text-tiny font-bold uppercase tracking-widest-sm text-text-muted">Options</h3>
          
          <div className="space-y-4">
            <label className="text-sm font-bold text-text-2">Algorithms</label>
            <div className="grid grid-cols-2 gap-2">
              {ALGOS.map(algo => (
                <button
                  key={algo}
                  onClick={() => toggleAlgo(algo)}
                  className={cn(
                    "px-4 py-3 rounded-xl border text-tiny font-bold uppercase tracking-widest-sm transition-all text-center",
                    selectedAlgos.includes(algo) 
                      ? "bg-blue border-blue text-white shadow-md shadow-blue/20" 
                      : "bg-bg border-border text-text-muted hover:border-blue/30"
                  )}
                >
                  {algo}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-border">
            <label className="text-sm font-bold text-text-2">Output Encoding</label>
            <div className="flex p-1 bg-bg border border-border rounded-xl">
              {(['hex', 'base64'] as const).map(enc => (
                <button
                  key={enc}
                  onClick={() => setEncoding(enc)}
                  className={cn(
                    "flex-1 py-2 rounded-lg text-tiny font-bold uppercase tracking-widest-sm transition-all",
                    encoding === enc ? "bg-surface text-blue shadow-sm" : "text-text-muted hover:text-text"
                  )}
                >
                  {enc}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-text-2 flex items-center gap-2">
                HMAC Support
              </label>
              <button
                onClick={() => setHmac(!useHmac)}
                className={cn(
                  "w-10 h-5 rounded-full relative transition-all",
                  useHmac ? "bg-blue" : "bg-border"
                )}
              >
                <div className={cn(
                  "absolute top-1 w-3 h-3 rounded-full bg-white transition-all",
                  useHmac ? "right-1" : "left-1"
                )} />
              </button>
            </div>

            {useHmac && (
              <m.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-3"
              >
                <ToolInput
                  value={hmacKey}
                  onChange={setHmacKey}
                  placeholder="Enter HMAC Secret Key..."
                  type="password"
                />
                <p className="text-tiny text-text-muted leading-relaxed italic">
                  HMAC uses a secret key for verifiable authentication.
                </p>
              </m.div>
            )}
          </div>

          <div className="p-4 bg-bg border border-border rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-blue">
              <Terminal size={14} />
              <span className="text-tiny font-bold uppercase tracking-widest-sm">Runtime Note</span>
            </div>
            <p className="text-tiny text-text-muted font-medium leading-relaxed">
              All operations are performed on-device via Web Crypto API.
            </p>
          </div>
        </div>
      }
      output={
        <div className="space-y-6">
          <div className="flex items-center justify-between">
             <h3 className="text-tiny font-bold uppercase tracking-widest-sm text-text-muted">Generated Hashes</h3>
             {progress && (
                <div className="text-xs font-bold text-blue uppercase tracking-widest flex items-center gap-2">
                  <span className="animate-pulse">{progress.message}</span>
                  <span>{Math.round(progress.percent)}%</span>
                </div>
              )}
          </div>
          
          <div className="grid gap-4">
            {selectedAlgos.map(algo => {
              const res = results[algo];
              return (
                <ToolResultArea
                  key={algo}
                  label={useHmac ? `HMAC-${algo}` : algo}
                  value={res?.value || ''}
                  error={res?.error}
                  downloadFilename={`hash-${algo.toLowerCase()}.txt`}
                  contentClassName="min-h-16 h-auto" // overrides the min-h-30 to be compact
                />
              );
            })}
            
            {selectedAlgos.length === 0 && (
              <p className="text-sm text-text-muted italic">Select at least one algorithm.</p>
            )}
          </div>
        </div>
      }
      infoPanel={
        !isProcessing && Object.keys(results).length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 opacity-60 max-w-4xl mx-auto">
            {[
              { icon: ShieldCheck, title: "Web Crypto", desc: "Native browser security" },
              { icon: Lock, title: "Zero Uploads", desc: "Privacy by architecture" },
              { icon: Zap, title: "Multi-Algo", desc: "Generate multiple at once" }
            ].map((item, i) => {
              const Icon = item.icon as any;
              return (
                <div key={i} className="flex flex-col items-center text-center space-y-2 p-6 border border-border rounded-4xl">
                  <Icon className="text-blue" size={24} />
                  <h3 className="text-tiny font-bold uppercase tracking-widest-sm">{item.title}</h3>
                  <p className="text-tiny font-medium text-text-muted uppercase">{item.desc}</p>
                </div>
              );
            })}
          </div>
        ) : undefined
      }
    />
  );
}
