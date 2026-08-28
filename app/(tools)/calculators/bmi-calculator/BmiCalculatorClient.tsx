'use client';

import React, { useMemo, useCallback, useState } from 'react';
import { User, Scale, AlertCircle, RotateCcw, Info } from 'lucide-react';
import { m } from 'framer-motion';
import { cn } from '@/src/lib/utils';
import { MetricCard } from '@/components/ui/MetricCard';
import { useUrlState } from '@/src/hooks/useUrlState';
import { ShareButton } from '@/components/ui/ShareButton';
import { SharedResultBanner } from '@/components/ui/SharedResultBanner';
import { QRModal } from '@/components/ui/QRModal';
import { ToolWorkspace } from '@/components/ui/ToolWorkspace';
import { CopyButton } from '@/components/ui/CopyButton';

import { UnitSystem } from '@/src/features/bmi-calculator/types';
import { STANDARD_THRESHOLDS, ASIAN_THRESHOLDS } from '@/src/features/bmi-calculator/constants';
import {
  calculateDeterministicBMI,
  cmToInches,
  feetInchesToCm,
  kgToLbs,
  lbsToKg,
} from '@/src/features/bmi-calculator/utils';
import { BmiGauge } from '@/src/features/bmi-calculator/components/BmiGauge';

export default function BmiCalculatorClient() {
  const { state, setState, hasParams } = useUrlState({
    defaults: {
      unit: 'metric',
      height: '170',
      weight: '70',
      feet: '5',
      inches: '7',
      // Legacy fallback support
      h: '170',
      w: '70',
      hft: '5',
      hin: '7',
    },
    debounceMs: 350,
  });

  const unit = ((state.unit as string) === 'imperial' ? 'imperial' : 'metric') as UnitSystem;
  const heightCm = parseFloat((state.height as string) || (state.h as string) || '170') || 170;
  const heightFt = parseFloat((state.feet as string) || (state.hft as string) || '5') || 5;
  const heightIn = parseFloat((state.inches as string) || (state.hin as string) || '7') || 7;
  const weight = parseFloat((state.weight as string) || (state.w as string) || (unit === 'metric' ? '70' : '154')) || (unit === 'metric' ? 70 : 154);

  const [isQrOpen, setIsQrOpen] = useState(false);

  const setUnit = useCallback((u: UnitSystem) => setState({ unit: u }), [setState]);
  const setHeightCm = useCallback((h: number) => setState({ height: String(h), h: String(h) }), [setState]);
  const setHeightFt = useCallback((feet: number) => setState({ feet: String(feet), hft: String(feet) }), [setState]);
  const setHeightIn = useCallback((inches: number) => setState({ inches: String(inches), hin: String(inches) }), [setState]);
  const setWeight = useCallback((w: number) => setState({ weight: String(w), w: String(w) }), [setState]);

  const handleUnitSwitch = (newUnit: UnitSystem) => {
    if (newUnit === unit) return;
    if (newUnit === 'imperial') {
      const totalInches = cmToInches(heightCm);
      setState({
        unit: newUnit,
        feet: String(Math.floor(totalInches / 12)),
        inches: String(Math.round(totalInches % 12)),
        weight: String(Math.round(kgToLbs(weight))),
        hft: String(Math.floor(totalInches / 12)),
        hin: String(Math.round(totalInches % 12)),
        w: String(Math.round(kgToLbs(weight))),
      });
    } else {
      const hCm = feetInchesToCm(heightFt, heightIn);
      setState({
        unit: newUnit,
        height: String(Math.round(hCm)),
        weight: String(Math.round(lbsToKg(weight))),
        h: String(Math.round(hCm)),
        w: String(Math.round(lbsToKg(weight))),
      });
    }
  };

  const resetAll = () => {
    setState({
      unit: 'metric',
      height: '170',
      weight: '70',
      feet: '5',
      inches: '7',
      h: '170',
      w: '70',
      hft: '5',
      hin: '7',
    });
  };

  // Pure deterministic calculations
  const bmiResponse = useMemo(() => {
    return calculateDeterministicBMI({
      unit,
      heightCm,
      heightFeet: heightFt,
      heightInches: heightIn,
      weightKg: unit === 'metric' ? weight : lbsToKg(weight),
      weightLbs: unit === 'imperial' ? weight : kgToLbs(weight),
    });
  }, [unit, heightCm, heightFt, heightIn, weight]);

  // Construct canonical share URL
  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}?unit=${unit}&${
        unit === 'metric'
          ? `height=${heightCm}&weight=${weight}`
          : `feet=${heightFt}&inches=${heightIn}&weight=${weight}`
      }`
    : `?unit=${unit}&height=${heightCm}&weight=${weight}`;

  const bmiSummary = bmiResponse.success
    ? `BMI Assessment\n--------------\nHeight: ${unit === 'metric' ? `${heightCm} cm` : `${heightFt} ft ${heightIn} in`}\nWeight: ${weight} ${unit === 'metric' ? 'kg' : 'lbs'}\n\nBMI Score: ${bmiResponse.data.formattedBmi} (${bmiResponse.data.category})\nBMI Prime: ${bmiResponse.data.bmiPrime}\nPonderal Index: ${bmiResponse.data.ponderalIndex} kg/m³\nHealthy Weight Range: ${bmiResponse.data.formattedHealthyRange}\nRecommendation: ${bmiResponse.data.weightAdjustmentText}\n\nCalculated via KaruviLab`
    : '';

  return (
    <div className="w-full min-w-0 max-w-full space-y-6 sm:space-y-8">
      <SharedResultBanner hasParams={hasParams} toolName="BMI Calculator" />
      <QRModal url={shareUrl} isOpen={isQrOpen} onClose={() => setIsQrOpen(false)} />

      <ToolWorkspace
        layout="split"
        tabs={{
          options: [
            { id: 'metric', label: 'Metric (kg/cm)' },
            { id: 'imperial', label: 'Imperial (lbs/ft)' },
          ],
          activeId: unit,
          onChange: (id) => handleUnitSwitch(id as UnitSystem),
        }}
        input={
          <form
            data-tool="bmi-calculator"
            onSubmit={(e) => e.preventDefault()}
            className="space-y-6 min-w-0 w-full"
          >
            {/* Height Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-blue flex items-center gap-1.5">
                  <User className="w-4 h-4" />
                  Height
                </label>
                <span className="text-xs font-bold text-text-muted">
                  {unit === 'metric' ? `${heightCm} cm` : `${heightFt} ft ${heightIn} in`}
                </span>
              </div>

              {unit === 'metric' ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <input
                      id="bmi-height-cm"
                      name="height"
                      data-input-field="height"
                      type="number"
                      min="50"
                      max="300"
                      value={heightCm || ''}
                      onChange={(e) => setHeightCm(Number(e.target.value))}
                      className="bg-surface border border-border rounded-xl px-4 py-3 text-text font-mono text-lg text-center focus:outline-none focus:border-blue shadow-sm w-full"
                    />
                    <span className="text-text-muted font-bold text-sm">cm</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="250"
                    value={heightCm}
                    onChange={(e) => setHeightCm(Number(e.target.value))}
                    className="w-full h-1.5 bg-border rounded-full appearance-none cursor-pointer accent-blue transition-all"
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <input
                        id="bmi-height-ft"
                        name="feet"
                        data-input-field="feet"
                        type="number"
                        min="1"
                        max="9"
                        value={heightFt || ''}
                        onChange={(e) => setHeightFt(Number(e.target.value))}
                        className="bg-surface border border-border rounded-xl px-3 py-3 text-text font-mono text-lg text-center focus:outline-none focus:border-blue shadow-sm w-full"
                      />
                      <span className="text-text-muted font-bold text-sm">ft</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        id="bmi-height-in"
                        name="inches"
                        data-input-field="inches"
                        type="number"
                        min="0"
                        max="11"
                        value={heightIn || ''}
                        onChange={(e) => setHeightIn(Number(e.target.value))}
                        className="bg-surface border border-border rounded-xl px-3 py-3 text-text font-mono text-lg text-center focus:outline-none focus:border-blue shadow-sm w-full"
                      />
                      <span className="text-text-muted font-bold text-sm">in</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="48"
                    max="96"
                    value={heightFt * 12 + heightIn}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setHeightFt(Math.floor(val / 12));
                      setHeightIn(val % 12);
                    }}
                    className="w-full h-1.5 bg-border rounded-full appearance-none cursor-pointer accent-blue transition-all"
                  />
                </div>
              )}
            </div>

            {/* Weight Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-blue flex items-center gap-1.5">
                  <Scale className="w-4 h-4" />
                  Weight
                </label>
                <span className="text-xs font-bold text-text-muted">
                  {weight} {unit === 'metric' ? 'kg' : 'lbs'}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    id="bmi-weight"
                    name="weight"
                    data-input-field="weight"
                    type="number"
                    min="10"
                    max="600"
                    value={weight || ''}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="bg-surface border border-border rounded-xl px-4 py-3 text-text font-mono text-lg text-center focus:outline-none focus:border-blue shadow-sm w-full"
                  />
                  <span className="text-text-muted font-bold text-sm">{unit === 'metric' ? 'kg' : 'lbs'}</span>
                </div>
                <input
                  type="range"
                  min={unit === 'metric' ? 20 : 44}
                  max={unit === 'metric' ? 250 : 550}
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full h-1.5 bg-border rounded-full appearance-none cursor-pointer accent-blue transition-all"
                />
              </div>
            </div>
          </form>
        }
        output={
          bmiResponse.success ? (
            <m.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 sm:space-y-8 h-full flex flex-col min-w-0 w-full"
            >
              {/* Machine-readable outputs for automation / agents */}
              <div className="sr-only" aria-hidden="true">
                <output data-result-field="bmi">{bmiResponse.data.bmi}</output>
                <output data-result-field="category">{bmiResponse.data.category}</output>
                <output data-result-field="bmi-prime">{bmiResponse.data.bmiPrime}</output>
                <output data-result-field="ponderal-index">{bmiResponse.data.ponderalIndex}</output>
                <output data-result-field="healthy-range-min">{bmiResponse.data.healthyWeightMin}</output>
                <output data-result-field="healthy-range-max">{bmiResponse.data.healthyWeightMax}</output>
                <output data-result-field="weight-adjustment">{bmiResponse.data.weightAdjustmentText}</output>
              </div>

              {/* Actions Header Row */}
              <div className="flex items-center justify-between gap-3 min-w-0 w-full">
                <h3 className="text-base sm:text-lg font-semibold text-text truncate">BMI Score</h3>
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
                    title={`My BMI is ${bmiResponse.data.bmi} (${bmiResponse.data.category}) — calculated on KaruviLab`}
                    onQrClick={() => setIsQrOpen(true)}
                  />
                </div>
              </div>

              {/* Visual Gauge */}
              <div className="flex flex-col items-center justify-center relative overflow-hidden rounded-3xl bg-surface-2/30 border border-border/70 py-6 sm:py-8 shadow-xs">
                <BmiGauge bmi={bmiResponse.data.bmi} threshold={bmiResponse.data.threshold} />
                <p className="text-xs sm:text-sm text-text-muted font-medium text-center max-w-md mt-4 px-4">
                  {bmiResponse.data.threshold.advice}
                </p>
              </div>

              {/* Metric Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full min-w-0">
                <MetricCard
                  label="Computed BMI"
                  value={bmiResponse.data.formattedBmi}
                  sub={bmiResponse.data.category}
                  accent={true}
                  className={cn("border-l-4 sm:col-span-2", bmiResponse.data.threshold.borderColor)}
                  dataResultField="bmi"
                />
                <MetricCard
                  label="Healthy Weight Range"
                  value={bmiResponse.data.formattedHealthyRange}
                  sub="WHO BMI 18.5 – 24.9"
                  dataResultField="healthy-weight-range"
                />
                <MetricCard
                  label="Target Weight Delta"
                  value={
                    bmiResponse.data.weightToLose
                      ? `-${bmiResponse.data.weightToLose} ${unit === 'imperial' ? 'lbs' : 'kg'}`
                      : bmiResponse.data.weightToGain
                      ? `+${bmiResponse.data.weightToGain} ${unit === 'imperial' ? 'lbs' : 'kg'}`
                      : '✓ Normal'
                  }
                  sub={
                    bmiResponse.data.weightToLose
                      ? "Reach upper normal bound"
                      : bmiResponse.data.weightToGain
                      ? "Reach lower normal bound"
                      : "Within healthy range"
                  }
                  dataResultField="weight-adjustment"
                />
                <MetricCard
                  label="BMI Prime"
                  value={String(bmiResponse.data.bmiPrime)}
                  sub="Ratio to 25.0 upper limit"
                  dataResultField="bmi-prime"
                />
                <MetricCard
                  label="Ponderal Index"
                  value={`${bmiResponse.data.ponderalIndex} kg/m³`}
                  sub="Mass / Height³"
                  dataResultField="ponderal-index"
                />
              </div>

              {/* Asian Population Threshold Notice */}
              {bmiResponse.data.asianDiffers && (
                <div
                  className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 sm:p-5 flex gap-3.5 items-start"
                >
                  <Info className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1 min-w-0 flex-1">
                    <p className="text-amber-500 text-xs font-black uppercase tracking-wider">
                      Asian Demographic Risk Context
                    </p>
                    <p className="text-text-muted text-xs leading-relaxed">
                      WHO guidelines recommend adjusted thresholds for South Asian and East Asian populations. By these criteria, your BMI of <strong>{bmiResponse.data.bmi}</strong> falls in the <strong className="text-text underline decoration-amber-500/50">{bmiResponse.data.asianCategory}</strong> category (overweight cutoff: ≥23.0, obesity: ≥27.5).
                    </p>
                  </div>
                </div>
              )}

              {/* Copy Summary Banner */}
              <div className="bg-surface-2/40 border border-border p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-sm">
                <div className="space-y-0.5 min-w-0">
                  <p className="text-xs font-semibold text-text">
                    BMI: {bmiResponse.data.formattedBmi} ({bmiResponse.data.category})
                  </p>
                  <p className="text-[11px] text-text-muted">
                    {bmiResponse.data.formattedHealthyRange} • {bmiResponse.data.weightAdjustmentText}
                  </p>
                </div>
                <CopyButton text={bmiSummary} label="Copy Summary" className="bg-surface border border-border" />
              </div>
            </m.div>
          ) : (
            <div
              role="alert"
              aria-live="assertive"
              data-error-code={bmiResponse.error.code}
              data-error-message={bmiResponse.error.message}
              className="p-5 sm:p-6 rounded-2xl bg-error/5 border border-error/20 space-y-4 text-text min-w-0 w-full animate-in fade-in duration-200"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div className="space-y-1 min-w-0 flex-1">
                  <h3 className="font-bold text-sm sm:text-base text-red-600 dark:text-red-400">
                    Measurement Error
                  </h3>
                  <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                    {bmiResponse.error.message}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-error/10 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={resetAll}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-surface-2 border border-border text-text hover:text-blue transition-colors cursor-pointer"
                >
                  Reset Measurements
                </button>
              </div>
            </div>
          )
        }
        infoPanel={
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-text-muted px-1">
              BMI Categories (WHO Standards)
            </h2>
            <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto w-full max-w-full min-w-0">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-2/50 border-b border-border text-[11px] font-bold uppercase tracking-wider text-text-muted">
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">WHO BMI</th>
                      <th className="px-4 py-3">Asian Cutoff</th>
                    </tr>
                  </thead>
                  <tbody>
                    {STANDARD_THRESHOLDS.map((t) => {
                      const isActive = bmiResponse.success && bmiResponse.data.category === t.label;
                      const asianEquivalent =
                        ASIAN_THRESHOLDS.find((at) => at.label === t.label) ||
                        (t.min >= 27.5 ? ASIAN_THRESHOLDS[3] : null);

                      return (
                        <tr
                          key={t.label}
                          className={cn(
                            "border-b border-border/70 last:border-0 transition-colors text-xs",
                            isActive ? "bg-blue/5 font-semibold text-blue" : "text-text-muted"
                          )}
                        >
                          <td className="px-4 py-3">
                            <span className={cn("font-bold", t.color)}>{t.label}</span>
                          </td>
                          <td className="px-4 py-3 font-mono">
                            {t.min === 0 ? `< ${t.max}` : t.max === Infinity ? `≥ ${t.min}` : `${t.min} – ${t.max}`}
                          </td>
                          <td className="px-4 py-3 font-mono">
                            {asianEquivalent
                              ? `${asianEquivalent.min === 0 ? `< ${asianEquivalent.max}` : asianEquivalent.max === Infinity ? `≥ ${asianEquivalent.min}` : `${asianEquivalent.min} – ${asianEquivalent.max}`}`
                              : '—'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        }
      />
    </div>
  );
}
