'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Timer, ArrowLeftRight, Clock, Calendar, Hash, Globe2 } from 'lucide-react';
import { m, AnimatePresence } from 'framer-motion';
import { cn } from '@/src/lib/utils';
import { CopyButton } from '@/components/ui/CopyButton';
import { useUrlState } from '@/src/hooks/useUrlState';
import { ShareButton } from '@/components/ui/ShareButton';
import { SharedResultBanner } from '@/components/ui/SharedResultBanner';
import { QRModal } from '@/components/ui/QRModal';

// Utility functions
function toRelative(date: Date, now: number): string {
  if (now === 0) return 'calculating...';
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const diff = (date.getTime() - now) / 1000;
  
  if (Math.abs(diff) < 60) return rtf.format(Math.round(diff), 'second');
  if (Math.abs(diff) < 3600) return rtf.format(Math.round(diff / 60), 'minute');
  if (Math.abs(diff) < 86400) return rtf.format(Math.round(diff / 3600), 'hour');
  if (Math.abs(diff) < 2592000) return rtf.format(Math.round(diff / 86400), 'day');
  if (Math.abs(diff) < 31536000) return rtf.format(Math.round(diff / 2592000), 'month');
  return rtf.format(Math.round(diff / 31536000), 'year');
}

export default function UnixTimestampClient() {
  const { state, setState, shareUrl, hasParams } = useUrlState({
    defaults: { ts: '0', mode: 'toHuman', date: '' },
    debounceMs: 400,
  });

  const mode = state.mode as 'toHuman' | 'toUnix';
  const rawTs = state.ts as string;
  const rawDate = state.date as string;
  const [isQrOpen, setIsQrOpen] = useState(false);

  // Initialize ts and date from live clock on first mount if defaults
  const [initDone, setInitDone] = useState(false);
  useEffect(() => {
    if (!initDone) {
      setInitDone(true);
      if (rawTs === '0' && rawDate === '') {
        setState({
          ts: Math.floor(Date.now() / 1000).toString(),
          date: new Date().toISOString().slice(0, 16),
        });
      }
    }
  }, [initDone, rawTs, rawDate, setState]);

  const inputTs = rawTs === '0' && !initDone ? '0' : rawTs;
  const inputDate = rawDate === '' && !initDone ? '' : rawDate;

  const setMode = useCallback((m: 'toHuman' | 'toUnix') => setState({ mode: m }), [setState]);
  const setInputTs = useCallback((v: string) => setState({ ts: v }), [setState]);
  const setInputDate = useCallback((v: string) => setState({ date: v }), [setState]);

  const [liveTime, setLiveTime] = useState<number>(0);
  const [timezone, setTimezone] = useState<string>(Intl.DateTimeFormat().resolvedOptions().timeZone);

  // Live clock
  useEffect(() => {
    setLiveTime(Math.floor(Date.now() / 1000));
    const interval = setInterval(() => {
      setLiveTime(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const parsedDate = useMemo(() => {
    if (mode === 'toHuman') {
      const num = Number(inputTs);
      if (isNaN(num)) return null;
      // Auto-detect ms vs seconds
      const ms = inputTs.length > 11 ? num : num * 1000;
      return new Date(ms);
    } else {
      const d = new Date(inputDate);
      if (isNaN(d.getTime())) return null;
      return d;
    }
  }, [inputTs, inputDate, mode]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <SharedResultBanner hasParams={hasParams} toolName="Unix Timestamp Converter" />
      <QRModal url={shareUrl} isOpen={isQrOpen} onClose={() => setIsQrOpen(false)} />
      
      {/* 1. Live Clock Header */}
      <div className="bg-surface border border-border rounded-4xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        <div>
          <h2 className="text-tiny font-bold uppercase tracking-widest-sm text-blue mb-1">Live Epoch Clock</h2>
          <p className="text-text-4 text-sm font-medium">Updates every second</p>
        </div>
        <div className="flex items-center gap-4 bg-bg border border-border px-6 py-4 rounded-2xl shadow-inner">
          <Clock className="w-5 h-5 text-blue animate-pulse" />
          <span className="text-2xl sm:text-3xl font-mono font-black text-text tracking-tighter">
            {liveTime}
          </span>
          <CopyButton text={liveTime.toString()} />
        </div>
      </div>

      {/* 2. Converter */}
      <div className="bg-surface border border-border p-6 sm:p-8 rounded-4xl shadow-sm space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black uppercase tracking-widest-lg text-blue flex items-center gap-3">
            <ArrowLeftRight className="w-4 h-4" />
            Converter
          </h2>
          
          <div className="flex bg-bg border border-border rounded-xl p-1">
            <button
              onClick={() => setMode('toHuman')}
              className={cn(
                "px-4 py-2 rounded-lg text-xs font-bold transition-all",
                mode === 'toHuman' ? "bg-surface text-text shadow-sm" : "text-text-4 hover:text-text-3"
              )}
            >
              Epoch to Date
            </button>
            <button
              onClick={() => setMode('toUnix')}
              className={cn(
                "px-4 py-2 rounded-lg text-xs font-bold transition-all",
                mode === 'toUnix' ? "bg-surface text-text shadow-sm" : "text-text-4 hover:text-text-3"
              )}
            >
              Date to Epoch
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-tiny font-bold uppercase tracking-widest-sm text-text-4 block">
            {mode === 'toHuman' ? 'Enter Timestamp (Seconds or Milliseconds)' : 'Enter Date and Time'}
          </label>
          
          {mode === 'toHuman' ? (
            <input 
              type="number" 
              value={inputTs} 
              onChange={(e) => setInputTs(e.target.value)}
              className="w-full bg-bg border border-border rounded-xl p-4 font-mono text-xl text-text focus:ring-2 focus:ring-blue/20 outline-none transition-all"
            />
          ) : (
            <input 
              type="datetime-local" 
              value={inputDate} 
              onChange={(e) => setInputDate(e.target.value)}
              className="w-full bg-bg border border-border rounded-xl p-4 font-mono text-xl text-text focus:ring-2 focus:ring-blue/20 outline-none transition-all"
            />
          )}
        </div>

        {parsedDate ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border/50">
            
            <div className="bg-bg border border-border rounded-2xl p-5 space-y-1">
              <span className="text-tiny font-black uppercase tracking-widest text-text-4 flex items-center gap-1.5"><Globe2 className="w-3 h-3"/> UTC / GMT</span>
              <div className="flex items-center justify-between gap-4">
                <span className="font-mono text-sm font-medium text-text">{parsedDate.toUTCString()}</span>
                <CopyButton text={parsedDate.toUTCString()} />
              </div>
            </div>

            <div className="bg-bg border border-border rounded-2xl p-5 space-y-1">
              <span className="text-tiny font-black uppercase tracking-widest text-text-4 flex items-center gap-1.5"><Calendar className="w-3 h-3"/> ISO 8601</span>
              <div className="flex items-center justify-between gap-4">
                <span className="font-mono text-sm font-medium text-text">{parsedDate.toISOString()}</span>
                <CopyButton text={parsedDate.toISOString()} />
              </div>
            </div>

            <div className="bg-bg border border-border rounded-2xl p-5 space-y-1">
              <span className="text-tiny font-black uppercase tracking-widest text-text-4 flex items-center gap-1.5"><Hash className="w-3 h-3"/> Unix Timestamp (Seconds)</span>
              <div className="flex items-center justify-between gap-4">
                <span className="font-mono text-sm font-medium text-text">{Math.floor(parsedDate.getTime() / 1000)}</span>
                <CopyButton text={Math.floor(parsedDate.getTime() / 1000).toString()} />
              </div>
            </div>

            <div className="bg-blue/5 border border-blue/20 rounded-2xl p-5 space-y-1">
              <span className="text-tiny font-black uppercase tracking-widest text-blue flex items-center gap-1.5"><Clock className="w-3 h-3"/> Relative Time</span>
              <div className="flex items-center justify-between gap-4">
                <span className="font-mono text-sm font-bold text-blue">{toRelative(parsedDate, liveTime * 1000)}</span>
              </div>
            </div>

          </div>
        ) : (
          <div className="p-6 bg-error/10 border border-error/20 rounded-2xl text-error text-sm font-medium text-center">
            Invalid input provided. Please enter a valid timestamp or date.
          </div>
        )}
      </div>

      {parsedDate && (
        <div className="flex justify-end">
          <ShareButton
            url={shareUrl}
            title={`Unix Timestamp ${Math.floor(parsedDate.getTime() / 1000)} = ${parsedDate.toUTCString()} — KaruviLab`}
            onQrClick={() => setIsQrOpen(true)}
          />
        </div>
      )}

    </div>
  );
}
