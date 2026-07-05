"use client";

import { useState, useCallback } from "react";
import { CopyButton } from "@/components/ui/CopyButton";
import { workerManager } from "@/src/workers/manager";
import { Lock, Unlock, Key, Settings, ShieldCheck, AlertCircle } from "lucide-react";

export default function AesClient() {
  const [action, setAction] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [inputText, setInputText] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<'GCM' | 'CBC'>('GCM');
  const [keySize, setKeySize] = useState<128 | 192 | 256>(256);
  const [result, setResult] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleProcess = useCallback(async () => {
    if (!inputText.trim()) {
      setError("Please enter text to process");
      return;
    }
    if (!password) {
      setError("Password / Secret Key is required");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setResult("");

    try {
      if (action === 'encrypt') {
        const cipher = await workerManager.run('aesEncrypt', [inputText, password, mode, keySize]);
        setResult(cipher);
      } else {
        const plain = await workerManager.run('aesDecrypt', [inputText, password, mode, keySize]);
        setResult(plain);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : `AES ${action} failed. Check your password or ciphertext format.`);
    } finally {
      setIsProcessing(false);
    }
  }, [action, inputText, password, mode, keySize]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-surface-2 rounded-xl border border-border w-fit">
        <button
          id="aes-tab-encrypt"
          onClick={() => { setAction('encrypt'); setError(null); setResult(""); }}
          className={`px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 transition ${
            action === 'encrypt' ? 'bg-primary text-white' : 'text-text-muted hover:text-text'
          }`}
        >
          <Lock className="w-4 h-4" />
          Encrypt
        </button>
        <button
          id="aes-tab-decrypt"
          onClick={() => { setAction('decrypt'); setError(null); setResult(""); }}
          className={`px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 transition ${
            action === 'decrypt' ? 'bg-primary text-white' : 'text-text-muted hover:text-text'
          }`}
        >
          <Unlock className="w-4 h-4" />
          Decrypt
        </button>
      </div>

      {/* Config Row */}
      <div className="p-4 rounded-xl bg-surface-2 border border-border grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
        <div>
          <label className="text-xs font-semibold text-text-muted block mb-1">AES Mode</label>
          <select
            id="aes-mode-select"
            value={mode}
            onChange={(e) => setMode(e.target.value as any)}
            className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm font-medium"
          >
            <option value="GCM">AES-GCM (Authenticated - Recommended)</option>
            <option value="CBC">AES-CBC (Cipher Block Chaining)</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-text-muted block mb-1">Key Size</label>
          <select
            id="aes-keysize-select"
            value={keySize}
            onChange={(e) => setKeySize(Number(e.target.value) as any)}
            className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm font-medium"
          >
            <option value={256}>256-bit (Strongest)</option>
            <option value={192}>192-bit</option>
            <option value={128}>128-bit</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-text-muted block mb-1">Passphrase / Secret Key</label>
          <input
            id="aes-password-input"
            type="password"
            placeholder="Enter passphrase"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm font-medium"
          />
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
          placeholder={action === 'encrypt' ? 'Type sensitive message here...' : 'Paste Base64 ciphertext string here...'}
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
        {isProcessing ? 'Processing...' : action === 'encrypt' ? 'Encrypt Text' : 'Decrypt Text'}
      </button>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Output Area */}
      {result && (
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
      )}
    </div>
  );
}
