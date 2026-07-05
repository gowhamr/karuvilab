"use client";

import { useState, useCallback } from "react";
import { CopyButton } from "@/components/ui/CopyButton";
import { workerManager } from "@/src/workers/manager";
import { Zap, AlertCircle } from "lucide-react";

export default function HkdfClient() {
  const [ikm, setIkm] = useState("");
  const [salt, setSalt] = useState("hkdf-salt");
  const [info, setInfo] = useState("app-context-info");
  const [hash, setHash] = useState("SHA-256");
  const [lengthBits, setLengthBits] = useState(256);

  const [hexResult, setHexResult] = useState("");
  const [b64Result, setB64Result] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDerive = useCallback(async () => {
    if (!ikm) {
      setError("Input Keying Material (IKM) is required");
      return;
    }
    setIsProcessing(true);
    setError(null);

    try {
      const res = await workerManager.run('hkdfDerive', [ikm, salt, info, hash, lengthBits]);
      setHexResult(res.hex);
      setB64Result(res.base64);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'HKDF derivation failed');
    } finally {
      setIsProcessing(false);
    }
  }, [ikm, salt, info, hash, lengthBits]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="p-4 rounded-xl bg-surface-2 border border-border grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="text-xs font-semibold text-text-muted block mb-1">Hash Algorithm</label>
          <select
            id="hkdf-hash-select"
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
          <label className="text-xs font-semibold text-text-muted block mb-1">Output Length (Bits)</label>
          <select
            id="hkdf-length-select"
            value={lengthBits}
            onChange={(e) => setLengthBits(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm font-medium"
          >
            <option value={128}>128 bits (16 bytes)</option>
            <option value={256}>256 bits (32 bytes)</option>
            <option value={512}>512 bits (64 bytes)</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-text-muted block mb-1">Salt Parameter</label>
          <input
            id="hkdf-salt-input"
            type="text"
            value={salt}
            onChange={(e) => setSalt(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm font-medium"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-text-muted block mb-1">Context Info (Info)</label>
          <input
            id="hkdf-info-input"
            type="text"
            value={info}
            onChange={(e) => setInfo(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm font-medium"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-semibold text-text">Input Keying Material (IKM):</label>
        <input
          id="hkdf-ikm-input"
          type="password"
          placeholder="Enter master secret or IKM string..."
          value={ikm}
          onChange={(e) => setIkm(e.target.value)}
          className="w-full p-4 rounded-xl bg-surface border border-border font-mono text-sm focus:outline-none"
        />
      </div>

      <button
        id="hkdf-derive-btn"
        onClick={handleDerive}
        disabled={isProcessing}
        className="w-full py-3 rounded-xl bg-primary text-white font-bold text-base flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition"
      >
        <Zap className="w-5 h-5" />
        {isProcessing ? 'Deriving Key...' : 'Derive HKDF Key'}
      </button>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {hexResult && (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-text">Hex Encoded HKDF Key:</label>
              <CopyButton text={hexResult} />
            </div>
            <textarea readOnly rows={2} value={hexResult} className="w-full p-3 rounded-xl bg-surface border border-border font-mono text-xs text-emerald-300" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-text">Base64 Encoded HKDF Key:</label>
              <CopyButton text={b64Result} />
            </div>
            <textarea readOnly rows={2} value={b64Result} className="w-full p-3 rounded-xl bg-surface border border-border font-mono text-xs text-sky-300" />
          </div>
        </div>
      )}
    </div>
  );
}
