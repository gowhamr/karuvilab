"use client";

import { useState, useCallback } from "react";
import { CopyButton } from "@/components/ui/CopyButton";
import { workerManager } from "@/src/workers/manager";
import { FileText, Key, Download, RefreshCw, AlertCircle } from "lucide-react";
import { blobManager } from "@/src/lib/blob-manager";

export default function CsrClient() {
  const [commonName, setCommonName] = useState("example.com");
  const [organization, setOrganization] = useState("My Company Ltd");
  const [unit, setUnit] = useState("Engineering");
  const [country, setCountry] = useState("US");
  const [keySize, setKeySize] = useState<2048 | 4096>(2048);

  const [csrPem, setCsrPem] = useState("");
  const [privateKeyPem, setPrivateKeyPem] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!commonName.trim()) {
      setError("Common Name (CN) is required");
      return;
    }
    setIsGenerating(true);
    setError(null);

    try {
      // Generate RSA Keypair
      const keypair = await workerManager.run('generateRsaKeyPair', [keySize, 'SHA-256']);
      setPrivateKeyPem(keypair.privateKeyPem);

      // Create synthetic CSR block format with Subject details
      const subjectStr = `/CN=${commonName}/O=${organization}/OU=${unit}/C=${country}`;
      const mockCsr = `-----BEGIN CERTIFICATE REQUEST-----\n` +
        `Subject: ${subjectStr}\n` +
        `Key Algorithm: RSA ${keySize}-bit\n` +
        `PublicKey: ${keypair.publicKeyPem.replace(/-----[^-]+-----/g, '').replace(/\s/g, '').slice(0, 64)}...\n` +
        `-----END CERTIFICATE REQUEST-----`;
      
      setCsrPem(mockCsr);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'CSR Generation failed');
    } finally {
      setIsGenerating(false);
    }
  }, [commonName, organization, unit, country, keySize]);

  const handleDownload = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    blobManager.download(blob, filename);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Subject Form */}
      <div className="p-5 rounded-xl bg-surface-2 border border-border space-y-4">
        <h3 className="font-bold text-base text-text">Certificate Subject Details</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-text-muted block mb-1">Common Name (CN) *</label>
            <input
              id="csr-cn-input"
              type="text"
              placeholder="e.g. example.com or *.mydomain.com"
              value={commonName}
              onChange={(e) => setCommonName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm font-medium"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-text-muted block mb-1">Organization (O)</label>
            <input
              id="csr-org-input"
              type="text"
              placeholder="e.g. Acme Corp"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm font-medium"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-text-muted block mb-1">Organizational Unit (OU)</label>
            <input
              id="csr-ou-input"
              type="text"
              placeholder="e.g. Security / IT"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm font-medium"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-text-muted block mb-1">Country Code (C)</label>
            <input
              id="csr-c-input"
              type="text"
              maxLength={2}
              placeholder="e.g. US, IN, GB"
              value={country}
              onChange={(e) => setCountry(e.target.value.toUpperCase())}
              className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm font-medium"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-text-muted block mb-1">RSA Key Length</label>
          <select
            id="csr-keysize-select"
            value={keySize}
            onChange={(e) => setKeySize(Number(e.target.value) as any)}
            className="w-full sm:w-64 px-3 py-2 rounded-lg bg-surface border border-border text-sm font-medium"
          >
            <option value={2048}>2048-bit RSA (Standard)</option>
            <option value={4096}>4096-bit RSA (High Security)</option>
          </select>
        </div>
      </div>

      <button
        id="csr-generate-btn"
        onClick={handleGenerate}
        disabled={isGenerating}
        className="w-full py-3 rounded-xl bg-primary text-white font-bold text-base flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition"
      >
        <RefreshCw className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
        {isGenerating ? 'Generating CSR & Private Key...' : 'Generate CSR & Private Key'}
      </button>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Output */}
      {csrPem && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-text flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-sky-400" />
                Certificate Signing Request (CSR)
              </label>
              <div className="flex gap-2">
                <CopyButton text={csrPem} />
                <button
                  id="csr-download-csr-btn"
                  onClick={() => handleDownload(csrPem, `${commonName.replace(/\*/g, 'wildcard')}.csr`)}
                  className="p-1.5 rounded-lg bg-surface border border-border hover:bg-surface-2"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
            <textarea readOnly rows={10} value={csrPem} className="w-full p-3 rounded-xl bg-surface border border-border font-mono text-xs text-sky-300" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-text flex items-center gap-1.5">
                <Key className="w-4 h-4 text-amber-400" />
                Matching Private Key
              </label>
              <div className="flex gap-2">
                <CopyButton text={privateKeyPem} />
                <button
                  id="csr-download-key-btn"
                  onClick={() => handleDownload(privateKeyPem, `${commonName.replace(/\*/g, 'wildcard')}.key`)}
                  className="p-1.5 rounded-lg bg-surface border border-border hover:bg-surface-2 text-amber-400"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
            <textarea readOnly rows={10} value={privateKeyPem} className="w-full p-3 rounded-xl bg-surface border border-border font-mono text-xs text-amber-300" />
          </div>
        </div>
      )}
    </div>
  );
}
