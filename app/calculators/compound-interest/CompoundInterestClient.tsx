"use client";

import { useState, useMemo } from "react";
import { MetricCard } from "@/components/ui/MetricCard";
import { SliderField } from "@/components/ui/SliderField";
import { CopyButton } from "@/components/ui/CopyButton";

const fmt = (n: number, d = 2) =>
  n.toLocaleString("en-IN", { minimumFractionDigits: d, maximumFractionDigits: d });

const FREQ_OPTIONS = [
  { label: "Annually", value: 1 },
  { label: "Semi-annually", value: 2 },
  { label: "Quarterly", value: 4 },
  { label: "Monthly", value: 12 },
];

export default function CompoundInterestClient() {
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(10);
  const [years, setYears] = useState(10);
  const [freq, setFreq] = useState(1);

  const result = useMemo(() => {
    const A = principal * Math.pow(1 + rate / 100 / freq, freq * years);
    const interest = A - principal;
    const returnPct = principal > 0 ? (interest / principal) * 100 : 0;
    return { finalAmount: A, interest, returnPct };
  }, [principal, rate, years, freq]);

  const summary = `Compound Interest Results\n--------------------------\nPrincipal: ₹${fmt(principal, 0)}\nRate: ${rate}% p.a.\nDuration: ${years} years\nCompounding: ${FREQ_OPTIONS.find((f) => f.value === freq)?.label}\n\nFinal Amount: ₹${fmt(result.finalAmount)}\nTotal Interest: ₹${fmt(result.interest)}\nTotal Return: ${fmt(result.returnPct)}%\n\nGenerated via KaruviLab`;

  return (
    <>
      <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-6">
        <SliderField
          label="Principal Amount"
          id="ci-principal"
          min={1000}
          max={10000000}
          step={1000}
          value={principal}
          onChange={setPrincipal}
          format={(v) => "₹" + v.toLocaleString("en-IN")}
        />
        <SliderField
          label="Annual Interest Rate"
          id="ci-rate"
          min={0.5}
          max={50}
          step={0.5}
          value={rate}
          onChange={setRate}
          format={(v) => v.toFixed(1) + "%"}
        />
        <SliderField
          label="Duration"
          id="ci-years"
          min={1}
          max={50}
          step={1}
          value={years}
          onChange={setYears}
          format={(v) => v + " yr"}
        />

        <div className="space-y-2">
          <label className="text-sm font-bold text-text-2">Compounding Frequency</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {FREQ_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFreq(opt.value)}
                className={`py-2 px-3 rounded-xl text-sm font-semibold border transition-all ${
                  freq === opt.value
                    ? "bg-blue text-white border-blue"
                    : "bg-bg border-border hover:border-blue hover:text-blue"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          label="Final Amount"
          value={"₹" + fmt(result.finalAmount)}
          accent
        />
        <MetricCard
          label="Total Interest"
          value={"₹" + fmt(result.interest)}
        />
        <MetricCard
          label="Total Return"
          value={fmt(result.returnPct) + "%"}
        />
      </div>

      <div className="bg-surface border border-border p-4 rounded-xl flex flex-wrap items-center justify-between gap-3">
        <span className="text-sm text-text-3">
          ₹{fmt(principal, 0)} grows to{" "}
          <strong className="text-blue">₹{fmt(result.finalAmount)}</strong> in{" "}
          {years} years at {rate}%
        </span>
        <CopyButton text={summary} label="Copy Summary" />
      </div>
    </>
  );
}
