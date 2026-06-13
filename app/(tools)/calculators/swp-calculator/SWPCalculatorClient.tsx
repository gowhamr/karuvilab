"use client";

import { useState, useMemo, memo } from "react";
import { MetricCard } from "@/components/ui/MetricCard";
import { SliderField } from "@/components/ui/SliderField";
import { CopyButton } from "@/components/ui/CopyButton";
import { m } from "framer-motion";

const inr = (n: number, d = 0) =>
  "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: d, maximumFractionDigits: d });

const SWPCalculatorClient = memo(function SWPCalculatorClient() {
  const [corpus, setCorpus] = useState(1000000);
  const [withdrawal, setWithdrawal] = useState(10000);
  const [rate, setRate] = useState(8);
  const [years, setYears] = useState(10);
  const [showTable, setShowTable] = useState(false);

  const result = useMemo(() => {
    const r = rate / 100 / 12;
    const months = years * 12;
    
    let balance = corpus;
    let totalWithdrawn = 0;
    const rows: { month: number; year: number; withdrawal: number; interest: number; balance: number }[] = [];

    for (let m = 1; m <= months; m++) {
      const interest = balance * r;
      const actualWithdrawal = Math.min(balance + interest, withdrawal);
      balance = balance + interest - actualWithdrawal;
      totalWithdrawn += actualWithdrawal;

      if (m % 12 === 0 || m === months || balance <= 0) {
        rows.push({
          month: m,
          year: Math.ceil(m / 12),
          withdrawal: totalWithdrawn,
          interest: interest, // last month interest
          balance: Math.max(0, balance)
        });
      }
      if (balance <= 0) break;
    }

    return { totalWithdrawn, finalBalance: balance, rows };
  }, [corpus, withdrawal, rate, years]);

  const summary = `SWP Calculator Results\n----------------------\nInitial Corpus: ${inr(corpus)}\nMonthly Withdrawal: ${inr(withdrawal)}\nExpected Return: ${rate}% | Tenure: ${years} Years\n\nTotal Withdrawn: ${inr(result.totalWithdrawn)}\nFinal Balance: ${inr(result.finalBalance)}\n\nGenerated via KaruviLab`;

  return (
    <div className="space-y-6">
      <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-6">
        <SliderField
          label="Initial Corpus"
          id="swp-corpus"
          min={100000}
          max={50000000}
          step={50000}
          value={corpus}
          onChange={setCorpus}
          format={(v) => inr(v)}
        />
        <SliderField
          label="Monthly Withdrawal Amount"
          id="swp-withdrawal"
          min={1000}
          max={500000}
          step={1000}
          value={withdrawal}
          onChange={setWithdrawal}
          format={(v) => inr(v)}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SliderField
            label="Expected Return Rate (Annual)"
            id="swp-rate"
            min={1}
            max={20}
            step={0.5}
            value={rate}
            onChange={setRate}
            format={(v) => v.toFixed(1) + "%"}
          />
          <SliderField
            label="Tenure (Years)"
            id="swp-years"
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
        <MetricCard label="Total Withdrawn" value={inr(result.totalWithdrawn)} accent />
        <MetricCard label="Final Balance" value={inr(result.finalBalance)} sub="Remaining corpus" />
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
                <th className="px-4 py-3 text-right font-black uppercase text-xs tracking-wider text-text-4">Total Withdrawn</th>
                <th className="px-4 py-3 text-right font-black uppercase text-xs tracking-wider text-text-4">Remaining Balance</th>
              </tr>
            </thead>
            <tbody>
              {result.rows.map((row) => (
                <tr key={row.month} className="border-b border-border/50 hover:bg-bg/30 transition-colors">
                  <td className="px-4 py-3 font-bold">Year {row.year}</td>
                  <td className="px-4 py-3 text-right text-green-500">{inr(row.withdrawal)}</td>
                  <td className="px-4 py-3 text-right font-bold text-blue">{inr(row.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </m.div>
      )}
    </div>
  );
});

export default SWPCalculatorClient;
