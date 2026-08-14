"use client";
import { useState } from "react";
import { ToolWorkspace } from "@/components/ui/ToolWorkspace";
import { ToolInput } from "@/components/ui/ToolInput";
import { ToolResultArea } from "@/components/ui/ToolResultArea";

const ENTITY_MAP: Record<string, string> = {
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
};

function encodeEntities(text: string): string {
  return text.replace(/[&<>"']/g, c => ENTITY_MAP[c] ?? c);
}

function decodeEntities(text: string): string {
  if (typeof document === 'undefined') return text;
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
    <ToolWorkspace
      tabs={{
        options: [
          { id: "encode", label: "Encode" },
          { id: "decode", label: "Decode" }
        ],
        activeId: tab,
        onChange: (t) => { setTab(t); setInput(""); }
      }}
      input={
        <ToolInput
          label={tab === "encode" ? "Plain Text" : "HTML with Entities"}
          value={input}
          onChange={setInput}
          rows={5}
          placeholder={tab === "encode" ? 'Enter text, e.g. <div class="hello">' : "Enter HTML entities, e.g. &lt;div&gt;"}
          mono
        />
      }
      output={
        <ToolResultArea
          label="Output"
          value={output}
        />
      }
      infoPanel={
        <div className="bg-surface border border-border p-4 sm:p-6 rounded-4xl shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-text-2">Common HTML Entities Reference</h2>
          <div className="overflow-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-bg">
                  <th className="text-left px-4 py-2 font-bold text-text-muted">Entity</th>
                  <th className="text-left px-4 py-2 font-bold text-text-muted">Char</th>
                  <th className="text-left px-4 py-2 font-bold text-text-muted">Description</th>
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
      }
    />
  );
}
