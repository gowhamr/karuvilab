"use client";

import { useState, useCallback } from "react";
import { workerManager } from "@/src/workers/manager";
import { FileSignature, CheckCircle2, XCircle } from "lucide-react";
import { ToolWorkspace } from "@/components/ui/ToolWorkspace";
import { ToolInput } from "@/components/ui/ToolInput";
import { ToolResultArea } from "@/components/ui/ToolResultArea";

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

  const tabs = {
    options: [
      { id: 'sign', label: 'Generate Signature', icon: <FileSignature className="w-4 h-4" /> },
      { id: 'verify', label: 'Verify Signature', icon: <CheckCircle2 className="w-4 h-4" /> }
    ],
    activeId: mode,
    onChange: (id: 'sign' | 'verify') => {
      setMode(id);
      setError(null);
      setVerifyStatus(null);
    }
  };

  const inputPanel = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <ToolInput
            id="rsa-sign-key-pem"
            label={mode === 'sign' ? 'Private Key (PKCS#8 PEM)' : 'Public Key (SPKI PEM)'}
            placeholder={mode === 'sign' ? '-----BEGIN PRIVATE KEY-----\n...' : '-----BEGIN PUBLIC KEY-----\n...'}
            value={keyPem}
            onChange={setKeyPem}
            rows={5}
            mono
          />
        </div>
        <div>
          <label className="text-sm font-bold text-text-2 mb-2 block">Digest Hash Algorithm</label>
          <select
            id="rsa-sign-hash-select"
            value={hash}
            onChange={(e) => setHash(e.target.value as any)}
            className="w-full px-4 py-3 bg-bg border border-divider rounded-input text-body text-text-primary focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
          >
            <option value="SHA-256">SHA-256</option>
            <option value="SHA-512">SHA-512</option>
          </select>
        </div>
      </div>

      <ToolInput
        id="rsa-sign-message-input"
        label="Message / Data to Sign or Verify"
        placeholder="Type message content..."
        value={text}
        onChange={setText}
        rows={4}
        mono
      />

      {mode === 'verify' && (
        <ToolInput
          id="rsa-verify-sig-input"
          label="Base64 Signature to Verify"
          placeholder="Paste signature Base64 string..."
          value={signatureB64}
          onChange={setSignatureB64}
          rows={3}
          mono
        />
      )}

      {error && (
        <div role="alert" className="w-full px-4 py-3 bg-danger/5 border border-danger/20 rounded-xl text-danger text-sm font-medium">
          {error}
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
    </div>
  );

  const outputPanel = mode === 'sign' ? (
    <ToolResultArea
      label="Base64 RSA Signature"
      value={signatureB64}
      onClear={() => setSignatureB64("")}
    />
  ) : (
    <div className="flex flex-col h-full space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="text-sm font-bold text-text-2">Verification Result</div>
      {verifyStatus !== null ? (
        <div className={`p-6 rounded-xl border flex items-center gap-4 flex-1 ${
          verifyStatus ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400'
        }`}>
          {verifyStatus ? <CheckCircle2 className="w-8 h-8 flex-shrink-0" /> : <XCircle className="w-8 h-8 flex-shrink-0" />}
          <div>
            <h4 className="font-bold text-lg mb-1">{verifyStatus ? "VALID SIGNATURE" : "INVALID SIGNATURE"}</h4>
            <p className="text-sm opacity-90">
              {verifyStatus
                ? "The signature matches the provided message and public key digest."
                : "The signature could not be verified with this public key or the message was tampered with."}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 border border-border rounded-xl flex items-center justify-center p-6 text-text-muted italic text-sm">
          Run verification to see result here...
        </div>
      )}
    </div>
  );

  return (
    <ToolWorkspace
      tabs={tabs as any}
      input={inputPanel}
      output={outputPanel}
    />
  );
}
