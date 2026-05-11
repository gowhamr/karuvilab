"use client";
import { useState, useMemo, useEffect } from "react";
import { MetricCard } from "@/components/ui/MetricCard";
import { SliderField } from "@/components/ui/SliderField";
import { d, formatINR, formatPercent, syncStateToUrl, getInitialStateFromUrl } from "@/src/lib/calculator-utils";
import { CalculatorActionBar } from "@/components/ui/CalculatorActionBar";

const FREQ_OPTIONS = [
  { label: "Annually", value: 1 },
  { label: "Semi-annually", value: 2 },
  { label: "Quarterly", value: 4 },
  { label: "Monthly", value: 12 },
];

const DEFAULT_STATE = {
  principal: 100000,
  rate: 10,
  years: 10,
  freq: 1,
};

export default function CompoundInterestClient() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [principal, setPrincipal] = useState(DEFAULT_STATE.principal);
  const [rate, setRate] = useState(DEFAULT_STATE.rate);
  const [years, setYears] = useState(DEFAULT_STATE.years);
  const [freq, setFreq] = useState(DEFAULT_STATE.freq);

  // Initialize from URL
  useEffect(() => {
    const state = getInitialStateFromUrl(DEFAULT_STATE);
    setPrincipal(state.principal);
    setRate(state.rate);
    setYears(state.years);
    setFreq(state.freq);
    setIsLoaded(true);
  }, []);

  // Sync to URL
  useEffect(() => {
    if (!isLoaded) return;
    syncStateToUrl({ principal, rate, years, freq });
  }, [principal, rate, years, freq, isLoaded]);

  const result = useMemo(() => {
    // A = P(1 + r/n)^(nt)
    const P = d(principal);
    const r = d(rate).div(100);
    const n = d(freq);
    const t = d(years);

    const A = P.mul(d(1).add(r.div(n)).pow(n.mul(t)));
    const interest = A.sub(P);
    const returnPct = P.gt(0) ? interest.div(P).mul(100) : d(0);
    
    return { 
      finalAmount: A.toNumber(), 
      interest: interest.toNumber(), 
      returnPct: returnPct.toNumber() 
    };
  }, [principal, rate, years, freq]);

  const summary = `Compound Interest Results
--------------------------
Principal: ${formatINR(principal)}
Rate: ${rate}% p.a.
Duration: ${years} years
Compounding: ${FREQ_OPTIONS.find((f) => f.value === freq)?.label}

Final Amount: ${formatINR(result.finalAmount)}
Total Interest: ${formatINR(result.interest)}
Total Return: ${formatPercent(result.returnPct)}

Generated via KaruviLab`;

  return (
    <div className="space-y-6">
      <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-6">
        <SliderField
          label="Principal Amount"
          id="ci-principal"
          min={1000}
          max={10000000}
          step={1000}
          value={principal}
          onChange={setPrincipal}
          format={(v) => formatINR(v)}
        />
        <SliderField
          label="Annual Interest Rate"
          id="ci-rate"
          min={0.5}
          max={50}
          step={0.5}
          value={rate}
          onChange={setRate}
          format={(v) => formatPercent(v)}
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
          value={formatINR(result.finalAmount)}
          accent
        />
        <MetricCard
          label="Total Interest"
          value={formatINR(result.interest)}
        />
        <MetricCard
          label="Total Return"
          value={formatPercent(result.returnPct)}
        />
      </div>

      <div className="space-y-4">
        <div className="bg-surface border border-border p-4 rounded-xl">
          <span className="text-sm text-text-3 font-medium">
            {formatINR(principal)} grows to{" "}
            <strong className="text-blue">{formatINR(result.finalAmount)}</strong> in{" "}
            {years} years at {rate}%
          </span>
        </div>

        <CalculatorActionBar
          summary={summary}
          toolId="compound-interest"
          historyLabel={`${formatINR(principal)} for ${years}y @ ${rate}%`}
          historyData={{ principal, rate, years, freq, result }}
        />
      </div>
    </div>
  );
}
