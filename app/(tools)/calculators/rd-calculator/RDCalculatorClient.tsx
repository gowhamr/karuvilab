"use client";

import { useState, useMemo, memo } from "react";
import { MetricCard } from "@/components/ui/MetricCard";
import { SliderField } from "@/components/ui/SliderField";
import { CopyButton } from "@/components/ui/CopyButton";
import { m } from "framer-motion";

const inr = (n: number, d = 0) =>
  "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: d, maximumFractionDigits: d });

const RDCalculatorClient = memo(function RDCalculatorClient() {
  const [monthly, setMonthly] = useState(5000);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(5);
  const [showTable, setShowTable] = useState(false);

  const result = useMemo(() => {
    // Standard RD calculation usually involves quarterly compounding in India
    // Formula: M = P * ((1+i)^n - 1) / (1 - (1+i)^(-1/3)) where i = r/400
    const i = rate / 400;
    const n = years * 12;
    const maturity = monthly * (Math.pow(1 + i, n) - 1) / (1 - Math.pow(1 + i, -1/3));
    
    const totalInvested = monthly * n;
    const totalInterest = maturity - totalInvested;

    const rows: { year: number; invested: number; value: number; interest: number }[] = [];
    let currentMaturity = 0;
    for (let y = 1; y <= years; y++) {
      const ny = y * 12;
      const val = monthly * (Math.pow(1 + i, ny) - 1) / (1 - Math.pow(1 + i, -1/3));
      rows.push({
        year: y,
        invested: monthly * ny,
        value: val,
        interest: val - (monthly * ny)
      });
    }

    return { totalInvested, totalInterest, maturity, rows };
  }, [monthly, rate, years]);

  const summary = `RD Calculator Results\n----------------------\nMonthly Deposit: ${inr(monthly)}\nRate: ${rate}% | Years: ${years}\n\nTotal Invested: ${inr(result.totalInvested)}\nInterest Earned: ${inr(result.totalInterest)}\nMaturity Amount: ${inr(result.maturity)}\n\nGenerated via KaruviLab`;

  return (
    <div className="space-y-6">
      <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-6">
        <SliderField
          label="Monthly Deposit Amount"
          id="rd-monthly"
          min={500}
          max={100000}
          step={500}
          value={monthly}
          onChange={setMonthly}
          format={(v) => inr(v)}
        />
        <SliderField
          label="Interest Rate (Annual)"
          id="rd-rate"
          min={1}
          max={15}
          step={0.1}
          value={rate}
          onChange={setRate}
          format={(v) => v.toFixed(1) + "%"}
        />
        <SliderField
          label="Tenure (Years)"
          id="rd-years"
          min={1}
          max={10}
          step={1}
          value={years}
          onChange={setYears}
          format={(v) => v + " yr"}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard label="Maturity Amount" value={inr(result.maturity)} accent />
        <MetricCard label="Total Invested" value={inr(result.totalInvested)} />
        <MetricCard label="Interest Earned" value={inr(result.totalInterest)} />
      </div>

      <div className="flex justify-end gap-3">
        <CopyButton text={summary} label="Copy Summary" />
        <button
          onClick={() => setShowTable((v) => !v)}
          className="px-4 py-2 text-sm font-bold bg-surface border border-border rounded-xl hover:border-blue hover:text-blue transition-all"
        >
          {showTable ? "Hide" : "Show"} Yearly Breakdown
        </button>
      </div>

      {showTable && (
        <m.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-x-auto rounded-xl border border-border bg-surface"
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-bg/50 border-b border-border">
                <th className="px-4 py-3 text-left font-black uppercase text-xs tracking-wider text-text-4">Year</th>
                <th className="px-4 py-3 text-right font-black uppercase text-xs tracking-wider text-text-4">Invested</th>
                <th className="px-4 py-3 text-right font-black uppercase text-xs tracking-wider text-text-4">Interest</th>
                <th className="px-4 py-3 text-right font-black uppercase text-xs tracking-wider text-text-4">Maturity</th>
              </tr>
            </thead>
            <tbody>
              {result.rows.map((row) => (
                <tr key={row.year} className="border-b border-border/50 hover:bg-bg/30 transition-colors">
                  <td className="px-4 py-3 font-bold">Year {row.year}</td>
                  <td className="px-4 py-3 text-right">{inr(row.invested)}</td>
                  <td className="px-4 py-3 text-right text-green-500">{inr(row.interest)}</td>
                  <td className="px-4 py-3 text-right font-bold text-blue">{inr(row.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </m.div>
      )}
    </div>
  );
});

export default RDCalculatorClient;
