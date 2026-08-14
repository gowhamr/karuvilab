"use client";

import { useState, useCallback, useMemo } from "react";
import { CheckCircle2, XCircle, CreditCard, ShieldCheck } from "lucide-react";
import { ToolWorkspace } from "@/components/ui/ToolWorkspace";
import { ToolInput } from "@/components/ui/ToolInput";
import { ToolResultArea } from "@/components/ui/ToolResultArea";

export function luhnCheck(numStr: string): boolean {
  const digits = numStr.replace(/\D/g, "");
  if (!digits) return false;

  let sum = 0;
  let isEven = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits.charAt(i), 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

export function luhnCalculateCheckDigit(numStr: string): number {
  const digits = numStr.replace(/\D/g, "");
  let sum = 0;
  let isEven = true; // start as true because appended check digit will flip positions

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits.charAt(i), 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    isEven = !isEven;
  }

  return (10 - (sum % 10)) % 10;
}

export default function LuhnClient() {
  const [inputVal, setInputVal] = useState("4532015112830366");

  const digitsOnly = useMemo(() => inputVal.replace(/\D/g, ""), [inputVal]);
  const isValid = useMemo(() => luhnCheck(digitsOnly), [digitsOnly]);
  const checkDigit = useMemo(() => digitsOnly.length > 0 ? luhnCalculateCheckDigit(digitsOnly) : 0, [digitsOnly]);
  const generatedCompleteNumber = useMemo(() => digitsOnly + String(checkDigit), [digitsOnly, checkDigit]);

  // Card issuer detection heuristic
  const cardIssuer = useMemo(() => {
    if (digitsOnly.startsWith("4")) return "Visa";
    if (/^5[1-5]/.test(digitsOnly) || /^2[2-7]/.test(digitsOnly)) return "Mastercard";
    if (/^3[47]/.test(digitsOnly)) return "American Express";
    if (/^6011|^65/.test(digitsOnly)) return "Discover";
    if (/^35/.test(digitsOnly)) return "JCB";
    return "Unknown / Generic Account ID";
  }, [digitsOnly]);

  return (
    <ToolWorkspace
      layout="split"
      input={
        <ToolInput
          label="Enter Card / Account Number / IMEI"
          value={inputVal}
          onChange={setInputVal}
          placeholder="e.g. 4532 0151 1283 0366"
          mono
        />
      }
      output={
        digitsOnly.length > 0 && (
          <div className="space-y-6 flex flex-col h-full">
            {/* Validation Result Box */}
            <div className={`p-5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition ${
              isValid
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-red-500/10 border-red-500/30 text-red-400'
            }`}>
              <div className="flex items-center gap-3">
                {isValid ? (
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="w-8 h-8 text-red-400 shrink-0" />
                )}
                <div>
                  <h3 className="font-bold text-base font-sans">
                    {isValid ? 'VALID Luhn Checksum' : 'INVALID Luhn Checksum'}
                  </h3>
                  <p className="text-xs opacity-80 font-mono">
                    Detected Pattern: <strong>{cardIssuer}</strong> ({digitsOnly.length} digits)
                  </p>
                </div>
              </div>

              <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-lg bg-surface/50 border border-border">
                Mod 10 Check: {isValid ? "PASS" : "FAIL"}
              </span>
            </div>

            {/* Check Digit Generator */}
            <div className="space-y-3 flex-1 flex flex-col">
              <h4 className="font-bold text-sm text-text flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-sky-400" />
                Calculated Luhn Check Digit
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                <ToolResultArea
                  label="Calculated Check Digit"
                  value={String(checkDigit)}
                />
                <ToolResultArea
                  label="Complete Number"
                  value={generatedCompleteNumber}
                />
              </div>
            </div>
          </div>
        )
      }
    />
  );
}
