"use client";

import { useState, useMemo, useEffect } from "react";
import { MetricCard } from "@/components/ui/MetricCard";
import { SliderField } from "@/components/ui/SliderField";
import { m } from "framer-motion";
import { d, formatINR, formatPercent, syncStateToUrl, getInitialStateFromUrl, exportToCSV } from "@/src/lib/calculator-utils";
import { CalculatorActionBar } from "@/components/ui/CalculatorActionBar";
import { useToast } from "@/components/ui/Toast";

const DEFAULT_STATE = {
  lumpsum: 100000,
  sip: 5000,
  rate: 12,
  years: 10,
};

export default function MutualFundReturnsClient() {
  const { toast } = useToast();
  const [isLoaded, setIsLoaded] = useState(false);
  const [lumpsum, setLumpsum] = useState(DEFAULT_STATE.lumpsum);
  const [sip, setSip] = useState(DEFAULT_STATE.sip);
  const [rate, setRate] = useState(DEFAULT_STATE.rate);
  const [years, setYears] = useState(DEFAULT_STATE.years);
  const [showTable, setShowTable] = useState(false);

  // Initialize from URL
  useEffect(() => {
    const state = getInitialStateFromUrl(DEFAULT_STATE);
    setLumpsum(state.lumpsum);
    setSip(state.sip);
    setRate(state.rate);
    setYears(state.years);
    setIsLoaded(true);
  }, []);

  // Sync to URL
  useEffect(() => {
    if (!isLoaded) return;
    syncStateToUrl({ lumpsum, sip, rate, years });
  }, [lumpsum, sip, rate, years, isLoaded]);

  const result = useMemo(() => {
    const r = d(rate).div(100).div(12);
    
    let totalInvested = d(lumpsum);
    let currentValue = d(lumpsum);
    
    const rows: { year: number; invested: number; value: number; gains: number }[] = [];

    for (let y = 1; y <= years; y++) {
      for (let m = 0; m < 12; m++) {
        currentValue = currentValue.add(sip).mul(r.add(1));
        totalInvested = totalInvested.add(sip);
      }
      rows.push({
        year: y,
        invested: totalInvested.toNumber(),
        value: currentValue.toNumber(),
        gains: currentValue.sub(totalInvested).toNumber(),
      });
    }

    const totalGains = currentValue.sub(totalInvested);
    const absReturn = totalInvested.gt(0) ? totalGains.div(totalInvested).mul(100) : d(0);
    
    return { 
      totalInvested: totalInvested.toNumber(), 
      currentValue: currentValue.toNumber(), 
      totalGains: totalGains.toNumber(), 
      absReturn: absReturn.toNumber(), 
      rows 
    };
  }, [lumpsum, sip, rate, years]);

  const summary = `Mutual Fund Returns Summary
--------------------------
Initial Lumpsum: ${formatINR(lumpsum)}
Monthly SIP: ${formatINR(sip)}
Expected Return: ${rate}%
Duration: ${years} years

Total Invested: ${formatINR(result.totalInvested)}
Total Gains: ${formatINR(result.totalGains)}
Total Value: ${formatINR(result.currentValue)}
Absolute Return: ${formatPercent(result.absReturn)}

Generated via KaruviLab`;

  const handleExport = () => {
    const headers = ["Year", "Invested Amount", "Gains", "Total Value"];
    const rows = result.rows.map(r => [r.year, r.invested, r.gains, r.value]);
    exportToCSV(`mf-returns-projection-${Date.now()}.csv`, headers, rows);
    toast("Exported projection to CSV");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface border border-border p-6 rounded-2xl space-y-6">
          <SliderField
            label="Initial Lumpsum"
            id="mf-lumpsum"
            min={0}
            max={1000000}
            step={5000}
            value={lumpsum}
            onChange={setLumpsum}
            format={(v) => formatINR(v)}
          />
          <SliderField
            label="Monthly SIP"
            id="mf-sip"
            min={0}
            max={100000}
            step={500}
            value={sip}
            onChange={setSip}
            format={(v) => formatINR(v)}
          />
          <SliderField
            label="Expected Return (p.a)"
            id="mf-rate"
            min={1}
            max={30}
            step={0.5}
            value={rate}
            onChange={setRate}
            format={(v) => formatPercent(v)}
          />
          <SliderField
            label="Duration"
            id="mf-years"
            min={1}
            max={40}
            step={1}
            value={years}
            onChange={setYears}
            format={(v) => v + " yrs"}
          />
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <MetricCard label="Total Value" value={formatINR(result.currentValue)} accent />
            <MetricCard label="Total Invested" value={formatINR(result.totalInvested)} />
            <MetricCard label="Total Gains" value={formatINR(result.totalGains)} />
            <MetricCard label="Absolute Return" value={formatPercent(result.absReturn)} />
          </div>
          
          <CalculatorActionBar
            summary={summary}
            toolId="mutual-fund-returns"
            historyLabel={`${formatINR(sip)}/mo + ${formatINR(lumpsum)}`}
            historyData={{ lumpsum, sip, rate, years, result }}
            onExport={handleExport}
            showProjection={showTable}
            onToggleProjection={() => setShowTable(!showTable)}
          />
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
                <th className="px-4 py-3 text-left font-bold">Year</th>
                <th className="px-4 py-3 text-right font-bold">Invested</th>
                <th className="px-4 py-3 text-right font-bold">Gains</th>
                <th className="px-4 py-3 text-right font-bold">Total Value</th>
              </tr>
            </thead>
            <tbody>
              {result.rows.map((row) => (
                <tr key={row.year} className="border-b border-border/50 hover:bg-surface/50 transition-colors">
                  <td className="px-4 py-3 text-text-2 font-medium">Year {row.year}</td>
                  <td className="px-4 py-3 text-right text-text">{formatINR(row.invested)}</td>
                  <td className="px-4 py-3 text-right text-green-500 font-medium">{formatINR(row.gains)}</td>
                  <td className="px-4 py-3 text-right font-bold text-blue">{formatINR(row.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </m.div>
      )}
    </div>
  );
}
