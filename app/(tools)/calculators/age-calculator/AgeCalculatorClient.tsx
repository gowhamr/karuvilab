"use client";

import { useState, useMemo, useCallback } from "react";
import { MetricCard } from "@/components/ui/MetricCard";
import { HybridDateInput } from "@/components/ui/HybridDateInput";
import { useUrlState } from "@/src/hooks/useUrlState";
import { ShareButton } from "@/components/ui/ShareButton";
import { SharedResultBanner } from "@/components/ui/SharedResultBanner";
import { QRModal } from "@/components/ui/QRModal";
import { ToolWorkspace } from "@/components/ui/ToolWorkspace";
import { RotateCcw, Users, Sparkles, Moon, Sun } from "lucide-react";

function todayISO(): string {
  return new Date().toISOString().split('T')[0]!;
}

function getSunZodiacSign(month: number, day: number): { sign: string; emoji: string; element: string; dates: string } {
  const signs = [
    { sign: 'Capricorn', emoji: '♑', element: 'Earth', start: [1, 1], end: [1, 19], dates: 'Dec 22 – Jan 19' },
    { sign: 'Aquarius', emoji: '♒', element: 'Air', start: [1, 20], end: [2, 18], dates: 'Jan 20 – Feb 18' },
    { sign: 'Pisces', emoji: '♓', element: 'Water', start: [2, 19], end: [3, 20], dates: 'Feb 19 – Mar 20' },
    { sign: 'Aries', emoji: '♈', element: 'Fire', start: [3, 21], end: [4, 19], dates: 'Mar 21 – Apr 19' },
    { sign: 'Taurus', emoji: '♉', element: 'Earth', start: [4, 20], end: [5, 20], dates: 'Apr 20 – May 20' },
    { sign: 'Gemini', emoji: '♊', element: 'Air', start: [5, 21], end: [6, 20], dates: 'May 21 – Jun 20' },
    { sign: 'Cancer', emoji: '♋', element: 'Water', start: [6, 21], end: [7, 22], dates: 'Jun 21 – Jul 22' },
    { sign: 'Leo', emoji: '♌', element: 'Fire', start: [7, 23], end: [8, 22], dates: 'Jul 23 – Aug 22' },
    { sign: 'Virgo', emoji: '♍', element: 'Earth', start: [8, 23], end: [9, 22], dates: 'Aug 23 – Sep 22' },
    { sign: 'Libra', emoji: '♎', element: 'Air', start: [9, 23], end: [10, 22], dates: 'Sep 23 – Oct 22' },
    { sign: 'Scorpio', emoji: '♏', element: 'Water', start: [10, 23], end: [11, 21], dates: 'Oct 23 – Nov 21' },
    { sign: 'Sagittarius', emoji: '♐', element: 'Fire', start: [11, 22], end: [12, 21], dates: 'Nov 22 – Dec 21' },
    { sign: 'Capricorn', emoji: '♑', element: 'Earth', start: [12, 22], end: [12, 31], dates: 'Dec 22 – Jan 19' },
  ];
  for (const s of signs) {
    const [sm, sd] = s.start;
    const [em, ed] = s.end;
    if (sm !== undefined && sd !== undefined && em !== undefined && ed !== undefined) {
      if ((month === sm && day >= sd) || (month === em && day <= ed)) {
        return s;
      }
    }
  }
  return signs[0]!;
}

function getMoonDetails(date: Date): { moonSign: string; moonElement: string; moonPhase: string; illumination: string } {
  const j2000 = Date.UTC(2000, 0, 1, 12, 0, 0);
  const d = (date.getTime() - j2000) / 86400000;

  const L = (218.316 + 13.176396 * d) % 360;
  const M = (134.963 + 13.064993 * d) % 360;
  const F = (93.272 + 13.229350 * d) % 360;
  const SunM = (357.529 + 0.98560028 * d) % 360;
  const D = (297.850 + 12.190749 * d) % 360;

  const toRad = (deg: number) => (deg * Math.PI) / 180;

  let lambda =
    L +
    6.289 * Math.sin(toRad(M)) -
    1.274 * Math.sin(toRad(2 * D - M)) +
    0.658 * Math.sin(toRad(2 * D)) -
    0.214 * Math.sin(toRad(2 * M)) -
    0.186 * Math.sin(toRad(SunM)) -
    0.114 * Math.sin(toRad(2 * F));

  lambda = ((lambda % 360) + 360) % 360;

  const signs = [
    { sign: 'Aries', emoji: '♈', element: 'Fire' },
    { sign: 'Taurus', emoji: '♉', element: 'Earth' },
    { sign: 'Gemini', emoji: '♊', element: 'Air' },
    { sign: 'Cancer', emoji: '♋', element: 'Water' },
    { sign: 'Leo', emoji: '♌', element: 'Fire' },
    { sign: 'Virgo', emoji: '♍', element: 'Earth' },
    { sign: 'Libra', emoji: '♎', element: 'Air' },
    { sign: 'Scorpio', emoji: '♏', element: 'Water' },
    { sign: 'Sagittarius', emoji: '♐', element: 'Fire' },
    { sign: 'Capricorn', emoji: '♑', element: 'Earth' },
    { sign: 'Aquarius', emoji: '♒', element: 'Air' },
    { sign: 'Pisces', emoji: '♓', element: 'Water' },
  ];

  const signIndex = Math.floor(lambda / 30) % 12;
  const sign = signs[signIndex] || signs[0]!;

  const knownNewMoon = Date.UTC(2000, 0, 6, 18, 14, 0);
  const phaseDays = ((date.getTime() - knownNewMoon) / 86400000) % 29.530588853;
  const normalizedPhase = ((phaseDays % 29.530588853) + 29.530588853) % 29.530588853;

  let phaseName = 'New Moon';
  let phaseEmoji = '🌑';
  if (normalizedPhase < 1.85) { phaseName = 'New Moon'; phaseEmoji = '🌑'; }
  else if (normalizedPhase < 5.54) { phaseName = 'Waxing Crescent'; phaseEmoji = '🌒'; }
  else if (normalizedPhase < 9.23) { phaseName = 'First Quarter'; phaseEmoji = '🌓'; }
  else if (normalizedPhase < 12.92) { phaseName = 'Waxing Gibbous'; phaseEmoji = '🌔'; }
  else if (normalizedPhase < 16.61) { phaseName = 'Full Moon'; phaseEmoji = '🌕'; }
  else if (normalizedPhase < 20.30) { phaseName = 'Waning Gibbous'; phaseEmoji = '🌖'; }
  else if (normalizedPhase < 23.99) { phaseName = 'Last Quarter'; phaseEmoji = '🌗'; }
  else if (normalizedPhase < 27.68) { phaseName = 'Waning Crescent'; phaseEmoji = '🌘'; }
  else { phaseName = 'New Moon'; phaseEmoji = '🌑'; }

  const illumination = Math.round(((1 - Math.cos((normalizedPhase / 29.530588853) * 2 * Math.PI)) / 2) * 100);

  return {
    moonSign: `${sign.emoji} ${sign.sign}`,
    moonElement: sign.element,
    moonPhase: `${phaseEmoji} ${phaseName}`,
    illumination: `${illumination}%`,
  };
}

function getChineseZodiac(year: number): { animal: string; element: string; emoji: string } {
  const animals = [
    { animal: 'Rat', emoji: '🐀' },
    { animal: 'Ox', emoji: '🐂' },
    { animal: 'Tiger', emoji: '🐅' },
    { animal: 'Rabbit', emoji: '🐇' },
    { animal: 'Dragon', emoji: '🐉' },
    { animal: 'Snake', emoji: '🐍' },
    { animal: 'Horse', emoji: '🐎' },
    { animal: 'Goat', emoji: '🐐' },
    { animal: 'Monkey', emoji: '🐒' },
    { animal: 'Rooster', emoji: '🐓' },
    { animal: 'Dog', emoji: '🐕' },
    { animal: 'Pig', emoji: '🐖' },
  ];
  const elements = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];

  const animalIndex = ((year - 4) % 12 + 12) % 12;
  const elementIndex = Math.floor(((year - 4) % 10 + 10) % 10 / 2) % 5;

  const a = animals[animalIndex] || animals[0]!;
  const e = elements[elementIndex] || elements[0]!;

  return {
    animal: a.animal,
    emoji: a.emoji,
    element: e,
  };
}

function getBirthstoneAndFlower(month: number): { birthstone: string; birthFlower: string } {
  const items = [
    { birthstone: '💎 Garnet', birthFlower: '🌸 Carnation' },
    { birthstone: '💎 Amethyst', birthFlower: '🌸 Violet' },
    { birthstone: '💎 Aquamarine', birthFlower: '🌸 Daffodil' },
    { birthstone: '💎 Diamond', birthFlower: '🌸 Daisy' },
    { birthstone: '💎 Emerald', birthFlower: '🌸 Lily of the Valley' },
    { birthstone: '💎 Pearl', birthFlower: '🌸 Rose' },
    { birthstone: '💎 Ruby', birthFlower: '🌸 Water Lily' },
    { birthstone: '💎 Peridot', birthFlower: '🌸 Poppy' },
    { birthstone: '💎 Sapphire', birthFlower: '🌸 Morning Glory' },
    { birthstone: '💎 Opal', birthFlower: '🌸 Marigold' },
    { birthstone: '💎 Topaz', birthFlower: '🌸 Chrysanthemum' },
    { birthstone: '💎 Turquoise', birthFlower: '🌸 Narcissus' },
  ];
  return items[month - 1] || items[0]!;
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

    const sunZodiac = getSunZodiacSign(d1.getMonth() + 1, d1.getDate());
    const moonDetails = getMoonDetails(d1);
    const chineseZodiac = getChineseZodiac(d1.getFullYear());
    const birthstoneFlower = getBirthstoneAndFlower(d1.getMonth() + 1);

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
      sunSign: `${sunZodiac.emoji} ${sunZodiac.sign}`,
      sunElement: sunZodiac.element,
      sunDates: sunZodiac.dates,
      moonSign: moonDetails.moonSign,
      moonElement: moonDetails.moonElement,
      moonPhase: moonDetails.moonPhase,
      moonIllumination: moonDetails.illumination,
      chineseZodiac: `${chineseZodiac.emoji} ${chineseZodiac.element} ${chineseZodiac.animal}`,
      birthstone: birthstoneFlower.birthstone,
      birthFlower: birthstoneFlower.birthFlower,
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
                    className="flex items-center gap-2 bg-surface-2 border border-border rounded-xl px-4 py-2 text-sm font-medium text-text-muted hover:text-text transition-colors cursor-pointer"
                  >
                    <Users className="w-4 h-4" />
                    {showComparison ? "Hide Comparison" : "Compare Ages"}
                  </button>
                  <button 
                    onClick={resetAll}
                    className="flex items-center gap-2 bg-surface-2 border border-border rounded-xl px-4 py-2 text-sm font-medium text-text-muted hover:text-text transition-colors cursor-pointer"
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

              {/* Section 2: Zodiac & Celestial Profile */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-text-muted">
                  <Sparkles className="w-3.5 h-3.5 text-blue" />
                  <span>Zodiac & Celestial Profile</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <MetricCard 
                    label="Sun Sign (Zodiac)" 
                    value={result.sunSign}
                    sub={`${result.sunElement} • ${result.sunDates}`} 
                  />
                  <MetricCard 
                    label="Moon Sign (Lunar Rasi)" 
                    value={result.moonSign} 
                    sub={`${result.moonElement} Element`} 
                  />
                  <MetricCard 
                    label="Birth Moon Phase" 
                    value={result.moonPhase} 
                    sub={`${result.moonIllumination} Illumination`} 
                  />
                  <MetricCard 
                    label="Chinese Zodiac" 
                    value={result.chineseZodiac} 
                    sub="Lunar Year Stem" 
                  />
                </div>
              </div>

              {/* Section 3: Birth Info & Traditional Gems */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <MetricCard label="Birth Day of Week" value={result.birthDayOfWeek} />
                <MetricCard label="Leap Year Birth" value={result.isLeapYearBirth ? "Yes" : "No"} />
                <MetricCard label="Birthstone" value={result.birthstone} />
                <MetricCard label="Birth Flower" value={result.birthFlower} />
              </div>

              {/* Section 4: Birthday Countdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MetricCard label="Next Birthday" value={result.nextBirthday || ''} />
                <MetricCard label="Days Until Birthday" value={`${result.daysUntilBirthday.toLocaleString()} 🎂`} />
              </div>

              {/* Section 5: Time Breakdown */}
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

              {/* Section 6: Comparison */}
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
