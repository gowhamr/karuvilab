"use client";
import { useState, useCallback } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { MetricCard } from "@/components/ui/MetricCard";
import { SliderField } from "@/components/ui/SliderField";
import { CopyButton } from "@/components/ui/CopyButton";

const inr = (n: number, d = 0) =>
  "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: d, maximumFractionDigits: d });

const cat = CATEGORIES.find((c) => c.id === "calculators")!;

export default function EmiCalculator() {
  const [principal, setPrincipal] = useState(500000);
  const [rate, setRate] = useState(8.5);
  const [years, setYears] = useState(5);
  const [showTable, setShowTable] = useState(false);

  const calc = useCallback(() => {
    const r = rate / 12 / 100;
    const n = years * 12;
    const emi =
      r === 0
        ? principal / n
        : (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayable = emi * n;
    const totalInterest = Math.max(0, totalPayable - principal);
    const rows: {
      year: number;
      principalPaid: number;
      interestPaid: number;
      balance: number;
    }[] = [];
    let balance = principal;
    for (let y = 1; y <= years; y++) {
      let yP = 0,
        yI = 0;
      for (let m = 0; m < 12; m++) {
        const i = balance * r;
        const p = emi - i;
        yI += i;
        yP += p;
        balance = Math.max(0, balance - p);
      }
      rows.push({ year: y, principalPaid: yP, interestPaid: yI, balance });
    }
    return {
      emi,
      totalPayable,
      totalInterest,
      interestRatio: totalPayable > 0 ? (totalInterest / totalPayable) * 100 : 0,
      rows,
    };
  }, [principal, rate, years]);

  const { emi, totalPayable, totalInterest, interestRatio, rows } = calc();

  const summary = `Loan EMI Details\n------------------\nPrincipal: ${inr(principal)}\nRate: ${rate}%\nTenure: ${years} Years\n\nMonthly EMI: ${inr(emi, 2)}\nTotal Interest: ${inr(totalInterest, 2)}\nTotal Payable: ${inr(totalPayable, 2)}\n\nGenerated via KaruviLab`;

  return (
    <ToolShell
      title="EMI Calculator"
      description="Calculate your loan EMI, total interest, and amortization schedule."
      category={cat}
      content={{
        detailedDescription: "The EMI (Equated Monthly Installment) Calculator is an essential financial tool for anyone planning to take a loan, whether it's for a home, car, or personal needs. It provides a clear breakdown of your monthly payments, helping you understand how interest rates and loan tenures impact your financial commitment. By visualizing the total interest payable over the life of the loan and providing a year-by-year amortization schedule, this tool empowers you to make informed decisions about your borrowing capacity. You can experiment with different principal amounts and interest rates to find a repayment plan that fits your budget perfectly. The amortization table further illustrates how each payment is divided between principal repayment and interest, showing you how your loan balance decreases over time.",
        howTo: [
          "Enter the total loan amount (Principal) you wish to borrow.",
          "Input the annual interest rate offered by the lender.",
          "Specify the loan tenure in years.",
          "Instantly view your monthly EMI, total interest, and total payable amount.",
          "Toggle the 'Show Schedule' button to see a detailed annual breakdown of your payments.",
          "Use the 'Copy Summary' button to save your calculation for future reference."
        ],
        faq: [
          {
            question: "What is an EMI?",
            answer: "EMI stands for Equated Monthly Installment. It is a fixed amount of money that you pay back to a lender every month until your loan is fully repaid."
          },
          {
            question: "How does loan tenure affect my EMI?",
            answer: "A longer tenure reduces your monthly EMI but increases the total interest you pay over the life of the loan. A shorter tenure increases your EMI but saves you money on interest."
          },
          {
            question: "Can I use this for any type of loan?",
            answer: "Yes, this calculator works for home loans, car loans, personal loans, and any other reducing balance loans."
          }
        ],
        relatedTools: ["sip-calculator", "compound-interest", "salary-calculator"]
      }}
    >
      <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-6">
        <SliderField
          label="Loan Amount"
          id="emi-amt"
          min={10000}
          max={10000000}
          step={10000}
          value={principal}
          onChange={setPrincipal}
          format={(v) => inr(v)}
        />
        <SliderField
          label="Annual Interest Rate"
          id="emi-rate"
          min={1}
          max={30}
          step={0.1}
          value={rate}
          onChange={setRate}
          format={(v) => v.toFixed(1) + "%"}
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
        <MetricCard label="Monthly EMI" value={inr(emi, 2)} accent />
        <MetricCard label="Principal" value={inr(principal)} />
        <MetricCard label="Total Interest" value={inr(totalInterest, 2)} />
        <MetricCard label="Total Payable" value={inr(totalPayable, 2)} />
      </div>

      <div className="bg-surface border border-border p-4 rounded-xl flex flex-wrap items-center justify-between gap-3">
        <span className="text-sm text-text-3">
          Interest ratio:{" "}
          <strong className="text-yellow-500">{interestRatio.toFixed(1)}%</strong> of
          total payable
        </span>
        <div className="flex gap-3">
          <CopyButton text={summary} label="Copy Summary" />
          <button
            onClick={() => setShowTable((v) => !v)}
            className="px-3 py-1.5 text-sm font-medium bg-surface border border-border rounded-lg hover:border-blue hover:text-blue transition-colors"
          >
            {showTable ? "Hide" : "Show"} Schedule
          </button>
        </div>
      </div>

      {showTable && (
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
              {rows.map((r) => (
                <tr
                  key={r.year}
                  className="border-b border-border/50 hover:bg-surface transition-colors"
                >
                  <td className="px-4 py-3 text-text-2">Year {r.year}</td>
                  <td className="px-4 py-3 text-right text-text">
                    {inr(r.principalPaid, 0)}
                  </td>
                  <td className="px-4 py-3 text-right text-yellow-500">
                    {inr(r.interestPaid, 0)}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-text">
                    {inr(Math.max(0, r.balance), 0)}
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
