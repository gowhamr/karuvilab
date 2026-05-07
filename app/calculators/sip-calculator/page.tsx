"use client";
import { useState, useMemo } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { MetricCard } from "@/components/ui/MetricCard";
import { SliderField } from "@/components/ui/SliderField";
import { CopyButton } from "@/components/ui/CopyButton";

const inr = (n: number, d = 0) =>
  "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: d, maximumFractionDigits: d });

const cat = CATEGORIES.find((c) => c.id === "calculators")!;

export default function SipCalculator() {
  const [monthly, setMonthly] = useState(5000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);
  const [stepUp, setStepUp] = useState(0);
  const [lumpsum, setLumpsum] = useState(0);
  const [showTable, setShowTable] = useState(false);

  const result = useMemo(() => {
    const r = rate / 100 / 12;
    const inflationRate = 0.06;
    let totalInvested = lumpsum;
    let totalValue = lumpsum;

    const rows: {
      year: number;
      invested: number;
      value: number;
      gains: number;
    }[] = [];

    // Apply lumpsum growth separately and combine
    let lumpsumValue = lumpsum;
    let sipValue = 0;
    let sipInvested = 0;
    let currentMonthly = monthly;

    for (let y = 1; y <= years; y++) {
      // Lumpsum grows for 12 months
      for (let m = 0; m < 12; m++) {
        lumpsumValue *= 1 + r;
        sipValue = (sipValue + currentMonthly) * (1 + r);
        sipInvested += currentMonthly;
        totalInvested += currentMonthly;
      }
      const yearValue = lumpsumValue + sipValue;
      rows.push({
        year: y,
        invested: totalInvested,
        value: yearValue,
        gains: yearValue - totalInvested,
      });
      // Step-up at year end
      if (stepUp > 0) {
        currentMonthly = currentMonthly * (1 + stepUp / 100);
      }
    }

    totalValue = lumpsumValue + sipValue;
    const totalGains = totalValue - totalInvested;
    const yieldPct = totalInvested > 0 ? (totalGains / totalInvested) * 100 : 0;

    // Inflation adjusted
    const inflAdj = totalValue / Math.pow(1 + inflationRate, years);

    return { totalInvested, totalValue, totalGains, yieldPct, inflAdj, rows };
  }, [monthly, rate, years, stepUp, lumpsum]);

  const summary = `SIP Calculator Results\n----------------------\nMonthly SIP: ${inr(monthly)}\nRate: ${rate}%  |  Years: ${years}  |  Step-up: ${stepUp}%\nLumpsum: ${inr(lumpsum)}\n\nTotal Invested: ${inr(result.totalInvested)}\nEstimated Gains: ${inr(result.totalGains)}\nTotal Value: ${inr(result.totalValue)}\nInflation-Adjusted Value: ${inr(result.inflAdj)}\n\nGenerated via KaruviLab`;

  return (
    <ToolShell
      title="SIP Calculator"
      description="Project your mutual fund SIP returns with step-up and lumpsum options."
      category={cat}
      content={{
        detailedDescription: "The SIP (Systematic Investment Plan) Calculator is designed to help investors estimate the future value of their mutual fund investments. SIPs are a disciplined way to invest, allowing you to contribute a fixed amount regularly. This tool takes into account the power of compounding and offers advanced features like 'Step-up SIP' and 'Lumpsum' additions. The Step-up feature allows you to increase your monthly contribution annually, reflecting expected salary hikes or increased savings. Additionally, the calculator provides an inflation-adjusted value, giving you a realistic picture of what your wealth might be worth in today's terms. Whether you're planning for retirement, a child's education, or long-term wealth creation, this tool provides the projections needed to align your investments with your financial goals.",
        howTo: [
          "Enter your intended monthly investment amount (SIP).",
          "Input the expected annual rate of return from your investment.",
          "Choose the total duration of your investment in years.",
          "Optionally, add an annual Step-up percentage to increase your contribution over time.",
          "Add a one-time Lumpsum amount if you plan to make an initial investment.",
          "Review the estimated gains and the total value of your investment at maturity."
        ],
        faq: [
          {
            question: "What is a Step-up SIP?",
            answer: "A Step-up SIP allows you to increase your monthly investment amount by a fixed percentage every year, helping you reach your financial goals faster."
          },
          {
            question: "Is the expected return guaranteed?",
            answer: "No, the returns in mutual funds are subject to market risks. This calculator uses a fixed rate to provide an estimate based on historical performance or your expectations."
          },
          {
            question: "What does 'Inflation-adjusted' mean?",
            answer: "It shows what the future value of your investment would be worth in today's purchasing power, assuming a standard inflation rate (default is 6%)."
          }
        ],
        relatedTools: ["compound-interest", "emi-calculator", "percentage-calculator"]
      }}
    >
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
        <SliderField
          label="Annual Step-up %"
          id="sip-stepup"
          min={0}
          max={30}
          step={1}
          value={stepUp}
          onChange={setStepUp}
          format={(v) => v + "%"}
        />
        <div className="space-y-2">
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
        <MetricCard label="Total Value" value={inr(result.totalValue)} accent />
        <MetricCard label="Total Invested" value={inr(result.totalInvested)} />
        <MetricCard label="Estimated Gains" value={inr(result.totalGains)} />
        <MetricCard label="Yield" value={result.yieldPct.toFixed(1) + "%"} />
      </div>

      <div className="bg-surface border border-border p-4 rounded-xl flex flex-wrap items-center justify-between gap-3">
        <span className="text-sm text-text-3">
          Inflation-adjusted (6%/yr):{" "}
          <strong className="text-blue">{inr(result.inflAdj)}</strong>
        </span>
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
                <th className="px-4 py-3 text-right font-bold text-text-3">Gains</th>
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
    </ToolShell>
  );
}
