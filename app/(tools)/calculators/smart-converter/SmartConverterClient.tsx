"use client";
import { useState, useMemo } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";

const cat = CATEGORIES.find((c) => c.id === "calculators")!;

// Unit conversion map: key = canonical unit name, value = { toBase, fromBase, aliases }
type UnitEntry = { toBase: (v: number) => number; fromBase: (v: number) => number; group: string };

const UNITS: Record<string, UnitEntry> = {
  // Length
  m:    { group: "length", toBase: v => v,           fromBase: v => v },
  km:   { group: "length", toBase: v => v * 1000,    fromBase: v => v / 1000 },
  cm:   { group: "length", toBase: v => v / 100,     fromBase: v => v * 100 },
  mm:   { group: "length", toBase: v => v / 1000,    fromBase: v => v * 1000 },
  in:   { group: "length", toBase: v => v * 0.0254,  fromBase: v => v / 0.0254 },
  ft:   { group: "length", toBase: v => v * 0.3048,  fromBase: v => v / 0.3048 },
  yd:   { group: "length", toBase: v => v * 0.9144,  fromBase: v => v / 0.9144 },
  mi:   { group: "length", toBase: v => v * 1609.344,fromBase: v => v / 1609.344 },
  // Weight
  kg:   { group: "weight", toBase: v => v,            fromBase: v => v },
  g:    { group: "weight", toBase: v => v / 1000,     fromBase: v => v * 1000 },
  mg:   { group: "weight", toBase: v => v / 1e6,      fromBase: v => v * 1e6 },
  lb:   { group: "weight", toBase: v => v * 0.453592, fromBase: v => v / 0.453592 },
  lbs:  { group: "weight", toBase: v => v * 0.453592, fromBase: v => v / 0.453592 },
  oz:   { group: "weight", toBase: v => v * 0.028349, fromBase: v => v / 0.028349 },
  // Temperature
  c:    { group: "temp",   toBase: v => v,              fromBase: v => v },
  f:    { group: "temp",   toBase: v => (v-32)*5/9,    fromBase: v => v*9/5+32 },
  k:    { group: "temp",   toBase: v => v-273.15,       fromBase: v => v+273.15 },
  // Volume
  l:    { group: "volume", toBase: v => v,              fromBase: v => v },
  ml:   { group: "volume", toBase: v => v / 1000,       fromBase: v => v * 1000 },
  gal:  { group: "volume", toBase: v => v * 3.78541,    fromBase: v => v / 3.78541 },
  // Speed
  "km/h":{ group: "speed", toBase: v => v / 3.6,       fromBase: v => v * 3.6 },
  mph:  { group: "speed",  toBase: v => v * 0.44704,    fromBase: v => v / 0.44704 },
  "m/s":{ group: "speed",  toBase: v => v,              fromBase: v => v },
  // Currency (approximate)
  usd:  { group: "currency", toBase: v => v,             fromBase: v => v },
  eur:  { group: "currency", toBase: v => v / 0.92,      fromBase: v => v * 0.92 },
  gbp:  { group: "currency", toBase: v => v / 0.79,      fromBase: v => v * 0.79 },
  inr:  { group: "currency", toBase: v => v / 84.5,      fromBase: v => v * 84.5 },
  jpy:  { group: "currency", toBase: v => v / 149.5,     fromBase: v => v * 149.5 },
  aud:  { group: "currency", toBase: v => v / 1.54,      fromBase: v => v * 1.54 },
  cad:  { group: "currency", toBase: v => v / 1.36,      fromBase: v => v * 1.36 },
  sgd:  { group: "currency", toBase: v => v / 1.34,      fromBase: v => v * 1.34 },
  aed:  { group: "currency", toBase: v => v / 3.67,      fromBase: v => v * 3.67 },
};

// Aliases mapping
const ALIASES: Record<string, string> = {
  metres: "m", meter: "m", meters: "m", metre: "m",
  kilometres: "km", kilometer: "km", kilometers: "km", kilometre: "km",
  centimetres: "cm", centimeter: "cm", centimeters: "cm", centimetre: "cm",
  millimetres: "mm", millimeter: "mm", millimeters: "mm", millimetre: "mm",
  inch: "in", inches: "in",
  foot: "ft", feet: "ft",
  yard: "yd", yards: "yd",
  mile: "mi", miles: "mi",
  kilogram: "kg", kilograms: "kg",
  gram: "g", grams: "g",
  milligram: "mg", milligrams: "mg",
  pound: "lb", pounds: "lbs",
  ounce: "oz", ounces: "oz",
  celsius: "c", fahrenheit: "f", kelvin: "k",
  litre: "l", litres: "l", liter: "l", liters: "l",
  millilitre: "ml", millilitres: "ml", milliliter: "ml", milliliters: "ml",
  gallon: "gal", gallons: "gal",
  "miles per hour": "mph",
  "kilometers per hour": "km/h", "km per hour": "km/h",
  "metres per second": "m/s", "meters per second": "m/s",
  dollar: "usd", dollars: "usd",
  euro: "eur", euros: "eur",
  "british pound": "gbp", "pound sterling": "gbp",
  rupee: "inr", rupees: "inr",
  yen: "jpy",
};

function resolveUnit(s: string): string | null {
  const lower = s.toLowerCase().trim();
  if (UNITS[lower]) return lower;
  if (ALIASES[lower]) return ALIASES[lower];
  return null;
}

function parseQuery(query: string): { value: number; from: string; to: string } | null {
  // Patterns: "5 kg to lbs", "100 USD to EUR", "3 feet in cm"
  const match = query.match(/^(-?\d+(?:\.\d+)?)\s+([a-zA-Z°\/\s]+?)\s+(?:to|in|into)\s+([a-zA-Z°\/\s]+)$/i);
  if (!match) return null;
  const value = parseFloat(match[1]!);
  const fromKey = resolveUnit(match[2]!.trim());
  const toKey = resolveUnit(match[3]!.trim());
  if (!fromKey || !toKey) return null;
  return { value, from: fromKey, to: toKey };
}

function doConvert(value: number, from: string, to: string): number | null {
  const fu = UNITS[from];
  const tu = UNITS[to];
  if (!fu || !tu) return null;
  if (fu.group !== tu.group) return null;
  const base = fu.toBase(value);
  return tu.fromBase(base);
}

function fmt(n: number): string {
  if (!isFinite(n)) return "?";
  const abs = Math.abs(n);
  if (abs >= 1e9 || (abs < 1e-4 && abs > 0)) return n.toExponential(4);
  return parseFloat(n.toPrecision(8)).toLocaleString("en-IN", { maximumFractionDigits: 6 });
}

const EXAMPLES = [
  "5 kg to lbs",
  "100 USD to INR",
  "3 feet to cm",
  "72 F to C",
  "1 mile to km",
  "500 ml to L",
  "60 mph to km/h",
  "1000 INR to USD",
];

export default function SmartConverterClient() {
  const [query, setQuery] = useState("");

  const result = useMemo(() => {
    if (!query.trim()) return null;
    const parsed = parseQuery(query);
    if (!parsed) return { error: "Could not parse. Try: '5 kg to lbs'" };
    const res = doConvert(parsed.value, parsed.from, parsed.to);
    if (res === null) return { error: `Cannot convert ${parsed.from} to ${parsed.to} (different unit types)` };
    return { value: parsed.value, from: parsed.from, to: parsed.to, result: res };
  }, [query]);

  return (
    <div className="space-y-6">
      <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-4">
        <div className="space-y-2">
          <label htmlFor="smart-input" className="text-sm font-bold text-text-2">
            What do you want to convert?
          </label>
          <input
            id="smart-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. 5 kg to lbs"
            className="w-full px-4 py-4 bg-bg border border-border rounded-xl focus:ring-2 focus:ring-blue outline-none transition-all text-lg"
            autoFocus
          />
        </div>

        {/* Example pills */}
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              onClick={() => setQuery(ex)}
              className="px-3 py-1.5 rounded-full text-xs font-medium bg-bg border border-border hover:border-blue hover:text-blue transition-colors"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      {result && (
        <div
          className={`p-6 rounded-2xl border ${
            "error" in result
              ? "bg-red-500/10 border-red-500/30"
              : "bg-surface border-border"
          }`}
        >
          {"error" in result ? (
            <p className="text-red-400 font-medium">{result.error}</p>
          ) : (
            <div className="space-y-2">
              <div className="text-xs font-bold text-text-4 uppercase tracking-wider">Result</div>
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-xl text-text-3 font-medium">
                  {fmt(result.value)} {result.from}
                </span>
                <span className="text-text-4">=</span>
                <span className="text-4xl font-black text-blue">
                  {fmt(result.result)} {result.to}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {!result && (
        <div className="bg-surface border border-border rounded-2xl p-6 space-y-3">
          <h2 className="font-bold text-text-2 text-sm">Supported formats</h2>
          <ul className="space-y-1 text-sm text-text-3">
            <li>• <code className="bg-bg px-1.5 py-0.5 rounded text-xs font-mono">5 kg to lbs</code> — weight conversion</li>
            <li>• <code className="bg-bg px-1.5 py-0.5 rounded text-xs font-mono">100 USD to INR</code> — currency (approximate)</li>
            <li>• <code className="bg-bg px-1.5 py-0.5 rounded text-xs font-mono">3 feet in cm</code> — length conversion</li>
            <li>• <code className="bg-bg px-1.5 py-0.5 rounded text-xs font-mono">72 F to C</code> — temperature</li>
            <li>• <code className="bg-bg px-1.5 py-0.5 rounded text-xs font-mono">60 mph to km/h</code> — speed</li>
          </ul>
        </div>
      )}
    </div>
  );
}
