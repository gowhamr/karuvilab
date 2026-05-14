"use client";
import { useState, useCallback } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { CopyButton } from "@/components/ui/CopyButton";
import { Checkbox } from "@/components/ui/Checkbox";

const cat = CATEGORIES.find(c => c.id === "security")!;

const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWER = "abcdefghijklmnopqrstuvwxyz";
const NUMS  = "0123456789";
const SYMS  = "!@#$%^&*()-_=+[]{}|;:,.<>?";

function getStrength(password: string): { label: string; color: string; score: number } {
  let score = 0;
  if (password.length >= 12) score++;
  if (password.length >= 16) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return { label: "Weak", color: "text-red-500", score };
  if (score <= 3) return { label: "Fair", color: "text-yellow-500", score };
  if (score <= 4) return { label: "Good", color: "text-blue-400", score };
  return { label: "Strong", color: "text-green-500", score };
}

function generatePassword(length: number, useUpper: boolean, useLower: boolean, useNums: boolean, useSyms: boolean): string {
  let charset = "";
  if (useUpper) charset += UPPER;
  if (useLower) charset += LOWER;
  if (useNums) charset += NUMS;
  if (useSyms) charset += SYMS;
  if (!charset) charset = LOWER + NUMS;

  const arr = new Uint32Array(length);
  crypto.getRandomValues(arr);
  return Array.from(arr).map(v => charset[v % charset.length]).join("");
}

export default function PasswordGeneratorClient() {
  const [length, setLength] = useState(16);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNums, setUseNums] = useState(true);
  const [useSyms, setUseSyms] = useState(true);
  const [passwords, setPasswords] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);

  const generate = useCallback(() => {
    const newPasswords = Array.from({ length: 5 }, () =>
      generatePassword(length, useUpper, useLower, useNums, useSyms)
    );
    setPasswords(newPasswords);
    setHistory(prev => [newPasswords[0]!, ...prev].slice(0, 5));
  }, [length, useUpper, useLower, useNums, useSyms]);

  const strength = passwords[0] ? getStrength(passwords[0]) : null;

  return (
    <div className="space-y-6">
      <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-text-2">Length</label>
            <span className="text-sm font-mono font-bold text-blue">{length}</span>
          </div>
          <input
            type="range"
            min={8}
            max={128}
            value={length}
            onChange={e => setLength(Number(e.target.value))}
            className="w-full accent-blue"
          />
          <div className="flex justify-between text-xs text-text-4">
            <span>8</span><span>128</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Checkbox checked={useUpper} onChange={() => setUseUpper(v => !v)} label="Uppercase (A-Z)" />
          <Checkbox checked={useLower} onChange={() => setUseLower(v => !v)} label="Lowercase (a-z)" />
          <Checkbox checked={useNums} onChange={() => setUseNums(v => !v)} label="Numbers (0-9)" />
          <Checkbox checked={useSyms} onChange={() => setUseSyms(v => !v)} label="Symbols (!@#…)" />
        </div>

        <button
          onClick={generate}
          className="w-full py-4 bg-blue text-white font-bold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          Generate Passwords
        </button>
      </div>

      {passwords.length > 0 && (
        <div className="space-y-3">
          {strength && (
            <div className="flex items-center gap-2 px-1">
              <span className="text-sm text-text-4">Strength:</span>
              <span className={`text-sm font-bold ${strength.color}`}>{strength.label}</span>
              <div className="flex gap-1 ml-1">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 w-6 rounded-full transition-colors ${i < strength.score ? (strength.score >= 5 ? "bg-green-500" : strength.score >= 4 ? "bg-blue-400" : strength.score >= 3 ? "bg-yellow-500" : "bg-red-500") : "bg-border"}`}
                  />
                ))}
              </div>
            </div>
          )}
          <div className="space-y-2">
            {passwords.map((pw, i) => (
              <div key={i} className="bg-surface border border-border p-4 rounded-xl flex items-center justify-between gap-3">
                <span className="font-mono text-sm text-text break-all flex-1">{pw}</span>
                <CopyButton text={pw} />
              </div>
            ))}
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div className="bg-surface border border-border p-4 rounded-2xl space-y-3">
          <h3 className="text-xs font-bold text-text-4 uppercase tracking-wider">Recent History</h3>
          <div className="space-y-2">
            {history.map((pw, i) => (
              <div key={i} className="flex items-center justify-between gap-3">
                <span className="font-mono text-xs text-text-3 break-all flex-1 truncate">{pw}</span>
                <CopyButton text={pw} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
