"use client";
import { useState, useMemo } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { MetricCard } from "@/components/ui/MetricCard";
import { CopyButton } from "@/components/ui/CopyButton";

const cat = CATEGORIES.find((c) => c.id === "calculators")!;

function parseHHMM(s: string): number {
  const parts = s.split(":").map(Number);
  const h = parts[0] || 0;
  const m = parts[1] || 0;
  return h * 60 + m;
}

function secondsToHMS(totalSecs: number) {
  const h = Math.floor(totalSecs / 3600);
  const m = Math.floor((totalSecs % 3600) / 60);
  const s = totalSecs % 60;
  return {
    h,
    m,
    s,
    display: `${h}h ${m}m ${s}s`,
    hhmm: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`,
  };
}

export default function TimeCalculatorClient() {
  const [tab, setTab] = useState<"add" | "diff">("add");

  // Add Times
  const [rows, setRows] = useState<string[]>(["01:30", "02:45"]);

  const addResult = useMemo(() => {
    const totalMins = rows.reduce((acc, r) => acc + parseHHMM(r), 0);
    return secondsToHMS(totalMins * 60);
  }, [rows]);

  const addRow = () => setRows((r) => [...r, "00:00"]);
  const removeRow = (i: number) => setRows((r) => r.filter((_, idx) => idx !== i));
  const updateRow = (i: number, v: string) =>
    setRows((r) => r.map((x, idx) => (idx === i ? v : x)));

  // Diff
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:30");

  const diffResult = useMemo(() => {
    const startMins = parseHHMM(startTime);
    let endMins = parseHHMM(endTime);
    if (endMins < startMins) endMins += 24 * 60; // next day
    const diffSecs = Math.max(0, (endMins - startMins) * 60);
    return secondsToHMS(diffSecs);
  }, [startTime, endTime]);

  const addSummary = `Add Times\n----------\n${rows.join("\n")}\n\nTotal: ${addResult.hhmm} (${addResult.h}h ${addResult.m}m ${addResult.s}s)\n\nGenerated via KaruviLab`;
  const diffSummary = `Time Difference\n----------------\nStart: ${startTime}\nEnd: ${endTime}\n\nDifference: ${diffResult.hhmm}\n\nGenerated via KaruviLab`;

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {(["add", "diff"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold border transition-all ${
              tab === t
                ? "bg-blue text-white border-blue"
                : "bg-surface border-border hover:border-blue hover:text-blue"
            }`}
          >
            {t === "add" ? "Add Times" : "Time Difference"}
          </button>
        ))}
      </div>

      {tab === "add" && (
        <>
          <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-4">
            <div className="space-y-3">
              {rows.map((row, i) => (
                <div key={i} className="flex items-center gap-3">
                  <label className="text-sm font-bold text-text-4 w-8 text-right shrink-0">
                    {i + 1}.
                  </label>
                  <input
                    type="time"
                    value={row}
                    onChange={(e) => updateRow(i, e.target.value)}
                    className="flex-1 px-4 py-3 bg-bg border border-border rounded-xl focus:ring-2 focus:ring-blue outline-none transition-all font-mono"
                  />
                  {rows.length > 1 && (
                    <button
                      onClick={() => removeRow(i)}
                      className="px-3 py-3 rounded-xl border border-border hover:border-error hover:text-error transition-colors text-text-4"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={addRow}
              className="w-full py-2.5 border-2 border-dashed border-border rounded-xl text-sm font-bold text-text-3 hover:border-blue hover:text-blue transition-colors"
            >
              + Add Time
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <MetricCard label="Total Hours" value={String(addResult.h)} accent />
            <MetricCard label="Total Minutes" value={String(addResult.h * 60 + addResult.m)} />
            <MetricCard label="Result" value={addResult.hhmm} />
          </div>

          <div className="bg-surface border border-border p-4 rounded-xl flex items-center justify-between">
            <span className="text-sm text-text-3">
              Sum of {rows.length} durations ={" "}
              <strong className="text-blue">{addResult.display}</strong>
            </span>
            <CopyButton text={addSummary} label="Copy" />
          </div>
        </>
      )}

      {tab === "diff" && (
        <>
          <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-text-2">Start Time</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-4 py-3 bg-bg border border-border rounded-xl focus:ring-2 focus:ring-blue outline-none transition-all font-mono"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-text-2">End Time</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-4 py-3 bg-bg border border-border rounded-xl focus:ring-2 focus:ring-blue outline-none transition-all font-mono"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <MetricCard label="Hours" value={String(diffResult.h)} accent />
            <MetricCard label="Minutes" value={String(diffResult.h * 60 + diffResult.m)} />
            <MetricCard label="Seconds" value={String(diffResult.h * 3600 + diffResult.m * 60 + diffResult.s)} />
          </div>

          <div className="bg-surface border border-border p-4 rounded-xl flex items-center justify-between">
            <span className="text-sm text-text-3">
              {startTime} → {endTime} ={" "}
              <strong className="text-blue">{diffResult.display}</strong>
            </span>
            <CopyButton text={diffSummary} label="Copy" />
          </div>
        </>
      )}
    </div>
  );
}
