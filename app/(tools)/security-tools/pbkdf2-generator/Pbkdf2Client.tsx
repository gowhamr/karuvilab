"use client";

import { useState, useCallback } from "react";
import { workerManager } from "@/src/workers/manager";
import { Zap, AlertCircle } from "lucide-react";
import { ToolWorkspace } from "@/components/ui/ToolWorkspace";
import { ToolInput } from "@/components/ui/ToolInput";
import { ToolResultArea } from "@/components/ui/ToolResultArea";

export default function Pbkdf2Client() {
  const [password, setPassword] = useState("");
  const [salt, setSalt] = useState("karuvilab-salt");
  const [iterations, setIterations] = useState<number | "">(100000);
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
    if (password.length > 1 * 1024 * 1024) {
      setError("Password is too large. Maximum size is 1MB.");
      return;
    }
    if (salt.length > 1 * 1024 * 1024) {
      setError("Salt is too large. Maximum size is 1MB.");
      return;
    }
    if (typeof iterations !== 'number' || iterations < 1 || iterations > 10000000) {
      setError("Iterations must be between 1 and 10,000,000.");
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
    <ToolWorkspace
      input={
        <div className="space-y-4">
          <ToolInput
            id="pbkdf2-password-input"
            label="Password / Secret Material"
            type="password"
            placeholder="Enter password..."
            value={password}
            onChange={setPassword}
          />
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
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}
        </div>
      }
      optionsPanel={
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="pbkdf2-hash-select" className="text-sm font-bold text-text-2">Hash Algorithm</label>
            <select
              id="pbkdf2-hash-select"
              value={hash}
              onChange={(e) => setHash(e.target.value)}
              className="w-full px-4 py-3 bg-bg border border-divider rounded-input outline-none focus:border-primary focus:ring-4 focus:ring-inset focus:ring-primary/10 transition-all text-body text-text-primary"
            >
              <option value="SHA-256">SHA-256</option>
              <option value="SHA-384">SHA-384</option>
              <option value="SHA-512">SHA-512</option>
              <option value="SHA-1">SHA-1</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="pbkdf2-length-select" className="text-sm font-bold text-text-2">Output Length</label>
            <select
              id="pbkdf2-length-select"
              value={keyLengthBits}
              onChange={(e) => setKeyLengthBits(Number(e.target.value))}
              className="w-full px-4 py-3 bg-bg border border-divider rounded-input outline-none focus:border-primary focus:ring-4 focus:ring-inset focus:ring-primary/10 transition-all text-body text-text-primary"
            >
              <option value={128}>128 bits (16 bytes)</option>
              <option value={256}>256 bits (32 bytes)</option>
              <option value={512}>512 bits (64 bytes)</option>
            </select>
          </div>

          <ToolInput
            id="pbkdf2-iterations-input"
            label="Iterations"
            type="number"
            value={iterations.toString()}
            onChange={(val) => setIterations(val ? Number(val) : "")}
          />

          <ToolInput
            id="pbkdf2-salt-input"
            label="Salt String"
            value={salt}
            onChange={setSalt}
          />
        </div>
      }
      output={
        <div className="space-y-4 flex flex-col h-full">
          <ToolResultArea
            label="Hex Encoded Derived Key"
            value={hexResult}
            className="flex-1"
          />
          <ToolResultArea
            label="Base64 Encoded Derived Key"
            value={b64Result}
            className="flex-1"
          />
        </div>
      }
    />
  );
}
