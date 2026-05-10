"use client";

import { useState, useMemo } from "react";
import { MetricCard } from "@/components/ui/MetricCard";
import { CopyButton } from "@/components/ui/CopyButton";

const inr = (n: number) =>
  "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const GST_RATES = [3, 5, 12, 18, 28];

export default function GSTCalculatorClient() {
  const [amount, setAmount] = useState<string>("1000");
  const [gstRate, setGstRate] = useState(18);
  const [mode, setMode] = useState<"add" | "remove">("add");

  const result = useMemo(() => {
    const val = parseFloat(amount) || 0;
    if (mode === "add") {
      const gstAmt = val * (gstRate / 100);
      return { original: val, gst: gstAmt, final: val + gstAmt };
    } else {
      const original = val / (1 + gstRate / 100);
      const gstAmt = val - original;
      return { original, gst: gstAmt, final: val };
    }
  }, [amount, gstRate, mode]);

  const slabTable = useMemo(() => {
    const val = parseFloat(amount) || 0;
    return GST_RATES.map((r) => ({
      rate: r,
      gst: val * (r / 100),
      total: val + val * (r / 100),
    }));
  }, [amount]);

  const summary = `GST Calculation\n----------------\nAmount: ${inr(parseFloat(amount) || 0)}\nGST Rate: ${gstRate}%\nMode: ${mode === "add" ? "Add GST" : "Remove GST"}\n\nOriginal: ${inr(result.original)}\nGST Amount: ${inr(result.gst)}\nFinal Amount: ${inr(result.final)}\n\nGenerated via KaruviLab`;

  return (
    <>
      <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-text-2">Amount (₹)</label>
          <input
            type="number"
            min={0}
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-3 bg-bg border border-border rounded-xl focus:ring-2 focus:ring-blue outline-none transition-all text-lg font-bold"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-text-2">GST Rate</label>
          <div className="flex flex-wrap gap-2">
            {GST_RATES.map((r) => (
              <button
                key={r}
                onClick={() => setGstRate(r)}
                className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                  gstRate === r
                    ? "bg-blue text-white border-blue"
                    : "bg-bg border-border hover:border-blue hover:text-blue"
                }`}
              >
                {r}%
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-text-2">Mode</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setMode("add")}
              className={`py-3 rounded-xl text-sm font-bold border transition-all ${
                mode === "add"
                  ? "bg-blue text-white border-blue"
                  : "bg-bg border-border hover:border-blue hover:text-blue"
              }`}
            >
              Add GST
            </button>
            <button
              onClick={() => setMode("remove")}
              className={`py-3 rounded-xl text-sm font-bold border transition-all ${
                mode === "remove"
                  ? "bg-blue text-white border-blue"
                  : "bg-bg border-border hover:border-blue hover:text-blue"
              }`}
            >
              Remove GST
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard label="Original Amount" value={inr(result.original)} />
        <MetricCard label={`GST (${gstRate}%)`} value={inr(result.gst)} />
        <MetricCard label="Final Amount" value={inr(result.final)} accent />
      </div>

      <div className="bg-surface border border-border p-4 rounded-xl flex flex-wrap items-center justify-between gap-3">
        <span className="text-sm text-text-3">All GST slab breakdown for entered amount</span>
        <CopyButton text={summary} label="Copy Summary" />
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface border-b border-border">
              <th className="px-4 py-3 text-left font-bold text-text-3">GST Rate</th>
              <th className="px-4 py-3 text-right font-bold text-text-3">GST Amount</th>
              <th className="px-4 py-3 text-right font-bold text-text-3">Total (incl. GST)</th>
            </tr>
          </thead>
          <tbody>
            {slabTable.map((row) => (
              <tr
                key={row.rate}
                className={`border-b border-border/50 transition-colors ${
                  row.rate === gstRate ? "bg-blue/5 font-bold" : "hover:bg-surface"
                }`}
              >
                <td className="px-4 py-3 text-text-2">{row.rate}%</td>
                <td className="px-4 py-3 text-right text-text">{inr(row.gst)}</td>
                <td
                  className={`px-4 py-3 text-right font-bold ${
                    row.rate === gstRate ? "text-blue" : "text-text"
                  }`}
                >
                  {inr(row.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
