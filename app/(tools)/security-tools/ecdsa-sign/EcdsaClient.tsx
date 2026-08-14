"use client";

import { useState, useCallback } from "react";
import { ToolWorkspace } from "@/components/ui/ToolWorkspace";
import { ToolInput } from "@/components/ui/ToolInput";
import { ToolResultArea } from "@/components/ui/ToolResultArea";
import { workerManager } from "@/src/workers/manager";
import { FileSignature, CheckCircle2, XCircle, RefreshCw, Key } from "lucide-react";

type Curve = 'P-256' | 'P-384' | 'P-521';
type Tab = 'generate' | 'sign' | 'verify';

export default function EcdsaClient() {
  const [activeTab, setActiveTab] = useState<Tab>('sign');
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
    setVerifyStatus(null);
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

  const renderInput = () => {
    if (activeTab === 'generate') {
      return (
        <div className="space-y-4">
          <p className="text-sm text-text-3">
            Select a curve in the options below and click Generate to create a new ECDSA keypair. The keys will be populated for signing and verifying.
          </p>
        </div>
      );
    }

    if (activeTab === 'sign') {
      return (
        <div className="space-y-4">
          <ToolInput
            label="Private Key (PKCS#8 PEM)"
            value={privateKeyPem}
            onChange={setPrivateKeyPem}
            placeholder={"-----BEGIN PRIVATE KEY-----\n..."}
            rows={6}
            mono
            id="ecdsa-privkey-input"
          />
          <ToolInput
            label="Message Data"
            value={message}
            onChange={setMessage}
            placeholder="Enter message to sign..."
            rows={4}
            mono
            id="ecdsa-message-sign-input"
          />
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <ToolInput
          label="Public Key (SPKI PEM)"
          value={publicKeyPem}
          onChange={setPublicKeyPem}
          placeholder={"-----BEGIN PUBLIC KEY-----\n..."}
          rows={5}
          mono
          id="ecdsa-pubkey-input"
        />
        <ToolInput
          label="Message Data"
          value={message}
          onChange={setMessage}
          placeholder="Enter message to verify..."
          rows={3}
          mono
          id="ecdsa-message-verify-input"
        />
        <ToolInput
          label="Signature (Base64)"
          value={signatureB64}
          onChange={setSignatureB64}
          placeholder="Enter ECDSA signature..."
          rows={3}
          mono
          id="ecdsa-sig-input"
        />
      </div>
    );
  };

  const renderOptions = () => {
    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <label className="text-sm font-bold text-text-2">Elliptic Curve:</label>
            <select
              id="ecdsa-curve-select"
              value={curve}
              onChange={(e) => setCurve(e.target.value as Curve)}
              className="px-3 py-2 rounded-xl bg-bg border border-divider text-sm font-medium focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all"
            >
              <option value="P-256">NIST P-256 (secp256r1 - Standard)</option>
              <option value="P-384">NIST P-384 (secp384r1 - High)</option>
              <option value="P-521">NIST P-521 (Maximum)</option>
            </select>
          </div>
          
          {activeTab === 'generate' && (
            <button
              id="ecdsa-genkeys-btn"
              onClick={handleGenKeys}
              disabled={isProcessing}
              className="px-4 py-2 rounded-xl bg-primary text-white font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              <RefreshCw className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
              Generate EC Keypair
            </button>
          )}
          {activeTab === 'sign' && (
            <button
              id="ecdsa-sign-btn"
              onClick={handleSign}
              disabled={isProcessing}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              <FileSignature className="w-5 h-5" />
              Sign Message
            </button>
          )}
          {activeTab === 'verify' && (
            <button
              id="ecdsa-verify-btn"
              onClick={handleVerify}
              disabled={isProcessing}
              className="px-4 py-2 rounded-xl bg-sky-600 text-white font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              <CheckCircle2 className="w-5 h-5" />
              Verify Signature
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderOutput = () => {
    if (activeTab === 'generate') {
      return (
        <div className="flex flex-col space-y-4 h-full">
          <ToolResultArea
            label="Private Key (PKCS#8 PEM)"
            value={privateKeyPem}
            error={error || undefined}
            onClear={() => setPrivateKeyPem("")}
            className="flex-1"
          />
          <ToolResultArea
            label="Public Key (SPKI PEM)"
            value={publicKeyPem}
            onClear={() => setPublicKeyPem("")}
            className="flex-1"
          />
        </div>
      );
    }

    if (activeTab === 'sign') {
      return (
        <div className="flex flex-col h-full">
          <ToolResultArea
            label="Base64 ECDSA Signature"
            value={signatureB64}
            error={error || undefined}
            onClear={() => setSignatureB64("")}
            className="flex-1"
          />
        </div>
      );
    }

    return (
      <div className="flex flex-col h-full space-y-4">
        {error ? (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium">
            {error}
          </div>
        ) : verifyStatus === null ? (
          <div className="flex-1 flex items-center justify-center border border-dashed border-border rounded-xl p-8 text-text-4 text-sm text-center">
            Click "Verify Signature" to check if the signature is valid.
          </div>
        ) : (
          <div className={`flex-1 p-6 rounded-xl border flex flex-col items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-2 ${
            verifyStatus ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-red-500/10 border-red-500/20 text-red-500'
          }`}>
            {verifyStatus ? <CheckCircle2 className="w-16 h-16" /> : <XCircle className="w-16 h-16" />}
            <div className="text-center">
              <h4 className="font-bold text-xl mb-1">{verifyStatus ? "VALID SIGNATURE" : "INVALID SIGNATURE"}</h4>
              <p className="text-sm opacity-90 max-w-sm">
                {verifyStatus
                  ? `The signature was cryptographically verified using curve ${curve}.`
                  : "Verification failed. The message, signature, or public key does not match."}
              </p>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <ToolWorkspace
      tabs={{
        options: [
          { id: 'generate', label: 'Generate Keys', icon: <Key className="w-4 h-4" /> },
          { id: 'sign', label: 'Sign', icon: <FileSignature className="w-4 h-4" /> },
          { id: 'verify', label: 'Verify', icon: <CheckCircle2 className="w-4 h-4" /> }
        ],
        activeId: activeTab,
        onChange: (id) => {
          setActiveTab(id as Tab);
          setError(null);
          setVerifyStatus(null);
        }
      }}
      input={renderInput()}
      optionsPanel={renderOptions()}
      output={renderOutput()}
    />
  );
}
