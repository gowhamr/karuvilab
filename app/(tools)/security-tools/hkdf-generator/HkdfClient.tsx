"use client";

import { useState, useCallback } from "react";
import { workerManager } from "@/src/workers/manager";
import { Zap, AlertCircle } from "lucide-react";
import { ToolWorkspace } from "@/components/ui/ToolWorkspace";
import { ToolResultArea } from "@/components/ui/ToolResultArea";
import { ToolInput } from "@/components/ui/ToolInput";

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
    <ToolWorkspace
      input={
        <ToolInput
          id="hkdf-ikm-input"
          label="Input Keying Material (IKM)"
          placeholder="Enter master secret or IKM string..."
          type="password"
          mono
          value={ikm}
          onChange={setIkm}
        />
      }
      optionsPanel={
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between items-end px-1">
                <label htmlFor="hkdf-hash-select" className="text-sm font-bold text-text-2">Hash Algorithm</label>
              </div>
              <select
                id="hkdf-hash-select"
                value={hash}
                onChange={(e) => setHash(e.target.value)}
                className="w-full px-4 py-3 bg-bg border border-divider rounded-input outline-none transition-all min-h-12 text-text-primary text-body focus:ring-4 focus:ring-inset focus:ring-primary/10 focus:border-primary"
              >
                <option value="SHA-256">SHA-256</option>
                <option value="SHA-384">SHA-384</option>
                <option value="SHA-512">SHA-512</option>
                <option value="SHA-1">SHA-1</option>
              </select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-end px-1">
                <label htmlFor="hkdf-length-select" className="text-sm font-bold text-text-2">Output Length (Bits)</label>
              </div>
              <select
                id="hkdf-length-select"
                value={lengthBits}
                onChange={(e) => setLengthBits(Number(e.target.value))}
                className="w-full px-4 py-3 bg-bg border border-divider rounded-input outline-none transition-all min-h-12 text-text-primary text-body focus:ring-4 focus:ring-inset focus:ring-primary/10 focus:border-primary"
              >
                <option value={128}>128 bits (16 bytes)</option>
                <option value={256}>256 bits (32 bytes)</option>
                <option value={512}>512 bits (64 bytes)</option>
              </select>
            </div>

            <ToolInput
              id="hkdf-salt-input"
              label="Salt Parameter"
              value={salt}
              onChange={setSalt}
            />

            <ToolInput
              id="hkdf-info-input"
              label="Context Info (Info)"
              value={info}
              onChange={setInfo}
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
        </div>
      }
      output={
        (hexResult || b64Result) ? (
          <div className="space-y-6 flex flex-col h-full">
            {hexResult && (
              <ToolResultArea
                label="Hex Encoded HKDF Key"
                value={hexResult}
              />
            )}
            {b64Result && (
              <ToolResultArea
                label="Base64 Encoded HKDF Key"
                value={b64Result}
              />
            )}
          </div>
        ) : undefined
      }
    />
  );
}
