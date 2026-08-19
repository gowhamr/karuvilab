"use client";

import { useState, useMemo, useCallback } from "react";
import { MetricCard } from "@/components/ui/MetricCard";
import { HybridDateInput } from "@/components/ui/HybridDateInput";
import { useUrlState } from "@/src/hooks/useUrlState";
import { ShareButton } from "@/components/ui/ShareButton";
import { SharedResultBanner } from "@/components/ui/SharedResultBanner";
import { QRModal } from "@/components/ui/QRModal";
import { ToolWorkspace } from "@/components/ui/ToolWorkspace";
import { RotateCcw, Users, Sparkles, Clock, Globe, ChevronDown, ChevronUp, HeartPulse } from "lucide-react";
import {
  TIMEZONE_PRESETS,
  todayISO,
  calculateFullAgeProfile,
  calculateAgeComparison,
} from "@/src/features/calculators/age";

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

  // Precision Celestial state (Birth Time & Place/Timezone)
  const [showPrecisionTime, setShowPrecisionTime] = useState(false);
  const [birthTime, setBirthTime] = useState("12:00");
  const [tzOffset, setTzOffset] = useState<number>(() => -new Date().getTimezoneOffset());
  const [astrologySystem, setAstrologySystem] = useState<"tropical" | "vedic">("tropical");

  const setDob = useCallback((v: string) => setState({ dob: v }), [setState]);
  const setAsOf = useCallback((v: string) => setState({ ref: v }), [setState]);

  const resetAll = () => {
    setState({ dob: '1995-01-01', ref: todayISO() });
    setDob2('');
    setShowComparison(false);
    setShowPrecisionTime(false);
    setBirthTime("12:00");
    setTzOffset(-new Date().getTimezoneOffset());
  };

  const result = useMemo(() => {
    return calculateFullAgeProfile(dob, asOf, showPrecisionTime, birthTime, tzOffset);
  }, [dob, asOf, showPrecisionTime, birthTime, tzOffset]);

  const comparisonResult = useMemo(() => {
    if (!showComparison || !dob || !dob2) return null;
    return calculateAgeComparison(dob, dob2);
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

            {/* Precision Celestial Settings Accordion */}
            <div className="border border-border/80 rounded-2xl p-4 bg-surface-2/40 space-y-4">
              <button
                type="button"
                onClick={() => setShowPrecisionTime(!showPrecisionTime)}
                className="w-full flex items-center justify-between text-left text-sm font-semibold text-text hover:text-blue transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue" />
                  <span>Precision Birth Time & Location (Optional)</span>
                </div>
                {showPrecisionTime ? (
                  <ChevronUp className="w-4 h-4 text-text-muted" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-text-muted" />
                )}
              </button>

              {showPrecisionTime && (
                <div className="space-y-4 pt-2 border-t border-border/50 text-xs">
                  <p className="text-text-muted">
                    Planets traverse zodiac positions continually. Enter birth time and location/timezone for pinpoint planetary positions, Moon Sign (Rasi), and Nakshatra.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="birth-time-input" className="flex items-center gap-1.5 font-medium text-text">
                        <Clock className="w-3.5 h-3.5 text-blue" />
                        <span>Birth Time (24h)</span>
                      </label>
                      <input
                        id="birth-time-input"
                        type="time"
                        value={birthTime}
                        onChange={(e) => setBirthTime(e.target.value)}
                        className="w-full bg-surface-2 border border-border rounded-xl px-3 py-2 text-text focus:outline-none focus:border-blue text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="birth-tz-select" className="flex items-center gap-1.5 font-medium text-text">
                        <Globe className="w-3.5 h-3.5 text-blue" />
                        <span>Birth Place / Timezone</span>
                      </label>
                      <select
                        id="birth-tz-select"
                        value={tzOffset}
                        onChange={(e) => setTzOffset(Number(e.target.value))}
                        className="w-full bg-surface-2 border border-border rounded-xl px-3 py-2 text-text focus:outline-none focus:border-blue text-sm"
                      >
                        {TIMEZONE_PRESETS.map((tz) => (
                          <option key={tz.id} value={tz.offset}>
                            {tz.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
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
                  className="bg-primary/5 border-primary/20 shadow-sm"
                  valueClassName="text-xl xs:text-2xl sm:text-3xl md:text-4xl text-blue leading-tight"
                  sub="Calculated to the exact day from date of birth"
                />
              </div>

              {/* Section 2: Birthday Countdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <MetricCard label="Next Birthday" value={result.nextBirthday || ''} />
                <MetricCard label="Days Until Birthday" value={`${result.daysUntilBirthday.toLocaleString()} 🎂`} />
              </div>

              {/* Section 3: Time Breakdown */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-4">
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

              {/* Age Difference (Comparison Mode - Placed above Zodiac) */}
              {showComparison && comparisonResult && (
                <div className="w-full">
                  <MetricCard 
                    label="Age Difference (Comparison)" 
                    value={`${comparisonResult.years} Years, ${comparisonResult.months} Months, ${comparisonResult.days} Days`} 
                    accent
                    className="bg-blue/5 border-blue/20"
                    valueClassName="text-lg xs:text-xl sm:text-2xl"
                  />
                </div>
              )}

              {/* Section 4: Zodiac & Celestial Profile */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-text-muted">
                    <Sparkles className="w-3.5 h-3.5 text-blue flex-shrink-0" />
                    <span>Zodiac & Celestial Profile</span>
                  </div>

                  {/* Astrology System Switcher */}
                  <div className="flex items-center gap-1 bg-surface-2 p-1 rounded-xl border border-border text-xs self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setAstrologySystem("tropical")}
                      className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer text-xs ${
                        astrologySystem === "tropical"
                          ? "bg-blue text-white shadow-sm"
                          : "text-text-muted hover:text-text"
                      }`}
                    >
                      Western / Tropical
                    </button>
                    <button
                      type="button"
                      onClick={() => setAstrologySystem("vedic")}
                      className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer text-xs ${
                        astrologySystem === "vedic"
                          ? "bg-blue text-white shadow-sm"
                          : "text-text-muted hover:text-text"
                      }`}
                    >
                      Vedic / Sidereal
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3">
                  <MetricCard 
                    label="Sun Sign" 
                    value={result.sunSign}
                    sub={`${result.sunElement} • ${result.sunDates}`} 
                  />
                  <MetricCard 
                    label="Moon Sign" 
                    value={astrologySystem === "tropical" ? result.tropicalMoon : result.vedicRasi} 
                    sub={
                      astrologySystem === "tropical"
                        ? `${result.tropicalElement} • ${result.tropicalDeg}`
                        : `${result.vedicElement} • ${result.vedicDeg} (Lahiri)`
                    } 
                  />
                  <MetricCard 
                    label="Nakshatra (Mansion)" 
                    value={result.nakshatra} 
                    sub={result.nakshatraPada} 
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
                  <MetricCard 
                    label="Ayanamsa (Precession)" 
                    value={result.ephemeris.ayanamsa} 
                    sub="Chitra Paksha / Lahiri" 
                  />
                </div>

                {/* Planetary Positions Ephemeris Table */}
                <div className="border border-border rounded-2xl overflow-hidden bg-surface-2/30">
                  <div className="px-3.5 py-3 bg-surface-2 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-xs font-bold text-text uppercase tracking-wider">
                      {astrologySystem === "tropical" ? "Western / Tropical Planetary Positions" : "Vedic / Sidereal Planetary Positions"}
                    </span>
                    <span className="text-[11px] text-text-muted">
                      Ephemeris Longitudes at Birth
                    </span>
                  </div>

                  <div className="overflow-x-auto -mx-px">
                    <table className="w-full text-left text-xs border-collapse min-w-[320px]">
                      <thead>
                        <tr className="border-b border-border text-text-muted bg-surface-2/50">
                          <th className="py-2.5 px-3 sm:px-4 font-semibold">Planet</th>
                          <th className="py-2.5 px-3 sm:px-4 font-semibold">Position</th>
                          <th className="py-2.5 px-3 sm:px-4 font-semibold">Element</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        {result.ephemeris.planets.map((planet) => (
                          <tr key={planet.name} className="hover:bg-surface-2/40 transition-colors">
                            <td className="py-2 px-3 sm:px-4 font-medium text-text flex items-center gap-1.5 whitespace-nowrap">
                              <span className="text-sm flex-shrink-0">{planet.symbol}</span>
                              <span className="truncate">{planet.name}</span>
                            </td>
                            <td className="py-2 px-3 sm:px-4 font-semibold text-text whitespace-nowrap">
                              {astrologySystem === "tropical" ? planet.trop : planet.ved}
                            </td>
                            <td className="py-2 px-3 sm:px-4 text-text-muted whitespace-nowrap">
                              {astrologySystem === "tropical" ? planet.tropElement : planet.vedElement}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Section 5: Life Statistics & Biological Estimates */}
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-text-muted">
                  <HeartPulse className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                  <span>Life Statistics & Bio-Estimates</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
                  <MetricCard 
                    label="Days Lived" 
                    value={result.totalDays.toLocaleString()} 
                    sub={`${result.totalWeeks.toLocaleString(undefined, { maximumFractionDigits: 1 })} wks`} 
                  />
                  <MetricCard 
                    label="Months Lived" 
                    value={result.totalMonths.toLocaleString()} 
                    sub={`${result.totalHours.toLocaleString()} hrs`} 
                  />
                  <MetricCard 
                    label="Estimated Heartbeats" 
                    value={result.approxHeartbeats.toLocaleString()} 
                    sub="~75 bpm resting (estimate)" 
                  />
                  <MetricCard 
                    label="Estimated Sleep" 
                    value={`${result.approxSleepHours.toLocaleString()} hrs`} 
                    sub="~8 hrs/day (1/3 of life)" 
                  />
                  <MetricCard 
                    label="Estimated Breaths" 
                    value={result.approxBreaths.toLocaleString()} 
                    sub="~16 breaths/min (est)" 
                  />
                  <MetricCard 
                    label="Year Progress" 
                    value={`${result.yearProgressPct.toFixed(1)}%`} 
                    sub={`Year ${new Date(asOf).getFullYear()} elapsed`} 
                  />
                  <MetricCard 
                    label="Statistical Lifespan" 
                    value={`${result.lifespanProgressPct.toFixed(1)}%`} 
                    sub="Based on 80-yr baseline" 
                  />
                  <MetricCard 
                    label="Total Seconds" 
                    value={result.totalSeconds.toLocaleString()} 
                    sub="Total seconds elapsed" 
                  />
                </div>
              </div>

              {/* Section 6: Birth Info & Traditional Gems */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
                <MetricCard label="Birth Day" value={result.birthDayOfWeek} />
                <MetricCard label="Leap Year Birth" value={result.isLeapYearBirth ? "Yes" : "No"} />
                <MetricCard label="Birthstone" value={result.birthstone} />
                <MetricCard label="Birth Flower" value={result.birthFlower} />
              </div>
            </div>
          ) : null
        }
      />
    </div>
  );
}

