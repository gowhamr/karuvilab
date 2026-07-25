"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { CopyButton } from "@/components/ui/CopyButton";
import { Checkbox } from "@/components/ui/Checkbox";
import { SliderField } from "@/components/ui/SliderField";
import { Shield, Key, History, Zap, ShieldCheck, Lock, AlertTriangle, Info, Clock, Fingerprint } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { m, AnimatePresence } from "framer-motion";

const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWER = "abcdefghijklmnopqrstuvwxyz";
const NUMS  = "0123456789";
const SYMS  = "!@#$%^&*()-_=+[]{}|;:,.<>?";

interface StrengthInfo {
  label: string;
  color: string;
  score: number;
  entropy: number;
  crackTime: string;
}

function calculateEntropy(password: string): number {
  if (!password) return 0;
  let pool = 0;
  if (/[a-z]/.test(password)) pool += 26;
  if (/[A-Z]/.test(password)) pool += 26;
  if (/[0-9]/.test(password)) pool += 10;
  if (/[^A-Za-z0-9]/.test(password)) pool += SYMS.length;
  
  return Math.log2(Math.pow(pool, password.length));
}

function formatCrackTime(entropy: number): string {
  // Assuming 100 billion guesses per second (standard high-end GPU cluster)
  const guessesPerSecond = 1e11;
  const totalGuesses = Math.pow(2, entropy);
  const seconds = totalGuesses / guessesPerSecond;

  if (seconds < 1) return "Instantly";
  if (seconds < 60) return "Few seconds";
  if (seconds < 3600) return "Few minutes";
  if (seconds < 86400) return "Few hours";
  if (seconds < 2592000) return `${Math.floor(seconds / 86400)} days`;
  if (seconds < 31536000) return `${Math.floor(seconds / 2592000)} months`;
  if (seconds < 31536000000) return `${Math.floor(seconds / 31536000)} years`;
  return "Centuries";
}

function getStrength(password: string): StrengthInfo {
  const entropy = calculateEntropy(password);
  const crackTime = formatCrackTime(entropy);
  
  let score = 0;
  if (entropy > 40) score++;
  if (entropy > 60) score++;
  if (entropy > 80) score++;
  if (entropy > 100) score++;
  if (entropy > 120) score++;

  if (score <= 1) return { label: "Very Weak", color: "text-error", score, entropy, crackTime };
  if (score === 2) return { label: "Weak", color: "text-error/80", score, entropy, crackTime };
  if (score === 3) return { label: "Fair", color: "text-warn", score, entropy, crackTime };
  if (score === 4) return { label: "Strong", color: "text-blue", score, entropy, crackTime };
  return { label: "Excellent", color: "text-success", score, entropy, crackTime };
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
  const [breachInfo, setBreachInfo] = useState<{ count: number | null; loading: boolean }>({ count: null, loading: false });

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const checkBreach = async (password: string) => {
    if (!password) return;
    abortControllerRef.current?.abort();
    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    setBreachInfo({ count: null, loading: true });
    try {
      const msgUint8 = new TextEncoder().encode(password);
      const hashBuffer = await crypto.subtle.digest("SHA-1", msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("").toUpperCase();
      
      const prefix = hashHex.substring(0, 5);
      const suffix = hashHex.substring(5);
      
      const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, { signal: abortController.signal });
      const text = await res.text();
      const lines = text.split("\n");
      const match = lines.find(line => line.split(":")[0] === suffix);
      
      if (match) {
        setBreachInfo({ count: parseInt(match.split(":")[1] || "0"), loading: false });
      } else {
        setBreachInfo({ count: 0, loading: false });
      }
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      console.error("HIBP Check failed", err);
      setBreachInfo({ count: null, loading: false });
    }
  };

  const generate = useCallback(() => {
    const newPasswords = Array.from({ length: 5 }, () =>
      generatePassword(length, useUpper, useLower, useNums, useSyms)
    );
    setPasswords(newPasswords);
    setHistory(prev => [newPasswords[0]!, ...prev].slice(0, 10));
    checkBreach(newPasswords[0]!);
  }, [length, useUpper, useLower, useNums, useSyms]);

  const strength = useMemo(() => passwords[0] ? getStrength(passwords[0]) : null, [passwords]);

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-surface border border-border p-6 sm:p-8 rounded-4xl shadow-sm space-y-8">
            <h2 className="text-sm font-black uppercase tracking-widest-lg text-blue flex items-center gap-3">
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
                <Checkbox checked={useUpper} onChange={() => setUseUpper(v => !v)} label="Uppercase (A-Z)" />
                <Checkbox checked={useLower} onChange={() => setUseLower(v => !v)} label="Lowercase (a-z)" />
                <Checkbox checked={useNums} onChange={() => setUseNums(v => !v)} label="Numbers (0-9)" />
                <Checkbox checked={useSyms} onChange={() => setUseSyms(v => !v)} label="Special Characters" />
              </div>

              <button
                onClick={generate}
                className="w-full py-4 bg-blue text-white text-sm font-black uppercase tracking-widest rounded-xl hover:shadow-lg hover:shadow-blue/20 active:scale-98 transition-all flex items-center justify-center gap-2 group"
              >
                <Zap className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Generate Secure Passwords
              </button>
            </div>
          </div>

          <AnimatePresence>
            {passwords.length > 0 && (
              <m.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Strength Dashboard */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-surface border border-border p-5 rounded-3xl space-y-3">
                    <div className="flex items-center gap-2 text-text-4">
                      <Fingerprint className="w-3.5 h-3.5" />
                      <span className="text-tiny font-bold uppercase tracking-widest-sm">Entropy</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-text">{Math.floor(strength?.entropy || 0)}</span>
                      <span className="text-xs text-text-4 font-bold uppercase">bits</span>
                    </div>
                    <p className="text-xs text-text-3 font-medium">Measure of password randomness.</p>
                  </div>

                  <div className="bg-surface border border-border p-5 rounded-3xl space-y-3">
                    <div className="flex items-center gap-2 text-text-4">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="text-tiny font-bold uppercase tracking-widest-sm">Crack Time</span>
                    </div>
                    <span className={cn("text-xl font-black block", strength?.color)}>{strength?.crackTime}</span>
                    <p className="text-xs text-text-3 font-medium">Estimate using GPU clusters.</p>
                  </div>

                  <div className={cn(
                    "p-5 rounded-3xl space-y-3 border transition-colors",
                    breachInfo.loading ? "bg-surface border-border" :
                    breachInfo.count === 0 ? "bg-success/5 border-success/20" :
                    breachInfo.count && breachInfo.count > 0 ? "bg-error/5 border-error/20" : "bg-surface border-border"
                  )}>
                    <div className="flex items-center gap-2 text-text-4">
                      <AlertTriangle className={cn("w-3.5 h-3.5", breachInfo.count ? "text-error" : "text-success")} />
                      <span className="text-tiny font-bold uppercase tracking-widest-sm">Breach Check</span>
                    </div>
                    {breachInfo.loading ? (
                      <div className="h-6 w-24 bg-mat-base animate-pulse rounded-lg" />
                    ) : (
                      <span className={cn("text-xl font-black block", breachInfo.count ? "text-error" : "text-success")}>
                        {breachInfo.count === 0 ? "Clear" : breachInfo.count ? `${breachInfo.count.toLocaleString()} times` : "Unknown"}
                      </span>
                    )}
                    <p className="text-xs text-text-3 font-medium">Checked via HIBP API.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <h2 className="text-sm font-black uppercase tracking-widest-lg text-blue flex items-center gap-3">
                      <ShieldCheck className="w-4 h-4" />
                      Results
                    </h2>
                  </div>

                  <div className="space-y-3">
                    {passwords.map((pw, i) => (
                      <m.div 
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={cn(
                          "bg-surface border border-border p-4 sm:p-5 rounded-2xl flex items-center justify-between gap-4 transition-all hover:border-blue/30 shadow-sm group",
                          i === 0 && "ring-2 ring-blue/10 border-blue/20"
                        )}
                      >
                        <span className="font-mono text-sm sm:text-base text-text break-all flex-1 selection:bg-blue/20">{pw}</span>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button 
                            onClick={() => {
                              checkBreach(pw);
                            }}
                            className="p-2 text-text-4 hover:text-blue transition-colors"
                            title="Analyze this password"
                           >
                             <Info className="w-4 h-4" />
                           </button>
                           <CopyButton text={pw} />
                        </div>
                      </m.div>
                    ))}
                  </div>
                </div>
              </m.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-6 lg:sticky lg:top-8">
          <h2 className="text-tiny font-bold uppercase tracking-widest-sm-lg text-text-4 px-2">Security Audit</h2>
          
          <div className="bg-surface border border-border rounded-4xl p-4 sm:p-6 space-y-6 shadow-sm">
             <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-emerald-600">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="text-tiny font-black uppercase tracking-widest">Privacy Guard</span>
              </div>
              <p className="text-xs text-text-3 leading-relaxed font-medium">
                Breach checks use the <strong className="text-emerald-700">k-Anonymity</strong> model. We only send the first 5 characters of your password's hash. Your actual password never leaves your browser.
              </p>
            </div>

            {history.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-tiny font-bold uppercase tracking-widest-sm-lg text-text-4 flex items-center gap-2">
                  <History className="w-3.5 h-3.5" />
                  Recent History
                </h3>
                <div className="space-y-2 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
                  {history.map((pw, i) => (
                    <div key={i} className="flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-bg transition-colors group">
                      <span className="font-mono text-xs text-text-4 break-all flex-1 truncate">{pw}</span>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button 
                          onClick={() => checkBreach(pw)}
                          className="p-1 hover:text-blue transition-colors"
                          title="Check for breaches"
                         >
                           <AlertTriangle className="w-3 h-3" />
                         </button>
                         <CopyButton text={pw} />
                      </div>
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
