"use client";

import { useMemo } from "react";
import { Plus, Trash2, Banknote, RefreshCcw, Copy } from "lucide-react";
import { m, AnimatePresence } from "framer-motion";
import { useShallow } from "zustand/react/shallow";

import { CATEGORIES } from "@/src/tool-registry";
import { MetricCard } from "@/components/ui/MetricCard";
import { CopyButton } from "@/components/ui/CopyButton";
import { useWorkHoursStore } from "@/src/features/work-hours/store";
import { useToast } from "@/components/ui/Toast";

const cat = CATEGORIES.find((c) => c.id === "calculators")!;

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
  const { toast } = useToast();
  
  const { rows, hourlyRate, addRow, removeRow, updateRow, setHourlyRate, clearAll } = 
    useWorkHoursStore(useShallow(s => ({
      rows: s.rows,
      hourlyRate: s.hourlyRate,
      addRow: s.addRow,
      removeRow: s.removeRow,
      updateRow: s.updateRow,
      setHourlyRate: s.setHourlyRate,
      clearAll: s.clearAll
    })));

  const stats = useMemo(() => {
    const rowData = rows.map((row) => {
      const hours = calcHours(row.start, row.end, parseInt(row.breakMins) || 0);
      const overtime = Math.max(0, hours - 8);
      return { ...row, hours, overtime };
    });
    const totalHours = rowData.reduce((a, r) => a + r.hours, 0);
    const totalOvertime = rowData.reduce((a, r) => a + r.overtime, 0);
    
    const rate = parseFloat(hourlyRate) || 0;
    const estimatedPay = totalHours * rate;

    return { rowData, totalHours, totalOvertime, estimatedPay, rate };
  }, [rows, hourlyRate]);

  const summary = `Work Hours Summary\n-------------------\n${stats.rowData
    .map(
      (r) =>
        `${r.date}: ${r.start}–${r.end} (${r.breakMins}m break) = ${fmtHours(r.hours)}${
          r.overtime > 0 ? ` [OT: ${fmtHours(r.overtime)}]` : ""
        }`
    )
    .join("\n")}\n\nTotal: ${fmtHours(stats.totalHours)}\nOvertime: ${fmtHours(stats.totalOvertime)}${
    stats.rate > 0 ? `\nEstimated Earnings: $${stats.estimatedPay.toFixed(2)}` : ""
  }\n\nGenerated via KaruviLab`;

  const handleClearAll = () => {
    if (confirm("Are you sure you want to clear all work hours?")) {
      clearAll();
      toast("All data cleared.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Settings Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-surface p-4 border border-border rounded-2xl shadow-sm">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-xl bg-blue/10 text-blue flex items-center justify-center shrink-0">
            <Banknote className="w-5 h-5" />
          </div>
          <div>
            <label className="text-xs font-bold text-text-muted uppercase tracking-widest block mb-1">
              Hourly Rate
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted font-bold text-sm">$</span>
              <input 
                type="number"
                min="0"
                step="0.01"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                placeholder="0.00"
                className="w-32 pl-7 pr-3 py-1.5 bg-bg border border-border rounded-lg text-sm font-bold text-text focus:ring-2 focus:ring-blue outline-none transition-all"
              />
            </div>
          </div>
        </div>

        <button 
          onClick={handleClearAll}
          className="flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-widest text-text-muted hover:text-error hover:bg-error/10 border border-transparent hover:border-error/20 rounded-xl transition-all"
        >
          <RefreshCcw className="w-4 h-4" />
          Clear All
        </button>
      </div>

      <div className="bg-surface border border-border rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-bg border-b border-border">
                <th className="px-4 py-4 text-left text-xs font-black text-text-muted uppercase tracking-widest whitespace-nowrap">Date</th>
                <th className="px-4 py-4 text-left text-xs font-black text-text-muted uppercase tracking-widest whitespace-nowrap">Start</th>
                <th className="px-4 py-4 text-left text-xs font-black text-text-muted uppercase tracking-widest whitespace-nowrap">End</th>
                <th className="px-4 py-4 text-left text-xs font-black text-text-muted uppercase tracking-widest whitespace-nowrap">Break (min)</th>
                <th className="px-4 py-4 text-right text-xs font-black text-text-muted uppercase tracking-widest whitespace-nowrap">Hours</th>
                <th className="px-4 py-4 text-right text-xs font-black text-text-muted uppercase tracking-widest whitespace-nowrap">OT</th>
                <th className="px-3 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <AnimatePresence initial={false}>
                {stats.rowData.map((row) => (
                  <m.tr 
                    key={row.id} 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0, scale: 0.95 }}
                    className="hover:bg-bg/50 transition-colors group"
                  >
                    <td className="px-3 py-3">
                      <input
                        type="date"
                        value={row.date}
                        onChange={(e) => updateRow(row.id, "date", e.target.value)}
                        className="px-3 py-2 bg-bg border border-border rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue outline-none w-full transition-all"
                      />
                    </td>
                    <td className="px-3 py-3">
                      <input
                        type="time"
                        value={row.start}
                        onChange={(e) => updateRow(row.id, "start", e.target.value)}
                        className="px-3 py-2 bg-bg border border-border rounded-xl text-sm font-mono focus:ring-2 focus:ring-blue outline-none w-full transition-all"
                      />
                    </td>
                    <td className="px-3 py-3">
                      <input
                        type="time"
                        value={row.end}
                        onChange={(e) => updateRow(row.id, "end", e.target.value)}
                        className="px-3 py-2 bg-bg border border-border rounded-xl text-sm font-mono focus:ring-2 focus:ring-blue outline-none w-full transition-all"
                      />
                    </td>
                    <td className="px-3 py-3">
                      <input
                        type="number"
                        min={0}
                        max={480}
                        value={row.breakMins}
                        onChange={(e) => updateRow(row.id, "breakMins", e.target.value)}
                        className="px-3 py-2 bg-bg border border-border rounded-xl text-sm focus:ring-2 focus:ring-blue outline-none w-24 transition-all"
                      />
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-text whitespace-nowrap">
                      {fmtHours(row.hours)}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-warn whitespace-nowrap">
                      {row.overtime > 0 ? fmtHours(row.overtime) : "—"}
                    </td>
                    <td className="px-3 py-3">
                      <div className="w-8 flex justify-center">
                        {rows.length > 1 && (
                          <button
                            onClick={() => removeRow(row.id)}
                            className="p-2 rounded-xl text-text-muted hover:text-error hover:bg-error/10 opacity-0 group-hover:opacity-100 transition-all focus:opacity-100 outline-none"
                            aria-label="Remove row"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </m.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-bg border-t border-border">
          <button
            onClick={addRow}
            className="w-full py-3 flex items-center justify-center gap-2 border-2 border-dashed border-border rounded-2xl text-sm font-bold text-text-3 hover:border-blue hover:text-blue hover:bg-blue/5 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Row
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Total Hours" value={fmtHours(stats.totalHours)} accent />
        <MetricCard label="Total Overtime" value={fmtHours(stats.totalOvertime)} />
        <MetricCard label="Days Logged" value={String(rows.length)} />
        {stats.rate > 0 && (
          <MetricCard label="Est. Earnings" value={`$${stats.estimatedPay.toFixed(2)}`} />
        )}
      </div>

      <div className="bg-surface border border-border p-5 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <span className="text-sm font-medium text-text-3">
          {rows.length} day{rows.length !== 1 ? "s" : ""} ·{" "}
          <strong className="text-blue">{fmtHours(stats.totalHours)}</strong> total ·{" "}
          <strong className="text-warn">{fmtHours(stats.totalOvertime)}</strong> OT
        </span>
        <CopyButton text={summary} label="Export Summary" />
      </div>
    </div>
  );
}
