"use client";
import { useState, useMemo, useRef, useCallback } from "react";
import { CopyButton } from "@/components/ui/CopyButton";
import { DiffEditor } from "@monaco-editor/react";
import { configureMonacoLoader } from "@/src/core/monaco/MonacoLoader";
configureMonacoLoader();
import { Upload, AlignJustify, Columns, Eye, EyeOff } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useToast } from "@/components/ui/Toast";

type DiffLine = { type: "added" | "removed" | "equal"; text: string; lineA?: number; lineB?: number };

// Character-level diff for a pair of changed lines
type CharPart = { text: string; changed: boolean };
function charDiff(a: string, b: string): { a: CharPart[]; b: CharPart[] } {
  const la = a.split("");
  const lb = b.split("");
  const m = la.length;
  const n = lb.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = m - 1; i >= 0; i--)
    for (let j = n - 1; j >= 0; j--)
      dp[i]![j] = la[i] === lb[j] ? dp[i + 1]![j + 1]! + 1 : Math.max(dp[i + 1]![j]!, dp[i]![j + 1]!);

  const partsA: CharPart[] = [];
  const partsB: CharPart[] = [];
  let i = 0, j = 0;
  while (i < m && j < n) {
    if (la[i] === lb[j]) {
      partsA.push({ text: la[i]!, changed: false });
      partsB.push({ text: lb[j]!, changed: false });
      i++; j++;
    } else if (dp[i + 1]![j]! >= dp[i]![j + 1]!) {
      partsA.push({ text: la[i]!, changed: true }); i++;
    } else {
      partsB.push({ text: lb[j]!, changed: true }); j++;
    }
  }
  while (i < m) { partsA.push({ text: la[i++]!, changed: true }); }
  while (j < n) { partsB.push({ text: lb[j++]!, changed: true }); }
  return { a: partsA, b: partsB };
}

function computeDiff(a: string, b: string, ignoreWs: boolean): DiffLine[] {
  const normalize = (s: string) => ignoreWs ? s.trim() : s;
  const linesA = a.split("\n");
  const linesB = b.split("\n");
  const m = linesA.length;
  const n = linesB.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = m - 1; i >= 0; i--)
    for (let j = n - 1; j >= 0; j--)
      dp[i]![j] = normalize(linesA[i]!) === normalize(linesB[j]!)
        ? dp[i + 1]![j + 1]! + 1
        : Math.max(dp[i + 1]![j]!, dp[i]![j + 1]!);

  const result: DiffLine[] = [];
  let i = 0, j = 0, lineA = 1, lineB = 1;
  while (i < m && j < n) {
    if (normalize(linesA[i]!) === normalize(linesB[j]!)) {
      result.push({ type: "equal", text: linesA[i]!, lineA: lineA++, lineB: lineB++ });
      i++; j++;
    } else if (dp[i + 1]![j]! >= dp[i]![j + 1]!) {
      result.push({ type: "removed", text: linesA[i]!, lineA: lineA++ });
      i++;
    } else {
      result.push({ type: "added", text: linesB[j]!, lineB: lineB++ });
      j++;
    }
  }
  while (i < m) { result.push({ type: "removed", text: linesA[i++]!, lineA: lineA++ }); }
  while (j < n) { result.push({ type: "added", text: linesB[j++]!, lineB: lineB++ }); }
  return result;
}

function toUnifiedDiff(diff: DiffLine[]): string {
  return diff.map(l =>
    l.type === "added" ? `+ ${l.text}` :
    l.type === "removed" ? `- ${l.text}` :
    `  ${l.text}`
  ).join("\n");
}

function CharDiffLine({ text, type, otherText }: { text: string; type: "added" | "removed"; otherText: string }) {
  const parts = useMemo(() => {
    const r = charDiff(type === "removed" ? text : otherText, type === "removed" ? otherText : text);
    return type === "removed" ? r.a : r.b;
  }, [text, otherText, type]);

  const isChanged = parts.some(p => p.changed);
  if (!isChanged) return <span className="whitespace-pre">{text}</span>;

  return (
    <span className="whitespace-pre">
      {parts.map((p, i) =>
        p.changed
          ? <mark key={i} className={cn("rounded-sm", type === "removed" ? "bg-red-500/40 text-red-200" : "bg-green-500/40 text-green-200")}>{p.text}</mark>
          : <span key={i}>{p.text}</span>
      )}
    </span>
  );
}

function DropArea({ id, label, value, onChange }: { id: string; label: string; value: string; onChange: (v: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const { toast } = useToast();

  const handleChange = useCallback((v: string) => {
    if (v.length > 500000) {
      toast("Text exceeds maximum 500KB limit for diffing", "error");
      onChange(v.slice(0, 500000));
    } else {
      onChange(v);
    }
  }, [onChange, toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => handleChange(ev.target?.result as string ?? "");
    reader.readAsText(file);
  }, [handleChange]);

  return (
    <div
      className={cn("bg-surface border rounded-2xl p-5 space-y-3 transition-colors", dragging ? "border-blue bg-blue/5" : "border-border")}
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-bold text-text-2">{label}</label>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-border bg-bg text-text-4 hover:text-blue hover:border-blue/40 text-xs font-bold transition-colors"
          aria-label={`Upload file for ${label}`}
        >
          <Upload className="w-3 h-3" /> Upload File
        </button>
        <input ref={inputRef} type="file" accept="text/*,.json,.ts,.js,.md,.yaml,.yml,.csv,.xml,.html,.css" className="hidden" onChange={e => {
          const file = e.target.files?.[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = ev => handleChange(ev.target?.result as string ?? "");
          reader.readAsText(file);
        }} />
      </div>
      <textarea
        id={id}
        aria-label={label}
        className={cn(
          "w-full px-4 py-3 bg-bg border border-border rounded-xl font-mono text-sm focus:ring-2 focus:ring-blue outline-none transition-all resize-none",
          dragging && "ring-2 ring-blue"
        )}
        rows={20}
        placeholder={dragging ? "Drop to load file..." : `Paste ${label.toLowerCase()} text or drop a file…`}
        value={value}
        onChange={e => handleChange(e.target.value)}
      />
    </div>
  );
}

export default function DiffCheckerClient() {
  const [textA, setTextA] = useState("");
  const [textB, setTextB] = useState("");
  const [ignoreWs, setIgnoreWs] = useState(false);
  const [viewMode, setViewMode] = useState<"split" | "unified">("split");
  const [showEqual, setShowEqual] = useState(true);
  const [charLevel, setCharLevel] = useState(true);

  const diff = useMemo(() => (textA || textB) ? computeDiff(textA, textB, ignoreWs) : null, [textA, textB, ignoreWs]);

  const stats = useMemo(() => {
    if (!diff) return null;
    return {
      added: diff.filter(l => l.type === "added").length,
      removed: diff.filter(l => l.type === "removed").length,
      equal: diff.filter(l => l.type === "equal").length,
    };
  }, [diff]);

  // Build paired lines for char-level diff (removed immediately followed by added)
  const pairedDiff = useMemo(() => {
    if (!diff) return null;
    const pairs: Array<{ line: DiffLine; partner?: string }> = [];
    for (let i = 0; i < diff.length; i++) {
      const cur = diff[i]!;
      const next = diff[i + 1];
      if (cur.type === "removed" && next?.type === "added") {
        pairs.push({ line: cur, partner: next.text });
        pairs.push({ line: next, partner: cur.text });
        i++;
      } else {
        pairs.push({ line: cur });
      }
    }
    return pairs;
  }, [diff]);

  const filteredDiff = useMemo(() => {
    if (!pairedDiff) return null;
    return showEqual ? pairedDiff : pairedDiff.filter(p => p.line.type !== "equal");
  }, [pairedDiff, showEqual]);

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DropArea id="diff-original" label="Original" value={textA} onChange={setTextA} />
        <DropArea id="diff-modified" label="Modified" value={textB} onChange={setTextB} />
      </div>

      {/* Toolbar */}
      {diff && stats && (
        <div className="bg-surface border border-border rounded-2xl p-4 space-y-4">
          {/* Stats */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-sm">
              <span className="w-3 h-3 rounded-sm bg-green-500/20 border border-green-500/30 inline-block" />
              <span className="text-green-600 dark:text-green-400 font-bold">+{stats.added} added</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="w-3 h-3 rounded-sm bg-red-500/20 border border-red-500/30 inline-block" />
              <span className="text-red-500 font-bold">−{stats.removed} removed</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-text-4">
              <span className="font-bold">{stats.equal} unchanged</span>
            </div>
            <div className="ml-auto flex flex-wrap gap-2">
              <CopyButton text={toUnifiedDiff(diff)} label="Copy Unified Diff" />
            </div>
          </div>

          {/* Options row */}
          <div className="flex flex-wrap gap-2 border-t border-border/40 pt-3">
            {/* View mode */}
            <div className="flex rounded-xl border border-border overflow-hidden">
              <button
                onClick={() => setViewMode("split")}
                className={cn("px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 transition-colors", viewMode === "split" ? "bg-blue text-white" : "bg-bg text-text-3 hover:bg-surface")}
                aria-pressed={viewMode === "split"}
              >
                <Columns className="w-3 h-3" /> Split
              </button>
              <button
                onClick={() => setViewMode("unified")}
                className={cn("px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 transition-colors", viewMode === "unified" ? "bg-blue text-white" : "bg-bg text-text-3 hover:bg-surface")}
                aria-pressed={viewMode === "unified"}
              >
                <AlignJustify className="w-3 h-3" /> Unified
              </button>
            </div>

            <button
              onClick={() => setIgnoreWs(v => !v)}
              aria-pressed={ignoreWs}
              className={cn("px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors", ignoreWs ? "bg-blue/10 border-blue text-blue" : "bg-bg border-border text-text-3 hover:border-blue/40")}
            >
              Ignore Whitespace
            </button>

            <button
              onClick={() => setCharLevel(v => !v)}
              aria-pressed={charLevel}
              className={cn("px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors", charLevel ? "bg-blue/10 border-blue text-blue" : "bg-bg border-border text-text-3 hover:border-blue/40")}
            >
              Char-level Diff
            </button>

            <button
              onClick={() => setShowEqual(v => !v)}
              className="px-3 py-1.5 rounded-xl border border-border bg-bg text-text-3 hover:border-blue/40 text-xs font-bold flex items-center gap-1.5 transition-colors"
              aria-pressed={showEqual}
            >
              {showEqual ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              {showEqual ? "Hide" : "Show"} Unchanged
            </button>
          </div>
        </div>
      )}

      {/* Diff Table */}
      {filteredDiff && (
        <div className="bg-surface border border-border rounded-2xl overflow-hidden">
          <div className="overflow-auto max-h-[65vh] custom-scrollbar">
            {viewMode === "unified" ? (
              <table className="w-full text-sm font-mono">
                <tbody>
                  {filteredDiff.map(({ line }, i) => (
                    <tr
                      key={i}
                      className={line.type === "added" ? "bg-green-500/10" : line.type === "removed" ? "bg-red-500/10" : ""}
                    >
                      <td className="w-10 px-2 py-0.5 text-right text-text-4 text-xs border-r border-border select-none">{line.lineA ?? ""}</td>
                      <td className="w-10 px-2 py-0.5 text-right text-text-4 text-xs border-r border-border select-none">{line.lineB ?? ""}</td>
                      <td className={`px-3 py-0.5 w-4 border-r border-border font-bold ${line.type === "added" ? "text-green-500" : line.type === "removed" ? "text-red-500" : "text-text-4"}`}>
                        {line.type === "added" ? "+" : line.type === "removed" ? "−" : " "}
                      </td>
                      <td className={`px-3 py-0.5 ${line.type === "added" ? "text-green-700 dark:text-green-300" : line.type === "removed" ? "text-red-600 dark:text-red-300" : "text-text"}`}>
                        {charLevel && (line.type === "added" || line.type === "removed") && filteredDiff[i]
                          ? <CharDiffLine text={line.text} type={line.type} otherText={filteredDiff[i]!.partner ?? line.text} />
                          : <span className="whitespace-pre">{line.text}</span>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              /* Split view */
              <div className="grid grid-cols-2 divide-x divide-border">
                {/* Left (original / removed / equal) */}
                <table className="w-full text-sm font-mono">
                  <tbody>
                    {filteredDiff.map(({ line, partner }, i) => {
                      if (line.type === "added") return (
                        <tr key={i} className="h-[1.5rem]">
                          <td className="w-10 px-2 py-0.5 text-right text-text-4 text-xs border-r border-border select-none" />
                          <td className="px-3 py-0.5 bg-green-500/5" />
                        </tr>
                      );
                      return (
                        <tr key={i} className={line.type === "removed" ? "bg-red-500/10" : ""}>
                          <td className="w-10 px-2 py-0.5 text-right text-text-4 text-xs border-r border-border select-none">{line.lineA ?? ""}</td>
                          <td className={`px-3 py-0.5 ${line.type === "removed" ? "text-red-600 dark:text-red-300" : "text-text"}`}>
                            {charLevel && line.type === "removed" && partner
                              ? <CharDiffLine text={line.text} type="removed" otherText={partner} />
                              : <span className="whitespace-pre">{line.text}</span>
                            }
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {/* Right (modified / added / equal) */}
                <table className="w-full text-sm font-mono">
                  <tbody>
                    {filteredDiff.map(({ line, partner }, i) => {
                      if (line.type === "removed") return (
                        <tr key={i} className="h-[1.5rem]">
                          <td className="w-10 px-2 py-0.5 text-right text-text-4 text-xs border-r border-border select-none" />
                          <td className="px-3 py-0.5 bg-red-500/5" />
                        </tr>
                      );
                      return (
                        <tr key={i} className={line.type === "added" ? "bg-green-500/10" : ""}>
                          <td className="w-10 px-2 py-0.5 text-right text-text-4 text-xs border-r border-border select-none">{line.lineB ?? ""}</td>
                          <td className={`px-3 py-0.5 ${line.type === "added" ? "text-green-700 dark:text-green-300" : "text-text"}`}>
                            {charLevel && line.type === "added" && partner
                              ? <CharDiffLine text={line.text} type="added" otherText={partner} />
                              : <span className="whitespace-pre">{line.text}</span>
                            }
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
