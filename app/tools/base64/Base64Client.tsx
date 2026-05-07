"use client";

import { useState, useMemo } from "react";
import { CopyButton } from "@/components/ui/CopyButton";
import { b64EncodeUtf8, b64DecodeUtf8 } from "@/src/utils";

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
  const [input, setInput] = useState("");
  const [urlSafe, setUrlSafe] = useState(false);

  const { output, error } = useMemo(() => {
    if (!input) return { output: "", error: "" };
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
  }, [input, tab, urlSafe]);

  return (
    <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-5">
      <div className="flex gap-2">
        {(["encode", "decode"] as const).map(t => (
          <button
            key={t}
            onClick={() => { setTab(t); setInput(""); }}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${tab === t ? "bg-blue text-white" : "bg-bg border border-border text-text-2 hover:border-blue"}`}
          >
            {t === "encode" ? "Encode" : "Decode"}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-text-2">
          {tab === "encode" ? "Plain Text" : "Base64 Input"}
        </label>
        <textarea
          className="w-full px-4 py-3 bg-bg border border-border rounded-xl font-mono text-sm focus:ring-2 focus:ring-blue outline-none transition-all resize-none"
          rows={5}
          placeholder={tab === "encode" ? "Enter text to encode…" : "Paste Base64 string…"}
          value={input}
          onChange={e => setInput(e.target.value)}
        />
      </div>

      <label className="flex items-center gap-2 cursor-pointer select-none">
        <div
          onClick={() => setUrlSafe(v => !v)}
          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${urlSafe ? "bg-blue border-blue" : "border-border"}`}
        >
          {urlSafe && <span className="text-white text-xs font-bold">✓</span>}
        </div>
        <span className="text-sm text-text-2">URL-safe Base64 (+→-, /→_, no padding)</span>
      </label>

      {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

      {output && !error && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-text-2">
              {tab === "encode" ? "Base64 Output" : "Decoded Text"}
            </label>
            <CopyButton text={output} />
          </div>
          <div className="w-full px-4 py-3 bg-bg border border-border rounded-xl font-mono text-sm text-text break-all">
            {output}
          </div>
        </div>
      )}
    </div>
  );
}
