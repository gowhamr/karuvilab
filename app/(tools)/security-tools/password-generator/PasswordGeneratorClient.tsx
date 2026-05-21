"use client";
import { useState, useCallback } from "react";
import { CopyButton } from "@/components/ui/CopyButton";
import { Checkbox } from "@/components/ui/Checkbox";
import { SliderField } from "@/components/ui/SliderField";
import { Shield, Key, History, Zap, ShieldCheck, Lock } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { m } from "framer-motion";

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
  if (score <= 3) return { label: "Fair", color: "text-amber-500", score };
  if (score <= 4) return { label: "Good", color: "text-blue-500", score };
  return { label: "Strong", color: "text-emerald-500", score };
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
    setHistory(prev => [newPasswords[0]!, ...prev].slice(0, 10));
  }, [length, useUpper, useLower, useNums, useSyms]);

  const strength = passwords[0] ? getStrength(passwords[0]) : null;

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-surface border border-border p-6 sm:p-8 rounded-[32px] shadow-sm space-y-8">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-blue flex items-center gap-3">
              <Lock className="w-4 h-4" />
              Generator Parameters
            </h2>

            <div className="space-y-8">
              <SliderField
                id="length"
                label="Password Length"
                min={8}
                max={128}
                value={length}
                onChange={setLength}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Checkbox checked={useUpper} onChange={() => setUseUpper(v => !v)} label="Uppercase Characters (A-Z)" />
                <Checkbox checked={useLower} onChange={() => setUseLower(v => !v)} label="Lowercase Characters (a-z)" />
                <Checkbox checked={useNums} onChange={() => setUseNums(v => !v)} label="Numeric Values (0-9)" />
                <Checkbox checked={useSyms} onChange={() => setUseSyms(v => !v)} label="Special Symbols (!@#$%...)" />
              </div>

              <button
                onClick={generate}
                className="w-full py-4 bg-blue text-white text-sm font-black uppercase tracking-widest rounded-xl hover:shadow-lg hover:shadow-blue/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
              >
                <Zap className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Generate Secure Passwords
              </button>
            </div>
          </div>

          {passwords.length > 0 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <h2 className="text-sm font-black uppercase tracking-[0.2em] text-blue flex items-center gap-3 px-2">
                <ShieldCheck className="w-4 h-4" />
                Security Results
              </h2>

              <div className="space-y-4">
                {strength && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4 bg-surface border border-border rounded-2xl shadow-sm">
                    <div className="flex items-center gap-3">
                      <Shield className={cn("w-5 h-5", strength.score >= 5 ? "text-emerald-500" : "text-blue")} />
                      <span className="text-sm text-text-3 font-bold">Strength Analysis:</span>
                      <span className={cn("text-sm font-black uppercase tracking-wider", strength.color)}>{strength.label}</span>
                    </div>
                    <div className="flex gap-1.5">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <m.div
                          key={i}
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          className={cn(
                            "h-1.5 w-8 rounded-full transition-all duration-500",
                            i < strength.score 
                              ? (strength.score >= 5 ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]" : strength.score >= 4 ? "bg-blue shadow-[0_0_10px_rgba(79,70,229,0.2)]" : strength.score >= 3 ? "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.2)]" : "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]") 
                              : "bg-border"
                          )}
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {passwords.map((pw, i) => (
                    <div 
                      key={i} 
                      className={cn(
                        "bg-surface border border-border p-4 sm:p-5 rounded-2xl flex items-center justify-between gap-4 transition-all hover:border-blue/30 shadow-sm",
                        i === 0 && "ring-2 ring-blue/10 border-blue/20"
                      )}
                    >
                      <span className="font-mono text-sm sm:text-base text-text break-all flex-1 selection:bg-blue/20">{pw}</span>
                      <CopyButton text={pw} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6 lg:sticky lg:top-8">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-4 px-2">Security Audit</h2>
          
          <div className="bg-surface border border-border rounded-[32px] p-6 space-y-6 shadow-sm">
             <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-emerald-600">
                <ShieldCheck className="w-3 h-3" />
                <span className="text-[9px] font-black uppercase tracking-widest">Local Execution</span>
              </div>
              <p className="text-[11px] text-text-3 leading-relaxed font-medium">
                Passwords are generated using <code className="text-emerald-700 bg-emerald-100 dark:bg-emerald-900/30 px-1 rounded">crypto.getRandomValues()</code> entirely in your browser. No data ever leaves your device.
              </p>
            </div>

            {history.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-4 flex items-center gap-2">
                  <History className="w-3 h-3" />
                  Recent History
                </h3>
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {history.map((pw, i) => (
                    <div key={i} className="flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-bg transition-colors">
                      <span className="font-mono text-[10px] text-text-4 break-all flex-1 truncate">{pw}</span>
                      <CopyButton text={pw} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
