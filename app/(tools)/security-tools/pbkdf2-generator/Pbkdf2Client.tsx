"use client";

import { useState, useCallback } from "react";
import { CopyButton } from "@/components/ui/CopyButton";
import { workerManager } from "@/src/workers/manager";
import { Key, ShieldCheck, Zap, AlertCircle } from "lucide-react";

export default function Pbkdf2Client() {
  const [password, setPassword] = useState("");
  const [salt, setSalt] = useState("karuvilab-salt");
  const [iterations, setIterations] = useState(100000);
  const [hash, setHash] = useState("SHA-256");
  const [keyLengthBits, setKeyLengthBits] = useState(256);

  const [hexResult, setHexResult] = useState("");
  const [b64Result, setB64Result] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDerive = useCallback(async () => {
    if (!password) {
      setError("Password / Input Secret is required");
      return;
    }
    setIsProcessing(true);
    setError(null);

    try {
      const res = await workerManager.run('pbkdf2Derive', [password, salt, iterations, hash, keyLengthBits]);
      setHexResult(res.hex);
      setB64Result(res.base64);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'PBKDF2 derivation failed');
    } finally {
      setIsProcessing(false);
    }
  }, [password, salt, iterations, hash, keyLengthBits]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Parameters */}
      <div className="p-4 rounded-xl bg-surface-2 border border-border grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="text-xs font-semibold text-text-muted block mb-1">Hash Algorithm</label>
          <select
            id="pbkdf2-hash-select"
            value={hash}
            onChange={(e) => setHash(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm font-medium"
          >
            <option value="SHA-256">SHA-256</option>
            <option value="SHA-384">SHA-384</option>
            <option value="SHA-512">SHA-512</option>
            <option value="SHA-1">SHA-1</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-text-muted block mb-1">Iterations</label>
          <input
            id="pbkdf2-iterations-input"
            type="number"
            value={iterations}
            onChange={(e) => setIterations(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm font-medium"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-text-muted block mb-1">Output Length (Bits)</label>
          <select
            id="pbkdf2-length-select"
            value={keyLengthBits}
            onChange={(e) => setKeyLengthBits(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm font-medium"
          >
            <option value={128}>128 bits (16 bytes)</option>
            <option value={256}>256 bits (32 bytes)</option>
            <option value={512}>512 bits (64 bytes)</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-text-muted block mb-1">Salt String</label>
          <input
            id="pbkdf2-salt-input"
            type="text"
            value={salt}
            onChange={(e) => setSalt(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm font-medium"
          />
        </div>
      </div>

      {/* Input */}
      <div className="space-y-1">
        <label className="text-sm font-semibold text-text">Password / Secret Material:</label>
        <input
          id="pbkdf2-password-input"
          type="password"
          placeholder="Enter password..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-4 rounded-xl bg-surface border border-border font-mono text-sm focus:outline-none"
        />
      </div>

      <button
        id="pbkdf2-derive-btn"
        onClick={handleDerive}
        disabled={isProcessing}
        className="w-full py-3 rounded-xl bg-primary text-white font-bold text-base flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition"
      >
        <Zap className="w-5 h-5" />
        {isProcessing ? 'Deriving Key...' : 'Derive PBKDF2 Key'}
      </button>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Output */}
      {hexResult && (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-text">Hex Encoded Derived Key:</label>
              <CopyButton text={hexResult} />
            </div>
            <textarea readOnly rows={2} value={hexResult} className="w-full p-3 rounded-xl bg-surface border border-border font-mono text-xs text-emerald-300" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-text">Base64 Encoded Derived Key:</label>
              <CopyButton text={b64Result} />
            </div>
            <textarea readOnly rows={2} value={b64Result} className="w-full p-3 rounded-xl bg-surface border border-border font-mono text-xs text-sky-300" />
          </div>
        </div>
      )}
    </div>
  );
}
