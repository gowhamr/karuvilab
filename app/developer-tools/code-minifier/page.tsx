"use client";
import { useState, useEffect } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { CopyButton } from "@/components/ui/CopyButton";
import { workerManager } from "@/src/workers/manager";
import { TaskProgress } from "@/src/workers/types";

const cat = CATEGORIES.find(c => c.id === "developer")!;

type Lang = "css" | "js" | "html";

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

export default function CodeMinifier() {
  const [lang, setLang] = useState<Lang>("css");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState<TaskProgress | null>(null);

  useEffect(() => {
    if (!input) {
      setOutput("");
      setProgress(null);
      return;
    }

    const controller = new AbortController();
    setProcessing(true);
    setProgress({ percent: 0, message: "Starting..." });

    workerManager.minifyCode(
      input,
      lang,
      (p) => setProgress(p),
      controller.signal
    ).then(res => {
      setOutput(res);
      setProgress(null);
    }).catch(err => {
      if (err.message !== "Task cancelled") {
        console.error("Minification failed", err);
      }
    }).finally(() => {
      setProcessing(false);
    });

    return () => controller.abort();
  }, [input, lang]);

  const originalSize = new TextEncoder().encode(input).length;
  const minifiedSize = new TextEncoder().encode(output).length;
  const reduction = originalSize > 0 ? Math.round((1 - minifiedSize / originalSize) * 100) : 0;

  return (
    <ToolShell title="Code Minifier" description="Remove comments and whitespace from CSS, JavaScript, and HTML. Basic minification — not full AST-level." category={cat}>
      <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-5">
        <div className="flex gap-2">
          {(["css", "js", "html"] as Lang[]).map(l => (
            <button
              key={l}
              onClick={() => { setLang(l); setInput(""); }}
              className={`px-5 py-2 rounded-xl text-sm font-bold uppercase transition-all ${lang === l ? "bg-blue text-white" : "bg-bg border border-border text-text-2 hover:border-blue"}`}
            >
              {l}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-text-2">Input</label>
          <textarea
            className="w-full px-4 py-3 bg-bg border border-border rounded-xl font-mono text-sm focus:ring-2 focus:ring-blue outline-none transition-all resize-none"
            rows={10}
            placeholder={`Paste your ${lang.toUpperCase()} here…`}
            value={input}
            onChange={e => setInput(e.target.value)}
          />
        </div>
      </div>

      {processing && (
        <div className="bg-blue/5 border border-blue/10 p-4 rounded-xl flex items-center justify-between">
          <span className="text-xs font-bold text-blue uppercase tracking-widest">{progress?.message || "Processing..."}</span>
          <div className="w-32 h-1 bg-blue/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue transition-all duration-300" 
              style={{ width: `${progress?.percent || 0}%` }}
            />
          </div>
        </div>
      )}

      {output && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-surface border border-border p-4 rounded-xl text-center">
              <div className="text-xs font-bold text-text-4 uppercase tracking-wider mb-1">Original</div>
              <div className="text-xl font-black text-text">{formatSize(originalSize)}</div>
            </div>
            <div className="bg-surface border border-border p-4 rounded-xl text-center">
              <div className="text-xs font-bold text-text-4 uppercase tracking-wider mb-1">Minified</div>
              <div className="text-xl font-black text-blue">{formatSize(minifiedSize)}</div>
            </div>
            <div className="bg-surface border border-border p-4 rounded-xl text-center">
              <div className="text-xs font-bold text-text-4 uppercase tracking-wider mb-1">Reduction</div>
              <div className="text-xl font-black text-green-500">{reduction}%</div>
            </div>
          </div>

          <div className="bg-surface border border-border p-5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-text-2">Minified Output</label>
              <CopyButton text={output} />
            </div>
            <textarea
              readOnly
              className="w-full px-4 py-3 bg-bg border border-border rounded-xl font-mono text-sm text-text resize-none outline-none"
              rows={8}
              value={output}
            />
          </div>
        </div>
      )}
    </ToolShell>
  );
}
