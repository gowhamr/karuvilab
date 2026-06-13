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

// --- SECTION A: BMI Engine (Pure Functions) ---

type UnitSystem = 'metric' | 'imperial';

type BMICategory =
  | 'Severely Underweight'
  | 'Underweight'
  | 'Normal'
  | 'Overweight'
  | 'Obese Class I'
  | 'Obese Class II'
  | 'Obese Class III';

interface BMIThreshold {
  label: BMICategory;
  min: number;
  max: number;
  color: string;       // Tailwind text color class
  bgColor: string;     // Tailwind bg color class
  borderColor: string; // Tailwind border color class
  gaugeColor: string;  // hex for SVG gauge
  advice: string;      // one-line health context
}

interface BMIResult {
  bmi: number;
  category: BMICategory;
  threshold: BMIThreshold;
  healthyWeightMin: number;
  healthyWeightMax: number;
  weightToLose: number | null;
  weightToGain: number | null;
  asianCategory: BMICategory;
  asianDiffers: boolean;
}

const STANDARD_THRESHOLDS: BMIThreshold[] = [
  {
    label: 'Severely Underweight',
    min: 0, max: 16,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    gaugeColor: 'var(--blue)',
    advice: 'Consult a doctor. Significant health risks associated with very low body weight.'
  },
  {
    label: 'Underweight',
    min: 16, max: 18.5,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/30',
    gaugeColor: 'var(--ocean-blue)',
    advice: 'Below healthy range. Consider increasing caloric intake with nutrient-dense foods.'
  },
  {
    label: 'Normal',
    min: 18.5, max: 25,
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30',
    gaugeColor: 'var(--success)',
    advice: 'Healthy weight range. Maintain with balanced diet and regular physical activity.'
  },
  {
    label: 'Overweight',
    min: 25, max: 30,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/30',
    gaugeColor: 'var(--warn)',
    advice: 'Slightly above healthy range. Regular exercise and mindful eating can help.'
  },
  {
    label: 'Obese Class I',
    min: 30, max: 35,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/30',
    gaugeColor: 'var(--error)',
    advice: 'Increased health risk. Lifestyle changes and medical consultation recommended.'
  },
  {
    label: 'Obese Class II',
    min: 35, max: 40,
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
    gaugeColor: 'var(--error)',
    advice: 'High health risk. Medical supervision strongly recommended.'
  },
  {
    label: 'Obese Class III',
    min: 40, max: Infinity,
    color: 'text-red-600',
    bgColor: 'bg-red-600/10',
    borderColor: 'border-red-600/30',
    gaugeColor: 'var(--error)',
    advice: 'Very high health risk. Please consult a healthcare professional immediately.'
  },
];

const ASIAN_THRESHOLDS = [
  { label: 'Underweight' as BMICategory,  min: 0,    max: 18.5 },
  { label: 'Normal' as BMICategory,       min: 18.5, max: 23   },
  { label: 'Overweight' as BMICategory,   min: 23,   max: 27.5 },
  { label: 'Obese Class I' as BMICategory,        min: 27.5, max: Infinity },
];

function lbsToKg(lbs: number): number { return lbs * 0.453592; }
function kgToLbs(kg: number): number { return kg * 2.20462; }
function cmToInches(cm: number): number { return cm * 0.393701; }
function inchesToCm(inches: number): number { return inches * 2.54; }
function feetInchesToCm(feet: number, inches: number): number {
  return inchesToCm((feet * 12) + inches);
}

function calculateBMI(weightKg: number, heightCm: number): number {
  if (heightCm <= 0) return 0;
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
}

function getCategory(bmi: number): BMIThreshold {
  return STANDARD_THRESHOLDS.find(t => bmi >= t.min && bmi < t.max) || STANDARD_THRESHOLDS[0]!;
}

function getAsianCategory(bmi: number): BMICategory {
  const cat = ASIAN_THRESHOLDS.find(t => bmi >= t.min && bmi < t.max);
  return cat ? cat.label : 'Obese Class I';
}

function getHealthyWeightRange(heightCm: number): { min: number; max: number } {
  const heightM = heightCm / 100;
  return {
    min: 18.5 * (heightM * heightM),
    max: 24.9 * (heightM * heightM)
  };
}

function calculateBMIResult(weightKg: number, heightCm: number, unit: UnitSystem): BMIResult {
  const bmi = calculateBMI(weightKg, heightCm);
  const threshold = getCategory(bmi);
  const healthyRange = getHealthyWeightRange(heightCm);
  const asianCat = getAsianCategory(bmi);

  let weightToLose: number | null = null;
  let weightToGain: number | null = null;

  if (bmi >= 25) {
    weightToLose = weightKg - healthyRange.max;
  } else if (bmi < 18.5) {
    weightToGain = healthyRange.min - weightKg;
  }

  // If imperial, convert result values back for display if needed?
  // But prompt says healthyWeightMin/Max in kg or lbs depending on current unit.
  // We'll handle conversion in the UI section to keep engine pure.

  return {
    bmi: Math.round(bmi * 10) / 10,
    category: threshold.label,
    threshold,
    healthyWeightMin: healthyRange.min,
    healthyWeightMax: healthyRange.max,
    weightToLose: weightToLose ? (unit === 'imperial' ? kgToLbs(weightToLose) : weightToLose) : null,
    weightToGain: weightToGain ? (unit === 'imperial' ? kgToLbs(weightToGain) : weightToGain) : null,
    asianCategory: asianCat,
    asianDiffers: asianCat !== threshold.label
  };
}

// --- SECTION C: BMI Gauge Component ---

function BmiGauge({ bmi, threshold }: { bmi: number; threshold: BMIThreshold }) {
  // Map BMI 10-45 to 180-0 degrees
  const clampedBmi = Math.min(Math.max(bmi, 10), 45);
  const percentage = (clampedBmi - 10) / (45 - 10);
  const rotation = 180 - (percentage * 180);

  return (
    <div className="relative flex flex-col items-center py-8">
      <svg width="300" height="160" viewBox="0 0 300 160" className="overflow-visible">
        {/* Arc Background segments */}
        <path d="M 30 150 A 120 120 0 0 1 270 150" fill="none" stroke="currentColor" strokeWidth="24" className="text-border" />
        
        {/* Colored segments */}
        {/* Note: This is a simplified colored arc for clarity */}
        <path d="M 30 150 A 120 120 0 0 1 70 65" fill="none" stroke="var(--blue)" strokeWidth="24" />
        <path d="M 70 65 A 120 120 0 0 1 100 40" fill="none" stroke="var(--ocean-blue)" strokeWidth="24" />
        <path d="M 100 40 A 120 120 0 0 1 165 30" fill="none" stroke="var(--success)" strokeWidth="24" />
        <path d="M 165 30 A 120 120 0 0 1 215 50" fill="none" stroke="var(--warn)" strokeWidth="24" />
        <path d="M 215 50 A 120 120 0 0 1 250 85" fill="none" stroke="var(--error)" strokeWidth="24" opacity="0.8" />
        <path d="M 250 85 A 120 120 0 0 1 270 150" fill="none" stroke="var(--error)" strokeWidth="24" />

        {/* Animated Needle */}
        <m.g
          initial={{ rotate: 180 }}
          animate={{ rotate: rotation }}
          transition={{ type: "spring", stiffness: 60, damping: 20 }}
          style={{ transformOrigin: '150px 150px' }}
        >
          <line x1="150" y1="150" x2="30" y2="150" stroke="currentColor" strokeWidth="4" className="text-text" strokeLinecap="round" />
          <circle cx="150" cy="150" r="8" fill="currentColor" className="text-text" />
        </m.g>

        {/* Labels */}
        <text x="35" y="170" textAnchor="middle" className="text-xs fill-text-4 font-bold">16</text>
        <text x="80" y="55" textAnchor="middle" className="text-xs fill-text-4 font-bold">18.5</text>
        <text x="165" y="20" textAnchor="middle" className="text-xs fill-text-4 font-bold">25</text>
        <text x="235" y="60" textAnchor="middle" className="text-xs fill-text-4 font-bold">30</text>
        <text x="265" y="100" textAnchor="middle" className="text-xs fill-text-4 font-bold">35</text>
        <text x="275" y="170" textAnchor="middle" className="text-xs fill-text-4 font-bold">40</text>
      </svg>

      <div className="text-center mt-[-40px] space-y-1">
        <m.span 
          key={bmi}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="block text-5xl font-black tabular-nums tracking-tighter"
        >
          {bmi}
        </m.span>
        <span className={cn("text-sm font-black uppercase tracking-[0.2em]", threshold.color)}>
          {threshold.label}
        </span>
      </div>
    </div>
  );
}

// --- MAIN COMPONENT ---

export default function BmiCalculatorClient() {
  // --- SECTION E: State (URL-synced) ---
  const { state, setState, shareUrl, hasParams } = useUrlState({
    defaults: { h: 170, w: 70, unit: 'metric', hft: 5, hin: 7 },
    debounceMs: 400,
  });

  // Derive individual values from URL state
  const unit = state.unit as UnitSystem;
  const heightCm = state.h as number;
  const heightFt = state.hft as number;
  const heightIn = state.hin as number;
  const weight = state.w as number;

  // Setters that go through URL state
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
    <div className="max-w-4xl mx-auto space-y-10 pb-12">
      <SharedResultBanner hasParams={hasParams} toolName="BMI Calculator" />
      <QRModal url={shareUrl} isOpen={isQrOpen} onClose={() => setIsQrOpen(false)} />

      {/* 1. Unit Toggle */}
      <div className="flex justify-center">
        <div className="flex rounded-2xl border border-border p-1 bg-surface shadow-sm overflow-hidden">
          <button
            onClick={() => handleUnitSwitch('metric')}
            className={cn(
              "px-8 py-2.5 rounded-xl text-sm font-black transition-all",
              unit === 'metric' ? "bg-blue text-white shadow-md shadow-blue/10" : "text-text-3 hover:text-text"
            )}
          >
            Metric (kg/cm)
          </button>
          <button
            onClick={() => handleUnitSwitch('imperial')}
            className={cn(
              "px-8 py-2.5 rounded-xl text-sm font-black transition-all",
              unit === 'imperial' ? "bg-blue text-white shadow-md shadow-blue/10" : "text-text-3 hover:text-text"
            )}
          >
            Imperial (lbs/ft)
          </button>
        </div>
      </div>

      {/* 2. Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Height Input */}
        <div className="bg-surface border border-border p-6 sm:p-8 rounded-4xl space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue flex items-center gap-2">
              <User className="w-3.5 h-3.5" />
              Height
            </h3>
            <span className="text-xs font-bold text-text-4">
              {unit === 'metric' ? `${heightCm} cm` : `${heightFt} ft ${heightIn} in`}
            </span>
          </div>

          <div className="space-y-4">
            {unit === 'metric' ? (
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="bg-bg border border-border rounded-xl p-3 text-text font-mono text-lg text-center focus:ring-4 focus:ring-blue/10 focus:border-blue transition-all w-full"
                />
                <span className="text-text-4 font-bold">cm</span>
              </div>
            ) : (
              <div className="flex gap-4">
                <div className="flex-1 flex items-center gap-3">
                  <input
                    type="number"
                    value={heightFt}
                    onChange={(e) => setHeightFt(Number(e.target.value))}
                    className="bg-bg border border-border rounded-xl p-3 text-text font-mono text-lg text-center focus:ring-4 focus:ring-blue/10 focus:border-blue transition-all w-full"
                  />
                  <span className="text-text-4 font-bold">ft</span>
                </div>
                <div className="flex-1 flex items-center gap-3">
                  <input
                    type="number"
                    value={heightIn}
                    onChange={(e) => setHeightIn(Number(e.target.value))}
                    className="bg-bg border border-border rounded-xl p-3 text-text font-mono text-lg text-center focus:ring-4 focus:ring-blue/10 focus:border-blue transition-all w-full"
                  />
                  <span className="text-text-4 font-bold">in</span>
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

        {/* Weight Input */}
        <div className="bg-surface border border-border p-6 sm:p-8 rounded-4xl space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue flex items-center gap-2">
              <Scale className="w-3.5 h-3.5" />
              Weight
            </h3>
            <span className="text-xs font-bold text-text-4">
              {weight} {unit === 'metric' ? 'kg' : 'lbs'}
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="bg-bg border border-border rounded-xl p-3 text-text font-mono text-lg text-center focus:ring-4 focus:ring-blue/10 focus:border-blue transition-all w-full"
              />
              <span className="text-text-4 font-bold">{unit === 'metric' ? 'kg' : 'lbs'}</span>
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
      </div>

      {/* 3. Results Section */}
      {result && (
        <m.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Share */}
          <div className="flex justify-end">
            <ShareButton
              url={shareUrl}
              title={`My BMI is ${result.bmi} (${result.category}) — calculated on KaruviLab`}
              onQrClick={() => setIsQrOpen(true)}
            />
          </div>
          {/* Gauge */}
          <div className="bg-surface border border-border rounded-6xl p-8 flex flex-col items-center justify-center shadow-sm relative overflow-hidden">
             {/* Background glow matching category */}
             <div className={cn("absolute -top-24 -left-24 w-64 h-64 blur-3xl opacity-[0.05] rounded-full transition-colors duration-700", result.threshold.bgColor)} />
             <BmiGauge bmi={result.bmi} threshold={result.threshold} />
             <p className="text-sm text-text-3 font-medium text-center max-w-md mt-4">
               {result.threshold.advice}
             </p>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <MetricCard
              label="Your BMI"
              value={result.bmi.toString()}
              sub={result.category}
              accent={true}
              className={cn("border-l-4", result.threshold.borderColor)}
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

          {/* Asian Body Type Note */}
          {result.asianDiffers && (
            <m.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-amber-500/10 border border-amber-500/30 rounded-3xl p-6 flex gap-4 items-start"
            >
              <Info className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-amber-600 dark:text-amber-400 text-sm font-black uppercase tracking-widest">
                  Asian Body Type Context
                </p>
                <p className="text-text-3 text-sm mt-1 leading-relaxed">
                  The World Health Organization (WHO) recommends lower BMI thresholds for South Asian and 
                  East Asian populations. By these guidelines, your BMI of <strong>{result.bmi}</strong> falls in the <strong className="text-text uppercase tracking-tight underline decoration-amber-500/50">{result.asianCategory}</strong> range 
                  (overweight threshold: ≥23, obese: ≥27.5).
                </p>
              </div>
            </m.div>
          )}

          {/* Reference Table */}
          <div className="space-y-4">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-text-4 px-2">BMI Categories (WHO Standards)</h2>
            <div className="bg-surface border border-border rounded-3xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-bg/50 border-b border-border">
                      <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-text-4">Category</th>
                      <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-text-4">BMI Range</th>
                      <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-text-4">Asian BMI Range</th>
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
                          <td className="px-6 py-4 text-xs font-bold text-text-4 uppercase italic">
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
          </div>

          <p className="text-text-4 text-xs text-center uppercase tracking-[0.2em] mt-8">
            🔒 Your height and weight are never stored or transmitted. All calculations happen locally in your browser.
          </p>
        </m.div>
      )}

    </div>
  );
}
