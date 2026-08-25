"use client";

import { useState, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { MetricCard } from "@/components/ui/MetricCard";
import { HybridDateInput } from "@/components/ui/HybridDateInput";
import { useUrlState } from "@/src/hooks/useUrlState";
import { ShareButton } from "@/components/ui/ShareButton";
import { SharedResultBanner } from "@/components/ui/SharedResultBanner";
import { QRModal } from "@/components/ui/QRModal";
import { ToolWorkspace } from "@/components/ui/ToolWorkspace";
import { CopyButton } from "@/components/ui/CopyButton";
import { cn } from "@/src/lib/utils";
import {
  Calendar,
  Plus,
  Minus,
  Hash,
  RotateCcw,
  Briefcase,
  AlertCircle,
  Clock,
  ArrowRightLeft,
} from "lucide-react";
import {
  todayISO,
  civilFromDays,
  daysFromCivil,
  formatDateParts,
} from "@/src/features/calculators/age/date-utils";
import {
  calculateDateDifference,
  calculateDateOffset,
  DateMathUnit,
  DateMathOperation,
} from "@/src/features/calculators/date";

export default function DateCalculatorClient() {
  const searchParams = useSearchParams();
  const legacyFrom = searchParams.get('from');
  const legacyTo = searchParams.get('to');

  const defaultToday = todayISO();
  const defaultNextYear = useMemo(() => {
    const todayParts = defaultToday.split('-').map(Number);
    return formatDateParts({
      year: (todayParts[0] || 2026) + 1,
      month: todayParts[1] || 1,
      day: todayParts[2] || 1,
    });
  }, [defaultToday]);

  const { state, setState, hasParams } = useUrlState({
    defaults: {
      mode: 'diff',
      start: legacyFrom || defaultToday,
      end: legacyTo || defaultNextYear,
      base: defaultToday,
      op: 'add',
      amount: '30',
      unit: 'days',
      include_end: 'false',
    },
    debounceMs: 400,
  });

  const mode = ((state.mode as string) === 'add' ? 'add' : 'diff') as 'diff' | 'add';
  const startDate = (state.start as string) || legacyFrom || defaultToday;
  const endDate = (state.end as string) || legacyTo || defaultNextYear;
  const baseDate = (state.base as string) || defaultToday;
  const operation = ((state.op as string) === 'subtract' ? 'subtract' : 'add') as DateMathOperation;
  const amountStr = (state.amount as string) || '30';
  const unit = ((['days', 'businessDays', 'weeks', 'months', 'years'].includes(state.unit as string)
    ? state.unit
    : 'days') as DateMathUnit);
  const includeEndDay = state.include_end === 'true';

  const [isQrOpen, setIsQrOpen] = useState(false);

  const setStartDate = useCallback((v: string) => setState({ start: v }), [setState]);
  const setEndDate = useCallback((v: string) => setState({ end: v }), [setState]);
  const setBaseDate = useCallback((v: string) => setState({ base: v }), [setState]);
  const setAmountStr = useCallback((v: string) => setState({ amount: v }), [setState]);
  const setOperation = useCallback((op: DateMathOperation) => setState({ op }), [setState]);
  const setUnit = useCallback((u: DateMathUnit) => setState({ unit: u }), [setState]);
  const setMode = useCallback((m: 'diff' | 'add') => setState({ mode: m }), [setState]);
  const toggleIncludeEnd = useCallback(
    () => setState({ include_end: includeEndDay ? 'false' : 'true' }),
    [includeEndDay, setState]
  );

  const swapDates = () => {
    setState({ start: endDate, end: startDate });
  };

  const resetAll = () => {
    setState({
      mode: 'diff',
      start: defaultToday,
      end: defaultNextYear,
      base: defaultToday,
      op: 'add',
      amount: '30',
      unit: 'days',
      include_end: 'false',
    });
  };

  // Pure deterministic calculations
  const diffResponse = useMemo(() => {
    return calculateDateDifference({
      startDate,
      endDate,
      includeEndDay,
    });
  }, [startDate, endDate, includeEndDay]);

  const offsetResponse = useMemo(() => {
    return calculateDateOffset({
      baseDate,
      amount: parseInt(amountStr, 10) || 0,
      unit,
      operation,
    });
  }, [baseDate, amountStr, unit, operation]);

  // Construct canonical share URL
  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}?mode=${mode}&start=${encodeURIComponent(
        startDate
      )}&end=${encodeURIComponent(endDate)}&base=${encodeURIComponent(
        baseDate
      )}&op=${operation}&amount=${encodeURIComponent(amountStr)}&unit=${unit}&include_end=${
        includeEndDay ? 'true' : 'false'
      }`
    : `?mode=${mode}&start=${encodeURIComponent(startDate)}&end=${encodeURIComponent(endDate)}`;

  const diffSummary = diffResponse.success
    ? `Date Difference\n----------------\nFrom: ${diffResponse.data.startDateFormatted} (${diffResponse.data.startDayOfWeek})\nTo: ${diffResponse.data.endDateFormatted} (${diffResponse.data.endDayOfWeek})\n\nExact Interval: ${diffResponse.data.years} years, ${diffResponse.data.months} months, ${diffResponse.data.days} days\nTotal Days: ${diffResponse.data.totalDays.toLocaleString()}\nBusiness Days (Mon-Fri): ${diffResponse.data.businessDays.toLocaleString()}\nWeekend Days: ${diffResponse.data.weekendDays.toLocaleString()}\nTotal Weeks: ${diffResponse.data.totalWeeks.toLocaleString()}\nTotal Hours: ${diffResponse.data.totalHours.toLocaleString()}\n\nCalculated via KaruviLab`
    : '';

  return (
    <div className="w-full min-w-0 max-w-full space-y-6 sm:space-y-8">
      <SharedResultBanner hasParams={hasParams} toolName="Date Calculator" />
      <QRModal url={shareUrl} isOpen={isQrOpen} onClose={() => setIsQrOpen(false)} />

      <ToolWorkspace
        tabs={{
          options: [
            { id: 'diff', label: 'Date Difference' },
            { id: 'add', label: 'Add / Subtract Time' },
          ],
          activeId: mode,
          onChange: (id) => setMode(id as 'diff' | 'add'),
        }}
        layout="split"
        input={
          <form
            data-tool="date-calculator"
            onSubmit={(e) => e.preventDefault()}
            className="space-y-6 min-w-0 w-full"
          >
            {mode === 'diff' ? (
              <div className="space-y-4 sm:space-y-6 min-w-0 w-full">
                <div className="grid grid-cols-1 gap-4 min-w-0 w-full">
                  <HybridDateInput
                    label="Start Date"
                    value={startDate}
                    onChange={setStartDate}
                    description="DD / MM / YYYY"
                    id="date-calc-start"
                    name="start"
                    dataInputField="start-date"
                  />

                  <div className="flex items-center justify-center -my-1">
                    <button
                      type="button"
                      onClick={swapDates}
                      className="p-2 rounded-xl bg-surface-2 border border-border text-text-muted hover:text-blue hover:border-blue/30 transition-all cursor-pointer"
                      title="Swap Start and End Dates"
                      aria-label="Swap Start and End Dates"
                    >
                      <ArrowRightLeft className="w-4 h-4" />
                    </button>
                  </div>

                  <HybridDateInput
                    label="End Date"
                    value={endDate}
                    onChange={setEndDate}
                    description="DD / MM / YYYY"
                    id="date-calc-end"
                    name="end"
                    dataInputField="end-date"
                  />
                </div>

                <div className="p-3.5 bg-surface-2/40 border border-border/80 rounded-xl flex items-center justify-between gap-3">
                  <div className="space-y-0.5 min-w-0">
                    <label htmlFor="include-end-day-toggle" className="text-xs font-semibold text-text cursor-pointer">
                      Include End Day in Calculation
                    </label>
                    <p className="text-[11px] text-text-muted">Adds 1 additional day (+1) to the interval</p>
                  </div>
                  <button
                    id="include-end-day-toggle"
                    type="button"
                    onClick={toggleIncludeEnd}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex-shrink-0",
                      includeEndDay
                        ? "bg-blue text-white shadow-sm"
                        : "bg-surface-2 text-text-muted hover:text-text border border-border"
                    )}
                  >
                    {includeEndDay ? "Included (+1)" : "Standard"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-5 sm:space-y-6 min-w-0 w-full">
                <HybridDateInput
                  label="Base Date"
                  value={baseDate}
                  onChange={setBaseDate}
                  description="DD / MM / YYYY"
                  id="date-calc-base"
                  name="base"
                  dataInputField="base-date"
                />

                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5 text-blue" /> Operation
                  </label>
                  <div className="grid grid-cols-2 gap-2" role="group" aria-label="Operation selection">
                    {(['add', 'subtract'] as const).map((op) => (
                      <button
                        key={op}
                        type="button"
                        onClick={() => setOperation(op)}
                        name="op"
                        data-input-field="operation"
                        className={cn(
                          "flex items-center justify-center gap-2 py-2.5 sm:py-3 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer",
                          operation === op
                            ? "bg-blue border-blue text-white shadow-sm shadow-blue/20"
                            : "bg-surface-2 border-border text-text-muted hover:text-text hover:border-blue/30"
                        )}
                      >
                        {op === 'add' ? <Plus className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                        {op}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="date-calc-amount" className="text-xs font-bold text-text uppercase tracking-wider">
                    Amount
                  </label>
                  <input
                    id="date-calc-amount"
                    name="amount"
                    data-input-field="amount"
                    type="number"
                    min="0"
                    step="1"
                    value={amountStr}
                    onChange={(e) => setAmountStr(e.target.value)}
                    className="w-full bg-surface border border-border rounded-xl px-3.5 py-2.5 text-text font-semibold focus:outline-none focus:border-blue text-sm"
                    placeholder="Enter quantity"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                    <Hash className="w-3.5 h-3.5 text-blue" /> Time Unit
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 p-1.5 bg-surface-2/40 border border-border/80 rounded-xl" role="group" aria-label="Time unit selection">
                    {[
                      { id: 'days', label: 'Days' },
                      { id: 'businessDays', label: 'Work Days' },
                      { id: 'weeks', label: 'Weeks' },
                      { id: 'months', label: 'Months' },
                      { id: 'years', label: 'Years' },
                    ].map((u) => (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => setUnit(u.id as DateMathUnit)}
                        name="unit"
                        data-input-field="unit"
                        className={cn(
                          "py-2 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer text-center truncate",
                          unit === u.id
                            ? "bg-surface text-blue shadow-sm border border-blue/20"
                            : "text-text-muted hover:text-text"
                        )}
                      >
                        {u.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </form>
        }
        output={
          mode === 'diff' ? (
            diffResponse.success ? (
              <div className="space-y-5 sm:space-y-6 min-w-0 w-full">
                {/* Machine-readable outputs for automation / agents */}
                <div className="sr-only" aria-hidden="true">
                  <output data-result-field="years">{diffResponse.data.years}</output>
                  <output data-result-field="months">{diffResponse.data.months}</output>
                  <output data-result-field="days">{diffResponse.data.days}</output>
                  <output data-result-field="total-days">{diffResponse.data.totalDays}</output>
                  <output data-result-field="business-days">{diffResponse.data.businessDays}</output>
                  <output data-result-field="weekend-days">{diffResponse.data.weekendDays}</output>
                </div>

                {/* Header Actions Row */}
                <div className="flex items-center justify-between gap-3 min-w-0 w-full">
                  <h3 className="text-base sm:text-lg font-semibold text-text truncate">Date Interval</h3>
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
                      title={`Date Difference: ${diffResponse.data.totalDays} days (${diffResponse.data.years}y ${diffResponse.data.months}m ${diffResponse.data.days}d) — KaruviLab`}
                      onQrClick={() => setIsQrOpen(true)}
                    />
                  </div>
                </div>

                {/* Primary Result Metric */}
                <div className="w-full min-w-0">
                  <MetricCard
                    label="Exact Difference"
                    value={`${diffResponse.data.years} Years, ${diffResponse.data.months} Months, ${diffResponse.data.days} Days`}
                    accent
                    className="bg-primary/5 border-primary/20 shadow-sm w-full min-w-0"
                    valueClassName="text-lg xs:text-xl sm:text-2xl text-blue leading-tight"
                    sub={
                      diffResponse.data.isSameDay
                        ? 'Both dates are identical'
                        : `${diffResponse.data.isPast ? 'Past date' : 'Future date'} (${diffResponse.data.startDateFormatted} → ${diffResponse.data.endDateFormatted})`
                    }
                    dataResultField="exact-difference"
                  />
                </div>

                {/* Secondary Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 w-full min-w-0">
                  <MetricCard
                    label="Total Days"
                    value={diffResponse.data.totalDays.toLocaleString()}
                    sub="Calendar days"
                    dataResultField="total-days"
                  />
                  <MetricCard
                    label="Business Days"
                    value={diffResponse.data.businessDays.toLocaleString()}
                    sub="Mon – Fri only"
                    dataResultField="business-days"
                  />
                  <MetricCard
                    label="Weekend Days"
                    value={diffResponse.data.weekendDays.toLocaleString()}
                    sub="Sat & Sun"
                    dataResultField="weekend-days"
                  />
                  <MetricCard
                    label="Total Weeks"
                    value={diffResponse.data.totalWeeks.toLocaleString()}
                    sub="Full 7-day weeks"
                    dataResultField="total-weeks"
                  />
                  <MetricCard
                    label="Total Hours"
                    value={diffResponse.data.totalHours.toLocaleString()}
                    sub="24 hours/day"
                    dataResultField="total-hours"
                  />
                  <MetricCard
                    label="Start Weekday"
                    value={diffResponse.data.startDayOfWeek}
                    sub={diffResponse.data.startDateFormatted}
                    dataResultField="start-day-of-week"
                  />
                </div>

                {/* Copy Summary Banner */}
                <div className="bg-surface-2/40 border border-border p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-sm">
                  <div className="space-y-0.5 min-w-0">
                    <p className="text-xs font-semibold text-text">
                      {diffResponse.data.isSameDay
                        ? '0 days interval'
                        : `${diffResponse.data.totalDays.toLocaleString()} days between ${diffResponse.data.startDateFormatted} and ${diffResponse.data.endDateFormatted}`}
                    </p>
                    <p className="text-[11px] text-text-muted">
                      {diffResponse.data.businessDays.toLocaleString()} working days • {diffResponse.data.weekendDays.toLocaleString()} weekend days
                    </p>
                  </div>
                  <CopyButton text={diffSummary} label="Copy Summary" className="bg-surface border border-border" />
                </div>
              </div>
            ) : (
              <div
                role="alert"
                aria-live="assertive"
                data-error-code={diffResponse.error.code}
                data-error-message={diffResponse.error.message}
                className="p-5 sm:p-6 rounded-2xl bg-error/5 border border-error/20 space-y-4 text-text min-w-0 w-full animate-in fade-in duration-200"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div className="space-y-1 min-w-0 flex-1">
                    <h3 className="font-bold text-sm sm:text-base text-red-600 dark:text-red-400">
                      Invalid Date Range
                    </h3>
                    <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                      {diffResponse.error.message}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-error/10 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={resetAll}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-surface-2 border border-border text-text hover:text-blue transition-colors cursor-pointer"
                  >
                    Reset to Default Dates
                  </button>
                </div>
              </div>
            )
          ) : (
            offsetResponse.success ? (
              <div className="space-y-5 sm:space-y-6 min-w-0 w-full">
                {/* Machine-readable outputs for automation / agents */}
                <div className="sr-only" aria-hidden="true">
                  <output data-result-field="resulting-date">{offsetResponse.data.resultingDate}</output>
                  <output data-result-field="day-of-week">{offsetResponse.data.dayOfWeek}</output>
                  <output data-result-field="total-days-added">{offsetResponse.data.totalDaysAdded}</output>
                </div>

                {/* Header Actions Row */}
                <div className="flex items-center justify-between gap-3 min-w-0 w-full">
                  <h3 className="text-base sm:text-lg font-semibold text-text truncate">Resulting Arrival Date</h3>
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
                      title={`Date Offset Result: ${offsetResponse.data.resultingDate} (${offsetResponse.data.dayOfWeek}) — KaruviLab`}
                      onQrClick={() => setIsQrOpen(true)}
                    />
                  </div>
                </div>

                {/* Main Hero Result Card */}
                <div className="p-6 sm:p-8 bg-surface-2/40 rounded-3xl border border-border flex flex-col items-center justify-center text-center shadow-sm">
                  <span className="text-xs font-bold uppercase tracking-widest text-text-muted mb-2 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-blue" />
                    {operation === 'add' ? 'Date in the Future' : 'Date in the Past'}
                  </span>
                  <div
                    data-result-field="resulting-date"
                    className="text-3xl sm:text-5xl font-black text-blue tracking-tight tabular-nums mb-2"
                  >
                    {offsetResponse.data.resultingDate}
                  </div>
                  <p className="text-sm font-semibold text-text mb-1">
                    {offsetResponse.data.formattedLongDate} • {offsetResponse.data.dayOfWeek}
                  </p>
                  <p className="text-xs text-text-muted max-w-sm leading-relaxed">
                    {operation === 'add' ? 'Adding' : 'Subtracting'}{' '}
                    <strong className="text-blue font-bold">
                      {amountStr} {unit === 'businessDays' ? 'business days' : unit}
                    </strong>{' '}
                    {operation === 'add' ? 'to' : 'from'} {baseDate}
                  </p>
                </div>

                {/* Additional Insight Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 w-full min-w-0">
                  <MetricCard
                    label="Day of Week"
                    value={offsetResponse.data.dayOfWeek}
                    sub={offsetResponse.data.isWeekend ? 'Weekend' : 'Weekday'}
                    dataResultField="resulting-day-of-week"
                  />
                  <MetricCard
                    label="Calendar Days Shifted"
                    value={`${Math.abs(offsetResponse.data.totalDaysAdded).toLocaleString()} days`}
                    sub={offsetResponse.data.totalDaysAdded >= 0 ? 'Forward' : 'Backward'}
                    dataResultField="days-shifted"
                  />
                  <MetricCard
                    label="Weekend Status"
                    value={offsetResponse.data.isWeekend ? 'Weekend 🏖️' : 'Working Day 💼'}
                    dataResultField="weekend-status"
                  />
                </div>
              </div>
            ) : (
              <div
                role="alert"
                aria-live="assertive"
                data-error-code={offsetResponse.error.code}
                data-error-message={offsetResponse.error.message}
                className="p-5 sm:p-6 rounded-2xl bg-error/5 border border-error/20 space-y-4 text-text min-w-0 w-full animate-in fade-in duration-200"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div className="space-y-1 min-w-0 flex-1">
                    <h3 className="font-bold text-sm sm:text-base text-red-600 dark:text-red-400">
                      Invalid Date Calculation
                    </h3>
                    <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                      {offsetResponse.error.message}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-error/10 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={resetAll}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-surface-2 border border-border text-text hover:text-blue transition-colors cursor-pointer"
                  >
                    Reset to Default
                  </button>
                </div>
              </div>
            )
          )
        }
      />
    </div>
  );
}
