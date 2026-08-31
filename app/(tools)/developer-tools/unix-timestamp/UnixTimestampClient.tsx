import { blobManager } from "@/src/lib/blob-manager";
'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Clock, 
  Calendar, 
  Hash, 
  Globe2, 
  Copy, 
  Check, 
  Plus, 
  Minus, 
  FileText, 
  Code2, 
  History, 
  RotateCcw, 
  Share2, 
  QrCode, 
  Download, 
  AlertTriangle,
  ArrowRightLeft,
  Sparkles
} from 'lucide-react';
import { useUrlState } from '@/src/hooks/useUrlState';
import { SharedResultBanner } from '@/components/ui/SharedResultBanner';
import { QRModal } from '@/components/ui/QRModal';
import { ToolWorkspace } from '@/components/ui/ToolWorkspace';
import { ToolInput } from '@/components/ui/ToolInput';
import { ToolResultArea } from '@/components/ui/ToolResultArea';
import {
  parseEpoch,
  convertDateToEpoch,
  calculateEpochOffset,
  parseBatchTimestamps,
  exportBatchToCsv,
  EpochUnit,
  ArithmeticUnit,
  TIMEZONE_PRESETS,
  EPOCH_PRESETS,
  CODE_SNIPPETS,
  TimestampInfo,
  BatchConversionRow
} from '@/src/features/developer-tools/unix-timestamp/engine';

type TabMode = 'single' | 'arithmetic' | 'batch' | 'code';
type SingleSubMode = 'epochToDate' | 'dateToEpoch';

export default function UnixTimestampClient() {
  const { state, setState, shareUrl, hasParams } = useUrlState({
    defaults: { tab: 'single', subMode: 'epochToDate', ts: '', date: '', tz: 'UTC' },
    debounceMs: 300,
  });

  const activeTab = (state.tab as TabMode) || 'single';
  const subMode = (state.subMode as SingleSubMode) || 'epochToDate';
  const selectedTz = (state.tz as string) || 'UTC';

  // Live ticking clock
  const [liveEpochSec, setLiveEpochSec] = useState<number>(() => Math.floor(Date.now() / 1000));
  const [liveCopiedUnit, setLiveCopiedUnit] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveEpochSec(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Single mode state
  const [inputTs, setInputTs] = useState<string>(() => (state.ts as string) || String(Math.floor(Date.now() / 1000)));
  const [inputDate, setInputDate] = useState<string>(() => (state.date as string) || new Date().toISOString().slice(0, 10));
  const [inputTime, setInputTime] = useState<string>('12:00:00');
  const [unitOverride, setUnitOverride] = useState<EpochUnit | 'auto'>('auto');

  // Copy status indicators
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isQrOpen, setIsQrOpen] = useState(false);

  // Conversion History
  const [history, setHistory] = useState<Array<{ id: string; label: string; ts: number; time: string }>>([]);

  // Arithmetic State
  const [arithmeticBaseTs, setArithmeticBaseTs] = useState<string>(String(Math.floor(Date.now() / 1000)));
  const [arithmeticOp, setArithmeticOp] = useState<'add' | 'subtract'>('add');
  const [arithmeticAmount, setArithmeticAmount] = useState<number>(1);
  const [arithmeticUnit, setArithmeticUnit] = useState<ArithmeticUnit>('days');

  // Batch State
  const [batchInput, setBatchInput] = useState<string>(
    `0\n946684800\n1000000000\n1771987200\n2147483647\n2026-08-27T03:40:00Z`
  );
  const [batchRows, setBatchRows] = useState<BatchConversionRow[]>([]);

  // Selected Code Snippet
  const [selectedLang, setSelectedLang] = useState<string>(CODE_SNIPPETS[0]?.language || 'JavaScript / TypeScript');

  // Parse Single Result
  const singleResult: TimestampInfo | null = useMemo(() => {
    if (subMode === 'epochToDate') {
      const forced = unitOverride === 'auto' ? undefined : unitOverride;
      return parseEpoch(inputTs, forced);
    } else {
      return convertDateToEpoch(inputDate, inputTime, selectedTz);
    }
  }, [subMode, inputTs, unitOverride, inputDate, inputTime, selectedTz]);

  // Record history on successful parse
  useEffect(() => {
    if (singleResult) {
      setHistory(prev => {
        const item = {
          id: String(Date.now()),
          label: `${singleResult.epochSeconds} (${singleResult.iso8601})`,
          ts: singleResult.epochSeconds,
          time: new Date().toLocaleTimeString()
        };
        const exists = prev.some(h => h.ts === item.ts);
        if (exists) return prev;
        return [item, ...prev].slice(0, 10);
      });
    }
  }, [singleResult]);

  // Parse Arithmetic Result
  const arithmeticResult: TimestampInfo | null = useMemo(() => {
    const num = Number(arithmeticBaseTs);
    if (isNaN(num)) return null;
    return calculateEpochOffset(num, arithmeticOp, arithmeticAmount, arithmeticUnit);
  }, [arithmeticBaseTs, arithmeticOp, arithmeticAmount, arithmeticUnit]);

  // Handle Tab Switch
  const handleTabChange = (tabId: string) => {
    setState({ tab: tabId });
  };

  // Quick Copy Handler
  const handleCopy = useCallback((text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  }, []);

  const handleLiveCopy = useCallback((unit: string, val: string) => {
    navigator.clipboard.writeText(val);
    setLiveCopiedUnit(unit);
    setTimeout(() => setLiveCopiedUnit(null), 2000);
  }, []);

  // Process Batch
  const handleBatchConvert = useCallback(() => {
    setBatchRows(parseBatchTimestamps(batchInput));
  }, [batchInput]);

  useEffect(() => {
    handleBatchConvert();
  }, [handleBatchConvert]);

  // Export Batch CSV
  const handleDownloadCsv = () => {
    const csvContent = exportBatchToCsv(batchRows);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    blobManager.download(blob, `unix_timestamps_export_${Date.now()}.csv`);
  };

  // Export Batch JSON
  const handleDownloadJson = () => {
    const jsonContent = JSON.stringify(batchRows, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    blobManager.download(blob, `unix_timestamps_export_${Date.now()}.json`);
  };

  return (
    <div className="w-full space-y-6">
      <SharedResultBanner hasParams={hasParams} toolName="Unix Timestamp Converter" />
      <QRModal url={shareUrl} isOpen={isQrOpen} onClose={() => setIsQrOpen(false)} />

      {/* Live Current Epoch Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-surface-2 border border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary animate-pulse">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-text-muted">Live Unix Epoch</div>
            <div className="text-2xl sm:text-3xl font-mono font-extrabold text-primary">
              {liveEpochSec.toLocaleString()} <span className="text-xs font-sans text-text-muted font-normal">seconds</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleLiveCopy('sec', String(liveEpochSec))}
            className="px-3 py-1.5 rounded-lg bg-surface border border-border text-xs font-mono font-medium hover:border-primary transition-colors flex items-center gap-1.5 text-text"
          >
            {liveCopiedUnit === 'sec' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-text-muted" />}
            Copy Sec
          </button>
          <button
            onClick={() => handleLiveCopy('ms', String(liveEpochSec * 1000))}
            className="px-3 py-1.5 rounded-lg bg-surface border border-border text-xs font-mono font-medium hover:border-primary transition-colors flex items-center gap-1.5 text-text"
          >
            {liveCopiedUnit === 'ms' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-text-muted" />}
            Copy Millis (ms)
          </button>
          <button
            onClick={() => handleLiveCopy('ns', String(BigInt(liveEpochSec) * 1000000000n))}
            className="px-3 py-1.5 rounded-lg bg-surface border border-border text-xs font-mono font-medium hover:border-primary transition-colors flex items-center gap-1.5 text-text"
          >
            {liveCopiedUnit === 'ns' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-text-muted" />}
            Copy Nanos (ns)
          </button>
          <button
            onClick={() => setIsQrOpen(true)}
            aria-label="Share conversion"
            className="p-2 rounded-lg bg-surface border border-border hover:border-primary transition-colors text-text-muted hover:text-primary"
          >
            <QrCode className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Tab Workspace */}
      <ToolWorkspace
        layout="split"
        tabs={{
          options: [
            { id: 'single', label: 'Single Converter' },
            { id: 'arithmetic', label: 'Epoch Math & Offset' },
            { id: 'batch', label: 'Batch Converter' },
            { id: 'code', label: 'Code Snippets' }
          ],
          activeId: activeTab,
          onChange: handleTabChange
        }}
        input={
          <div className="space-y-5">
            {activeTab === 'single' && (
              <div className="space-y-4">
                {/* Submode Switcher */}
                <div className="flex items-center gap-2 p-1 bg-surface-2 rounded-xl border border-border">
                  <button
                    onClick={() => setState({ subMode: 'epochToDate' })}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                      subMode === 'epochToDate' ? 'bg-primary text-white shadow-sm' : 'text-text-muted hover:text-text'
                    }`}
                  >
                    Epoch → Date & Time
                  </button>
                  <button
                    onClick={() => setState({ subMode: 'dateToEpoch' })}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                      subMode === 'dateToEpoch' ? 'bg-primary text-white shadow-sm' : 'text-text-muted hover:text-text'
                    }`}
                  >
                    Date & Time → Epoch
                  </button>
                </div>

                {subMode === 'epochToDate' ? (
                  <div className="space-y-4">
                    <ToolInput
                      label="Enter Unix Timestamp (Seconds / Millis / Micros / Nanos)"
                      value={inputTs}
                      onChange={(v) => {
                        setInputTs(v);
                        setState({ ts: v });
                      }}
                      placeholder="e.g. 1771987200 or 1771987200000"
                      mono
                    />

                    {/* Precision Unit Selection */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-text-muted">Unit Resolution:</label>
                      <div className="flex flex-wrap gap-2">
                        {(['auto', 'seconds', 'milliseconds', 'microseconds', 'nanoseconds'] as const).map(u => (
                          <button
                            key={u}
                            onClick={() => setUnitOverride(u)}
                            className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
                              unitOverride === u
                                ? 'bg-primary/10 border-primary text-primary font-bold'
                                : 'bg-surface border-border text-text-muted hover:text-text'
                            }`}
                          >
                            {u === 'auto' ? '⚡ Auto-Detect' : u}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Presets */}
                    <div className="space-y-1.5 pt-2">
                      <label className="text-xs font-bold text-text-muted">Quick Epoch Presets:</label>
                      <div className="flex flex-wrap gap-2">
                        {EPOCH_PRESETS.map(p => (
                          <button
                            key={p.label}
                            onClick={() => {
                              setInputTs(p.value);
                              setState({ ts: p.value });
                            }}
                            className="px-2.5 py-1 rounded-md bg-surface border border-border text-xs text-text-muted hover:border-primary hover:text-text transition-colors"
                          >
                            {p.label}
                          </button>
                        ))}
                        <button
                          onClick={() => {
                            const nowSec = String(Math.floor(Date.now() / 1000));
                            setInputTs(nowSec);
                            setState({ ts: nowSec });
                          }}
                          className="px-2.5 py-1 rounded-md bg-primary/10 border border-primary/30 text-xs font-bold text-primary hover:bg-primary/20 transition-colors"
                        >
                          ⚡ Current Now
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label htmlFor="unix-date-input" className="text-xs font-bold text-text-muted">Date (YYYY-MM-DD):</label>
                        <input
                          id="unix-date-input"
                          type="date"
                          value={inputDate}
                          onChange={(e) => {
                            setInputDate(e.target.value);
                            setState({ date: e.target.value });
                          }}
                          className="w-full px-3 py-2 bg-surface border border-border rounded-xl font-mono text-sm text-text focus:outline-none focus:border-primary"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label htmlFor="unix-time-input" className="text-xs font-bold text-text-muted">Time (HH:mm:ss):</label>
                        <input
                          id="unix-time-input"
                          type="time"
                          step="1"
                          value={inputTime}
                          onChange={(e) => setInputTime(e.target.value)}
                          className="w-full px-3 py-2 bg-surface border border-border rounded-xl font-mono text-sm text-text focus:outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="unix-tz-select" className="text-xs font-bold text-text-muted">Input Timezone:</label>
                      <select
                        id="unix-tz-select"
                        value={selectedTz}
                        onChange={(e) => setState({ tz: e.target.value })}
                        className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-sm font-medium text-text focus:outline-none focus:border-primary"
                      >
                        {TIMEZONE_PRESETS.map(tz => (
                          <option key={tz.id} value={tz.id}>{tz.label}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => {
                          const d = new Date();
                          setInputDate(d.toISOString().slice(0, 10));
                          setInputTime(d.toTimeString().slice(0, 8));
                        }}
                        className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20 text-xs font-bold hover:bg-primary/20 transition-colors"
                      >
                        Set to Current Time
                      </button>
                      <button
                        onClick={() => {
                          setInputDate('1970-01-01');
                          setInputTime('00:00:00');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-surface border border-border text-xs text-text-muted hover:text-text transition-colors"
                      >
                        Epoch Start
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'arithmetic' && (
              <div className="space-y-4">
                <ToolInput
                  label="Base Epoch Timestamp (Seconds)"
                  value={arithmeticBaseTs}
                  onChange={setArithmeticBaseTs}
                  placeholder="e.g. 1771987200"
                  mono
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <label htmlFor="arith-op-select" className="text-xs font-bold text-text-muted">Operation:</label>
                    <select
                      id="arith-op-select"
                      value={arithmeticOp}
                      onChange={(e) => setArithmeticOp(e.target.value as 'add' | 'subtract')}
                      className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-sm text-text focus:outline-none focus:border-primary font-medium"
                    >
                      <option value="add">➕ Add (+)</option>
                      <option value="subtract">➖ Subtract (-)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="arith-amount-input" className="text-xs font-bold text-text-muted">Amount:</label>
                    <input
                      id="arith-amount-input"
                      type="number"
                      min={1}
                      value={arithmeticAmount}
                      onChange={(e) => setArithmeticAmount(Math.max(1, Number(e.target.value)))}
                      className="w-full px-3 py-2 bg-surface border border-border rounded-xl font-mono text-sm text-text focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="arith-unit-select" className="text-xs font-bold text-text-muted">Time Unit:</label>
                    <select
                      id="arith-unit-select"
                      value={arithmeticUnit}
                      onChange={(e) => setArithmeticUnit(e.target.value as ArithmeticUnit)}
                      className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-sm text-text focus:outline-none focus:border-primary font-medium"
                    >
                      <option value="seconds">Seconds</option>
                      <option value="minutes">Minutes</option>
                      <option value="hours">Hours</option>
                      <option value="days">Days</option>
                      <option value="weeks">Weeks</option>
                      <option value="months">Months</option>
                      <option value="years">Years</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setArithmeticBaseTs(String(Math.floor(Date.now() / 1000)))}
                    className="px-3 py-1.5 rounded-lg bg-surface border border-border text-xs text-text-muted hover:text-text transition-colors"
                  >
                    Reset to Now
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'batch' && (
              <div className="space-y-4">
                <ToolInput
                  label="Multi-line Timestamps or ISO Dates (one per line or CSV):"
                  value={batchInput}
                  onChange={setBatchInput}
                  rows={8}
                  mono
                  placeholder="Paste multiple timestamps or dates..."
                />
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={handleBatchConvert}
                    className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-colors shadow-sm"
                  >
                    Process Batch List
                  </button>
                  <button
                    onClick={handleDownloadCsv}
                    className="px-3 py-2 rounded-xl bg-surface border border-border text-xs font-bold hover:border-primary transition-colors flex items-center gap-1.5 text-text"
                  >
                    <Download className="w-3.5 h-3.5 text-text-muted" /> Download CSV
                  </button>
                  <button
                    onClick={handleDownloadJson}
                    className="px-3 py-2 rounded-xl bg-surface border border-border text-xs font-bold hover:border-primary transition-colors flex items-center gap-1.5 text-text"
                  >
                    <Download className="w-3.5 h-3.5 text-text-muted" /> Download JSON
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'code' && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="code-lang-select" className="text-xs font-bold text-text-muted">Programming Language:</label>
                  <select
                    id="code-lang-select"
                    value={selectedLang}
                    onChange={(e) => setSelectedLang(e.target.value)}
                    className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-sm font-medium text-text focus:outline-none focus:border-primary"
                  >
                    {CODE_SNIPPETS.map(s => (
                      <option key={s.language} value={s.language}>{s.language}</option>
                    ))}
                  </select>
                </div>

                {(() => {
                  const snippet = CODE_SNIPPETS.find(s => s.language === selectedLang) || CODE_SNIPPETS[0]!;
                  return (
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-text-muted">Get Current Timestamp</span>
                          <button
                            onClick={() => handleCopy(snippet.getEpoch, 'code-get')}
                            className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
                          >
                            {copiedKey === 'code-get' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                            Copy
                          </button>
                        </div>
                        <pre className="p-3.5 bg-surface border border-border rounded-xl font-mono text-xs text-text overflow-x-auto">
                          {snippet.getEpoch}
                        </pre>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-text-muted">Convert Epoch to Formatted Date</span>
                          <button
                            onClick={() => handleCopy(snippet.convertEpochToDate, 'code-convert')}
                            className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
                          >
                            {copiedKey === 'code-convert' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                            Copy
                          </button>
                        </div>
                        <pre className="p-3.5 bg-surface border border-border rounded-xl font-mono text-xs text-text overflow-x-auto">
                          {snippet.convertEpochToDate}
                        </pre>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Conversion History Shelf */}
            {history.length > 0 && (
              <div className="pt-4 border-t border-border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-text-muted flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5" /> Recent Conversions
                  </span>
                  <button
                    onClick={() => setHistory([])}
                    className="text-xs text-text-muted hover:text-rose-500 transition-colors"
                  >
                    Clear History
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {history.map(item => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setInputTs(String(item.ts));
                        setState({ tab: 'single', subMode: 'epochToDate', ts: String(item.ts) });
                      }}
                      className="px-2.5 py-1 rounded-lg bg-surface-2 border border-border text-xs font-mono hover:border-primary text-text-muted hover:text-text transition-colors"
                    >
                      {item.ts}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        }
        output={
          <div>
            {activeTab === 'single' && (
              <div>
                {singleResult ? (
                  <div className="space-y-4" role="region" aria-live="polite">
                    {/* Primary Highlight Card */}
                    <div className="p-4 rounded-2xl bg-surface-2 border border-border space-y-2 shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-text-muted">UTC Timestamp</span>
                        <button
                          onClick={() => handleCopy(singleResult.utcFormatted, 'utc')}
                          className="p-1.5 rounded-lg bg-surface border border-border hover:border-primary text-xs font-mono text-text flex items-center gap-1"
                        >
                          {copiedKey === 'utc' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-text-muted" />}
                          Copy
                        </button>
                      </div>
                      <div className="text-xl sm:text-2xl font-mono font-bold text-text">
                        {singleResult.utcFormatted}
                      </div>
                      <div className="text-xs text-text-muted flex items-center gap-2">
                        <span>{singleResult.dayOfWeek}</span>
                        <span>•</span>
                        <span>Day {singleResult.dayOfYear}</span>
                        <span>•</span>
                        <span>Week {singleResult.weekNumber}</span>
                        {singleResult.isLeapYear && <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-bold">Leap Year</span>}
                        {singleResult.isYear2038Overflow && (
                          <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500 font-bold flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> Y2038 Overflow
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Breakdown Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3 bg-surface border border-border rounded-xl space-y-1">
                        <div className="flex items-center justify-between text-xs text-text-muted font-bold">
                          <span>ISO 8601</span>
                          <button onClick={() => handleCopy(singleResult.iso8601, 'iso')} className="hover:text-primary">
                            {copiedKey === 'iso' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                        <div className="font-mono text-xs text-text break-all">{singleResult.iso8601}</div>
                      </div>

                      <div className="p-3 bg-surface border border-border rounded-xl space-y-1">
                        <div className="flex items-center justify-between text-xs text-text-muted font-bold">
                          <span>Local Time</span>
                          <button onClick={() => handleCopy(singleResult.localFormatted, 'local')} className="hover:text-primary">
                            {copiedKey === 'local' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                        <div className="font-mono text-xs text-text break-all">{singleResult.localFormatted}</div>
                      </div>

                      <div className="p-3 bg-surface border border-border rounded-xl space-y-1">
                        <div className="flex items-center justify-between text-xs text-text-muted font-bold">
                          <span>RFC 2822</span>
                          <button onClick={() => handleCopy(singleResult.rfc2822, 'rfc')} className="hover:text-primary">
                            {copiedKey === 'rfc' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                        <div className="font-mono text-xs text-text break-all">{singleResult.rfc2822}</div>
                      </div>

                      <div className="p-3 bg-surface border border-border rounded-xl space-y-1">
                        <div className="flex items-center justify-between text-xs text-text-muted font-bold">
                          <span>Relative Time</span>
                          <button onClick={() => handleCopy(singleResult.relativeTime, 'rel')} className="hover:text-primary">
                            {copiedKey === 'rel' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 text-text-muted" />}
                          </button>
                        </div>
                        <div className="font-mono text-xs text-emerald-500 font-bold">{singleResult.relativeTime}</div>
                      </div>

                      <div className="p-3 bg-surface border border-border rounded-xl space-y-1">
                        <div className="flex items-center justify-between text-xs text-text-muted font-bold">
                          <span>Epoch Seconds (s)</span>
                          <button onClick={() => handleCopy(String(singleResult.epochSeconds), 'sec_out')} className="hover:text-primary">
                            {copiedKey === 'sec_out' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                        <div className="font-mono text-xs text-text">{singleResult.epochSeconds}</div>
                      </div>

                      <div className="p-3 bg-surface border border-border rounded-xl space-y-1">
                        <div className="flex items-center justify-between text-xs text-text-muted font-bold">
                          <span>Epoch Milliseconds (ms)</span>
                          <button onClick={() => handleCopy(String(singleResult.epochMillis), 'ms_out')} className="hover:text-primary">
                            {copiedKey === 'ms_out' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                        <div className="font-mono text-xs text-text">{singleResult.epochMillis}</div>
                      </div>

                      <div className="p-3 bg-surface border border-border rounded-xl space-y-1">
                        <div className="flex items-center justify-between text-xs text-text-muted font-bold">
                          <span>32-Bit Hex Representation</span>
                          <button onClick={() => handleCopy(singleResult.hex32, 'hex_out')} className="hover:text-primary">
                            {copiedKey === 'hex_out' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                        <div className="font-mono text-xs text-text">{singleResult.hex32}</div>
                      </div>

                      <div className="p-3 bg-surface border border-border rounded-xl space-y-1">
                        <div className="flex items-center justify-between text-xs text-text-muted font-bold">
                          <span>Detected Unit</span>
                        </div>
                        <div className="font-mono text-xs text-primary font-bold capitalize">{singleResult.detectedUnit}</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center text-text-muted border border-dashed border-border rounded-2xl">
                    Please enter a valid numeric epoch timestamp or date string.
                  </div>
                )}
              </div>
            )}

            {activeTab === 'arithmetic' && (
              <div>
                {arithmeticResult ? (
                  <div className="space-y-4" role="region" aria-live="polite">
                    <div className="p-4 rounded-2xl bg-surface-2 border border-border space-y-2 shadow-sm">
                      <div className="text-xs font-bold uppercase tracking-wider text-text-muted">Calculated Result</div>
                      <div className="text-xl sm:text-2xl font-mono font-bold text-primary">
                        {arithmeticResult.epochSeconds} <span className="text-xs font-sans text-text-muted">seconds</span>
                      </div>
                      <div className="font-mono text-sm text-text">{arithmeticResult.utcFormatted}</div>
                      <div className="text-xs text-emerald-500 font-medium">{arithmeticResult.relativeTime}</div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3 bg-surface border border-border rounded-xl space-y-1">
                        <span className="text-xs text-text-muted font-bold">ISO 8601</span>
                        <div className="font-mono text-xs text-text break-all">{arithmeticResult.iso8601}</div>
                      </div>
                      <div className="p-3 bg-surface border border-border rounded-xl space-y-1">
                        <span className="text-xs text-text-muted font-bold">Local Time</span>
                        <div className="font-mono text-xs text-text break-all">{arithmeticResult.localFormatted}</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center text-text-muted border border-dashed border-border rounded-2xl">
                    Invalid timestamp or offset configuration.
                  </div>
                )}
              </div>
            )}

            {activeTab === 'batch' && (
              <div className="space-y-4">
                <div className="overflow-x-auto w-full max-w-full min-w-0 border border-border rounded-2xl">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-surface-2 border-b border-border text-text-muted uppercase">
                      <tr>
                        <th className="p-3">#</th>
                        <th className="p-3">Input</th>
                        <th className="p-3">Epoch (s)</th>
                        <th className="p-3">ISO 8601</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {batchRows.map(row => (
                        <tr key={row.id} className="hover:bg-surface-2/50 transition-colors">
                          <td className="p-3 text-text-muted">{row.id}</td>
                          <td className="p-3 text-text font-bold truncate max-w-[150px]">{row.input}</td>
                          <td className="p-3 text-primary">{row.epochSeconds ?? '—'}</td>
                          <td className="p-3 text-text truncate max-w-[200px]">{row.iso8601 ?? '—'}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              row.status === 'valid' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                            }`}>
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'code' && (
              <div className="p-6 text-center border border-border rounded-2xl bg-surface-2 space-y-3">
                <Code2 className="w-8 h-8 text-primary mx-auto" />
                <div className="text-sm font-bold text-text">Code Integration Cheat Sheet</div>
                <p className="text-xs text-text-muted max-w-md mx-auto">
                  Copy and paste ready-to-use snippets directly into your backend services, CLI tools, or client apps.
                </p>
              </div>
            )}
          </div>
        }
      />
    </div>
  );
}
