"use client";
import { useState, useMemo, useCallback } from "react";
import { useObjectUrlManager } from "@/src/lib/hooks";
import { DropZone } from "@/components/ui/DropZone";
import { PrivacyBadge } from "@/components/system/PrivacyBadge";
import { workerManager } from "@/src/workers/manager";
import { formatError } from "@/src/lib/formatError";
import { Loader2, Columns, AlignJustify, EyeOff, Eye } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { CopyButton } from "@/components/ui/CopyButton";

type DiffLine = { type: "added" | "removed" | "equal"; text: string; lineA?: number; lineB?: number };

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

export default function PdfCompareClient() {
  const [fileA, setFileA] = useState<File | null>(null);
  const [fileB, setFileB] = useState<File | null>(null);
  const [textA, setTextA] = useState("");
  const [textB, setTextB] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressText, setProgressText] = useState("");
  const [error, setError] = useState("");

  const [ignoreWs, setIgnoreWs] = useState(false);
  const [viewMode, setViewMode] = useState<"split" | "unified">("split");
  const [showEqual, setShowEqual] = useState(true);
  const [charLevel, setCharLevel] = useState(true);

  const handleFilesA = useCallback(async (files: FileList | File[]) => {
    const f = files[0];
    if (!f) return;
    setFileA(f);
    setTextA("");
    setError("");
    setIsProcessing(true);
    setProgressText("Extracting text from Original PDF...");
    try {
      const bytes = await f.arrayBuffer();
      const text = await workerManager.extractTextFromPdf(bytes, (p) => setProgressText(`Original: ${p.message || "Extracting..."}`));
      setTextA(text);
    } catch (e: any) {
      setError(`Original PDF Error: ${formatError(e)}`);
    } finally {
      setIsProcessing(false);
      setProgressText("");
    }
  }, []);

  const handleFilesB = useCallback(async (files: FileList | File[]) => {
    const f = files[0];
    if (!f) return;
    setFileB(f);
    setTextB("");
    setError("");
    setIsProcessing(true);
    setProgressText("Extracting text from Modified PDF...");
    try {
      const bytes = await f.arrayBuffer();
      const text = await workerManager.extractTextFromPdf(bytes, (p) => setProgressText(`Modified: ${p.message || "Extracting..."}`));
      setTextB(text);
    } catch (e: any) {
      setError(`Modified PDF Error: ${formatError(e)}`);
    } finally {
      setIsProcessing(false);
      setProgressText("");
    }
  }, []);

  const diff = useMemo(() => (textA || textB) ? computeDiff(textA, textB, ignoreWs) : null, [textA, textB, ignoreWs]);

  const stats = useMemo(() => {
    if (!diff) return null;
    return {
      added: diff.filter(l => l.type === "added").length,
      removed: diff.filter(l => l.type === "removed").length,
      equal: diff.filter(l => l.type === "equal").length,
    };
  }, [diff]);

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
      <PrivacyBadge message="Local processing – No files uploaded to servers" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DropZone
          onFilesSelected={handleFilesA}
          accept=".pdf,application/pdf"
          multiple={false}
          title={fileA ? fileA.name : "Original PDF"}
          description={fileA ? `${(fileA.size / 1024).toFixed(0)} KB` : "Drop original file"}
          icon={<div className="text-4xl">{fileA ? "📄" : "📥"}</div>}
        />
        <DropZone
          onFilesSelected={handleFilesB}
          accept=".pdf,application/pdf"
          multiple={false}
          title={fileB ? fileB.name : "Modified PDF"}
          description={fileB ? `${(fileB.size / 1024).toFixed(0)} KB` : "Drop modified file"}
          icon={<div className="text-4xl">{fileB ? "📄" : "📥"}</div>}
        />
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl text-red-600 text-sm font-bold">
          {error}
        </div>
      )}

      {isProcessing && (
        <div className="p-4 bg-surface border border-border rounded-xl flex items-center justify-center gap-3 text-sm text-text-3 font-bold uppercase tracking-widest">
          <Loader2 className="w-4 h-4 animate-spin text-blue" />
          {progressText}
        </div>
      )}

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
