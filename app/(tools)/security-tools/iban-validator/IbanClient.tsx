"use client";

import { useState, useMemo } from "react";
import { CopyButton } from "@/components/ui/CopyButton";
import { CheckCircle2, XCircle, Landmark, ShieldCheck } from "lucide-react";

const IBAN_LENGTHS: Record<string, number> = {
  AD: 24, AE: 23, AL: 28, AT: 20, AZ: 28,
  BA: 20, BE: 16, BG: 22, BH: 22, BR: 29, BY: 28,
  CH: 21, CR: 22, CY: 28, CZ: 24,
  DE: 22, DK: 18, DO: 28,
  EE: 20, ES: 24,
  FI: 18, FO: 18, FR: 27,
  GB: 22, GE: 22, GI: 23, GL: 18, GR: 27, GT: 28,
  HR: 21, HU: 28,
  IE: 22, IL: 23, IS: 26, IT: 27,
  JO: 30,
  KW: 30, KZ: 20,
  LB: 28, LI: 21, LT: 20, LU: 20, LV: 21,
  MC: 27, MD: 24, ME: 22, MK: 19, MR: 27, MT: 31, MU: 30,
  NL: 18, NO: 15,
  PK: 24, PL: 28, PS: 29, PT: 25,
  QA: 29,
  RO: 24, RS: 22,
  SA: 24, SC: 31, SE: 24, SI: 19, SK: 24, SM: 27, ST: 25, SV: 24,
  TL: 23, TN: 24, TR: 26,
  UA: 29,
  VG: 24, XK: 20
};

export interface IbanValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateIbanDetails(ibanStr: string): IbanValidationResult {
  const cleaned = ibanStr.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
  if (cleaned.length < 4) {
    return { isValid: false, error: "IBAN is too short (minimum 4 characters)." };
  }

  const country = cleaned.substring(0, 2);
  if (!/^[A-Z]{2}$/.test(country)) {
    return { isValid: false, error: "IBAN must start with a 2-letter country code." };
  }

  const expectedLength = IBAN_LENGTHS[country];
  if (expectedLength === undefined) {
    if (cleaned.length < 14 || cleaned.length > 34) {
      return { isValid: false, error: "Unsupported country format: length must be 14-34 characters." };
    }
  } else if (cleaned.length !== expectedLength) {
    return { isValid: false, error: `Invalid length for ${country}. Expected ${expectedLength} characters, got ${cleaned.length}.` };
  }

  // Rearrange: Move first 4 characters to end
  const rearranged = cleaned.substring(4) + cleaned.substring(0, 4);

  // Convert letters to numbers (A=10, B=11... Z=35)
  let numericStr = "";
  for (let i = 0; i < rearranged.length; i++) {
    const code = rearranged.charCodeAt(i);
    if (code >= 65 && code <= 90) {
      numericStr += (code - 55).toString();
    } else {
      numericStr += rearranged.charAt(i);
    }
  }

  // Modulo 97 calculation
  try {
    const valid = BigInt(numericStr) % BigInt(97) === BigInt(1);
    if (!valid) {
      return { isValid: false, error: "Modulo-97 checksum validation failed (invalid check digits)." };
    }
    return { isValid: true };
  } catch {
    return { isValid: false, error: "Failed to parse numeric representation." };
  }
}

export function validateIban(ibanStr: string): boolean {
  return validateIbanDetails(ibanStr).isValid;
}

export function validateBic(bicStr: string): boolean {
  const cleaned = bicStr.replace(/\s/g, "").toUpperCase();
  return /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(cleaned);
}

export default function IbanClient() {
  const [ibanInput, setIbanInput] = useState("DE89370400440532013000");
  const [bicInput, setBicInput] = useState("DBEKDE33XXX");

  const cleanIban = useMemo(() => ibanInput.replace(/[^A-Za-z0-9]/g, "").toUpperCase(), [ibanInput]);
  const validation = useMemo(() => validateIbanDetails(cleanIban), [cleanIban]);
  const isIbanValid = validation.isValid;

  const cleanBic = useMemo(() => bicInput.replace(/\s/g, "").toUpperCase(), [bicInput]);
  const isBicValid = useMemo(() => validateBic(cleanBic), [cleanBic]);

  const ibanDetails = useMemo(() => {
    if (cleanIban.length < 5) return null;
    return {
      countryCode: cleanIban.substring(0, 2),
      checksum: cleanIban.substring(2, 4),
      bban: cleanIban.substring(4),
    };
  }, [cleanIban]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* IBAN Section */}
      <div className="p-5 rounded-xl bg-surface-2 border border-border space-y-4">
        <label className="text-sm font-semibold text-text flex items-center gap-2">
          <Landmark className="w-4 h-4 text-emerald-400" />
          Enter IBAN (International Bank Account Number):
        </label>

        <input
          id="iban-input"
          type="text"
          value={ibanInput}
          onChange={(e) => setIbanInput(e.target.value)}
          placeholder="e.g. DE89 3704 0044 0532 0130 00"
          className="w-full px-4 py-3 rounded-xl bg-surface border border-border font-mono text-base uppercase focus:outline-none"
        />

        {cleanIban.length > 0 && (
          <div className={`p-4 rounded-xl border flex items-center justify-between gap-4 ${
            isIbanValid ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}>
            <div className="flex items-center gap-3">
              {isIbanValid ? <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" /> : <XCircle className="w-6 h-6 text-red-400 shrink-0" />}
              <div>
                <h4 className="font-bold text-sm font-sans">{isIbanValid ? 'VALID IBAN (ISO 13616 Mod-97 PASS)' : (validation.error || 'INVALID IBAN Checksum / Format')}</h4>
                {ibanDetails && (
                  <p className="text-xs font-mono opacity-80 mt-0.5">
                    Country: {ibanDetails.countryCode} | Checksum: {ibanDetails.checksum} | BBAN: {ibanDetails.bban}
                  </p>
                )}
              </div>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1 rounded bg-surface/50 border border-border">
              {cleanIban.length} Chars
            </span>
          </div>
        )}
      </div>

      {/* SWIFT / BIC Section */}
      <div className="p-5 rounded-xl bg-surface-2 border border-border space-y-4">
        <label className="text-sm font-semibold text-text flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-sky-400" />
          Enter SWIFT / BIC Code (ISO 9362):
        </label>

        <input
          id="bic-input"
          type="text"
          value={bicInput}
          onChange={(e) => setBicInput(e.target.value)}
          placeholder="e.g. DBEKDE33XXX"
          className="w-full px-4 py-3 rounded-xl bg-surface border border-border font-mono text-base uppercase focus:outline-none"
        />

        {cleanBic.length > 0 && (
          <div className={`p-4 rounded-xl border flex items-center justify-between gap-4 ${
            isBicValid ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}>
            <div className="flex items-center gap-3">
              {isBicValid ? <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" /> : <XCircle className="w-6 h-6 text-red-400 shrink-0" />}
              <div>
                <h4 className="font-bold text-sm font-sans">{isBicValid ? 'VALID SWIFT/BIC Code Format' : 'INVALID SWIFT/BIC Code'}</h4>
                {isBicValid && (
                  <p className="text-xs font-mono opacity-80 mt-0.5">
                    Bank: {cleanBic.substring(0, 4)} | Country: {cleanBic.substring(4, 6)} | Location: {cleanBic.substring(6, 8)} | Branch: {cleanBic.substring(8) || "XXX (Head Office)"}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
