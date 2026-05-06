"use client";
import { useState, useMemo } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { MetricCard } from "@/components/ui/MetricCard";
import { SliderField } from "@/components/ui/SliderField";
import { CopyButton } from "@/components/ui/CopyButton";

const cat = CATEGORIES.find((c) => c.id === "calculators")!;

const inr = (n: number) =>
  "₹" + Math.max(0, n).toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

export default function SafeToSpend() {
  const [income, setIncome] = useState<string>("80000");
  const [fixed, setFixed] = useState<string>("25000");
  const [variable, setVariable] = useState<string>("15000");
  const [savingsGoal, setSavingsGoal] = useState(20);

  const result = useMemo(() => {
    const inc = parseFloat(income) || 0;
    const fix = parseFloat(fixed) || 0;
    const vari = parseFloat(variable) || 0;
    const totalExpenses = fix + vari;
    const savingsAmt = inc * (savingsGoal / 100);
    const remaining = inc - totalExpenses - savingsAmt;
    const dailyBudget = remaining / 30;
    const weeklyBudget = remaining / 4.33;
    const isOver = remaining < 0;
    const surplus = Math.abs(remaining);
    return { totalExpenses, savingsAmt, remaining, dailyBudget, weeklyBudget, isOver, surplus };
  }, [income, fixed, variable, savingsGoal]);

  const inc = parseFloat(income) || 0;
  const utilizationPct = inc > 0 ? Math.min(100, ((result.totalExpenses + result.savingsAmt) / inc) * 100) : 0;

  const summary = `Safe-to-Spend Budget\n--------------------\nIncome: ${inr(parseFloat(income) || 0)}\nFixed Expenses: ${inr(parseFloat(fixed) || 0)}\nVariable Expenses: ${inr(parseFloat(variable) || 0)}\nSavings Goal: ${savingsGoal}%\n\nSavings: ${inr(result.savingsAmt)}\nTotal Expenses: ${inr(result.totalExpenses)}\nSafe to Spend: ${inr(result.remaining)}\nDaily Budget: ${inr(result.dailyBudget)}\nWeekly Budget: ${inr(result.weeklyBudget)}\n\nStatus: ${result.isOver ? "OVER BUDGET" : "Under Budget"}\n\nGenerated via KaruviLab`;

  return (
    <ToolShell
      title="Safe-to-Spend"
      description="Plan your monthly budget and find your daily/weekly spending limit."
      category={cat}
    >
      <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-5">
        {[
          { label: "Monthly Income (₹)", id: "sts-income", state: income, setState: setIncome },
          { label: "Fixed Expenses (Rent, EMIs, etc.) (₹)", id: "sts-fixed", state: fixed, setState: setFixed },
          { label: "Variable Expenses (Food, Transport, etc.) (₹)", id: "sts-var", state: variable, setState: setVariable },
        ].map(({ label, id, state, setState }) => (
          <div key={id} className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor={id} className="text-sm font-bold text-text-2">{label}</label>
              <span className="text-sm font-black text-blue">{inr(parseFloat(state) || 0)}</span>
            </div>
            <input
              id={id}
              type="number"
              min={0}
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full px-4 py-3 bg-bg border border-border rounded-xl focus:ring-2 focus:ring-blue outline-none transition-all"
            />
          </div>
        ))}
        <SliderField
          label="Savings Goal"
          id="sts-savings"
          min={0}
          max={80}
          step={5}
          value={savingsGoal}
          onChange={setSavingsGoal}
          format={(v) => v + "%"}
        />
      </div>

      {/* Visual Budget Bar */}
      <div className="bg-surface border border-border p-5 rounded-2xl shadow-sm space-y-3">
        <div className="flex justify-between text-sm font-bold text-text-2">
          <span>Budget Utilization</span>
          <span className={utilizationPct > 100 ? "text-red-400" : "text-green-500"}>
            {utilizationPct.toFixed(1)}%
          </span>
        </div>
        <div className="h-3 bg-bg rounded-full overflow-hidden border border-border">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              utilizationPct > 100 ? "bg-red-400" : utilizationPct > 80 ? "bg-yellow-500" : "bg-green-500"
            }`}
            style={{ width: `${Math.min(100, utilizationPct)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-text-4">
          <span>₹0</span>
          <span>{inr(inc)}</span>
        </div>
      </div>

      {/* Status banner */}
      <div
        className={`p-4 rounded-xl border flex items-center gap-3 ${
          result.isOver
            ? "bg-red-500/10 border-red-500/30"
            : "bg-green-500/10 border-green-500/30"
        }`}
      >
        <div className={`text-2xl ${result.isOver ? "text-red-400" : "text-green-500"}`}>
          {result.isOver ? "⚠" : "✓"}
        </div>
        <div>
          <div className={`font-bold ${result.isOver ? "text-red-400" : "text-green-500"}`}>
            {result.isOver ? "Over Budget!" : "You're on track!"}
          </div>
          <div className="text-sm text-text-3">
            {result.isOver
              ? `You're overspending by ${inr(result.surplus)} this month`
              : `You have ${inr(result.surplus)} available to spend freely`}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <MetricCard label="Safe to Spend" value={result.isOver ? "—" : inr(result.remaining)} accent />
        <MetricCard label="Daily Budget" value={result.isOver ? "—" : inr(result.dailyBudget)} />
        <MetricCard label="Weekly Budget" value={result.isOver ? "—" : inr(result.weeklyBudget)} />
        <MetricCard label="Savings" value={inr(result.savingsAmt)} />
      </div>

      {/* Breakdown */}
      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border font-bold text-text-2">Breakdown</div>
        <div className="divide-y divide-border">
          {[
            { label: "Monthly Income", value: parseFloat(income) || 0, color: "text-green-500" },
            { label: `Savings (${savingsGoal}%)`, value: -result.savingsAmt, color: "text-blue" },
            { label: "Fixed Expenses", value: -(parseFloat(fixed) || 0), color: "text-red-400" },
            { label: "Variable Expenses", value: -(parseFloat(variable) || 0), color: "text-yellow-500" },
            { label: "Safe to Spend", value: result.remaining, color: result.isOver ? "text-red-400" : "text-green-500" },
          ].map((row) => (
            <div key={row.label} className="flex justify-between px-4 py-3">
              <span className="text-sm text-text-3">{row.label}</span>
              <span className={`text-sm font-bold ${row.color}`}>
                {row.value >= 0 ? "" : "−"}{inr(Math.abs(row.value))}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <CopyButton text={summary} label="Copy Summary" />
      </div>
    </ToolShell>
  );
}
