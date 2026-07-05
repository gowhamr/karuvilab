"use client";

import { useState, useCallback } from "react";
import { ISO8583_FIELD_NAMES } from "../iso8583-bitmap-decoder/ISO8583BitmapClient";
import { CopyButton } from "@/components/ui/CopyButton";
import { FileText, CheckCircle2, AlertCircle, Eye } from "lucide-react";

export const MTI_DESCRIPTIONS: Record<string, string> = {
  "0100": "Authorization Request",
  "0110": "Authorization Response",
  "0200": "Financial Transaction Request",
  "0210": "Financial Transaction Response",
  "0400": "Reversal Request",
  "0410": "Reversal Response",
  "0800": "Network Management Request (Echo/Signon)",
  "0810": "Network Management Response",
};

export interface ParsedISOField {
  field: number;
  name: string;
  value: string;
}

export default function ISO8583ParserClient() {
  const [msgInput, setMsgInput] = useState("0200722464010880000016411111111111111111000000000010000007051200001234561200002606");
  const [mti, setMti] = useState("");
  const [mtiDesc, setMtiDesc] = useState("");
  const [bitmapHex, setBitmapHex] = useState("");
  const [fields, setFields] = useState<ParsedISOField[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleParse = useCallback(() => {
    setError(null);
    setFields([]);
    setMti("");
    setMtiDesc("");
    setBitmapHex("");

    const cleaned = msgInput.replace(/\s/g, "");
    if (cleaned.length < 20) {
      setError("Input string too short for valid ISO 8583 MTI + Bitmap");
      return;
    }

    try {
      // MTI: First 4 characters
      const parsedMti = cleaned.substring(0, 4);
      setMti(parsedMti);
      setMtiDesc(MTI_DESCRIPTIONS[parsedMti] || "Custom / Unknown MTI");

      // Bitmap: Next 16 chars (or 32 if secondary)
      let bmapHex = cleaned.substring(4, 20);
      const firstByte = parseInt(bmapHex.substring(0, 2), 16);
      if (firstByte & 0x80) { // Field 1 bit set -> 32 hex chars bitmap
        bmapHex = cleaned.substring(4, 36);
      }
      setBitmapHex(bmapHex);

      // Remaining payload parse simulation
      const payload = cleaned.substring(4 + bmapHex.length);
      const parsedFields: ParsedISOField[] = [];

      // Extract present field numbers from bitmap
      const bytes: number[] = [];
      for (let i = 0; i < bmapHex.length; i += 2) {
        bytes.push(parseInt(bmapHex.substring(i, i + 2), 16));
      }

      let offset = 0;
      bytes.forEach((b, byteIdx) => {
        for (let bit = 7; bit >= 0; bit--) {
          if (b & (1 << bit)) {
            const fieldNum = byteIdx * 8 + (8 - bit);
            if (fieldNum === 1) return; // Bitmap itself

            let val = "RAW_DATA";
            if (offset < payload.length) {
              val = payload.substring(offset, Math.min(offset + 12, payload.length));
              offset += 12;
            }

            parsedFields.push({
              field: fieldNum,
              name: ISO8583_FIELD_NAMES[fieldNum] || `Field ${fieldNum}`,
              value: val,
            });
          }
        }
      });

      setFields(parsedFields);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse ISO 8583 message payload");
    }
  }, [msgInput]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Input */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-text">Paste ISO 8583 Message Payload (MTI + Bitmap + Data):</label>
        <textarea
          id="iso-parser-input"
          rows={5}
          value={msgInput}
          onChange={(e) => setMsgInput(e.target.value)}
          className="w-full p-4 rounded-xl bg-surface border border-border font-mono text-xs focus:outline-none"
        />
      </div>

      <button
        id="iso-parser-submit-btn"
        onClick={handleParse}
        className="w-full py-3 rounded-xl bg-primary text-white font-bold text-base flex items-center justify-center gap-2 hover:opacity-90 transition"
      >
        <Eye className="w-5 h-5" />
        Parse ISO 8583 Message
      </button>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {mti && (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="p-5 rounded-xl bg-surface-2 border border-border space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-bold text-base text-sky-400 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ISO 8583 Message Header
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <span className="text-text-muted block font-sans text-xs">MTI Code:</span>
                <span className="text-emerald-300 font-bold text-sm">{mti}</span>
                <span className="text-text-muted block font-sans text-xs mt-0.5">{mtiDesc}</span>
              </div>

              <div>
                <span className="text-text-muted block font-sans text-xs">Primary/Secondary Bitmap (Hex):</span>
                <span className="text-sky-300 font-bold break-all">{bitmapHex}</span>
              </div>
            </div>
          </div>

          {/* Parsed Data Elements */}
          {fields.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-text">Parsed Data Elements ({fields.length} Present)</h4>
                <CopyButton text={JSON.stringify(fields, null, 2)} />
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {fields.map((f) => (
                  <div key={f.field} className="p-3 rounded-lg bg-surface border border-border flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded bg-primary/20 text-primary font-bold flex items-center justify-center">
                        {f.field}
                      </span>
                      <span className="font-sans font-semibold text-text">{f.name}</span>
                    </div>
                    <span className="text-emerald-300 font-bold break-all">{f.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
