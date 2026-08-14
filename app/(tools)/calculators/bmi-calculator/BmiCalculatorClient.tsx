'use client';

import React, { useMemo, useCallback, useState } from 'react';
import { Activity, Info, RefreshCw, User, Scale } from 'lucide-react';
import { m, AnimatePresence } from 'framer-motion';
import { cn } from '@/src/lib/utils';
import { MetricCard } from '@/components/ui/MetricCard';
import { useUrlState } from '@/src/hooks/useUrlState';
import { ShareButton } from '@/components/ui/ShareButton';
import { SharedResultBanner } from '@/components/ui/SharedResultBanner';
import { QRModal } from '@/components/ui/QRModal';
import { ToolWorkspace } from '@/components/ui/ToolWorkspace';

import { BMIResult, UnitSystem } from '@/src/features/bmi-calculator/types';
import { STANDARD_THRESHOLDS, ASIAN_THRESHOLDS } from '@/src/features/bmi-calculator/constants';
import { 
  calculateBMIResult, 
  cmToInches, 
  feetInchesToCm, 
  kgToLbs, 
  lbsToKg 
} from '@/src/features/bmi-calculator/utils';
import { BmiGauge } from '@/src/features/bmi-calculator/components/BmiGauge';

export default function BmiCalculatorClient() {
  const { state, setState, shareUrl, hasParams } = useUrlState({
    defaults: { h: 170, w: 70, unit: 'metric', hft: 5, hin: 7 },
    debounceMs: 400,
  });

  const unit = state.unit as UnitSystem;
  const heightCm = state.h as number;
  const heightFt = state.hft as number;
  const heightIn = state.hin as number;
  const weight = state.w as number;

  const setUnit = useCallback((u: UnitSystem) => setState({ unit: u }), [setState]);
  const setHeightCm = useCallback((h: number) => setState({ h }), [setState]);
  const setHeightFt = useCallback((hft: number) => setState({ hft }), [setState]);
  const setHeightIn = useCallback((hin: number) => setState({ hin }), [setState]);
  const setWeight = useCallback((w: number) => setState({ w }), [setState]);

  const [isQrOpen, setIsQrOpen] = useState(false);

  const result = useMemo<BMIResult | null>(() => {
    const hCm = unit === 'metric' ? heightCm : feetInchesToCm(heightFt, heightIn);
    const wKg = unit === 'metric' ? weight : lbsToKg(weight);
    if (hCm < 50 || wKg < 10) return null;
    return calculateBMIResult(wKg, hCm, unit);
  }, [unit, heightCm, heightFt, heightIn, weight]);

  const handleUnitSwitch = (newUnit: UnitSystem) => {
    if (newUnit === unit) return;
    if (newUnit === 'imperial') {
      const totalInches = cmToInches(heightCm);
      setState({
        unit: newUnit,
        hft: Math.floor(totalInches / 12),
        hin: Math.round(totalInches % 12),
        w: Math.round(kgToLbs(weight)),
      });
    } else {
      const hCm = feetInchesToCm(heightFt, heightIn);
      setState({
        unit: newUnit,
        h: Math.round(hCm),
        w: Math.round(lbsToKg(weight)),
      });
    }
  };

  return (
    <>
      <SharedResultBanner hasParams={hasParams} toolName="BMI Calculator" />
      <QRModal url={shareUrl} isOpen={isQrOpen} onClose={() => setIsQrOpen(false)} />

      <ToolWorkspace
        layout="split"
        tabs={{
          options: [
            { id: 'metric', label: 'Metric (kg/cm)' },
            { id: 'imperial', label: 'Imperial (lbs/ft)' }
          ],
          activeId: unit,
          onChange: (id) => handleUnitSwitch(id as UnitSystem)
        }}
        input={
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-tiny font-bold uppercase tracking-widest-sm-lg text-blue flex items-center gap-2">
                <User className="w-3.5 h-3.5" />
                Height
              </h3>
              <span className="text-xs font-bold text-text-muted">
                {unit === 'metric' ? `${heightCm} cm` : `${heightFt} ft ${heightIn} in`}
              </span>
            </div>

            <div className="space-y-4">
              {unit === 'metric' ? (
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={heightCm || ''}
                    onChange={(e) => setHeightCm(Number(e.target.value))}
                    className="bg-bg border border-border rounded-xl p-3 text-text font-mono text-lg text-center focus:ring-4 focus:ring-blue/10 focus:border-blue transition-all w-full"
                  />
                  <span className="text-text-muted font-bold">cm</span>
                </div>
              ) : (
                <div className="flex gap-4">
                  <div className="flex-1 flex items-center gap-3">
                    <input
                      type="number"
                      value={heightFt || ''}
                      onChange={(e) => setHeightFt(Number(e.target.value))}
                      className="bg-bg border border-border rounded-xl p-3 text-text font-mono text-lg text-center focus:ring-4 focus:ring-blue/10 focus:border-blue transition-all w-full"
                    />
                    <span className="text-text-muted font-bold">ft</span>
                  </div>
                  <div className="flex-1 flex items-center gap-3">
                    <input
                      type="number"
                      value={heightIn || ''}
                      onChange={(e) => setHeightIn(Number(e.target.value))}
                      className="bg-bg border border-border rounded-xl p-3 text-text font-mono text-lg text-center focus:ring-4 focus:ring-blue/10 focus:border-blue transition-all w-full"
                    />
                    <span className="text-text-muted font-bold">in</span>
                  </div>
                </div>
              )}

              <input
                type="range"
                min={unit === 'metric' ? 50 : 48}
                max={unit === 'metric' ? 250 : 96}
                value={unit === 'metric' ? heightCm : (heightFt * 12 + heightIn)}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (unit === 'metric') setHeightCm(val);
                  else {
                    setHeightFt(Math.floor(val / 12));
                    setHeightIn(val % 12);
                  }
                }}
                className="w-full h-1.5 bg-border rounded-full appearance-none cursor-pointer accent-blue transition-all"
              />
            </div>
          </div>
        }
        optionsPanel={
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-tiny font-bold uppercase tracking-widest-sm-lg text-blue flex items-center gap-2">
                <Scale className="w-3.5 h-3.5" />
                Weight
              </h3>
              <span className="text-xs font-bold text-text-muted">
                {weight} {unit === 'metric' ? 'kg' : 'lbs'}
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={weight || ''}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="bg-bg border border-border rounded-xl p-3 text-text font-mono text-lg text-center focus:ring-4 focus:ring-blue/10 focus:border-blue transition-all w-full"
                />
                <span className="text-text-muted font-bold">{unit === 'metric' ? 'kg' : 'lbs'}</span>
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
        }
        output={
          result ? (
            <m.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8 h-full flex flex-col"
            >
              <div className="flex justify-end">
                <ShareButton
                  url={shareUrl}
                  title={`My BMI is ${result.bmi} (${result.category}) — calculated on KaruviLab`}
                  onQrClick={() => setIsQrOpen(true)}
                />
              </div>
              <div className="flex flex-col items-center justify-center relative overflow-hidden rounded-4xl py-4 sm:py-8">
                 <div className={cn("absolute -top-24 -left-24 w-64 h-64 blur-3xl opacity-[0.05] rounded-full transition-colors duration-700", result.threshold.bgColor)} />
                 <BmiGauge bmi={result.bmi} threshold={result.threshold} />
                 <p className="text-sm text-text-3 font-medium text-center max-w-md mt-4">
                   {result.threshold.advice}
                 </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <MetricCard
                  label="Your BMI"
                  value={result.bmi.toString()}
                  sub={result.category}
                  accent={true}
                  className={cn("border-l-4", result.threshold.borderColor, "sm:col-span-2")}
                />
                <MetricCard
                  label="Healthy Weight"
                  value={unit === 'metric' 
                    ? `${Math.round(result.healthyWeightMin)}–${Math.round(result.healthyWeightMax)} kg`
                    : `${Math.round(kgToLbs(result.healthyWeightMin))}–${Math.round(kgToLbs(result.healthyWeightMax))} lbs`
                  }
                  sub="BMI 18.5 – 24.9"
                />
                <MetricCard
                  label={result.weightToLose ? 'To Lose' : result.weightToGain ? 'To Gain' : 'Status'}
                  value={
                    result.weightToLose ? `-${Math.round(result.weightToLose)} ${unit === 'metric' ? 'kg' : 'lbs'}` : 
                    result.weightToGain ? `+${Math.round(result.weightToGain)} ${unit === 'metric' ? 'kg' : 'lbs'}` : 
                    '✓ Normal'
                  }
                  sub={result.weightToLose ? "Reach healthy max" : result.weightToGain ? "Reach healthy min" : "In healthy range"}
                  className={cn(
                    result.weightToLose ? "bg-yellow-500/5" : 
                    result.weightToGain ? "bg-blue-500/5" : 
                    "bg-green-500/5"
                  )}
                />
              </div>

              {result.asianDiffers && (
                <m.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-warn/10 border border-warn/30 rounded-3xl p-6 flex gap-4 items-start"
                >
                  <Info className="w-5 h-5 text-warn flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-warn text-sm font-black uppercase tracking-widest">
                      Asian Body Type Context
                    </p>
                    <p className="text-text-3 text-sm mt-1 leading-relaxed">
                      The World Health Organization (WHO) recommends lower BMI thresholds for South Asian and 
                      East Asian populations. By these guidelines, your BMI of <strong>{result.bmi}</strong> falls in the <strong className="text-text uppercase tracking-tight underline decoration-warn/50">{result.asianCategory}</strong> range 
                      (overweight threshold: ≥23, obese: ≥27.5).
                    </p>
                  </div>
                </m.div>
              )}
            </m.div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-text-muted min-h-[300px]">
              <p className="text-sm">Enter your height and weight to calculate your BMI</p>
            </div>
          )
        }
        infoPanel={
          result && (
            <div className="space-y-4">
              <h2 className="text-tiny font-bold uppercase tracking-widest-sm-lg text-text-muted px-2">BMI Categories (WHO Standards)</h2>
              <div className="bg-surface border border-border rounded-3xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-bg/50 border-b border-border">
                        <th className="px-6 py-4 text-tiny font-bold uppercase tracking-widest-sm text-text-muted">Category</th>
                        <th className="px-6 py-4 text-tiny font-bold uppercase tracking-widest-sm text-text-muted">BMI Range</th>
                        <th className="px-6 py-4 text-tiny font-bold uppercase tracking-widest-sm text-text-muted">Asian BMI Range</th>
                      </tr>
                    </thead>
                    <tbody>
                      {STANDARD_THRESHOLDS.map((t, i) => {
                        const isActive = result.category === t.label;
                        const asianEquivalent = ASIAN_THRESHOLDS.find(at => at.label === t.label) || 
                          (t.min >= 27.5 ? ASIAN_THRESHOLDS[3] : null);
                          
                        return (
                          <tr 
                            key={t.label}
                            className={cn(
                              "border-b border-border last:border-0 transition-colors",
                              isActive ? "bg-blue/5 border-l-4 border-l-blue" : "border-l-4 border-l-transparent"
                            )}
                          >
                            <td className="px-6 py-4">
                              <span className={cn("text-xs font-black uppercase tracking-tight", t.color)}>
                                {t.label}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-xs font-mono font-bold text-text-2">
                              {t.min === 0 ? `< ${t.max}` : t.max === Infinity ? `> ${t.min}` : `${t.min} – ${t.max}`}
                            </td>
                            <td className="px-6 py-4 text-xs font-bold text-text-muted uppercase italic">
                              {asianEquivalent ? (
                                `${asianEquivalent.min === 0 ? `< ${asianEquivalent.max}` : asianEquivalent.max === Infinity ? `> ${asianEquivalent.min}` : `${asianEquivalent.min} – ${asianEquivalent.max}`}`
                              ) : '—'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <p className="text-text-muted text-xs text-center uppercase tracking-widest-lg mt-8">
                🔒 Your height and weight are never stored or transmitted. All calculations happen locally in your browser.
              </p>
            </div>
          )
        }
      />
    </>
  );
}
