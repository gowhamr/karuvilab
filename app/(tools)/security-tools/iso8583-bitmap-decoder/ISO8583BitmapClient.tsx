"use client";

import { useState, useCallback, useMemo } from "react";
import { Binary, Search, Grid } from "lucide-react";
import { ISO8583_FIELD_NAMES, ISO8583_DEFS } from "@/src/lib/iso8583/parser";
import { ToolWorkspace } from "@/components/ui/ToolWorkspace";
import { ToolInput } from "@/components/ui/ToolInput";
import { ToolResultArea } from "@/components/ui/ToolResultArea";

export const PRESET_BITMAPS = [
  {
    label: "Financial Purchase (7224640108800000)",
    hex: "7224640108800000"
  },
  {
    label: "Financial Response (7224640108800000)",
    hex: "7224640108800000"
  },
  {
    label: "Network Sign-On (8220000000000000)",
    hex: "8220000000000000"
  }
];

export default function ISO8583BitmapClient() {
  const [hexInput, setHexInput] = useState("7224640108800000");
  const [selectedFields, setSelectedFields] = useState<Set<number>>(new Set([2, 3, 4, 7, 11, 12, 14, 22, 37, 39, 41]));
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMode, setFilterMode] = useState<"all" | "selected" | "primary" | "secondary">("all");
  const [formatSpace, setFormatSpace] = useState(false);

  const decodeHex = useCallback((hex: string) => {
    const cleaned = hex.replace(/[^0-9a-fA-F]/g, "").toUpperCase();
    const bytes: number[] = [];
    for (let i = 0; i < cleaned.length; i += 2) {
      bytes.push(parseInt(cleaned.substring(i, i + 2), 16));
    }

    const present = new Set<number>();
    bytes.forEach((b, byteIdx) => {
      for (let bit = 7; bit >= 0; bit--) {
        if (b & (1 << bit)) {
          const fieldNum = byteIdx * 8 + (8 - bit);
          present.add(fieldNum);
        }
      }
    });
    return { present, cleaned };
  }, []);

  const handleDecodeInput = useCallback(() => {
    const { present } = decodeHex(hexInput);
    setSelectedFields(present);
  }, [hexInput, decodeHex]);

  const toggleField = (fieldNum: number) => {
    const updated = new Set(selectedFields);
    if (updated.has(fieldNum)) {
      updated.delete(fieldNum);
    } else {
      updated.add(fieldNum);
    }

    // Auto-manage Field 1 if any field > 64 is checked
    const hasSecondary = Array.from(updated).some(f => f > 64);
    if (hasSecondary) updated.add(1);
    else updated.delete(1);

    setSelectedFields(updated);
  };

  const generatedHex = useMemo(() => {
    const maxField = Array.from(selectedFields).some(f => f > 64) ? 128 : 64;
    const numBytes = maxField / 8;
    const bytes = new Uint8Array(numBytes);

    selectedFields.forEach(fieldNum => {
      if (fieldNum >= 1 && fieldNum <= maxField) {
        const byteIdx = Math.floor((fieldNum - 1) / 8);
        const bitPos = 7 - ((fieldNum - 1) % 8);
        bytes[byteIdx]! |= (1 << bitPos);
      }
    });

    const hexArr = Array.from(bytes).map(b => b.toString(16).padStart(2, "0").toUpperCase());
    return formatSpace ? hexArr.join(" ") : hexArr.join("");
  }, [selectedFields, formatSpace]);

  // Binary Bit Matrix representation (16 bytes = 128 bits)
  const bitMatrix = useMemo(() => {
    const maxField = Array.from(selectedFields).some(f => f > 64) ? 128 : 64;
    const rows = [];
    for (let byteIdx = 0; byteIdx < maxField / 8; byteIdx++) {
      const bits = [];
      for (let bitIdx = 0; bitIdx < 8; bitIdx++) {
        const fieldNum = byteIdx * 8 + bitIdx + 1;
        bits.push({
          fieldNum,
          active: selectedFields.has(fieldNum)
        });
      }
      rows.push({ byteIdx: byteIdx + 1, bits });
    }
    return rows;
  }, [selectedFields]);

  const filteredFieldsList = useMemo(() => {
    let list = Array.from({ length: 128 }, (_, i) => i + 1);
    
    if (filterMode === "selected") {
      list = list.filter(f => selectedFields.has(f));
    } else if (filterMode === "primary") {
      list = list.filter(f => f <= 64);
    } else if (filterMode === "secondary") {
      list = list.filter(f => f > 64);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(f => {
        const name = ISO8583_FIELD_NAMES[f] || `Field ${f}`;
        return f.toString().includes(q) || name.toLowerCase().includes(q);
      });
    }

    return list;
  }, [selectedFields, filterMode, searchQuery]);

  return (
    <ToolWorkspace
      layout="split"
      input={
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm font-bold text-text-2 flex items-center gap-2">
              <Binary className="w-4 h-4 text-sky-400" />
              Hex Bitmap Input
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-text-muted">Presets:</span>
              <select
                aria-label="Select Preset Bitmap"
                onChange={(e) => {
                  const val = e.target.value;
                  if (val) {
                    setHexInput(val);
                    const { present } = decodeHex(val);
                    setSelectedFields(present);
                  }
                }}
                className="px-3 py-1.5 rounded-lg bg-surface-2 border border-border text-xs font-medium text-text focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Choose Preset...</option>
                {PRESET_BITMAPS.map((p, idx) => (
                  <option key={idx} value={p.hex}>{p.label}</option>
                ))}
              </select>
            </div>
          </div>
  
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <ToolInput
                id="iso-bitmap-hex-input"
                value={hexInput}
                onChange={setHexInput}
                placeholder="e.g. 7224640108800000"
                mono
                description="16 Chars = 64-bit Primary, 32 Chars = 128-bit Secondary"
              />
            </div>
            <button
              id="iso-bitmap-decode-btn"
              onClick={handleDecodeInput}
              className="px-5 py-3 rounded-xl bg-primary text-white font-bold text-sm hover:opacity-90 transition shadow-sm h-12 mb-0.5"
            >
              Decode
            </button>
          </div>
        </div>
      }
      optionsPanel={
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-text-2">Options</h3>
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-text-2 font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={formatSpace}
                onChange={e => setFormatSpace(e.target.checked)}
                className="rounded border-border"
              />
              Space Bytes
            </label>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/20">
              {selectedFields.size} Fields Active
            </span>
          </div>
        </div>
      }
      output={
        <ToolResultArea
          label={`Generated Hex (${selectedFields.has(1) ? "128-bit" : "64-bit"})`}
          value={generatedHex}
          onClear={() => setSelectedFields(new Set())}
        />
      }
      infoPanel={
        <div className="space-y-6">
          {/* Binary Bit Grid Visualizer */}
          <div className="p-5 rounded-4xl bg-surface border border-border space-y-3 shadow-sm">
            <h4 className="font-bold text-sm text-text-2 flex items-center gap-2">
              <Grid className="w-4 h-4 text-primary" />
              Binary Bit Grid (Byte 1 .. {bitMatrix.length}):
            </h4>
    
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
              {bitMatrix.map(row => (
                <div key={row.byteIdx} className="p-2.5 rounded-xl bg-surface-2 border border-border space-y-1.5">
                  <span className="text-[10px] font-mono text-text-muted font-bold block text-center">Byte {row.byteIdx}</span>
                  <div className="grid grid-cols-4 gap-1">
                    {row.bits.map(b => (
                      <button
                        key={b.fieldNum}
                        type="button"
                        onClick={() => toggleField(b.fieldNum)}
                        title={`Field ${b.fieldNum}: ${ISO8583_FIELD_NAMES[b.fieldNum] || 'Reserved'}`}
                        className={`h-6 rounded text-[10px] font-mono font-bold flex items-center justify-center transition ${
                          b.active
                            ? "bg-emerald-500 text-black shadow-xs"
                            : "bg-surface text-text-muted hover:bg-surface/80"
                        }`}
                      >
                        {b.fieldNum}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
    
          {/* Data Elements Matrix */}
          <div className="p-5 rounded-4xl bg-surface border border-border space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <h3 className="font-bold text-base text-text-2">ISO 8583 Data Elements Matrix (Fields 1–128)</h3>
                <div className="flex gap-1 bg-surface-2 p-1 rounded-xl border border-border">
                  <button
                    type="button"
                    onClick={() => setFilterMode("all")}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${filterMode === "all" ? "bg-primary text-white" : "text-text-muted hover:text-text"}`}
                  >
                    All
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterMode("selected")}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${filterMode === "selected" ? "bg-primary text-white" : "text-text-muted hover:text-text"}`}
                  >
                    Selected ({selectedFields.size})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterMode("primary")}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${filterMode === "primary" ? "bg-primary text-white" : "text-text-muted hover:text-text"}`}
                  >
                    1–64
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterMode("secondary")}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${filterMode === "secondary" ? "bg-primary text-white" : "text-text-muted hover:text-text"}`}
                  >
                    65–128
                  </button>
                </div>
              </div>
    
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-text-muted absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search data elements..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 rounded-xl bg-surface border border-border text-xs focus:outline-none focus:ring-2 focus:ring-primary w-48 text-text"
                  />
                </div>
                
                <button
                  type="button"
                  onClick={() => setSelectedFields(new Set())}
                  className="px-3 py-1.5 rounded-xl border border-border bg-surface text-text-muted hover:text-text text-xs font-bold transition"
                >
                  Clear All
                </button>
              </div>
            </div>
    
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-[500px] overflow-y-auto pr-1">
              {filteredFieldsList.map((fieldNum) => {
                const isPresent = selectedFields.has(fieldNum);
                const name = ISO8583_FIELD_NAMES[fieldNum] || `Field ${fieldNum}`;
                const def = ISO8583_DEFS[fieldNum];
    
                return (
                  <div
                    key={fieldNum}
                    id={`iso-field-${fieldNum}`}
                    onClick={() => toggleField(fieldNum)}
                    className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition ${
                      isPresent
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 shadow-xs'
                        : 'bg-surface-2 border-border text-text-muted hover:border-text-muted'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate pr-2">
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                        isPresent ? 'bg-emerald-500 text-black' : 'bg-surface text-text-muted border border-border'
                      }`}>
                        {fieldNum}
                      </span>
                      <div className="truncate space-y-0.5">
                        <span className="text-xs font-bold truncate block text-text">{name}</span>
                        {def && (
                          <span className="text-[10px] font-mono text-text-muted block">
                            {def.type} {def.length}
                          </span>
                        )}
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={isPresent}
                      readOnly
                      className="rounded border-border shrink-0"
                    />
                  </div>
                );
              })}
    
              {filteredFieldsList.length === 0 && (
                <div className="col-span-full p-8 text-center text-text-muted text-sm border border-dashed border-border rounded-xl">
                  No fields match your search filter
                </div>
              )}
            </div>
          </div>
        </div>
      }
    />
  );
}
