"use client";
import { useState, useMemo } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { CopyButton } from "@/components/ui/CopyButton";

const cat = CATEGORIES.find((c) => c.id === "calculators")!;

const BASES = [
  { base: 2, label: "Binary", prefix: "0b" },
  { base: 8, label: "Octal", prefix: "0o" },
  { base: 10, label: "Decimal", prefix: "" },
  { base: 16, label: "Hexadecimal", prefix: "0x" },
];

function isValidInBase(s: string, base: number): boolean {
  if (!s || s === "-") return false;
  const chars: Record<number, RegExp> = {
    2: /^-?[01]+$/,
    8: /^-?[0-7]+$/,
    10: /^-?[0-9]+$/,
    16: /^-?[0-9a-fA-F]+$/,
  };
  return chars[base]?.test(s) ?? false;
}

export default function NumeralConverter() {
  const [inputs, setInputs] = useState<Record<number, string>>({
    2: "", 8: "", 10: "42", 16: "",
  });
  const [activeBase, setActiveBase] = useState(10);

  const decimal = useMemo(() => {
    const s = inputs[activeBase];
    if (!isValidInBase(s, activeBase)) return null;
    return parseInt(s, activeBase);
  }, [inputs, activeBase]);

  const conversions = useMemo(() => {
    if (decimal === null || isNaN(decimal)) return null;
    return {
      2: (decimal >>> 0).toString(2).toUpperCase(),
      8: (decimal >>> 0).toString(8).toUpperCase(),
      10: decimal.toString(10),
      16: (decimal >>> 0).toString(16).toUpperCase(),
    };
  }, [decimal]);

  const handleChange = (base: number, value: string) => {
    setActiveBase(base);
    setInputs((prev) => ({ ...prev, [base]: value }));
    // Update other fields
    if (isValidInBase(value, base)) {
      const dec = parseInt(value, base);
      const updated: Record<number, string> = { ...inputs, [base]: value };
      BASES.forEach(({ base: b }) => {
        if (b !== base) {
          updated[b] = (dec >>> 0).toString(b).toUpperCase();
        }
      });
      setInputs(updated);
    }
  };

  const bits = useMemo(() => {
    if (decimal === null || decimal < 0 || decimal > 255) return null;
    return (decimal >>> 0).toString(2).padStart(8, "0");
  }, [decimal]);

  const summary = conversions
    ? `Numeral Converter\n------------------\nDecimal: ${conversions[10]}\nBinary: ${conversions[2]}\nOctal: ${conversions[8]}\nHexadecimal: ${conversions[16]}\n\nGenerated via KaruviLab`
    : "";

  return (
    <ToolShell
      title="Numeral Converter"
      description="Convert numbers between Binary, Octal, Decimal, and Hexadecimal bases."
      category={cat}
    >
      <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-5">
        {BASES.map(({ base, label, prefix }) => (
          <div key={base} className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-text-2">
                {label} (Base {base})
              </label>
              {conversions && (
                <CopyButton text={conversions[base as keyof typeof conversions]} label="Copy" />
              )}
            </div>
            <div className="flex gap-2 items-center">
              {prefix && (
                <span className="text-sm font-mono text-text-4 bg-bg border border-border px-3 py-3 rounded-xl">
                  {prefix}
                </span>
              )}
              <input
                type="text"
                value={inputs[base]}
                onChange={(e) => handleChange(base, e.target.value.toUpperCase())}
                onFocus={() => setActiveBase(base)}
                placeholder={`Enter ${label.toLowerCase()} number`}
                className={`flex-1 px-4 py-3 bg-bg border rounded-xl focus:ring-2 focus:ring-blue outline-none transition-all font-mono text-lg ${
                  inputs[base] && !isValidInBase(inputs[base], base)
                    ? "border-red-400 focus:ring-red-400"
                    : "border-border"
                }`}
              />
            </div>
            {inputs[base] && !isValidInBase(inputs[base], base) && (
              <p className="text-xs text-red-400">Invalid {label.toLowerCase()} number</p>
            )}
          </div>
        ))}
      </div>

      {/* Bit representation */}
      {bits && (
        <div className="bg-surface border border-border p-5 rounded-2xl shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-text-2">8-bit Representation</h2>
            <span className="text-xs text-text-4">Value: {decimal}</span>
          </div>
          <div className="flex gap-1 flex-wrap">
            {bits.split("").map((bit, i) => (
              <div
                key={i}
                className={`w-10 h-10 rounded-lg flex items-center justify-center font-mono text-lg font-black border ${
                  bit === "1"
                    ? "bg-blue text-white border-blue"
                    : "bg-bg border-border text-text-4"
                }`}
              >
                {bit}
              </div>
            ))}
          </div>
          <div className="flex gap-1 flex-wrap">
            {[7, 6, 5, 4, 3, 2, 1, 0].map((pos) => (
              <div key={pos} className="w-10 text-center text-[10px] text-text-4 font-bold">
                2^{pos}
              </div>
            ))}
          </div>
        </div>
      )}

      {conversions && (
        <div className="bg-surface border border-border p-4 rounded-xl flex items-center justify-between">
          <span className="text-sm text-text-3 font-mono">
            dec:{conversions[10]} = bin:{conversions[2]} = oct:{conversions[8]} = hex:{conversions[16]}
          </span>
          <CopyButton text={summary} label="Copy All" />
        </div>
      )}
    </ToolShell>
  );
}
