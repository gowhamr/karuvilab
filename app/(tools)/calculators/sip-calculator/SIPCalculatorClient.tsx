"use client";

import { useState, useMemo, useEffect } from "react";
import { MetricCard } from "@/components/ui/MetricCard";
import { SliderField } from "@/components/ui/SliderField";
import { CopyButton } from "@/components/ui/CopyButton";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/Accordion";
import { Settings2, Download, FileText } from "lucide-react";
import { d, Decimal, formatINR, formatPercent, syncStateToUrl, getInitialStateFromUrl, exportToCSV } from "@/src/lib/calculator-utils";
import { useToast } from "@/components/ui/Toast";
import { addToHistory } from "@/src/lib/db";
import { CalculatorActionBar } from "@/components/ui/CalculatorActionBar";

const DEFAULT_STATE = {
  monthly: 5000,
  rate: 12,
  years: 10,
  stepUp: 0,
  lumpsum: 0,
  inflationRate: 6,
  taxRate: 0,
  feeRate: 0,
};

export default function SIPCalculatorClient() {
  const { toast } = useToast();
  const [isLoaded, setIsLoaded] = useState(false);
  const [monthly, setMonthly] = useState(DEFAULT_STATE.monthly);
  const [rate, setRate] = useState(DEFAULT_STATE.rate);
  const [years, setYears] = useState(DEFAULT_STATE.years);
  const [stepUp, setStepUp] = useState(DEFAULT_STATE.stepUp);
  const [lumpsum, setLumpsum] = useState(DEFAULT_STATE.lumpsum);
  const [inflationRate, setInflationRate] = useState(DEFAULT_STATE.inflationRate);
  const [taxRate, setTaxRate] = useState(DEFAULT_STATE.taxRate);
  const [feeRate, setFeeRate] = useState(DEFAULT_STATE.feeRate);
  
  const [showTable, setShowTable] = useState(false);

  // Initialize from URL
  useEffect(() => {
    const state = getInitialStateFromUrl(DEFAULT_STATE);
    setMonthly(state.monthly);
    setRate(state.rate);
    setYears(state.years);
    setStepUp(state.stepUp);
    setLumpsum(state.lumpsum);
    setInflationRate(state.inflationRate);
    setTaxRate(state.taxRate);
    setFeeRate(state.feeRate);
    setIsLoaded(true);
  }, []);

  // Sync to URL
  useEffect(() => {
    if (!isLoaded) return;
    syncStateToUrl({ monthly, rate, years, stepUp, lumpsum, inflationRate, taxRate, feeRate });
  }, [monthly, rate, years, stepUp, lumpsum, inflationRate, taxRate, feeRate, isLoaded]);

  const result = useMemo(() => {
    const effectiveAnnualRate = Decimal.max(d(rate).sub(feeRate), 0);
    const monthlyRate = effectiveAnnualRate.div(100).div(12);
    const multiplier = monthlyRate.add(1);
    
    let totalInvested = d(lumpsum);
    let lumpsumValue = d(lumpsum);
    let sipValue = d(0);
    let currentMonthly = d(monthly);

    const rows: {
      year: number;
      invested: number;
      value: number;
      gains: number;
    }[] = [];

    for (let y = 1; y <= years; y++) {
      for (let m = 0; m < 12; m++) {
        lumpsumValue = lumpsumValue.mul(multiplier);
        sipValue = sipValue.add(currentMonthly).mul(multiplier);
        totalInvested = totalInvested.add(currentMonthly);
      }
      
      const yearValue = lumpsumValue.add(sipValue);
      rows.push({
        year: y,
        invested: totalInvested.toNumber(),
        value: yearValue.toNumber(),
        gains: yearValue.sub(totalInvested).toNumber(),
      });

      if (stepUp > 0) {
        currentMonthly = currentMonthly.mul(d(1).add(d(stepUp).div(100)));
      }
    }

    const totalValue = lumpsumValue.add(sipValue);
    const totalGains = totalValue.sub(totalInvested);
    const netGains = totalGains.mul(d(1).sub(d(taxRate).div(100)));
    const netValue = totalInvested.add(netGains);
    const yieldPct = totalInvested.gt(0) ? totalGains.div(totalInvested).mul(100) : d(0);
    const netYieldPct = totalInvested.gt(0) ? netGains.div(totalInvested).mul(100) : d(0);

    const inflAdj = netValue.div(d(1).add(d(inflationRate).div(100)).pow(years));

    return { 
      totalInvested: totalInvested.toNumber(), 
      totalValue: totalValue.toNumber(), 
      totalGains: totalGains.toNumber(), 
      netGains: netGains.toNumber(), 
      netValue: netValue.toNumber(), 
      yieldPct: yieldPct.toNumber(), 
      netYieldPct: netYieldPct.toNumber(), 
      inflAdj: inflAdj.toNumber(), 
      rows 
    };
  }, [monthly, rate, years, stepUp, lumpsum, inflationRate, taxRate, feeRate]);

  const summary = `SIP Calculator Results
----------------------
Monthly SIP: ${formatINR(monthly)}
Rate: ${rate}% | Years: ${years} | Step-up: ${stepUp}%
Adjustments: Inflation ${inflationRate}%, Tax ${taxRate}%, Fees ${feeRate}%

Total Invested: ${formatINR(result.totalInvested)}
Estimated Gains: ${formatINR(result.totalGains)}
Total Value (Gross): ${formatINR(result.totalValue)}
Net Value (Post-Tax/Fees): ${formatINR(result.netValue)}
Inflation-Adjusted Net: ${formatINR(result.inflAdj)}

Generated via KaruviLab`;

  const handleExport = () => {
    const headers = ["Year", "Invested Amount", "Gains (Gross)", "Total Value"];
    const rows = result.rows.map(r => [r.year, r.invested, r.gains, r.value]);
    exportToCSV(`sip-projection-${Date.now()}.csv`, headers, rows);
    toast("Exported projection to CSV");
  };

  return (
    <div className="space-y-6">
      <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-6">
        <SliderField
          label="Monthly SIP Amount"
          id="sip-monthly"
          min={500}
          max={100000}
          step={500}
          value={monthly}
          onChange={setMonthly}
          format={(v) => formatINR(v)}
        />
        <SliderField
          label="Expected Annual Return"
          id="sip-rate"
          min={1}
          max={30}
          step={0.5}
          value={rate}
          onChange={setRate}
          format={(v) => formatPercent(v)}
        />
        <SliderField
          label="Investment Duration"
          id="sip-years"
          min={1}
          max={40}
          step={1}
          value={years}
          onChange={setYears}
          format={(v) => v + " yr"}
        />
        
        <Accordion type="single" collapsible className="border-t border-border pt-2">
          <AccordionItem value="adjustments" className="border-none">
            <AccordionTrigger className="py-2 hover:no-underline">
              <div className="flex items-center gap-2 text-blue">
                <Settings2 className="w-4 h-4" />
                <span className="text-sm font-black uppercase tracking-wider">Advanced Adjustments</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-6 pt-4">
              <SliderField
                label="Annual Inflation Rate"
                id="sip-inflation"
                min={0}
                max={15}
                step={0.5}
                value={inflationRate}
                onChange={setInflationRate}
                format={(v) => formatPercent(v)}
              />
              <SliderField
                label="Capital Gains Tax (%)"
                id="sip-tax"
                min={0}
                max={40}
                step={1}
                value={taxRate}
                onChange={setTaxRate}
                format={(v) => formatPercent(v)}
              />
              <SliderField
                label="Management Fees / Expense Ratio (%)"
                id="sip-fees"
                min={0}
                max={5}
                step={0.1}
                value={feeRate}
                onChange={setFeeRate}
                format={(v) => formatPercent(v)}
              />
              <SliderField
                label="Annual Step-up (%)"
                id="sip-stepup"
                min={0}
                max={30}
                step={1}
                value={stepUp}
                onChange={setStepUp}
                format={(v) => formatPercent(v)}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="space-y-2 pt-2 border-t border-border">
          <div className="flex items-center justify-between">
            <label htmlFor="sip-lumpsum" className="text-sm font-bold text-text-2">
              One-time Lumpsum (optional)
            </label>
            <span className="text-sm font-black text-blue">{formatINR(lumpsum)}</span>
          </div>
          <input
            id="sip-lumpsum"
            type="number"
            min={0}
            placeholder="0"
            value={lumpsum || ""}
            onChange={(e) => setLumpsum(Math.max(0, Number(e.target.value)))}
            className="w-full px-4 py-3 bg-bg border border-border rounded-xl focus:ring-2 focus:ring-blue outline-none transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard label="Net Total Value" value={formatINR(result.netValue)} accent sub="After Tax & Fees" />
        <MetricCard label="Total Invested" value={formatINR(result.totalInvested)} />
        <MetricCard label="Gross Gains" value={formatINR(result.totalGains)} />
        <MetricCard label="Net Yield" value={formatPercent(result.netYieldPct)} />
      </div>

      <div className="bg-surface border border-border p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="text-sm text-text-3 font-medium">
            Inflation-adjusted ({inflationRate}%/yr):{" "}
            <strong className="text-blue">{formatINR(result.inflAdj)}</strong>
          </div>
          <div className="text-[10px] text-text-4 font-black uppercase tracking-widest">
            Gross Value: {formatINR(result.totalValue)}
          </div>
        </div>
      </div>

      <CalculatorActionBar
        summary={summary}
        toolId="sip-calculator"
        historyLabel={`${formatINR(monthly)}/mo for ${years}y`}
        historyData={{
          monthly, rate, years, stepUp, lumpsum, inflationRate, taxRate, feeRate,
          result: {
            totalInvested: result.totalInvested,
            totalValue: result.totalValue,
            netValue: result.netValue
          }
        }}
        onExport={handleExport}
        showProjection={showTable}
        onToggleProjection={() => setShowTable(!showTable)}
      />

      {showTable && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black">Yearly Projection</h3>
          </div>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface border-b border-border">
                  <th className="px-4 py-3 text-left font-bold text-text-3">Year</th>
                  <th className="px-4 py-3 text-right font-bold text-text-3">Invested</th>
                  <th className="px-4 py-3 text-right font-bold text-text-3">Gains (Gross)</th>
                  <th className="px-4 py-3 text-right font-bold text-text-3">Total Value</th>
                </tr>
              </thead>
              <tbody>
                {result.rows.map((row) => (
                  <tr
                    key={row.year}
                    className="border-b border-border/50 hover:bg-surface transition-colors"
                  >
                    <td className="px-4 py-3 text-text-2">Year {row.year}</td>
                    <td className="px-4 py-3 text-right text-text">{formatINR(row.invested)}</td>
                    <td className="px-4 py-3 text-right text-green-500">
                      {formatINR(row.gains)}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-blue">
                      {formatINR(row.value)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
