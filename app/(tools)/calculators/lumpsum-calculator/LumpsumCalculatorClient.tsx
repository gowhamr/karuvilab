"use client";

import { useState, useMemo, memo } from "react";
import { MetricCard } from "@/components/ui/MetricCard";
import { SliderField } from "@/components/ui/SliderField";
import { CopyButton } from "@/components/ui/CopyButton";
import { m } from "framer-motion";

const inr = (n: number, d = 0) =>
  "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: d, maximumFractionDigits: d });

const LumpsumCalculatorClient = memo(function LumpsumCalculatorClient() {
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);
  const [showTable, setShowTable] = useState(false);

  const result = useMemo(() => {
    const r = rate / 100;
    const rows: { year: number; value: number; gains: number }[] = [];

    for (let y = 1; y <= years; y++) {
      const value = principal * Math.pow(1 + r, y);
      rows.push({
        year: y,
        value: value,
        gains: value - principal,
      });
    }

    const totalValue = principal * Math.pow(1 + r, years);
    const totalGains = totalValue - principal;
    
    return { totalValue, totalGains, rows };
  }, [principal, rate, years]);

  const summary = `Lumpsum Investment Summary\n--------------------------\nPrincipal: ${inr(principal)}\nInterest Rate: ${rate}%\nDuration: ${years} years\n\nTotal Gains: ${inr(result.totalGains)}\nTotal Maturity Value: ${inr(result.totalValue)}\n\nGenerated via KaruviLab`;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface border border-border p-6 rounded-2xl space-y-6">
          <SliderField
            label="Total Investment"
            id="ls-principal"
            min={1000}
            max={10000000}
            step={5000}
            value={principal}
            onChange={setPrincipal}
            format={(v) => inr(v)}
          />
          <SliderField
            label="Expected Return Rate (p.a)"
            id="ls-rate"
            min={1}
            max={30}
            step={0.5}
            value={rate}
            onChange={setRate}
            format={(v) => v + "%"}
          />
          <SliderField
            label="Duration"
            id="ls-years"
            min={1}
            max={40}
            step={1}
            value={years}
            onChange={setYears}
            format={(v) => v + " yrs"}
          />
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <MetricCard label="Maturity Value" value={inr(result.totalValue)} accent />
            <MetricCard label="Total Invested" value={inr(principal)} />
            <MetricCard label="Estimated Gains" value={inr(result.totalGains)} />
          </div>
          
          <div className="bg-surface border border-border p-4 rounded-xl flex items-center justify-between gap-3">
             <CopyButton text={summary} label="Copy Summary" />
             <button
                onClick={() => setShowTable(!showTable)}
                className="px-4 py-2 text-sm font-medium bg-bg border border-border rounded-lg hover:border-blue transition-colors"
              >
                {showTable ? "Hide" : "Show"} Projection
              </button>
          </div>
        </div>
      </div>

      {showTable && (
        <m.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-x-auto rounded-xl border border-border"
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface border-b border-border text-text-3">
                <th className="px-4 py-3 text-left">Year</th>
                <th className="px-4 py-3 text-right">Value</th>
                <th className="px-4 py-3 text-right">Gains</th>
              </tr>
            </thead>
            <tbody>
              {result.rows.map((row) => (
                <tr key={row.year} className="border-b border-border/50 hover:bg-surface/50">
                  <td className="px-4 py-3">Year {row.year}</td>
                  <td className="px-4 py-3 text-right font-bold text-blue">{inr(row.value)}</td>
                  <td className="px-4 py-3 text-right text-green-500">{inr(row.gains)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </m.div>
      )}
    </div>
  );
});

export default LumpsumCalculatorClient;
