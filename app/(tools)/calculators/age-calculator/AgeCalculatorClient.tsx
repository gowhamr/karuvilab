"use client";

import { useState, useMemo, useCallback } from "react";
import { MetricCard } from "@/components/ui/MetricCard";
import { HybridDateInput } from "@/components/ui/HybridDateInput";
import { useUrlState } from "@/src/hooks/useUrlState";
import { ShareButton } from "@/components/ui/ShareButton";
import { SharedResultBanner } from "@/components/ui/SharedResultBanner";
import { QRModal } from "@/components/ui/QRModal";
import { ToolWorkspace } from "@/components/ui/ToolWorkspace";
import { 
  RotateCcw, 
  Users, 
  Sparkles, 
  Clock, 
  Globe, 
  HeartPulse, 
  SlidersHorizontal, 
  ChevronDown, 
  ChevronUp 
} from "lucide-react";
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
  
  // Options panel collapse state
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

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
    setAstrologySystem("tropical");
  };

  const result = useMemo(() => {
    return calculateFullAgeProfile(dob, asOf, showPrecisionTime, birthTime, tzOffset);
  }, [dob, asOf, showPrecisionTime, birthTime, tzOffset]);

  const comparisonResult = useMemo(() => {
    if (!showComparison || !dob || !dob2) return null;
    return calculateAgeComparison(dob, dob2);
  }, [showComparison, dob, dob2]);

  const activeOptionsCount = (showComparison ? 1 : 0) + (showPrecisionTime ? 1 : 0);

  return (
    <div className="w-full min-w-0 max-w-full space-y-6 sm:space-y-8">
      <SharedResultBanner hasParams={hasParams} toolName="Age Calculator" />
      <QRModal url={shareUrl} isOpen={isQrOpen} onClose={() => setIsQrOpen(false)} />

      <ToolWorkspace
        layout="split"
        input={
          <div className="grid grid-cols-1 gap-4 sm:gap-6 min-w-0 w-full">
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
        optionsPanel={
          <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm min-w-0 w-full">
            {/* Collapsible Header Button */}
            <button
              type="button"
              onClick={() => setIsOptionsOpen(!isOptionsOpen)}
              className="w-full px-4 py-3 sm:py-3.5 flex items-center justify-between gap-2 hover:bg-surface-2/60 transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-2 min-w-0">
                <SlidersHorizontal className="w-4 h-4 text-blue flex-shrink-0" />
                <span className="text-xs font-bold text-text uppercase tracking-wider truncate">
                  Calculation Options
                </span>
                {activeOptionsCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue/10 text-blue border border-blue/20 flex-shrink-0">
                    {activeOptionsCount} Active
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-text-muted flex-shrink-0">
                <span className="text-xs font-semibold">{isOptionsOpen ? "Hide" : "Customize"}</span>
                {isOptionsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>

            {/* Collapsible Content */}
            {isOptionsOpen && (
              <div className="p-4 border-t border-border space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                {/* Compare Ages Mode Toggle */}
                <div className="flex items-center justify-between p-3 bg-surface-2/40 border border-border/80 rounded-xl gap-3">
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-text">
                      <Users className="w-3.5 h-3.5 text-blue flex-shrink-0" />
                      <span>Age Comparison Mode</span>
                    </div>
                    <p className="text-[11px] text-text-muted">Compare age difference between two individuals</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowComparison(!showComparison)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex-shrink-0 ${
                      showComparison
                        ? "bg-blue text-white shadow-sm"
                        : "bg-surface-2 text-text-muted hover:text-text border border-border"
                    }`}
                  >
                    {showComparison ? "Enabled" : "Disabled"}
                  </button>
                </div>

                {/* Precision Celestial Parameters Toggle */}
                <div className="space-y-3 p-3 bg-surface-2/40 border border-border/80 rounded-xl min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-text">
                        <Sparkles className="w-3.5 h-3.5 text-blue flex-shrink-0" />
                        <span>Precision Birth Time & Location</span>
                      </div>
                      <p className="text-[11px] text-text-muted">Exact birth time & timezone for ephemeris accuracy</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPrecisionTime(!showPrecisionTime)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex-shrink-0 ${
                        showPrecisionTime
                          ? "bg-blue text-white shadow-sm"
                          : "bg-surface-2 text-text-muted hover:text-text border border-border"
                      }`}
                    >
                      {showPrecisionTime ? "Active" : "Off"}
                    </button>
                  </div>

                  {showPrecisionTime && (
                    <div className="space-y-3 pt-3 border-t border-border/50 text-xs min-w-0 w-full animate-in fade-in">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 min-w-0 w-full">
                        <div className="space-y-1.5 min-w-0 w-full">
                          <label htmlFor="birth-time-input" className="flex items-center gap-1.5 font-medium text-text">
                            <Clock className="w-3.5 h-3.5 text-blue flex-shrink-0" />
                            <span>Birth Time (24h)</span>
                          </label>
                          <input
                            id="birth-time-input"
                            type="time"
                            value={birthTime}
                            onChange={(e) => setBirthTime(e.target.value)}
                            className="w-full min-w-0 bg-surface border border-border rounded-xl px-3 py-2 text-text focus:outline-none focus:border-blue text-sm"
                          />
                        </div>

                        <div className="space-y-1.5 min-w-0 w-full overflow-hidden">
                          <label htmlFor="birth-tz-select" className="flex items-center gap-1.5 font-medium text-text min-w-0">
                            <Globe className="w-3.5 h-3.5 text-blue flex-shrink-0" />
                            <span className="truncate">Timezone / Location</span>
                          </label>
                          <select
                            id="birth-tz-select"
                            value={tzOffset}
                            onChange={(e) => setTzOffset(Number(e.target.value))}
                            className="w-full min-w-0 max-w-full bg-surface border border-border rounded-xl px-3 py-2 text-text focus:outline-none focus:border-blue text-xs sm:text-sm truncate"
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
            )}
          </div>
        }
        output={
          result ? (
            <div className="space-y-5 sm:space-y-6 min-w-0 w-full">
              {/* Header Actions Row */}
              <div className="flex items-center justify-between gap-3 min-w-0 w-full">
                <h3 className="text-base sm:text-lg font-semibold text-text truncate">Calculated Age</h3>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button 
                    type="button"
                    onClick={resetAll}
                    className="flex items-center justify-center gap-1.5 bg-surface-2 border border-border rounded-xl px-3 py-2 text-xs sm:text-sm font-medium text-text-muted hover:text-text transition-colors cursor-pointer whitespace-nowrap"
                    title="Reset to defaults"
                  >
                    <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span>Reset</span>
                  </button>
                  <ShareButton
                    url={shareUrl}
                    title={`Age: ${result.years} years ${result.months} months ${result.days} days — KaruviLab`}
                    onQrClick={() => setIsQrOpen(true)}
                  />
                </div>
              </div>
              
              {/* Section 1: Primary Result */}
              <div className="w-full min-w-0">
                <MetricCard 
                  label="Exact Age" 
                  value={`${result.years} Years, ${result.months} Months, ${result.days} Days`} 
                  accent 
                  className="bg-primary/5 border-primary/20 shadow-sm w-full min-w-0"
                  valueClassName="text-lg xs:text-xl sm:text-2xl md:text-3xl text-blue leading-tight"
                  sub="Calculated to the exact day from date of birth"
                />
              </div>

              {/* Section 2: Birthday Countdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4 w-full min-w-0">
                <MetricCard label="Next Birthday" value={result.nextBirthday || ''} />
                <MetricCard label="Days Until Birthday" value={`${result.daysUntilBirthday.toLocaleString()} 🎂`} />
              </div>

              {/* Section 3: Time Breakdown */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 w-full min-w-0">
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

              {/* Age Difference (Comparison Mode) */}
              {showComparison && comparisonResult && (
                <div className="w-full min-w-0">
                  <MetricCard 
                    label="Age Difference (Comparison)" 
                    value={`${comparisonResult.years} Years, ${comparisonResult.months} Months, ${comparisonResult.days} Days`} 
                    accent
                    className="bg-blue/5 border-blue/20 w-full min-w-0"
                    valueClassName="text-base xs:text-lg sm:text-xl"
                    sub={`Between Person 1 (${dob}) and Person 2 (${dob2})`}
                  />
                </div>
              )}

              {/* Section 4: Zodiac & Celestial Profile (With Ephemeris Switcher right above) */}
              <div className="space-y-3 sm:space-y-4 min-w-0 w-full bg-surface border border-border rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-w-0 w-full pb-3 border-b border-border/60">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-text min-w-0">
                    <Sparkles className="w-4 h-4 text-blue flex-shrink-0" />
                    <span className="truncate">Zodiac & Celestial Profile</span>
                  </div>

                  {/* Ephemeris System Switcher positioned directly above Celestial Profile */}
                  <div className="inline-flex items-center bg-surface-2 p-1 rounded-xl border border-border text-xs self-start sm:self-auto gap-1">
                    <button
                      type="button"
                      onClick={() => setAstrologySystem("tropical")}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer text-xs ${
                        astrologySystem === "tropical"
                          ? "bg-blue text-white shadow-sm font-bold"
                          : "text-text-muted hover:text-text"
                      }`}
                    >
                      Western (Tropical)
                    </button>
                    <button
                      type="button"
                      onClick={() => setAstrologySystem("vedic")}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer text-xs ${
                        astrologySystem === "vedic"
                          ? "bg-blue text-white shadow-sm font-bold"
                          : "text-text-muted hover:text-text"
                      }`}
                    >
                      Vedic (Lahiri Sidereal)
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 w-full min-w-0">
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
                <div className="border border-border rounded-xl overflow-hidden bg-surface-2/30 w-full min-w-0 max-w-full mt-3">
                  <div className="px-3 py-2 sm:px-3.5 sm:py-2.5 bg-surface-2/80 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-1 min-w-0">
                    <span className="text-xs font-bold text-text uppercase tracking-wider truncate">
                      {astrologySystem === "tropical" ? "Western / Tropical Positions" : "Vedic / Sidereal Positions"}
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-text-muted truncate">
                      Ephemeris Longitudes at Birth
                    </span>
                  </div>

                  <div className="overflow-x-auto w-full max-w-full min-w-0">
                    <table className="w-full text-left text-xs border-collapse min-w-[280px]">
                      <thead>
                        <tr className="border-b border-border text-text-muted bg-surface-2/50">
                          <th className="py-2 px-2.5 sm:px-4 font-semibold">Planet</th>
                          <th className="py-2 px-2.5 sm:px-4 font-semibold">Position</th>
                          <th className="py-2 px-2.5 sm:px-4 font-semibold">Element</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        {result.ephemeris.planets.map((planet) => (
                          <tr key={planet.name} className="hover:bg-surface-2/40 transition-colors">
                            <td className="py-2 px-2.5 sm:px-4 font-medium text-text flex items-center gap-1.5 whitespace-nowrap min-w-0">
                              <span className="text-sm flex-shrink-0">{planet.symbol}</span>
                              <span className="truncate">{planet.name}</span>
                            </td>
                            <td className="py-2 px-2.5 sm:px-4 font-semibold text-text whitespace-nowrap">
                              {astrologySystem === "tropical" ? planet.trop : planet.ved}
                            </td>
                            <td className="py-2 px-2.5 sm:px-4 text-text-muted whitespace-nowrap">
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
              <div className="space-y-3 min-w-0 w-full">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-text-muted min-w-0">
                  <HeartPulse className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                  <span className="truncate">Life Statistics & Bio-Estimates</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 w-full min-w-0">
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
                    sub="~75 bpm (est)" 
                  />
                  <MetricCard 
                    label="Estimated Sleep" 
                    value={`${result.approxSleepHours.toLocaleString()} hrs`} 
                    sub="~8 hrs/day (1/3 life)" 
                  />
                  <MetricCard 
                    label="Estimated Breaths" 
                    value={result.approxBreaths.toLocaleString()} 
                    sub="~16 bpm (est)" 
                  />
                  <MetricCard 
                    label="Year Progress" 
                    value={`${result.yearProgressPct.toFixed(1)}%`} 
                    sub={`Year ${new Date(asOf).getFullYear()} elapsed`} 
                  />
                  <MetricCard 
                    label="Statistical Lifespan" 
                    value={`${result.lifespanProgressPct.toFixed(1)}%`} 
                    sub="80-yr baseline" 
                  />
                  <MetricCard 
                    label="Total Seconds" 
                    value={result.totalSeconds.toLocaleString()} 
                    sub="Total seconds" 
                  />
                </div>
              </div>

              {/* Section 6: Birth Info & Traditional Gems */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 w-full min-w-0">
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
