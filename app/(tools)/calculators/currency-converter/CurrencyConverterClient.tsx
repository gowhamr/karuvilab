"use client";
import { useState, useMemo } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { MetricCard } from "@/components/ui/MetricCard";

const cat = CATEGORIES.find((c) => c.id === "calculators")!;

// Approximate rates as of early 2025. 1 USD = ...
const RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  INR: 84.5,
  JPY: 149.5,
  AUD: 1.54,
  CAD: 1.36,
  CHF: 0.89,
  SGD: 1.34,
  AED: 3.67,
  CNY: 7.24,
};

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
};

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$", EUR: "€", GBP: "£", INR: "₹", JPY: "¥",
  AUD: "A$", CAD: "C$", CHF: "Fr", SGD: "S$", AED: "د.إ", CNY: "¥",
};

function convert(amount: number, from: string, to: string): number {
  const usd = amount / (RATES[from] ?? 1);
  return usd * (RATES[to] ?? 1);
}

function fmt(n: number, currency: string): string {
  const sym = CURRENCY_SYMBOLS[currency] ?? currency;
  if (currency === "JPY") return sym + Math.round(n).toLocaleString("en-IN");
  return sym + n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function CurrencyConverterClient() {
  const [amount, setAmount] = useState("100");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("INR");

  const currencies = Object.keys(RATES);

  const result = useMemo(() => {
    const v = parseFloat(amount) || 0;
    return convert(v, from, to);
  }, [amount, from, to]);

  const rate = useMemo(() => convert(1, from, to), [from, to]);

  return (
    <div className="space-y-6">
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 text-sm text-yellow-600 dark:text-yellow-400">
        Rates are approximate (early 2025). For live rates, please verify with your bank or a financial service.
      </div>

      <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-bold text-text-2">Amount</label>
          <input
            type="number"
            min={0}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-3 bg-bg border border-border rounded-xl focus:ring-2 focus:ring-blue outline-none transition-all text-lg font-bold"
            placeholder="Enter amount"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 items-end">
          <div className="space-y-2">
            <label className="text-sm font-bold text-text-2">From</label>
            <select
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full px-4 py-3 bg-bg border border-border rounded-xl focus:ring-2 focus:ring-blue outline-none transition-all"
            >
              {currencies.map((c) => (
                <option key={c} value={c}>
                  {c} — {CURRENCY_LABELS[c]}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => { const t = from; setFrom(to); setTo(t); }}
              className="self-end px-4 py-3 rounded-xl border border-border hover:border-blue hover:text-blue transition-colors text-sm font-bold"
            >
              ⇄ Swap
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-text-2">To</label>
          <select
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full px-4 py-3 bg-bg border border-border rounded-xl focus:ring-2 focus:ring-blue outline-none transition-all"
          >
            {currencies.map((c) => (
              <option key={c} value={c}>
                {c} — {CURRENCY_LABELS[c]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <MetricCard
          label={`${amount} ${from} =`}
          value={fmt(result, to)}
          accent
        />
        <MetricCard
          label={`1 ${from} = ? ${to}`}
          value={fmt(rate, to)}
        />
      </div>

      {/* All currencies table */}
      <div className="bg-surface border border-border p-4 rounded-xl">
        <h2 className="font-bold text-text-2 mb-3 text-sm">1 USD in all currencies</h2>
      </div>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface border-b border-border">
              <th className="px-4 py-3 text-left font-bold text-text-3">Currency</th>
              <th className="px-4 py-3 text-left font-bold text-text-3">Name</th>
              <th className="px-4 py-3 text-right font-bold text-text-3">1 USD =</th>
            </tr>
          </thead>
          <tbody>
            {currencies.map((c) => (
              <tr
                key={c}
                className={`border-b border-border/50 transition-colors ${
                  c === to || c === from ? "bg-blue/5 font-bold" : "hover:bg-surface"
                }`}
              >
                <td className="px-4 py-3 font-mono font-bold text-text">{c}</td>
                <td className="px-4 py-3 text-text-3">{CURRENCY_LABELS[c]}</td>
                <td className={`px-4 py-3 text-right font-bold ${c === to ? "text-blue" : "text-text"}`}>
                  {fmt(RATES[c], c)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
