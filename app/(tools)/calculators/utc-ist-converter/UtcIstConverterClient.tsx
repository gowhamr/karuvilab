"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Clock,
  ArrowLeftRight,
  RotateCcw,
  Calendar,
  Hash,
  Share2,
  FileSpreadsheet,
  FileCode,
  History,
  CheckCircle2,
  AlertCircle,
  Download,
  Copy,
  Zap,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { CopyButton } from "@/components/ui/CopyButton";
import { ShareButton } from "@/components/ui/ShareButton";
import { QRModal } from "@/components/ui/QRModal";
import { SharedResultBanner } from "@/components/ui/SharedResultBanner";
import { ToolWorkspace } from "@/components/ui/ToolWorkspace";
import { ToolInput } from "@/components/ui/ToolInput";
import { useUrlState } from "@/src/hooks/useUrlState";
import {
  parseInputToUtcEpoch,
  formatUtcIso,
  formatIstIso,
  formatToDateTimeLocal,
  formatFriendlyDisplay,
  detectDateRollover,
  verifyRoundTrip,
  generateMachineOutput,
  processBatchLines,
  exportBatchToCsv,
  exportBatchToJson,
  IST_OFFSET_MS,
  PrecisionMode,
} from "@/src/features/calculators/utc-ist/engine";

// Market hours data
const MARKET_HOURS = [
  { name: "NSE / BSE (India)", ist: "09:15 AM – 03:30 PM", utc: "03:45 AM – 10:00 AM", status: "Active (IST Base)" },
  { name: "NYSE / NASDAQ (US)", ist: "07:00 PM – 01:30 AM (+1d)", utc: "01:30 PM – 08:00 PM", status: "Overnight in India" },
  { name: "LSE (London)", ist: "01:30 PM – 10:00 PM", utc: "08:00 AM – 04:30 PM", status: "Afternoon Overlap" },
  { name: "TSE (Tokyo)", ist: "05:30 AM – 11:30 AM", utc: "12:00 AM – 06:00 AM", status: "Morning Overlap" },
];

const IST_BIZ_HOURS = [
  { istLabel: "IST 09:00 AM (Start)", utcLabel: "UTC 03:30 AM" },
  { istLabel: "IST 10:00 AM", utcLabel: "UTC 04:30 AM" },
  { istLabel: "IST 12:00 PM (Noon)", utcLabel: "UTC 06:30 AM" },
  { istLabel: "IST 02:00 PM", utcLabel: "UTC 08:30 AM" },
  { istLabel: "IST 05:00 PM", utcLabel: "UTC 11:30 AM" },
  { istLabel: "IST 06:00 PM (Close)", utcLabel: "UTC 12:30 PM" },
];

interface HistoryItem {
  id: string;
  timestamp: number;
  utcIso: string;
  istIso: string;
  epochMs: number;
  label: string;
}

// Isolated Live Clock Widget (avoids re-rendering parent component tree every second)
const LiveClockWidget = React.memo(function LiveClockWidget() {
  const [nowMs, setNowMs] = useState<number>(Date.now());

  useEffect(() => {
    const id = setInterval(() => {
      setNowMs(Date.now());
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const d = new Date(nowMs);
  const istD = new Date(nowMs + IST_OFFSET_MS);

  const utcTime = d.toUTCString().slice(17, 25);
  const utcDate = d.toUTCString().slice(0, 16);

  const istHours = String(istD.getUTCHours()).padStart(2, "0");
  const istMins = String(istD.getUTCMinutes()).padStart(2, "0");
  const istSecs = String(istD.getUTCSeconds()).padStart(2, "0");
  const istTime = `${istHours}:${istMins}:${istSecs}`;

  const istDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const istMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const istDate = `${istDays[istD.getUTCDay()]}, ${istD.getUTCDate()} ${istMonths[istD.getUTCMonth()]} ${istD.getUTCFullYear()}`;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="bg-bg border border-border p-4 sm:p-5 rounded-2xl shadow-sm space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Live UTC Clock</span>
          <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-surface border border-border text-text-3">UTC+00:00</span>
        </div>
        <div className="text-2xl sm:text-3xl font-black font-mono text-text" aria-live="off">{utcTime}</div>
        <div className="text-xs sm:text-sm text-text-3 font-medium">{utcDate}</div>
      </div>

      <div className="bg-bg border border-blue/40 p-4 sm:p-5 rounded-2xl shadow-sm space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-blue uppercase tracking-wider">Live IST Clock</span>
          <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-blue/10 border border-blue/20 text-blue font-bold">UTC+05:30</span>
        </div>
        <div className="text-2xl sm:text-3xl font-black font-mono text-blue" aria-live="off">{istTime}</div>
        <div className="text-xs sm:text-sm text-text-3 font-medium">{istDate}</div>
      </div>
    </div>
  );
});

export default function UtcIstConverterClient() {
  const { state, setState, shareUrl, hasParams } = useUrlState({
    defaults: {
      input: "",
      dir: "utc-to-ist",
      tab: "single",
      format24: false as boolean,
      precision: "sec" as string,
    },
    debounceMs: 300,
  });

  const activeTab = (state.tab as "single" | "batch" | "reference") || "single";
  const direction = (state.dir as "utc-to-ist" | "ist-to-utc") || "utc-to-ist";
  const format24 = Boolean(state.format24);
  const precision = (state.precision as PrecisionMode) || "sec";

  const [rawInput, setRawInput] = useState<string>("");
  const [batchText, setBatchText] = useState<string>("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Initialize input
  useEffect(() => {
    setMounted(true);
    if (state.input) {
      setRawInput(state.input);
    } else {
      const nowIso = new Date().toISOString();
      const initial = formatToDateTimeLocal(Date.now(), direction === "ist-to-utc" ? IST_OFFSET_MS : 0, precision);
      setRawInput(initial);
      setState({ input: initial });
    }
  }, [direction, precision, setState, state.input]);

  // Load history from session storage on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("kv_utc_ist_history");
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  const saveToHistory = useCallback((epochMs: number) => {
    try {
      const utcIso = formatUtcIso(epochMs, "sec");
      const istIso = formatIstIso(epochMs, "sec");
      const item: HistoryItem = {
        id: `${epochMs}-${Date.now()}`,
        timestamp: Date.now(),
        utcIso,
        istIso,
        epochMs,
        label: `${utcIso.slice(11, 19)} UTC ⇄ ${istIso.slice(11, 19)} IST`,
      };

      setHistory((prev) => {
        const filtered = prev.filter((p) => Math.abs(p.epochMs - epochMs) > 1000);
        const updated = [item, ...filtered].slice(0, 10);
        try {
          sessionStorage.setItem("kv_utc_ist_history", JSON.stringify(updated));
        } catch {
          // ignore
        }
        return updated;
      });
    } catch {
      // ignore
    }
  }, []);

  // Parse current active input
  const parseResult = useMemo(() => {
    if (!rawInput.trim()) {
      return { success: false, epochMs: 0, precision, error: "Please enter a date, time, or timestamp" };
    }
    const isIst = direction === "ist-to-utc";
    return parseInputToUtcEpoch(rawInput, isIst);
  }, [rawInput, direction, precision]);

  // Auto-record to history on valid change (debounced)
  useEffect(() => {
    if (parseResult.success && parseResult.epochMs) {
      const timer = setTimeout(() => {
        saveToHistory(parseResult.epochMs);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [parseResult, saveToHistory]);

  // Machine Output calculation
  const machineOutput = useMemo(() => {
    if (!parseResult.success) return null;
    return generateMachineOutput(parseResult.epochMs, precision);
  }, [parseResult, precision]);

  // Rollover detection
  const rollover = useMemo(() => {
    if (!parseResult.success) return null;
    return detectDateRollover(parseResult.epochMs);
  }, [parseResult]);

  // Round-trip verification
  const roundTrip = useMemo(() => {
    if (!parseResult.success) return { isVerified: false, driftMs: 0 };
    return verifyRoundTrip(parseResult.epochMs);
  }, [parseResult]);

  // Batch conversion processing
  const batchResult = useMemo(() => {
    if (!batchText.trim()) return null;
    return processBatchLines(batchText, "auto", format24);
  }, [batchText, format24]);

  // Handlers
  const handleInputChange = (val: string) => {
    setRawInput(val);
    setState({ input: val });
  };

  const handleSwapDirection = () => {
    const newDir = direction === "utc-to-ist" ? "ist-to-utc" : "utc-to-ist";
    setState({ dir: newDir });
    if (parseResult.success) {
      // Re-populate the input box with target representation
      const targetVal = formatToDateTimeLocal(
        parseResult.epochMs,
        newDir === "ist-to-utc" ? IST_OFFSET_MS : 0,
        precision
      );
      setRawInput(targetVal);
      setState({ input: targetVal, dir: newDir });
    }
  };

  const handleSetCurrentTime = () => {
    const nowMs = Date.now();
    const val = formatToDateTimeLocal(nowMs, direction === "ist-to-utc" ? IST_OFFSET_MS : 0, precision);
    setRawInput(val);
    setState({ input: val });
  };

  const handleClear = () => {
    setRawInput("");
    setState({ input: "" });
  };

  const handleSetPreset = (type: "midnight-utc" | "midnight-ist" | "market-open" | "market-close") => {
    const d = new Date();
    let targetUtcEpoch = 0;

    if (type === "midnight-utc") {
      targetUtcEpoch = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0);
    } else if (type === "midnight-ist") {
      // 00:00 IST is 18:30 UTC previous day
      targetUtcEpoch = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0) - IST_OFFSET_MS;
    } else if (type === "market-open") {
      // 09:15 IST is 03:45 UTC
      targetUtcEpoch = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 9, 15, 0) - IST_OFFSET_MS;
    } else if (type === "market-close") {
      // 15:30 IST is 10:00 UTC
      targetUtcEpoch = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 15, 30, 0) - IST_OFFSET_MS;
    }

    const val = formatToDateTimeLocal(targetUtcEpoch, direction === "ist-to-utc" ? IST_OFFSET_MS : 0, precision);
    setRawInput(val);
    setState({ input: val });
  };

  const handleDownloadCsv = () => {
    if (!batchResult) return;
    const csvContent = exportBatchToCsv(batchResult);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `utc-ist-batch-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadJson = () => {
    if (!batchResult) return;
    const jsonContent = exportBatchToJson(batchResult);
    const blob = new Blob([jsonContent], { type: "application/json;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `utc-ist-batch-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const loadSampleBatch = () => {
    const sample = `2026-08-25T12:00:00Z\n1787682084\n2026-12-31T23:30:00\n2024-02-28T20:00:00\n1787682084123\n2026-08-25T18:30:00`;
    setBatchText(sample);
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      sessionStorage.removeItem("kv_utc_ist_history");
    } catch {
      // ignore
    }
  };

  // Full summary text for copy
  const fullSummary = useMemo(() => {
    if (!machineOutput) return "";
    return `UTC ↔ IST Conversion Summary\n---------------------------------\nSource Mode: ${direction === "utc-to-ist" ? "UTC → IST" : "IST → UTC"}\nUTC Time: ${machineOutput.utcFormatted24} (${machineOutput.utcIso})\nIST Time: ${machineOutput.istFormatted24} (${machineOutput.istIso})\nUnix Timestamp: ${machineOutput.epochSeconds} (s) / ${machineOutput.epochMs} (ms)\nCalendar Rollover: ${machineOutput.rollover.label}\nOffset: +5 Hours 30 Minutes\nRound-Trip Verification: ${roundTrip.isVerified ? "Verified (0ms Drift)" : "Failed"}\nGenerated via KaruviLab`;
  }, [machineOutput, direction, roundTrip]);

  if (!mounted) {
    return (
      <div className="bg-surface border border-border p-6 rounded-2xl min-h-80 animate-pulse" />
    );
  }

  return (
    <div className="w-full space-y-6">
      <SharedResultBanner hasParams={hasParams} toolName="UTC ↔ IST Converter" />
      <QRModal url={shareUrl} isOpen={isQrOpen} onClose={() => setIsQrOpen(false)} />

      <ToolWorkspace
        layout="split"
        tabs={{
          options: [
            { id: "single", label: "Interactive Converter" },
            { id: "batch", label: "Batch & CSV / JSON" },
            { id: "reference", label: "Market & Reference" },
          ],
          activeId: activeTab,
          onChange: (id) => setState({ tab: id as "single" | "batch" | "reference" }),
        }}
        input={
          <div className="space-y-6">
            {activeTab === "single" && (
              <>
                {/* Header & Controls Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Direction:</span>
                    <button
                      onClick={handleSwapDirection}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-blue/30 bg-blue/10 text-blue hover:bg-blue/20 transition-colors"
                      title="Swap Conversion Direction"
                      aria-label="Swap conversion direction between UTC and IST"
                    >
                      <ArrowLeftRight className="w-3.5 h-3.5" />
                      <span>{direction === "utc-to-ist" ? "UTC → IST (UTC+5:30)" : "IST → UTC"}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* 12h / 24h Toggle */}
                    <div className="inline-flex rounded-lg border border-border bg-bg p-0.5 text-xs" role="group" aria-label="Time display format">
                      <button
                        onClick={() => setState({ format24: false })}
                        aria-pressed={!format24}
                        className={`px-2 py-1 rounded-md font-medium transition-colors ${!format24 ? "bg-surface text-text shadow-xs" : "text-text-muted hover:text-text"}`}
                      >
                        12H (AM/PM)
                      </button>
                      <button
                        onClick={() => setState({ format24: true })}
                        aria-pressed={format24}
                        className={`px-2 py-1 rounded-md font-medium transition-colors ${format24 ? "bg-surface text-text shadow-xs" : "text-text-muted hover:text-text"}`}
                      >
                        24H
                      </button>
                    </div>

                    {/* Precision Selector */}
                    <div className="inline-flex rounded-lg border border-border bg-bg p-0.5 text-xs" role="group" aria-label="Time precision level">
                      {(["min", "sec", "ms"] as PrecisionMode[]).map((p) => (
                        <button
                          key={p}
                          onClick={() => setState({ precision: p })}
                          aria-pressed={precision === p}
                          className={`px-2 py-1 rounded-md font-medium capitalize transition-colors ${precision === p ? "bg-blue text-white shadow-xs" : "text-text-muted hover:text-text"}`}
                        >
                          {p === "min" ? "Min" : p === "sec" ? "Sec" : "MS"}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Primary Input Fields */}
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-text uppercase tracking-wider flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-blue" />
                        {direction === "utc-to-ist" ? "1. Enter UTC Date & Time" : "1. Enter IST Date & Time (UTC+5:30)"}
                      </label>
                      <span className="text-xs text-text-3 font-mono">
                        {direction === "utc-to-ist" ? "Source: UTC (+00:00)" : "Source: IST (+05:30)"}
                      </span>
                    </div>

                    <ToolInput
                      type={precision === "ms" ? "text" : "datetime-local"}
                      step={precision === "sec" ? "1" : undefined}
                      value={rawInput}
                      onChange={handleInputChange}
                      placeholder="YYYY-MM-DDTHH:mm:ss or Epoch timestamp"
                      mono
                      description={
                        parseResult.success
                          ? formatFriendlyDisplay(
                              parseResult.epochMs,
                              direction === "ist-to-utc" ? IST_OFFSET_MS : 0,
                              format24,
                              precision
                            )
                          : "Enter date, time, ISO 8601, or Unix timestamp"
                      }
                    />
                  </div>

                  {/* Quick Presets Toolbar */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <button
                      onClick={handleSetCurrentTime}
                      className="px-2.5 py-1 text-xs font-bold rounded-lg border border-border bg-surface text-text hover:border-blue hover:text-blue transition-colors flex items-center gap-1"
                    >
                      <Clock className="w-3 h-3" /> Now
                    </button>
                    <button
                      onClick={() => handleSetPreset("midnight-utc")}
                      className="px-2.5 py-1 text-xs font-medium rounded-lg border border-border bg-bg text-text-2 hover:border-border-focus hover:text-text transition-colors"
                    >
                      Midnight UTC
                    </button>
                    <button
                      onClick={() => handleSetPreset("midnight-ist")}
                      className="px-2.5 py-1 text-xs font-medium rounded-lg border border-border bg-bg text-text-2 hover:border-border-focus hover:text-text transition-colors"
                    >
                      Midnight IST
                    </button>
                    <button
                      onClick={() => handleSetPreset("market-open")}
                      className="px-2.5 py-1 text-xs font-medium rounded-lg border border-border bg-bg text-text-2 hover:border-border-focus hover:text-text transition-colors"
                    >
                      IST Market Open (09:15)
                    </button>
                    <button
                      onClick={() => handleSetPreset("market-close")}
                      className="px-2.5 py-1 text-xs font-medium rounded-lg border border-border bg-bg text-text-2 hover:border-border-focus hover:text-text transition-colors"
                    >
                      IST Market Close (15:30)
                    </button>
                    <button
                      onClick={handleClear}
                      className="px-2.5 py-1 text-xs font-medium rounded-lg border border-border bg-bg text-red-500 hover:border-red-500/40 transition-colors flex items-center gap-1 ml-auto"
                    >
                      <RotateCcw className="w-3 h-3" /> Reset
                    </button>
                  </div>
                </div>

                {/* Structured Error Banner (No silent fallback - Rule P-11) */}
                {!parseResult.success && rawInput.trim() !== "" && (
                  <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold">Invalid Date / Time Input</div>
                      <div className="text-text-muted mt-0.5">{parseResult.error}</div>
                      <button
                        onClick={handleSetCurrentTime}
                        className="mt-2 text-xs font-bold underline hover:text-text cursor-pointer"
                      >
                        Reset to Current Time
                      </button>
                    </div>
                  </div>
                )}

                {/* Date Rollover Indicator Badge */}
                {rollover && (
                  <div
                    className={`p-3.5 rounded-xl border flex items-center justify-between text-xs ${
                      rollover.isNextDay
                        ? "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-300"
                        : rollover.isPrevDay
                        ? "bg-blue/10 border-blue/30 text-blue"
                        : "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-300"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 shrink-0" />
                      <div>
                        <span className="font-bold">{rollover.label}</span>
                        <div className="text-text-muted text-[11px] mt-0.5">
                          UTC: <span className="font-mono">{rollover.utcDateStr}</span> ⇄ IST: <span className="font-mono">{rollover.istDateStr}</span>
                        </div>
                      </div>
                    </div>

                    {roundTrip.isVerified && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-surface border border-border text-emerald-500 font-bold">
                        <CheckCircle2 className="w-3 h-3" /> Parity Verified
                      </span>
                    )}
                  </div>
                )}

                {/* Recent History Drawer */}
                {history.length > 0 && (
                  <div className="border border-border rounded-xl p-3 bg-bg space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-text-muted">
                      <span className="flex items-center gap-1.5">
                        <History className="w-3.5 h-3.5" /> Recent Conversions ({history.length})
                      </span>
                      <button
                        onClick={clearHistory}
                        className="text-[11px] font-normal hover:text-red-400 text-text-3 cursor-pointer"
                      >
                        Clear
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {history.slice(0, 5).map((item) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            const val = formatToDateTimeLocal(
                              item.epochMs,
                              direction === "ist-to-utc" ? IST_OFFSET_MS : 0,
                              precision
                            );
                            setRawInput(val);
                            setState({ input: val });
                          }}
                          className="text-[11px] font-mono px-2 py-1 rounded-md bg-surface border border-border text-text hover:border-blue transition-colors"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {activeTab === "batch" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-text uppercase tracking-wider flex items-center gap-1.5">
                    <FileSpreadsheet className="w-3.5 h-3.5 text-blue" />
                    Paste Batch Timestamps or Dates (One per line)
                  </label>
                  <button
                    onClick={loadSampleBatch}
                    className="text-xs font-bold text-blue hover:underline"
                  >
                    Load Sample Data
                  </button>
                </div>

                <textarea
                  value={batchText}
                  onChange={(e) => setBatchText(e.target.value)}
                  placeholder="2026-08-25T12:00:00Z&#10;1787682084&#10;2026-12-31T23:30:00&#10;2024-02-28T20:00:00"
                  rows={8}
                  className="w-full p-3 font-mono text-xs rounded-xl bg-bg border border-border text-text focus:border-blue focus:outline-none resize-y"
                />

                {batchResult && (
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                    <div className="text-xs text-text-3">
                      Total: <span className="font-bold text-text">{batchResult.total}</span> | Valid:{" "}
                      <span className="font-bold text-emerald-500">{batchResult.validCount}</span> | Errors:{" "}
                      <span className="font-bold text-red-500">{batchResult.errorCount}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleDownloadCsv}
                        className="px-3 py-1.5 text-xs font-bold rounded-lg border border-border bg-surface text-text hover:border-blue flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" /> CSV
                      </button>
                      <button
                        onClick={handleDownloadJson}
                        className="px-3 py-1.5 text-xs font-bold rounded-lg border border-border bg-surface text-text hover:border-blue flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" /> JSON
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "reference" && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-text uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-blue" />
                  Major Stock Market Trading Hours (UTC vs IST)
                </h3>
                <div className="border border-border rounded-xl overflow-hidden divide-y divide-border">
                  {MARKET_HOURS.map((m) => (
                    <div key={m.name} className="p-3 bg-bg flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                      <div>
                        <span className="font-bold text-text">{m.name}</span>
                        <div className="text-text-3 text-[11px]">{m.status}</div>
                      </div>
                      <div className="text-right font-mono">
                        <div className="text-blue font-bold">IST: {m.ist}</div>
                        <div className="text-text-muted text-[11px]">UTC: {m.utc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        }
        optionsPanel={
          <div className="space-y-6">
            <h2 className="font-bold text-text-2 mb-2 text-sm uppercase tracking-wider">Live Reference Clocks</h2>
            <LiveClockWidget />

            <div className="bg-surface border border-border p-4 rounded-xl space-y-2 text-xs">
              <div className="font-bold text-text flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue" /> Why IST has a +5:30 offset
              </div>
              <p className="text-text-3 leading-relaxed">
                India is geographically 2 hours wide (68°E to 97°E). In 1906, the central meridian of <strong>82.5°E longitude</strong> (Mirzapur, UP) was selected as the reference time meridian. Dividing 82.5° by 15°/hour gives exactly <strong>5.5 hours (UTC+5:30)</strong>.
              </p>
            </div>
          </div>
        }
        output={
          <div className="space-y-6">
            {activeTab === "single" && machineOutput && (
              <>
                {/* Big Result Card */}
                <div className="bg-bg border border-blue/40 p-5 rounded-2xl shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue uppercase tracking-wider">
                      {direction === "utc-to-ist" ? "Converted Indian Standard Time (IST)" : "Converted Universal Time (UTC)"}
                    </span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-blue/10 border border-blue/20 text-blue font-bold">
                      {direction === "utc-to-ist" ? "UTC+5:30" : "UTC+0:00"}
                    </span>
                  </div>

                  <output className="block text-2xl sm:text-3xl font-black font-mono text-text break-all" aria-live="polite">
                    {direction === "utc-to-ist"
                      ? format24
                        ? machineOutput.istFormatted24.split("•")[1]
                        : machineOutput.istFormatted12.split("•")[1]
                      : format24
                      ? machineOutput.utcFormatted24.split("•")[1]
                      : machineOutput.utcFormatted12.split("•")[1]}
                  </output>

                  <div className="text-sm text-text-3 font-medium">
                    {direction === "utc-to-ist"
                      ? machineOutput.istFormatted24.split("•")[0]
                      : machineOutput.utcFormatted24.split("•")[0]}
                  </div>

                  {/* ISO & Timestamp Badges */}
                  <div className="pt-2 border-t border-border flex flex-wrap gap-2 text-xs font-mono">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface border border-border text-text">
                      <span className="text-text-muted">ISO IST:</span>
                      <span className="font-bold text-blue">{machineOutput.istIso}</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface border border-border text-text">
                      <span className="text-text-muted">ISO UTC:</span>
                      <span className="font-bold">{machineOutput.utcIso}</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface border border-border text-text">
                      <span className="text-text-muted">Epoch:</span>
                      <span className="font-bold">{machineOutput.epochSeconds}s</span>
                    </div>
                  </div>
                </div>

                {/* Granular Copy Actions */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Quick Copy Actions</span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <CopyButton text={machineOutput.istIso} label="Copy IST ISO" />
                    <CopyButton text={machineOutput.utcIso} label="Copy UTC ISO" />
                    <CopyButton text={String(machineOutput.epochSeconds)} label="Copy Epoch (s)" />
                    <CopyButton text={String(machineOutput.epochMs)} label="Copy Epoch (ms)" />
                    <CopyButton text={JSON.stringify(machineOutput, null, 2)} label="Copy JSON" />
                    <CopyButton text={fullSummary} label="Copy Summary" />
                  </div>
                </div>

                {/* Machine Readable JSON Preview */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
                    <FileCode className="w-3.5 h-3.5 text-blue" />
                    Machine-Readable Output (JSON / RFC 2822)
                  </span>
                  <pre className="p-3.5 rounded-xl bg-bg border border-border text-text font-mono text-[11px] overflow-x-auto max-h-48">
                    {JSON.stringify(
                      {
                        epoch_seconds: machineOutput.epochSeconds,
                        epoch_milliseconds: machineOutput.epochMs,
                        utc_iso_8601: machineOutput.utcIso,
                        ist_iso_8601: machineOutput.istIso,
                        utc_rfc_2822: machineOutput.rfc2822Utc,
                        ist_offset: machineOutput.offsetString,
                        calendar_rollover: machineOutput.rollover.label,
                        round_trip_verified: machineOutput.roundTripVerified,
                      },
                      null,
                      2
                    )}
                  </pre>
                </div>
              </>
            )}

            {activeTab === "batch" && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-text-2 uppercase tracking-wider">Batch Conversion Results Table</h3>
                {batchResult && batchResult.results.length > 0 ? (
                  <div className="overflow-x-auto w-full max-w-full min-w-0 border border-border rounded-xl">
                    <table className="w-full text-left text-xs font-mono divide-y divide-border">
                      <thead className="bg-surface text-text-muted">
                        <tr>
                          <th className="p-2.5">#</th>
                          <th className="p-2.5">Input</th>
                          <th className="p-2.5">UTC (ISO)</th>
                          <th className="p-2.5">IST (ISO)</th>
                          <th className="p-2.5">Epoch (s)</th>
                          <th className="p-2.5">Rollover</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border bg-bg">
                        {batchResult.results.map((r) => (
                          <tr key={r.index} className={!r.valid ? "bg-red-500/5 text-red-600 dark:text-red-400" : ""}>
                            <td className="p-2.5 text-text-3">{r.index}</td>
                            <td className="p-2.5 font-bold truncate max-w-xs">{r.raw}</td>
                            <td className="p-2.5">{r.utcIso || "—"}</td>
                            <td className="p-2.5 text-blue font-bold">{r.istIso || "—"}</td>
                            <td className="p-2.5 text-text-3">{r.epochMs ? Math.floor(r.epochMs / 1000) : "—"}</td>
                            <td className="p-2.5">
                              {r.rollover ? (
                                <span
                                  className={`px-1.5 py-0.5 rounded-sm text-[10px] ${
                                    r.rollover.includes("+1")
                                      ? "bg-amber-500/15 text-amber-500"
                                      : r.rollover.includes("-1")
                                      ? "bg-blue/15 text-blue"
                                      : "bg-surface text-text-3"
                                  }`}
                                >
                                  {r.rollover}
                                </span>
                              ) : (
                                r.error || "—"
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-6 text-center text-text-muted text-xs border border-dashed border-border rounded-xl">
                    Paste timestamps or dates in the input tab to see batch conversion results table here.
                  </div>
                )}
              </div>
            )}

            {activeTab === "reference" && (
              <div className="space-y-4">
                <h3 className="font-bold text-text-2 text-xs uppercase tracking-wider">
                  Common IST Business Hours in UTC
                </h3>
                <div className="divide-y divide-border border border-border rounded-xl bg-bg">
                  {IST_BIZ_HOURS.map((row) => (
                    <div key={row.istLabel} className="flex justify-between p-3 text-xs">
                      <span className="font-medium text-text">{row.istLabel}</span>
                      <span className="font-bold font-mono text-blue">{row.utcLabel}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        }
        infoPanel={
          <div className="bg-surface border border-border p-4 rounded-xl flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-text-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>IST = UTC + 5 hours 30 minutes (Permanent, No Daylight Saving Time)</span>
            </div>

            <div className="flex items-center gap-2">
              <ShareButton
                url={shareUrl}
                title="UTC ↔ IST Conversion Result"
                onQrClick={() => setIsQrOpen(true)}
              />
              <CopyButton text={fullSummary} label="Copy Summary" />
            </div>
          </div>
        }
      />
    </div>
  );
}
