"use client";

import { useState, useCallback } from "react";
import { CopyButton } from "@/components/ui/CopyButton";
import { workerManager } from "@/src/workers/manager";
import { Users, Key, ShieldCheck, ArrowRightLeft, RefreshCw } from "lucide-react";

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

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSimulateExchange = useCallback(async () => {
    setIsProcessing(true);
    setError(null);

    try {
      // 1. Generate Keypair for Party A
      const keyPairA = await workerManager.run('ecdsaGenerateKeyPair', [curve]);
      setPartyAPublic(keyPairA.publicKeyPem);
      setPartyAPrivate(keyPairA.privateKeyPem);

      // 2. Generate Keypair for Party B
      const keyPairB = await workerManager.run('ecdsaGenerateKeyPair', [curve]);
      setPartyBPublic(keyPairB.publicKeyPem);
      setPartyBPrivate(keyPairB.privateKeyPem);

      // 3. Party A derives secret using A_priv + B_pub
      const secretA = await workerManager.run('ecdhDeriveSecret', [keyPairA.privateKeyPem, keyPairB.publicKeyPem, curve]);
      setPartyASecretHex(secretA);

      // 4. Party B derives secret using B_priv + A_pub
      const secretB = await workerManager.run('ecdhDeriveSecret', [keyPairB.privateKeyPem, keyPairA.publicKeyPem, curve]);
      setPartyBSecretHex(secretB);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ECDH Simulation failed');
    } finally {
      setIsProcessing(false);
    }
  }, [curve]);

  const matches = partyASecretHex && partyBSecretHex && partyASecretHex === partyBSecretHex;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Control Header */}
      <div className="p-4 rounded-xl bg-surface-2 border border-border flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <label className="text-sm font-semibold text-text">Elliptic Curve:</label>
          <select
            id="ecdh-curve-select"
            value={curve}
            onChange={(e) => setCurve(e.target.value as any)}
            className="px-3 py-1.5 rounded-lg bg-surface border border-border text-sm font-medium"
          >
            <option value="P-256">NIST P-256</option>
            <option value="P-384">NIST P-384</option>
            <option value="P-521">NIST P-521</option>
          </select>
        </div>

        <button
          id="ecdh-simulate-btn"
          onClick={handleSimulateExchange}
          disabled={isProcessing}
          className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-sm flex items-center gap-2 hover:opacity-90 disabled:opacity-50 transition"
        >
          <ArrowRightLeft className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
          {isProcessing ? 'Simulating Exchange...' : 'Run ECDH Key Exchange Simulation'}
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
          {error}
        </div>
      )}

      {/* Two Parties Layout */}
      {(partyAPublic || partyBPublic) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Party A */}
          <div className="p-5 rounded-xl bg-surface-2 border border-border space-y-4">
            <h3 className="font-bold text-base text-sky-400 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Party A (Alice)
            </h3>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-muted">Alice Public Key:</label>
              <textarea readOnly rows={4} value={partyAPublic} className="w-full p-2.5 rounded-lg bg-surface border border-border font-mono text-xs text-sky-300" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-muted">Alice Private Key:</label>
              <textarea readOnly rows={4} value={partyAPrivate} className="w-full p-2.5 rounded-lg bg-surface border border-border font-mono text-xs text-amber-300" />
            </div>

            <div className="p-3 rounded-lg bg-surface border border-border space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400">Alice Derived Shared Secret (Hex):</span>
                <CopyButton text={partyASecretHex} />
              </div>
              <p className="font-mono text-xs text-emerald-300 break-all">{partyASecretHex}</p>
            </div>
          </div>

          {/* Party B */}
          <div className="p-5 rounded-xl bg-surface-2 border border-border space-y-4">
            <h3 className="font-bold text-base text-indigo-400 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Party B (Bob)
            </h3>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-muted">Bob Public Key:</label>
              <textarea readOnly rows={4} value={partyBPublic} className="w-full p-2.5 rounded-lg bg-surface border border-border font-mono text-xs text-indigo-300" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-muted">Bob Private Key:</label>
              <textarea readOnly rows={4} value={partyBPrivate} className="w-full p-2.5 rounded-lg bg-surface border border-border font-mono text-xs text-amber-300" />
            </div>

            <div className="p-3 rounded-lg bg-surface border border-border space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400">Bob Derived Shared Secret (Hex):</span>
                <CopyButton text={partyBSecretHex} />
              </div>
              <p className="font-mono text-xs text-emerald-300 break-all">{partyBSecretHex}</p>
            </div>
          </div>
        </div>
      )}

      {/* Matching Verification Badge */}
      {matches && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 flex-shrink-0" />
          <div>
            <h4 className="font-bold text-base">SHARED SECRET MATCH VERIFIED!</h4>
            <p className="text-xs opacity-90">
              Both Alice and Bob independently calculated the exact same 256-bit symmetric shared secret over an insecure channel without revealing private keys!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
