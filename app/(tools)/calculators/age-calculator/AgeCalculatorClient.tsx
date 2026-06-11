"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { MetricCard } from "@/components/ui/MetricCard";
import { ToolInput } from "@/components/ui/ToolInput";
import { useUrlState } from "@/src/hooks/useUrlState";
import { ShareButton } from "@/components/ui/ShareButton";
import { SharedResultBanner } from "@/components/ui/SharedResultBanner";
import { QRModal } from "@/components/ui/QRModal";

export default function AgeCalculatorClient() {
  const { state, setState, shareUrl, hasParams } = useUrlState({
    defaults: { dob: '1995-01-01', ref: '' },
    debounceMs: 400,
  });

  const dob = state.dob as string;
  const [isQrOpen, setIsQrOpen] = useState(false);
  const didInit = useRef(false);

  const setDob = useCallback((v: string) => setState({ dob: v }), [setState]);
  const setAsOf = useCallback((v: string) => setState({ ref: v }), [setState]);

  // When ref is empty, use today's date — runs once on mount using a ref guard
  const refEmpty = !(state.ref as string);
  useEffect(() => {
    if (didInit.current) return;
    if (refEmpty) {
      didInit.current = true;
      setState({ ref: new Date().toISOString().split('T')[0]! });
    } else {
      didInit.current = true;
    }
  }, [refEmpty, setState]);

  // asOf is the ref param or empty string (will be set by above effect)
  const asOf = (state.ref as string) || '';

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
    <div className="max-w-4xl mx-auto space-y-8">
      <SharedResultBanner hasParams={hasParams} toolName="Age Calculator" />
      <QRModal url={shareUrl} isOpen={isQrOpen} onClose={() => setIsQrOpen(false)} />

      <div className="bg-surface border border-border p-6 md:p-8 rounded-4xl shadow-sm space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        <>
          <div className="flex justify-end">
            <ShareButton
              url={shareUrl}
              title={`Age: ${result.years} years ${result.months} months ${result.days} days — KaruviLab`}
              onQrClick={() => setIsQrOpen(true)}
            />
          </div>
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
        </>
      )}
    </div>
  );
}
