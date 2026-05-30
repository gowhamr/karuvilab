"use client";
import { useState, useMemo, useCallback } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { CopyButton } from "@/components/ui/CopyButton";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { ToolInput } from "@/components/ui/ToolInput";
import { MetricCard } from "@/components/ui/MetricCard";
import { Binary, Hash, TextCursorInput, ListIcon, BinaryIcon, TypeIcon } from "lucide-react";

type Mode = "single" | "text";

const BASES = [
  { id: "bin", base: 2, label: "Binary", prefix: "0b", placeholder: "e.g. 101010", icon: Binary },
  { id: "oct", base: 8, label: "Octal", prefix: "0o", placeholder: "e.g. 52", icon: ListIcon },
  { id: "dec", base: 10, label: "Decimal", prefix: "", placeholder: "e.g. 42", icon: Hash },
  { id: "hex", base: 16, label: "Hex", prefix: "0x", placeholder: "e.g. 2A", icon: BinaryIcon },
];

export default function NumeralConverterClient() {
  const [mode, setMode] = useState<Mode>("single");
  const [inputs, setInputs] = useState<Record<string, string>>({
    bin: "", oct: "", dec: "42", hex: "", text: "B",
  });

  // --- Single Value Logic ---
  const handleSingleChange = useCallback((id: string, value: string) => {
    const baseObj = BASES.find(b => b.id === id);
    if (!baseObj && id !== "text") return;

    setInputs(prev => {
      const next = { ...prev, [id]: value };
      
      try {
        let bigValue: bigint;
        if (id === "text") {
          if (value.length === 0) {
            return { bin: "", oct: "", dec: "", hex: "", text: "" };
          }
          bigValue = BigInt(value.charCodeAt(0));
        } else {
          const cleanValue = value.replace(/^0[box]/i, "");
          if (cleanValue === "" || cleanValue === "-") {
            return { bin: "", oct: "", dec: "", hex: "", text: "", [id]: value };
          }
          bigValue = BigInt(`0${baseObj!.prefix}${cleanValue}`);
        }

        // Update all other fields
        BASES.forEach(b => {
          if (b.id !== id) {
            next[b.id] = bigValue.toString(b.base).toUpperCase();
          }
        });
        if (id !== "text") {
          next.text = bigValue < 1114112n ? String.fromCodePoint(Number(bigValue)) : "";
        }
      } catch (e) {
        // Invalid input for this base, just update the field itself
      }
      return next;
    });
  }, []);

  // --- Text/Stream Logic ---
  const handleTextChange = useCallback((id: string, value: string) => {
    setInputs(prev => {
      const next = { ...prev, [id]: value };
      
      try {
        let bytes: Uint8Array;

        if (id === "text") {
          bytes = new TextEncoder().encode(value);
        } else if (id === "bin") {
          const parts = value.trim().split(/\s+/).filter(p => p.length > 0);
          bytes = new Uint8Array(parts.map(p => parseInt(p, 2)));
        } else if (id === "hex") {
          // Support both space-separated and continuous hex
          let cleanHex = value.replace(/\s+/g, "");
          if (cleanHex.length % 2 !== 0) cleanHex = "0" + cleanHex;
          const parts = value.includes(" ") 
            ? value.trim().split(/\s+/).filter(p => p.length > 0)
            : cleanHex.match(/.{1,2}/g) || [];
          bytes = new Uint8Array(parts.map(p => parseInt(p, 16)));
        } else if (id === "dec") {
          const parts = value.trim().split(/\s+/).filter(p => p.length > 0);
          bytes = new Uint8Array(parts.map(p => parseInt(p, 10)));
        } else if (id === "oct") {
          const parts = value.trim().split(/\s+/).filter(p => p.length > 0);
          bytes = new Uint8Array(parts.map(p => parseInt(p, 8)));
        } else {
          return next;
        }

        if (id !== "text") next.text = new TextDecoder().decode(bytes);
        if (id !== "bin") next.bin = Array.from(bytes).map(b => b.toString(2).padStart(8, "0")).join(" ");
        if (id !== "hex") next.hex = Array.from(bytes).map(b => b.toString(16).padStart(2, "0").toUpperCase()).join(" ");
        if (id !== "dec") next.dec = Array.from(bytes).map(b => b.toString(10)).join(" ");
        if (id !== "oct") next.oct = Array.from(bytes).map(b => b.toString(8).padStart(3, "0")).join(" ");

      } catch (e) {
        // Parsing error
      }
      return next;
    });
  }, []);

  const clearAll = () => {
    setInputs({ bin: "", oct: "", dec: "", hex: "", text: "" });
  };

  return (
    <ToolShell
      title="Numeral Converter"
      description="Advanced base converter for Binary, Hex, Decimal, Octal, and ASCII Text."
    >
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <SegmentedControl
            options={[
              { label: "Single Number", id: "single" },
              { label: "Text / Bytes", id: "text" },
            ]}
            activeId={mode}
            onChange={(v) => {
              setMode(v as Mode);
              clearAll();
            }}
          />
          <button
            onClick={clearAll}
            className="text-xs font-bold text-text-4 hover:text-red-400 transition-colors uppercase tracking-widest px-4 py-2 bg-surface border border-border rounded-lg"
          >
            Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Main Inputs */}
          <div className="bg-surface border border-border p-6 rounded-[32px] shadow-sm space-y-6">
            {/* ASCII Text Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="text-input" className="text-sm font-bold text-text-2 flex items-center gap-2">
                  <TypeIcon size={16} className="text-blue" />
                  ASCII / Text
                </label>
                {inputs.text && <CopyButton text={inputs.text || ""} label="Copy" />}
              </div>
              {mode === "single" ? (
                <ToolInput
                  id="text-input"
                  value={inputs.text || ""}
                  onChange={(v) => handleSingleChange("text", v.slice(-1))}
                  placeholder="e.g. A"
                  className="font-mono text-xl"
                />
              ) : (
                <textarea
                  id="text-input"
                  value={inputs.text || ""}
                  onChange={(e) => handleTextChange("text", e.target.value)}
                  placeholder="Enter text to convert..."
                  className="w-full min-h-[100px] px-4 py-3 bg-bg border border-border rounded-xl focus:ring-2 focus:ring-blue outline-none transition-all font-mono text-base resize-y"
                />
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border/50">
              {BASES.map((b) => (
                <div key={b.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor={`${b.id}-input`} className="text-sm font-bold text-text-2 flex items-center gap-2">
                      <b.icon size={16} className="text-text-4" />
                      {b.label}
                    </label>
                    {inputs[b.id] && <CopyButton text={inputs[b.id] || ""} label="Copy" />}
                  </div>
                  {mode === "single" ? (
                    <div className="flex gap-2 items-center">
                      {b.prefix && (
                        <span className="text-sm font-mono text-text-4 bg-bg border border-border px-3 py-3 rounded-xl min-w-[3.5rem] text-center">
                          {b.prefix}
                        </span>
                      )}
                      <ToolInput
                        id={`${b.id}-input`}
                        value={inputs[b.id] || ""}
                        onChange={(v) => handleSingleChange(b.id, v.toUpperCase())}
                        placeholder={b.placeholder}
                        className="font-mono text-lg flex-1"
                      />
                    </div>
                  ) : (
                    <textarea
                      id={`${b.id}-input`}
                      value={inputs[b.id] || ""}
                      onChange={(e) => handleTextChange(b.id, e.target.value.toUpperCase())}
                      placeholder={`Enter ${b.label.toLowerCase()} bytes (space separated)...`}
                      className="w-full min-h-[80px] px-4 py-3 bg-bg border border-border rounded-xl focus:ring-2 focus:ring-blue outline-none transition-all font-mono text-sm resize-y"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Metrics / Info */}
          {mode === "single" && inputs.dec && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <MetricCard
                label="Total Bits"
                value={BigInt(inputs.dec || "0").toString(2).length.toString()}
                icon={Binary}
              />
              <MetricCard
                label="Total Bytes"
                value={Math.ceil(BigInt(inputs.dec || "0").toString(2).length / 8).toString()}
                icon={ListIcon}
              />
              <MetricCard
                label="Sign"
                value={BigInt(inputs.dec || "0") >= 0n ? "Positive" : "Negative"}
                icon={Hash}
              />
            </div>
          )}

          {mode === "text" && inputs.text && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <MetricCard
                label="Character Count"
                value={(inputs.text?.length || 0).toString()}
                icon={TextCursorInput}
              />
              <MetricCard
                label="Byte Size"
                value={new TextEncoder().encode(inputs.text || "").length.toString()}
                icon={ListIcon}
              />
              <MetricCard
                label="Words"
                value={inputs.text?.trim() ? inputs.text.trim().split(/\s+/).length.toString() : "0"}
                icon={Hash}
              />
            </div>
          )}
        </div>

        {/* Binary Table / Bit View for Single Mode (Small Numbers) */}
        {mode === "single" && inputs.dec && BigInt(inputs.dec || "0") >= 0n && BigInt(inputs.dec || "0") < 256n && (
          <div className="bg-surface border border-border p-6 rounded-[32px] space-y-4">
            <h2 className="text-sm font-bold text-text-2 uppercase tracking-widest">8-Bit Visualizer</h2>
            <div className="flex gap-2 flex-wrap justify-center sm:justify-start">
              {BigInt(inputs.dec || "0").toString(2).padStart(8, "0").split("").map((bit, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-mono text-xl font-black border-2 transition-all ${
                      bit === "1"
                        ? "bg-blue text-white border-blue shadow-lg shadow-blue/20 scale-105"
                        : "bg-bg border-border text-text-4"
                    }`}
                  >
                    {bit}
                  </div>
                  <span className="text-[10px] font-bold text-text-4">2^{7-i}</span>
                  <span className="text-[10px] font-medium text-text-4/60">({Math.pow(2, 7-i)})</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
