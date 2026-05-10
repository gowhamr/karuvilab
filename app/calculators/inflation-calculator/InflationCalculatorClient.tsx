"use client";

import { useState, useMemo, memo } from "react";
import { MetricCard } from "@/components/ui/MetricCard";
import { SliderField } from "@/components/ui/SliderField";
import { CopyButton } from "@/components/ui/CopyButton";
import { m } from "framer-motion";

const inr = (n: number, d = 0) =>
  "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: d, maximumFractionDigits: d });

const InflationCalculatorClient = memo(function InflationCalculatorClient() {
  const [amount, setAmount] = useState(100000);
  const [rate, setRate] = useState(6);
  const [years, setYears] = useState(10);
  const [showTable, setShowTable] = useState(false);

  const result = useMemo(() => {
    const r = rate / 100;
    
    // How much that same amount would cost in future
    const futureCost = amount * Math.pow(1 + r, years);
    
    // What that amount is worth today in future terms (Purchasing Power)
    const purchasingPower = amount / Math.pow(1 + r, years);

    const rows: { year: number; futureCost: number; power: number }[] = [];
    for (let y = 1; y <= years; y++) {
      rows.push({
        year: y,
        futureCost: amount * Math.pow(1 + r, y),
        power: amount / Math.pow(1 + r, y)
      });
    }

    return { futureCost, purchasingPower, rows };
  }, [amount, rate, years]);

  const summary = `Inflation Calculator Results\n----------------------\nInitial Amount: ${inr(amount)}\nInflation Rate: ${rate}% | Years: ${years}\n\nFuture Cost of same item: ${inr(result.futureCost)}\nFuture Purchasing Power of ${inr(amount)}: ${inr(result.purchasingPower)}\n\nGenerated via KaruviLab`;

  return (
    <div className="space-y-6">
      <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-6">
        <SliderField
          label="Initial Amount"
          id="inf-amount"
          min={1000}
          max={10000000}
          step={1000}
          value={amount}
          onChange={setAmount}
          format={(v) => inr(v)}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SliderField
            label="Annual Inflation Rate (%)"
            id="inf-rate"
            min={1}
            max={20}
            step={0.1}
            value={rate}
            onChange={setRate}
            format={(v) => v.toFixed(1) + "%"}
          />
          <SliderField
            label="Time Period (Years)"
            id="inf-years"
            min={1}
            max={40}
            step={1}
            value={years}
            onChange={setYears}
            format={(v) => v + " yr"}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MetricCard 
          label="Future Cost" 
          value={inr(result.futureCost)} 
          accent 
          sub={`What ${inr(amount)} buys today will cost this much in ${years} yrs`}
        />
        <MetricCard 
          label="Future Purchasing Power" 
          value={inr(result.purchasingPower)} 
          sub={`What ${inr(amount)} will be worth in today's terms`}
        />
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
                <th className="px-4 py-3 text-left font-black uppercase text-[10px] tracking-wider text-text-4">Year</th>
                <th className="px-4 py-3 text-right font-black uppercase text-[10px] tracking-wider text-text-4">Future Cost</th>
                <th className="px-4 py-3 text-right font-black uppercase text-[10px] tracking-wider text-text-4">Purchasing Power</th>
              </tr>
            </thead>
            <tbody>
              {result.rows.map((row) => (
                <tr key={row.year} className="border-b border-border/50 hover:bg-bg/30 transition-colors">
                  <td className="px-4 py-3 font-bold">Year {row.year}</td>
                  <td className="px-4 py-3 text-right text-red-500">{inr(row.futureCost)}</td>
                  <td className="px-4 py-3 text-right font-bold text-blue">{inr(row.power)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </m.div>
      )}
    </div>
  );
});

export default InflationCalculatorClient;
