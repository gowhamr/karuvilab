"use client";

import { useState, useCallback } from "react";
import { CopyButton } from "@/components/ui/CopyButton";
import { Layers, AlertCircle, Cpu } from "lucide-react";

export const EMV_TAG_DICTIONARY: Record<string, string> = {
  "9F02": "Amount, Authorised (Numeric)",
  "9F03": "Amount, Other (Numeric)",
  "9F1A": "Terminal Country Code",
  "9F26": "Application Cryptogram (AC)",
  "9F27": "Cryptogram Information Data (CID)",
  "9F36": "Application Transaction Counter (ATC)",
  "9F37": "Unpredictable Number",
  "9A": "Transaction Date (YYMMDD)",
  "9C": "Transaction Type",
  "5F2A": "Transaction Currency Code",
  "57": "Track 2 Equivalent Data",
  "5A": "Application Primary Account Number (PAN)",
  "82": "Application Interchange Profile (AIP)",
  "84": "Dedicated File (DF) Name / AID",
  "9F10": "Issuer Application Data (IAD)",
  "9F33": "Terminal Capabilities",
  "9F34": "CVM Results",
  "9F35": "Terminal Type",
  "9F40": "Additional Terminal Capabilities",
  "6F": "FCI Template",
  "A5": "FCI Proprietary Template",
};

import { parseBERTLV } from "@/src/lib/emv/tlv";

export default function TlvParserClient() {
  const [hexInput, setHexInput] = useState("9F02060000000010009F03060000000000009F1A0208409F2608123456789ABCDEF09F36020015");
  const [elements, setElements] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleParse = useCallback(() => {
    setError(null);
    setElements([]);

    const cleanHex = hexInput.replace(/[^0-9a-fA-F]/g, "").toUpperCase();
    if (!cleanHex) {
      setError("Please enter a valid BER-TLV hex payload");
      return;
    }

    try {
      const result = parseBERTLV(cleanHex);
      setElements(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse TLV data stream");
    }
  }, [hexInput]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Input */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-text flex items-center gap-2">
          <Cpu className="w-4 h-4 text-emerald-400" />
          EMV BER-TLV Hex Payload:
        </label>
        <textarea
          id="tlv-hex-input"
          rows={4}
          value={hexInput}
          onChange={(e) => setHexInput(e.target.value)}
          placeholder="e.g. 9F02060000000010009F0306000000000000..."
          className="w-full p-4 rounded-xl bg-surface border border-border font-mono text-xs uppercase focus:outline-none"
        />
      </div>

      <button
        id="tlv-parse-btn"
        onClick={handleParse}
        className="w-full py-3 rounded-xl bg-emerald-600 text-white font-bold text-base flex items-center justify-center gap-2 hover:opacity-90 transition"
      >
        <Layers className="w-5 h-5" />
        Parse TLV Data Stream
      </button>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {elements.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-text">Parsed TLV Elements ({elements.length} Tags)</h3>
            <CopyButton text={JSON.stringify(elements, null, 2)} />
          </div>

            <pre className="text-xs font-mono whitespace-pre-wrap overflow-x-auto">
              {JSON.stringify(elements, null, 2)}
            </pre>
        </div>
      )}
    </div>
  );
}
