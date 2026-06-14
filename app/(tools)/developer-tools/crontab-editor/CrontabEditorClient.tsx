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
import { 
  parseCronExpression, 
  SPECIAL_EXPRESSIONS, 
  ParsedCron 
} from '@/src/features/crontab/utils/cron-logic';

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

export default function CrontabEditorClient() {
  const { state, setState, shareUrl, hasParams } = useUrlState({
    defaults: { expr: '* * * * *' },
    debounceMs: 400,
    encode: false,
  });

  const [localExpression, setLocalExpression] = useState<string>(state.expr as string);
  const [parsed, setParsed] = useState<ParsedCron>(parseCronExpression(state.expr as string));
  const [fontSize, setFontSize] = useState<number>(14);
  const [copied, setCopied] = useState<boolean>(false);
  const [cheatsheetOpen, setCheatsheetOpen] = useState<boolean>(false);
  const [isQrOpen, setIsQrOpen] = useState(false);

  useEffect(() => {
    if (state.expr && state.expr !== localExpression) {
      setLocalExpression(state.expr as string);
      setParsed(parseCronExpression(state.expr as string));
    }
  }, [state.expr]);

  const handleExpressionChange = (val: string) => {
    setLocalExpression(val);
    setParsed(parseCronExpression(val));
    setState({ expr: val });
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
      
      <div className="space-y-4">
        <label className="text-xs font-black uppercase tracking-[0.2em] text-blue">
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
        
        <div className="flex items-center gap-2 min-h-7 px-2">
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

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-blue">
          <Zap className="w-3.5 h-3.5" />
          <label className="text-xs font-black uppercase tracking-[0.2em]">Quick Presets</label>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 px-1 no-scrollbar snap-x">
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              onClick={() => handleExpressionChange(preset.expr)}
              className={cn(
                "px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap snap-start border",
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

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-blue">
          <List className="w-3.5 h-3.5" />
          <label className="text-xs font-black uppercase tracking-[0.2em]">Live Field Breakdown</label>
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
                <span className="text-xs font-black uppercase tracking-[0.2em] text-text-4 group-hover:text-blue transition-colors">
                  {field.label}
                </span>
                <span className="text-tiny font-bold text-text-4 bg-mat-base px-2 py-0.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
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
              <p className="text-xs text-text-3 font-bold leading-tight group-hover:text-text transition-colors min-h-8 line-clamp-2">
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

      {parsed.valid && parsed.nextRuns.length > 0 && (
        <m.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4 pt-4"
        >
          <div className="flex items-center gap-2 text-blue">
            <Clock className="w-3.5 h-3.5" />
            <label className="text-xs font-black uppercase tracking-[0.2em]">Execution Schedule</label>
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
                    <span className="text-xs font-bold text-text-4 uppercase tracking-widest">
                      {date.getFullYear()}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-blue bg-blue/5 px-3 py-1.5 rounded-xl border border-blue/10">
                  {formatRelative(date)}
                </span>
              </m.div>
            ))}
          </div>
        </m.div>
      )}

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
                <span className="text-xs font-bold text-text-4 uppercase">Master the cron syntax</span>
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
                    <h4 className="text-xs font-black uppercase tracking-[0.3em] text-blue border-b border-blue/10 pb-2">Special Characters</h4>
                    <ul className="space-y-3 text-xs font-bold text-text-3">
                      <li className="flex justify-between items-center"><code className="bg-blue/10 text-blue px-2 py-0.5 rounded-lg font-mono">*</code> <span className="text-text-4 font-medium uppercase tracking-tighter text-xs">Any value</span></li>
                      <li className="flex justify-between items-center"><code className="bg-blue/10 text-blue px-2 py-0.5 rounded-lg font-mono">,</code> <span className="text-text-4 font-medium uppercase tracking-tighter text-xs">Value list (1,3,5)</span></li>
                      <li className="flex justify-between items-center"><code className="bg-blue/10 text-blue px-2 py-0.5 rounded-lg font-mono">-</code> <span className="text-text-4 font-medium uppercase tracking-tighter text-xs">Range (1-5)</span></li>
                      <li className="flex justify-between items-center"><code className="bg-blue/10 text-blue px-2 py-0.5 rounded-lg font-mono">/</code> <span className="text-text-4 font-medium uppercase tracking-tighter text-xs">Step values (*/5)</span></li>
                    </ul>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-[0.3em] text-blue border-b border-blue/10 pb-2">Field Constraints</h4>
                    <ul className="space-y-3 text-xs font-bold text-text-3">
                      <li className="flex justify-between"><span>Min</span> <code className="text-text-2 font-mono">0</code></li>
                      <li className="flex justify-between"><span>Max Hour</span> <code className="text-text-2 font-mono">23</code></li>
                      <li className="flex justify-between"><span>Max Month</span> <code className="text-text-2 font-mono">12</code></li>
                      <li className="flex justify-between"><span>Max Day</span> <code className="text-text-2 font-mono">31</code></li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-[0.3em] text-blue border-b border-blue/10 pb-2">Example Recipes</h4>
                    <ul className="space-y-4">
                      <li className="group cursor-pointer" onClick={() => handleExpressionChange('*/5 * * * *')}>
                        <code className="text-text-2 font-mono text-xs block group-hover:text-blue transition-colors">*/5 * * * *</code>
                        <span className="text-xs font-bold text-text-4 uppercase tracking-tighter">Every 5 minutes</span>
                      </li>
                      <li className="group cursor-pointer" onClick={() => handleExpressionChange('0 0 * * 0')}>
                        <code className="text-text-2 font-mono text-xs block group-hover:text-blue transition-colors">0 0 * * 0</code>
                        <span className="text-xs font-bold text-text-4 uppercase tracking-tighter">Weekly Sunday</span>
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
