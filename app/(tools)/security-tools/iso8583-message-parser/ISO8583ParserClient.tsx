"use client";

import { useState, useCallback } from "react";
import { Eye, AlertCircle, CheckCircle2 } from "lucide-react";
import { CopyButton } from "@/components/ui/CopyButton";
import { parseIso8583, ParsedISOField } from "@/src/lib/iso8583/parser";

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

    try {
      const parsed = parseIso8583(msgInput);
      setMti(parsed.mti);
      setMtiDesc(MTI_DESCRIPTIONS[parsed.mti] || "Custom / Unknown MTI");
      setBitmapHex(parsed.bitmapHex);
      setFields(parsed.fields);
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
