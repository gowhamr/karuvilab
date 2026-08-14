"use client";

import { useState, useMemo, useCallback } from "react";
import { MetricCard } from "@/components/ui/MetricCard";
import { HybridDateInput } from "@/components/ui/HybridDateInput";
import { useUrlState } from "@/src/hooks/useUrlState";
import { ShareButton } from "@/components/ui/ShareButton";
import { SharedResultBanner } from "@/components/ui/SharedResultBanner";
import { QRModal } from "@/components/ui/QRModal";
import { ToolWorkspace } from "@/components/ui/ToolWorkspace";
function todayISO(): string {
  return new Date().toISOString().split('T')[0]!;
}

export default function AgeCalculatorClient() {
  const { state, setState, shareUrl, hasParams } = useUrlState({
    defaults: { dob: '1995-01-01', ref: todayISO() },
    debounceMs: 400,
  });

  const dob = state.dob as string;
  const asOf = (state.ref as string) || todayISO();
  const [isQrOpen, setIsQrOpen] = useState(false);

  const setDob = useCallback((v: string) => setState({ dob: v }), [setState]);
  const setAsOf = useCallback((v: string) => setState({ ref: v }), [setState]);

  const result = useMemo(() => {
    if (!asOf || !dob) return null;

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
    <div className="w-full space-y-8">
      <SharedResultBanner hasParams={hasParams} toolName="Age Calculator" />
      <QRModal url={shareUrl} isOpen={isQrOpen} onClose={() => setIsQrOpen(false)} />

      <ToolWorkspace
        layout="split"
        input={
          <div className="grid grid-cols-1 gap-6">
            <HybridDateInput
              label="Date of Birth"
              value={dob}
              onChange={setDob}
              max={asOf}
              description="DD / MM / YYYY"
              id="age-calc-dob"
            />
            <HybridDateInput
              label="Calculate As Of"
              value={asOf}
              onChange={setAsOf}
              max={todayISO()}
              description="DD / MM / YYYY"
              id="age-calc-asof"
            />
          </div>
        }
        output={
          result ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-text">Result</h3>
                <ShareButton
                  url={shareUrl}
                  title={`Age: ${result.years} years ${result.months} months ${result.days} days — KaruviLab`}
                  onQrClick={() => setIsQrOpen(true)}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <MetricCard 
                    label="Exact Age" 
                    value={`${result.years} Years, ${result.months} Months, ${result.days} Days`} 
                    accent 
                  />
                </div>
                <MetricCard label="Total Months" value={result.totalMonths.toLocaleString()} />
                <MetricCard 
                  label="Total Weeks" 
                  value={result.totalWeeks.toLocaleString(undefined, { maximumFractionDigits: 1 })} 
                />
                <MetricCard label="Total Days" value={result.totalDays.toLocaleString()} />
              </div>
            </div>
          ) : null
        }
      />
    </div>
  );
}
