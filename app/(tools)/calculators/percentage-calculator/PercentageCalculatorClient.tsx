"use client";
import { useState, useMemo } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { CopyButton } from "@/components/ui/CopyButton";

const cat = CATEGORIES.find((c) => c.id === "calculators")!;

const fmt = (n: number) =>
  n.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 6 });

function ResultBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface border border-border rounded-xl p-4">
      <div className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">{label}</div>
      <div className="text-2xl font-black text-blue">{value}</div>
    </div>
  );
}

export default function PercentageCalculatorClient() {
  // Mode 1: What is X% of Y?
  const [m1x, setM1x] = useState("20");
  const [m1y, setM1y] = useState("500");

  // Mode 2: X is what % of Y?
  const [m2x, setM2x] = useState("80");
  const [m2y, setM2y] = useState("400");

  // Mode 3: % change from X to Y
  const [m3x, setM3x] = useState("200");
  const [m3y, setM3y] = useState("250");

  const r1 = useMemo(() => {
    const x = parseFloat(m1x) || 0;
    const y = parseFloat(m1y) || 0;
    return (x / 100) * y;
  }, [m1x, m1y]);

  const r2 = useMemo(() => {
    const x = parseFloat(m2x) || 0;
    const y = parseFloat(m2y) || 0;
    if (y === 0) return null;
    return (x / y) * 100;
  }, [m2x, m2y]);

  const r3 = useMemo(() => {
    const x = parseFloat(m3x) || 0;
    const y = parseFloat(m3y) || 0;
    if (x === 0) return null;
    return ((y - x) / Math.abs(x)) * 100;
  }, [m3x, m3y]);

  const INPUT = "w-full px-4 py-3 bg-bg border border-border rounded-xl focus:ring-2 focus:ring-blue outline-none transition-all text-lg font-bold";

  return (
    <div className="space-y-6">
      {/* Mode 1 */}
      <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-4">
        <h2 className="text-lg font-black uppercase tracking-widest text-text">Mode 1 — What is X% of Y?</h2>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-text-3 text-sm font-medium">What is</span>
          <input
            type="number"
            value={m1x}
            onChange={(e) => setM1x(e.target.value)}
            className="w-24 px-3 py-2 bg-bg border border-border rounded-xl focus:ring-2 focus:ring-blue outline-none text-base font-bold"
            placeholder="X"
            aria-label="Percentage X"
          />
          <span className="text-text-3 text-sm font-medium">% of</span>
          <input
            type="number"
            value={m1y}
            onChange={(e) => setM1y(e.target.value)}
            className="w-28 px-3 py-2 bg-bg border border-border rounded-xl focus:ring-2 focus:ring-blue outline-none text-base font-bold"
            placeholder="Y"
            aria-label="Value Y"
          />
          <span className="text-text-3 text-sm font-medium">?</span>
        </div>
        <ResultBox label="Result" value={fmt(r1)} />
        <p className="text-sm text-text-3">
          {m1x}% of {m1y} = <strong className="text-text">{fmt(r1)}</strong>
        </p>
      </div>

      {/* Mode 2 */}
      <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-4">
        <h2 className="text-lg font-black uppercase tracking-widest text-text">Mode 2 — X is what % of Y?</h2>
        <div className="flex items-center gap-3 flex-wrap">
          <input
            type="number"
            value={m2x}
            onChange={(e) => setM2x(e.target.value)}
            className="w-28 px-3 py-2 bg-bg border border-border rounded-xl focus:ring-2 focus:ring-blue outline-none text-base font-bold"
            placeholder="X"
            aria-label="Value X"
          />
          <span className="text-text-3 text-sm font-medium">is what % of</span>
          <input
            type="number"
            value={m2y}
            onChange={(e) => setM2y(e.target.value)}
            className="w-28 px-3 py-2 bg-bg border border-border rounded-xl focus:ring-2 focus:ring-blue outline-none text-base font-bold"
            placeholder="Y"
            aria-label="Value Y"
          />
          <span className="text-text-3 text-sm font-medium">?</span>
        </div>
        <ResultBox
          label="Percentage"
          value={r2 !== null ? fmt(r2) + "%" : "—"}
        />
        {r2 !== null && (
          <p className="text-sm text-text-3">
            {m2x} is <strong className="text-text">{fmt(r2)}%</strong> of {m2y}
          </p>
        )}
      </div>

      {/* Mode 3 */}
      <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-4">
        <h2 className="text-lg font-black uppercase tracking-widest text-text">Mode 3 — Percentage Change</h2>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-text-3 text-sm font-medium">From</span>
          <input
            type="number"
            value={m3x}
            onChange={(e) => setM3x(e.target.value)}
            className="w-28 px-3 py-2 bg-bg border border-border rounded-xl focus:ring-2 focus:ring-blue outline-none text-base font-bold"
            placeholder="From"
            aria-label="Original value"
          />
          <span className="text-text-3 text-sm font-medium">to</span>
          <input
            type="number"
            value={m3y}
            onChange={(e) => setM3y(e.target.value)}
            className="w-28 px-3 py-2 bg-bg border border-border rounded-xl focus:ring-2 focus:ring-blue outline-none text-base font-bold"
            placeholder="To"
            aria-label="New value"
          />
        </div>
        {r3 !== null && (
          <>
            <div className="bg-surface border border-border rounded-xl p-4">
              <div className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">
                {r3 >= 0 ? "Increase" : "Decrease"}
              </div>
              <div
                className={`text-2xl font-black ${r3 >= 0 ? "text-green-500" : "text-red-400"}`}
              >
                {r3 >= 0 ? "+" : ""}{fmt(r3)}%
              </div>
            </div>
            <p className="text-sm text-text-3">
              From {m3x} to {m3y} is a{" "}
              <strong className={r3 >= 0 ? "text-green-500" : "text-red-400"}>
                {r3 >= 0 ? "+" : ""}{fmt(r3)}% {r3 >= 0 ? "increase" : "decrease"}
              </strong>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
