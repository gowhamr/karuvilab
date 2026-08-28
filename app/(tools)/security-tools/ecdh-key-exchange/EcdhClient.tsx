"use client";

import { useState, useCallback } from "react";
import { CopyButton } from "@/components/ui/CopyButton";
import { ToolWorkspace } from "@/components/ui/ToolWorkspace";
import { workerManager } from "@/src/workers/manager";
import { Users, Key, ShieldCheck, ArrowRightLeft, Lock, ArrowDown, CheckCircle2, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Step = 0 | 1 | 2 | 3;

export default function EcdhClient() {
  const [curve, setCurve] = useState<'P-256' | 'P-384' | 'P-521'>('P-256');

  // Party A Keys
  const [partyAPublic, setPartyAPublic] = useState("");
  const [partyAPrivate, setPartyAPrivate] = useState("");
  const [partyASecretHex, setPartyASecretHex] = useState("");

  // Party B Keys
  const [partyBPublic, setPartyBPublic] = useState("");
  const [partyBPrivate, setPartyBPrivate] = useState("");
  const [partyBSecretHex, setPartyBSecretHex] = useState("");

  const [step, setStep] = useState<Step>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateKeys = useCallback(async () => {
    setIsProcessing(true);
    setError(null);
    try {
      const keyPairA = await workerManager.run('ecdhGenerateKeyPair', [curve]);
      setPartyAPublic(keyPairA.publicKeyPem);
      setPartyAPrivate(keyPairA.privateKeyPem);

      const keyPairB = await workerManager.run('ecdhGenerateKeyPair', [curve]);
      setPartyBPublic(keyPairB.publicKeyPem);
      setPartyBPrivate(keyPairB.privateKeyPem);
      
      setStep(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate keys');
    } finally {
      setIsProcessing(false);
    }
  }, [curve]);

  const exchangeKeys = useCallback(() => {
    setStep(2);
  }, []);

  const deriveSecrets = useCallback(async () => {
    setIsProcessing(true);
    try {
      const secretA = await workerManager.run('ecdhDeriveSecret', [partyAPrivate, partyBPublic, curve]);
      setPartyASecretHex(secretA);

      const secretB = await workerManager.run('ecdhDeriveSecret', [partyBPrivate, partyAPublic, curve]);
      setPartyBSecretHex(secretB);
      
      setStep(3);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to derive shared secret');
    } finally {
      setIsProcessing(false);
    }
  }, [partyAPrivate, partyBPublic, partyBPrivate, partyAPublic, curve]);

  const reset = useCallback(() => {
    setStep(0);
    setPartyAPublic("");
    setPartyAPrivate("");
    setPartyASecretHex("");
    setPartyBPublic("");
    setPartyBPrivate("");
    setPartyBSecretHex("");
    setError(null);
  }, []);

  const matches = partyASecretHex && partyBSecretHex && partyASecretHex === partyBSecretHex;

  return (
    <ToolWorkspace
      layout="stacked"
      optionsPanel={
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-muted mb-1">Elliptic Curve</label>
              <select
                id="ecdh-curve-select"
                value={curve}
                onChange={(e) => {
                  setCurve(e.target.value as any);
                  if (step > 0) reset();
                }}
                className="px-3 py-1.5 rounded-lg bg-surface border border-border text-sm font-medium focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                disabled={step > 0}
              >
                <option value="P-256">NIST P-256</option>
                <option value="P-384">NIST P-384</option>
                <option value="P-521">NIST P-521</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3">
            {step > 0 && (
              <button
                onClick={reset}
                className="px-4 py-2.5 rounded-xl bg-surface hover:bg-surface-2 border border-border text-text font-semibold text-sm flex items-center gap-2 transition-all active:scale-[0.98]"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
            )}
            {step === 0 && (
              <button
                onClick={generateKeys}
                disabled={isProcessing}
                className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-sm flex items-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all active:scale-[0.98]"
              >
                <Key className={`w-4 h-4 ${isProcessing ? 'animate-pulse' : ''}`} />
                {isProcessing ? 'Generating...' : 'Step 1: Generate Keys'}
              </button>
            )}
            {step === 1 && (
              <button
                onClick={exchangeKeys}
                className="px-6 py-2.5 rounded-xl bg-indigo-500 text-white font-bold text-sm flex items-center gap-2 hover:opacity-90 transition-all active:scale-[0.98]"
              >
                <ArrowRightLeft className="w-4 h-4" />
                Step 2: Exchange Public Keys
              </button>
            )}
            {step === 2 && (
              <button
                onClick={deriveSecrets}
                disabled={isProcessing}
                className="px-6 py-2.5 rounded-xl bg-emerald-500 text-white font-bold text-sm flex items-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all active:scale-[0.98]"
              >
                <ShieldCheck className={`w-4 h-4 ${isProcessing ? 'animate-pulse' : ''}`} />
                {isProcessing ? 'Deriving...' : 'Step 3: Derive Shared Secret'}
              </button>
            )}
          </div>
        </div>
      }
      output={
        <div className="space-y-8 w-full">
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium">
              {error}
            </motion.div>
          )}

          {/* Two Parties Layout */}
          <AnimatePresence mode="wait">
            {step > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="grid grid-cols-1 md:grid-cols-2 gap-6 relative"
              >
                {/* Connection Line */}
                <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2" />

                {/* Party A */}
                <div className="space-y-4">
                  <div className="p-5 rounded-2xl bg-surface-2 border border-border flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-sky-600 dark:text-sky-400">Alice</h3>
                      <p className="text-xs text-text-muted">Party A</p>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-surface border border-border space-y-4 shadow-sm relative overflow-hidden">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-semibold text-text-muted flex items-center gap-1.5">
                          <Key className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> Alice's Private Key
                        </label>
                      </div>
                      <textarea readOnly rows={3} value={partyAPrivate} className="w-full p-2.5 rounded-lg bg-surface-2 border border-border font-mono text-[11px] text-amber-700 dark:text-amber-300 resize-none focus:outline-none" />
                      <p className="text-[10px] text-text-muted">Never shared. Kept secret by Alice.</p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-semibold text-text-muted flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" /> Alice's Public Key
                        </label>
                        <CopyButton text={partyAPublic} />
                      </div>
                      <textarea readOnly rows={3} value={partyAPublic} className="w-full p-2.5 rounded-lg bg-surface-2 border border-border font-mono text-[11px] text-sky-700 dark:text-sky-300 resize-none focus:outline-none" />
                      <p className="text-[10px] text-text-muted">Safe to share over insecure channels.</p>
                    </div>
                  </div>
                  
                  <AnimatePresence>
                    {step >= 2 && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0, y: -20 }} 
                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                        className="p-5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 space-y-3"
                      >
                        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-sm font-bold">
                          <ArrowDown className="w-4 h-4" /> Received from Bob
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-indigo-700 dark:text-indigo-300/70">Bob's Public Key</label>
                          <textarea readOnly rows={2} value={partyBPublic} className="w-full p-2.5 rounded-lg bg-surface/50 border border-indigo-500/20 font-mono text-[11px] text-indigo-700 dark:text-indigo-300 resize-none focus:outline-none" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {step >= 3 && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }} 
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-3"
                      >
                        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm font-bold">
                          <ShieldCheck className="w-5 h-5" /> Alice's Derived Secret
                        </div>
                        <p className="text-xs text-emerald-700 dark:text-emerald-300/80 leading-relaxed">
                          Calculated using <strong className="text-amber-700 dark:text-amber-300">Alice's Private Key</strong> + <strong className="text-indigo-700 dark:text-indigo-300">Bob's Public Key</strong>
                        </p>
                        <div className="p-3 rounded-xl bg-surface/50 border border-emerald-500/20 flex flex-col gap-2">
                          <div className="flex justify-end">
                            <CopyButton text={partyASecretHex} />
                          </div>
                          <p className="font-mono text-xs text-emerald-700 dark:text-emerald-300 break-all">{partyASecretHex}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Party B */}
                <div className="space-y-4">
                  <div className="p-5 rounded-2xl bg-surface-2 border border-border flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-indigo-600 dark:text-indigo-400">Bob</h3>
                      <p className="text-xs text-text-muted">Party B</p>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-surface border border-border space-y-4 shadow-sm relative overflow-hidden">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-semibold text-text-muted flex items-center gap-1.5">
                          <Key className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> Bob's Private Key
                        </label>
                      </div>
                      <textarea readOnly rows={3} value={partyBPrivate} className="w-full p-2.5 rounded-lg bg-surface-2 border border-border font-mono text-[11px] text-amber-700 dark:text-amber-300 resize-none focus:outline-none" />
                      <p className="text-[10px] text-text-muted">Never shared. Kept secret by Bob.</p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-semibold text-text-muted flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" /> Bob's Public Key
                        </label>
                        <CopyButton text={partyBPublic} />
                      </div>
                      <textarea readOnly rows={3} value={partyBPublic} className="w-full p-2.5 rounded-lg bg-surface-2 border border-border font-mono text-[11px] text-indigo-700 dark:text-indigo-300 resize-none focus:outline-none" />
                      <p className="text-[10px] text-text-muted">Safe to share over insecure channels.</p>
                    </div>
                  </div>

                  <AnimatePresence>
                    {step >= 2 && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0, y: -20 }} 
                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                        className="p-5 rounded-2xl bg-sky-500/10 border border-sky-500/20 space-y-3"
                      >
                        <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 text-sm font-bold">
                          <ArrowDown className="w-4 h-4" /> Received from Alice
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-sky-700 dark:text-sky-300/70">Alice's Public Key</label>
                          <textarea readOnly rows={2} value={partyAPublic} className="w-full p-2.5 rounded-lg bg-surface/50 border border-sky-500/20 font-mono text-[11px] text-sky-700 dark:text-sky-300 resize-none focus:outline-none" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {step >= 3 && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }} 
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-3"
                      >
                        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm font-bold">
                          <ShieldCheck className="w-5 h-5" /> Bob's Derived Secret
                        </div>
                        <p className="text-xs text-emerald-700 dark:text-emerald-300/80 leading-relaxed">
                          Calculated using <strong className="text-amber-700 dark:text-amber-300">Bob's Private Key</strong> + <strong className="text-sky-700 dark:text-sky-300">Alice's Public Key</strong>
                        </p>
                        <div className="p-3 rounded-xl bg-surface/50 border border-emerald-500/20 flex flex-col gap-2">
                          <div className="flex justify-end">
                            <CopyButton text={partyBSecretHex} />
                          </div>
                          <p className="font-mono text-xs text-emerald-700 dark:text-emerald-300 break-all">{partyBSecretHex}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Matching Verification Badge */}
          <AnimatePresence>
            {matches && step === 3 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex flex-col md:flex-row items-center gap-4 text-center md:text-left shadow-lg"
              >
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-extrabold text-lg tracking-tight mb-1">SHARED SECRETS MATCH VERIFIED!</h4>
                  <p className="text-sm opacity-90 leading-relaxed max-w-2xl">
                    Both Alice and Bob independently calculated the exact same {curve === 'P-256' ? 256 : curve === 'P-384' ? 384 : 521}-bit symmetric shared secret over an insecure channel, without ever transmitting their private keys! This shared secret can now be used with AES to encrypt future messages.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      }
    />
  );
}

