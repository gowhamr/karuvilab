"use client";
import { useState, useEffect } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { CopyButton } from "@/components/ui/CopyButton";
import { workerManager } from "@/src/workers/manager";
import { TaskProgress } from "@/src/workers/types";

const cat = CATEGORIES.find(c => c.id === "security")!;

export default function HashGeneratorClient() {
  const [input, setInput] = useState("");
  const [hashes, setHashes] = useState({ md5: "", sha1: "", sha256: "", sha512: "" });
  const [progress, setProgress] = useState<TaskProgress | null>(null);

  useEffect(() => {
    if (!input) {
      setHashes({ md5: "", sha1: "", sha256: "", sha512: "" });
      setProgress(null);
      return;
    }

    const controller = new AbortController();
    setProgress({ percent: 0, message: "Starting..." });

    workerManager.generateHashes(
      input, 
      ["MD5", "SHA-1", "SHA-256", "SHA-512"],
      (p) => setProgress(p),
      controller.signal
    ).then((res) => {
      setHashes({
        md5: res["MD5"]!,
        sha1: res["SHA-1"]!,
        sha256: res["SHA-256"]!,
        sha512: res["SHA-512"]!
      });
      setProgress(null);
    }).catch(err => {
      if (err.message !== "Task cancelled") {
        console.error("Hash generation failed", err);
      }
    });

    return () => controller.abort();
  }, [input]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setInput(ev.target?.result as string ?? "");
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-4">
        <label className="text-sm font-bold text-text-2">Input Text</label>
        <textarea
          className="w-full px-4 py-3 bg-bg border border-border rounded-xl font-mono text-sm focus:ring-2 focus:ring-blue outline-none transition-all resize-none"
          rows={5}
          placeholder="Enter text to hash..."
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <div className="flex items-center justify-between">
          <p className="text-xs text-text-4">{input.length} characters</p>
          <label className="cursor-pointer text-xs font-medium text-blue hover:underline">
            Or upload a file
            <input type="file" className="hidden" onChange={handleFile} />
          </label>
        </div>
      </div>

      {input && (
        <div className="space-y-3">
          {progress && (
            <div className="bg-blue/5 border border-blue/10 p-4 rounded-xl flex items-center justify-between">
              <span className="text-xs font-bold text-blue uppercase tracking-widest">{progress.message}</span>
              <div className="w-32 h-1 bg-blue/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue transition-all duration-300" 
                  style={{ width: `${progress.percent}%` }}
                />
              </div>
            </div>
          )}
          {[
            { label: "MD5", value: hashes.md5 },
            { label: "SHA-1", value: hashes.sha1 },
            { label: "SHA-256", value: hashes.sha256 },
            { label: "SHA-512", value: hashes.sha512 },
          ].map(({ label, value }) => (
            <div key={label} className="bg-surface border border-border p-4 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-text-4 uppercase tracking-wider">{label}</span>
                {value && <CopyButton text={value} />}
              </div>
              <div className="font-mono text-sm text-text break-all">
                {value || <span className="text-text-4 italic">Computing…</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
