"use client";

import { useState, useCallback } from "react";
import { workerManager } from "@/src/workers/manager";
import { Lock, Unlock } from "lucide-react";
import { ToolWorkspace } from "@/components/ui/ToolWorkspace";
import { ToolInput } from "@/components/ui/ToolInput";
import { ToolResultArea } from "@/components/ui/ToolResultArea";
import { Button } from "@/components/ui/Button";

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
    <ToolWorkspace
      tabs={{
        options: [
          { id: 'encrypt', label: 'Encrypt with Public Key', icon: <Lock className="w-4 h-4" /> },
          { id: 'decrypt', label: 'Decrypt with Private Key', icon: <Unlock className="w-4 h-4" /> }
        ],
        activeId: mode,
        onChange: (id) => { 
          setMode(id as 'encrypt' | 'decrypt'); 
          setError(null); 
          setResult(""); 
        }
      }}
      input={
        <div className="space-y-4">
          <ToolInput
            id="rsa-crypt-text-input"
            label={mode === 'encrypt' ? 'Plaintext to Encrypt' : 'Base64 Ciphertext to Decrypt'}
            placeholder={mode === 'encrypt' ? 'Enter text...' : 'Paste Base64 ciphertext...'}
            value={text}
            onChange={setText}
            rows={4}
            mono
          />
          <Button
            id="rsa-crypt-submit-btn"
            onClick={handleProcess}
            disabled={isProcessing}
            loading={isProcessing}
            className="w-full"
            size="lg"
          >
            {mode === 'encrypt' ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
            {mode === 'encrypt' ? 'RSA Encrypt' : 'RSA Decrypt'}
          </Button>
        </div>
      }
      optionsPanel={
        <div className="space-y-4">
          <ToolInput
            id="rsa-key-pem-input"
            label={mode === 'encrypt' ? 'Public Key (SPKI PEM)' : 'Private Key (PKCS#8 PEM)'}
            placeholder={mode === 'encrypt' ? '-----BEGIN PUBLIC KEY-----\n...' : '-----BEGIN PRIVATE KEY-----\n...'}
            value={keyPem}
            onChange={setKeyPem}
            rows={5}
            mono
          />
          <div className="space-y-2">
            <label className="text-sm font-bold text-text-2">OAEP Hash Algorithm</label>
            <select
              id="rsa-crypt-hash-select"
              value={hash}
              onChange={(e) => setHash(e.target.value as any)}
              className="w-full px-4 py-3 bg-bg border border-divider rounded-input text-body text-text-primary focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all"
            >
              <option value="SHA-256">SHA-256</option>
              <option value="SHA-512">SHA-512</option>
            </select>
          </div>
        </div>
      }
      output={
        <ToolResultArea
          label={mode === 'encrypt' ? 'Encrypted Base64 Output' : 'Decrypted Plaintext Output'}
          value={result}
          error={error || undefined}
          onClear={() => { setResult(""); setError(null); }}
        />
      }
    />
  );
}
