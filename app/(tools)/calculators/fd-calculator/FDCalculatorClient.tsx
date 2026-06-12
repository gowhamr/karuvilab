"use client";

import { useState, useMemo, memo } from "react";
import { MetricCard } from "@/components/ui/MetricCard";
import { SliderField } from "@/components/ui/SliderField";
import { CopyButton } from "@/components/ui/CopyButton";

const inr = (n: number, d = 0) =>
  "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: d, maximumFractionDigits: d });

const FDCalculatorClient = memo(function FDCalculatorClient() {
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(6.5);
  const [tenure, setTenure] = useState(5);
  const [tenureUnit, setTenureUnit] = useState<"years" | "months" | "days">("years");
  const [compounding, setCompounding] = useState(4); // Quarterly

  const result = useMemo(() => {
    let t = tenure;
    if (tenureUnit === "months") t = tenure / 12;
    if (tenureUnit === "days") t = tenure / 365.25;

    // A = P(1 + r/n)^(nt)
    const maturityValue = principal * Math.pow(1 + rate / 100 / compounding, compounding * t);
    const totalInterest = maturityValue - principal;

    return { maturityValue, totalInterest };
  }, [principal, rate, tenure, tenureUnit, compounding]);

  const summary = `FD Maturity Summary\n------------------\nPrincipal: ${inr(principal)}\nInterest Rate: ${rate}%\nTenure: ${tenure} ${tenureUnit}\nCompounding: ${compounding === 12 ? 'Monthly' : compounding === 4 ? 'Quarterly' : compounding === 2 ? 'Half-yearly' : 'Annual'}\n\nTotal Interest: ${inr(result.totalInterest)}\nMaturity Amount: ${inr(result.maturityValue)}\n\nGenerated via KaruviLab`;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface border border-border p-6 rounded-2xl space-y-6">
          <SliderField
            label="Principal Amount"
            id="fd-principal"
            min={1000}
            max={10000000}
            step={5000}
            value={principal}
            onChange={setPrincipal}
            format={(v) => inr(v)}
          />
          <SliderField
            label="Interest Rate (%)"
            id="fd-rate"
            min={1}
            max={15}
            step={0.1}
            value={rate}
            onChange={setRate}
            format={(v) => v + "%"}
          />
          
          <div className="space-y-4">
             <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-text-2">Tenure</label>
                <div className="flex gap-2">
                   {(['days', 'months', 'years'] as const).map(u => (
                      <button 
                        key={u}
                        onClick={() => setTenureUnit(u)}
                        className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${tenureUnit === u ? 'bg-blue text-white shadow-md shadow-blue/10' : 'bg-bg border border-border text-text-3 hover:border-blue/50'}`}
                      >
                        {u.toUpperCase()}
                      </button>
                   ))}
                </div>
             </div>
             <SliderField
                label=""
                id="fd-tenure"
                min={1}
                max={tenureUnit === 'years' ? 30 : tenureUnit === 'months' ? 120 : 3650}
                step={1}
                value={tenure}
                onChange={setTenure}
                format={(v) => v + " " + tenureUnit}
              />
          </div>
          
          <div className="space-y-2 pt-2 border-t border-border">
            <label htmlFor="compounding-select" className="text-sm font-bold text-text-2 block mb-2">Compounding Frequency</label>
            <select 
              id="compounding-select"
              value={compounding}
              onChange={(e) => setCompounding(Number(e.target.value))}
              className="w-full px-4 py-3 bg-bg border border-border rounded-xl focus:ring-2 focus:ring-blue outline-none transition-all text-text"
            >
              <option value={12}>Monthly</option>
              <option value={4}>Quarterly</option>
              <option value={2}>Half-Yearly</option>
              <option value={1}>Annual</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <MetricCard label="Maturity Amount" value={inr(result.maturityValue)} accent />
            <MetricCard label="Total Interest" value={inr(result.totalInterest)} />
            <MetricCard label="Principal" value={inr(principal)} />
          </div>
          
          <div className="bg-surface border border-border p-4 rounded-xl flex items-center justify-between gap-3">
             <CopyButton text={summary} label="Copy Summary" />
          </div>
        </div>
      </div>
    </div>
  );
});

export default FDCalculatorClient;
