"use client";

import { useState, useMemo, useCallback } from "react";
import { MetricCard } from "@/components/ui/MetricCard";
import { HybridDateInput } from "@/components/ui/HybridDateInput";
import { useUrlState } from "@/src/hooks/useUrlState";
import { ShareButton } from "@/components/ui/ShareButton";
import { SharedResultBanner } from "@/components/ui/SharedResultBanner";
import { QRModal } from "@/components/ui/QRModal";
import { ToolWorkspace } from "@/components/ui/ToolWorkspace";
import { RotateCcw, Users } from "lucide-react";

function todayISO(): string {
  return new Date().toISOString().split('T')[0]!;
}

function getZodiacSign(month: number, day: number): string {
  const signs = [
    { sign: 'Capricorn', emoji: '♑', start: [1, 1], end: [1, 19] },
    { sign: 'Aquarius', emoji: '♒', start: [1, 20], end: [2, 18] },
    { sign: 'Pisces', emoji: '♓', start: [2, 19], end: [3, 20] },
    { sign: 'Aries', emoji: '♈', start: [3, 21], end: [4, 19] },
    { sign: 'Taurus', emoji: '♉', start: [4, 20], end: [5, 20] },
    { sign: 'Gemini', emoji: '♊', start: [5, 21], end: [6, 20] },
    { sign: 'Cancer', emoji: '♋', start: [6, 21], end: [7, 22] },
    { sign: 'Leo', emoji: '♌', start: [7, 23], end: [8, 22] },
    { sign: 'Virgo', emoji: '♍', start: [8, 23], end: [9, 22] },
    { sign: 'Libra', emoji: '♎', start: [9, 23], end: [10, 22] },
    { sign: 'Scorpio', emoji: '♏', start: [10, 23], end: [11, 21] },
    { sign: 'Sagittarius', emoji: '♐', start: [11, 22], end: [12, 21] },
    { sign: 'Capricorn', emoji: '♑', start: [12, 22], end: [12, 31] },
  ];
  for (const s of signs) {
    const [sm, sd] = s.start;
    const [em, ed] = s.end;
    if ((month === sm && day >= sd) || (month === em && day <= ed)) {
      return `${s.emoji} ${s.sign}`;
    }
  }
  return '♑ Capricorn';
}

function calculateDiff(d1: Date, d2: Date) {
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
  
  return { years, months, days };
}

export default function AgeCalculatorClient() {
  const { state, setState, shareUrl, hasParams } = useUrlState({
    defaults: { dob: '1995-01-01', ref: todayISO() },
    debounceMs: 400,
  });

  const dob = state.dob as string;
  const asOf = (state.ref as string) || todayISO();
  const [isQrOpen, setIsQrOpen] = useState(false);
  
  const [showComparison, setShowComparison] = useState(false);
  const [dob2, setDob2] = useState('');

  const setDob = useCallback((v: string) => setState({ dob: v }), [setState]);
  const setAsOf = useCallback((v: string) => setState({ ref: v }), [setState]);

  const resetAll = () => {
    setState({ dob: '1995-01-01', ref: todayISO() });
    setDob2('');
    setShowComparison(false);
  };

  const result = useMemo(() => {
    if (!asOf || !dob) return null;

    const d1 = new Date(dob);
    const d2 = new Date(asOf);

    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return null;
    if (d1 > d2) return null;

    const diff = calculateDiff(d1, d2);
    if (!diff) return null;
    const { years, months, days } = diff;

    const totalDays = Math.floor((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
    const totalMonths = years * 12 + months;
    const totalWeeks = totalDays / 7;
    
    const today = new Date();
    let nextBDay = new Date(today.getFullYear(), d1.getMonth(), d1.getDate());
    if (nextBDay <= today) {
      nextBDay = new Date(today.getFullYear() + 1, d1.getMonth(), d1.getDate());
    }

    return {
      years,
      months,
      days,
      totalMonths,
      totalDays,
      totalWeeks,
      totalHours: totalDays * 24,
      totalMinutes: totalDays * 24 * 60,
      totalSeconds: totalDays * 24 * 60 * 60,
      birthDayOfWeek: new Date(dob).toLocaleDateString('en-US', { weekday: 'long' }),
      zodiacSign: getZodiacSign(d1.getMonth() + 1, d1.getDate()),
      nextBirthday: nextBDay.toISOString().split('T')[0],
      daysUntilBirthday: Math.ceil((nextBDay.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
      isLeapYearBirth: (d1.getFullYear() % 4 === 0 && (d1.getFullYear() % 100 !== 0 || d1.getFullYear() % 400 === 0)),
    };
  }, [dob, asOf]);

  const comparisonResult = useMemo(() => {
    if (!showComparison || !dob || !dob2) return null;
    const d1 = new Date(dob);
    const d2 = new Date(dob2);
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return null;
    
    const older = d1 < d2 ? d1 : d2;
    const younger = d1 < d2 ? d2 : d1;
    
    const diff = calculateDiff(older, younger);
    return diff;
  }, [showComparison, dob, dob2]);

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
            {showComparison && (
              <HybridDateInput
                label="Person 2 Date of Birth"
                value={dob2}
                onChange={setDob2}
                description="DD / MM / YYYY"
                id="age-calc-dob2"
              />
            )}
            <HybridDateInput
              label="Calculate As Of"
              value={asOf}
              onChange={setAsOf}
              description="DD / MM / YYYY"
              id="age-calc-asof"
            />
          </div>
        }
        output={
          result ? (
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2 justify-between items-center">
                <h3 className="text-lg font-semibold text-text">Result</h3>
                <div className="flex flex-wrap gap-2 items-center">
                  <button 
                    onClick={() => setShowComparison(!showComparison)}
                    className="flex items-center gap-2 bg-surface-2 border border-border rounded-xl px-4 py-2 text-sm font-medium text-text-muted hover:text-text transition-colors"
                  >
                    <Users className="w-4 h-4" />
                    {showComparison ? "Hide Comparison" : "Compare Ages"}
                  </button>
                  <button 
                    onClick={resetAll}
                    className="flex items-center gap-2 bg-surface-2 border border-border rounded-xl px-4 py-2 text-sm font-medium text-text-muted hover:text-text transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </button>
                  <ShareButton
                    url={shareUrl}
                    title={`Age: ${result.years} years ${result.months} months ${result.days} days — KaruviLab`}
                    onQrClick={() => setIsQrOpen(true)}
                  />
                </div>
              </div>
              
              {/* Section 1: Primary Result */}
              <div className="w-full">
                <MetricCard 
                  label="Exact Age" 
                  value={`${result.years} Years, ${result.months} Months, ${result.days} Days`} 
                  accent 
                />
              </div>

              {/* Section 2: Birth Info */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <MetricCard label="Birth Day of Week" value={result.birthDayOfWeek} />
                <MetricCard label="Zodiac Sign" value={result.zodiacSign} />
                <MetricCard label="Leap Year Birth" value={result.isLeapYearBirth ? "Yes" : "No"} />
              </div>

              {/* Section 3: Birthday Countdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MetricCard label="Next Birthday" value={result.nextBirthday} />
                <MetricCard label="Days Until Birthday" value={`${result.daysUntilBirthday.toLocaleString()} 🎂`} />
              </div>

              {/* Section 4: Time Breakdown */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <MetricCard label="Total Months" value={result.totalMonths.toLocaleString()} />
                <MetricCard 
                  label="Total Weeks" 
                  value={result.totalWeeks.toLocaleString(undefined, { maximumFractionDigits: 1 })} 
                />
                <MetricCard label="Total Days" value={result.totalDays.toLocaleString()} />
                <MetricCard label="Total Hours" value={result.totalHours.toLocaleString()} />
                <MetricCard label="Total Minutes" value={result.totalMinutes.toLocaleString()} />
                <MetricCard label="Total Seconds" value={result.totalSeconds.toLocaleString()} />
              </div>

              {/* Section 5: Comparison */}
              {showComparison && comparisonResult && (
                <div className="w-full mt-4">
                  <MetricCard 
                    label="Age Difference" 
                    value={`${comparisonResult.years} Years, ${comparisonResult.months} Months, ${comparisonResult.days} Days`} 
                  />
                </div>
              )}
            </div>
          ) : null
        }
      />
    </div>
  );
}
