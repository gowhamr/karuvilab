"use client";

import { useState, useMemo, useEffect, useId } from "react";
import { MetricCard } from "@/components/ui/MetricCard";

export default function AgeCalculatorClient() {
  const [dob, setDob] = useState("1995-01-01");
  const [asOf, setAsOf] = useState("");
  const dobId = useId();
  const asOfId = useId();

  useEffect(() => {
    // Set to client's local date after hydration to avoid SSR mismatch
    setAsOf(new Date().toISOString().split("T")[0]!);
  }, []);

  const result = useMemo(() => {
    if (!asOf) return null;

    const d1 = new Date(dob);
    const d2 = new Date(asOf);

    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return null;
    if (d1 > d2) return null;

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

    return {
      years,
      months,
      days,
      totalMonths,
      totalDays,
      totalWeeks,
    };
  }, [dob, asOf]);

  return (
    <>
      <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor={dobId} className="text-sm font-bold text-text-2">Date of Birth</label>
            <input
              id={dobId}
              type="date"
              className="w-full px-4 py-3 bg-bg border border-border rounded-xl focus:ring-2 focus:ring-blue outline-none transition-all"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor={asOfId} className="text-sm font-bold text-text-2">Calculate As Of</label>
            <input
              id={asOfId}
              type="date"
              className="w-full px-4 py-3 bg-bg border border-border rounded-xl focus:ring-2 focus:ring-blue outline-none transition-all"
              value={asOf}
              onChange={(e) => setAsOf(e.target.value)}
            />
          </div>
        </div>
      </div>

      {result && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <MetricCard 
            label="Exact Age" 
            value={`${result.years} yr ${result.months} mo ${result.days} d`} 
            accent 
          />
          <MetricCard label="Total Months" value={result.totalMonths.toLocaleString()} />
          <MetricCard label="Total Days" value={result.totalDays.toLocaleString()} />
          <MetricCard 
            label="Total Weeks" 
            value={result.totalWeeks.toLocaleString(undefined, { maximumFractionDigits: 1 })} 
          />
        </div>
      )}
    </>
  );
}
