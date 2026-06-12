'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Clock, Check, Copy, ChevronDown, ChevronUp, AlertCircle, Calendar, Zap, List } from 'lucide-react';
import { m, AnimatePresence } from 'framer-motion';
import { cn } from '@/src/lib/utils';
import { FocusModeWrapper } from '@/components/ui/FocusModeWrapper';
import { useUrlState } from '@/src/hooks/useUrlState';
import { ShareButton } from '@/components/ui/ShareButton';
import { SharedResultBanner } from '@/components/ui/SharedResultBanner';
import { QRModal } from '@/components/ui/QRModal';

// --- SECTION A: Cron Parser Engine (Pure Functions) ---

type CronFieldType = 'minute' | 'hour' | 'dom' | 'month' | 'dow';

interface CronField {
  label: string;
  value: string;
  min: number;
  max: number;
  description: string;
}

interface ParsedCron {
  valid: boolean;
  fields: CronField[];
  humanReadable: string;
  nextRuns: Date[];
  error?: string;
}

const MONTH_NAMES = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const DAY_NAMES = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

const SPECIAL_EXPRESSIONS: Record<string, string> = {
  '@yearly':   '0 0 1 1 *',
  '@annually': '0 0 1 1 *',
  '@monthly':  '0 0 1 * *',
  '@weekly':   '0 0 * * 0',
  '@daily':    '0 0 * * *',
  '@midnight': '0 0 * * *',
  '@hourly':   '0 * * * *',
  '@reboot':   'REBOOT',
};

function validateField(value: string, min: number, max: number): boolean {
  if (!value) return false;
  if (value === '*') return true;
  
  // List
  if (value.includes(',')) {
    return value.split(',').every(v => validateField(v, min, max));
  }
  
  // Step
  if (value.includes('/')) {
    const parts = value.split('/');
    if (parts.length !== 2) return false;
    const [range, step] = parts;
    if (!range || !step || isNaN(Number(step))) return false;
    return validateField(range, min, max);
  }
  
  // Range
  if (value.includes('-')) {
    const parts = value.split('-');
    if (parts.length !== 2) return false;
    const [start, end] = parts;
    if (!start || !end || isNaN(Number(start)) || isNaN(Number(end))) return false;
    const s = Number(start);
    const e = Number(end);
    return s >= min && e <= max && s <= e;
  }
  
  const num = Number(value);
  return !isNaN(num) && num >= min && num <= max;
}

function getOrdinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  const index = (v - 20) % 10;
  return s[index] || s[v] || s[0] || "th";
}

function formatValue(val: string, type: CronFieldType): string {
  const num = Number(val);
  let result: string = val;
  if (type === 'month') {
    const name = MONTH_NAMES[num - 1];
    if (typeof name === 'string') result = name;
  } else if (type === 'dow') {
    const name = DAY_NAMES[num];
    if (typeof name === 'string') result = name;
  } else if (type === 'hour') {
    result = `${num % 12 || 12}${num >= 12 ? ' PM' : ' AM'}`;
  }
  return result;
}

function fieldToHuman(value: string, type: CronFieldType): string {
  if (value === '*') return 'every ' + type.replace('dom', 'day').replace('dow', 'day of week');
  
  if (value.includes('/')) {
    const parts = value.split('/');
    const range = parts[0] || '*';
    const step = parts[1] || '1';
    const stepStr = `every ${step}${getOrdinal(Number(step))} ${type}`;
    if (range === '*') return stepStr;
    return `${stepStr} from ${fieldToHuman(range, type)}`;
  }
  
  if (value.includes(',')) {
    return value.split(',').map(v => fieldToHuman(v, type)).join(' and ');
  }
  
  if (value.includes('-')) {
    const parts = value.split('-');
    const start = parts[0] || '';
    const end = parts[1] || '';
    return `from ${formatValue(start, type)} through ${formatValue(end, type)}`;
  }
  
  return formatValue(value, type);
}

function cronToHuman(expr: string): string {
  if (expr === 'REBOOT') return 'At reboot';
  if (SPECIAL_EXPRESSIONS[expr]) {
    const standard = SPECIAL_EXPRESSIONS[expr] || '';
    return `${expr} equivalents: ${cronToHuman(standard)}`;
  }

  const parts = expr.split(/\s+/);
  if (parts.length !== 5) return 'Invalid expression';

  const [min, hour, dom, month, dow] = parts;
  if (!min || !hour || !dom || !month || !dow) return 'Invalid expression';
  
  if (expr === '* * * * *') return 'Every minute';
  if (min === '0' && hour === '*' && dom === '*' && month === '*' && dow === '*') return 'Every hour';
  if (min === '0' && hour === '0' && dom === '*' && month === '*' && dow === '*') return 'Every day at midnight';

  let desc = 'At ';
  
  if (min !== '*' && hour !== '*') {
    // Specific time
    if (!min.includes(',') && !min.includes('/') && !min.includes('-') && 
        !hour.includes(',') && !hour.includes('/') && !hour.includes('-')) {
      desc = `At ${formatValue(hour, 'hour')}:${min.padStart(2, '0')} `;
    } else {
      desc = `At ${fieldToHuman(min, 'minute')} of ${fieldToHuman(hour, 'hour')} `;
    }
  } else if (min !== '*') {
    desc = `At ${fieldToHuman(min, 'minute')} of every hour `;
  } else if (hour !== '*') {
    desc = `Every minute of ${fieldToHuman(hour, 'hour')} `;
  } else {
    desc = 'Every minute ';
  }

  if (dom !== '*' || month !== '*' || dow !== '*') {
    desc += 'on ';
    if (dom !== '*') desc += `${fieldToHuman(dom, 'dom')} `;
    if (month !== '*') {
       if (dom !== '*') desc += 'in ';
       desc += `${fieldToHuman(month, 'month')} `;
    }
    if (dow !== '*') {
       if (dom !== '*' || month !== '*') desc += 'on ';
       desc += `${fieldToHuman(dow, 'dow')} `;
    }
  } else {
    desc += 'every day';
  }

  return desc.trim().replace(/\s+/g, ' ');
}

function getValues(field: string, min: number, max: number): number[] {
  if (!field) return [];
  if (field === '*') {
    const res = [];
    for (let i = min; i <= max; i++) res.push(i);
    return res;
  }
  
  if (field.includes(',')) {
    return Array.from(new Set(field.split(',').flatMap(v => getValues(v, min, max)))).sort((a, b) => a - b);
  }
  
  if (field.includes('/')) {
    const parts = field.split('/');
    const range = parts[0] || '*';
    const step = Number(parts[1] || '1');
    const rangeVals = getValues(range, min, max);
    return rangeVals.filter((_, i) => i % step === 0);
  }
  
  if (field.includes('-')) {
    const parts = field.split('-').map(Number);
    const start = parts[0] ?? min;
    const end = parts[1] ?? max;
    const res = [];
    for (let i = start; i <= end; i++) res.push(i);
    return res;
  }
  
  return [Number(field)];
}

function getNextRuns(expr: string, count: number): Date[] {
  if (expr === 'REBOOT') return [];
  const realExpr = SPECIAL_EXPRESSIONS[expr] || expr;
  const parts = realExpr.split(/\s+/);
  if (parts.length !== 5) return [];

  const [min, hour, dom, month, dow] = parts;
  if (!min || !hour || !dom || !month || !dow) return [];

  const mins = getValues(min, 0, 59);
  const hours = getValues(hour, 0, 23);
  const doms = getValues(dom, 1, 31);
  const months = getValues(month, 1, 12);
  const dows = getValues(dow, 0, 7).map(d => d === 7 ? 0 : d); // Normalize Sunday

  const runs: Date[] = [];
  let current = new Date();
  current.setSeconds(0, 0);
  current.setMinutes(current.getMinutes() + 1);

  // Simple brute force search for next 5 runs
  let iterations = 0;
  const maxIterations = 50000; // Safety cap

  while (runs.length < count && iterations < maxIterations) {
    iterations++;
    const mo = current.getMonth() + 1;
    const d = current.getDate();
    const h = current.getHours();
    const m = current.getMinutes();
    const dw = current.getDay();

    if (months.includes(mo) && doms.includes(d) && hours.includes(h) && mins.includes(m) && dows.includes(dw)) {
      runs.push(new Date(current));
    }
    
    current.setMinutes(current.getMinutes() + 1);
  }

  return runs;
}

function parseCronExpression(expr: string): ParsedCron {
  if (!expr) return { valid: false, fields: [], humanReadable: '', nextRuns: [], error: 'Expression is empty' };
  
  if (expr === '@reboot') {
    return {
      valid: true,
      fields: [],
      humanReadable: 'At reboot',
      nextRuns: [],
    };
  }

  const normalized = SPECIAL_EXPRESSIONS[expr] || expr;
  const parts = normalized.split(/\s+/);

  if (parts.length !== 5) {
    return { valid: false, fields: [], humanReadable: '', nextRuns: [], error: 'Standard cron requires 5 fields' };
  }

  const fields: CronField[] = [
    { label: 'Minute', value: parts[0] || '*', min: 0, max: 59, description: fieldToHuman(parts[0] || '*', 'minute') },
    { label: 'Hour', value: parts[1] || '*', min: 0, max: 23, description: fieldToHuman(parts[1] || '*', 'hour') },
    { label: 'Day of Month', value: parts[2] || '*', min: 1, max: 31, description: fieldToHuman(parts[2] || '*', 'dom') },
    { label: 'Month', value: parts[3] || '*', min: 1, max: 12, description: fieldToHuman(parts[3] || '*', 'month') },
    { label: 'Day of Week', value: parts[4] || '*', min: 0, max: 7, description: fieldToHuman(parts[4] || '*', 'dow') },
  ];

  const invalidField = fields.find(f => !validateField(f.value, f.min, f.max));
  if (invalidField) {
    return { valid: false, fields, humanReadable: '', nextRuns: [], error: `Invalid ${invalidField.label.toLowerCase()} value: ${invalidField.value}` };
  }

  return {
    valid: true,
    fields,
    humanReadable: cronToHuman(expr),
    nextRuns: getNextRuns(expr, 5),
  };
}

// --- SECTION C: Presets ---

const PRESETS = [
  { label: 'Every minute',   expr: '* * * * *' },
  { label: 'Every 5 min',    expr: '*/5 * * * *' },
  { label: 'Every 15 min',   expr: '*/15 * * * *' },
  { label: 'Every 30 min',   expr: '*/30 * * * *' },
  { label: 'Hourly',         expr: '0 * * * *' },
  { label: 'Daily midnight', expr: '0 0 * * *' },
  { label: 'Daily 9 AM',     expr: '0 9 * * *' },
  { label: 'Weekdays 9 AM',  expr: '0 9 * * 1-5' },
  { label: 'Weekly Sunday',  expr: '0 0 * * 0' },
  { label: 'Monthly 1st',    expr: '0 0 1 * *' },
  { label: 'Yearly Jan 1',   expr: '0 0 1 1 *' },
  { label: '@hourly',        expr: '@hourly' },
  { label: '@daily',         expr: '@daily' },
  { label: '@weekly',        expr: '@weekly' },
  { label: '@monthly',       expr: '@monthly' },
  { label: '@yearly',        expr: '@yearly' },
  { label: '@reboot',        expr: '@reboot' },
];

// --- SECTION B & E: UI and State ---

export default function CrontabEditorClient() {
  const { state, setState, shareUrl, hasParams } = useUrlState({
    defaults: { expr: '* * * * *' },
    debounceMs: 400,
    encode: false,
  });

  // Local state for immediate UI feedback
  const [localExpression, setLocalExpression] = useState<string>(state.expr as string);
  const [parsed, setParsed] = useState<ParsedCron>(parseCronExpression(state.expr as string));
  const [fontSize, setFontSize] = useState<number>(14);
  const [copied, setCopied] = useState<boolean>(false);
  const [cheatsheetOpen, setCheatsheetOpen] = useState<boolean>(false);
  const [isQrOpen, setIsQrOpen] = useState(false);

  // Sync local state when URL state changes (e.g., initial load or browser back/forward)
  useEffect(() => {
    if (state.expr && state.expr !== localExpression) {
      setLocalExpression(state.expr as string);
      setParsed(parseCronExpression(state.expr as string));
    }
  }, [state.expr]);

  const handleExpressionChange = (val: string) => {
    setLocalExpression(val);
    setParsed(parseCronExpression(val));
    setState({ expr: val }); // Debounced update to URL
  };

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(localExpression);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [localExpression]);

  const handleFieldChange = (index: number, val: string) => {
    const parts = localExpression.split(/\s+/);
    if (parts.length === 5) {
      parts[index] = val;
      handleExpressionChange(parts.join(' '));
    } else if (SPECIAL_EXPRESSIONS[localExpression]) {
       // If it's a special expression like @hourly, convert to standard first then edit
       const standard = SPECIAL_EXPRESSIONS[localExpression]!.split(/\s+/);
       standard[index] = val;
       handleExpressionChange(standard.join(' '));
    }
  };

  const formatRelative = (date: Date) => {
    const diff = date.getTime() - Date.now();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} from now`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} from now`;
    if (mins > 0) return `${mins} minute${mins > 1 ? 's' : ''} from now`;
    return 'just now';
  };

  return (
    <FocusModeWrapper
      toolId="crontab-editor"
      toolName="Crontab Editor"
      language="cron"
      onFontSizeChange={setFontSize}
    >
      <div className="max-w-4xl mx-auto space-y-8 pb-12 w-full">
      <SharedResultBanner hasParams={hasParams} toolName="Crontab Editor" />
      <QRModal url={shareUrl} isOpen={isQrOpen} onClose={() => setIsQrOpen(false)} />
      
      {/* 1. Expression Input */}
      <div className="space-y-4">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-blue">
          Cron Expression
        </label>
        <div className="relative group">
          <input
            type="text"
            value={localExpression}
            onChange={(e) => handleExpressionChange(e.target.value)}
            className={cn(
              "font-mono text-xl md:text-2xl bg-bg rounded-3xl p-6 pr-16 text-text w-full transition-all outline-none",
              parsed.valid 
                ? "border border-green-500/30 focus:border-green-500/60 focus:ring-8 focus:ring-green-500/5 shadow-sm" 
                : "border border-red-500/30 focus:border-red-500/60 focus:ring-8 focus:ring-red-500/5 shadow-sm"
            )}
            style={{ fontSize: `${fontSize + 4}px` }}
            placeholder="* * * * *"
          />
          <button
            onClick={handleCopy}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-surface hover:bg-mat-hover border border-mat-border rounded-2xl transition-all active:scale-95 group-hover:shadow-md"
            title="Copy Expression"
          >
            {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-text-3" />}
          </button>
        </div>
        
        <div className="flex items-center gap-2 min-h-[28px] px-2">
          {parsed.valid ? (
            <m.div 
              initial={{ opacity: 0, y: -5 }} 
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-green-500"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-green-600 dark:text-green-400 font-bold text-base leading-tight">
                {parsed.humanReadable}
              </span>
            </m.div>
          ) : (
            <m.div 
              initial={{ opacity: 0, y: -5 }} 
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-red-500"
            >
              <AlertCircle className="w-4 h-4" />
              <span className="text-red-600 dark:text-red-400 font-bold text-sm">
                {parsed.error}
              </span>
            </m.div>
          )}
        </div>
      </div>

      {parsed.valid && (
        <div className="flex justify-end">
          <ShareButton
            url={shareUrl}
            title={`Cron: "${localExpression}" — ${parsed.humanReadable} — KaruviLab`}
            onQrClick={() => setIsQrOpen(true)}
          />
        </div>
      )}

      {/* 2. Presets */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-blue">
          <Zap className="w-3.5 h-3.5" />
          <label className="text-[10px] font-black uppercase tracking-[0.2em]">Quick Presets</label>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 px-1 no-scrollbar snap-x">
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              onClick={() => handleExpressionChange(preset.expr)}
              className={cn(
                "px-5 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap snap-start border",
                localExpression === preset.expr
                  ? "bg-blue/10 border-blue/40 text-blue shadow-lg shadow-blue/5"
                  : "bg-surface border-mat-border text-text-4 hover:border-blue/30 hover:text-blue"
              )}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Field Breakdown Cards */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-blue">
          <List className="w-3.5 h-3.5" />
          <label className="text-[10px] font-black uppercase tracking-[0.2em]">Live Field Breakdown</label>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {parsed.fields.map((field, i) => (
            <m.div
              key={field.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}
              className={cn(
                "group rounded-3xl p-5 space-y-3 border transition-all hover:shadow-xl hover:-translate-y-1",
                field.value === '*' 
                  ? "bg-mat-surface border-mat-border" 
                  : "bg-blue/5 border-blue/20 shadow-sm"
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-4 group-hover:text-blue transition-colors">
                  {field.label}
                </span>
                <span className="text-[9px] font-bold text-text-4 bg-mat-base px-2 py-0.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  {field.min}-{field.max}
                </span>
              </div>
              <input
                type="text"
                value={field.value}
                onChange={(e) => handleFieldChange(i, e.target.value)}
                className="w-full bg-transparent font-mono text-2xl font-black text-text focus:outline-none focus:text-blue transition-colors"
                style={{ fontSize: `${fontSize + 8}px` }}
              />
              <p className="text-[11px] text-text-3 font-bold leading-tight group-hover:text-text transition-colors min-h-[32px] line-clamp-2">
                {field.description}
              </p>
            </m.div>
          ))}
          {localExpression === '@reboot' && (
            <div className="col-span-full bg-blue/5 border border-blue/20 p-8 rounded-4xl text-center shadow-inner">
              <Zap className="w-8 h-8 text-blue mx-auto mb-3 opacity-50" />
              <p className="text-blue font-black uppercase tracking-[0.3em] text-sm">Special Shortcut: @reboot</p>
              <p className="text-text-4 text-xs font-bold mt-2 uppercase tracking-widest">Triggers once during system bootstrap</p>
            </div>
          )}
        </div>
      </div>

      {/* 4. Next 5 Run Times */}
      {parsed.valid && parsed.nextRuns.length > 0 && (
        <m.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4 pt-4"
        >
          <div className="flex items-center gap-2 text-blue">
            <Clock className="w-3.5 h-3.5" />
            <label className="text-[10px] font-black uppercase tracking-[0.2em]">Execution Schedule</label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {parsed.nextRuns.map((date, i) => (
              <m.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between p-5 bg-surface border border-mat-border rounded-2xl group hover:border-blue/30 transition-all shadow-sm hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <span className={cn(
                    "w-8 h-8 flex items-center justify-center rounded-xl text-xs font-black",
                    i === 0 ? "bg-blue text-white shadow-lg shadow-blue/20" : "bg-mat-base text-text-4"
                  )}>{i + 1}</span>
                  <div className="space-y-0.5">
                    <span className="text-sm font-black text-text group-hover:text-blue transition-colors block">
                      {date.toLocaleString('en-US', { 
                        weekday: 'short', 
                        day: '2-digit', 
                        month: 'short', 
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </span>
                    <span className="text-[10px] font-bold text-text-4 uppercase tracking-widest">
                      {date.getFullYear()}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-blue bg-blue/5 px-3 py-1.5 rounded-xl border border-blue/10">
                  {formatRelative(date)}
                </span>
              </m.div>
            ))}
          </div>
        </m.div>
      )}

      {/* 5. Reference Cheatsheet */}
      <div className="pt-8 no-print">
        <div className="bg-surface border border-mat-border rounded-3xl overflow-hidden shadow-sm">
          <button
            onClick={() => setCheatsheetOpen(!cheatsheetOpen)}
            className="flex items-center justify-between w-full p-6 hover:bg-mat-hover transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue/5 flex items-center justify-center text-blue">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="font-black uppercase tracking-[0.2em] text-xs block">Reference Cheatsheet</span>
                <span className="text-[10px] font-bold text-text-4 uppercase">Master the cron syntax</span>
              </div>
            </div>
            <div className="w-8 h-8 rounded-lg bg-mat-base flex items-center justify-center text-text-4">
              {cheatsheetOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </button>

          <AnimatePresence>
            {cheatsheetOpen && (
              <m.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-10 border-t border-mat-border bg-mat-base/20">
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue border-b border-blue/10 pb-2">Special Characters</h4>
                    <ul className="space-y-3 text-[12px] font-bold text-text-3">
                      <li className="flex justify-between items-center"><code className="bg-blue/10 text-blue px-2 py-0.5 rounded-lg font-mono">*</code> <span className="text-text-4 font-medium uppercase tracking-tighter text-[11px]">Any value</span></li>
                      <li className="flex justify-between items-center"><code className="bg-blue/10 text-blue px-2 py-0.5 rounded-lg font-mono">,</code> <span className="text-text-4 font-medium uppercase tracking-tighter text-[11px]">Value list (1,3,5)</span></li>
                      <li className="flex justify-between items-center"><code className="bg-blue/10 text-blue px-2 py-0.5 rounded-lg font-mono">-</code> <span className="text-text-4 font-medium uppercase tracking-tighter text-[11px]">Range (1-5)</span></li>
                      <li className="flex justify-between items-center"><code className="bg-blue/10 text-blue px-2 py-0.5 rounded-lg font-mono">/</code> <span className="text-text-4 font-medium uppercase tracking-tighter text-[11px]">Step values (*/5)</span></li>
                    </ul>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue border-b border-blue/10 pb-2">Field Constraints</h4>
                    <ul className="space-y-3 text-[12px] font-bold text-text-3">
                      <li className="flex justify-between"><span>Min</span> <code className="text-text-2 font-mono">0</code></li>
                      <li className="flex justify-between"><span>Max Hour</span> <code className="text-text-2 font-mono">23</code></li>
                      <li className="flex justify-between"><span>Max Month</span> <code className="text-text-2 font-mono">12</code></li>
                      <li className="flex justify-between"><span>Max Day</span> <code className="text-text-2 font-mono">31</code></li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue border-b border-blue/10 pb-2">Example Recipes</h4>
                    <ul className="space-y-4">
                      <li className="group cursor-pointer" onClick={() => handleExpressionChange('*/5 * * * *')}>
                        <code className="text-text-2 font-mono text-xs block group-hover:text-blue transition-colors">*/5 * * * *</code>
                        <span className="text-[10px] font-bold text-text-4 uppercase tracking-tighter">Every 5 minutes</span>
                      </li>
                      <li className="group cursor-pointer" onClick={() => handleExpressionChange('0 0 * * 0')}>
                        <code className="text-text-2 font-mono text-xs block group-hover:text-blue transition-colors">0 0 * * 0</code>
                        <span className="text-[10px] font-bold text-text-4 uppercase tracking-tighter">Weekly Sunday</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </m.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      </div>
    </FocusModeWrapper>
  );
}
