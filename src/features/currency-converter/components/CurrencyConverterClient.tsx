"use client";
import React, { useEffect, useMemo, useId, useState } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { MetricCard } from "@/components/ui/MetricCard";
import { ToolInput } from "@/components/ui/ToolInput";
import { useCurrencyStore } from "../store";
import { clearExpiredCurrencyRates } from "@/src/lib/db";
import { 
  RefreshCw, 
  AlertTriangle, 
  Clock, 
  ArrowRightLeft,
  Globe,
  WifiOff,
  Terminal,
  ChevronUp,
  ExternalLink,
  Activity
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { CurrencySelect } from "./CurrencySelect";

const cat = CATEGORIES.find((c) => c.id === "calculators")!;

const POPULAR_CURRENCIES = ["USD", "EUR", "INR", "GBP", "JPY", "AUD", "CAD", "CHF", "CNY", "SGD", "AED"];

const CURRENCY_LABELS: Record<string, string> = {
  USD: "US Dollar",
  EUR: "Euro",
  GBP: "British Pound",
  INR: "Indian Rupee",
  JPY: "Japanese Yen",
  AUD: "Australian Dollar",
  CAD: "Canadian Dollar",
  CHF: "Swiss Franc",
  SGD: "Singapore Dollar",
  AED: "UAE Dirham",
  CNY: "Chinese Yuan",
  NZD: "NZ Dollar",
  HKD: "HK Dollar",
  BRL: "Brazilian Real",
  ZAR: "SA Rand",
  RUB: "Russian Ruble",
  KRW: "South Korean Won",
  TRY: "Turkish Lira",
  MXN: "Mexican Peso",
  IDR: "Indonesian Rupiah",
  THB: "Thai Baht",
  MYR: "Malaysian Ringgit",
  PHP: "Philippine Peso",
  SAR: "Saudi Riyal",
  KWD: "Kuwaiti Dinar",
  QAR: "Qatari Riyal",
};

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$", EUR: "€", GBP: "£", INR: "₹", JPY: "¥",
  AUD: "A$", CAD: "C$", CHF: "Fr", SGD: "S$", AED: "د.إ", CNY: "¥",
  NZD: "$", HKD: "$", BRL: "R$", ZAR: "R", RUB: "₽", KRW: "₩",
  TRY: "₺", MXN: "$", IDR: "Rp", THB: "฿", MYR: "RM", PHP: "₱",
  SAR: "ر.س", KWD: "د.ك", QAR: "ر.ق",
};

export default function CurrencyConverterClient() {
  const ratesData = useCurrencyStore(state => state.ratesData);
  const isLoading = useCurrencyStore(state => state.isLoading);
  const error = useCurrencyStore(state => state.error);
  const amount = useCurrencyStore(state => state.amount);
  const from = useCurrencyStore(state => state.from);
  const to = useCurrencyStore(state => state.to);
  const fetchRates = useCurrencyStore(state => state.fetchRates);
  const setAmount = useCurrencyStore(state => state.setAmount);
  const setFrom = useCurrencyStore(state => state.setFrom);
  const setTo = useCurrencyStore(state => state.setTo);
  const swapCurrencies = useCurrencyStore(state => state.swapCurrencies);

  const [showDebug, setShowDebug] = useState(false);

  // Initial fetch
  useEffect(() => {
    fetchRates();
    clearExpiredCurrencyRates();
  }, [fetchRates]);

  const currencies = useMemo(() => {
    if (!ratesData) return Object.keys(CURRENCY_LABELS);
    const apiCurrencies = Object.keys(ratesData.rates);
    // Combine known labels with any extra from API
    return Array.from(new Set([...Object.keys(CURRENCY_LABELS), ...apiCurrencies])).sort();
  }, [ratesData]);

  const currencyOptions = useMemo(() => {
    return currencies.map(code => ({
      code,
      name: CURRENCY_LABELS[code] || "Currency"
    }));
  }, [currencies]);

  const convert = (val: number, f: string, t: string) => {
    if (!ratesData) return 0;
    const baseRate = ratesData.rates[f] || 1;
    const targetRate = ratesData.rates[t] || 1;
    // Cross conversion through base (1/baseRate converts to USD, then * targetRate)
    return (val / baseRate) * targetRate;
  };

  const result = useMemo(() => {
    const v = parseFloat(amount) || 0;
    return convert(v, from, to);
  }, [amount, from, to, ratesData]);

  const rate = useMemo(() => convert(1, from, to), [from, to, ratesData]);

  const fmt = (n: number, currency: string): string => {
    const sym = CURRENCY_SYMBOLS[currency] ?? currency;
    if (currency === "JPY") return sym + Math.round(n).toLocaleString();
    return sym + n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const getTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  const isStale = ratesData && (Date.now() > ratesData.expiresAt);
  const isOffline = typeof navigator !== 'undefined' && !navigator.onLine;

  return (
    <div className="space-y-6">
      {/* Network/Status Banners */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-xs font-bold text-red-600 space-y-2 animate-in fade-in slide-in-from-top-2" role="alert">
          <div className="flex items-center gap-3">
            <AlertTriangle size={16} />
            {error}
          </div>
          {ratesData?.debugInfo && (
            <button 
              onClick={() => setShowDebug(true)}
              className="ml-7 text-[10px] uppercase tracking-widest text-red-700 hover:underline flex items-center gap-1"
            >
              <Terminal size={10} />
              View Technical Details
            </button>
          )}
        </div>
      )}

      {isOffline && !ratesData && (
        <div className="bg-surface border border-border rounded-2xl p-12 text-center space-y-4">
          <div className="w-16 h-16 bg-blue/10 rounded-full flex items-center justify-center mx-auto text-blue">
            <WifiOff size={32} />
          </div>
          <h3 className="text-lg font-black uppercase tracking-tight">Offline</h3>
          <p className="text-sm text-text-4 max-w-xs mx-auto font-bold uppercase leading-relaxed">
            Internet connection required to load exchange rates for the first time.
          </p>
          <button 
            onClick={() => fetchRates(true)}
            className="px-6 py-3 bg-blue text-white rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
          >
            Retry Connection
          </button>
        </div>
      )}

      {ratesData && (isOffline || (ratesData.source === 'cache' && isStale)) && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-xs font-bold text-amber-600 flex items-center gap-3 animate-in fade-in slide-in-from-top-2" role="alert">
          <AlertTriangle size={16} className="shrink-0" />
          <div className="flex-1">
            {isOffline ? "You are currently offline." : "Using cached rates – go online for live updates."} 
            <span className="block mt-0.5 opacity-80 font-medium">Last updated: {new Date(ratesData.timestamp).toLocaleString()}</span>
          </div>
        </div>
      )}

      {/* Debug Console */}
      {showDebug && ratesData?.debugInfo && (
        <div className="bg-[#0F172A] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
          <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
            <div className="flex items-center gap-2 text-slate-400">
              <Terminal size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Network Diagnostics</span>
            </div>
            <button 
              onClick={() => setShowDebug(false)}
              className="text-slate-500 hover:text-white transition-colors"
            >
              <ChevronUp size={16} />
            </button>
          </div>
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800/50">
                <span className="block text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Total Latency</span>
                <span className="text-blue-400 font-mono text-sm font-bold">{ratesData.debugInfo.latency || 'N/A'}ms</span>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800/50">
                <span className="block text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Active Source</span>
                <span className="text-emerald-400 font-mono text-sm font-bold uppercase">{ratesData.source}</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest px-1">Fetch Attempts</span>
              {ratesData.debugInfo.attempts.map((attempt, i) => (
                <div key={i} className="bg-slate-900/80 p-3 rounded-xl border border-slate-800/50 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        attempt.success ? "bg-emerald-500" : "bg-red-500"
                      )} />
                      <span className="text-[10px] font-bold text-slate-300 uppercase">{attempt.source}</span>
                    </div>
                    {attempt.latency && <span className="text-[10px] font-mono text-slate-500">{attempt.latency}ms</span>}
                  </div>
                  {attempt.url && (
                    <div className="flex items-center gap-1.5 opacity-50 overflow-hidden">
                      <ExternalLink size={10} className="shrink-0" />
                      <span className="text-[9px] font-mono truncate text-slate-400">{attempt.url}</span>
                    </div>
                  )}
                  {attempt.error && (
                    <div className="text-[9px] font-mono text-red-400/80 leading-relaxed bg-red-500/5 p-2 rounded-lg border border-red-500/10">
                      ERR: {attempt.error} {attempt.status && `(HTTP ${attempt.status})`}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {(ratesData || isLoading) && (
        <>
          <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-5 relative overflow-hidden">
            {isLoading && (
              <div className="absolute top-0 left-0 w-full h-1 bg-blue/20 overflow-hidden">
                <div className="h-full bg-blue animate-progress w-full" />
              </div>
            )}

            <ToolInput
              label="Amount"
              type="number"
              value={amount}
              onChange={setAmount}
              placeholder="Enter amount"
            />

            <div className="grid grid-cols-1 sm:grid-cols-11 gap-4 items-end">
              <div className="sm:col-span-5">
                <CurrencySelect
                  label="From"
                  value={from}
                  onChange={setFrom}
                  options={currencyOptions}
                  popularCodes={POPULAR_CURRENCIES}
                />
              </div>

              <div className="sm:col-span-1 flex justify-center pb-2">
                <button
                  onClick={swapCurrencies}
                  aria-label="Swap currencies"
                  className="p-3 rounded-full bg-surface border border-border hover:border-blue hover:text-blue transition-all active:rotate-180 duration-500"
                >
                  <ArrowRightLeft size={18} />
                </button>
              </div>

              <div className="sm:col-span-5">
                <CurrencySelect
                  label="To"
                  value={to}
                  onChange={setTo}
                  options={currencyOptions}
                  popularCodes={POPULAR_CURRENCIES}
                />
              </div>
            </div>

            {/* Freshness Indicator */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-4" aria-live="polite">
                {isLoading ? (
                  <>
                    <RefreshCw size={10} className="animate-spin text-blue" />
                    <span className="text-blue">Updating rates...</span>
                  </>
                ) : ratesData ? (
                  <>
                    {isStale ? <AlertTriangle size={10} className="text-orange-500" /> : <Clock size={10} />}
                    <span className={cn(isStale && "text-orange-500")}>
                      Rates updated: {getTimeAgo(ratesData.timestamp)}
                      {isStale && " (May be outdated)"}
                    </span>
                    <button 
                      onClick={() => setShowDebug(!showDebug)}
                      className={cn(
                        "ml-2 flex items-center gap-1 transition-colors",
                        showDebug ? "text-blue" : "hover:text-blue opacity-50 hover:opacity-100"
                      )}
                    >
                      <Activity size={10} />
                      Diagnostics
                    </button>
                  </>
                ) : null}
              </div>
              
              <button
                onClick={() => fetchRates(true)}
                disabled={isLoading}
                aria-label="Refresh exchange rates"
                className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-blue hover:opacity-70 disabled:opacity-30 transition-opacity"
              >
                <RefreshCw size={10} className={cn(isLoading && "animate-spin")} />
                Refresh
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <MetricCard
              label={`${amount} ${from} =`}
              value={ratesData ? fmt(result, to) : '--'}
              accent
            />
            <MetricCard
              label={`1 ${from} = ? ${to}`}
              value={ratesData ? fmt(rate, to) : '--'}
            />
          </div>

          {/* Quick Rates Table */}
          <div className="bg-surface border border-border rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-border bg-surface/50 backdrop-blur-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe size={18} className="text-blue" />
                <h2 className="font-black uppercase tracking-widest text-xs">Live Market Rates</h2>
              </div>
              <span className="text-[10px] font-bold text-text-4 uppercase tracking-wider">Base: {from}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-surface border-b border-border">
                    <th className="px-6 py-4 text-left font-black uppercase tracking-widest text-[10px] text-text-3">Currency</th>
                    <th className="px-6 py-4 text-left font-black uppercase tracking-widest text-[10px] text-text-3">Name</th>
                    <th className="px-6 py-4 text-right font-black uppercase tracking-widest text-[10px] text-text-3">Rate (1 {from})</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {currencies.slice(0, 15).map((c) => {
                    const r = ratesData?.rates[c];
                    return (
                      <tr
                        key={c}
                        className={cn(
                          "transition-colors",
                          c === to ? "bg-blue/5" : "hover:bg-blue/5"
                        )}
                      >
                        <td className="px-6 py-4 font-mono font-black text-xs text-text">{c}</td>
                        <td className="px-6 py-4 text-xs font-bold text-text-3">{CURRENCY_LABELS[c] || c}</td>
                        <td className={cn(
                          "px-6 py-4 text-right font-black tabular-nums text-xs",
                          c === to ? "text-blue" : "text-text"
                        )}>
                          {r ? fmt(r, c) : '--'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-bg/30 text-center">
              <p className="text-[10px] font-bold text-text-4 uppercase tracking-widest">
                Showing top market currencies. All conversions use live mid-market rates.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
