"use client";

import { useState, useCallback } from "react";
import { CopyButton } from "@/components/ui/CopyButton";
import { workerOrchestrator } from "@/src/engine/workers/WorkerOrchestrator";
import { Lock, Unlock, Key, Settings, ShieldCheck, AlertCircle, Eye, EyeOff, Info } from "lucide-react";

type KeyMode = "passphrase" | "rawkey";

function hexOrBase64ToHex(input: string): string {
  const clean = input.trim();
  // If it looks like hex already (only 0-9a-f, even length)
  if (/^[0-9a-fA-F]+$/.test(clean) && clean.length % 2 === 0) return clean;
  // Try base64
  try {
    const binary = atob(clean);
    return Array.from(binary).map(c => c.charCodeAt(0).toString(16).padStart(2, "0")).join("");
  } catch {
    return clean; // return as-is, worker will validate
  }
}

export default function AesClient() {
  const [action, setAction] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [inputText, setInputText] = useState("");
  const [keyMode, setKeyMode] = useState<KeyMode>("passphrase");
  const [password, setPassword] = useState("");
  const [rawKey, setRawKey] = useState("");
  const [rawKeyFormat, setRawKeyFormat] = useState<"hex" | "base64">("hex");
  const [customIv, setCustomIv] = useState("");
  const [showCustomIv, setShowCustomIv] = useState(false);
  const [mode, setMode] = useState<'GCM' | 'CBC'>('GCM');
  const [keySize, setKeySize] = useState<128 | 192 | 256>(256);
  const [result, setResult] = useState("");
  const [ivHex, setIvHex] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleProcess = useCallback(async () => {
    const isEncrypt = action === 'encrypt';

    if (!inputText.trim()) {
      setError("Please enter text to process");
      return;
    }

    const credential = keyMode === "passphrase" ? password : rawKey;
    if (!credential.trim()) {
      setError(keyMode === "passphrase" ? "Passphrase is required" : "Raw key (hex or base64) is required");
      return;
    }

    // For raw key mode, normalise to hex before passing to worker
    const isRawKey = keyMode === "rawkey";
    const keyForWorker = isRawKey ? hexOrBase64ToHex(credential) : credential;

    const ivForWorker = showCustomIv && customIv.trim() ? customIv.trim() : undefined;

    setIsProcessing(true);
    setError(null);
    setResult("");
    setIvHex(null);

    try {
      if (isEncrypt) {
        const res = await workerOrchestrator.run<{ ciphertextBase64: string; ivHex: string }>(
          "aesEncrypt",
          [inputText, keyForWorker, mode, keySize, isRawKey, ivForWorker]
        );
        setResult(res.ciphertextBase64);
        setIvHex(res.ivHex);
      } else {
        const plain = await workerOrchestrator.run<string>(
          "aesDecrypt",
          [inputText, keyForWorker, mode, keySize, isRawKey, ivForWorker]
        );
        setResult(plain);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : `AES ${action} failed. Check your key or ciphertext.`);
    } finally {
      setIsProcessing(false);
    }
  }, [action, inputText, keyMode, password, rawKey, mode, keySize, customIv, showCustomIv]);

  const switchAction = useCallback((a: 'encrypt' | 'decrypt') => {
    setAction(a);
    setError(null);
    setResult("");
    setIvHex(null);
  }, []);

  const keyBits = keySize;
  const ivLen = mode === 'GCM' ? 12 : 16;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Encrypt / Decrypt tabs */}
      <div className="flex gap-2 p-1 bg-surface-2 rounded-xl border border-border w-fit">
        <button
          id="aes-tab-encrypt"
          onClick={() => switchAction('encrypt')}
          className={`px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 transition ${
            action === 'encrypt' ? 'bg-primary text-white' : 'text-text-muted hover:text-text'
          }`}
        >
          <Lock className="w-4 h-4" />
          Encrypt
        </button>
        <button
          id="aes-tab-decrypt"
          onClick={() => switchAction('decrypt')}
          className={`px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 transition ${
            action === 'decrypt' ? 'bg-primary text-white' : 'text-text-muted hover:text-text'
          }`}
        >
          <Unlock className="w-4 h-4" />
          Decrypt
        </button>
      </div>

      {/* Config Row — Mode + Key Size */}
      <div className="p-4 rounded-xl bg-surface-2 border border-border grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
        <div>
          <label className="text-xs font-semibold text-text-muted block mb-1">AES Mode</label>
          <select
            id="aes-mode-select"
            value={mode}
            onChange={(e) => setMode(e.target.value as 'GCM' | 'CBC')}
            className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm font-medium"
          >
            <option value="GCM">AES-GCM (Authenticated — Recommended)</option>
            <option value="CBC">AES-CBC (Cipher Block Chaining)</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-text-muted block mb-1">Key Size</label>
          <select
            id="aes-keysize-select"
            value={keySize}
            onChange={(e) => setKeySize(Number(e.target.value) as 128 | 192 | 256)}
            className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm font-medium"
          >
            <option value={256}>256-bit (Strongest)</option>
            <option value={192}>192-bit</option>
            <option value={128}>128-bit</option>
          </select>
        </div>
      </div>

      {/* Key Mode toggle */}
      <div className="p-4 rounded-xl bg-surface-2 border border-border space-y-4">
        <div className="flex items-center gap-3">
          <Key className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-text">Key Input Mode</span>
          <div className="flex gap-1 p-0.5 bg-surface rounded-lg border border-border ml-auto">
            <button
              id="aes-keymode-passphrase"
              onClick={() => setKeyMode("passphrase")}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                keyMode === "passphrase" ? "bg-primary text-white" : "text-text-muted hover:text-text"
              }`}
            >
              Passphrase
            </button>
            <button
              id="aes-keymode-rawkey"
              onClick={() => setKeyMode("rawkey")}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                keyMode === "rawkey" ? "bg-primary text-white" : "text-text-muted hover:text-text"
              }`}
            >
              Raw Key (Hex/Base64)
            </button>
          </div>
        </div>

        {keyMode === "passphrase" ? (
          <div>
            <label className="text-xs font-semibold text-text-muted block mb-1">Passphrase</label>
            <input
              id="aes-password-input"
              type="password"
              placeholder="Enter passphrase (key derived via PBKDF2 / 600k iterations)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <label className="text-xs font-semibold text-text-muted block mb-1">
                  Raw AES Key ({keyBits / 8} bytes = {keyBits / 4} hex chars or {Math.ceil(keyBits / 6)} base64 chars)
                </label>
                <input
                  id="aes-rawkey-input"
                  type="text"
                  placeholder={rawKeyFormat === "hex"
                    ? `${keyBits / 4} hex chars e.g. 00112233...`
                    : `Base64-encoded ${keyBits / 8}-byte key`}
                  value={rawKey}
                  onChange={(e) => setRawKey(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <select
                id="aes-rawkey-format"
                value={rawKeyFormat}
                onChange={(e) => setRawKeyFormat(e.target.value as "hex" | "base64")}
                className="px-3 py-2 rounded-lg bg-surface border border-border text-sm font-medium"
              >
                <option value="hex">Hex</option>
                <option value="base64">Base64</option>
              </select>
            </div>
            <p className="text-xs text-text-muted flex items-center gap-1">
              <Info className="w-3 h-3 shrink-0" />
              Raw key is used directly — no key derivation. Keep it secret and store it securely.
            </p>
          </div>
        )}

        {/* IV Section */}
        <div className="border-t border-border pt-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-muted">
              Initialisation Vector (IV) — {ivLen} bytes for AES-{mode}
            </span>
            <button
              id="aes-custom-iv-toggle"
              onClick={() => setShowCustomIv(v => !v)}
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              {showCustomIv ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              {showCustomIv ? "Use auto-generated IV" : "Provide custom IV"}
            </button>
          </div>

          {showCustomIv ? (
            <div>
              <input
                id="aes-custom-iv-input"
                type="text"
                placeholder={`${ivLen * 2} hex chars (${ivLen} bytes) — required for decryption when IV was custom`}
                value={customIv}
                onChange={(e) => setCustomIv(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-text-muted mt-1 flex items-center gap-1">
                <Info className="w-3 h-3 shrink-0" />
                For encryption: leave blank to auto-generate. For decryption: paste the IV shown after encrypting.
              </p>
            </div>
          ) : (
            <p className="text-xs text-text-muted">
              IV will be auto-generated per encryption and shown in the result panel. Copy it for later decryption.
            </p>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-text">
          {action === 'encrypt' ? 'Plaintext Input:' : 'Base64 Ciphertext Input:'}
        </label>
        <textarea
          id="aes-text-input"
          rows={5}
          placeholder={action === 'encrypt' ? 'Type sensitive message here…' : 'Paste Base64 ciphertext string here…'}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="w-full p-4 rounded-xl bg-surface border border-border font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <button
        id="aes-submit-btn"
        onClick={handleProcess}
        disabled={isProcessing}
        className="w-full py-3 rounded-xl bg-primary text-white font-bold text-base flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition shadow-lg shadow-primary/20"
      >
        {action === 'encrypt' ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
        {isProcessing ? 'Processing…' : action === 'encrypt' ? 'Encrypt Text' : 'Decrypt Text'}
      </button>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-2" role="alert">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Output */}
      {result && (
        <div className="space-y-3">
          {/* IV display — always shown after encrypt */}
          {ivHex && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-amber-400">
                  IV (Initialisation Vector) — save this for decryption
                </span>
                <CopyButton text={ivHex} />
              </div>
              <p className="font-mono text-xs text-amber-300 break-all">{ivHex}</p>
              <p className="text-xs text-amber-400/70">
                When using raw key mode, you must provide this IV to decrypt. For passphrase mode, the IV is embedded in the ciphertext automatically.
              </p>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-text flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                {action === 'encrypt' ? 'Base64 Encrypted Result:' : 'Decrypted Plaintext:'}
              </label>
              <CopyButton text={result} />
            </div>
            <textarea
              id="aes-result-output"
              readOnly
              rows={5}
              value={result}
              className="w-full p-4 rounded-xl bg-surface border border-border font-mono text-sm text-emerald-300 focus:outline-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}
