"use client";

import { useState, useMemo, memo } from "react";
import { MetricCard } from "@/components/ui/MetricCard";
import { SliderField } from "@/components/ui/SliderField";
import { CopyButton } from "@/components/ui/CopyButton";
import { ToolWorkspace } from "@/components/ui/ToolWorkspace";
import { m } from "framer-motion";

const inr = (n: number, d = 0) =>
  "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: d, maximumFractionDigits: d });

const PPFCalculatorClient = memo(function PPFCalculatorClient() {
  const [annualInvestment, setAnnualInvestment] = useState(150000);
  const [rate, setRate] = useState(7.1);
  const [years, setYears] = useState(15);
  const [showTable, setShowTable] = useState(false);

  const result = useMemo(() => {
    const r = rate / 100;
    let balance = 0;
    let totalInvested = 0;
    const rows: { year: number; invested: number; interest: number; balance: number }[] = [];

    for (let y = 1; y <= years; y++) {
      const interest = (balance + annualInvestment) * r;
      balance = balance + annualInvestment + interest;
      totalInvested += annualInvestment;
      rows.push({
        year: y,
        invested: totalInvested,
        interest: interest,
        balance: balance,
      });
    }

    const totalInterest = balance - totalInvested;
    
    return { balance, totalInvested, totalInterest, rows };
  }, [annualInvestment, rate, years]);

  const summary = `PPF Maturity Summary\n--------------------\nAnnual Investment: ${inr(annualInvestment)}\nInterest Rate: ${rate}%\nTenure: ${years} years\n\nTotal Invested: ${inr(result.totalInvested)}\nTotal Interest: ${inr(result.totalInterest)}\nMaturity Amount: ${inr(result.balance)}\n\nGenerated via KaruviLab`;

  return (
    <ToolWorkspace
      input={
        <div className="space-y-6">
          <SliderField
            label="Annual Investment"
            id="ppf-annual"
            min={500}
            max={150000}
            step={500}
            value={annualInvestment}
            onChange={setAnnualInvestment}
            format={(v) => inr(v)}
          />
          <SliderField
            label="Interest Rate (%)"
            id="ppf-rate"
            min={1}
            max={15}
            step={0.1}
            value={rate}
            onChange={setRate}
            format={(v) => v + "%"}
          />
          <SliderField
            label="Tenure (Years)"
            id="ppf-years"
            min={15}
            max={50}
            step={5}
            value={years}
            onChange={setYears}
            format={(v) => v + " yrs"}
          />
        </div>
      }
      output={
        <div className="space-y-6 flex flex-col h-full justify-between">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <MetricCard label="Maturity Amount" value={inr(result.balance)} accent />
            <MetricCard label="Total Invested" value={inr(result.totalInvested)} />
            <MetricCard label="Total Interest" value={inr(result.totalInterest)} />
          </div>
          
          <div className="bg-bg border border-border p-4 rounded-xl flex items-center justify-between gap-3 mt-4">
            <CopyButton text={summary} label="Copy Summary" />
            <button
              onClick={() => setShowTable(!showTable)}
              className="px-4 py-2 text-sm font-medium bg-surface border border-border rounded-lg hover:border-blue transition-colors"
            >
              {showTable ? "Hide" : "Show"} Projection
            </button>
          </div>
        </div>
      }
      infoPanel={
        showTable ? (
          <m.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-x-auto rounded-xl border border-border bg-surface"
          >
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-bg border-b border-border text-text-3">
                  <th className="px-4 py-3 text-left">Year</th>
                  <th className="px-4 py-3 text-right">Invested</th>
                  <th className="px-4 py-3 text-right">Interest</th>
                  <th className="px-4 py-3 text-right">Balance</th>
                </tr>
              </thead>
              <tbody>
                {result.rows.map((row) => (
                  <tr key={row.year} className="border-b border-border/50 hover:bg-bg/50">
                    <td className="px-4 py-3">Year {row.year}</td>
                    <td className="px-4 py-3 text-right">{inr(row.invested)}</td>
                    <td className="px-4 py-3 text-right text-green-500">{inr(row.interest)}</td>
                    <td className="px-4 py-3 text-right font-bold text-blue">{inr(row.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </m.div>
        ) : null
      }
    />
  );
});

export default PPFCalculatorClient;
