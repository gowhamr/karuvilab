"use client";
import { useState, useMemo } from "react";
import { useToast } from "@/components/ui/Toast";
import { ToolWorkspace } from "@/components/ui/ToolWorkspace";
import { ToolInput } from "@/components/ui/ToolInput";
import { ToolResultArea } from "@/components/ui/ToolResultArea";

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
    <ToolWorkspace
      input={
        <div className="space-y-6">
          <dl className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
            {[
              { label: "Words", value: stats.words },
              { label: "Characters", value: stats.chars },
              { label: "Lines", value: stats.lines },
              { label: "Reading Time", value: `~${stats.readingTime}m` },
            ].map(({ label, value }) => (
              <div key={label} className="bg-bg border border-border p-3 rounded-2xl">
                <dt className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">{label}</dt>
                <dd className="text-xl font-black text-text">{value}</dd>
              </div>
            ))}
          </dl>
          <ToolInput
            label="Input Text"
            value={input}
            onChange={val => {
              if (val.length > 500000) {
                toast("Text exceeds 500KB limit", "error");
                setInput(val.slice(0, 500000));
              } else {
                setInput(val);
              }
            }}
            placeholder="Type or paste your text here…"
            rows={7}
          />
        </div>
      }
      optionsPanel={
        <div className="space-y-6">
          {OPERATIONS.map(({ group, items }) => (
            <div key={group} className="space-y-3">
              <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider">{group}</h2>
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
        </div>
      }
      output={
        <div className="flex flex-col h-full space-y-4">
          <ToolResultArea
            label={`Output${lastOp ? ` — ${lastOp}` : ""}`}
            value={output}
            onClear={() => {
              setOutput("");
              setLastOp("");
            }}
          />
          {output && (
            <div className="flex justify-between items-center px-1">
              <span className="text-xs text-text-muted">{outputStats.chars} chars</span>
              <button
                onClick={() => setInput(output)}
                className="text-xs text-blue hover:underline font-medium"
              >
                Use as new input
              </button>
            </div>
          )}
        </div>
      }
      infoPanel={
        <div className="bg-surface border border-border p-4 sm:p-6 rounded-4xl shadow-sm">
          <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4">Detailed Stats</h2>
          <dl className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            {[
              { label: "Words", value: stats.words },
              { label: "Characters", value: stats.chars },
              { label: "Chars (no spaces)", value: stats.charsNoSpaces },
              { label: "Lines", value: stats.lines },
              { label: "Sentences", value: stats.sentences },
              { label: "Paragraphs", value: stats.paragraphs },
              { label: "Reading Time", value: `~${stats.readingTime} min` },
            ].map(({ label, value }) => (
              <div key={label} className="bg-bg border border-border rounded-2xl p-4">
                <dt className="text-xs font-bold text-text-muted mb-1 uppercase tracking-wider">{label}</dt>
                <dd className="text-lg font-black text-text">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      }
    />
  );
}
