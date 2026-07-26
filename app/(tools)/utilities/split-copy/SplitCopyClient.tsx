"use client";
import { useState, useMemo } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { CopyButton } from "@/components/ui/CopyButton";

const cat = CATEGORIES.find(c => c.id === "utilities")!;

type SplitMethod = "equal" | "chars" | "delimiter" | "custom";

function splitText(text: string, method: SplitMethod, parts: number, chars: number, delimiter: string, custom: string): string[] {
  if (!text) return [];
  switch (method) {
    case "equal": {
      const size = Math.ceil(text.length / parts);
      return Array.from({ length: parts }, (_, i) => text.slice(i * size, (i + 1) * size)).filter(Boolean);
    }
    case "chars": {
      const chunks: string[] = [];
      for (let i = 0; i < text.length; i += chars) chunks.push(text.slice(i, i + chars));
      return chunks;
    }
    case "delimiter": {
      const parsedDelimiter = delimiter.replace(/\\n/g, '\n').replace(/\\t/g, '\t');
      const escaped = parsedDelimiter.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      return text.split(new RegExp(escaped)).filter(s => s.trim() !== "");
    }
    case "custom": {
      if (!custom) return [text];
      const lines = text.split("\n");
      const linesPerChunk = Math.max(1, Number(custom) || 10);
      const chunks: string[] = [];
      for (let i = 0; i < lines.length; i += linesPerChunk) {
        chunks.push(lines.slice(i, i + linesPerChunk).join("\n"));
      }
      return chunks.filter(Boolean);
    }
    default: return [text];
  }
}

export default function SplitCopyClient() {
  const [input, setInput] = useState("");
  const [method, setMethod] = useState<SplitMethod>("equal");
  const [parts, setParts] = useState(3);
  const [chars, setChars] = useState(500);
  const [delimiter, setDelimiter] = useState("\n\n");
  const [customLines, setCustomLines] = useState("10");

  const chunks = useMemo(
    () => splitText(input, method, parts, chars, delimiter, customLines),
    [input, method, parts, chars, delimiter, customLines]
  );

  const allAsNumbered = chunks.map((c, i) => `[${i + 1}/${chunks.length}]\n${c}`).join("\n\n---\n\n");

  return (
    <div className="space-y-6">
      <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-5">
        <div className="space-y-2">
          <label htmlFor="split-input" className="text-sm font-bold text-text-2">Input Text</label>
          <textarea
            id="split-input"
            className="w-full px-4 py-3 bg-bg border border-border rounded-xl font-mono text-sm focus:ring-2 focus:ring-blue outline-none transition-all resize-none"
            rows={6}
            placeholder="Paste your long text here…"
            value={input}
            onChange={e => setInput(e.target.value)}
          />
          <p className="text-xs text-text-muted">{input.length} characters</p>
        </div>

        <div className="space-y-3">
          <label id="split-method-label" className="text-sm font-bold text-text-2">Split Method</label>
          <div role="group" aria-labelledby="split-method-label" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
            {([
              ["equal", "Equal Parts"],
              ["chars", "By Char Count"],
              ["delimiter", "By Delimiter"],
              ["custom", "By Line Count"],
            ] as [SplitMethod, string][]).map(([m, label]) => (
              <button
                key={m}
                onClick={() => setMethod(m)}
                className={`px-3 py-2 rounded-xl text-sm font-bold transition-all ${method === m ? "bg-blue text-white" : "bg-bg border border-border text-text-2 hover:border-blue"}`}
              >
                {label}
              </button>
            ))}
          </div>

          {method === "equal" && (
            <div className="flex items-center gap-3">
              <label htmlFor="split-parts" className="text-sm text-text-3 min-w-max">Number of parts:</label>
              <input
                id="split-parts"
                type="number"
                min={2}
                max={100}
                className="w-24 px-3 py-2 bg-bg border border-border rounded-xl text-sm font-mono focus:ring-2 focus:ring-blue outline-none"
                value={parts}
                onChange={e => setParts(Number(e.target.value))}
              />
            </div>
          )}
          {method === "chars" && (
            <div className="flex items-center gap-3">
              <label htmlFor="split-chars" className="text-sm text-text-3 min-w-max">Characters per chunk:</label>
              <input
                id="split-chars"
                type="number"
                min={1}
                className="w-28 px-3 py-2 bg-bg border border-border rounded-xl text-sm font-mono focus:ring-2 focus:ring-blue outline-none"
                value={chars}
                onChange={e => setChars(Number(e.target.value))}
              />
            </div>
          )}
          {method === "delimiter" && (
            <div className="flex items-center gap-3">
              <label htmlFor="split-delim" className="text-sm text-text-3 min-w-max">Delimiter:</label>
              <input
                id="split-delim"
                type="text"
                className="flex-1 px-3 py-2 bg-bg border border-border rounded-xl text-sm font-mono focus:ring-2 focus:ring-blue outline-none"
                placeholder="\n\n or , or any string"
                value={delimiter}
                onChange={e => setDelimiter(e.target.value)}
              />
            </div>
          )}
          {method === "custom" && (
            <div className="flex items-center gap-3">
              <label htmlFor="split-lines" className="text-sm text-text-3 min-w-max">Lines per chunk:</label>
              <input
                id="split-lines"
                type="number"
                min={1}
                className="w-24 px-3 py-2 bg-bg border border-border rounded-xl text-sm font-mono focus:ring-2 focus:ring-blue outline-none"
                value={customLines}
                onChange={e => setCustomLines(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>

      {chunks.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-text-2">{chunks.length} chunks</p>
            <CopyButton text={allAsNumbered} label="Copy All (Numbered)" />
          </div>
          <div className="space-y-3">
            {chunks.map((chunk, i) => (
              <div key={i} className="bg-surface border border-border p-4 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
                    Chunk {i + 1} / {chunks.length} — {chunk.length} chars
                  </span>
                  <CopyButton text={chunk} />
                </div>
                <div className="font-mono text-sm text-text bg-bg border border-border rounded-xl px-3 py-2 max-h-32 overflow-y-auto whitespace-pre-wrap">
                  {chunk}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
