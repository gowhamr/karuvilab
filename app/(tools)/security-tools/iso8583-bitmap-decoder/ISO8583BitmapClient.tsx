"use client";

import { useState, useCallback } from "react";
import { CopyButton } from "@/components/ui/CopyButton";
import { Binary, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";

export const ISO8583_FIELD_NAMES: Record<number, string> = {
  1: "Secondary Bitmap Indicator",
  2: "Primary Account Number (PAN)",
  3: "Processing Code",
  4: "Amount, Transaction",
  5: "Amount, Settlement",
  6: "Amount, Cardholder Billing",
  7: "Transmission Date & Time",
  11: "System Trace Audit Number (STAN)",
  12: "Local Transaction Time (hhmmss)",
  13: "Local Transaction Date (MMDD)",
  14: "Expiration Date (YYMM)",
  15: "Settlement Date",
  18: "Merchant Type / Category Code",
  22: "Point of Service (POS) Entry Mode",
  23: "Card Sequence Number",
  25: "POS Condition Code",
  28: "Amount, Transaction Fee",
  32: "Acquiring Institution ID Code",
  35: "Track 2 Data",
  37: "Retrieval Reference Number (RRN)",
  38: "Authorization ID Response",
  39: "Response Code",
  41: "Card Acceptor Terminal ID",
  42: "Card Acceptor ID Code",
  43: "Card Acceptor Name / Location",
  48: "Additional Data - Private",
  49: "Currency Code, Transaction",
  52: "Personal ID Number (PIN) Data",
  53: "Security Related Control Information",
  54: "Additional Amounts",
  55: "ICC Data - EMV Tags",
  60: "Private Use - Self-Defined",
  64: "Message Authentication Code (MAC)",
  70: "Network Management Information Code",
  90: "Original Data Elements",
  102: "Account Identification 1",
  103: "Account Identification 2",
  128: "Secondary MAC",
};

export default function ISO8583BitmapClient() {
  const [hexInput, setHexInput] = useState("7224640108800000");
  const [selectedFields, setSelectedFields] = useState<Set<number>>(new Set([2, 3, 4, 7, 11, 12, 14, 22, 37, 39, 41]));

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

  const generatedHex = useCallback(() => {
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

    return Array.from(bytes).map(b => b.toString(16).padStart(2, "0")).join("").toUpperCase();
  }, [selectedFields])();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Input Row */}
      <div className="p-4 rounded-xl bg-surface-2 border border-border space-y-3">
        <label className="text-sm font-semibold text-text flex items-center gap-2">
          <Binary className="w-4 h-4 text-sky-400" />
          Hex Bitmap Input (16 Chars = 64-bit Primary, 32 Chars = 128-bit Secondary):
        </label>

        <div className="flex gap-2">
          <input
            id="iso-bitmap-hex-input"
            type="text"
            placeholder="e.g. 7224640108800000"
            value={hexInput}
            onChange={(e) => setHexInput(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl bg-surface border border-border font-mono text-sm uppercase focus:outline-none"
          />
          <button
            id="iso-bitmap-decode-btn"
            onClick={handleDecodeInput}
            className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-sm hover:opacity-90 transition"
          >
            Decode Bitmap
          </button>
        </div>
      </div>

      {/* Generated Hex Output */}
      <div className="p-4 rounded-xl bg-surface border border-border space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-text">
            Generated Hex Bitmap ({selectedFields.has(1) ? "128-bit Primary + Secondary" : "64-bit Primary"}):
          </label>
          <CopyButton text={generatedHex} />
        </div>
        <p className="font-mono text-lg font-bold text-emerald-300 tracking-wider break-all">{generatedHex}</p>
      </div>

      {/* Field Grid Matrix */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-text">ISO 8583 Data Elements Matrix (Fields 1–128)</h3>
          <span className="text-xs font-mono text-sky-400">
            Selected: <strong>{selectedFields.size}</strong> fields active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-[500px] overflow-y-auto pr-1">
          {Array.from({ length: 128 }, (_, i) => i + 1).map((fieldNum) => {
            const isPresent = selectedFields.has(fieldNum);
            const name = ISO8583_FIELD_NAMES[fieldNum] || `Field ${fieldNum}`;

            return (
              <div
                key={fieldNum}
                id={`iso-field-${fieldNum}`}
                onClick={() => toggleField(fieldNum)}
                className={`p-2.5 rounded-lg border cursor-pointer flex items-center justify-between transition ${
                  isPresent
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-surface-2 border-border text-text-muted hover:border-text-muted'
                }`}
              >
                <div className="flex items-center gap-2 truncate pr-2">
                  <span className={`w-6 h-6 rounded flex items-center justify-center text-xs font-mono font-bold ${
                    isPresent ? 'bg-emerald-500 text-black' : 'bg-surface text-text-muted'
                  }`}>
                    {fieldNum}
                  </span>
                  <span className="text-xs font-medium truncate">{name}</span>
                </div>
                <input
                  type="checkbox"
                  checked={isPresent}
                  readOnly
                  className="rounded border-border"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
