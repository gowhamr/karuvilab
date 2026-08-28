"use client";

import { useState, useMemo } from "react";
import { CopyButton } from "@/components/ui/CopyButton";
import { CheckCircle2, XCircle, Landmark, ShieldCheck } from "lucide-react";
import { ToolWorkspace } from "@/components/ui/ToolWorkspace";
import { ToolInput } from "@/components/ui/ToolInput";

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
  const [activeTab, setActiveTab] = useState<"iban" | "bic">("iban");
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
    <ToolWorkspace
      layout="stacked"
      tabs={{
        options: [
          { id: "iban", label: "IBAN", icon: <Landmark className="w-4 h-4" /> },
          { id: "bic", label: "SWIFT / BIC", icon: <ShieldCheck className="w-4 h-4" /> }
        ],
        activeId: activeTab,
        onChange: setActiveTab,
      }}
      input={
        activeTab === "iban" ? (
          <div className="space-y-4">
            <ToolInput
              label="Enter IBAN (International Bank Account Number)"
              value={ibanInput}
              onChange={setIbanInput}
              placeholder="e.g. DE89 3704 0044 0532 0130 00"
              mono
            />

            {cleanIban.length > 0 && (
              <div className={`p-4 rounded-xl border flex items-center justify-between gap-4 ${
                isIbanValid ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300' : 'bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400'
              }`}>
                <div className="flex items-center gap-3">
                  {isIbanValid ? <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" /> : <XCircle className="w-6 h-6 text-red-600 dark:text-red-400 shrink-0" />}
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
        ) : (
          <div className="space-y-4">
            <ToolInput
              label="Enter SWIFT / BIC Code (ISO 9362)"
              value={bicInput}
              onChange={setBicInput}
              placeholder="e.g. DBEKDE33XXX"
              mono
            />

            {cleanBic.length > 0 && (
              <div className={`p-4 rounded-xl border flex items-center justify-between gap-4 ${
                isBicValid ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300' : 'bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400'
              }`}>
                <div className="flex items-center gap-3">
                  {isBicValid ? <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" /> : <XCircle className="w-6 h-6 text-red-600 dark:text-red-400 shrink-0" />}
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
        )
      }
    />
  );
}
