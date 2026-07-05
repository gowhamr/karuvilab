"use client";

import { useState, useCallback, useMemo } from "react";
import { CopyButton } from "@/components/ui/CopyButton";
import { CheckCircle2, XCircle, CreditCard, ShieldCheck } from "lucide-react";

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
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Input */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-text flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-sky-400" />
          Enter Card / Account Number / IMEI:
        </label>
        <input
          id="luhn-input-number"
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="e.g. 4532 0151 1283 0366"
          className="w-full px-4 py-3 rounded-xl bg-surface border border-border font-mono text-base tracking-wider focus:outline-none"
        />
      </div>

      {/* Validation Result Box */}
      {digitsOnly.length > 0 && (
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
      )}

      {/* Check Digit Generator */}
      {digitsOnly.length > 0 && (
        <div className="p-5 rounded-xl bg-surface-2 border border-border space-y-3">
          <h4 className="font-bold text-sm text-text flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-sky-400" />
            Calculated Luhn Check Digit
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <span className="text-text-muted block font-sans text-xs">Calculated Check Digit:</span>
              <span className="text-xl font-bold text-emerald-300">{checkDigit}</span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-text-muted font-sans text-xs">Complete Number with Check Digit:</span>
                <CopyButton text={generatedCompleteNumber} />
              </div>
              <span className="text-sm font-bold text-sky-300 break-all">{generatedCompleteNumber}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
