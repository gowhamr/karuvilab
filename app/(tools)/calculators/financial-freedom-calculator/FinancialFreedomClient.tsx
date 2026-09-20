"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ToolInput } from '@/components/ui/ToolInput';
import { SliderField } from '@/components/ui/SliderField';
import { MetricCard } from '@/components/ui/MetricCard';
import { formatCurrency } from '@/src/lib/utils';
import { calculateFire } from '@/src/features/calculators/financial-freedom/fire-utils';
import { FireInputs, FireVariant } from '@/src/features/calculators/financial-freedom/models/assumptions';
import { FinancialEvent, FinancialEventCategory, FinancialEventType } from '@/src/features/calculators/financial-freedom/models/financial-event';
import { YearlyProjection } from '@/src/features/calculators/financial-freedom/models/projection-types';
import {
  HelpCircle,
  Plus,
  Trash2,
  Calendar,
  ShieldCheck,
  HeartPulse,
  Sliders,
  ChevronDown,
  ChevronUp,
  Flame,
  Anchor,
  Feather,
  Crown,
  Coffee,
  Sparkles,
  AlertCircle,
  TrendingUp,
  Info,
  ArrowRight,
  CheckCircle2,
  Wallet,
  Target,
  Clock,
  Compass
} from 'lucide-react';
import { MonteCarloPanel } from './MonteCarloPanel';

/**
 * Compact Indian Currency Formatter (Crores / Lakhs)
 */
function formatIndianCurrencyCompact(value: number): string {
  if (isNaN(value) || !isFinite(value)) return '₹0';
  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  if (abs >= 10000000) {
    const cr = abs / 10000000;
    return `${sign}₹${cr >= 100 ? cr.toFixed(1) : cr.toFixed(2)} Cr`;
  }
  if (abs >= 100000) {
    const l = abs / 100000;
    return `${sign}₹${l >= 100 ? l.toFixed(1) : l.toFixed(2)} L`;
  }
  if (abs >= 1000) {
    const k = abs / 1000;
    return `${sign}₹${k.toFixed(1)} k`;
  }
  return `${sign}₹${Math.round(abs).toLocaleString('en-IN')}`;
}

/**
 * Visual Trajectory Chart (Pure SVG)
 */
function FireTrajectoryChart({
  projections,
  targetCorpus,
  currentAge,
  targetAge,
  estimatedFreedomAge,
}: {
  projections: YearlyProjection[];
  targetCorpus: number;
  currentAge: number;
  targetAge: number;
  estimatedFreedomAge: number;
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!projections || projections.length === 0) return null;

  const width = 800;
  const height = 300;
  const paddingLeft = 75;
  const paddingRight = 35;
  const paddingTop = 30;
  const paddingBottom = 45;

  const innerW = width - paddingLeft - paddingRight;
  const innerH = height - paddingTop - paddingBottom;

  const minAge = projections[0]?.age ?? currentAge;
  const maxAge = projections[projections.length - 1]?.age ?? (currentAge + 40);

  const maxVal = Math.max(
    ...projections.map((p) => Math.max(p.endCorpus, p.targetCorpusNeeded, 0)),
    targetCorpus,
    100000
  ) * 1.15;

  const getX = (age: number) => {
    if (maxAge === minAge) return paddingLeft;
    return paddingLeft + ((age - minAge) / (maxAge - minAge)) * innerW;
  };

  const getY = (val: number) => {
    const clamped = Math.max(0, val);
    return paddingTop + innerH - (clamped / maxVal) * innerH;
  };

  // Build SVG path for corpus line
  const corpusPoints = projections.map((p) => ({
    x: getX(p.age),
    y: getY(p.endCorpus),
  }));

  const linePath = corpusPoints
    .map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`)
    .join(' ');
  const areaPath = `${linePath} L ${getX(maxAge).toFixed(1)} ${(paddingTop + innerH).toFixed(1)} L ${getX(minAge).toFixed(1)} ${(paddingTop + innerH).toFixed(1)} Z`;

  // Target corpus line path
  const targetPoints = projections.map((p) => ({
    x: getX(p.age),
    y: getY(p.targetCorpusNeeded > 0 ? p.targetCorpusNeeded : targetCorpus),
  }));
  const targetLinePath = targetPoints
    .map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`)
    .join(' ');

  // Y-axis ticks (4 levels)
  const yTicks = [0, 0.33, 0.66, 1].map((frac) => ({
    val: frac * maxVal,
    y: getY(frac * maxVal),
  }));

  // X-axis age ticks
  const ageStep = Math.max(5, Math.round((maxAge - minAge) / 6));
  const xTicks: number[] = [];
  for (let a = minAge; a <= maxAge; a += ageStep) {
    xTicks.push(a);
  }
  if (!xTicks.includes(maxAge)) xTicks.push(maxAge);

  const hoveredProj = hoveredIndex !== null ? projections[hoveredIndex] : null;

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const relX = (clientX / rect.width) * width;
    if (relX < paddingLeft || relX > width - paddingRight) {
      setHoveredIndex(null);
      return;
    }
    const ratio = (relX - paddingLeft) / innerW;
    const approxIndex = Math.min(
      projections.length - 1,
      Math.max(0, Math.round(ratio * (projections.length - 1)))
    );
    setHoveredIndex(approxIndex);
  };

  const handlePointerLeave = () => {
    setHoveredIndex(null);
  };

  const targetAgeX = getX(targetAge);
  const freedomAgeX = estimatedFreedomAge > 0 ? getX(estimatedFreedomAge) : -100;

  return (
    <div className="w-full bg-surface-2 p-4 sm:p-6 rounded-3xl border border-border space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-base sm:text-lg text-text-primary">
            Wealth Trajectory & Freedom Crossover
          </h3>
        </div>
        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-indigo-500 inline-block" />
            <span className="text-text-secondary">Projected Portfolio</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-amber-500 inline-block border-t border-dashed border-amber-500" />
            <span className="text-text-secondary">Target Needed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            <span className="text-text-secondary">Freedom Point</span>
          </div>
        </div>
      </div>

      {/* Responsive SVG Chart */}
      <div className="relative w-full overflow-hidden select-none">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto max-h-[340px] cursor-crosshair"
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          aria-label="Interactive chart showing projected corpus growth versus required target corpus across ages"
          role="img"
        >
          <defs>
            <linearGradient id="corpusGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
              <stop offset="80%" stopColor="#6366f1" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="60%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>

          {/* Background Phase Bands */}
          {targetAgeX > paddingLeft && (
            <rect
              x={paddingLeft}
              y={paddingTop}
              width={Math.min(innerW, targetAgeX - paddingLeft)}
              height={innerH}
              fill="currentColor"
              className="text-indigo-500/5 dark:text-indigo-500/10"
            />
          )}

          {/* Horizontal Gridlines & Y-Axis Labels */}
          {yTicks.map((tick, i) => (
            <g key={i}>
              <line
                x1={paddingLeft}
                y1={tick.y}
                x2={width - paddingRight}
                y2={tick.y}
                stroke="currentColor"
                className="text-border"
                strokeDasharray={i === 0 ? undefined : '3 3'}
                strokeWidth="1"
              />
              <text
                x={paddingLeft - 8}
                y={tick.y + 4}
                textAnchor="end"
                className="text-[10px] sm:text-[11px] fill-current text-text-muted font-mono"
              >
                {formatIndianCurrencyCompact(tick.val)}
              </text>
            </g>
          ))}

          {/* Area Fill */}
          <path d={areaPath} fill="url(#corpusGradient)" />

          {/* Target Line */}
          <path
            d={targetLinePath}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2"
            strokeDasharray="5 4"
            className="opacity-80"
          />

          {/* Portfolio Net Worth Curve */}
          <path
            d={linePath}
            fill="none"
            stroke="url(#lineGrad)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Target Age Vertical Line */}
          <line
            x1={targetAgeX}
            y1={paddingTop}
            x2={targetAgeX}
            y2={paddingTop + innerH}
            stroke="#6366f1"
            strokeWidth="1.5"
            strokeDasharray="4 3"
            opacity="0.75"
          />
          <text
            x={targetAgeX}
            y={paddingTop - 8}
            textAnchor="middle"
            className="text-[10px] font-bold fill-indigo-600 dark:fill-indigo-400"
          >
            Goal Age {targetAge}
          </text>

          {/* Freedom Age Intersection Marker */}
          {estimatedFreedomAge > 0 && freedomAgeX >= paddingLeft && (
            <g>
              <circle
                cx={freedomAgeX}
                cy={getY(projections.find((p) => p.age === estimatedFreedomAge)?.endCorpus ?? targetCorpus)}
                r="6"
                className="fill-emerald-500 stroke-white dark:stroke-surface-2"
                strokeWidth="2"
              />
              <circle
                cx={freedomAgeX}
                cy={getY(projections.find((p) => p.age === estimatedFreedomAge)?.endCorpus ?? targetCorpus)}
                r="10"
                className="stroke-emerald-500 fill-none opacity-40 animate-ping"
                strokeWidth="1.5"
              />
            </g>
          )}

          {/* Hover Pointer Line and Indicator */}
          {hoveredProj && (
            <g>
              <line
                x1={getX(hoveredProj.age)}
                y1={paddingTop}
                x2={getX(hoveredProj.age)}
                y2={paddingTop + innerH}
                stroke="currentColor"
                className="text-text-primary"
                strokeWidth="1.5"
                strokeDasharray="2 2"
              />
              <circle
                cx={getX(hoveredProj.age)}
                cy={getY(hoveredProj.endCorpus)}
                r="5"
                className="fill-indigo-600 stroke-white dark:stroke-surface"
                strokeWidth="2"
              />
            </g>
          )}

          {/* X-Axis Labels */}
          {xTicks.map((age) => (
            <g key={age}>
              <line
                x1={getX(age)}
                y1={paddingTop + innerH}
                x2={getX(age)}
                y2={paddingTop + innerH + 5}
                stroke="currentColor"
                className="text-border"
                strokeWidth="1"
              />
              <text
                x={getX(age)}
                y={paddingTop + innerH + 18}
                textAnchor="middle"
                className="text-[10px] sm:text-[11px] fill-current text-text-muted font-mono"
              >
                Age {age}
              </text>
            </g>
          ))}
        </svg>

        {/* Hover Inspector Tooltip Floating Card */}
        {hoveredProj && (
          <div
            className="absolute top-2 right-2 sm:right-6 pointer-events-none bg-surface/95 backdrop-blur-md p-2.5 sm:p-3 rounded-xl border border-border shadow-lg text-xs space-y-1 z-content max-w-[240px]"
          >
            <div className="flex items-center justify-between gap-2 border-b border-border/50 pb-1 font-bold text-text-primary">
              <span>Age {hoveredProj.age} ({hoveredProj.calendarYear})</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] uppercase font-bold ${
                  hoveredProj.phase === 'accumulation'
                    ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                    : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                }`}
              >
                {hoveredProj.phase}
              </span>
            </div>
            <div className="flex justify-between gap-3 text-text-secondary">
              <span>Portfolio:</span>
              <span className="font-bold text-text-primary">
                {formatIndianCurrencyCompact(hoveredProj.endCorpus)}
              </span>
            </div>
            <div className="flex justify-between gap-3 text-text-secondary">
              <span>Annual Outflow:</span>
              <span className="text-text-primary">
                {formatIndianCurrencyCompact(
                  hoveredProj.phase === 'retirement'
                    ? hoveredProj.annualWithdrawal
                    : hoveredProj.annualExpenses
                )}
              </span>
            </div>
            {hoveredProj.isFinanciallyFree && (
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 pt-0.5">
                <CheckCircle2 size={12} />
                Financially Independent
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between text-xs text-text-muted pt-1">
        <p>
          Hover or tap anywhere along the curve to inspect portfolio balance and living expenses at each age.
        </p>
        <span className="text-[11px]">
          Phase 1: Accumulation (Investing) • Phase 2: Independence (Withdrawal)
        </span>
      </div>
    </div>
  );
}

/**
 * Variants Configuration
 */
const FIRE_VARIANTS_INFO: {
  id: FireVariant;
  name: string;
  badge: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  tagline: string;
  description: string;
}[] = [
  {
    id: 'regular',
    name: 'Regular FIRE',
    badge: 'Standard (25×)',
    icon: Flame,
    tagline: '100% current lifestyle',
    description: 'The standard FIRE benchmark. Covers all living expenses through portfolio withdrawals without ever needing to work again.',
  },
  {
    id: 'coast',
    name: 'Coast FIRE',
    badge: 'Compound Early',
    icon: Anchor,
    tagline: 'Zero SIPs after target age',
    description: 'Save hard early, then stop saving entirely. Your existing corpus compounds untouched to fully fund your traditional retirement.',
  },
  {
    id: 'lean',
    name: 'Lean FIRE',
    badge: 'Frugal (70%)',
    icon: Feather,
    tagline: 'Minimalist living & rapid exit',
    description: 'Optimized for frugal living. Covers only essential living expenses, allowing you to achieve financial freedom years earlier.',
  },
  {
    id: 'fat',
    name: 'Fat FIRE',
    badge: 'Luxury (150%)',
    icon: Crown,
    tagline: 'Upgrades & travel buffer',
    description: 'Abundant retirement with extra room for luxury, travel, healthcare buffers, and generous lifestyle upgrades.',
  },
  {
    id: 'barista',
    name: 'Barista FIRE',
    badge: 'Semi-Retired',
    icon: Coffee,
    tagline: 'Light part-time income offset',
    description: 'Combine investments with light part-time, freelancing, or consulting earnings, drastically cutting the required corpus.',
  },
];

export default function FinancialFreedomClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse initial events from URL if available
  const initialEvents: FinancialEvent[] = useMemo(() => {
    const rawEvents = searchParams.get('events');
    if (!rawEvents) return [];
    try {
      return JSON.parse(decodeURIComponent(rawEvents));
    } catch {
      return [];
    }
  }, [searchParams]);

  // Parse initial state from URL or use defaults
  const [inputs, setInputs] = useState<FireInputs>(() => ({
    currentAge: parseInt(searchParams.get('age') || '25', 10),
    targetAge: parseInt(searchParams.get('target_age') || '45', 10),
    traditionalRetirementAge: parseInt(searchParams.get('trad_age') || '65', 10),
    longevityAge: parseInt(searchParams.get('longevity') || '85', 10),
    currentIncome: parseInt(searchParams.get('income') || '50000', 10),
    currentExpenses: parseInt(searchParams.get('expenses') || '30000', 10),
    currentMedicalExpenses: parseInt(searchParams.get('med_exp') || '0', 10),
    currentCorpus: parseInt(searchParams.get('savings') || '500000', 10),
    monthlySip: parseInt(searchParams.get('sip') || '10000', 10),
    expectedReturnRate: parseFloat(searchParams.get('return') || '12'),
    retirementReturnRate: parseFloat(searchParams.get('ret_return') || '8'),
    expectedInflationRate: parseFloat(searchParams.get('inflation') || '6'),
    healthcareInflationRate: parseFloat(searchParams.get('med_inf') || '10'),
    incomeGrowthRate: parseFloat(searchParams.get('income_growth') || '10'),
    expenseGrowthRate: parseFloat(searchParams.get('expense_growth') || '6'),
    withdrawalRate: parseFloat(searchParams.get('withdrawal') || '4'),
    fireVariant: (searchParams.get('variant') || 'regular') as FireVariant,
    leanMultiplier: parseFloat(searchParams.get('lean') || '0.7'),
    fatMultiplier: parseFloat(searchParams.get('fat') || '1.5'),
    baristaMonthlyIncome: parseInt(searchParams.get('barista') || '15000', 10),
    events: initialEvents,
  }));

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showMathDetails, setShowMathDetails] = useState(false);
  const [tableMode, setTableMode] = useState<'milestones' | 'all'>('milestones');

  // Event form modal / inline state
  const [eventTitle, setEventTitle] = useState('');
  const [eventAge, setEventAge] = useState(35);
  const [eventAmount, setEventAmount] = useState(500000);
  const [eventType, setEventType] = useState<FinancialEventType>('outflow');
  const [eventCategory, setEventCategory] = useState<FinancialEventCategory>('property');
  const [eventRecurring, setEventRecurring] = useState(false);
  const [eventDuration, setEventDuration] = useState(1);
  const [eventInflation, setEventInflation] = useState(true);

  // Update URL on debounce
  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams();
      params.set('age', inputs.currentAge.toString());
      params.set('target_age', inputs.targetAge.toString());
      params.set('income', inputs.currentIncome.toString());
      params.set('expenses', inputs.currentExpenses.toString());
      if ((inputs.currentMedicalExpenses ?? 0) > 0) {
        params.set('med_exp', inputs.currentMedicalExpenses!.toString());
      }
      params.set('savings', inputs.currentCorpus.toString());
      params.set('sip', inputs.monthlySip.toString());
      params.set('return', inputs.expectedReturnRate.toString());
      if (inputs.retirementReturnRate !== undefined) {
        params.set('ret_return', inputs.retirementReturnRate.toString());
      }
      params.set('inflation', inputs.expectedInflationRate.toString());
      if (inputs.healthcareInflationRate !== undefined) {
        params.set('med_inf', inputs.healthcareInflationRate.toString());
      }
      if (inputs.longevityAge !== undefined) {
        params.set('longevity', inputs.longevityAge.toString());
      }
      params.set('income_growth', inputs.incomeGrowthRate.toString());
      params.set('expenseGrowthRate', inputs.expenseGrowthRate.toString());
      params.set('withdrawal', inputs.withdrawalRate.toString());
      params.set('variant', inputs.fireVariant);

      if (inputs.fireVariant === 'lean') params.set('lean', (inputs.leanMultiplier ?? 0.7).toString());
      if (inputs.fireVariant === 'fat') params.set('fat', (inputs.fatMultiplier ?? 1.5).toString());
      if (inputs.fireVariant === 'coast') params.set('trad_age', inputs.traditionalRetirementAge.toString());
      if (inputs.fireVariant === 'barista') params.set('barista', (inputs.baristaMonthlyIncome ?? 15000).toString());

      if (inputs.events && inputs.events.length > 0) {
        params.set('events', encodeURIComponent(JSON.stringify(inputs.events)));
      }

      router.replace(`?${params.toString()}`, { scroll: false });
    }, 500);
    return () => clearTimeout(timeout);
  }, [inputs, router]);

  const handleChange = useCallback((key: keyof FireInputs, value: unknown) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleAddEvent = useCallback(() => {
    if (!eventTitle.trim() || eventAmount <= 0) return;
    const newEvent: FinancialEvent = {
      id: 'event_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      title: eventTitle.trim(),
      yearOrAge: eventAge,
      amount: eventAmount,
      type: eventType,
      category: eventCategory,
      isRecurring: eventRecurring,
      durationYears: eventRecurring ? Math.max(1, eventDuration) : 1,
      inflationAdjusted: eventInflation,
    };

    setInputs((prev) => ({
      ...prev,
      events: [...(prev.events || []), newEvent],
    }));

    // Reset event form
    setEventTitle('');
    setEventAmount(500000);
    setEventRecurring(false);
  }, [eventTitle, eventAge, eventAmount, eventType, eventCategory, eventRecurring, eventDuration, eventInflation]);

  const handleRemoveEvent = useCallback((id: string) => {
    setInputs((prev) => ({
      ...prev,
      events: (prev.events || []).filter((e) => e.id !== id),
    }));
  }, []);

  // Compute deterministic results via pure engine
  const results = useMemo(() => calculateFire(inputs), [inputs]);

  // Derived status & narrative helpers
  const isOnTrack = results.estimatedFreedomAge !== -1 && results.estimatedFreedomAge <= inputs.targetAge;
  const fundingGap = Math.max(0, results.requiredMonthlySip - inputs.monthlySip);
  const fundedPercent = Math.min(100, Math.max(0, Math.round(results.freedomRatio)));
  const currentVariantInfo = FIRE_VARIANTS_INFO.find((v) => v.id === inputs.fireVariant) ?? FIRE_VARIANTS_INFO[0]!;

  return (
    <div className="space-y-6 sm:space-y-8 min-w-0 w-full">
      {/* 1. FIRE Variants Visual Selector Cards */}
      <section className="space-y-2" aria-label="FIRE Strategy Variants">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
            <Compass size={14} className="text-primary" />
            Choose Your Financial Freedom Strategy
          </label>
          <span className="text-xs text-text-muted hidden sm:inline">
            Each style changes your target budget and compounding model
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {FIRE_VARIANTS_INFO.map((variant) => {
            const Icon = variant.icon;
            const isSelected = inputs.fireVariant === variant.id;
            return (
              <button
                key={variant.id}
                type="button"
                onClick={() => handleChange('fireVariant', variant.id)}
                className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-primary/10 border-primary shadow-sm ring-2 ring-primary/20'
                    : 'bg-surface-2 border-border hover:border-primary/40 hover:bg-surface-3'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                        isSelected ? 'bg-primary text-white' : 'bg-surface text-text-secondary'
                      }`}
                    >
                      <Icon size={15} />
                    </div>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        isSelected
                          ? 'bg-primary text-white'
                          : 'bg-surface text-text-muted'
                      }`}
                    >
                      {variant.badge}
                    </span>
                  </div>
                  <div className="font-bold text-xs sm:text-sm text-text-primary leading-snug">
                    {variant.name}
                  </div>
                  <p className="text-[11px] text-text-muted mt-0.5 line-clamp-2 leading-tight">
                    {variant.tagline}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. Executive Freedom Verdict Card (Am I On Track?) */}
      <section
        className={`p-4 sm:p-6 rounded-3xl border transition-all ${
          isOnTrack
            ? 'bg-emerald-500/10 border-emerald-500/30 dark:bg-emerald-950/20'
            : 'bg-amber-500/10 border-amber-500/30 dark:bg-amber-950/20'
        }`}
        aria-label="Financial Freedom Verdict Summary"
      >
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2">
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                  isOnTrack
                    ? 'bg-emerald-500 text-white'
                    : 'bg-amber-500 text-slate-950'
                }`}
              >
                {isOnTrack ? (
                  <>
                    <CheckCircle2 size={13} />
                    On Track For Early Freedom
                  </>
                ) : (
                  <>
                    <AlertCircle size={13} />
                    Funding Gap Detected
                  </>
                )}
              </span>
              <span className="text-xs text-text-muted">
                {currentVariantInfo.name} Plan
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight">
              {isOnTrack
                ? `You're set to reach Financial Freedom at Age ${results.estimatedFreedomAge}!`
                : `₹${formatIndianCurrencyCompact(Math.abs(results.shortfallOrSurplus))} Shortfall at Age ${inputs.targetAge}`}
            </h2>

            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              {isOnTrack ? (
                <>
                  With your current monthly investment of{' '}
                  <strong className="text-text-primary font-bold">{formatCurrency(inputs.monthlySip)}</strong> and
                  existing corpus of{' '}
                  <strong className="text-text-primary font-bold">{formatIndianCurrencyCompact(inputs.currentCorpus)}</strong>,
                  your portfolio will cross your required goal of{' '}
                  <strong className="text-text-primary font-bold">{formatIndianCurrencyCompact(results.targetCorpus)}</strong> in{' '}
                  <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{results.yearsToFreedom} years</strong>{' '}
                  ({inputs.targetAge - results.estimatedFreedomAge > 0
                    ? `${inputs.targetAge - results.estimatedFreedomAge} years ahead of your Age ${inputs.targetAge} goal!`
                    : `right on time at Age ${inputs.targetAge}!`})
                </>
              ) : (
                <>
                  To retire at Age <strong className="text-text-primary font-bold">{inputs.targetAge}</strong>, you need a monthly SIP of{' '}
                  <strong className="text-text-primary font-bold">{formatCurrency(results.requiredMonthlySip)}</strong>.
                  You currently save <strong className="text-text-primary font-bold">{formatCurrency(inputs.monthlySip)}/mo</strong>,
                  leaving a gap of <strong className="text-amber-600 dark:text-amber-400 font-bold">+{formatCurrency(fundingGap)}/mo</strong>.{' '}
                  {results.estimatedFreedomAge !== -1 ? (
                    <>
                      At your current pace, you will reach Financial Freedom at{' '}
                      <strong className="text-text-primary font-bold">Age {results.estimatedFreedomAge}</strong>{' '}
                      ({results.estimatedFreedomAge - inputs.targetAge} years later than your goal).
                    </>
                  ) : (
                    'Increase your monthly SIP or extend your timeline to close the gap.'
                  )}
                </>
              )}
            </p>
          </div>

          {/* Quick Stat Pill */}
          <div className="bg-surface/80 border border-border p-3.5 rounded-2xl shrink-0 min-w-[190px] space-y-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
              Progress to Target
            </div>
            <div className="text-2xl font-black text-text-primary">
              {fundedPercent}%
            </div>
            <div className="w-full bg-surface-3 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isOnTrack ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
                style={{ width: `${Math.min(100, fundedPercent)}%` }}
              />
            </div>
            <div className="text-[10px] text-text-muted flex justify-between pt-0.5">
              <span>Saved: {formatIndianCurrencyCompact(inputs.currentCorpus)}</span>
              <span>Goal: {formatIndianCurrencyCompact(results.targetCorpus)}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Primary Metrics Cards (Preserves all QA/Audit dataResultField hooks) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" aria-label="Financial Freedom Results">
        <MetricCard
          label={inputs.fireVariant === 'coast' ? 'Target Coast Corpus' : 'Target FIRE Corpus'}
          value={formatCurrency(results.targetCorpus)}
          dataResultField="target-corpus"
          accent
          className="sm:col-span-2"
          sub={`${formatIndianCurrencyCompact(results.targetCorpus)} • ${formatCurrency(Math.round(results.targetMonthlyExpense))}/mo at Age ${inputs.targetAge}`}
        />
        <MetricCard
          label="Required Monthly SIP"
          value={formatCurrency(results.requiredMonthlySip)}
          dataResultField="required-sip"
          sub={
            inputs.monthlySip >= results.requiredMonthlySip
              ? `On track! (Current: ${formatCurrency(inputs.monthlySip)}/mo)`
              : `Gap: +${formatCurrency(fundingGap)}/mo (Current: ${formatCurrency(inputs.monthlySip)})`
          }
        />
        <MetricCard
          label="Freedom Age"
          value={results.estimatedFreedomAge !== -1 ? `Age ${results.estimatedFreedomAge}` : 'Not Reached'}
          dataResultField="freedom-age"
          sub={
            results.estimatedFreedomAge !== -1
              ? `In ${results.yearsToFreedom} years (${Math.round(results.freedomRatio)}% funded)`
              : `Increase SIP by ${formatCurrency(fundingGap)}/mo`
          }
        />
      </section>

      {/* 4. Actionable Levers to Bridge Gap or Accelerate Freedom */}
      {!isOnTrack && fundingGap > 0 ? (
        <section className="bg-surface-2 p-4 sm:p-6 rounded-3xl border border-border space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm sm:text-base text-text-primary flex items-center gap-2">
              <Sparkles size={16} className="text-amber-500" />
              3 Ways to Bridge Your Funding Gap
            </h3>
            <span className="text-xs text-text-muted hidden sm:inline">Click any lever to apply it instantly</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Lever 1: Match SIP */}
            <div className="p-4 rounded-2xl bg-surface border border-border flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Option 1: Boost Savings
                </span>
                <h4 className="font-bold text-sm text-text-primary mt-1">
                  +{formatCurrency(fundingGap)}/mo SIP
                </h4>
                <p className="text-xs text-text-secondary mt-1">
                  Increasing your monthly investment to {formatCurrency(results.requiredMonthlySip)} guarantees hitting your target right at Age {inputs.targetAge}.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleChange('monthlySip', results.requiredMonthlySip)}
                className="w-full py-2 px-3 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                Set SIP to {formatCurrency(results.requiredMonthlySip)}
                <ArrowRight size={13} />
              </button>
            </div>

            {/* Lever 2: Trim Expenses by 10% */}
            <div className="p-4 rounded-2xl bg-surface border border-border flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Option 2: Cut Expenses by 10%
                </span>
                <h4 className="font-bold text-sm text-text-primary mt-1">
                  Save {formatCurrency(Math.round(inputs.currentExpenses * 0.1))}/mo Today
                </h4>
                <p className="text-xs text-text-secondary mt-1">
                  Spending 10% less lowers your retirement target by {formatIndianCurrencyCompact(results.targetCorpus * 0.1)} because you need less in retirement.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleChange('currentExpenses', Math.round(inputs.currentExpenses * 0.9))}
                className="w-full py-2 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                Reduce Expenses to {formatCurrency(Math.round(inputs.currentExpenses * 0.9))}
                <ArrowRight size={13} />
              </button>
            </div>

            {/* Lever 3: Delay Horizon by 2-3 Years */}
            <div className="p-4 rounded-2xl bg-surface border border-border flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Option 3: Extend Horizon
                </span>
                <h4 className="font-bold text-sm text-text-primary mt-1">
                  Retire at Age {inputs.targetAge + 3}
                </h4>
                <p className="text-xs text-text-secondary mt-1">
                  Giving your portfolio 3 extra compounding years drastically reduces the required SIP without changing your lifestyle today.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleChange('targetAge', inputs.targetAge + 3)}
                className="w-full py-2 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                Set Target to Age {inputs.targetAge + 3}
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </section>
      ) : null}

      {/* 5. Transparent Math Breakdown: Why is my target corpus ₹X.XX Cr? */}
      <section className="bg-surface-2 p-4 sm:p-6 rounded-3xl border border-border space-y-4">
        <button
          type="button"
          onClick={() => setShowMathDetails((prev) => !prev)}
          className="w-full flex items-center justify-between font-bold text-sm sm:text-base text-text-primary hover:text-primary transition-colors text-left"
        >
          <div className="flex items-center gap-2">
            <Info size={18} className="text-primary shrink-0" />
            <span>
              How is your {formatIndianCurrencyCompact(results.targetCorpus)} Target Corpus Calculated?
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
              The {Math.round(100 / inputs.withdrawalRate)}× Rule
            </span>
            {showMathDetails ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
        </button>

        {showMathDetails && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="p-3.5 rounded-2xl bg-surface border border-border space-y-1">
              <span className="text-text-muted font-bold uppercase text-[10px] tracking-wider">
                Step 1: Current Living Expenses
              </span>
              <p className="font-bold text-base text-text-primary">
                {formatCurrency(inputs.currentExpenses)} / mo
              </p>
              <p className="text-text-secondary leading-normal">
                {formatCurrency(inputs.currentExpenses * 12)} per year at current prices today.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-surface border border-border space-y-1">
              <span className="text-text-muted font-bold uppercase text-[10px] tracking-wider">
                Step 2: Inflation Over {inputs.targetAge - inputs.currentAge} Yrs (@ {inputs.expectedInflationRate}%)
              </span>
              <p className="font-bold text-base text-text-primary">
                {formatCurrency(Math.round(results.targetMonthlyExpense))} / mo
              </p>
              <p className="text-text-secondary leading-normal">
                By Age {inputs.targetAge}, inflation raises living costs to {formatCurrency(Math.round(results.targetMonthlyExpense * 12))}/year for the same standard of living.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-surface border border-border space-y-1">
              <span className="text-text-muted font-bold uppercase text-[10px] tracking-wider">
                Step 3: Safe Withdrawal (@ {inputs.withdrawalRate}%)
              </span>
              <p className="font-bold text-base text-primary">
                {formatIndianCurrencyCompact(results.targetCorpus)}
              </p>
              <p className="text-text-secondary leading-normal">
                Annual expense ÷ {inputs.withdrawalRate}% (or {Math.round(100 / inputs.withdrawalRate)}× annual cost) gives exact corpus of {formatCurrency(Math.round(results.targetCorpus))}.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* 6. Interactive Visual Trajectory Chart */}
      <FireTrajectoryChart
        projections={results.projections}
        targetCorpus={results.targetCorpus}
        currentAge={inputs.currentAge}
        targetAge={inputs.targetAge}
        estimatedFreedomAge={results.estimatedFreedomAge}
      />

      {/* 7. Variant-Specific Settings Panel (when non-regular mode selected) */}
      {inputs.fireVariant !== 'regular' && (
        <section className="bg-primary/5 border border-primary/20 p-4 sm:p-6 rounded-3xl min-w-0 w-full space-y-4">
          <h3 className="font-bold text-base sm:text-lg text-primary flex items-center gap-2">
            <HelpCircle size={18} />
            {currentVariantInfo.name} Customizations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {inputs.fireVariant === 'lean' && (
              <SliderField
                id="lean-expense"
                label="Lean Expense Multiplier (x)"
                value={inputs.leanMultiplier ?? 0.7}
                onChange={(val) => handleChange('leanMultiplier', val)}
                min={0.3}
                max={0.9}
                step={0.05}
              />
            )}
            {inputs.fireVariant === 'fat' && (
              <SliderField
                id="fat-expense"
                label="Fat Expense Multiplier (x)"
                value={inputs.fatMultiplier ?? 1.5}
                onChange={(val) => handleChange('fatMultiplier', val)}
                min={1.1}
                max={3.0}
                step={0.1}
              />
            )}
            {inputs.fireVariant === 'coast' && (
              <SliderField
                id="trad-retire-age"
                label="Traditional Retirement Age"
                value={inputs.traditionalRetirementAge}
                onChange={(val) => handleChange('traditionalRetirementAge', val)}
                min={inputs.targetAge}
                max={90}
                step={1}
              />
            )}
            {inputs.fireVariant === 'barista' && (
              <ToolInput
                id="expected-monthly-part-time-income"
                label="Expected Monthly Part-Time Income"
                value={(inputs.baristaMonthlyIncome ?? 15000).toString()}
                onChange={(val) => handleChange('baristaMonthlyIncome', parseInt(val, 10) || 0)}
                type="number"
              />
            )}
          </div>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            {inputs.fireVariant === 'lean' &&
              `Lean FIRE assumes a lean budget of ${Math.round((inputs.leanMultiplier ?? 0.7) * 100)}% of standard expenses during retirement.`}
            {inputs.fireVariant === 'fat' &&
              `Fat FIRE provides an expansive retirement budget of ${Math.round((inputs.fatMultiplier ?? 1.5) * 100)}% of current expenses.`}
            {inputs.fireVariant === 'coast' &&
              `Coast FIRE means accumulating ${formatCurrency(results.targetCorpus)} (${formatIndianCurrencyCompact(results.targetCorpus)}) by age ${inputs.targetAge}, then stopping SIPs and letting your corpus compound until age ${inputs.traditionalRetirementAge}.`}
            {inputs.fireVariant === 'barista' &&
              `Barista FIRE combines portfolio withdrawals with part-time active earnings of ${formatCurrency(inputs.baristaMonthlyIncome ?? 15000)}/month to drastically reduce the required savings.`}
          </p>
        </section>
      )}

      {/* 8. Core Inputs Form with Smart Helper Badges & Presets */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-surface-2 p-4 sm:p-6 rounded-3xl min-w-0 w-full border border-border">
        {/* Column 1: Timeline & Savings */}
        <div className="space-y-5">
          <h3 className="font-bold text-base sm:text-lg text-text-primary mb-2 flex items-center gap-2">
            <Calendar size={18} className="text-primary" />
            Timeline & Contributions
          </h3>

          <SliderField
            id="current-age"
            label="Current Age"
            value={inputs.currentAge}
            onChange={(val) => handleChange('currentAge', val)}
            min={18}
            max={75}
          />

          <SliderField
            id="target-fire-age"
            label={inputs.fireVariant === 'coast' ? 'Age to Stop Investing (Coast)' : 'Target FIRE Age'}
            value={inputs.targetAge}
            onChange={(val) => handleChange('targetAge', val)}
            min={inputs.currentAge + 1}
            max={85}
          />

          <div className="space-y-1">
            <ToolInput
              id="current-savings--corpus-"
              label="Current Savings & Invested Corpus"
              value={inputs.currentCorpus.toString()}
              onChange={(val) => handleChange('currentCorpus', parseInt(val, 10) || 0)}
              type="number"
            />
            <div className="flex justify-between items-center text-[11px] text-text-muted px-1">
              <span>Includes Mutual Funds, EPF, PPF, Stocks, FDs</span>
              <span className="font-bold text-primary">
                ≈ {formatIndianCurrencyCompact(inputs.currentCorpus)}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <ToolInput
              id="current-monthly-sip"
              label="Current Monthly SIP / Investment"
              value={inputs.monthlySip.toString()}
              onChange={(val) => handleChange('monthlySip', parseInt(val, 10) || 0)}
              type="number"
            />
            <div className="flex justify-between items-center text-[11px] text-text-muted px-1">
              <span>Annual investment rate</span>
              <span className="font-bold text-primary">
                ≈ {formatCurrency(inputs.monthlySip * 12)} / year ({formatIndianCurrencyCompact(inputs.monthlySip * 12)})
              </span>
            </div>
          </div>
        </div>

        {/* Column 2: Cash Flow & Market Assumptions */}
        <div className="space-y-5">
          <h3 className="font-bold text-base sm:text-lg text-text-primary mb-2 flex items-center gap-2">
            <ShieldCheck size={18} className="text-primary" />
            Living Costs & Market Rates
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <ToolInput
                id="monthly-income"
                label="Monthly Income"
                value={inputs.currentIncome.toString()}
                onChange={(val) => handleChange('currentIncome', parseInt(val, 10) || 0)}
                type="number"
              />
              <span className="text-[10px] text-text-muted px-1 block">
                ≈ {formatIndianCurrencyCompact(inputs.currentIncome * 12)} / year
              </span>
            </div>
            <div className="space-y-1">
              <ToolInput
                id="monthly-expenses"
                label="Monthly Living Expenses"
                value={inputs.currentExpenses.toString()}
                onChange={(val) => handleChange('currentExpenses', parseInt(val, 10) || 0)}
                type="number"
              />
              <span className="text-[10px] text-text-muted px-1 block">
                ≈ {formatIndianCurrencyCompact(inputs.currentExpenses * 12)} / year
              </span>
            </div>
          </div>

          {/* SWR Slider with Presets */}
          <div className="space-y-2">
            <SliderField
              id="withdrawal-rate"
              label="Safe Withdrawal Rate (SWR %)"
              value={inputs.withdrawalRate}
              onChange={(val) => handleChange('withdrawalRate', val)}
              min={2.5}
              max={5.0}
              step={0.25}
            />
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-text-muted">Presets:</span>
              {[
                { label: '3.5% (Conservative)', val: 3.5 },
                { label: '4.0% (Standard 25×)', val: 4.0 },
              ].map((p) => (
                <button
                  key={p.val}
                  type="button"
                  onClick={() => handleChange('withdrawalRate', p.val)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-medium transition-colors ${
                    inputs.withdrawalRate === p.val
                      ? 'bg-primary text-white'
                      : 'bg-surface text-text-secondary hover:bg-surface-3'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Return & Inflation Rates with Presets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <SliderField
                id="return-rate"
                label="Expected Return (%)"
                value={inputs.expectedReturnRate}
                onChange={(val) => handleChange('expectedReturnRate', val)}
                min={4}
                max={20}
                step={0.5}
              />
              <div className="flex items-center gap-1">
                {[
                  { label: '10%', val: 10 },
                  { label: '12% (MF)', val: 12 },
                  { label: '14%', val: 14 },
                ].map((p) => (
                  <button
                    key={p.val}
                    type="button"
                    onClick={() => handleChange('expectedReturnRate', p.val)}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-medium transition-colors ${
                      inputs.expectedReturnRate === p.val
                        ? 'bg-primary text-white'
                        : 'bg-surface text-text-secondary hover:bg-surface-3'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <SliderField
                id="inflation-rate"
                label="General Inflation (%)"
                value={inputs.expectedInflationRate}
                onChange={(val) => handleChange('expectedInflationRate', val)}
                min={2}
                max={12}
                step={0.5}
              />
              <div className="flex items-center gap-1">
                {[
                  { label: '5%', val: 5 },
                  { label: '6% (Avg)', val: 6 },
                  { label: '7%', val: 7 },
                ].map((p) => (
                  <button
                    key={p.val}
                    type="button"
                    onClick={() => handleChange('expectedInflationRate', p.val)}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-medium transition-colors ${
                      inputs.expectedInflationRate === p.val
                        ? 'bg-primary text-white'
                        : 'bg-surface text-text-secondary hover:bg-surface-3'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Advanced Settings Accordion: Healthcare, Dual Returns, Longevity */}
      <section className="bg-surface-2 rounded-3xl border border-border overflow-hidden">
        <button
          type="button"
          onClick={() => setShowAdvanced((prev) => !prev)}
          className="w-full p-4 sm:p-5 flex items-center justify-between font-bold text-sm sm:text-base text-text-primary hover:bg-surface-3 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Sliders size={18} className="text-primary" />
            <span>Advanced Settings (Dual-Phase Returns, Healthcare Inflation, Longevity Horizon)</span>
          </div>
          {showAdvanced ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {showAdvanced && (
          <div className="p-4 sm:p-6 border-t border-border space-y-6 bg-surface">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-sm text-text-primary flex items-center gap-2">
                  <HeartPulse size={16} className="text-rose-500" />
                  Healthcare & Medical Inflation
                </h4>
                <ToolInput
                  id="monthly-medical-expenses"
                  label="Dedicated Monthly Healthcare (Optional)"
                  value={(inputs.currentMedicalExpenses ?? 0).toString()}
                  onChange={(val) => handleChange('currentMedicalExpenses', parseInt(val, 10) || 0)}
                  type="number"
                />
                <SliderField
                  id="healthcare-inflation-rate"
                  label="Medical Inflation Rate (%)"
                  value={inputs.healthcareInflationRate ?? 10}
                  onChange={(val) => handleChange('healthcareInflationRate', val)}
                  min={4}
                  max={18}
                  step={0.5}
                />
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-sm text-text-primary flex items-center gap-2">
                  <Calendar size={16} className="text-indigo-600 dark:text-indigo-400" />
                  Dual-Phase Return & Longevity
                </h4>
                <SliderField
                  id="retirement-return-rate"
                  label="Retirement Phase Return (%)"
                  value={inputs.retirementReturnRate ?? 8}
                  onChange={(val) => handleChange('retirementReturnRate', val)}
                  min={3}
                  max={15}
                  step={0.5}
                />
                <SliderField
                  id="longevity-age"
                  label="Longevity Horizon Age"
                  value={inputs.longevityAge ?? 85}
                  onChange={(val) => handleChange('longevityAge', val)}
                  min={inputs.targetAge + 5}
                  max={105}
                  step={1}
                />
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 10. Life Milestones & Cash Flow Injections */}
      <section className="bg-surface-2 p-4 sm:p-6 rounded-3xl min-w-0 w-full border border-border space-y-4">
        <div>
          <h3 className="font-bold text-base sm:text-lg text-text-primary flex items-center gap-2">
            <Calendar size={18} className="text-primary" />
            Life Milestones & Cash Flow Events
          </h3>
          <p className="text-xs text-text-secondary mt-0.5">
            Plan one-time or recurring inflows (windfalls, ESOPs) and outflows (house down payments, children education, marriage).
          </p>
        </div>

        {/* Existing Events List */}
        {inputs.events && inputs.events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {inputs.events.map((evt) => (
              <div
                key={evt.id}
                className="p-3.5 rounded-2xl bg-surface border border-border/80 flex items-start justify-between gap-2 text-xs"
              >
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                        evt.type === 'inflow'
                          ? 'bg-success/20 text-success'
                          : 'bg-rose-500/20 text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {evt.type === 'inflow' ? '+ Inflow' : '- Outflow'}
                    </span>
                    <span className="text-text-muted">
                      Age {evt.yearOrAge}
                      {evt.isRecurring ? `–${evt.yearOrAge + (evt.durationYears || 1) - 1}` : ''}
                    </span>
                  </div>
                  <div className="font-bold text-text-primary text-sm">{evt.title}</div>
                  <div className="text-text-secondary mt-0.5">
                    {formatCurrency(evt.amount)}{' '}
                    {evt.isRecurring ? `× ${evt.durationYears} yrs` : ''}{' '}
                    {evt.inflationAdjusted ? '(Inflation-linked)' : '(Fixed)'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveEvent(evt.id)}
                  aria-label={`Remove ${evt.title}`}
                  className="p-1.5 text-text-muted hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-surface/50 border border-dashed border-border text-center text-xs text-text-secondary">
            No milestones added. Add planned windfalls, asset sales, education costs, or property purchases below.
          </div>
        )}

        {/* Add Event Form */}
        <div className="p-4 rounded-2xl bg-surface border border-border space-y-3">
          <h4 className="font-bold text-xs uppercase tracking-wide text-text-secondary">
            Add New Life Milestone
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <ToolInput
              id="event-title"
              label="Event Name"
              value={eventTitle}
              onChange={setEventTitle}
              placeholder="e.g. House Down Payment"
            />
            <ToolInput
              id="event-amount"
              label="Amount"
              value={eventAmount.toString()}
              onChange={(val) => setEventAmount(parseInt(val, 10) || 0)}
              type="number"
            />
            <SliderField
              id="event-age"
              label="At Age"
              value={eventAge}
              onChange={setEventAge}
              min={inputs.currentAge}
              max={inputs.longevityAge ?? 85}
            />
            <div className="space-y-1">
              <label htmlFor="event-type-select" className="text-xs font-semibold text-text-primary">
                Type
              </label>
              <select
                id="event-type-select"
                value={eventType}
                onChange={(e) => setEventType(e.target.value as FinancialEventType)}
                className="w-full px-3 py-2 rounded-xl bg-surface-2 border border-border text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="outflow">Outflow (Expense / Goal)</option>
                <option value="inflow">Inflow (Windfall / Sale)</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex flex-wrap items-center gap-4 text-xs text-text-secondary">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={eventInflation}
                  onChange={(e) => setEventInflation(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary"
                />
                <span>Inflation-adjusted amount</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={eventRecurring}
                  onChange={(e) => setEventRecurring(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary"
                />
                <span>Recurring multi-year</span>
              </label>
              {eventRecurring && (
                <div className="flex items-center gap-1">
                  <span>Duration:</span>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={eventDuration}
                    onChange={(e) => setEventDuration(parseInt(e.target.value, 10) || 1)}
                    className="w-16 px-2 py-1 rounded-lg bg-surface-2 border border-border text-text-primary text-xs"
                  />
                  <span>years</span>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleAddEvent}
              disabled={!eventTitle.trim() || eventAmount <= 0}
              className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold flex items-center gap-1.5 hover:bg-primary/90 disabled:opacity-50 transition-all"
            >
              <Plus size={14} />
              Add Event
            </button>
          </div>
        </div>
      </section>

      {/* 11. Year-by-Year Cash Flow Projection Table */}
      <section className="bg-surface-2 p-4 sm:p-6 rounded-3xl min-w-0 w-full border border-border space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-base sm:text-lg text-text-primary">
              Year-by-Year Projection Table
            </h3>
            <p className="text-xs text-text-secondary">
              Deterministic timeline of income, expenses, contributions, withdrawals, and portfolio balance.
            </p>
          </div>
          <div className="flex items-center gap-1 bg-surface p-1 rounded-xl border border-border">
            <button
              type="button"
              onClick={() => setTableMode('milestones')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                tableMode === 'milestones'
                  ? 'bg-primary text-white'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              5-Year Steps
            </button>
            <button
              type="button"
              onClick={() => setTableMode('all')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                tableMode === 'all'
                  ? 'bg-primary text-white'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              All Years
            </button>
          </div>
        </div>

        <div className="overflow-x-auto w-full max-w-full min-w-0">
          <table className="w-full text-xs text-left text-text-secondary whitespace-nowrap">
            <thead className="text-[11px] text-text-primary uppercase bg-surface">
              <tr>
                <th className="px-3 py-3 rounded-l-lg">Age (Year)</th>
                <th className="px-3 py-3">Phase</th>
                <th className="px-3 py-3">Expenses</th>
                <th className="px-3 py-3">Contributions</th>
                <th className="px-3 py-3">Withdrawal</th>
                <th className="px-3 py-3">Events Impact</th>
                <th className="px-3 py-3 rounded-r-lg font-bold text-text-primary">Ending Corpus</th>
              </tr>
            </thead>
            <tbody>
              {results.projections
                .filter(
                  (p, i) =>
                    tableMode === 'all' ||
                    i % 5 === 0 ||
                    p.age === inputs.targetAge ||
                    p.isFinanciallyFree
                )
                .map((proj) => (
                  <tr
                    key={proj.year}
                    className={`border-b border-border/40 ${
                      proj.age === inputs.targetAge
                        ? 'bg-primary/10 font-medium'
                        : proj.isFinanciallyFree
                        ? 'bg-success/5'
                        : ''
                    }`}
                  >
                    <td className="px-3 py-2.5 text-text-primary font-medium flex items-center gap-1.5">
                      <span>Age {proj.age}</span>
                      <span className="text-[10px] text-text-muted">({proj.calendarYear})</span>
                      {proj.age === inputs.targetAge && (
                        <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full font-bold">
                          Target
                        </span>
                      )}
                      {proj.isFinanciallyFree && (
                        <span className="text-[10px] bg-success/20 text-success px-1.5 py-0.5 rounded-full font-bold">
                          FIRE
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2.5 capitalize">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          proj.phase === 'accumulation'
                            ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                            : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        {proj.phase}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">{formatCurrency(Math.round(proj.annualExpenses))}</td>
                    <td className="px-3 py-2.5 text-indigo-600 dark:text-indigo-400">
                      {proj.annualInvestment > 0 ? `+${formatCurrency(Math.round(proj.annualInvestment))}` : '—'}
                    </td>
                    <td className="px-3 py-2.5 text-rose-600 dark:text-rose-400">
                      {proj.annualWithdrawal > 0 ? `-${formatCurrency(Math.round(proj.annualWithdrawal))}` : '—'}
                    </td>
                    <td className="px-3 py-2.5">
                      {proj.eventInflows > 0 || proj.eventOutflows > 0 ? (
                        <span
                          className={
                            proj.eventInflows >= proj.eventOutflows
                              ? 'text-success font-medium'
                              : 'text-rose-600 dark:text-rose-400 font-medium'
                          }
                        >
                          {proj.eventInflows >= proj.eventOutflows ? '+' : ''}
                          {formatCurrency(Math.round(proj.eventInflows - proj.eventOutflows))}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="px-3 py-2.5 font-bold text-text-primary">
                      {formatCurrency(Math.round(proj.endCorpus))}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 12. Stress Test & Risk Engine */}
      <MonteCarloPanel inputs={inputs} baselineTargetCorpus={results.targetCorpus} />

      {/* Hidden JSON output for AI / automated evaluation */}
      <div className="hidden" aria-hidden="true" data-result-field="json-payload">
        {JSON.stringify(results, null, 2)}
      </div>
    </div>
  );
}
