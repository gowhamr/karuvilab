"use client";
import { useState, useMemo } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { MetricCard } from "@/components/ui/MetricCard";
import { CopyButton } from "@/components/ui/CopyButton";

const cat = CATEGORIES.find((c) => c.id === "calculators")!;

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

function diffDates(from: string, to: string) {
  const a = new Date(from);
  const b = new Date(to);
  if (isNaN(a.getTime()) || isNaN(b.getTime())) return null;
  const diffMs = Math.abs(b.getTime() - a.getTime());
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const totalWeeks = Math.floor(totalDays / 7);
  const totalHours = Math.floor(diffMs / (1000 * 60 * 60));

  // Years / months / days
  let ya = a < b ? a : b;
  let yb = a < b ? b : a;
  let years = yb.getFullYear() - ya.getFullYear();
  let months = yb.getMonth() - ya.getMonth();
  let days = yb.getDate() - ya.getDate();
  if (days < 0) {
    months--;
    const prev = new Date(yb.getFullYear(), yb.getMonth(), 0);
    days += prev.getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }
  return { years, months, days, totalDays, totalWeeks, totalHours, future: b > a };
}

function addToDate(base: string, n: number, unit: "days" | "months" | "years", op: "add" | "subtract") {
  const d = new Date(base);
  if (isNaN(d.getTime())) return "";
  const sign = op === "add" ? 1 : -1;
  if (unit === "days") d.setDate(d.getDate() + sign * n);
  else if (unit === "months") d.setMonth(d.getMonth() + sign * n);
  else d.setFullYear(d.getFullYear() + sign * n);
  return d.toISOString().split("T")[0];
}

export default function DateCalculator() {
  const [tab, setTab] = useState<"diff" | "add">("diff");

  // Diff state
  const [fromDate, setFromDate] = useState(todayStr());
  const [toDate, setToDate] = useState(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    return d.toISOString().split("T")[0];
  });

  // Add/subtract state
  const [baseDate, setBaseDate] = useState(todayStr());
  const [addN, setAddN] = useState<string>("30");
  const [addUnit, setAddUnit] = useState<"days" | "months" | "years">("days");
  const [addOp, setAddOp] = useState<"add" | "subtract">("add");

  const diff = useMemo(() => diffDates(fromDate, toDate), [fromDate, toDate]);

  const addResult = useMemo(
    () => addToDate(baseDate, parseInt(addN) || 0, addUnit, addOp),
    [baseDate, addN, addUnit, addOp]
  );

  const diffSummary = diff
    ? `Date Difference\n----------------\nFrom: ${fromDate}\nTo: ${toDate}\n\n${diff.years} years, ${diff.months} months, ${diff.days} days\nTotal Days: ${diff.totalDays}\nTotal Weeks: ${diff.totalWeeks}\n\nGenerated via KaruviLab`
    : "";

  return (
    <ToolShell
      title="Date Calculator"
      description="Calculate date differences or add/subtract time from any date."
      category={cat}
    >
      {/* Tabs */}
      <div className="flex gap-2">
        {(["diff", "add"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold border transition-all ${
              tab === t
                ? "bg-blue text-white border-blue"
                : "bg-surface border-border hover:border-blue hover:text-blue"
            }`}
          >
            {t === "diff" ? "Date Difference" : "Add / Subtract"}
          </button>
        ))}
      </div>

      {tab === "diff" && (
        <>
          <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-text-2">From Date</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full px-4 py-3 bg-bg border border-border rounded-xl focus:ring-2 focus:ring-blue outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-text-2">To Date</label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full px-4 py-3 bg-bg border border-border rounded-xl focus:ring-2 focus:ring-blue outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {diff && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <MetricCard label="Years" value={String(diff.years)} accent />
                <MetricCard label="Months" value={String(diff.months)} />
                <MetricCard label="Days" value={String(diff.days)} />
                <MetricCard label="Total Days" value={String(diff.totalDays)} />
                <MetricCard label="Total Weeks" value={String(diff.totalWeeks)} />
                <MetricCard label="Total Hours" value={diff.totalHours.toLocaleString()} />
              </div>
              <div className="bg-surface border border-border p-4 rounded-xl flex flex-wrap items-center justify-between gap-3">
                <span className="text-sm text-text-3">
                  {diff.future ? "There are" : "There were"}{" "}
                  <strong className="text-blue">{diff.totalDays} days</strong>{" "}
                  {diff.future ? "until" : "since"} {toDate}
                </span>
                <CopyButton text={diffSummary} label="Copy" />
              </div>
            </>
          )}
        </>
      )}

      {tab === "add" && (
        <>
          <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-text-2">Base Date</label>
              <input
                type="date"
                value={baseDate}
                onChange={(e) => setBaseDate(e.target.value)}
                className="w-full px-4 py-3 bg-bg border border-border rounded-xl focus:ring-2 focus:ring-blue outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-text-2">Operation</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["add", "subtract"] as const).map((op) => (
                    <button
                      key={op}
                      onClick={() => setAddOp(op)}
                      className={`py-2 rounded-xl text-sm font-bold border transition-all capitalize ${
                        addOp === op
                          ? "bg-blue text-white border-blue"
                          : "bg-bg border-border hover:border-blue hover:text-blue"
                      }`}
                    >
                      {op}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-text-2">Amount</label>
                <input
                  type="number"
                  min={0}
                  value={addN}
                  onChange={(e) => setAddN(e.target.value)}
                  className="w-full px-4 py-3 bg-bg border border-border rounded-xl focus:ring-2 focus:ring-blue outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-text-2">Unit</label>
              <div className="flex gap-2">
                {(["days", "months", "years"] as const).map((u) => (
                  <button
                    key={u}
                    onClick={() => setAddUnit(u)}
                    className={`flex-1 py-2 rounded-xl text-sm font-bold border transition-all capitalize ${
                      addUnit === u
                        ? "bg-blue text-white border-blue"
                        : "bg-bg border-border hover:border-blue hover:text-blue"
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {addResult && (
            <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm">
              <div className="text-[10px] font-bold text-text-4 uppercase tracking-wider mb-2">
                Result Date
              </div>
              <div className="text-3xl font-black text-blue">{addResult}</div>
              <p className="text-sm text-text-3 mt-2">
                {addOp === "add" ? "+" : "−"}{addN} {addUnit} {addOp === "add" ? "after" : "before"}{" "}
                {baseDate} = <strong>{addResult}</strong>
              </p>
            </div>
          )}
        </>
      )}
    </ToolShell>
  );
}
