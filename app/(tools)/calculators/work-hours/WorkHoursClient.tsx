"use client";
import { useState, useMemo } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { MetricCard } from "@/components/ui/MetricCard";
import { CopyButton } from "@/components/ui/CopyButton";

const cat = CATEGORIES.find((c) => c.id === "calculators")!;

interface WorkRow {
  id: number;
  date: string;
  start: string;
  end: string;
  breakMins: string;
}

let nextId = 1;

function todayStr(): string {
  return new Date().toISOString().split("T")[0]!;
}

function calcHours(start: string, end: string, breakMins: number): number {
  if (!start || !end) return 0;
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  if (sh === undefined || sm === undefined || eh === undefined || em === undefined) return 0;
  let mins = eh * 60 + em - (sh * 60 + sm) - breakMins;
  if (mins < 0) mins += 24 * 60; // next day
  return Math.max(0, mins / 60);
}

function fmtHours(h: number): string {
  const hrs = Math.floor(h);
  const mins = Math.round((h - hrs) * 60);
  return `${hrs}h ${String(mins).padStart(2, "0")}m`;
}

export default function WorkHoursClient() {
  const [rows, setRows] = useState<WorkRow[]>([
    { id: nextId++, date: todayStr(), start: "09:00", end: "18:00", breakMins: "60" },
  ]);

  const addRow = () => {
    setRows((r) => [
      ...r,
      { id: nextId++, date: todayStr(), start: "09:00", end: "18:00", breakMins: "60" },
    ]);
  };

  const removeRow = (id: number) => setRows((r) => r.filter((row) => row.id !== id));

  const updateRow = (id: number, field: keyof WorkRow, value: string) =>
    setRows((r) => r.map((row) => (row.id === id ? { ...row, [field]: value } : row)));

  const stats = useMemo(() => {
    const rowData = rows.map((row) => {
      const hours = calcHours(row.start, row.end, parseInt(row.breakMins) || 0);
      const overtime = Math.max(0, hours - 8);
      return { ...row, hours, overtime };
    });
    const totalHours = rowData.reduce((a, r) => a + r.hours, 0);
    const totalOvertime = rowData.reduce((a, r) => a + r.overtime, 0);
    return { rowData, totalHours, totalOvertime };
  }, [rows]);

  const summary = `Work Hours Summary\n-------------------\n${stats.rowData
    .map(
      (r) =>
        `${r.date}: ${r.start}–${r.end} (${r.breakMins}m break) = ${fmtHours(r.hours)}${
          r.overtime > 0 ? ` [OT: ${fmtHours(r.overtime)}]` : ""
        }`
    )
    .join("\n")}\n\nTotal: ${fmtHours(stats.totalHours)}\nOvertime: ${fmtHours(stats.totalOvertime)}\n\nGenerated via KaruviLab`;

  return (
    <div className="space-y-6">
      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-bg border-b border-border">
                <th className="px-3 py-3 text-left font-bold text-text-3">Date</th>
                <th className="px-3 py-3 text-left font-bold text-text-3">Start</th>
                <th className="px-3 py-3 text-left font-bold text-text-3">End</th>
                <th className="px-3 py-3 text-left font-bold text-text-3">Break (min)</th>
                <th className="px-3 py-3 text-right font-bold text-text-3">Hours</th>
                <th className="px-3 py-3 text-right font-bold text-text-3">OT</th>
                <th className="px-2 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {stats.rowData.map((row) => (
                <tr key={row.id} className="hover:bg-bg/50 transition-colors">
                  <td className="px-2 py-2">
                    <input
                      type="date"
                      value={row.date}
                      onChange={(e) => updateRow(row.id, "date", e.target.value)}
                      className="px-2 py-1.5 bg-bg border border-border rounded-lg text-xs focus:ring-1 focus:ring-blue outline-none w-full"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <input
                      type="time"
                      value={row.start}
                      onChange={(e) => updateRow(row.id, "start", e.target.value)}
                      className="px-2 py-1.5 bg-bg border border-border rounded-lg text-xs font-mono focus:ring-1 focus:ring-blue outline-none w-full"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <input
                      type="time"
                      value={row.end}
                      onChange={(e) => updateRow(row.id, "end", e.target.value)}
                      className="px-2 py-1.5 bg-bg border border-border rounded-lg text-xs font-mono focus:ring-1 focus:ring-blue outline-none w-full"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <input
                      type="number"
                      min={0}
                      max={480}
                      value={row.breakMins}
                      onChange={(e) => updateRow(row.id, "breakMins", e.target.value)}
                      className="px-2 py-1.5 bg-bg border border-border rounded-lg text-xs focus:ring-1 focus:ring-blue outline-none w-20"
                    />
                  </td>
                  <td className="px-3 py-2 text-right font-bold text-text">
                    {fmtHours(row.hours)}
                  </td>
                  <td className="px-3 py-2 text-right font-bold text-yellow-500">
                    {row.overtime > 0 ? fmtHours(row.overtime) : "—"}
                  </td>
                  <td className="px-2 py-2">
                    {rows.length > 1 && (
                      <button
                        onClick={() => removeRow(row.id)}
                        className="px-2 py-1.5 rounded-lg border border-border hover:border-red-500 hover:text-red-500 transition-colors text-text-4 text-xs"
                      >
                        ✕
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-3 border-t border-border">
          <button
            onClick={addRow}
            className="w-full py-2 border-2 border-dashed border-border rounded-xl text-sm font-bold text-text-3 hover:border-blue hover:text-blue transition-colors"
          >
            + Add Row
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard label="Total Hours" value={fmtHours(stats.totalHours)} accent />
        <MetricCard label="Total Overtime" value={fmtHours(stats.totalOvertime)} />
        <MetricCard label="Days Logged" value={String(rows.length)} />
      </div>

      <div className="bg-surface border border-border p-4 rounded-xl flex items-center justify-between">
        <span className="text-sm text-text-3">
          {rows.length} day{rows.length !== 1 ? "s" : ""} ·{" "}
          <strong className="text-blue">{fmtHours(stats.totalHours)}</strong> total ·{" "}
          <strong className="text-yellow-500">{fmtHours(stats.totalOvertime)}</strong> OT
        </span>
        <CopyButton text={summary} label="Export Summary" />
      </div>
    </div>
  );
}
