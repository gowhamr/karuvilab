"use client";
import { useState, useMemo } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolWorkspace } from "@/components/ui/ToolWorkspace";

const cat = CATEGORIES.find((c) => c.id === "calculators")!;

type UnitDef = { label: string; toBase: (v: number) => number; fromBase: (v: number) => number };

type Category = {
  label: string;
  units: Record<string, UnitDef>;
};

const lin = (factor: number): UnitDef => ({
  label: "",
  toBase: (v) => v * factor,
  fromBase: (v) => v / factor,
});

const CATEGORIES_DATA: Record<string, Category> = {
  length: {
    label: "Length",
    units: {
      m: { label: "Metres (m)", toBase: (v) => v, fromBase: (v) => v },
      km: { label: "Kilometres (km)", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      cm: { label: "Centimetres (cm)", toBase: (v) => v / 100, fromBase: (v) => v * 100 },
      mm: { label: "Millimetres (mm)", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      in: { label: "Inches (in)", toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
      ft: { label: "Feet (ft)", toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
      yd: { label: "Yards (yd)", toBase: (v) => v * 0.9144, fromBase: (v) => v / 0.9144 },
      mi: { label: "Miles (mi)", toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
    },
  },
  weight: {
    label: "Weight",
    units: {
      kg: { label: "Kilograms (kg)", toBase: (v) => v, fromBase: (v) => v },
      g: { label: "Grams (g)", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      mg: { label: "Milligrams (mg)", toBase: (v) => v / 1e6, fromBase: (v) => v * 1e6 },
      lb: { label: "Pounds (lb)", toBase: (v) => v * 0.453592, fromBase: (v) => v / 0.453592 },
      oz: { label: "Ounces (oz)", toBase: (v) => v * 0.0283495, fromBase: (v) => v / 0.0283495 },
      ton: { label: "Metric Tons (t)", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    },
  },
  volume: {
    label: "Volume",
    units: {
      L: { label: "Litres (L)", toBase: (v) => v, fromBase: (v) => v },
      mL: { label: "Millilitres (mL)", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      "m³": { label: "Cubic Metres (m³)", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      "cm³": { label: "Cubic Centimetres (cm³)", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      "in³": { label: "Cubic Inches (in³)", toBase: (v) => v * 0.0163871, fromBase: (v) => v / 0.0163871 },
      "ft³": { label: "Cubic Feet (ft³)", toBase: (v) => v * 28.3168, fromBase: (v) => v / 28.3168 },
      gal: { label: "Gallons (US gal)", toBase: (v) => v * 3.78541, fromBase: (v) => v / 3.78541 },
      "fl oz": { label: "Fluid Ounces (fl oz)", toBase: (v) => v * 0.0295735, fromBase: (v) => v / 0.0295735 },
    },
  },
  temperature: {
    label: "Temperature",
    units: {
      "°C": {
        label: "Celsius (°C)",
        toBase: (v) => v,
        fromBase: (v) => v,
      },
      "°F": {
        label: "Fahrenheit (°F)",
        toBase: (v) => (v - 32) * (5 / 9),
        fromBase: (v) => v * (9 / 5) + 32,
      },
      K: {
        label: "Kelvin (K)",
        toBase: (v) => v - 273.15,
        fromBase: (v) => v + 273.15,
      },
    },
  },
  area: {
    label: "Area",
    units: {
      "m²": { label: "Sq Metres (m²)", toBase: (v) => v, fromBase: (v) => v },
      "km²": { label: "Sq Kilometres (km²)", toBase: (v) => v * 1e6, fromBase: (v) => v / 1e6 },
      "cm²": { label: "Sq Centimetres (cm²)", toBase: (v) => v / 1e4, fromBase: (v) => v * 1e4 },
      "ft²": { label: "Sq Feet (ft²)", toBase: (v) => v * 0.092903, fromBase: (v) => v / 0.092903 },
      "yd²": { label: "Sq Yards (yd²)", toBase: (v) => v * 0.836127, fromBase: (v) => v / 0.836127 },
      ac: { label: "Acres (ac)", toBase: (v) => v * 4046.86, fromBase: (v) => v / 4046.86 },
      ha: { label: "Hectares (ha)", toBase: (v) => v * 10000, fromBase: (v) => v / 10000 },
    },
  },
  speed: {
    label: "Speed",
    units: {
      "m/s": { label: "Metres/sec (m/s)", toBase: (v) => v, fromBase: (v) => v },
      "km/h": { label: "Km/hour (km/h)", toBase: (v) => v / 3.6, fromBase: (v) => v * 3.6 },
      mph: { label: "Miles/hour (mph)", toBase: (v) => v * 0.44704, fromBase: (v) => v / 0.44704 },
      knot: { label: "Knots (kn)", toBase: (v) => v * 0.514444, fromBase: (v) => v / 0.514444 },
    },
  },
};

function fmtNum(n: number): string {
  if (!isFinite(n)) return "—";
  if (Math.abs(n) >= 1e12 || (Math.abs(n) < 1e-6 && n !== 0)) return n.toExponential(6);
  return parseFloat(n.toPrecision(10)).toLocaleString("en-IN", { maximumFractionDigits: 8 });
}

export default function UnitConverterClient() {
  const [catKey, setCatKey] = useState("length");
  const category = CATEGORIES_DATA[catKey]!;
  const unitKeys = Object.keys(category.units);

  const [from, setFrom] = useState(unitKeys[0]!);
  const [to, setTo] = useState(unitKeys[1]!);
  const [value, setValue] = useState("1");

  const result = useMemo(() => {
    const v = parseFloat(value);
    if (isNaN(v)) return null;
    const fromUnit = category.units[from];
    const toUnit = category.units[to];
    if (!fromUnit || !toUnit) return null;
    const base = fromUnit.toBase(v);
    return toUnit.fromBase(base);
  }, [value, from, to, category]);

  // When category changes, reset from/to
  const handleCat = (k: string) => {
    setCatKey(k);
    const keys = Object.keys(CATEGORIES_DATA[k]!.units);
    setFrom(keys[0]!);
    setTo(keys[1]!);
    setValue("1");
  };

  return (
    <ToolWorkspace
      layout="split"
      tabs={{
        options: Object.entries(CATEGORIES_DATA).map(([k, v]) => ({ id: k, label: v.label })),
        activeId: catKey,
        onChange: handleCat
      }}
      input={
        <div className="space-y-5">
          {/* From unit */}
          <div className="space-y-2">
            <label htmlFor="from-unit-select" className="text-sm font-bold text-text-2">From</label>
            <div className="flex gap-3">
              <select
                id="from-unit-select"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="flex-1 px-4 py-3 bg-bg border border-border rounded-xl focus:ring-2 focus:ring-blue outline-none transition-all"
              >
                {unitKeys.map((k) => (
                  <option key={k} value={k}>
                    {category.units[k]!.label || k}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={value || ''}
                onChange={(e) => setValue(e.target.value)}
                className="w-36 px-4 py-3 bg-bg border border-border rounded-xl focus:ring-2 focus:ring-blue outline-none transition-all font-bold text-lg"
                placeholder="Value"
              />
            </div>
          </div>

          {/* Swap button */}
          <div className="flex justify-center">
            <button
              onClick={() => { const t = from; setFrom(to); setTo(t); }}
              className="px-4 py-2 rounded-xl border border-border hover:border-blue hover:text-blue transition-colors text-sm font-bold"
            >
              ⇅ Swap
            </button>
          </div>

          {/* To unit */}
          <div className="space-y-2">
            <label htmlFor="to-unit-select" className="text-sm font-bold text-text-2">To</label>
            <div className="flex gap-3">
              <select
                id="to-unit-select"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="flex-1 px-4 py-3 bg-bg border border-border rounded-xl focus:ring-2 focus:ring-blue outline-none transition-all"
              >
                {unitKeys.map((k) => (
                  <option key={k} value={k}>
                    {category.units[k]!.label || k}
                  </option>
                ))}
              </select>
              <div className="w-36 px-4 py-3 bg-bg border border-blue/50 rounded-xl font-bold text-lg text-blue flex items-center">
                {result !== null ? fmtNum(result) : "—"}
              </div>
            </div>
          </div>

          {result !== null && (
            <div className="bg-surface border border-border p-4 rounded-xl text-sm text-text-3">
              <strong>{value} {from}</strong> = <strong className="text-blue">{fmtNum(result)} {to}</strong>
            </div>
          )}
        </div>
      }
      output={
        <div className="overflow-x-auto rounded-xl border border-border h-full">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface border-b border-border">
                <th className="px-4 py-3 text-left font-bold text-text-3">Unit</th>
                <th className="px-4 py-3 text-right font-bold text-text-3">Value</th>
              </tr>
            </thead>
            <tbody>
              {unitKeys.map((k) => {
                const v = parseFloat(value);
                if (isNaN(v)) return null;
                const fromUnit = category.units[from]!;
                const base = fromUnit.toBase(v);
                const conv = category.units[k]!.fromBase(base);
                return (
                  <tr
                    key={k}
                    className={`border-b border-border/50 transition-colors ${
                      k === to ? "bg-blue/5 font-bold" : "hover:bg-surface"
                    }`}
                  >
                    <td className="px-4 py-3 text-text-2">{category.units[k]!.label || k}</td>
                    <td className={`px-4 py-3 text-right font-bold ${k === to ? "text-blue" : "text-text"}`}>
                      {fmtNum(conv)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      }
    />
  );
}
