"use client";

import { useState, useCallback } from "react";
import { CopyButton } from "@/components/ui/CopyButton";
import { workerManager } from "@/src/workers/manager";
import { FileText, Key, Download, RefreshCw, AlertCircle } from "lucide-react";
import { blobManager } from "@/src/lib/blob-manager";

function concat(...arrays: Uint8Array[]): Uint8Array {
  const totalLength = arrays.reduce((sum, arr) => sum + arr.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const arr of arrays) {
    result.set(arr, offset);
    offset += arr.length;
  }
  return result;
}

function derEncode(tag: number, value: Uint8Array): Uint8Array {
  let lenBytes: number[];
  const len = value.length;
  if (len < 128) {
    lenBytes = [len];
  } else {
    const bytes: number[] = [];
    let temp = len;
    while (temp > 0) {
      bytes.unshift(temp & 0xFF);
      temp = temp >> 8;
    }
    lenBytes = [0x80 | bytes.length, ...bytes];
  }
  const result = new Uint8Array(1 + lenBytes.length + len);
  result[0] = tag;
  result.set(lenBytes, 1);
  result.set(value, 1 + lenBytes.length);
  return result;
}

function makeRDN(oid: Uint8Array, valueStr: string): Uint8Array {
  const valueBytes = new TextEncoder().encode(valueStr);
  const valEncoded = derEncode(0x13, valueBytes); // PrintableString
  const oidEncoded = derEncode(0x06, oid); // OID
  const seq = derEncode(0x30, concat(oidEncoded, valEncoded));
  return derEncode(0x31, seq); // SET (0x31)
}

function arrayBufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
  let binary = "";
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]!);
  }
  return btoa(binary);
}

function formatPem(base64: string, header: string, footer: string): string {
  const matches = base64.match(/.{1,64}/g);
  const body = matches ? matches.join("\n") : base64;
  return `${header}\n${body}\n${footer}`;
}

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
      // 1. Generate RSA key pair via Web Crypto
      const keypair = await window.crypto.subtle.generateKey(
        {
          name: "RSASSA-PKCS1-v1_5",
          modulusLength: keySize,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: "SHA-256",
        },
        true,
        ["sign", "verify"]
      );

      // 2. Export SPKI and PKCS#8
      const spki = await window.crypto.subtle.exportKey("spki", keypair.publicKey);
      const pkcs8 = await window.crypto.subtle.exportKey("pkcs8", keypair.privateKey);

      // 3. Construct Subject Name SEQUENCE of SETs of AttributeTypeAndValue
      const rdns: Uint8Array[] = [];
      
      // Common Name (2.5.4.3)
      rdns.push(makeRDN(new Uint8Array([0x55, 0x04, 0x03]), commonName.trim()));
      
      // Organization (2.5.4.10)
      if (organization.trim()) {
        rdns.push(makeRDN(new Uint8Array([0x55, 0x04, 0x0A]), organization.trim()));
      }
      
      // Organizational Unit (2.5.4.11)
      if (unit.trim()) {
        rdns.push(makeRDN(new Uint8Array([0x55, 0x04, 0x0B]), unit.trim()));
      }
      
      // Country (2.5.4.6)
      if (country.trim()) {
        rdns.push(makeRDN(new Uint8Array([0x55, 0x04, 0x06]), country.trim().toUpperCase()));
      }

      const subject = derEncode(0x30, concat(...rdns));

      // 4. Construct CertificationRequestInfo (CRI)
      const version = derEncode(0x02, new Uint8Array([0x00])); // Integer 0
      const subjectPKInfo = new Uint8Array(spki);
      const attributes = new Uint8Array([0xA0, 0x00]); // [0] Context-specific constructed tag, length 0

      const cri = derEncode(0x30, concat(version, subject, subjectPKInfo, attributes));

      // 5. Sign CRI bytes
      const signature = await window.crypto.subtle.sign(
        "RSASSA-PKCS1-v1_5",
        keypair.privateKey,
        cri as any
      );

      // 6. Construct outer CertificationRequest sequence
      // sigAlg: sha256WithRSAEncryption (1.2.840.113549.1.1.11) and NULL parameters
      const sigAlg = derEncode(0x30, concat(
        derEncode(0x06, new Uint8Array([0x2A, 0x86, 0x48, 0x86, 0xF7, 0x0D, 0x01, 0x01, 0x0B])),
        new Uint8Array([0x05, 0x00])
      ));
      const sigBitString = derEncode(0x03, concat(new Uint8Array([0x00]), new Uint8Array(signature)));

      const csrBytes = derEncode(0x30, concat(cri, sigAlg, sigBitString));

      // 7. Format PEMs
      const csrBase64 = arrayBufferToBase64(csrBytes);
      const pkcs8Base64 = arrayBufferToBase64(pkcs8);

      setCsrPem(formatPem(csrBase64, "-----BEGIN CERTIFICATE REQUEST-----", "-----END CERTIFICATE REQUEST-----"));
      setPrivateKeyPem(formatPem(pkcs8Base64, "-----BEGIN PRIVATE KEY-----", "-----END PRIVATE KEY-----"));
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
            <label htmlFor="csr-cn-input" className="text-xs font-semibold text-text-muted block mb-1">Common Name (CN) *</label>
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
            <label htmlFor="csr-org-input" className="text-xs font-semibold text-text-muted block mb-1">Organization (O)</label>
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
            <label htmlFor="csr-ou-input" className="text-xs font-semibold text-text-muted block mb-1">Organizational Unit (OU)</label>
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
            <label htmlFor="csr-c-input" className="text-xs font-semibold text-text-muted block mb-1">Country Code (C)</label>
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
          <label htmlFor="csr-keysize-select" className="text-xs font-semibold text-text-muted block mb-1">RSA Key Length</label>
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
