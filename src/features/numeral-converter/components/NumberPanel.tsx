"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Hash, Binary } from "lucide-react";
import { CopyButton } from "@/components/ui/CopyButton";
import { MetricCard } from "@/components/ui/MetricCard";
import { floatToIEEE754, ieee754ToFloat } from "../utils/conversion-helpers";

interface NumberPanelProps {
  initialDec?: string;
}

export function NumberPanel({ initialDec = "42" }: NumberPanelProps) {
  const [numberDec, setNumberDec] = useState(initialDec);
  const [numberBin, setNumberBin] = useState("101010");
  const [numberOct, setNumberOct] = useState("52");
  const [numberHex, setNumberHex] = useState("2A");
  const [numberText, setNumberText] = useState("*");
  const [numberBaseN, setNumberBaseN] = useState("1A");
  const [customBase, setCustomBase] = useState(12);
  
  const [floatValue, setFloatValue] = useState("3.14159");
  const [floatPrecision, setFloatPrecision] = useState<"single" | "double">("single");

  const handleNumberChange = useCallback((id: string, value: string) => {
    try {
      let decVal = BigInt(0);
      if (id === "dec") {
        if (!value) return;
        decVal = BigInt(value);
      } else if (id === "bin") {
        const clean = value.replace(/[^01]/g, "");
        if (!clean) return;
        decVal = BigInt("0b" + clean);
      } else if (id === "oct") {
        const clean = value.replace(/[^0-7]/g, "");
        if (!clean) return;
        decVal = BigInt("0o" + clean);
      } else if (id === "hex") {
        const clean = value.replace(/[^0-9a-fA-F]/g, "");
        if (!clean) return;
        decVal = BigInt("0x" + clean);
      } else if (id === "text") {
        if (!value) return;
        decVal = BigInt(value.codePointAt(0) || 0);
      }

      setNumberDec(decVal.toString(10));
      setNumberBin(decVal.toString(2));
      setNumberOct(decVal.toString(8));
      setNumberHex(decVal.toString(16).toUpperCase());
      setNumberText(decVal < 1114112n ? String.fromCodePoint(Number(decVal)) : "");
      setNumberBaseN(decVal.toString(customBase).toUpperCase());
    } catch {}
  }, [customBase]);

  useEffect(() => {
    try {
      if (numberDec) {
        setNumberBaseN(BigInt(numberDec).toString(customBase).toUpperCase());
      }
    } catch {}
  }, [customBase, numberDec]);

  const romanVal = useMemo(() => {
    try {
      const num = parseInt(numberDec, 10);
      if (isNaN(num) || num < 1 || num > 3999) return "N/A";
      const roman: Record<string, number> = {
        M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1
      };
      let str = "";
      let n = num;
      for (const i of Object.keys(roman)) {
        const val = roman[i]!;
        const q = Math.floor(n / val);
        n -= q * val;
        str += i.repeat(q);
      }
      return str;
    } catch { return "N/A"; }
  }, [numberDec]);

  const ieeeFloat = useMemo(() => {
    const parsed = parseFloat(floatValue);
    if (isNaN(parsed)) return null;
    return floatToIEEE754(parsed, floatPrecision === "double");
  }, [floatValue, floatPrecision]);

  const toggleFloatBit = (bitIndex: number) => {
    if (!ieeeFloat) return;
    const isDouble = floatPrecision === "double";
    const signBit = bitIndex === 0 ? (ieeeFloat.sign === 1 ? 0 : 1) : ieeeFloat.sign;
    let expBits = ieeeFloat.exponent;
    let mantBits = ieeeFloat.mantissa;
    if (bitIndex > 0 && bitIndex <= (isDouble ? 11 : 8)) {
      const arr = expBits.split("");
      arr[bitIndex - 1] = arr[bitIndex - 1] === "1" ? "0" : "1";
      expBits = arr.join("");
    } else if (bitIndex > (isDouble ? 11 : 8)) {
      const idx = bitIndex - 1 - (isDouble ? 11 : 8);
      const arr = mantBits.split("");
      arr[idx] = arr[idx] === "1" ? "0" : "1";
      mantBits = arr.join("");
    }
    const newVal = ieee754ToFloat({ sign: signBit, exponent: expBits, mantissa: mantBits }, isDouble);
    setFloatValue(newVal.toString());
  };

  return (
    <div className="space-y-8">
      <div className="bg-surface border border-border p-6 rounded-4xl space-y-6 shadow-sm">
        <h3 className="text-xs font-black text-text-3 uppercase tracking-widest border-b border-border/50 pb-2 flex items-center gap-1.5">
          <Hash size={14} className="text-blue" />
          Base-N Conversion
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {[
              { id: "dec", label: "Decimal (Base-10)", val: numberDec },
              { id: "bin", label: "Binary (Base-2)", val: numberBin },
              { id: "oct", label: "Octal (Base-8)", val: numberOct },
              { id: "hex", label: "Hexadecimal (Base-16)", val: numberHex },
              { id: "text", label: "ASCII Symbol", val: numberText }
            ].map((row) => (
              <div key={row.id} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor={`num-${row.id}`} className="text-xs font-bold text-text-2">{row.label}</label>
                  {row.val && <CopyButton text={row.val} label="Copy" />}
                </div>
                <input id={`num-${row.id}`} value={row.val} onChange={(e) => handleNumberChange(row.id, e.target.value)}
                  className="w-full bg-bg border border-border rounded-xl px-3 py-2 font-mono text-sm focus:ring-2 focus:ring-blue outline-none" />
              </div>
            ))}
          </div>
          <div className="space-y-6">
            <div className="flex flex-col gap-1.5 bg-bg/30 border border-border rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-text-3 uppercase tracking-wider">Custom Base</span>
                <span className="text-xs font-black text-blue">Base {customBase}</span>
              </div>
              <div className="flex items-center gap-3 mb-2">
                <input type="range" min="2" max="36" value={customBase} onChange={(e) => setCustomBase(parseInt(e.target.value))}
                  className="flex-1 h-2 bg-border rounded-lg appearance-none cursor-pointer accent-blue" />
                <input type="number" min="2" max="36" value={customBase} onChange={(e) => setCustomBase(Math.min(36, Math.max(2, parseInt(e.target.value) || 2)))}
                  className="w-14 bg-bg border border-border rounded-lg px-2 py-1 text-center font-mono text-xs font-bold" />
              </div>
              <input value={numberBaseN} onChange={(e) => {
                setNumberBaseN(e.target.value.toUpperCase());
                try {
                  const parsed = BigInt(parseInt(e.target.value, customBase));
                  setNumberDec(parsed.toString(10));
                  setNumberBin(parsed.toString(2));
                  setNumberOct(parsed.toString(8));
                  setNumberHex(parsed.toString(16).toUpperCase());
                  setNumberText(parsed < 1114112n ? String.fromCodePoint(Number(parsed)) : "");
                } catch {}
              }} className="w-full bg-bg border border-border rounded-xl px-3 py-2 font-mono text-sm focus:ring-2 focus:ring-blue outline-none mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <MetricCard label="Roman" value={romanVal} icon={Hash} />
              <MetricCard label="2's Complement" value={numberDec ? (() => {
                const val = parseInt(numberDec, 10);
                if (isNaN(val) || val < -128 || val > 127) return "N/A";
                return (val < 0 ? (256 + val) : val).toString(2).padStart(8, "0");
              })() : "—"} icon={Binary} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-surface border border-border p-6 rounded-4xl space-y-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between border-b border-border/50 pb-2 gap-4">
          <h3 className="text-xs font-black text-text-3 uppercase tracking-widest flex items-center gap-1.5">
            <Binary size={14} className="text-blue" /> IEEE 754 Floating Point
          </h3>
          <div className="flex items-center gap-2">
            {(["single", "double"] as const).map((prec) => (
              <button key={prec} onClick={() => setFloatPrecision(prec)}
                className={`px-3 py-1 text-xs font-black rounded-lg transition-all ${floatPrecision === prec ? "bg-blue text-white shadow-sm" : "bg-bg border border-border text-text-3 hover:text-text"}`}>
                {prec === "single" ? "Single (32-bit)" : "Double (64-bit)"}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <label htmlFor="float-input" className="text-xs font-bold text-text-2">Float Value:</label>
            <input id="float-input" type="text" value={floatValue} onChange={(e) => setFloatValue(e.target.value)}
              className="bg-bg border border-border rounded-xl px-3 py-2 font-mono text-sm focus:ring-2 focus:ring-blue outline-none w-44" />
          </div>
          {ieeeFloat && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4 text-xs font-bold">
                <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded bg-red-400"></span> Sign</span>
                <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded bg-amber-400"></span> Exponent</span>
                <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded bg-blue-400"></span> Mantissa</span>
              </div>
              <div className="flex flex-wrap gap-1 bg-bg/50 border border-border p-4 rounded-2xl justify-center sm:justify-start">
                <div className="flex flex-col items-center gap-1">
                  <button onClick={() => toggleFloatBit(0)} className="w-8 h-8 rounded-lg bg-red-400 text-white flex items-center justify-center font-mono font-black text-sm hover:scale-105 transition-all shadow-sm">{ieeeFloat.sign}</button>
                  <span className="text-micro font-bold text-text-4">S</span>
                </div>
                {ieeeFloat.exponent.split("").map((bit, idx) => (
                  <div key={`exp-${idx}`} className="flex flex-col items-center gap-1">
                    <button onClick={() => toggleFloatBit(idx+1)} className="w-8 h-8 rounded-lg bg-amber-400 text-white flex items-center justify-center font-mono font-black text-sm hover:scale-105 transition-all shadow-sm">{bit}</button>
                    <span className="text-micro font-bold text-text-4">E{idx}</span>
                  </div>
                ))}
                {ieeeFloat.mantissa.split("").map((bit, idx) => {
                  const bitIdx = idx + 1 + ieeeFloat.exponent.length;
                  if (floatPrecision === "double" && idx > 20 && idx < 48) {
                    if (idx === 21) return <div key="dots" className="flex items-center justify-center w-8 h-8 text-text-4 font-black">...</div>;
                    return null;
                  }
                  return (
                    <div key={`mant-${idx}`} className="flex flex-col items-center gap-1">
                      <button onClick={() => toggleFloatBit(bitIdx)} className="w-8 h-8 rounded-lg bg-blue-400 text-white flex items-center justify-center font-mono font-black text-sm hover:scale-105 transition-all shadow-sm">{bit}</button>
                      <span className="text-micro font-bold text-text-4">M{idx}</span>
                    </div>
                  );
                })}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 font-mono text-xs">
                <div className="bg-bg/40 border border-border p-3 rounded-xl"><span className="font-bold text-text-3">Sign:</span> {ieeeFloat.sign === 1 ? "-" : "+"}</div>
                <div className="bg-bg/40 border border-border p-3 rounded-xl"><span className="font-bold text-text-3">Exponent:</span> {ieeeFloat.exponentVal}</div>
                <div className="bg-bg/40 border border-border p-3 rounded-xl"><span className="font-bold text-text-3">Mantissa:</span> {ieeeFloat.mantissaVal.toFixed(6)}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
