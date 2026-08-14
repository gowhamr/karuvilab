"use client";
import { useState, useMemo } from "react";
import { ToolWorkspace } from "@/components/ui/ToolWorkspace";
import { ToolResultArea } from "@/components/ui/ToolResultArea";

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
    <ToolWorkspace
      tabs={{
        options: [
          { id: "encode", label: "Encode" },
          { id: "decode", label: "Decode" },
        ],
        activeId: tab,
        onChange: (t) => {
          setTab(t);
          setInput("");
        },
      }}
      input={
        <div className="space-y-2 flex flex-col h-full">
          <label htmlFor="url-encoder-input" className="text-sm font-bold text-text-2">Input</label>
          <textarea
            id="url-encoder-input"
            className="w-full flex-1 min-h-[150px] px-4 py-3 bg-bg border border-border rounded-xl font-mono text-sm focus:ring-2 focus:ring-blue outline-none transition-all resize-none"
            placeholder={tab === "encode" ? "Enter text or URL to encode…" : "Enter encoded URL to decode…"}
            value={input}
            onChange={e => setInput(e.target.value)}
          />
        </div>
      }
      output={
        <ToolResultArea
          label="Output"
          value={output}
          error={error || undefined}
        />
      }
      infoPanel={
        parsed ? (
          <div className="bg-surface border border-border p-4 sm:p-6 rounded-4xl shadow-sm space-y-4">
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
        ) : null
      }
    />
  );
}
