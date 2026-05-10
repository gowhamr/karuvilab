"use client";

import { useCallback, useState } from "react";
import { MetricCard } from "@/components/ui/MetricCard";
import { SliderField } from "@/components/ui/SliderField";
import { CopyButton } from "@/components/ui/CopyButton";
import { usePersistentState } from "@/src/lib/hooks";

const inr = (n: number, d = 0) =>
  "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: d, maximumFractionDigits: d });

export default function EMICalculatorClient() {
  const [inputs, setInputs, isLoaded] = usePersistentState('emi-calculator', {
    principal: 500000,
    rate: 8.5,
    years: 5
  });
  
  const [showTable, setShowTable] = useState(false);

  const { principal, rate, years } = inputs;

  const setPrincipal = (v: number) => setInputs(prev => ({ ...prev, principal: v }));
  const setRate = (v: number) => setInputs(prev => ({ ...prev, rate: v }));
  const setYears = (v: number) => setInputs(prev => ({ ...prev, years: v }));

  const calc = useCallback(() => {
    const r = rate / 12 / 100;
    const n = years * 12;
    const emi =
      r === 0
        ? principal / n
        : (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayable = emi * n;
    const totalInterest = Math.max(0, totalPayable - principal);
    const rows: {
      year: number;
      principalPaid: number;
      interestPaid: number;
      balance: number;
    }[] = [];
    let balance = principal;
    for (let y = 1; y <= years; y++) {
      let yP = 0,
        yI = 0;
      for (let m = 0; m < 12; m++) {
        const i = balance * r;
        const p = emi - i;
        yI += i;
        yP += p;
        balance = Math.max(0, balance - p);
      }
      rows.push({ year: y, principalPaid: yP, interestPaid: yI, balance });
    }
    return {
      emi,
      totalPayable,
      totalInterest,
      interestRatio: totalPayable > 0 ? (totalInterest / totalPayable) * 100 : 0,
      rows,
    };
  }, [principal, rate, years]);

  if (!isLoaded) return <div className="animate-pulse h-[400px] bg-surface/50 rounded-2xl" />;

  const { emi, totalPayable, totalInterest, interestRatio, rows } = calc();

  const summary = `Loan EMI Details\n------------------\nPrincipal: ${inr(principal)}\nRate: ${rate}%\nTenure: ${years} Years\n\nMonthly EMI: ${inr(emi, 2)}\nTotal Interest: ${inr(totalInterest, 2)}\nTotal Payable: ${inr(totalPayable, 2)}\n\nGenerated via KaruviLab`;

  return (
    <>
      <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-6">
        <SliderField
          label="Loan Amount"
          id="emi-amt"
          min={10000}
          max={10000000}
          step={10000}
          value={principal}
          onChange={setPrincipal}
          format={(v) => inr(v)}
        />
        <SliderField
          label="Annual Interest Rate"
          id="emi-rate"
          min={1}
          max={30}
          step={0.1}
          value={rate}
          onChange={setRate}
          format={(v) => v.toFixed(1) + "%"}
        />
        <SliderField
          label="Loan Tenure"
          id="emi-years"
          min={1}
          max={30}
          step={1}
          value={years}
          onChange={setYears}
          format={(v) => v + " yr"}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard label="Monthly EMI" value={inr(emi, 2)} accent />
        <MetricCard label="Principal" value={inr(principal)} />
        <MetricCard label="Total Interest" value={inr(totalInterest, 2)} />
        <MetricCard label="Total Payable" value={inr(totalPayable, 2)} />
      </div>

      <div className="bg-surface border border-border p-4 rounded-xl flex flex-wrap items-center justify-between gap-3">
        <span className="text-sm text-text-3">
          Interest ratio:{" "}
          <strong className="text-yellow-500">{interestRatio.toFixed(1)}%</strong> of
          total payable
        </span>
        <div className="flex gap-3">
          <CopyButton text={summary} label="Copy Summary" />
          <button
            onClick={() => setShowTable((v) => !v)}
            className="px-3 py-1.5 text-sm font-medium bg-surface border border-border rounded-lg hover:border-blue hover:text-blue transition-colors"
          >
            {showTable ? "Hide" : "Show"} Schedule
          </button>
        </div>
      </div>

      {showTable && (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface border-b border-border">
                <th className="px-4 py-3 text-left font-bold text-text-3">Year</th>
                <th className="px-4 py-3 text-right font-bold text-text-3">Principal</th>
                <th className="px-4 py-3 text-right font-bold text-text-3">Interest</th>
                <th className="px-4 py-3 text-right font-bold text-text-3">Balance</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.year}
                  className="border-b border-border/50 hover:bg-surface transition-colors"
                >
                  <td className="px-4 py-3 text-text-2">Year {r.year}</td>
                  <td className="px-4 py-3 text-right text-text">
                    {inr(r.principalPaid, 0)}
                  </td>
                  <td className="px-4 py-3 text-right text-yellow-500">
                    {inr(r.interestPaid, 0)}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-text">
                    {inr(Math.max(0, r.balance), 0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
