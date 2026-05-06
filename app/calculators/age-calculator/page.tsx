"use client";

import { useState, useEffect } from "react";

export default function AgeCalculator() {
  const [dob, setDob] = useState("1995-01-01");
  const [asOf, setAsOf] = useState(new Date().toISOString().split("T")[0]);
  const [result, setResult] = useState<{
    years: number;
    months: number;
    days: number;
    totalMonths: number;
    totalDays: number;
    totalWeeks: number;
  } | null>(null);

  const calculate = () => {
    const d1 = new Date(dob);
    const d2 = new Date(asOf);

    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return;
    if (d1 > d2) return;

    let years = d2.getFullYear() - d1.getFullYear();
    let months = d2.getMonth() - d1.getMonth();
    let days = d2.getDate() - d1.getDate();

    if (days < 0) {
      months--;
      const prev = new Date(d2.getFullYear(), d2.getMonth(), 0);
      days += prev.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    const totalDays = Math.floor((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
    const totalMonths = years * 12 + months;
    const totalWeeks = totalDays / 7;

    setResult({
      years,
      months,
      days,
      totalMonths,
      totalDays,
      totalWeeks,
    });
  };

  useEffect(() => {
    calculate();
  }, []);

  const metric = (label: string, value: string, accent = false) => (
    <div className="bg-surface border border-border p-5 rounded-xl">
      <div className="text-[10px] font-bold text-text-4 uppercase tracking-wider mb-1">
        {label}
      </div>
      <div className={`text-2xl font-black ${accent ? "text-blue" : "text-text"}`}>
        {value}
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-black">Age Calculator</h1>
        <p className="text-text-3">Calculate exact age in years, months, and days.</p>
      </div>

      <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-text-2">Date of Birth</label>
            <input
              type="date"
              className="w-full px-4 py-3 bg-bg border border-border rounded-xl focus:ring-2 focus:ring-blue outline-none transition-all"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-text-2">Calculate As Of</label>
            <input
              type="date"
              className="w-full px-4 py-3 bg-bg border border-border rounded-xl focus:ring-2 focus:ring-blue outline-none transition-all"
              value={asOf}
              onChange={(e) => setAsOf(e.target.value)}
            />
          </div>
        </div>

        <button
          onClick={calculate}
          className="w-full py-4 bg-blue text-white font-bold rounded-xl shadow-lg shadow-blue/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          Calculate Age
        </button>
      </div>

      {result && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {metric("Exact Age", `${result.years} yr ${result.months} mo ${result.days} d`, true)}
          {metric("Total Months", result.totalMonths.toLocaleString())}
          {metric("Total Days", result.totalDays.toLocaleString())}
          {metric("Total Weeks", result.totalWeeks.toLocaleString(undefined, { maximumFractionDigits: 1 }))}
        </div>
      )}

      <div className="prose prose-slate dark:prose-invert max-w-none">
        <h3 className="text-xl font-bold">About the Age Calculator</h3>
        <p className="text-text-3 text-sm leading-relaxed">
          The Age Calculator is a simple yet powerful tool that helps you determine the exact difference between two dates. 
          It takes into account leap years and the varying lengths of months to provide a precision breakdown in years, months, and days. 
          Whether you're calculating your own age, your child's age, or the duration of a project, this tool provides instant and accurate results.
        </p>
      </div>
    </div>
  );
}
