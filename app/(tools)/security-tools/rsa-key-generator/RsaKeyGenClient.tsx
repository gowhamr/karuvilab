"use client";

import { useState, useCallback } from "react";
import { CopyButton } from "@/components/ui/CopyButton";
import { workerManager } from "@/src/workers/manager";
import { Key, Download, RefreshCw, ShieldAlert, CheckCircle2 } from "lucide-react";
import { blobManager } from "@/src/lib/blob-manager";

type ModulusLength = 1024 | 2048 | 3072 | 4096;

export default function RsaKeyGenClient() {
  const [modulusLength, setModulusLength] = useState<ModulusLength>(2048);
  const [hash, setHash] = useState<'SHA-256' | 'SHA-512'>('SHA-256');
  const [publicKeyPem, setPublicKeyPem] = useState("");
  const [privateKeyPem, setPrivateKeyPem] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true);
    setError(null);
    setPublicKeyPem("");
    setPrivateKeyPem("");

    try {
      const keys = await workerManager.run('generateRsaKeyPair', [modulusLength, hash]);
      setPublicKeyPem(keys.publicKeyPem);
      setPrivateKeyPem(keys.privateKeyPem);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'RSA keypair generation failed');
    } finally {
      setIsGenerating(false);
    }
  }, [modulusLength, hash]);

  const handleDownload = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'application/x-pem-file' });
    blobManager.download(blob, filename);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Settings */}
      <div className="p-4 rounded-xl bg-surface-2 border border-border flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="text-xs font-semibold text-text-muted block mb-1">Key Size</label>
            <select
              id="rsa-modulus-select"
              value={modulusLength}
              onChange={(e) => setModulusLength(Number(e.target.value) as ModulusLength)}
              className="px-3 py-1.5 rounded-lg bg-surface border border-border text-sm font-medium"
            >
              <option value={1024}>1024-bit (Legacy / Fast)</option>
              <option value={2048}>2048-bit (Standard)</option>
              <option value={3072}>3072-bit (Strong)</option>
              <option value={4096}>4096-bit (Maximum Security)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-text-muted block mb-1">Digest Hash</label>
            <select
              id="rsa-hash-select"
              value={hash}
              onChange={(e) => setHash(e.target.value as any)}
              className="px-3 py-1.5 rounded-lg bg-surface border border-border text-sm font-medium"
            >
              <option value="SHA-256">SHA-256</option>
              <option value="SHA-512">SHA-512</option>
            </select>
          </div>
        </div>

        <button
          id="rsa-generate-btn"
          onClick={handleGenerate}
          disabled={isGenerating}
          className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-sm flex items-center gap-2 hover:opacity-90 disabled:opacity-50 transition shadow-md"
        >
          <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
          {isGenerating ? 'Generating Keypair...' : 'Generate RSA Keypair'}
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
          {error}
        </div>
      )}

      {/* Output Keys */}
      {(publicKeyPem || privateKeyPem) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Public Key */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-text flex items-center gap-1.5">
                <Key className="w-4 h-4 text-sky-400" />
                Public Key (SPKI PEM)
              </label>
              <div className="flex gap-2">
                <CopyButton text={publicKeyPem} />
                <button
                  id="rsa-download-public-btn"
                  onClick={() => handleDownload(publicKeyPem, `rsa-${modulusLength}-public.pem`)}
                  className="p-1.5 rounded-lg bg-surface border border-border hover:bg-surface-2"
                  title="Download Public Key"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
            <textarea
              id="rsa-public-key-output"
              readOnly
              rows={12}
              value={publicKeyPem}
              className="w-full p-3 rounded-xl bg-surface border border-border font-mono text-xs text-sky-300 focus:outline-none"
            />
          </div>

          {/* Private Key */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-text flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                Private Key (PKCS#8 PEM)
              </label>
              <div className="flex gap-2">
                <CopyButton text={privateKeyPem} />
                <button
                  id="rsa-download-private-btn"
                  onClick={() => handleDownload(privateKeyPem, `rsa-${modulusLength}-private.pem`)}
                  className="p-1.5 rounded-lg bg-surface border border-border hover:bg-surface-2 text-amber-400"
                  title="Download Private Key"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
            <textarea
              id="rsa-private-key-output"
              readOnly
              rows={12}
              value={privateKeyPem}
              className="w-full p-3 rounded-xl bg-surface border border-border font-mono text-xs text-amber-300 focus:outline-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}
