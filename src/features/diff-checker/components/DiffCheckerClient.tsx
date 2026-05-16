"use client";
import { useState, useMemo } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { CopyButton } from "@/components/ui/CopyButton";

const cat = CATEGORIES.find(c => c.id === "developer")!;

type DiffLine = { type: "added" | "removed" | "equal"; text: string; lineA?: number; lineB?: number };

function computeDiff(a: string, b: string): DiffLine[] {
  const linesA = a.split("\n");
  const linesB = b.split("\n");
  const m = linesA.length;
  const n = linesB.length;

  // LCS-based diff (Myers-simplified)
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      if (linesA[i] === linesB[j]) {
        dp[i]![j] = dp[i + 1]![j + 1]! + 1;
      } else {
        dp[i]![j] = Math.max(dp[i + 1]![j]!, dp[i]![j + 1]!);
      }
    }
  }

  const result: DiffLine[] = [];
  let i = 0, j = 0;
  let lineA = 1, lineB = 1;

  while (i < m && j < n) {
    if (linesA[i] === linesB[j]) {
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

export default function DiffCheckerClient() {
  const [textA, setTextA] = useState("");
  const [textB, setTextB] = useState("");

  const diff = useMemo(() => (textA || textB) ? computeDiff(textA, textB) : null, [textA, textB]);

  const stats = useMemo(() => {
    if (!diff) return null;
    return {
      added: diff.filter(l => l.type === "added").length,
      removed: diff.filter(l => l.type === "removed").length,
    };
  }, [diff]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-surface border border-border p-5 rounded-2xl space-y-2">
          <label className="text-sm font-bold text-text-2">Original</label>
          <textarea
            className="w-full px-4 py-3 bg-bg border border-border rounded-xl font-mono text-sm focus:ring-2 focus:ring-blue outline-none transition-all resize-none"
            rows={12}
            placeholder="Paste original text…"
            value={textA}
            onChange={e => setTextA(e.target.value)}
          />
        </div>
        <div className="bg-surface border border-border p-5 rounded-2xl space-y-2">
          <label className="text-sm font-bold text-text-2">Modified</label>
          <textarea
            className="w-full px-4 py-3 bg-bg border border-border rounded-xl font-mono text-sm focus:ring-2 focus:ring-blue outline-none transition-all resize-none"
            rows={12}
            placeholder="Paste modified text…"
            value={textB}
            onChange={e => setTextB(e.target.value)}
          />
        </div>
      </div>

      {diff && stats && (
        <div className="space-y-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 text-sm">
              <span className="w-3 h-3 rounded-sm bg-green-500/20 border border-green-500/30 inline-block" />
              <span className="text-green-600 font-bold">+{stats.added} added</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="w-3 h-3 rounded-sm bg-red-500/20 border border-red-500/30 inline-block" />
              <span className="text-red-500 font-bold">-{stats.removed} removed</span>
            </div>
            <div className="ml-auto">
              <CopyButton text={toUnifiedDiff(diff)} label="Copy Unified Diff" />
            </div>
          </div>

          <div className="bg-surface border border-border rounded-2xl overflow-hidden">
            <div className="overflow-auto max-h-[600px]">
              <table className="w-full text-sm font-mono">
                <tbody>
                  {diff.map((line, i) => (
                    <tr
                      key={i}
                      className={
                        line.type === "added"
                          ? "bg-green-500/10"
                          : line.type === "removed"
                          ? "bg-red-500/10"
                          : ""
                      }
                    >
                      <td className="w-10 px-2 py-0.5 text-right text-text-4 text-xs border-r border-border select-none">
                        {line.lineA ?? ""}
                      </td>
                      <td className="w-10 px-2 py-0.5 text-right text-text-4 text-xs border-r border-border select-none">
                        {line.lineB ?? ""}
                      </td>
                      <td className={`px-3 py-0.5 w-4 border-r border-border font-bold ${line.type === "added" ? "text-green-600" : line.type === "removed" ? "text-red-500" : "text-text-4"}`}>
                        {line.type === "added" ? "+" : line.type === "removed" ? "-" : " "}
                      </td>
                      <td className={`px-3 py-0.5 whitespace-pre ${line.type === "added" ? "text-green-700 dark:text-green-400" : line.type === "removed" ? "text-red-600 dark:text-red-400" : "text-text"}`}>
                        {line.text}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
