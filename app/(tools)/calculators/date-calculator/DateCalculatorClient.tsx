"use client";
import { useState, useMemo, useEffect } from "react";
import { MetricCard } from "@/components/ui/MetricCard";
import { ToolInput } from "@/components/ui/ToolInput";
import { CopyButton } from "@/components/ui/CopyButton";
import { cn } from "@/src/lib/utils";
import { Calendar, Plus, Minus, Hash } from "lucide-react";

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
  return d.toISOString().split("T")[0]!;
}

export default function DateCalculatorClient() {
  const [tab, setTab] = useState<"diff" | "add">("diff");

  // Diff state
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Add/subtract state
  const [baseDate, setBaseDate] = useState("");
  const [addN, setAddN] = useState<string>("30");
  const [addUnit, setAddUnit] = useState<"days" | "months" | "years">("days");
  const [addOp, setAddOp] = useState<"add" | "subtract">("add");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]!;
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    
    setFromDate(today);
    setToDate(nextYear.toISOString().split("T")[0]!);
    setBaseDate(today);
    setMounted(true);
  }, []);

  const diff = useMemo(() => diffDates(fromDate, toDate), [fromDate, toDate]);

  const addResult = useMemo(
    () => addToDate(baseDate, parseInt(addN) || 0, addUnit, addOp),
    [baseDate, addN, addUnit, addOp]
  );

  const diffSummary = diff
    ? `Date Difference\n----------------\nFrom: ${fromDate}\nTo: ${toDate}\n\n${diff.years} years, ${diff.months} months, ${diff.days} days\nTotal Days: ${diff.totalDays}\nTotal Weeks: ${diff.totalWeeks}\n\nGenerated via KaruviLab`
    : "";

  if (!mounted) {
    return (
      <div className="bg-surface border border-border p-6 rounded-[32px] h-64 animate-pulse" />
    );
  }

  return (
    <div className="space-y-8">
      {/* Tabs */}
      <div className="flex p-1 bg-surface border border-border rounded-2xl w-fit mx-auto shadow-sm">
        {(["diff", "add"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest transition-all",
              tab === t ? "bg-blue text-white shadow-lg shadow-blue/20 scale-[1.02]" : "text-text-4 hover:text-text"
            )}
          >
            {t === "diff" ? "Difference" : "Add/Sub"}
          </button>
        ))}
      </div>

      {tab === "diff" && (
        <div className="space-y-8">
          <div className="bg-surface border border-border p-6 md:p-8 rounded-[32px] shadow-sm space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ToolInput
                label="From Date"
                type="date"
                value={fromDate}
                onChange={setFromDate}
              />
              <ToolInput
                label="To Date"
                type="date"
                value={toDate}
                onChange={setToDate}
              />
            </div>
          </div>

          {diff && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <MetricCard label="Years" value={String(diff.years)} accent />
                <MetricCard label="Months" value={String(diff.months)} />
                <MetricCard label="Days" value={String(diff.days)} />
                <MetricCard label="Total Days" value={String(diff.totalDays)} />
                <MetricCard label="Total Weeks" value={String(diff.totalWeeks)} />
                <MetricCard label="Total Hours" value={diff.totalHours.toLocaleString()} />
              </div>
              <div className="bg-surface border border-border p-5 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-sm">
                <span className="text-sm text-text-3 font-medium">
                  {diff.future ? "There are" : "There were"}{" "}
                  <strong className="text-blue">{diff.totalDays} days</strong>{" "}
                  {diff.future ? "until" : "since"} {toDate}
                </span>
                <CopyButton text={diffSummary} label="Copy Summary" className="bg-bg border border-border" />
              </div>
            </div>
          )}
        </div>
      )}

      {tab === "add" && (
        <div className="space-y-8">
          <div className="bg-surface border border-border p-6 md:p-8 rounded-[32px] shadow-sm space-y-8">
            <ToolInput
              label="Base Date"
              type="date"
              value={baseDate}
              onChange={setBaseDate}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-4 flex items-center gap-2">
                  <Plus size={12} /> Operation
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(["add", "subtract"] as const).map((op) => (
                    <button
                      key={op}
                      onClick={() => setAddOp(op)}
                      className={cn(
                        "flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest border transition-all",
                        addOp === op
                          ? "bg-blue border-blue text-white shadow-md shadow-blue/20"
                          : "bg-bg border-border text-text-4 hover:border-blue/30"
                      )}
                    >
                      {op === "add" ? <Plus size={14} /> : <Minus size={14} />}
                      {op}
                    </button>
                  ))}
                </div>
              </div>

              <ToolInput
                label="Amount"
                type="number"
                value={addN}
                onChange={setAddN}
                description="Number of units"
              />
            </div>

            <div className="space-y-4 pt-4 border-t border-border">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-4 flex items-center gap-2">
                <Hash size={12} /> Time Unit
              </label>
              <div className="flex p-1 bg-bg border border-border rounded-xl">
                {(["days", "months", "years"] as const).map((u) => (
                  <button
                    key={u}
                    onClick={() => setAddUnit(u)}
                    className={cn(
                      "flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                      addUnit === u ? "bg-surface text-blue shadow-sm" : "text-text-4 hover:text-text"
                    )}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {addResult && (
            <div className="bg-surface border border-border p-6 md:p-8 rounded-[32px] shadow-sm space-y-6">
              <div className="flex items-center gap-3 border-b border-border pb-4">
                <div className="w-10 h-10 rounded-xl bg-blue/5 flex items-center justify-center text-blue">
                  <Calendar size={20} />
                </div>
                <div>
                  <h2 className="text-sm font-black uppercase tracking-widest text-text">Resulting Date</h2>
                  <p className="text-[10px] font-bold text-text-4 uppercase">Calculated arrival</p>
                </div>
              </div>

              <div className="p-8 bg-bg rounded-[24px] border border-border flex flex-col items-center justify-center shadow-inner">
                <div className="text-4xl md:text-5xl font-black text-blue tracking-tighter tabular-nums mb-2">
                  {addResult}
                </div>
                <p className="text-sm text-text-3 font-medium text-center max-w-xs leading-relaxed">
                  {addOp === "add" ? "Adding" : "Subtracting"} <strong className="text-blue">{addN} {addUnit}</strong> {addOp === "add" ? "to" : "from"}{" "}
                  {baseDate} gives you this date.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
