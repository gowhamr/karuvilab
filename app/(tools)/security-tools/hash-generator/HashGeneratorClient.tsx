"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { CopyButton } from "@/components/ui/CopyButton";
import { workerManager } from "@/src/workers/manager";
import { TaskProgress } from "@/src/workers/types";
import { DropZone } from "@/components/ui/DropZone";
import { useObjectUrlManager } from "@/src/lib/hooks";
import { 
  Hash, 
  FileCode, 
  Settings2, 
  Key, 
  Terminal, 
  Trash2, 
  Download,
  CircleAlert as AlertCircle,
  CircleCheckBig as CheckCircle2,
  LoaderCircle as Loader2,
  Clock,
  ShieldCheck,
  Lock,
  Zap
} from "lucide-react";
import { m, AnimatePresence } from "framer-motion";
import { cn } from "@/src/lib/utils";

const toolId = "hash-generator";
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
          // HMAC needs SHA algorithms
          for (const algo of selectedAlgos) {
            if (algo === "MD5") {
              setHashes(prev => ({ ...prev, [algo]: { algo, value: "", error: "MD5 HMAC not supported in browser Web Crypto" } }));
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
  }, [mode, text, file, selectedAlgos, hmacKey, useHmac, encoding]);

  // Real-time update for text
  useEffect(() => {
    if (mode === "text") {
      const timer = setTimeout(() => generateHashes(), 300);
      return () => clearTimeout(timer);
    }
  }, [text, mode, generateHashes]);

  // Manual trigger for file or when settings change
  useEffect(() => {
    if (mode === "file" || useHmac || selectedAlgos.length > 0 || encoding) {
      generateHashes();
    }
  }, [mode, file, useHmac, selectedAlgos, encoding, generateHashes]);

  const handleFiles = (files: File[] | FileList) => {
    const f = files instanceof FileList ? files[0] : files[0];
    if (f) setFile(f);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Mode Switcher */}
      <div className="flex p-1 bg-surface border border-border rounded-2xl w-fit mx-auto shadow-sm">
        <button
          onClick={() => setMode("text")}
          className={cn(
            "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
            mode === "text" ? "bg-blue text-white shadow-md shadow-blue/10 scale-102" : "text-text-4 hover:text-text"
          )}
        >
          <Hash size={16} /> Text
        </button>
        <button
          onClick={() => setMode("file")}
          className={cn(
            "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
            mode === "file" ? "bg-blue text-white shadow-md shadow-blue/10 scale-102" : "text-text-4 hover:text-text"
          )}
        >
          <FileCode size={16} /> File
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Input Area */}
        <div className="lg:col-span-7 space-y-6">
          <AnimatePresence mode="wait">
            {mode === "text" ? (
              <m.div
                key="text-input"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="bg-surface border border-border p-6 rounded-4xl shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-tiny font-bold uppercase tracking-widest-sm text-text-4">Enter Text Content</label>
                    <span className="text-xs font-mono font-bold text-blue bg-blue/5 px-2 py-0.5 rounded-md">{text.length} chars</span>
                  </div>
                  <textarea
                    className="w-full px-5 py-4 bg-bg border border-border rounded-2xl font-mono text-sm focus:ring-4 focus:ring-blue/5 focus:border-blue outline-none transition-all resize-none min-h-52"
                    placeholder="Type or paste content here..."
                    value={text}
                    onChange={e => setText(e.target.value)}
                  />
                  {text && (
                    <button 
                      onClick={() => setText("")}
                      className="text-tiny font-bold uppercase tracking-widest-sm text-red-500 hover:text-red-600 transition-colors flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded-sm"
                    >
                      <Trash2 size={12} /> Clear Text
                    </button>
                  )}
                </div>
              </m.div>
            ) : (
              <m.div
                key="file-input"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <DropZone
                  onFilesSelected={handleFiles}
                  accept="*"
                  multiple={false}
                  title="Drop a file to hash"
                  description="All file types supported. Local processing only."
                  className="aspect-video lg:aspect-auto lg:h-72 rounded-4xl"
                />
                {file && (
                  <div className="bg-surface border border-border px-6 py-4 rounded-2xl flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue/10 flex items-center justify-center text-blue">
                        <FileCode size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold truncate max-w-52">{file.name}</p>
                        <p className="text-tiny font-bold uppercase tracking-widest-sm text-text-4">{(file.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setFile(null)}
                      className="p-2 text-text-4 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded-lg"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                )}
              </m.div>
            )}
          </AnimatePresence>
        </div>

        {/* Settings Area */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-surface border border-border p-6 rounded-4xl shadow-sm space-y-8">
            <div className="flex items-center gap-2 mb-2">
              <Settings2 size={18} className="text-blue" aria-hidden="true" />
              <h2 className="text-sm font-black uppercase tracking-widest text-text">Options</h2>
            </div>

            {/* Algorithm Selection */}
            <div className="space-y-4">
              <label className="text-tiny font-bold uppercase tracking-widest-sm text-text-4">Algorithms</label>
              <div className="grid grid-cols-2 gap-2">
                {ALGOS.map(algo => (
                  <button
                    key={algo}
                    onClick={() => toggleAlgo(algo)}
                    className={cn(
                      "px-4 py-3 rounded-xl border text-tiny font-bold uppercase tracking-widest-sm transition-all text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue",
                      selectedAlgos.includes(algo) 
                        ? "bg-blue border-blue text-white shadow-md shadow-blue/20" 
                        : "bg-bg border-border text-text-4 hover:border-blue/30"
                    )}
                  >
                    {algo}
                  </button>
                ))}
              </div>
            </div>

            {/* Output Encoding */}
            <div className="space-y-4 pt-4 border-t border-border">
              <label className="text-tiny font-bold uppercase tracking-widest-sm text-text-4">Output Encoding</label>
              <div className="flex p-1 bg-bg border border-border rounded-xl">
                {(['hex', 'base64'] as const).map(enc => (
                  <button
                    key={enc}
                    onClick={() => setEncoding(enc)}
                    className={cn(
                      "flex-1 py-2 rounded-lg text-tiny font-bold uppercase tracking-widest-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue",
                      encoding === enc ? "bg-surface text-blue shadow-sm" : "text-text-4 hover:text-text"
                    )}
                  >
                    {enc}
                  </button>
                ))}
              </div>
            </div>

            {/* HMAC Support */}
            <div className="space-y-4 pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <label className="text-tiny font-bold uppercase tracking-widest-sm text-text-4 flex items-center gap-2">
                  <Key size={12} className={useHmac ? "text-blue" : "text-text-4"} aria-hidden="true" /> HMAC Support
                </label>
                <button
                  onClick={() => setHmac(!useHmac)}
                  aria-label="Toggle HMAC Support"
                  aria-pressed={useHmac}
                  className={cn(
                    "w-10 h-5 rounded-full relative transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
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
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-xs font-mono outline-none focus:border-blue transition-all"
                      placeholder="Enter HMAC Secret Key..."
                      value={hmacKey}
                      onChange={e => setHmacKey(e.target.value)}
                    />
                    <Key size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-4" aria-hidden="true" />
                  </div>
                  <p className="text-tiny text-text-4 leading-relaxed italic">
                    HMAC (Hash-based Message Authentication Code) uses a secret key for verifiable authentication.
                  </p>
                </m.div>
              )}
            </div>

            {/* Info Box */}
            <div className="p-4 bg-bg border border-border rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-blue">
                <Terminal size={14} aria-hidden="true" />
                <span className="text-tiny font-bold uppercase tracking-widest-sm">Runtime Note</span>
              </div>
              <p className="text-tiny text-text-4 font-medium leading-relaxed">
                All cryptographic operations are performed on-device via Web Crypto API. Your keys and data are never transmitted.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Results Area */}
      <AnimatePresence>
        {(Object.keys(results).length > 0 || isProcessing) && (
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between px-2">
              <h2 className="text-tiny font-bold uppercase tracking-widest-sm text-text flex items-center gap-2">
                Generated Hashes {isProcessing && <Loader2 size={12} className="animate-spin text-blue" aria-hidden="true" />}
              </h2>
              {progress && (
                <div className="text-xs font-bold text-blue uppercase tracking-widest flex items-center gap-2">
                  <span className="animate-pulse">{progress.message}</span>
                  <span>{Math.round(progress.percent)}%</span>
                </div>
              )}
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {selectedAlgos.map(algo => {
                const res = results[algo];
                return (
                  <div 
                    key={algo} 
                    className={cn(
                      "bg-surface border p-4 md:p-6 rounded-3xl shadow-sm transition-all",
                      res?.loading ? "opacity-50 border-border" : "border-border"
                    )}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black transition-colors",
                          res?.loading ? "bg-bg text-text-4" : 
                          res?.error ? "bg-red-500/10 text-red-500" : "bg-blue/10 text-blue"
                        )}>
                          {algo.split('-')[1] || algo}
                        </div>
                        <span className="text-tiny font-bold uppercase tracking-widest-sm text-text-4">
                          {useHmac ? `HMAC-${algo}` : algo}
                        </span>
                      </div>
                      {!res?.loading && res?.value && <CopyButton text={res.value} className="bg-bg border border-border" />}
                    </div>

                    <div className="relative group min-h-15 flex items-center">
                      {res?.loading ? (
                        <div className="flex items-center gap-3 text-text-4">
                          <Clock size={16} className="animate-pulse" aria-hidden="true" />
                          <span className="text-xs font-mono italic">Calculating...</span>
                        </div>
                      ) : res?.error ? (
                        <div className="flex items-start gap-2 text-red-500 bg-red-500/5 p-3 rounded-xl w-full border border-red-500/10">
                          <AlertCircle size={14} className="mt-0.5" aria-hidden="true" />
                          <span className="text-xs font-bold leading-relaxed">{res.error}</span>
                        </div>
                      ) : res?.value ? (
                        <div className="w-full font-mono text-sm text-text break-all bg-bg/50 p-4 rounded-2xl border border-border/50 group-hover:border-blue/30 transition-all select-all">
                          {res.value}
                        </div>
                      ) : (
                        <span className="text-xs text-text-4 italic">Waiting for input...</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </m.div>
        )}
      </AnimatePresence>

      {/* Security Disclaimer */}
      {!isProcessing && Object.keys(results).length === 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 opacity-60">
          {[
            { icon: ShieldCheck, title: "Web Crypto", desc: "Native browser security" },
            { icon: Lock, title: "Zero Uploads", desc: "Privacy by architecture" },
            { icon: Zap, title: "Multi-Algo", desc: "Generate multiple at once" }
          ].map((item, i) => {
            const Icon = item.icon as any;
            return (
              <div key={i} className="flex flex-col items-center text-center space-y-2 p-6 border border-border rounded-4xl">
                <Icon className="text-blue" size={24} aria-hidden="true" />
                <h3 className="text-tiny font-bold uppercase tracking-widest-sm">{item.title}</h3>
                <p className="text-tiny font-medium text-text-4 uppercase">{item.desc}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

