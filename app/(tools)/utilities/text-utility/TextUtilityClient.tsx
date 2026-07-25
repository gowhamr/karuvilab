"use client";
import { useState, useMemo } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { CopyButton } from "@/components/ui/CopyButton";
import { useToast } from "@/components/ui/Toast";

const cat = CATEGORIES.find(c => c.id === "utilities")!;

function toTitleCase(s: string) {
  return s.replace(/\b\w/g, c => c.toUpperCase());
}
function toCamelCase(s: string) {
  return s.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase());
}
function toSnakeCase(s: string) {
  return s.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "").toLowerCase();
}
function toKebabCase(s: string) {
  return s.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "").toLowerCase();
}
function toPascalCase(s: string) {
  return s.replace(/(?:^\w|[A-Z]|\b\w)/g, c => c.toUpperCase()).replace(/\s+/g, "");
}
function shuffle(arr: string[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

const OPERATIONS: { group: string; items: { label: string; fn: (s: string) => string }[] }[] = [
  {
    group: "Case",
    items: [
      { label: "UPPERCASE", fn: s => s.toUpperCase() },
      { label: "lowercase", fn: s => s.toLowerCase() },
      { label: "Title Case", fn: toTitleCase },
      { label: "camelCase", fn: toCamelCase },
      { label: "snake_case", fn: toSnakeCase },
      { label: "kebab-case", fn: toKebabCase },
      { label: "PascalCase", fn: toPascalCase },
    ],
  },
  {
    group: "Transform",
    items: [
      { label: "Reverse", fn: s => s.split("").reverse().join("") },
      { label: "Reverse Lines", fn: s => s.split("\n").reverse().join("\n") },
      { label: "Remove Duplicates", fn: s => [...new Set(s.split("\n"))].join("\n") },
      { label: "Sort A→Z", fn: s => s.split("\n").sort().join("\n") },
      { label: "Sort Z→A", fn: s => s.split("\n").sort().reverse().join("\n") },
      { label: "Shuffle Lines", fn: s => shuffle(s.split("\n")).join("\n") },
    ],
  },
  {
    group: "Clean",
    items: [
      { label: "Trim Whitespace", fn: s => s.split("\n").map(l => l.trim()).join("\n") },
      { label: "Remove Blank Lines", fn: s => s.split("\n").filter(l => l.trim()).join("\n") },
      { label: "Remove Extra Spaces", fn: s => s.replace(/[ \t]+/g, " ") },
      { label: "Remove Numbers", fn: s => s.replace(/\d/g, "") },
      { label: "Remove Special Chars", fn: s => s.replace(/[^a-zA-Z0-9\s]/g, "") },
    ],
  },
];

function countStats(text: string) {
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const charsNoSpaces = text.replace(/\s/g, "").length;
  const lines = text ? text.split("\n").length : 0;
  const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length;
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim()).length;
  const readingTime = Math.max(1, Math.round(words / 200));
  return { words, chars, charsNoSpaces, lines, sentences, paragraphs, readingTime };
}

export default function TextUtilityClient() {
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [lastOp, setLastOp] = useState("");

  const stats = useMemo(() => countStats(input), [input]);
  const outputStats = useMemo(() => countStats(output), [output]);

  const applyOp = (label: string, fn: (s: string) => string) => {
    setOutput(fn(input));
    setLastOp(label);
  };

  return (
    <div className="space-y-6">
      <dl className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
        {[
          { label: "Words", value: stats.words },
          { label: "Characters", value: stats.chars },
          { label: "Lines", value: stats.lines },
          { label: "Reading Time", value: `~${stats.readingTime}m` },
        ].map(({ label, value }) => (
          <div key={label} className="bg-surface border border-border p-4 rounded-xl">
            <dt className="text-xs font-bold text-text-4 uppercase tracking-wider mb-1">{label}</dt>
            <dd className="text-xl font-black text-text">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-4">
        <label className="text-sm font-bold text-text-2">Input Text</label>
        <textarea
          className="w-full px-4 py-3 bg-bg border border-border rounded-xl font-mono text-sm focus:ring-2 focus:ring-blue outline-none transition-all resize-none"
          rows={7}
          placeholder="Type or paste your text here…"
          value={input}
          onChange={e => {
            if (e.target.value.length > 500000) {
              toast("Text exceeds 500KB limit", "error");
              setInput(e.target.value.slice(0, 500000));
            } else {
              setInput(e.target.value);
            }
          }}
        />
      </div>

      {OPERATIONS.map(({ group, items }) => (
        <div key={group} className="bg-surface border border-border p-5 rounded-2xl space-y-3">
          <h2 className="text-xs font-bold text-text-4 uppercase tracking-wider">{group}</h2>
          <div className="flex flex-wrap gap-2">
            {items.map(({ label, fn }) => (
              <button
                key={label}
                onClick={() => applyOp(label, fn)}
                className="px-4 py-2 text-sm font-medium bg-bg border border-border rounded-xl hover:border-blue hover:text-blue transition-all"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      ))}

      {output && (
        <div className="bg-surface border border-border p-5 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-bold text-text-2">Output</label>
              {lastOp && <span className="ml-2 text-xs text-text-4">— {lastOp}</span>}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-text-4">{outputStats.chars} chars</span>
              <CopyButton text={output} />
            </div>
          </div>
          <textarea
            readOnly
            className="w-full px-4 py-3 bg-bg border border-border rounded-xl font-mono text-sm text-text resize-none outline-none"
            rows={7}
            value={output}
          />
          <button
            onClick={() => setInput(output)}
            className="text-xs text-blue hover:underline"
          >
            Use as new input
          </button>
        </div>
      )}

      <div className="bg-surface border border-border p-5 rounded-2xl">
        <h2 className="text-xs font-bold text-text-4 uppercase tracking-wider mb-3">Detailed Stats</h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          {[
            { label: "Words", value: stats.words },
            { label: "Characters", value: stats.chars },
            { label: "Chars (no spaces)", value: stats.charsNoSpaces },
            { label: "Lines", value: stats.lines },
            { label: "Sentences", value: stats.sentences },
            { label: "Paragraphs", value: stats.paragraphs },
            { label: "Reading Time", value: `~${stats.readingTime} min` },
          ].map(({ label, value }) => (
            <div key={label} className="bg-bg border border-border rounded-xl p-3">
              <dt className="text-xs text-text-4 mb-0.5">{label}</dt>
              <dd className="font-bold text-text">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
