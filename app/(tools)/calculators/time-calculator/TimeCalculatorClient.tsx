"use client";

import { useState, useMemo, useCallback } from "react";
import { MetricCard } from "@/components/ui/MetricCard";
import { CopyButton } from "@/components/ui/CopyButton";
import { ToolWorkspace } from "@/components/ui/ToolWorkspace";
import { ShareButton } from "@/components/ui/ShareButton";
import { SharedResultBanner } from "@/components/ui/SharedResultBanner";
import { QRModal } from "@/components/ui/QRModal";
import { useUrlState } from "@/src/hooks/useUrlState";
import { cn } from "@/src/lib/utils";
import {
  Clock,
  Plus,
  Minus,
  RotateCcw,
  ArrowRightLeft,
  AlertCircle,
  Trash2,
} from "lucide-react";
import {
  calculateTimeDifference,
  calculateDurationSum,
  calculateTimeOffset,
} from "@/src/features/calculators/time";

export default function TimeCalculatorClient() {
  const { state, setState, hasParams } = useUrlState({
    defaults: {
      mode: 'diff',
      start: '09:00',
      end: '17:30',
      times: '01:30,02:45',
      base: '09:00',
      op: 'add',
      h: '2',
      m: '30',
      s: '0',
    },
    debounceMs: 350,
  });

  const mode = (['diff', 'add', 'offset'].includes(state.mode as string)
    ? state.mode
    : 'diff') as 'diff' | 'add' | 'offset';

  const startTime = (state.start as string) || '09:00';
  const endTime = (state.end as string) || '17:30';
  const timesStr = (state.times as string) || '01:30,02:45';
  const baseTime = (state.base as string) || '09:00';
  const op = ((state.op as string) === 'subtract' ? 'subtract' : 'add') as 'add' | 'subtract';
  const hoursOffset = parseInt((state.h as string) || '2', 10) || 0;
  const minutesOffset = parseInt((state.m as string) || '30', 10) || 0;
  const secondsOffset = parseInt((state.s as string) || '0', 10) || 0;

  const [isQrOpen, setIsQrOpen] = useState(false);

  // Setters
  const setMode = useCallback((m: 'diff' | 'add' | 'offset') => setState({ mode: m }), [setState]);
  const setStartTime = useCallback((v: string) => setState({ start: v }), [setState]);
  const setEndTime = useCallback((v: string) => setState({ end: v }), [setState]);
  const setBaseTime = useCallback((v: string) => setState({ base: v }), [setState]);
  const setOp = useCallback((v: 'add' | 'subtract') => setState({ op: v }), [setState]);
  const setHoursOffset = useCallback((v: string) => setState({ h: v }), [setState]);
  const setMinutesOffset = useCallback((v: string) => setState({ m: v }), [setState]);
  const setSecondsOffset = useCallback((v: string) => setState({ s: v }), [setState]);

  const durationRows = useMemo(() => {
    return timesStr ? timesStr.split(',').map((t) => t.trim()) : ['01:30', '02:45'];
  }, [timesStr]);

  const updateDurationRow = (idx: number, val: string) => {
    const updated = [...durationRows];
    updated[idx] = val;
    setState({ times: updated.join(',') });
  };

  const addDurationRow = () => {
    const updated = [...durationRows, '01:00'];
    setState({ times: updated.join(',') });
  };

  const removeDurationRow = (idx: number) => {
    if (durationRows.length <= 1) return;
    const updated = durationRows.filter((_, i) => i !== idx);
    setState({ times: updated.join(',') });
  };

  const swapDiffTimes = () => {
    setState({ start: endTime, end: startTime });
  };

  const resetAll = () => {
    setState({
      mode: 'diff',
      start: '09:00',
      end: '17:30',
      times: '01:30,02:45',
      base: '09:00',
      op: 'add',
      h: '2',
      m: '30',
      s: '0',
    });
  };

  // Pure deterministic calculations
  const diffResponse = useMemo(() => {
    return calculateTimeDifference({ startTime, endTime });
  }, [startTime, endTime]);

  const sumResponse = useMemo(() => {
    return calculateDurationSum({ durations: durationRows });
  }, [durationRows]);

  const offsetResponse = useMemo(() => {
    return calculateTimeOffset({
      baseTime,
      hours: hoursOffset,
      minutes: minutesOffset,
      seconds: secondsOffset,
      operation: op,
    });
  }, [baseTime, hoursOffset, minutesOffset, secondsOffset, op]);

  // Construct canonical share URL
  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}?mode=${mode}&start=${encodeURIComponent(
        startTime
      )}&end=${encodeURIComponent(endTime)}&times=${encodeURIComponent(
        timesStr
      )}&base=${encodeURIComponent(baseTime)}&op=${op}&h=${hoursOffset}&m=${minutesOffset}&s=${secondsOffset}`
    : `?mode=${mode}&start=${encodeURIComponent(startTime)}&end=${encodeURIComponent(endTime)}`;

  // Summary Strings for copying
  const diffSummary = diffResponse.success
    ? `Time Difference\n----------------\nStart Time: ${startTime}\nEnd Time: ${endTime}\n\nInterval: ${diffResponse.data.formattedDuration} (${diffResponse.data.formattedHHMMSS})\nTotal Minutes: ${diffResponse.data.totalMinutes.toLocaleString()} min\nDecimal Hours: ${diffResponse.data.totalHoursDecimal} hrs\nOvernight Crossing: ${diffResponse.data.isOvernight ? 'Yes (next day)' : 'No (same day)'}\n\nCalculated via KaruviLab`
    : '';

  const sumSummary = sumResponse.success
    ? `Sum Durations\n-------------\n${durationRows.map((d, i) => `${i + 1}. ${d}`).join('\n')}\n\nTotal: ${sumResponse.data.formattedDuration} (${sumResponse.data.formattedHHMMSS})\nTotal Minutes: ${sumResponse.data.totalMinutes.toLocaleString()} min\nDecimal Hours: ${sumResponse.data.totalHoursDecimal} hrs\n\nCalculated via KaruviLab`
    : '';

  const offsetSummary = offsetResponse.success
    ? `Clock Time Offset\n-----------------\nBase Time: ${baseTime}\nOperation: ${op === 'add' ? 'Added' : 'Subtracted'} ${hoursOffset}h ${minutesOffset}m ${secondsOffset}s\n\nResulting Time: ${offsetResponse.data.resultingTime} (${offsetResponse.data.formatted12Hour})\nDay Rollover: ${offsetResponse.data.formattedShiftText}\n\nCalculated via KaruviLab`
    : '';

  return (
    <div className="w-full min-w-0 max-w-full space-y-6 sm:space-y-8">
      <SharedResultBanner hasParams={hasParams} toolName="Time Calculator" />
      <QRModal url={shareUrl} isOpen={isQrOpen} onClose={() => setIsQrOpen(false)} />

      <ToolWorkspace
        tabs={{
          options: [
            { id: 'diff', label: 'Time Difference' },
            { id: 'add', label: 'Sum Durations' },
            { id: 'offset', label: 'Add / Subtract Time' },
          ],
          activeId: mode,
          onChange: (id) => setMode(id as 'diff' | 'add' | 'offset'),
        }}
        layout="split"
        input={
          <form
            data-tool="time-calculator"
            onSubmit={(e) => e.preventDefault()}
            className="space-y-5 sm:space-y-6 min-w-0 w-full"
          >
            {mode === 'diff' && (
              <div className="space-y-4 sm:space-y-6 min-w-0 w-full">
                <div className="space-y-1.5">
                  <label htmlFor="time-calc-start" className="text-xs font-bold text-text uppercase tracking-wider">
                    Start Time
                  </label>
                  <input
                    id="time-calc-start"
                    name="start"
                    data-input-field="start-time"
                    type="time"
                    step="1"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text font-mono text-base focus:outline-none focus:border-blue shadow-sm"
                  />
                </div>

                <div className="flex items-center justify-center -my-1">
                  <button
                    type="button"
                    onClick={swapDiffTimes}
                    className="p-2 rounded-xl bg-surface-2 border border-border text-text-muted hover:text-blue hover:border-blue/30 transition-all cursor-pointer shadow-xs"
                    title="Swap Start and End Time"
                    aria-label="Swap Start and End Time"
                  >
                    <ArrowRightLeft className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="time-calc-end" className="text-xs font-bold text-text uppercase tracking-wider">
                    End Time
                  </label>
                  <input
                    id="time-calc-end"
                    name="end"
                    data-input-field="end-time"
                    type="time"
                    step="1"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text font-mono text-base focus:outline-none focus:border-blue shadow-sm"
                  />
                </div>

                <div className="p-3.5 bg-surface-2/40 border border-border/80 rounded-xl text-xs text-text-muted">
                  💡 <strong className="text-text">Overnight shift support:</strong> If end time is earlier than start time (e.g. 22:00 to 06:30), duration is automatically calculated across the midnight boundary (+24h).
                </div>
              </div>
            )}

            {mode === 'add' && (
              <div className="space-y-4 min-w-0 w-full">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-text uppercase tracking-wider">
                    Durations to Add ({durationRows.length})
                  </label>
                  <span className="text-[11px] text-text-muted">HH:MM or HH:MM:SS</span>
                </div>

                <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                  {durationRows.map((row, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-xs font-bold text-text-muted w-6 text-right shrink-0">
                        {idx + 1}.
                      </span>
                      <input
                        type="text"
                        value={row}
                        data-input-field="duration-entry"
                        onChange={(e) => updateDurationRow(idx, e.target.value)}
                        placeholder="HH:MM:SS"
                        className="flex-1 bg-surface border border-border rounded-xl px-3.5 py-2.5 text-text font-mono text-sm focus:outline-none focus:border-blue shadow-xs"
                      />
                      {durationRows.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeDurationRow(idx)}
                          className="p-2.5 rounded-xl border border-border text-text-muted hover:text-red-500 hover:border-red-500/30 transition-colors cursor-pointer"
                          title="Remove row"
                          aria-label={`Remove row ${idx + 1}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={addDurationRow}
                  className="w-full py-2.5 border-2 border-dashed border-border rounded-xl text-xs font-bold text-text-muted hover:border-blue hover:text-blue transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Duration Row
                </button>
              </div>
            )}

            {mode === 'offset' && (
              <div className="space-y-5 min-w-0 w-full">
                <div className="space-y-1.5">
                  <label htmlFor="time-calc-base" className="text-xs font-bold text-text uppercase tracking-wider">
                    Base Clock Time
                  </label>
                  <input
                    id="time-calc-base"
                    name="base"
                    data-input-field="base-time"
                    type="time"
                    step="1"
                    value={baseTime}
                    onChange={(e) => setBaseTime(e.target.value)}
                    className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text font-mono text-base focus:outline-none focus:border-blue shadow-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-text-muted">
                    Operation
                  </label>
                  <div className="grid grid-cols-2 gap-2" role="group" aria-label="Operation">
                    {(['add', 'subtract'] as const).map((operation) => (
                      <button
                        key={operation}
                        type="button"
                        onClick={() => setOp(operation)}
                        data-input-field="operation"
                        className={cn(
                          "flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer",
                          op === operation
                            ? "bg-blue border-blue text-white shadow-sm shadow-blue/20"
                            : "bg-surface-2 border-border text-text-muted hover:text-text hover:border-blue/30"
                        )}
                      >
                        {operation === 'add' ? <Plus className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                        {operation}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  <div className="space-y-1">
                    <label htmlFor="offset-hours" className="text-xs font-bold text-text-muted">
                      Hours
                    </label>
                    <input
                      id="offset-hours"
                      data-input-field="hours"
                      type="number"
                      min="0"
                      value={hoursOffset}
                      onChange={(e) => setHoursOffset(e.target.value)}
                      className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-text font-semibold focus:outline-none focus:border-blue text-sm text-center"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="offset-minutes" className="text-xs font-bold text-text-muted">
                      Minutes
                    </label>
                    <input
                      id="offset-minutes"
                      data-input-field="minutes"
                      type="number"
                      min="0"
                      max="59"
                      value={minutesOffset}
                      onChange={(e) => setMinutesOffset(e.target.value)}
                      className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-text font-semibold focus:outline-none focus:border-blue text-sm text-center"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="offset-seconds" className="text-xs font-bold text-text-muted">
                      Seconds
                    </label>
                    <input
                      id="offset-seconds"
                      data-input-field="seconds"
                      type="number"
                      min="0"
                      max="59"
                      value={secondsOffset}
                      onChange={(e) => setSecondsOffset(e.target.value)}
                      className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-text font-semibold focus:outline-none focus:border-blue text-sm text-center"
                    />
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
                  <output data-result-field="hours">{diffResponse.data.hours}</output>
                  <output data-result-field="minutes">{diffResponse.data.minutes}</output>
                  <output data-result-field="seconds">{diffResponse.data.seconds}</output>
                  <output data-result-field="total-hours">{diffResponse.data.totalHoursDecimal}</output>
                  <output data-result-field="total-minutes">{diffResponse.data.totalMinutes}</output>
                  <output data-result-field="total-seconds">{diffResponse.data.totalSeconds}</output>
                  <output data-result-field="decimal-hours">{diffResponse.data.totalHoursDecimal}</output>
                </div>

                <div className="flex items-center justify-between gap-3 min-w-0 w-full">
                  <h3 className="text-base sm:text-lg font-semibold text-text truncate">Time Interval</h3>
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
                      title={`Time Difference: ${diffResponse.data.formattedDuration} (${diffResponse.data.totalHoursDecimal} hrs) — KaruviLab`}
                      onQrClick={() => setIsQrOpen(true)}
                    />
                  </div>
                </div>

                <div className="w-full min-w-0">
                  <MetricCard
                    label="Elapsed Duration"
                    value={diffResponse.data.formattedDuration}
                    accent
                    className="bg-primary/5 border-primary/20 shadow-sm w-full min-w-0"
                    valueClassName="text-xl sm:text-3xl text-blue leading-tight font-mono font-bold"
                    sub={
                      diffResponse.data.isOvernight
                        ? 'Overnight shift (crosses midnight into next day)'
                        : `From ${startTime} to ${endTime} (same day)`
                    }
                    dataResultField="elapsed-duration"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 w-full min-w-0">
                  <MetricCard
                    label="Decimal Hours"
                    value={`${diffResponse.data.totalHoursDecimal} hrs`}
                    sub="For billing & payroll"
                    dataResultField="decimal-hours"
                  />
                  <MetricCard
                    label="Total Minutes"
                    value={`${diffResponse.data.totalMinutes.toLocaleString()} min`}
                    sub="Total minute span"
                    dataResultField="total-minutes"
                  />
                  <MetricCard
                    label="Total Seconds"
                    value={`${diffResponse.data.totalSeconds.toLocaleString()} s`}
                    sub="Base unit"
                    dataResultField="total-seconds"
                  />
                </div>

                <div className="bg-surface-2/40 border border-border p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-sm">
                  <div className="space-y-0.5 min-w-0">
                    <p className="text-xs font-semibold text-text">
                      {startTime} → {endTime} = {diffResponse.data.formattedDuration}
                    </p>
                    <p className="text-[11px] text-text-muted">
                      {diffResponse.data.totalHoursDecimal} decimal hours • {diffResponse.data.totalMinutes} total minutes
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
                      Invalid Time Interval
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
                    Reset to Default Times
                  </button>
                </div>
              </div>
            )
          ) : mode === 'add' ? (
            sumResponse.success ? (
              <div className="space-y-5 sm:space-y-6 min-w-0 w-full">
                {/* Machine-readable outputs */}
                <div className="sr-only" aria-hidden="true">
                  <output data-result-field="hours">{sumResponse.data.hours}</output>
                  <output data-result-field="minutes">{sumResponse.data.minutes}</output>
                  <output data-result-field="seconds">{sumResponse.data.seconds}</output>
                  <output data-result-field="total-hours">{sumResponse.data.totalHoursDecimal}</output>
                  <output data-result-field="total-minutes">{sumResponse.data.totalMinutes}</output>
                  <output data-result-field="total-seconds">{sumResponse.data.totalSeconds}</output>
                  <output data-result-field="decimal-hours">{sumResponse.data.totalHoursDecimal}</output>
                </div>

                <div className="flex items-center justify-between gap-3 min-w-0 w-full">
                  <h3 className="text-base sm:text-lg font-semibold text-text truncate">Total Cumulative Time</h3>
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
                      title={`Sum Durations: ${sumResponse.data.formattedDuration} (${sumResponse.data.totalHoursDecimal} hrs) — KaruviLab`}
                      onQrClick={() => setIsQrOpen(true)}
                    />
                  </div>
                </div>

                <div className="w-full min-w-0">
                  <MetricCard
                    label="Combined Sum"
                    value={sumResponse.data.formattedDuration}
                    accent
                    className="bg-primary/5 border-primary/20 shadow-sm w-full min-w-0"
                    valueClassName="text-xl sm:text-3xl text-blue leading-tight font-mono font-bold"
                    sub={`Sum of ${durationRows.length} duration entries`}
                    dataResultField="total-duration"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 w-full min-w-0">
                  <MetricCard
                    label="Decimal Hours"
                    value={`${sumResponse.data.totalHoursDecimal} hrs`}
                    sub="Base-10 equivalent"
                    dataResultField="decimal-hours"
                  />
                  <MetricCard
                    label="Total Minutes"
                    value={`${sumResponse.data.totalMinutes.toLocaleString()} min`}
                    sub="60 sec / min"
                    dataResultField="total-minutes"
                  />
                  <MetricCard
                    label="Formatted HH:MM:SS"
                    value={sumResponse.data.formattedHHMMSS}
                    sub="Digital standard"
                    dataResultField="formatted-hhmmss"
                  />
                </div>

                <div className="bg-surface-2/40 border border-border p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-sm">
                  <div className="space-y-0.5 min-w-0">
                    <p className="text-xs font-semibold text-text">
                      {durationRows.length} entries totaled {sumResponse.data.formattedDuration}
                    </p>
                    <p className="text-[11px] text-text-muted">
                      {sumResponse.data.totalHoursDecimal} decimal hours • {sumResponse.data.totalMinutes} total minutes
                    </p>
                  </div>
                  <CopyButton text={sumSummary} label="Copy Summary" className="bg-surface border border-border" />
                </div>
              </div>
            ) : (
              <div
                role="alert"
                aria-live="assertive"
                data-error-code={sumResponse.error.code}
                data-error-message={sumResponse.error.message}
                className="p-5 sm:p-6 rounded-2xl bg-error/5 border border-error/20 space-y-4 text-text min-w-0 w-full animate-in fade-in duration-200"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div className="space-y-1 min-w-0 flex-1">
                    <h3 className="font-bold text-sm sm:text-base text-red-600 dark:text-red-400">
                      Invalid Duration Entry
                    </h3>
                    <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                      {sumResponse.error.message}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-error/10 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={resetAll}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-surface-2 border border-border text-text hover:text-blue transition-colors cursor-pointer"
                  >
                    Reset Durations
                  </button>
                </div>
              </div>
            )
          ) : (
            offsetResponse.success ? (
              <div className="space-y-5 sm:space-y-6 min-w-0 w-full">
                {/* Machine-readable outputs */}
                <div className="sr-only" aria-hidden="true">
                  <output data-result-field="resulting-time">{offsetResponse.data.resultingTime}</output>
                  <output data-result-field="12-hour">{offsetResponse.data.formatted12Hour}</output>
                  <output data-result-field="day-shift">{offsetResponse.data.dayShift}</output>
                </div>

                <div className="flex items-center justify-between gap-3 min-w-0 w-full">
                  <h3 className="text-base sm:text-lg font-semibold text-text truncate">Resulting Clock Time</h3>
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
                      title={`Clock Offset Result: ${offsetResponse.data.resultingTime} (${offsetResponse.data.formatted12Hour}) — KaruviLab`}
                      onQrClick={() => setIsQrOpen(true)}
                    />
                  </div>
                </div>

                <div className="p-6 sm:p-8 bg-surface-2/40 rounded-3xl border border-border flex flex-col items-center justify-center text-center shadow-sm">
                  <span className="text-xs font-bold uppercase tracking-widest text-text-muted mb-2 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-blue" />
                    {op === 'add' ? 'Target Time' : 'Previous Time'}
                  </span>
                  <div
                    data-result-field="resulting-time"
                    className="text-3xl sm:text-5xl font-black text-blue tracking-tight font-mono tabular-nums mb-2"
                  >
                    {offsetResponse.data.resultingTime}
                  </div>
                  <p className="text-sm font-semibold text-text mb-1">
                    {offsetResponse.data.formatted12Hour} • {offsetResponse.data.formattedShiftText}
                  </p>
                  <p className="text-xs text-text-muted max-w-sm leading-relaxed">
                    {op === 'add' ? 'Added' : 'Subtracted'}{' '}
                    <strong className="text-blue font-bold">
                      {hoursOffset}h {minutesOffset}m {secondsOffset}s
                    </strong>{' '}
                    {op === 'add' ? 'to' : 'from'} {baseTime}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 w-full min-w-0">
                  <MetricCard
                    label="12-Hour Format"
                    value={offsetResponse.data.formatted12Hour}
                    sub="Standard AM/PM"
                    dataResultField="12-hour-time"
                  />
                  <MetricCard
                    label="24-Hour Format"
                    value={offsetResponse.data.formatted24Hour}
                    sub="Military / ISO"
                    dataResultField="24-hour-time"
                  />
                  <MetricCard
                    label="Day Rollover"
                    value={offsetResponse.data.formattedShiftText}
                    sub={offsetResponse.data.dayShift === 0 ? 'Same Day' : 'Day Boundary Shift'}
                    dataResultField="day-rollover"
                  />
                </div>

                <div className="bg-surface-2/40 border border-border p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-sm">
                  <div className="space-y-0.5 min-w-0">
                    <p className="text-xs font-semibold text-text">
                      {baseTime} {op === 'add' ? '+' : '-'} {hoursOffset}h {minutesOffset}m {secondsOffset}s = {offsetResponse.data.resultingTime}
                    </p>
                    <p className="text-[11px] text-text-muted">
                      {offsetResponse.data.formatted12Hour} • {offsetResponse.data.formattedShiftText}
                    </p>
                  </div>
                  <CopyButton text={offsetSummary} label="Copy Summary" className="bg-surface border border-border" />
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
                      Invalid Clock Offset
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
                    Reset to Default Time
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
