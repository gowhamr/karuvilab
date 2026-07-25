"use client";

import { useState, useCallback } from "react";
import { CopyButton } from "@/components/ui/CopyButton";
import { workerManager } from "@/src/workers/manager";
import { FileSignature, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

export default function RsaSignClient() {
  const [mode, setMode] = useState<'sign' | 'verify'>('sign');
  const [text, setText] = useState("");
  const [keyPem, setKeyPem] = useState("");
  const [signatureB64, setSignatureB64] = useState("");
  const [hash, setHash] = useState<'SHA-256' | 'SHA-512'>('SHA-256');
  const [verifyStatus, setVerifyStatus] = useState<boolean | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleProcess = useCallback(async () => {
    if (!text.trim() || !keyPem.trim()) {
      setError("Message and Key PEM are required");
      return;
    }
    if (text.length > 5 * 1024 * 1024) {
      setError("Input message is too large. Maximum size is 5MB.");
      return;
    }
    if (keyPem.length > 1 * 1024 * 1024) {
      setError("Key PEM is too large. Maximum size is 1MB.");
      return;
    }
    if (mode === 'verify') {
      if (!signatureB64.trim()) {
        setError("Signature Base64 is required for verification");
        return;
      }
      if (signatureB64.length > 1 * 1024 * 1024) {
        setError("Signature is too large. Maximum size is 1MB.");
        return;
      }
    }

    setIsProcessing(true);
    setError(null);
    setVerifyStatus(null);

    try {
      if (mode === 'sign') {
        const sig = await workerManager.run('rsaSign', [text, keyPem, hash]);
        setSignatureB64(sig);
      } else {
        const valid = await workerManager.run('rsaVerify', [text, signatureB64, keyPem, hash]);
        setVerifyStatus(valid);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : `RSA ${mode} operation failed.`);
    } finally {
      setIsProcessing(false);
    }
  }, [mode, text, keyPem, signatureB64, hash]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Mode Bar */}
      <div className="flex gap-2 p-1 bg-surface-2 rounded-xl border border-border w-fit">
        <button
          id="rsa-tab-sign"
          onClick={() => { setMode('sign'); setError(null); setVerifyStatus(null); }}
          className={`px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 transition ${
            mode === 'sign' ? 'bg-primary text-white' : 'text-text-muted hover:text-text'
          }`}
        >
          <FileSignature className="w-4 h-4" />
          Generate RSA Signature
        </button>
        <button
          id="rsa-tab-verify"
          onClick={() => { setMode('verify'); setError(null); setVerifyStatus(null); }}
          className={`px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 transition ${
            mode === 'verify' ? 'bg-primary text-white' : 'text-text-muted hover:text-text'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          Verify Signature
        </button>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-1">
          <label className="text-xs font-semibold text-text-muted">
            {mode === 'sign' ? 'Private Key (PKCS#8 PEM):' : 'Public Key (SPKI PEM):'}
          </label>
          <textarea
            id="rsa-sign-key-pem"
            rows={5}
            placeholder={mode === 'sign' ? '-----BEGIN PRIVATE KEY-----\n...' : '-----BEGIN PUBLIC KEY-----\n...'}
            value={keyPem}
            onChange={(e) => setKeyPem(e.target.value)}
            className="w-full p-3 rounded-xl bg-surface border border-border font-mono text-xs focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-text-muted block mb-1">Digest Hash Algorithm</label>
          <select
            id="rsa-sign-hash-select"
            value={hash}
            onChange={(e) => setHash(e.target.value as any)}
            className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm font-medium"
          >
            <option value="SHA-256">SHA-256</option>
            <option value="SHA-512">SHA-512</option>
          </select>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-semibold text-text">Message / Data to Sign or Verify:</label>
        <textarea
          id="rsa-sign-message-input"
          rows={4}
          placeholder="Type message content..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-4 rounded-xl bg-surface border border-border font-mono text-sm focus:outline-none"
        />
      </div>

      {mode === 'verify' && (
        <div className="space-y-1">
          <label className="text-sm font-semibold text-text">Base64 Signature to Verify:</label>
          <textarea
            id="rsa-verify-sig-input"
            rows={3}
            placeholder="Paste signature Base64 string..."
            value={signatureB64}
            onChange={(e) => setSignatureB64(e.target.value)}
            className="w-full p-3 rounded-xl bg-surface border border-border font-mono text-xs focus:outline-none"
          />
        </div>
      )}

      <button
        id="rsa-sign-submit-btn"
        onClick={handleProcess}
        disabled={isProcessing}
        className="w-full py-3 rounded-xl bg-primary text-white font-bold text-base flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition"
      >
        <FileSignature className="w-5 h-5" />
        {isProcessing ? 'Processing...' : mode === 'sign' ? 'Generate Signature' : 'Verify Signature'}
      </button>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Sign Output */}
      {mode === 'sign' && signatureB64 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-text">Base64 RSA Signature Output:</label>
            <CopyButton text={signatureB64} />
          </div>
          <textarea
            id="rsa-sign-output"
            readOnly
            rows={3}
            value={signatureB64}
            className="w-full p-3 rounded-xl bg-surface border border-border font-mono text-xs text-sky-300 focus:outline-none"
          />
        </div>
      )}

      {/* Verify Output */}
      {mode === 'verify' && verifyStatus !== null && (
        <div className={`p-4 rounded-xl border flex items-center gap-3 ${
          verifyStatus ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          {verifyStatus ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
          <div>
            <h4 className="font-bold text-base">{verifyStatus ? "VALID SIGNATURE" : "INVALID SIGNATURE"}</h4>
            <p className="text-xs opacity-90">
              {verifyStatus
                ? "The signature matches the provided message and public key digest."
                : "The signature could not be verified with this public key or the message was tampered with."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
