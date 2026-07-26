"use client";
import { useState, useMemo } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { CopyButton } from "@/components/ui/CopyButton";

const cat = CATEGORIES.find(c => c.id === "security")!;

function parseURL(input: string) {
  try {
    const url = new URL(input);
    const params: { key: string; value: string }[] = [];
    url.searchParams.forEach((v, k) => params.push({ key: k, value: v }));
    return {
      protocol: url.protocol,
      hostname: url.hostname,
      port: url.port,
      pathname: url.pathname,
      hash: url.hash,
      params,
    };
  } catch {
    return null;
  }
}

export default function URLEncoderClient() {
  const [tab, setTab] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");

  const { output, error } = useMemo(() => {
    if (!input) return { output: "", error: "" };
    try {
      const res = tab === "encode" ? encodeURIComponent(input) : decodeURIComponent(input);
      return { output: res, error: "" };
    } catch {
      return { output: "", error: "Invalid URI sequence" };
    }
  }, [input, tab]);

  const parsed = input ? parseURL(input) : null;

  return (
    <div className="space-y-6">
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
          <label htmlFor="url-encoder-input" className="text-sm font-bold text-text-2">Input</label>
          <textarea
            id="url-encoder-input"
            className="w-full px-4 py-3 bg-bg border border-border rounded-xl font-mono text-sm focus:ring-2 focus:ring-blue outline-none transition-all resize-none"
            rows={4}
            placeholder={tab === "encode" ? "Enter text or URL to encode…" : "Enter encoded URL to decode…"}
            value={input}
            onChange={e => setInput(e.target.value)}
          />
        </div>

        {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

        {output && !error && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-text-2">Output</label>
              <CopyButton text={output} />
            </div>
            <div className="w-full px-4 py-3 bg-bg border border-border rounded-xl font-mono text-sm text-text break-all">
              {output}
            </div>
          </div>
        )}
      </div>

      {parsed && (
        <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-text-2">URL Parse</h2>
          <dl className="grid grid-cols-2 gap-3 text-sm">
            {[
              { label: "Protocol", value: parsed.protocol },
              { label: "Hostname", value: parsed.hostname },
              { label: "Port", value: parsed.port || "(default)" },
              { label: "Pathname", value: parsed.pathname },
              { label: "Hash", value: parsed.hash || "(none)" },
            ].map(({ label, value }) => (
              <div key={label} className="bg-bg border border-border rounded-xl p-3">
                <dt className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">{label}</dt>
                <dd className="font-mono text-text break-all">{value}</dd>
              </div>
            ))}
          </dl>

          {parsed.params.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Query Parameters</h3>
              <div className="overflow-auto rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-bg">
                      <th className="text-left px-4 py-2 font-bold text-text-muted">Parameter</th>
                      <th className="text-left px-4 py-2 font-bold text-text-muted">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsed.params.map(({ key, value }, i) => (
                      <tr key={i} className="border-b border-border last:border-0">
                        <td className="px-4 py-2 font-mono text-blue">{key}</td>
                        <td className="px-4 py-2 font-mono text-text break-all">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
