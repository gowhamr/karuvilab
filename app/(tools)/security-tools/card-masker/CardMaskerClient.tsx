"use client";

import { useState, useMemo } from "react";
import { Lock } from "lucide-react";
import { ToolWorkspace } from "@/components/ui/ToolWorkspace";
import { ToolInput } from "@/components/ui/ToolInput";
import { ToolResultArea } from "@/components/ui/ToolResultArea";

export function luhnCheck(digits: string): boolean {
  if (digits.length < 13 || digits.length > 19) return false;
  let sum = 0;
  let shouldDouble = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let val = parseInt(digits[i]!, 10);
    if (shouldDouble) {
      val *= 2;
      if (val > 9) val -= 9;
    }
    sum += val;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

export function maskPan(panStr: string, firstDigits: number = 6, lastDigits: number = 4, maskChar: string = "*"): string {
  const digits = panStr.replace(/\D/g, "");
  if (digits.length <= firstDigits + lastDigits) return panStr;

  let digitIndex = 0;
  let result = "";
  for (let i = 0; i < panStr.length; i++) {
    const char = panStr[i]!;
    if (/\d/.test(char)) {
      if (digitIndex >= firstDigits && digitIndex < digits.length - lastDigits) {
        result += maskChar;
      } else {
        result += char;
      }
      digitIndex++;
    } else {
      result += char;
    }
  }
  return result;
}

export default function CardMaskerClient() {
  const [inputText, setInputText] = useState(`Transaction 10293: User 4532 0151 1283 0366 charged $49.99
Log Entry 8821: PAN 5412-7512-3456-7890 approved
Audit Log: Card 3782-822463-10005 processed
Phone check: +1 555-555-5555 should not be masked.`);

  const [firstDigits, setFirstDigits] = useState(6);
  const [lastDigits, setLastDigits] = useState(4);

  const maskedOutput = useMemo(() => {
    // Matches 13-19 digit candidate sequences separated by any spaces/hyphens
    // Lookaround ensures we don't grab a substring of a longer number.
    const candidateRegex = /(?<!\d)\d(?:[\s-]*\d){12,18}(?!\d)/g;
    return inputText.replace(candidateRegex, (match) => {
      const cleanDigits = match.replace(/[\s-]/g, "");
      if (luhnCheck(cleanDigits)) {
        return maskPan(match, firstDigits, lastDigits, "*");
      }
      return match;
    });
  }, [inputText, firstDigits, lastDigits]);

  return (
    <ToolWorkspace
      layout="split"
      input={
        <ToolInput
          label="Raw Text / Logs containing Card Numbers"
          value={inputText}
          onChange={setInputText}
          rows={12}
          mono
          placeholder="Enter text containing credit card numbers..."
        />
      }
      optionsPanel={
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <label htmlFor="card-masker-first-digits" className="text-sm font-bold text-text-2">Keep First Digits:</label>
              <input
                id="card-masker-first-digits"
                type="number"
                min={0}
                max={8}
                value={firstDigits}
                onChange={(e) => setFirstDigits(Number(e.target.value))}
                className="w-16 px-2 py-1 bg-bg border border-border rounded outline-none focus:border-primary text-sm font-mono"
              />
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="card-masker-last-digits" className="text-sm font-bold text-text-2">Keep Last Digits:</label>
              <input
                id="card-masker-last-digits"
                type="number"
                min={0}
                max={6}
                value={lastDigits}
                onChange={(e) => setLastDigits(Number(e.target.value))}
                className="w-16 px-2 py-1 bg-bg border border-border rounded outline-none focus:border-primary text-sm font-mono"
              />
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-500 flex items-center gap-1">
            <Lock className="w-3.5 h-3.5" /> PCI-DSS Compliant Masking
          </span>
        </div>
      }
      output={
        <ToolResultArea
          label="Masked & Sanitized Output"
          value={maskedOutput}
          onClear={() => setInputText('')}
          contentClassName="text-emerald-500"
        />
      }
    />
  );
}
