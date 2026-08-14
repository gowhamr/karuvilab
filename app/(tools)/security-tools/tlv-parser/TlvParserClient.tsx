"use client";

import { useState, useCallback } from "react";
import { Layers } from "lucide-react";
import { ToolWorkspace } from "@/components/ui/ToolWorkspace";
import { ToolInput } from "@/components/ui/ToolInput";
import { ToolResultArea } from "@/components/ui/ToolResultArea";

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
    <ToolWorkspace
      input={
        <div className="space-y-4">
          <ToolInput
            id="tlv-hex-input"
            label="EMV BER-TLV Hex Payload"
            value={hexInput}
            onChange={setHexInput}
            placeholder="e.g. 9F02060000000010009F0306000000000000..."
            rows={4}
            mono
            className="uppercase"
          />
          <button
            id="tlv-parse-btn"
            onClick={handleParse}
            className="w-full py-3 rounded-xl bg-emerald-600 text-white font-bold text-base flex items-center justify-center gap-2 hover:opacity-90 transition"
          >
            <Layers className="w-5 h-5" />
            Parse TLV Data Stream
          </button>
        </div>
      }
      output={
        <ToolResultArea
          label={elements.length > 0 ? `Parsed TLV Elements (${elements.length} Tags)` : "Parsed TLV Elements"}
          value={elements.length > 0 ? JSON.stringify(elements, null, 2) : ""}
          error={error || undefined}
          language="json"
        />
      }
    />
  );
}
