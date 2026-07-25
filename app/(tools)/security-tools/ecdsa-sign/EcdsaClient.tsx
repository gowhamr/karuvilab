"use client";

import { useState, useCallback } from "react";
import { CopyButton } from "@/components/ui/CopyButton";
import { workerManager } from "@/src/workers/manager";
import { Key, FileSignature, CheckCircle2, XCircle, RefreshCw, AlertCircle } from "lucide-react";

type Curve = 'P-256' | 'P-384' | 'P-521';

export default function EcdsaClient() {
  const [curve, setCurve] = useState<Curve>('P-256');
  const [publicKeyPem, setPublicKeyPem] = useState("");
  const [privateKeyPem, setPrivateKeyPem] = useState("");
  const [message, setMessage] = useState("");
  const [signatureB64, setSignatureB64] = useState("");
  const [verifyStatus, setVerifyStatus] = useState<boolean | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenKeys = useCallback(async () => {
    setIsProcessing(true);
    setError(null);
    try {
      const keys = await workerManager.run('ecdsaGenerateKeyPair', [curve]);
      setPublicKeyPem(keys.publicKeyPem);
      setPrivateKeyPem(keys.privateKeyPem);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ECDSA KeyGen failed');
    } finally {
      setIsProcessing(false);
    }
  }, [curve]);

  const handleSign = useCallback(async () => {
    if (!message.trim() || !privateKeyPem.trim()) {
      setError("Message and Private Key PEM required");
      return;
    }
    if (message.length > 5 * 1024 * 1024) {
      setError("Input message is too large. Maximum size is 5MB.");
      return;
    }
    if (privateKeyPem.length > 1 * 1024 * 1024) {
      setError("Key PEM is too large. Maximum size is 1MB.");
      return;
    }
    setIsProcessing(true);
    setError(null);
    try {
      const sig = await workerManager.run('ecdsaSign', [message, privateKeyPem, curve]);
      setSignatureB64(sig);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ECDSA signing failed');
    } finally {
      setIsProcessing(false);
    }
  }, [message, privateKeyPem, curve]);

  const handleVerify = useCallback(async () => {
    if (!message.trim() || !signatureB64.trim() || !publicKeyPem.trim()) {
      setError("Message, Signature, and Public Key required for verification");
      return;
    }
    if (message.length > 5 * 1024 * 1024) {
      setError("Input message is too large. Maximum size is 5MB.");
      return;
    }
    if (publicKeyPem.length > 1 * 1024 * 1024) {
      setError("Key PEM is too large. Maximum size is 1MB.");
      return;
    }
    if (signatureB64.length > 1 * 1024 * 1024) {
      setError("Signature is too large. Maximum size is 1MB.");
      return;
    }
    setIsProcessing(true);
    setError(null);
    setVerifyStatus(null);
    try {
      const valid = await workerManager.run('ecdsaVerify', [message, signatureB64, publicKeyPem, curve]);
      setVerifyStatus(valid);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ECDSA verification failed');
    } finally {
      setIsProcessing(false);
    }
  }, [message, signatureB64, publicKeyPem, curve]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Config Bar */}
      <div className="p-4 rounded-xl bg-surface-2 border border-border flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-3">
          <label className="text-sm font-semibold text-text">Elliptic Curve:</label>
          <select
            id="ecdsa-curve-select"
            value={curve}
            onChange={(e) => setCurve(e.target.value as Curve)}
            className="px-3 py-1.5 rounded-lg bg-surface border border-border text-sm font-medium"
          >
            <option value="P-256">NIST P-256 (secp256r1 - Standard)</option>
            <option value="P-384">NIST P-384 (secp384r1 - High)</option>
            <option value="P-521">NIST P-521 (Maximum)</option>
          </select>
        </div>

        <button
          id="ecdsa-genkeys-btn"
          onClick={handleGenKeys}
          disabled={isProcessing}
          className="px-4 py-2 rounded-xl bg-primary text-white font-semibold text-sm flex items-center gap-2 hover:opacity-90 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
          Generate EC Keypair
        </button>
      </div>

      {/* Key Display / Input */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-text-muted">Public Key (SPKI PEM):</label>
          <textarea
            id="ecdsa-pubkey-input"
            rows={5}
            placeholder="-----BEGIN PUBLIC KEY-----\n..."
            value={publicKeyPem}
            onChange={(e) => setPublicKeyPem(e.target.value)}
            className="w-full p-3 rounded-xl bg-surface border border-border font-mono text-xs focus:outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-text-muted">Private Key (PKCS#8 PEM):</label>
          <textarea
            id="ecdsa-privkey-input"
            rows={5}
            placeholder="-----BEGIN PRIVATE KEY-----\n..."
            value={privateKeyPem}
            onChange={(e) => setPrivateKeyPem(e.target.value)}
            className="w-full p-3 rounded-xl bg-surface border border-border font-mono text-xs focus:outline-none"
          />
        </div>
      </div>

      {/* Message Input */}
      <div className="space-y-1">
        <label className="text-sm font-semibold text-text">Message Data:</label>
        <textarea
          id="ecdsa-message-input"
          rows={3}
          placeholder="Enter message to sign or verify..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-3 rounded-xl bg-surface border border-border font-mono text-sm focus:outline-none"
        />
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          id="ecdsa-sign-btn"
          onClick={handleSign}
          disabled={isProcessing}
          className="py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50"
        >
          <FileSignature className="w-4 h-4" />
          Sign Message with Private Key
        </button>

        <button
          id="ecdsa-verify-btn"
          onClick={handleVerify}
          disabled={isProcessing}
          className="py-2.5 rounded-xl bg-sky-600 text-white font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50"
        >
          <CheckCircle2 className="w-4 h-4" />
          Verify Message with Public Key
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Output Signature */}
      {signatureB64 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-text">Base64 ECDSA Signature:</label>
            <CopyButton text={signatureB64} />
          </div>
          <textarea
            id="ecdsa-sig-output"
            readOnly
            rows={3}
            value={signatureB64}
            onChange={(e) => setSignatureB64(e.target.value)}
            className="w-full p-3 rounded-xl bg-surface border border-border font-mono text-xs text-emerald-300 focus:outline-none"
          />
        </div>
      )}

      {/* Verify Result */}
      {verifyStatus !== null && (
        <div className={`p-4 rounded-xl border flex items-center gap-3 ${
          verifyStatus ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          {verifyStatus ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
          <div>
            <h4 className="font-bold text-base">{verifyStatus ? "VALID ECDSA SIGNATURE" : "INVALID ECDSA SIGNATURE"}</h4>
            <p className="text-xs opacity-90">
              {verifyStatus
                ? "The signature was cryptographically verified using curve " + curve
                : "Verification failed. The message or public key does not match."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
