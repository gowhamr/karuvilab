"use client";

import React, { useState, useMemo, useEffect } from "react";
import { DATA_UNITS, convertData } from "@/src/lib/data-unit-utils";
import { useDataCalcStore } from "@/src/store/useDataCalcStore";
import { ToolInput } from "@/components/ui/ToolInput";
import { ArrowUpDown, History as HistoryIcon, Trash2 } from "lucide-react";
import { formatCurrency } from "@/src/lib/utils";

export function UnitConverterTab() {
  const fromUnit = useDataCalcStore(state => state.fromUnit);
  const toUnit = useDataCalcStore(state => state.toUnit);
  const setFromUnit = useDataCalcStore(state => state.setFromUnit);
  const setToUnit = useDataCalcStore(state => state.setToUnit);
  const history = useDataCalcStore(state => state.history);
  const addToHistory = useDataCalcStore(state => state.addToHistory);
  const clearHistory = useDataCalcStore(state => state.clearHistory);
  const [value, setValue] = useState("1");
  
  const result = useMemo(() => {
    const v = parseFloat(value);
    if (isNaN(v)) return 0;
    return convertData(v, fromUnit, toUnit);
  }, [value, fromUnit, toUnit]);

  const handleSwap = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  const fmtNum = (n: number) => {
    if (n === 0) return "0";
    if (Math.abs(n) < 0.000001 || Math.abs(n) >= 1e15) return n.toExponential(6);
    return n.toLocaleString(undefined, { maximumFractionDigits: 10 });
  };

  const handleConvert = () => {
    const v = parseFloat(value);
    if (!isNaN(v)) {
      addToHistory({
        value: v,
        fromUnit,
        toUnit,
        result
      });
    }
  };

  // Add to history debounced or on change? Let's do it on a button or when it's "stable"
  // For now, let's just show the result live and have a manual "Save to History" if needed, 
  // or just auto-add when it changes significantly.
  // The requirement says "History of recent conversions".
  
  return (
    <div className="space-y-8">
      <div className="bg-surface border border-border p-6 md:p-8 rounded-[32px] shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
          <div className="space-y-4">
            <label className="text-xs font-black uppercase tracking-widest text-text-4 px-1">From</label>
            <div className="flex gap-3">
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="flex-1 px-4 py-3 bg-bg border border-border rounded-2xl focus:ring-2 focus:ring-blue outline-none transition-all text-sm font-bold"
              >
                {DATA_UNITS.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.label} {u.type === 'iec' ? '(Binary)' : ''}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-32 md:w-40 px-4 py-3 bg-bg border border-border rounded-2xl focus:ring-2 focus:ring-blue outline-none transition-all font-black text-lg"
                placeholder="Value"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-black uppercase tracking-widest text-text-4 px-1">To</label>
            <div className="flex gap-3">
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="flex-1 px-4 py-3 bg-bg border border-border rounded-2xl focus:ring-2 focus:ring-blue outline-none transition-all text-sm font-bold"
              >
                {DATA_UNITS.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.label} {u.type === 'iec' ? '(Binary)' : ''}
                  </option>
                ))}
              </select>
              <div className="w-32 md:w-40 px-4 py-3 bg-blue/5 border border-blue/20 rounded-2xl font-black text-lg text-blue truncate">
                {fmtNum(result)}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center gap-4">
          <button
            onClick={handleSwap}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl border border-border hover:border-blue hover:text-blue transition-all text-xs font-black uppercase tracking-widest bg-surface shadow-sm active:scale-95"
          >
            <ArrowUpDown className="w-4 h-4" />
            Swap Units
          </button>
          
          <button
            onClick={handleConvert}
            className="px-8 py-3 bg-blue text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue/20 hover:bg-blue-600 transition-all active:scale-95"
          >
            Save to History
          </button>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="space-y-4">
        <h3 className="text-sm font-black uppercase tracking-widest text-text px-2">Common Conversions</h3>
        <div className="overflow-hidden rounded-[32px] border border-border bg-surface">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-bg/50 border-b border-border">
                <th className="px-6 py-4 text-left font-black text-text-3 uppercase tracking-widest text-[10px]">Unit</th>
                <th className="px-6 py-4 text-right font-black text-text-3 uppercase tracking-widest text-[10px]">Value</th>
                <th className="px-6 py-4 text-left font-black text-text-3 uppercase tracking-widest text-[10px]">Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {DATA_UNITS.filter(u => u.type === DATA_UNITS.find(curr => curr.id === fromUnit)?.type).map((u) => {
                const v = parseFloat(value);
                const conv = isNaN(v) ? 0 : convertData(v, fromUnit, u.id);
                return (
                  <tr key={u.id} className={u.id === toUnit ? "bg-blue/5" : "hover:bg-bg/30"}>
                    <td className="px-6 py-4 font-bold text-text-2">{u.label}</td>
                    <td className="px-6 py-4 text-right font-black text-text tabular-nums">{fmtNum(conv)}</td>
                    <td className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-text-4">
                      {u.type.toUpperCase()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2 text-text-3">
              <HistoryIcon className="w-4 h-4" />
              <h3 className="text-sm font-black uppercase tracking-widest">Recent Conversions</h3>
            </div>
            <button
              onClick={clearHistory}
              className="text-[10px] font-black uppercase tracking-widest text-error hover:underline flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              Clear
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {history.map((h) => (
              <div key={h.id} className="p-4 bg-surface border border-border rounded-2xl flex flex-col gap-1 shadow-sm">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-text-4">
                  <span>{new Date(h.timestamp).toLocaleTimeString()}</span>
                  <span className="text-blue">{h.fromUnit} → {h.toUnit}</span>
                </div>
                <div className="font-bold text-text flex items-baseline gap-2">
                  <span className="text-sm">{h.value}</span>
                  <span className="text-xs text-text-3">to</span>
                  <span className="text-sm text-blue">{fmtNum(h.result)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
