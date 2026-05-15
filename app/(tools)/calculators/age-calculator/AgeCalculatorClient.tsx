"use client";

import { useState, useMemo, useEffect } from "react";
import { MetricCard } from "@/components/ui/MetricCard";
import { ToolInput } from "@/components/ui/ToolInput";

export default function AgeCalculatorClient() {
  const [dob, setDob] = useState("1995-01-01");
  const [asOf, setAsOf] = useState("");

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
    <div className="space-y-6">
      <div className="bg-surface border border-border p-6 md:p-8 rounded-[32px] shadow-sm space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ToolInput
            label="Date of Birth"
            type="date"
            value={dob}
            onChange={setDob}
          />
          <ToolInput
            label="Calculate As Of"
            type="date"
            value={asOf}
            onChange={setAsOf}
          />
        </div>
      </div>

      {result && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
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
    </div>
  );
}
