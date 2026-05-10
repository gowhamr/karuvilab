"use client";

import { useState, useMemo } from "react";
import { MetricCard } from "@/components/ui/MetricCard";
import { SliderField } from "@/components/ui/SliderField";
import { CopyButton } from "@/components/ui/CopyButton";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/Accordion";
import { Settings2 } from "lucide-react";

const inr = (n: number, d = 0) =>
  "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: d, maximumFractionDigits: d });

export default function SIPCalculatorClient() {
  const [monthly, setMonthly] = useState(5000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);
  const [stepUp, setStepUp] = useState(0);
  const [lumpsum, setLumpsum] = useState(0);
  const [showTable, setShowTable] = useState(false);

  // Adjustments
  const [inflationRate, setInflationRate] = useState(6);
  const [taxRate, setTaxRate] = useState(0);
  const [feeRate, setFeeRate] = useState(0);

  const result = useMemo(() => {
    const effectiveAnnualRate = Math.max(0, rate - feeRate);
    const r = effectiveAnnualRate / 100 / 12;
    let totalInvested = lumpsum;

    const rows: {
      year: number;
      invested: number;
      value: number;
      gains: number;
    }[] = [];

    let lumpsumValue = lumpsum;
    let sipValue = 0;
    let currentMonthly = monthly;

    for (let y = 1; y <= years; y++) {
      for (let m = 0; m < 12; m++) {
        lumpsumValue *= 1 + r;
        sipValue = (sipValue + currentMonthly) * (1 + r);
        totalInvested += currentMonthly;
      }
      const yearValue = lumpsumValue + sipValue;
      rows.push({
        year: y,
        invested: totalInvested,
        value: yearValue,
        gains: yearValue - totalInvested,
      });
      if (stepUp > 0) {
        currentMonthly = currentMonthly * (1 + stepUp / 100);
      }
    }

    const totalValue = lumpsumValue + sipValue;
    const totalGains = totalValue - totalInvested;
    const netGains = totalGains * (1 - taxRate / 100);
    const netValue = totalInvested + netGains;
    const yieldPct = totalInvested > 0 ? (totalGains / totalInvested) * 100 : 0;
    const netYieldPct = totalInvested > 0 ? (netGains / totalInvested) * 100 : 0;

    const inflAdj = netValue / Math.pow(1 + inflationRate / 100, years);

    return { totalInvested, totalValue, totalGains, netGains, netValue, yieldPct, netYieldPct, inflAdj, rows };
  }, [monthly, rate, years, stepUp, lumpsum, inflationRate, taxRate, feeRate]);

  const summary = `SIP Calculator Results\n----------------------\nMonthly SIP: ${inr(monthly)}\nRate: ${rate}% | Years: ${years} | Step-up: ${stepUp}%\nAdjustments: Inflation ${inflationRate}%, Tax ${taxRate}%, Fees ${feeRate}%\n\nTotal Invested: ${inr(result.totalInvested)}\nEstimated Gains: ${inr(result.totalGains)}\nTotal Value (Gross): ${inr(result.totalValue)}\nNet Value (Post-Tax/Fees): ${inr(result.netValue)}\nInflation-Adjusted Net: ${inr(result.inflAdj)}\n\nGenerated via KaruviLab`;

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
          format={(v) => inr(v)}
        />
        <SliderField
          label="Expected Annual Return"
          id="sip-rate"
          min={1}
          max={30}
          step={0.5}
          value={rate}
          onChange={setRate}
          format={(v) => v.toFixed(1) + "%"}
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
                format={(v) => v + "%"}
              />
              <SliderField
                label="Capital Gains Tax (%)"
                id="sip-tax"
                min={0}
                max={40}
                step={1}
                value={taxRate}
                onChange={setTaxRate}
                format={(v) => v + "%"}
              />
              <SliderField
                label="Management Fees / Expense Ratio (%)"
                id="sip-fees"
                min={0}
                max={5}
                step={0.1}
                value={feeRate}
                onChange={setFeeRate}
                format={(v) => v + "%"}
              />
              <SliderField
                label="Annual Step-up (%)"
                id="sip-stepup"
                min={0}
                max={30}
                step={1}
                value={stepUp}
                onChange={setStepUp}
                format={(v) => v + "%"}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="space-y-2 pt-2 border-t border-border">
          <div className="flex items-center justify-between">
            <label htmlFor="sip-lumpsum" className="text-sm font-bold text-text-2">
              One-time Lumpsum (optional)
            </label>
            <span className="text-sm font-black text-blue">{inr(lumpsum)}</span>
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
        <MetricCard label="Net Total Value" value={inr(result.netValue)} accent sub="After Tax & Fees" />
        <MetricCard label="Total Invested" value={inr(result.totalInvested)} />
        <MetricCard label="Gross Gains" value={inr(result.totalGains)} />
        <MetricCard label="Net Yield" value={result.netYieldPct.toFixed(1) + "%"} />
      </div>

      <div className="bg-surface border border-border p-4 rounded-xl flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="text-sm text-text-3">
            Inflation-adjusted ({inflationRate}%/yr):{" "}
            <strong className="text-blue">{inr(result.inflAdj)}</strong>
          </div>
          <div className="text-[10px] text-text-4 font-bold uppercase tracking-wider">
            Gross Value: {inr(result.totalValue)}
          </div>
        </div>
        <div className="flex gap-3">
          <CopyButton text={summary} label="Copy Summary" />
          <button
            onClick={() => setShowTable((v) => !v)}
            className="px-3 py-1.5 text-sm font-medium bg-surface border border-border rounded-lg hover:border-blue hover:text-blue transition-colors"
          >
            {showTable ? "Hide" : "Show"} Projection
          </button>
        </div>
      </div>

      {showTable && (
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
                  <td className="px-4 py-3 text-right text-text">{inr(row.invested)}</td>
                  <td className="px-4 py-3 text-right text-green-500">
                    {inr(row.gains)}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-blue">
                    {inr(row.value)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
