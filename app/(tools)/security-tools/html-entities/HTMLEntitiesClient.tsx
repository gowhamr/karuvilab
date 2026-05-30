"use client";
import { useState } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { CopyButton } from "@/components/ui/CopyButton";

const cat = CATEGORIES.find(c => c.id === "security")!;

const ENTITY_MAP: Record<string, string> = {
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
};
const DECODE_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(ENTITY_MAP).map(([k, v]) => [v, k])
);

function encodeEntities(text: string): string {
  return text.replace(/[&<>"']/g, c => ENTITY_MAP[c] ?? c);
}

function decodeEntities(text: string): string {
  const el = document.createElement("textarea");
  el.innerHTML = text;
  return el.value;
}

const REFERENCE_TABLE = [
  { entity: "&amp;",   char: "&",  desc: "Ampersand" },
  { entity: "&lt;",    char: "<",  desc: "Less than" },
  { entity: "&gt;",    char: ">",  desc: "Greater than" },
  { entity: "&quot;",  char: '"',  desc: "Double quote" },
  { entity: "&#39;",   char: "'",  desc: "Single quote" },
  { entity: "&nbsp;",  char: " ",  desc: "Non-breaking space" },
  { entity: "&copy;",  char: "©",  desc: "Copyright" },
  { entity: "&reg;",   char: "®",  desc: "Registered" },
  { entity: "&trade;", char: "™",  desc: "Trademark" },
  { entity: "&euro;",  char: "€",  desc: "Euro" },
  { entity: "&pound;", char: "£",  desc: "Pound" },
  { entity: "&yen;",   char: "¥",  desc: "Yen" },
  { entity: "&mdash;", char: "—",  desc: "Em dash" },
  { entity: "&ndash;", char: "–",  desc: "En dash" },
  { entity: "&hellip;",char: "…",  desc: "Ellipsis" },
  { entity: "&laquo;", char: "«",  desc: "Left angle quote" },
  { entity: "&raquo;", char: "»",  desc: "Right angle quote" },
  { entity: "&deg;",   char: "°",  desc: "Degree" },
  { entity: "&plusmn;",char: "±",  desc: "Plus-minus" },
  { entity: "&times;", char: "×",  desc: "Multiplication" },
  { entity: "&divide;",char: "÷",  desc: "Division" },
  { entity: "&frac12;",char: "½",  desc: "One half" },
  { entity: "&hearts;",char: "♥",  desc: "Heart" },
];

export default function HTMLEntitiesClient() {
  const [tab, setTab] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");

  const output = (() => {
    if (!input) return "";
    if (tab === "encode") return encodeEntities(input);
    try { return decodeEntities(input); } catch { return ""; }
  })();

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
          <label className="text-sm font-bold text-text-2">
            {tab === "encode" ? "Plain Text" : "HTML with Entities"}
          </label>
          <textarea
            className="w-full px-4 py-3 bg-bg border border-border rounded-xl font-mono text-sm focus:ring-2 focus:ring-blue outline-none transition-all resize-none"
            rows={5}
            placeholder={tab === "encode" ? 'Enter text, e.g. <div class="hello">' : "Enter HTML entities, e.g. &lt;div&gt;"}
            value={input}
            onChange={e => setInput(e.target.value)}
          />
        </div>

        {output && (
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

      <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-text-2">Common HTML Entities Reference</h2>
        <div className="overflow-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-bg">
                <th className="text-left px-4 py-2 font-bold text-text-4">Entity</th>
                <th className="text-left px-4 py-2 font-bold text-text-4">Char</th>
                <th className="text-left px-4 py-2 font-bold text-text-4">Description</th>
              </tr>
            </thead>
            <tbody>
              {REFERENCE_TABLE.map(row => (
                <tr key={row.entity} className="border-b border-border last:border-0 hover:bg-bg transition-colors">
                  <td className="px-4 py-2 font-mono text-blue">{row.entity}</td>
                  <td className="px-4 py-2 font-mono text-text font-bold">{row.char}</td>
                  <td className="px-4 py-2 text-text-3">{row.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
