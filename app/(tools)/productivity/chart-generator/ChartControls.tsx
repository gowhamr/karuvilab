"use client";

import React, { useState } from "react";
import { 
  BarChart, PieChart, LineChart, CircleDashed, 
  Type, Palette, Trash2, Plus, ArrowUp, ArrowDown,
  FileDown, Upload, MousePointer2, AreaChart
} from "lucide-react";
import { m, AnimatePresence } from "framer-motion";
import { cn } from "@/src/lib/utils";
import { useToast } from "@/components/ui/Toast";
import { DataPoint, ChartType, PALETTES, ChartOptions } from "./types";

interface ChartControlsProps {
  data: DataPoint[];
  type: ChartType;
  options: ChartOptions;
  setData: (data: DataPoint[]) => void;
  setType: (type: ChartType) => void;
  setOptions: (options: ChartOptions) => void;
  addPoint: () => void;
  updatePoint: (id: string, key: keyof DataPoint, val: any) => void;
  removePoint: (id: string) => void;
  applyPalette: (index: number) => void;
}

export default function ChartControls({
  data, type, options, setData, setType, setOptions,
  addPoint, updatePoint, removePoint, applyPalette
}: ChartControlsProps) {
  const { toast } = useToast();
  const [csvText, setCsvText] = useState("");
  const [showImport, setShowImport] = useState(false);

  const movePoint = (index: number, direction: 'up' | 'down') => {
    const newData = [...data];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= data.length) return;
    
    [newData[index], newData[targetIndex]] = [newData[targetIndex]!, newData[index]!];
    setData(newData);
  };

  const handleImport = () => {
    try {
      const lines = csvText.trim().split("\n").filter(line => line.trim() !== "");
      const newData: DataPoint[] = lines.map((line, i) => {
        const [label, value, color] = line.split(",").map(s => s.trim());
        return {
          id: Math.random().toString(36).substring(7),
          label: label || `Item ${i + 1}`,
          value: Number(value) || 0,
          color: color || PALETTES[options.activePalette]?.colors[i % (PALETTES[options.activePalette]?.colors.length || 1)] || "#4F46E5"
        };
      });
      if (newData.length > 0) {
        setData(newData);
        setShowImport(false);
        setCsvText("");
        toast("Data imported successfully", "success");
      }
    } catch (err) {
      toast("Failed to parse CSV", "error");
    }
  };

  return (
    <div className="space-y-6 lg:sticky lg:top-24">
      {/* Main Config */}
      <div className="p-6 bg-surface border border-border rounded-4xl shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-text-4">Chart Configuration</h2>
          <div className="flex bg-bg p-1 rounded-xl border border-border">
            {(["bar", "line", "area", "pie", "doughnut"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={cn(
                  "p-2 rounded-lg transition-all",
                  type === t ? "bg-blue text-white shadow-md shadow-blue/20" : "text-text-4 hover:text-text"
                )}
                title={t.charAt(0).toUpperCase() + t.slice(1)}
              >
                {t === "bar" && <BarChart className="w-4 h-4" />}
                {t === "line" && <LineChart className="w-4 h-4" />}
                {t === "area" && <AreaChart className="w-4 h-4" />}
                {t === "pie" && <PieChart className="w-4 h-4" />}
                {t === "doughnut" && <CircleDashed className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-text-4 ml-1">Chart Title</label>
            <div className="relative group">
              <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-4 group-focus-within:text-blue transition-colors" />
              <input
                value={options.title}
                onChange={(e) => setOptions({ ...options, title: e.target.value })}
                placeholder="Enter chart title..."
                className="w-full h-12 pl-12 pr-4 bg-bg border border-border rounded-2xl text-sm font-bold focus:border-blue outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setOptions({ ...options, showValues: !options.showValues })}
              className={cn(
                "flex flex-col items-center justify-center p-3 rounded-2xl border transition-all gap-1",
                options.showValues ? "bg-blue/5 border-blue text-blue" : "bg-bg border-border text-text-4"
              )}
            >
              <span className="text-xs font-black uppercase tracking-tighter">Show Values</span>
              <div className={cn("w-6 h-3 rounded-full relative transition-colors", options.showValues ? "bg-blue" : "bg-text-4")}>
                <div className={cn("absolute top-0.5 w-2 h-2 bg-white rounded-full transition-all", options.showValues ? "right-0.5" : "left-0.5")} />
              </div>
            </button>
            <button
              onClick={() => setOptions({ ...options, showGrid: !options.showGrid })}
              className={cn(
                "flex flex-col items-center justify-center p-3 rounded-2xl border transition-all gap-1",
                options.showGrid ? "bg-blue/5 border-blue text-blue" : "bg-bg border-border text-text-4"
              )}
            >
              <span className="text-xs font-black uppercase tracking-tighter">Show Grid</span>
              <div className={cn("w-6 h-3 rounded-full relative transition-colors", options.showGrid ? "bg-blue" : "bg-text-4")}>
                <div className={cn("absolute top-0.5 w-2 h-2 bg-white rounded-full transition-all", options.showGrid ? "right-0.5" : "left-0.5")} />
              </div>
            </button>
          </div>

          {(type === "line" || type === "area") && (
            <div className="flex items-center justify-between p-4 bg-bg border border-border rounded-2xl">
              <span className="text-xs font-bold text-text-2">Smooth Curves</span>
              <button
                onClick={() => setOptions({ ...options, smoothLines: !options.smoothLines })}
                className={cn(
                  "w-10 h-6 rounded-full transition-colors relative",
                  options.smoothLines ? "bg-blue" : "bg-text-4"
                )}
              >
                <m.div 
                  animate={{ x: options.smoothLines ? 18 : 2 }}
                  className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                />
              </button>
            </div>
          )}

          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-widest text-text-4 ml-1">Color Palette</label>
            <div className="flex flex-wrap gap-2">
              {PALETTES.map((p, i) => (
                <button
                  key={p.name}
                  onClick={() => applyPalette(i)}
                  className={cn(
                    "flex p-1 rounded-xl border transition-all",
                    options.activePalette === i ? "border-blue scale-105 shadow-sm" : "border-transparent opacity-60 hover:opacity-100"
                  )}
                >
                  {p.colors.slice(0, 3).map((c) => (
                    <div key={c} className="w-4 h-4 first:rounded-l-lg last:rounded-r-lg" style={{ backgroundColor: c }} />
                  ))}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Data Points */}
      <div className="p-6 bg-surface border border-border rounded-4xl shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-text-4">Data Points</h2>
          <button 
            onClick={() => setShowImport(!showImport)}
            className="text-xs font-black text-blue hover:underline"
          >
            {showImport ? "Show List" : "Import CSV"}
          </button>
        </div>

        {showImport ? (
          <div className="space-y-4">
            <textarea
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              placeholder="Label, Value (one per line)..."
              className="w-full h-40 p-4 bg-bg border border-border rounded-2xl text-xs font-mono focus:border-blue outline-none resize-none"
            />
            <button
              onClick={handleImport}
              className="w-full py-3 bg-blue text-white rounded-xl font-bold text-xs"
            >
              Parse & Apply
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
              <AnimatePresence initial={false}>
                {data.map((p, i) => (
                  <m.div 
                    key={p.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="p-4 bg-bg border border-border rounded-2xl space-y-3 group relative"
                  >
                    <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                      <button 
                        onClick={() => movePoint(i, 'up')}
                        disabled={i === 0}
                        aria-label="Move point up"
                        className="p-1 rounded-lg text-text-4 hover:bg-blue/10 hover:text-blue disabled:opacity-30"
                      >
                        <ArrowUp className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                      <button 
                        onClick={() => movePoint(i, 'down')}
                        disabled={i === data.length - 1}
                        aria-label="Move point down"
                        className="p-1 rounded-lg text-text-4 hover:bg-blue/10 hover:text-blue disabled:opacity-30"
                      >
                        <ArrowDown className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                      <button 
                        onClick={() => removePoint(p.id)}
                        aria-label="Remove point"
                        className="p-1.5 rounded-lg text-text-4 hover:bg-error/10 hover:text-error transition-all active:scale-90"
                      >
                        <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <input 
                        type="color"
                        value={p.color}
                        onChange={(e) => updatePoint(p.id, "color", e.target.value)}
                        aria-label="Point color"
                        className="w-6 h-6 rounded-lg bg-transparent border-none cursor-pointer"
                      />
                      <div className="flex-1 space-y-1">
                        <input 
                          value={p.label}
                          onChange={(e) => updatePoint(p.id, "label", e.target.value)}
                          aria-label="Point label"
                          className="w-full bg-transparent border-none outline-none font-bold text-sm text-text"
                          placeholder="Label..."
                        />
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-text-4 uppercase">Value:</span>
                          <input 
                            type="number"
                            value={p.value}
                            onChange={(e) => updatePoint(p.id, "value", Number(e.target.value))}
                            aria-label="Point value"
                            className="bg-transparent border-none outline-none font-mono text-xs text-blue w-20"
                          />
                        </div>
                      </div>
                    </div>
                  </m.div>
                ))}
              </AnimatePresence>
            </div>

            <button 
              onClick={addPoint}
              className="w-full py-4 bg-blue/5 border-2 border-dashed border-blue/20 rounded-2xl text-blue font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue/10 hover:border-blue/30 transition-all active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" /> Add Data Point
            </button>
          </>
        )}
      </div>
    </div>
  );
}
