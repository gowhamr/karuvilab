"use client";

import { useState, useMemo, useEffect } from "react";
import { MetricCard } from "@/components/ui/MetricCard";
import { SliderField } from "@/components/ui/SliderField";
import { m } from "framer-motion";
import { d, formatINR, formatPercent, syncStateToUrl, getInitialStateFromUrl, exportToCSV } from "@/src/lib/calculator-utils";
import { ToolWorkspace } from "@/components/ui/ToolWorkspace";
import { CalculatorActionBar } from "@/components/ui/CalculatorActionBar";
import { useToast } from "@/components/ui/Toast";

const DEFAULT_STATE = {
  principal: 100000,
  rate: 12,
  years: 10,
};

export default function LumpsumCalculatorClient() {
  const { toast } = useToast();
  const [isLoaded, setIsLoaded] = useState(false);
  const [principal, setPrincipal] = useState(DEFAULT_STATE.principal);
  const [rate, setRate] = useState(DEFAULT_STATE.rate);
  const [years, setYears] = useState(DEFAULT_STATE.years);
  const [showTable, setShowTable] = useState(false);

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
    const r = d(rate).div(100);
    const rows: { year: number; value: number; gains: number }[] = [];

    for (let y = 1; y <= years; y++) {
      const value = d(principal).mul(d(1).add(r).pow(y));
      rows.push({
        year: y,
        value: value.toNumber(),
        gains: value.sub(principal).toNumber(),
      });
    }

    const totalValue = d(principal).mul(d(1).add(r).pow(years));
    const totalGains = totalValue.sub(principal);
    
    return { totalValue: totalValue.toNumber(), totalGains: totalGains.toNumber(), rows };
  }, [principal, rate, years]);

  const summary = `Lumpsum Investment Summary
--------------------------
Principal: ${formatINR(principal)}
Interest Rate: ${rate}%
Duration: ${years} years

Total Gains: ${formatINR(result.totalGains)}
Total Maturity Value: ${formatINR(result.totalValue)}

Generated via KaruviLab`;

  const handleExport = () => {
    const headers = ["Year", "Maturity Value", "Gains"];
    const rows = result.rows.map(r => [r.year, r.value, r.gains]);
    exportToCSV(`lumpsum-projection-${Date.now()}.csv`, headers, rows);
    toast("Exported projection to CSV");
  };

  return (
    <ToolWorkspace
      input={
        <div className="space-y-6">
          <SliderField
            label="Total Investment"
            id="ls-principal"
            min={1000}
            max={10000000}
            step={5000}
            value={principal}
            onChange={setPrincipal}
            format={(v) => formatINR(v)}
          />
          <SliderField
            label="Expected Return Rate (p.a)"
            id="ls-rate"
            min={1}
            max={30}
            step={0.5}
            value={rate}
            onChange={setRate}
            format={(v) => formatPercent(v)}
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
      }
      output={
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <MetricCard label="Maturity Value" value={formatINR(result.totalValue)} accent />
            <MetricCard label="Total Invested" value={formatINR(principal)} />
            <MetricCard label="Estimated Gains" value={formatINR(result.totalGains)} />
          </div>
          
          <CalculatorActionBar
            summary={summary}
            toolId="lumpsum-calculator"
            historyLabel={`${formatINR(principal)} for ${years}y`}
            historyData={{ principal, rate, years, result: { totalValue: result.totalValue, totalGains: result.totalGains } }}
            onExport={handleExport}
            showProjection={showTable}
            onToggleProjection={() => setShowTable(!showTable)}
          />
        </div>
      }
      infoPanel={
        showTable ? (
          <m.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-x-auto rounded-xl border border-border"
          >
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface border-b border-border text-text-3">
                  <th className="px-4 py-3 text-left font-bold">Year</th>
                  <th className="px-4 py-3 text-right font-bold">Value</th>
                  <th className="px-4 py-3 text-right font-bold">Gains</th>
                </tr>
              </thead>
              <tbody>
                {result.rows.map((row) => (
                  <tr key={row.year} className="border-b border-border/50 hover:bg-surface/50 transition-colors">
                    <td className="px-4 py-3 text-text-2 font-medium">Year {row.year}</td>
                    <td className="px-4 py-3 text-right font-bold text-blue">{formatINR(row.value)}</td>
                    <td className="px-4 py-3 text-right text-green-500 font-medium">{formatINR(row.gains)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </m.div>
        ) : null
      }
    />
  );
}
