"use client";

import { useState, useMemo, useEffect } from "react";
import { MetricCard } from "@/components/ui/MetricCard";
import { d, formatINR, syncStateToUrl, getInitialStateFromUrl } from "@/src/lib/calculator-utils";
import { CalculatorActionBar } from "@/components/ui/CalculatorActionBar";

const GST_RATES = [3, 5, 12, 18, 28];

const DEFAULT_STATE = {
  amount: 1000,
  gstRate: 18,
  mode: "add" as "add" | "remove",
};

export default function GSTCalculatorClient() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [amount, setAmount] = useState<number>(DEFAULT_STATE.amount);
  const [gstRate, setGstRate] = useState(DEFAULT_STATE.gstRate);
  const [mode, setMode] = useState<"add" | "remove">(DEFAULT_STATE.mode);

  // Initialize from URL
  useEffect(() => {
    const state = getInitialStateFromUrl(DEFAULT_STATE);
    setAmount(Number(state.amount));
    setGstRate(Number(state.gstRate));
    setMode(state.mode as "add" | "remove");
    setIsLoaded(true);
  }, []);

  // Sync to URL
  useEffect(() => {
    if (!isLoaded) return;
    syncStateToUrl({ amount, gstRate, mode });
  }, [amount, gstRate, mode, isLoaded]);

  const result = useMemo(() => {
    const val = d(amount || 0);
    const rate = d(gstRate);
    if (mode === "add") {
      const gstAmt = val.mul(rate.div(100));
      return { 
        original: val.toNumber(), 
        gst: gstAmt.toNumber(), 
        final: val.add(gstAmt).toNumber() 
      };
    } else {
      const original = val.div(d(1).add(rate.div(100)));
      const gstAmt = val.sub(original);
      return { 
        original: original.toNumber(), 
        gst: gstAmt.toNumber(), 
        final: val.toNumber() 
      };
    }
  }, [amount, gstRate, mode]);

  const slabTable = useMemo(() => {
    const val = d(amount || 0);
    return GST_RATES.map((r) => {
      const rate = d(r);
      const gstAmt = val.mul(rate.div(100));
      return {
        rate: r,
        gst: gstAmt.toNumber(),
        total: val.add(gstAmt).toNumber(),
      };
    });
  }, [amount]);

  const summary = `GST Calculation
----------------
Amount: ${formatINR(amount)}
GST Rate: ${gstRate}%
Mode: ${mode === "add" ? "Add GST" : "Remove GST"}

Original: ${formatINR(result.original, 2)}
GST Amount: ${formatINR(result.gst, 2)}
Final Amount: ${formatINR(result.final, 2)}

Generated via KaruviLab`;

  return (
    <div className="space-y-6">
      <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-text-2">Amount (₹)</label>
          <input
            type="number"
            min={0}
            placeholder="Enter amount"
            value={amount || ""}
            onChange={(e) => setAmount(Number(e.target.value))}
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
        <MetricCard label="Original Amount" value={formatINR(result.original, 2)} />
        <MetricCard label={`GST (${gstRate}%)`} value={formatINR(result.gst, 2)} />
        <MetricCard label="Final Amount" value={formatINR(result.final, 2)} accent />
      </div>

      <CalculatorActionBar
        summary={summary}
        toolId="gst-calculator"
        historyLabel={`${formatINR(amount)} @ ${gstRate}% (${mode})`}
        historyData={{ amount, gstRate, mode, result }}
      />

      <div className="space-y-4">
        <h3 className="text-lg font-black">GST Slab Comparison</h3>
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
                  <td className="px-4 py-3 text-text-2 font-medium">{row.rate}%</td>
                  <td className="px-4 py-3 text-right text-text">{formatINR(row.gst, 2)}</td>
                  <td
                    className={`px-4 py-3 text-right font-bold ${
                      row.rate === gstRate ? "text-blue" : "text-text"
                    }`}
                  >
                    {formatINR(row.total, 2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
