"use client";

import { useState, useCallback } from "react";
import { workerManager } from "@/src/workers/manager";
import { RefreshCw } from "lucide-react";
import { blobManager } from "@/src/lib/blob-manager";
import { ToolWorkspace } from "@/components/ui/ToolWorkspace";
import { ToolResultArea } from "@/components/ui/ToolResultArea";

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

  const optionsPanel = (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-text-2">Key Size</label>
          <select
            id="rsa-modulus-select"
            value={modulusLength}
            onChange={(e) => setModulusLength(Number(e.target.value) as ModulusLength)}
            className="w-full px-4 py-3 bg-bg border border-border rounded-xl text-text focus:outline-none focus:border-blue transition-colors"
          >
            <option value={1024}>1024-bit (Legacy / Fast)</option>
            <option value={2048}>2048-bit (Standard)</option>
            <option value={3072}>3072-bit (Strong)</option>
            <option value={4096}>4096-bit (Maximum Security)</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-text-2">Digest Hash</label>
          <select
            id="rsa-hash-select"
            value={hash}
            onChange={(e) => setHash(e.target.value as any)}
            className="w-full px-4 py-3 bg-bg border border-border rounded-xl text-text focus:outline-none focus:border-blue transition-colors"
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
        className="w-full px-5 py-3 rounded-xl bg-blue text-white font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition shadow-md"
      >
        <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
        {isGenerating ? 'Generating Keypair...' : 'Generate RSA Keypair'}
      </button>
    </div>
  );

  const outputArea = (
    <div className="space-y-4 h-full flex flex-col">
      {error && (
        <div className="p-4 rounded-xl bg-error/5 border border-error/20 text-error text-sm font-medium">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-[300px]">
        <ToolResultArea
          label="Public Key (SPKI PEM)"
          value={publicKeyPem}
          onDownload={publicKeyPem ? () => handleDownload(publicKeyPem, `rsa-${modulusLength}-public.pem`) : undefined}
          contentClassName="h-full min-h-[250px]"
        />
        <ToolResultArea
          label="Private Key (PKCS#8 PEM)"
          value={privateKeyPem}
          onDownload={privateKeyPem ? () => handleDownload(privateKeyPem, `rsa-${modulusLength}-private.pem`) : undefined}
          contentClassName="h-full min-h-[250px]"
        />
      </div>
    </div>
  );

  return (
    <ToolWorkspace
      layout="stacked"
      optionsPanel={optionsPanel}
      output={outputArea}
    />
  );
}
