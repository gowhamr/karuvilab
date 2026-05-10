"use client";

import { useState, useMemo, memo } from "react";
import { MetricCard } from "@/components/ui/MetricCard";
import { SliderField } from "@/components/ui/SliderField";
import { CopyButton } from "@/components/ui/CopyButton";
import { m } from "framer-motion";

const inr = (n: number, d = 0) =>
  "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: d, maximumFractionDigits: d });

const MutualFundReturnsClient = memo(function MutualFundReturnsClient() {
  const [lumpsum, setLumpsum] = useState(100000);
  const [sip, setSip] = useState(5000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);
  const [showTable, setShowTable] = useState(false);

  const result = useMemo(() => {
    const r = rate / 100 / 12;
    
    let totalInvested = lumpsum;
    let currentValue = lumpsum;
    
    const rows: { year: number; invested: number; value: number; gains: number }[] = [];

    for (let y = 1; y <= years; y++) {
      for (let m = 0; m < 12; m++) {
        currentValue = (currentValue + sip) * (1 + r);
        totalInvested += sip;
      }
      rows.push({
        year: y,
        invested: totalInvested,
        value: currentValue,
        gains: currentValue - totalInvested,
      });
    }

    const totalGains = currentValue - totalInvested;
    const absReturn = totalInvested > 0 ? (totalGains / totalInvested) * 100 : 0;
    
    return { totalInvested, currentValue, totalGains, absReturn, rows };
  }, [lumpsum, sip, rate, years]);

  const summary = `Mutual Fund Returns Summary\n--------------------------\nInitial Lumpsum: ${inr(lumpsum)}\nMonthly SIP: ${inr(sip)}\nExpected Return: ${rate}%\nDuration: ${years} years\n\nTotal Invested: ${inr(result.totalInvested)}\nTotal Gains: ${inr(result.totalGains)}\nTotal Value: ${inr(result.currentValue)}\nAbsolute Return: ${result.absReturn.toFixed(2)}%\n\nGenerated via KaruviLab`;

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
            format={(v) => inr(v)}
          />
          <SliderField
            label="Monthly SIP"
            id="mf-sip"
            min={0}
            max={100000}
            step={500}
            value={sip}
            onChange={setSip}
            format={(v) => inr(v)}
          />
          <SliderField
            label="Expected Return (p.a)"
            id="mf-rate"
            min={1}
            max={30}
            step={0.5}
            value={rate}
            onChange={setRate}
            format={(v) => v + "%"}
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
            <MetricCard label="Total Value" value={inr(result.currentValue)} accent />
            <MetricCard label="Total Invested" value={inr(result.totalInvested)} />
            <MetricCard label="Total Gains" value={inr(result.totalGains)} />
            <MetricCard label="Absolute Return" value={result.absReturn.toFixed(1) + "%"} />
          </div>
          
          <div className="bg-surface border border-border p-4 rounded-xl flex items-center justify-between gap-3">
             <CopyButton text={summary} label="Copy Summary" />
             <button
                onClick={() => setShowTable(!showTable)}
                className="px-4 py-2 text-sm font-medium bg-bg border border-border rounded-lg hover:border-blue transition-colors"
              >
                {showTable ? "Hide" : "Show"} Projection
              </button>
          </div>
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
                <th className="px-4 py-3 text-left">Year</th>
                <th className="px-4 py-3 text-right">Invested</th>
                <th className="px-4 py-3 text-right">Gains</th>
                <th className="px-4 py-3 text-right">Total Value</th>
              </tr>
            </thead>
            <tbody>
              {result.rows.map((row) => (
                <tr key={row.year} className="border-b border-border/50 hover:bg-surface/50">
                  <td className="px-4 py-3">Year {row.year}</td>
                  <td className="px-4 py-3 text-right">{inr(row.invested)}</td>
                  <td className="px-4 py-3 text-right text-green-500">{inr(row.gains)}</td>
                  <td className="px-4 py-3 text-right font-bold text-blue">{inr(row.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </m.div>
      )}
    </div>
  );
});

export default MutualFundReturnsClient;
