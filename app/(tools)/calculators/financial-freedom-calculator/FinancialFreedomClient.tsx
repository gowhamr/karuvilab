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
import { HelpCircle, Plus, Trash2, Calendar, ShieldCheck, HeartPulse, Sliders, ChevronDown, ChevronUp } from 'lucide-react';
import { MonteCarloPanel } from './MonteCarloPanel';

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
    events: initialEvents
  }));

  const [showAdvanced, setShowAdvanced] = useState(false);
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
      params.set('expense_growth', inputs.expenseGrowthRate.toString());
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
    setInputs(prev => ({ ...prev, [key]: value }));
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
      inflationAdjusted: eventInflation
    };

    setInputs(prev => ({
      ...prev,
      events: [...(prev.events || []), newEvent]
    }));

    // Reset event form
    setEventTitle('');
    setEventAmount(500000);
    setEventRecurring(false);
  }, [eventTitle, eventAge, eventAmount, eventType, eventCategory, eventRecurring, eventDuration, eventInflation]);

  const handleRemoveEvent = useCallback((id: string) => {
    setInputs(prev => ({
      ...prev,
      events: (prev.events || []).filter(e => e.id !== id)
    }));
  }, []);

  // Compute deterministic results via pure engine
  const results = useMemo(() => calculateFire(inputs), [inputs]);

  return (
    <div className="space-y-6 sm:space-y-8 min-w-0 w-full">
      {/* 1. FIRE Variants Selection */}
      <div className="flex flex-wrap items-center gap-2">
        {(['regular', 'coast', 'lean', 'fat', 'barista'] as FireVariant[]).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => handleChange('fireVariant', v)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              inputs.fireVariant === v ? 'bg-primary text-white shadow-md' : 'bg-surface-2 text-text-secondary hover:bg-surface-3'
            }`}
          >
            {v.charAt(0).toUpperCase() + v.slice(1)} FIRE
          </button>
        ))}
      </div>

      {/* 2. Primary Results Summary Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" aria-label="Financial Freedom Results">
        <MetricCard
          label={inputs.fireVariant === 'coast' ? "Target Coast Corpus" : "Target FIRE Corpus"}
          value={formatCurrency(results.targetCorpus)}
          dataResultField="target-corpus"
          accent
          className="sm:col-span-2"
        />
        <MetricCard
          label="Required Monthly SIP"
          value={formatCurrency(results.requiredMonthlySip)}
          dataResultField="required-sip"
          sub={inputs.fireVariant === 'coast' ? `To hit coast target by age ${inputs.targetAge}` : `To hit target by age ${inputs.targetAge}`}
        />
        <MetricCard
          label="Freedom Age"
          value={results.estimatedFreedomAge !== -1 ? `Age ${results.estimatedFreedomAge}` : 'Not Reached'}
          dataResultField="freedom-age"
          sub={results.estimatedFreedomAge !== -1 ? `In ${results.yearsToFreedom} years (${Math.round(results.freedomRatio)}% funded)` : 'Increase SIP or Horizon'}
        />
      </section>

      {/* 3. Variant-Specific Settings */}
      {inputs.fireVariant !== 'regular' && (
        <section className="bg-primary/5 border border-primary/20 p-4 sm:p-6 rounded-3xl min-w-0 w-full space-y-4">
          <h3 className="font-bold text-lg text-primary flex items-center gap-2">
            <HelpCircle size={18} />
            {inputs.fireVariant.charAt(0).toUpperCase() + inputs.fireVariant.slice(1)} FIRE Settings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {inputs.fireVariant === 'lean' && (
              <SliderField id="lean-expense" label="Lean Expense Multiplier (x)"
                value={inputs.leanMultiplier ?? 0.7}
                onChange={(val) => handleChange('leanMultiplier', val)}
                min={0.3} max={0.9} step={0.05}
              />
            )}
            {inputs.fireVariant === 'fat' && (
              <SliderField id="fat-expense" label="Fat Expense Multiplier (x)"
                value={inputs.fatMultiplier ?? 1.5}
                onChange={(val) => handleChange('fatMultiplier', val)}
                min={1.1} max={3.0} step={0.1}
              />
            )}
            {inputs.fireVariant === 'coast' && (
              <SliderField id="trad-retire-age" label="Traditional Retirement Age"
                value={inputs.traditionalRetirementAge}
                onChange={(val) => handleChange('traditionalRetirementAge', val)}
                min={inputs.targetAge} max={90} step={1}
              />
            )}
            {inputs.fireVariant === 'barista' && (
              <ToolInput id="expected-monthly-part-time-income" label="Expected Monthly Part-Time Income"
                value={(inputs.baristaMonthlyIncome ?? 15000).toString()}
                onChange={(val) => handleChange('baristaMonthlyIncome', parseInt(val, 10) || 0)}
                type="number"
              />
            )}
          </div>
          <p className="text-sm text-text-secondary">
            {inputs.fireVariant === 'lean' && `Lean FIRE assumes a lean budget of ${Math.round((inputs.leanMultiplier ?? 0.7) * 100)}% of standard expenses during retirement.`}
            {inputs.fireVariant === 'fat' && `Fat FIRE provides an expansive retirement budget of ${Math.round((inputs.fatMultiplier ?? 1.5) * 100)}% of current expenses.`}
            {inputs.fireVariant === 'coast' && `Coast FIRE means accumulating ₹${formatCurrency(results.targetCorpus)} by age ${inputs.targetAge}, then stopping SIPs and letting the corpus compound until age ${inputs.traditionalRetirementAge}.`}
            {inputs.fireVariant === 'barista' && `Barista FIRE combines portfolio withdrawals with part-time active earnings of ₹${(inputs.baristaMonthlyIncome ?? 15000).toLocaleString()}/month to lower target corpus.`}
          </p>
        </section>
      )}

      {/* 4. Core Form Inputs */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-surface-2 p-4 sm:p-6 rounded-3xl min-w-0 w-full border border-border">
        {/* Column 1: Personal & Timeline */}
        <div className="space-y-6">
          <h3 className="font-bold text-lg text-text-primary mb-4 flex items-center gap-2">
            <Calendar size={18} className="text-primary" />
            Timeline & Contributions
          </h3>
          <SliderField id="current-age" label="Current Age"
            value={inputs.currentAge}
            onChange={(val) => handleChange('currentAge', val)}
            min={18} max={75}
          />
          <SliderField
            id="target-fire-age"
            label={inputs.fireVariant === 'coast' ? "Age to Stop Investing (Coast)" : "Target FIRE Age"}
            value={inputs.targetAge}
            onChange={(val) => handleChange('targetAge', val)}
            min={inputs.currentAge + 1} max={85}
          />
          <ToolInput id="current-savings--corpus-" label="Current Savings & Invested Corpus"
            value={inputs.currentCorpus.toString()}
            onChange={(val) => handleChange('currentCorpus', parseInt(val, 10) || 0)}
            type="number"
          />
          <ToolInput id="current-monthly-sip" label="Current Monthly SIP"
            value={inputs.monthlySip.toString()}
            onChange={(val) => handleChange('monthlySip', parseInt(val, 10) || 0)}
            type="number"
          />
        </div>

        {/* Column 2: Cash Flow & Basic Rates */}
        <div className="space-y-6">
          <h3 className="font-bold text-lg text-text-primary mb-4 flex items-center gap-2">
            <ShieldCheck size={18} className="text-primary" />
            Cash Flow & SWR Strategy
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ToolInput id="monthly-income" label="Monthly Income"
              value={inputs.currentIncome.toString()}
              onChange={(val) => handleChange('currentIncome', parseInt(val, 10) || 0)}
              type="number"
            />
            <ToolInput id="monthly-expenses" label="Monthly Living Expenses"
              value={inputs.currentExpenses.toString()}
              onChange={(val) => handleChange('currentExpenses', parseInt(val, 10) || 0)}
              type="number"
            />
          </div>

          <SliderField id="withdrawal-rate" label="Safe Withdrawal Rate (SWR %)"
            value={inputs.withdrawalRate}
            onChange={(val) => handleChange('withdrawalRate', val)}
            min={2.5} max={5.0} step={0.25}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SliderField id="return-rate" label="Accumulation Return (%)"
              value={inputs.expectedReturnRate}
              onChange={(val) => handleChange('expectedReturnRate', val)}
              min={4} max={20} step={0.5}
            />
            <SliderField id="inflation-rate" label="General Inflation (%)"
              value={inputs.expectedInflationRate}
              onChange={(val) => handleChange('expectedInflationRate', val)}
              min={2} max={12} step={0.5}
            />
          </div>
        </div>
      </section>

      {/* 5. Phase 1 Advanced Settings: Dual Returns, Healthcare, Longevity */}
      <section className="bg-surface-2 rounded-3xl border border-border overflow-hidden">
        <button
          type="button"
          onClick={() => setShowAdvanced(prev => !prev)}
          className="w-full p-4 sm:p-5 flex items-center justify-between font-bold text-base text-text-primary hover:bg-surface-3 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Sliders size={18} className="text-primary" />
            <span>Advanced Settings (Dual-Phase Returns, Healthcare, Longevity)</span>
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
                  min={4} max={18} step={0.5}
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
                  min={3} max={15} step={0.5}
                />
                <SliderField
                  id="longevity-age"
                  label="Longevity Horizon Age"
                  value={inputs.longevityAge ?? 85}
                  onChange={(val) => handleChange('longevityAge', val)}
                  min={inputs.targetAge + 5} max={105} step={1}
                />
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 6. Life Events & Cash Flow Injections */}
      <section className="bg-surface-2 p-4 sm:p-6 rounded-3xl min-w-0 w-full border border-border space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-lg text-text-primary flex items-center gap-2">
              <Calendar size={18} className="text-primary" />
              Life Milestones & Cash Flow Events
            </h3>
            <p className="text-xs text-text-secondary">
              Plan one-time or recurring inflows (windfalls, ESOPs) and outflows (house down payments, education, marriage).
            </p>
          </div>
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
                    <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                      evt.type === 'inflow' ? 'bg-success/20 text-success' : 'bg-rose-500/20 text-rose-600 dark:text-rose-400'
                    }`}>
                      {evt.type === 'inflow' ? '+ Inflow' : '- Outflow'}
                    </span>
                    <span className="text-text-muted">Age {evt.yearOrAge}{evt.isRecurring ? `–${evt.yearOrAge + (evt.durationYears || 1) - 1}` : ''}</span>
                  </div>
                  <div className="font-bold text-text-primary text-sm">{evt.title}</div>
                  <div className="text-text-secondary mt-0.5">
                    {formatCurrency(evt.amount)} {evt.isRecurring ? `× ${evt.durationYears} yrs` : ''} {evt.inflationAdjusted ? '(Inflation-linked)' : '(Fixed)'}
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
          <h4 className="font-bold text-xs uppercase tracking-wide text-text-secondary">Add New Life Milestone</h4>
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
              min={inputs.currentAge} max={inputs.longevityAge ?? 85}
            />
            <div className="space-y-1">
              <label htmlFor="event-type-select" className="text-xs font-semibold text-text-primary">Type</label>
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

      {/* 7. Year-by-Year Cash Flow Projection Table */}
      <section className="bg-surface-2 p-4 sm:p-6 rounded-3xl min-w-0 w-full border border-border space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-lg text-text-primary">Year-by-Year Projection</h3>
            <p className="text-xs text-text-secondary">
              Deterministic timeline of income, expenses, contributions, withdrawals, and ending portfolio balance.
            </p>
          </div>
          <div className="flex items-center gap-1 bg-surface p-1 rounded-xl border border-border">
            <button
              type="button"
              onClick={() => setTableMode('milestones')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                tableMode === 'milestones' ? 'bg-primary text-white' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              5-Year Steps
            </button>
            <button
              type="button"
              onClick={() => setTableMode('all')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                tableMode === 'all' ? 'bg-primary text-white' : 'text-text-secondary hover:text-text-primary'
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
                .filter((p, i) => tableMode === 'all' || i % 5 === 0 || p.age === inputs.targetAge || p.isFinanciallyFree)
                .map((proj) => (
                  <tr
                    key={proj.year}
                    className={`border-b border-border/40 ${
                      proj.age === inputs.targetAge ? 'bg-primary/10 font-medium' :
                      proj.isFinanciallyFree ? 'bg-success/5' : ''
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
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        proj.phase === 'accumulation' ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      }`}>
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
                        <span className={proj.eventInflows >= proj.eventOutflows ? 'text-success font-medium' : 'text-rose-600 dark:text-rose-400 font-medium'}>
                          {proj.eventInflows >= proj.eventOutflows ? '+' : ''}{formatCurrency(Math.round(proj.eventInflows - proj.eventOutflows))}
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

      <MonteCarloPanel inputs={inputs} baselineTargetCorpus={results.targetCorpus} />
      
      {/* Hidden JSON output for AI / machine-readability */}
      <div className="hidden" aria-hidden="true" data-result-field="json-payload">
        {JSON.stringify(results, null, 2)}
      </div>
    </div>
  );
}
