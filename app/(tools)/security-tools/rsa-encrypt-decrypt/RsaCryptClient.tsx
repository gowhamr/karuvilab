"use client";

import { useState, useCallback } from "react";
import { CopyButton } from "@/components/ui/CopyButton";
import { workerManager } from "@/src/workers/manager";
import { Lock, Unlock, Key, ShieldCheck, AlertCircle } from "lucide-react";

export default function RsaCryptClient() {
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [text, setText] = useState("");
  const [keyPem, setKeyPem] = useState("");
  const [hash, setHash] = useState<'SHA-256' | 'SHA-512'>('SHA-256');
  const [result, setResult] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleProcess = useCallback(async () => {
    if (!text.trim() || !keyPem.trim()) {
      setError("Text and Key PEM are required");
      return;
    }
    if (text.length > 5 * 1024 * 1024) {
      setError("Input text is too large. Maximum size is 5MB.");
      return;
    }
    if (keyPem.length > 1 * 1024 * 1024) {
      setError("Key PEM is too large. Maximum size is 1MB.");
      return;
    }
    setIsProcessing(true);
    setError(null);
    setResult("");

    try {
      if (mode === 'encrypt') {
        const cipher = await workerManager.run('rsaEncrypt', [text, keyPem, hash]);
        setResult(cipher);
      } else {
        const plain = await workerManager.run('rsaDecrypt', [text, keyPem, hash]);
        setResult(plain);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : `RSA ${mode} operation failed. Verify PEM key and format.`);
    } finally {
      setIsProcessing(false);
    }
  }, [mode, text, keyPem, hash]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-surface-2 rounded-xl border border-border w-fit">
        <button
          id="rsa-tab-encrypt"
          onClick={() => { setMode('encrypt'); setError(null); setResult(""); }}
          className={`px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 transition ${
            mode === 'encrypt' ? 'bg-primary text-white' : 'text-text-muted hover:text-text'
          }`}
        >
          <Lock className="w-4 h-4" />
          Encrypt with Public Key
        </button>
        <button
          id="rsa-tab-decrypt"
          onClick={() => { setMode('decrypt'); setError(null); setResult(""); }}
          className={`px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 transition ${
            mode === 'decrypt' ? 'bg-primary text-white' : 'text-text-muted hover:text-text'
          }`}
        >
          <Unlock className="w-4 h-4" />
          Decrypt with Private Key
        </button>
      </div>

      {/* Key & Config */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-1">
          <label className="text-xs font-semibold text-text-muted">
            {mode === 'encrypt' ? 'Public Key (SPKI PEM):' : 'Private Key (PKCS#8 PEM):'}
          </label>
          <textarea
            id="rsa-key-pem-input"
            rows={5}
            placeholder={mode === 'encrypt' ? '-----BEGIN PUBLIC KEY-----\n...' : '-----BEGIN PRIVATE KEY-----\n...'}
            value={keyPem}
            onChange={(e) => setKeyPem(e.target.value)}
            className="w-full p-3 rounded-xl bg-surface border border-border font-mono text-xs focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-text-muted block mb-1">OAEP Hash Algorithm</label>
          <select
            id="rsa-crypt-hash-select"
            value={hash}
            onChange={(e) => setHash(e.target.value as any)}
            className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm font-medium"
          >
            <option value="SHA-256">SHA-256</option>
            <option value="SHA-512">SHA-512</option>
          </select>
        </div>
      </div>

      {/* Text Input */}
      <div className="space-y-1">
        <label className="text-sm font-semibold text-text">
          {mode === 'encrypt' ? 'Plaintext to Encrypt:' : 'Base64 Ciphertext to Decrypt:'}
        </label>
        <textarea
          id="rsa-crypt-text-input"
          rows={4}
          placeholder={mode === 'encrypt' ? 'Enter text...' : 'Paste Base64 ciphertext...'}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-4 rounded-xl bg-surface border border-border font-mono text-sm focus:outline-none"
        />
      </div>

      <button
        id="rsa-crypt-submit-btn"
        onClick={handleProcess}
        disabled={isProcessing}
        className="w-full py-3 rounded-xl bg-primary text-white font-bold text-base flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition shadow-lg shadow-primary/20"
      >
        {mode === 'encrypt' ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
        {isProcessing ? 'Processing...' : mode === 'encrypt' ? 'RSA Encrypt' : 'RSA Decrypt'}
      </button>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-text flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              {mode === 'encrypt' ? 'Encrypted Base64 Output:' : 'Decrypted Plaintext Output:'}
            </label>
            <CopyButton text={result} />
          </div>
          <textarea
            id="rsa-crypt-result-output"
            readOnly
            rows={4}
            value={result}
            className="w-full p-4 rounded-xl bg-surface border border-border font-mono text-sm text-emerald-300 focus:outline-none"
          />
        </div>
      )}
    </div>
  );
}
