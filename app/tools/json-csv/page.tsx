"use client";
import { useState } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { CopyButton } from "@/components/ui/CopyButton";

const cat = CATEGORIES.find(c => c.id === "developer")!;

function jsonToCSV(json: string): string {
  const data = JSON.parse(json);
  if (!Array.isArray(data)) throw new Error("Input must be a JSON array of objects");
  if (data.length === 0) return "";
  const headers = Array.from(new Set(data.flatMap(row => Object.keys(row))));
  const escape = (v: unknown) => {
    const str = v == null ? "" : String(v);
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
  };
  const rows = data.map(row => headers.map(h => escape((row as Record<string, unknown>)[h])).join(","));
  return [headers.map(h => escape(h)).join(","), ...rows].join("\n");
}

function csvToJSON(csv: string): string {
  const lines = csv.trim().split("\n");
  if (lines.length < 2) throw new Error("CSV must have at least a header row and one data row");

  function parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
        else { inQuotes = !inQuotes; }
      } else if (ch === "," && !inQuotes) {
        result.push(current);
        current = "";
      } else {
        current += ch;
      }
    }
    result.push(current);
    return result;
  }

  const headers = parseCSVLine(lines[0]);
  const rows = lines.slice(1).map(line => {
    const values = parseCSVLine(line);
    return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? ""]));
  });
  return JSON.stringify(rows, null, 2);
}

export default function JSONCSVConverter() {
  const [tab, setTab] = useState<"json-csv" | "csv-json">("json-csv");
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const output = (() => {
    setError("");
    if (!input.trim()) return "";
    try {
      return tab === "json-csv" ? jsonToCSV(input) : csvToJSON(input);
    } catch (e) {
      setError((e as Error).message);
      return "";
    }
  })();

  const placeholders = {
    "json-csv": '[{"name":"Alice","age":30},{"name":"Bob","age":25}]',
    "csv-json": "name,age\nAlice,30\nBob,25",
  };

  return (
    <ToolShell title="JSON ↔ CSV Converter" description="Convert between JSON arrays and CSV format." category={cat}>
      <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-5">
        <div className="flex gap-2">
          {(["json-csv", "csv-json"] as const).map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setInput(""); setError(""); }}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${tab === t ? "bg-blue text-white" : "bg-bg border border-border text-text-2 hover:border-blue"}`}
            >
              {t === "json-csv" ? "JSON → CSV" : "CSV → JSON"}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-text-2">
            {tab === "json-csv" ? "JSON Input" : "CSV Input"}
          </label>
          <textarea
            className="w-full px-4 py-3 bg-bg border border-border rounded-xl font-mono text-sm focus:ring-2 focus:ring-blue outline-none transition-all resize-none"
            rows={8}
            placeholder={placeholders[tab]}
            value={input}
            onChange={e => setInput(e.target.value)}
          />
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-sm text-red-500">{error}</div>
        )}
      </div>

      {output && !error && (
        <div className="bg-surface border border-border p-5 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-text-2">
              {tab === "json-csv" ? "CSV Output" : "JSON Output"}
            </label>
            <CopyButton text={output} />
          </div>
          <textarea
            readOnly
            className="w-full px-4 py-3 bg-bg border border-border rounded-xl font-mono text-sm text-text resize-none outline-none"
            rows={10}
            value={output}
          />
        </div>
      )}
    </ToolShell>
  );
}
