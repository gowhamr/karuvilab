"use client";

import { useState, useMemo } from "react";
import { CopyButton } from "@/components/ui/CopyButton";
import { ShieldAlert, CreditCard, Lock } from "lucide-react";

export function maskPan(panStr: string, firstDigits: number = 6, lastDigits: number = 4, maskChar: string = "*"): string {
  const digits = panStr.replace(/\D/g, "");
  if (digits.length <= firstDigits + lastDigits) return panStr;

  const first = digits.substring(0, firstDigits);
  const last = digits.substring(digits.length - lastDigits);
  const middle = maskChar.repeat(digits.length - firstDigits - lastDigits);

  // Group into 4s for readable display
  const masked = first + middle + last;
  return masked.match(/.{1,4}/g)?.join(" ") || masked;
}

export default function CardMaskerClient() {
  const [inputText, setInputText] = useState(`Transaction 10293: User 4532015112830366 charged $49.99
Log Entry 8821: PAN 5412751234567890 approved
Audit Log: Card 378282246310005 processed`);

  const [firstDigits, setFirstDigits] = useState(6);
  const [lastDigits, setLastDigits] = useState(4);

  const maskedOutput = useMemo(() => {
    // Find all 13-19 digit card sequences in text and mask them
    return inputText.replace(/\b\d{13,19}\b/g, (match) => maskPan(match, firstDigits, lastDigits, "*"));
  }, [inputText, firstDigits, lastDigits]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Settings Header */}
      <div className="p-4 rounded-xl bg-surface-2 border border-border flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-xs font-semibold text-text">
          <div className="flex items-center gap-2">
            <span className="text-text-muted">Keep Unmasked First Digits:</span>
            <input
              id="card-masker-first-digits"
              type="number"
              min={0}
              max={8}
              value={firstDigits}
              onChange={(e) => setFirstDigits(Number(e.target.value))}
              className="w-16 px-2 py-1 rounded bg-surface border border-border font-mono text-xs"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-text-muted">Keep Unmasked Last Digits:</span>
            <input
              id="card-masker-last-digits"
              type="number"
              min={0}
              max={6}
              value={lastDigits}
              onChange={(e) => setLastDigits(Number(e.target.value))}
              className="w-16 px-2 py-1 rounded bg-surface border border-border font-mono text-xs"
            />
          </div>
        </div>

        <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1">
          <Lock className="w-3.5 h-3.5" /> PCI-DSS Compliant Masking
        </span>
      </div>

      {/* Editor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-text flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-sky-400" />
            Raw Text / Logs containing Card Numbers:
          </label>
          <textarea
            id="card-masker-raw-input"
            rows={12}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full p-4 rounded-xl bg-surface border border-border font-mono text-xs focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-text">Masked & Sanitized Output:</label>
            <CopyButton text={maskedOutput} />
          </div>
          <textarea
            id="card-masker-masked-output"
            rows={12}
            readOnly
            value={maskedOutput}
            className="w-full p-4 rounded-xl bg-surface border border-border font-mono text-xs text-emerald-300 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
