"use client";

import { useState, useMemo } from "react";
import { ToolInput } from "@/components/ui/ToolInput";
import { ToolResultArea } from "@/components/ui/ToolResultArea";
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
    <div className="bg-surface border border-border p-6 md:p-8 rounded-3xl shadow-sm space-y-8">
      {/* Tab Switcher */}
      <div className="flex p-1 bg-bg border border-border rounded-2xl w-fit">
        {(["encode", "decode"] as const).map(t => (
          <button
            key={t}
            onClick={() => { setTab(t); setInput(""); }}
            className={`px-6 py-2 rounded-xl text-sm font-black transition-all ${tab === t ? "bg-blue text-white shadow-lg shadow-blue/20" : "text-text-3 hover:text-text"}`}
          >
            {t === "encode" ? "Encode" : "Decode"}
          </button>
        ))}
      </div>

      {/* Input Section */}
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
            className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all group-hover:scale-110 ${urlSafe ? "bg-blue border-blue shadow-lg shadow-blue/20" : "border-border bg-bg"}`}
          >
            {urlSafe && (
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          <div className="space-y-0.5">
            <span className="text-sm font-bold text-text-2">URL-safe Base64</span>
            <p className="text-[10px] text-text-4 font-medium uppercase tracking-tighter">+→-, /→_, no padding</p>
          </div>
        </label>
      </div>

      {/* Result Section */}
      <div className="pt-4 border-t border-border/50">
        <ToolResultArea
          label={tab === "encode" ? "Base64 Output" : "Decoded Text"}
          value={output}
          error={error}
          onClear={() => setInput("")}
          onDownload={() => {}}
          language={tab === "encode" ? "Base64" : "UTF-8"}
        />
      </div>
    </div>
  );
}
