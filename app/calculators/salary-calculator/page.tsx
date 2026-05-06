"use client";
import { useState, useMemo } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { MetricCard } from "@/components/ui/MetricCard";
import { CopyButton } from "@/components/ui/CopyButton";

const cat = CATEGORIES.find((c) => c.id === "calculators")!;

const inr = (n: number) =>
  "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

function calcTax(taxableIncome: number): number {
  // New tax regime FY 2024-25
  // Standard deduction: ₹75,000 already applied before calling
  const slabs = [
    { upto: 300000, rate: 0 },
    { upto: 700000, rate: 0.05 },
    { upto: 1000000, rate: 0.10 },
    { upto: 1200000, rate: 0.15 },
    { upto: 1500000, rate: 0.20 },
    { upto: Infinity, rate: 0.30 },
  ];
  let tax = 0;
  let prev = 0;
  for (const slab of slabs) {
    if (taxableIncome <= prev) break;
    const portion = Math.min(taxableIncome, slab.upto) - prev;
    tax += portion * slab.rate;
    prev = slab.upto;
  }
  // Rebate u/s 87A: if total income <= 7L, full rebate
  if (taxableIncome <= 700000) tax = 0;
  // Surcharge (simplified: ignore for <50L)
  const cess = tax * 0.04;
  return tax + cess;
}

export default function SalaryCalculator() {
  const [ctc, setCtc] = useState<string>("1200000");

  const result = useMemo(() => {
    const annualCTC = parseFloat(ctc) || 0;
    const basic = annualCTC * 0.4;
    const hra = basic * 0.5;
    const pfEmployee = basic * 0.12;
    const pfEmployer = basic * 0.12;
    const professionalTax = 200 * 12; // ₹200/month
    const specialAllowance = annualCTC - basic - hra - pfEmployer - professionalTax;
    const grossSalary = basic + hra + specialAllowance;
    const standardDeduction = 75000;
    const taxableIncome = Math.max(0, grossSalary - pfEmployee - standardDeduction);
    const incomeTax = calcTax(taxableIncome);
    const totalDeductions = pfEmployee + professionalTax + incomeTax;
    const inHandYear = grossSalary - totalDeductions;
    const inHandMonth = inHandYear / 12;

    const slabs = [
      { range: "₹0 – ₹3L", rate: "0%", amount: 0 },
      { range: "₹3L – ₹7L", rate: "5%", amount: Math.max(0, Math.min(taxableIncome, 700000) - 300000) * 0.05 },
      { range: "₹7L – ₹10L", rate: "10%", amount: Math.max(0, Math.min(taxableIncome, 1000000) - 700000) * 0.10 },
      { range: "₹10L – ₹12L", rate: "15%", amount: Math.max(0, Math.min(taxableIncome, 1200000) - 1000000) * 0.15 },
      { range: "₹12L – ₹15L", rate: "20%", amount: Math.max(0, Math.min(taxableIncome, 1500000) - 1200000) * 0.20 },
      { range: "Above ₹15L", rate: "30%", amount: Math.max(0, taxableIncome - 1500000) * 0.30 },
    ];

    return {
      annualCTC, basic, hra, specialAllowance, pfEmployee, pfEmployer,
      professionalTax, grossSalary, standardDeduction, taxableIncome,
      incomeTax, totalDeductions, inHandYear, inHandMonth, slabs,
    };
  }, [ctc]);

  const summary = `Salary Breakdown (New Regime FY 2024-25)\n-----------------------------------------\nAnnual CTC: ${inr(result.annualCTC)}\n\nBasic Salary: ${inr(result.basic)}\nHRA: ${inr(result.hra)}\nSpecial Allowance: ${inr(result.specialAllowance)}\nGross Salary: ${inr(result.grossSalary)}\n\nPF (Employee): ${inr(result.pfEmployee)}\nPF (Employer): ${inr(result.pfEmployer)}\nProfessional Tax: ${inr(result.professionalTax)}\nIncome Tax: ${inr(result.incomeTax)}\nTotal Deductions: ${inr(result.totalDeductions)}\n\nIn-Hand / Month: ${inr(result.inHandMonth)}\nIn-Hand / Year: ${inr(result.inHandYear)}\n\nGenerated via KaruviLab`;

  return (
    <ToolShell
      title="Indian Salary Calculator"
      description="Break down your CTC into take-home pay under the new tax regime (FY 2024-25)."
      category={cat}
    >
      <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="salary-ctc" className="text-sm font-bold text-text-2">
              Annual CTC (₹)
            </label>
            <span className="text-sm font-black text-blue">{inr(parseFloat(ctc) || 0)}</span>
          </div>
          <input
            id="salary-ctc"
            type="number"
            min={0}
            placeholder="e.g. 1200000"
            value={ctc}
            onChange={(e) => setCtc(e.target.value)}
            className="w-full px-4 py-3 bg-bg border border-border rounded-xl focus:ring-2 focus:ring-blue outline-none transition-all text-lg font-bold"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <MetricCard label="In-Hand / Month" value={inr(result.inHandMonth)} accent />
        <MetricCard label="In-Hand / Year" value={inr(result.inHandYear)} />
        <MetricCard label="Gross Salary" value={inr(result.grossSalary)} />
        <MetricCard label="Total Deductions" value={inr(result.totalDeductions)} />
      </div>

      {/* Salary Components */}
      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border">
          <h2 className="font-bold text-text-2">Salary Components</h2>
        </div>
        <div className="divide-y divide-border">
          {[
            { label: "Basic Salary (40% of CTC)", value: result.basic, highlight: false },
            { label: "HRA (50% of Basic)", value: result.hra, highlight: false },
            { label: "Special Allowance", value: result.specialAllowance, highlight: false },
            { label: "Gross Salary", value: result.grossSalary, highlight: true },
          ].map((row) => (
            <div key={row.label} className={`flex justify-between px-4 py-3 ${row.highlight ? "font-bold bg-blue/5" : ""}`}>
              <span className="text-sm text-text-3">{row.label}</span>
              <span className={`text-sm font-bold ${row.highlight ? "text-blue" : "text-text"}`}>
                {inr(row.value)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Deductions */}
      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border">
          <h2 className="font-bold text-text-2">Deductions</h2>
        </div>
        <div className="divide-y divide-border">
          {[
            { label: "PF – Employee (12% of Basic)", value: result.pfEmployee },
            { label: "PF – Employer (12% of Basic)", value: result.pfEmployer },
            { label: "Professional Tax (₹200/month)", value: result.professionalTax },
            { label: `Standard Deduction`, value: result.standardDeduction },
            { label: "Income Tax (New Regime + 4% Cess)", value: result.incomeTax },
          ].map((row) => (
            <div key={row.label} className="flex justify-between px-4 py-3">
              <span className="text-sm text-text-3">{row.label}</span>
              <span className="text-sm font-bold text-red-400">{inr(row.value)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tax Slabs */}
      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border flex justify-between items-center">
          <h2 className="font-bold text-text-2">Tax Slab Breakdown</h2>
          <span className="text-xs text-text-4">Taxable income: {inr(result.taxableIncome)}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-bg border-b border-border">
                <th className="px-4 py-3 text-left font-bold text-text-3">Slab</th>
                <th className="px-4 py-3 text-center font-bold text-text-3">Rate</th>
                <th className="px-4 py-3 text-right font-bold text-text-3">Tax Amount</th>
              </tr>
            </thead>
            <tbody>
              {result.slabs.map((s) => (
                <tr key={s.range} className="border-b border-border/50 hover:bg-bg transition-colors">
                  <td className="px-4 py-3 text-text-2">{s.range}</td>
                  <td className="px-4 py-3 text-center text-text-3">{s.rate}</td>
                  <td className="px-4 py-3 text-right font-bold text-text">{inr(s.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-surface border border-border p-4 rounded-xl flex items-center justify-between">
        <span className="text-xs text-text-4">
          New regime FY 2024-25 · Rebate u/s 87A if income ≤ ₹7L · 4% health &amp; education cess
        </span>
        <CopyButton text={summary} label="Copy" />
      </div>
    </ToolShell>
  );
}
