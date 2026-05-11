"use client";

import { useState, useMemo, useEffect } from "react";
import { MetricCard } from "@/components/ui/MetricCard";
import { SliderField } from "@/components/ui/SliderField";
import { d, Decimal, formatINR, formatPercent, syncStateToUrl, getInitialStateFromUrl, exportToCSV } from "@/src/lib/calculator-utils";
import { CalculatorActionBar } from "@/components/ui/CalculatorActionBar";
import { useToast } from "@/components/ui/Toast";

const DEFAULT_STATE = {
  principal: 500000,
  rate: 8.5,
  years: 5
};

export default function EMICalculatorClient() {
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
    const P = d(principal);
    const r = d(rate).div(12).div(100);
    const n = d(years).mul(12);
    const nVal = n.toNumber();
    
    let emi;
    if (r.eq(0)) {
      emi = P.div(n);
    } else {
      const pow = d(1).add(r).pow(n);
      emi = P.mul(r).mul(pow).div(pow.sub(1));
    }

    const totalPayable = emi.mul(n);
    const totalInterest = Decimal.max(totalPayable.sub(P), 0);
    const interestRatio = totalPayable.gt(0) ? totalInterest.div(totalPayable).mul(100) : d(0);

    const rows: {
      year: number;
      principalPaid: number;
      interestPaid: number;
      balance: number;
    }[] = [];

    let balance = P;
    const rVal = r;
    const emiVal = emi;

    for (let y = 1; y <= years; y++) {
      let yP = d(0);
      let yI = d(0);
      for (let m = 0; m < 12; m++) {
        const i = balance.mul(rVal);
        const p = emiVal.sub(i);
        yI = yI.add(i);
        yP = yP.add(p);
        balance = Decimal.max(balance.sub(p), 0);
      }
      rows.push({ 
        year: y, 
        principalPaid: yP.toNumber(), 
        interestPaid: yI.toNumber(), 
        balance: balance.toNumber() 
      });
    }

    return {
      emi: emi.toNumber(),
      totalPayable: totalPayable.toNumber(),
      totalInterest: totalInterest.toNumber(),
      interestRatio: interestRatio.toNumber(),
      rows,
    };
  }, [principal, rate, years]);

  const summary = `Loan EMI Details
------------------
Principal: ${formatINR(principal)}
Rate: ${rate}%
Tenure: ${years} Years

Monthly EMI: ${formatINR(result.emi, 2)}
Total Interest: ${formatINR(result.totalInterest, 2)}
Total Payable: ${formatINR(result.totalPayable, 2)}

Generated via KaruviLab`;

  const handleExport = () => {
    const headers = ["Year", "Principal Paid", "Interest Paid", "Balance"];
    const rows = result.rows.map(r => [r.year, r.principalPaid, r.interestPaid, r.balance]);
    exportToCSV(`loan-schedule-${Date.now()}.csv`, headers, rows);
    toast("Exported loan schedule to CSV");
  };

  if (!isLoaded) return <div className="animate-pulse h-[400px] bg-surface/50 rounded-2xl" />;

  return (
    <div className="space-y-6">
      <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-6">
        <SliderField
          label="Loan Amount"
          id="emi-amt"
          min={10000}
          max={10000000}
          step={10000}
          value={principal}
          onChange={setPrincipal}
          format={(v) => formatINR(v)}
        />
        <SliderField
          label="Annual Interest Rate"
          id="emi-rate"
          min={1}
          max={30}
          step={0.1}
          value={rate}
          onChange={setRate}
          format={(v) => formatPercent(v)}
        />
        <SliderField
          label="Loan Tenure"
          id="emi-years"
          min={1}
          max={30}
          step={1}
          value={years}
          onChange={setYears}
          format={(v) => v + " yr"}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard label="Monthly EMI" value={formatINR(result.emi, 2)} accent />
        <MetricCard label="Principal" value={formatINR(principal)} />
        <MetricCard label="Total Interest" value={formatINR(result.totalInterest, 2)} />
        <MetricCard label="Total Payable" value={formatINR(result.totalPayable, 2)} />
      </div>

      <div className="space-y-4">
        <div className="bg-surface border border-border p-4 rounded-xl">
          <span className="text-sm text-text-3 font-medium">
            Interest ratio:{" "}
            <strong className="text-yellow-500">{result.interestRatio.toFixed(1)}%</strong> of
            total payable
          </span>
        </div>

        <CalculatorActionBar
          summary={summary}
          toolId="emi-calculator"
          historyLabel={`${formatINR(principal)} loan for ${years}y`}
          historyData={{ principal, rate, years, result }}
          onExport={handleExport}
          showProjection={showTable}
          onToggleProjection={() => setShowTable(!showTable)}
        />
      </div>

      {showTable && (
        <div className="space-y-4">
          <h3 className="text-lg font-black">Amortization Schedule</h3>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface border-b border-border">
                  <th className="px-4 py-3 text-left font-bold text-text-3">Year</th>
                  <th className="px-4 py-3 text-right font-bold text-text-3">Principal</th>
                  <th className="px-4 py-3 text-right font-bold text-text-3">Interest</th>
                  <th className="px-4 py-3 text-right font-bold text-text-3">Balance</th>
                </tr>
              </thead>
              <tbody>
                {result.rows.map((r) => (
                  <tr
                    key={r.year}
                    className="border-b border-border/50 hover:bg-surface transition-colors"
                  >
                    <td className="px-4 py-3 text-text-2 font-medium">Year {r.year}</td>
                    <td className="px-4 py-3 text-right text-text">
                      {formatINR(r.principalPaid, 0)}
                    </td>
                    <td className="px-4 py-3 text-right text-yellow-500 font-medium">
                      {formatINR(r.interestPaid, 0)}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-blue">
                      {formatINR(Math.max(0, r.balance), 0)}
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
