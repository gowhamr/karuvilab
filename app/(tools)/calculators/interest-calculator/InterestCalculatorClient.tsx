"use client";

import { useState, useMemo, useEffect } from "react";
import { MetricCard } from "@/components/ui/MetricCard";
import { SliderField } from "@/components/ui/SliderField";
import { d, formatINR, formatPercent, syncStateToUrl, getInitialStateFromUrl } from "@/src/lib/calculator-utils";
import { CalculatorActionBar } from "@/components/ui/CalculatorActionBar";

const DEFAULT_STATE = {
  principal: 100000,
  rate: 10,
  years: 10,
};

const toolId = "interest-calculator";

export default function InterestCalculatorClient() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [principal, setPrincipal] = useState(DEFAULT_STATE.principal);
  const [rate, setRate] = useState(DEFAULT_STATE.rate);
  const [years, setYears] = useState(DEFAULT_STATE.years);

  // Initialize from URL
  useEffect(() => {
    const state = getInitialStateFromUrl(DEFAULT_STATE);
    setPrincipal(state.principal);
    setRate(state.rate);
    setYears(state.years);
    setIsLoaded(true);
  }, []);

  // Sync to URL
  useEffect(() => {
    if (!isLoaded) return;
    syncStateToUrl({ principal, rate, years });
  }, [principal, rate, years, isLoaded]);

  const result = useMemo(() => {
    const P = d(principal);
    const R = d(rate);
    const T = d(years);

    // Simple Interest Formula: I = (P * R * T) / 100
    const interest = P.mul(R).mul(T).div(100);
    const finalAmount = P.add(interest);
    const returnPct = P.gt(0) ? interest.div(P).mul(100) : d(0);
    
    return { 
      finalAmount: finalAmount.toNumber(), 
      interest: interest.toNumber(), 
      returnPct: returnPct.toNumber() 
    };
  }, [principal, rate, years]);

  const summary = `Simple Interest Results
--------------------------
Principal: ${formatINR(principal)}
Rate: ${rate}% p.a.
Duration: ${years} years

Final Amount: ${formatINR(result.finalAmount)}
Total Interest: ${formatINR(result.interest)}
Total Return: ${formatPercent(result.returnPct)}

Generated via KaruviLab`;

  return (
    <div className="space-y-8">
      <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-6">
        <SliderField
          label="Principal Amount"
          id="si-principal"
          min={1000}
          max={10000000}
          step={1000}
          value={principal}
          onChange={setPrincipal}
          format={(v) => formatINR(v)}
        />
        <SliderField
          label="Annual Interest Rate"
          id="si-rate"
          min={0.5}
          max={50}
          step={0.5}
          value={rate}
          onChange={setRate}
          format={(v) => formatPercent(v)}
        />
        <SliderField
          label="Duration"
          id="si-years"
          min={1}
          max={50}
          step={1}
          value={years}
          onChange={setYears}
          format={(v) => v + " yr"}
        />
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

      <CalculatorActionBar
        summary={summary}
        toolId={toolId}
        historyLabel={`${formatINR(principal)} for ${years}y @ ${rate}%`}
        historyData={{ principal, rate, years, result }}
      />
    </div>
  );
}
