"use client";

import { useState, useCallback } from "react";
import { parseX509Certificate, parseBinaryInput, X509CertificateInfo, bytesToHex } from "@/src/lib/security/asn1";
import { CopyButton } from "@/components/ui/CopyButton";
import { ShieldCheck, Calendar, Key, AlertCircle, CheckCircle2 } from "lucide-react";
import { workerManager } from "@/src/workers/manager";
import { useToast } from "@/components/ui/Toast";

export default function X509Client() {
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [certInfo, setCertInfo] = useState<X509CertificateInfo | null>(null);
  const [fingerprintSha256, setFingerprintSha256] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleDecode = useCallback(async () => {
    setError(null);
    setCertInfo(null);
    setFingerprintSha256("");

    if (!input.trim()) {
      setError("Please paste a PEM or Base64 Certificate input");
      return;
    }

    try {
      const der = parseBinaryInput(input);
      const info = parseX509Certificate(der);
      setCertInfo(info);

      // Compute SHA-256 Fingerprint via worker
      const fp = await workerManager.run('generateFileHash', [der.buffer as ArrayBuffer, 'SHA-256', 'hex']);
      const formattedFp = fp.match(/.{1,2}/g)?.join(":").toUpperCase() || fp;
      setFingerprintSha256(formattedFp);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid X.509 Certificate structure');
    }
  }, [input]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-text">Paste X.509 Certificate (PEM or Base64):</label>
        <textarea
          id="x509-cert-input"
          rows={6}
          placeholder="-----BEGIN CERTIFICATE-----\nMIIDdC..."
          value={input}
          onChange={(e) => {
            if (e.target.value.length > 1 * 1024 * 1024) {
              toast("Input exceeds 1MB limit", "error");
            } else {
              setInput(e.target.value);
            }
          }}
          className="w-full p-4 rounded-xl bg-surface border border-border font-mono text-xs focus:outline-none"
        />
      </div>

      <button
        id="x509-decode-btn"
        onClick={handleDecode}
        className="w-full py-3 rounded-xl bg-primary text-white font-bold text-base flex items-center justify-center gap-2 hover:opacity-90 transition"
      >
        <ShieldCheck className="w-5 h-5" />
        Decode X.509 Certificate
      </button>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {certInfo && (
        <div className="space-y-6">
          {/* Main Info Card */}
          <div className="p-5 rounded-xl bg-surface-2 border border-border space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-bold text-base text-sky-400 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                Certificate Decoded Successfully (v{certInfo.version})
              </h3>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                Valid Format
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <span className="text-text-muted block font-sans text-xs">Subject:</span>
                <span className="text-text font-bold">{certInfo.subjectString || "N/A"}</span>
              </div>

              <div>
                <span className="text-text-muted block font-sans text-xs">Issuer:</span>
                <span className="text-text font-bold">{certInfo.issuerString || "N/A"}</span>
              </div>

              <div>
                <span className="text-text-muted block font-sans text-xs">Valid From:</span>
                <span className="text-emerald-300">{certInfo.validFrom}</span>
              </div>

              <div>
                <span className="text-text-muted block font-sans text-xs">Valid Until (Expires):</span>
                <span className="text-amber-300">{certInfo.validTo}</span>
              </div>

              <div>
                <span className="text-text-muted block font-sans text-xs">Signature Algorithm:</span>
                <span className="text-sky-300">{certInfo.signatureAlgorithm}</span>
              </div>

              <div>
                <span className="text-text-muted block font-sans text-xs">Public Key Algorithm & Size:</span>
                <span className="text-sky-300">
                  {certInfo.publicKeyAlgorithm} {certInfo.keySizeBits ? `(${certInfo.keySizeBits}-bit)` : ''}
                </span>
              </div>
            </div>

            {/* Fingerprint */}
            {fingerprintSha256 && (
              <div className="p-3 rounded-lg bg-surface border border-border space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-text-muted">SHA-256 Fingerprint:</span>
                  <CopyButton text={fingerprintSha256} />
                </div>
                <p className="font-mono text-xs text-emerald-300 break-all">{fingerprintSha256}</p>
              </div>
            )}
          </div>

          {/* Extensions */}
          {certInfo.extensions.length > 0 && (
            <div className="p-5 rounded-xl bg-surface-2 border border-border space-y-3">
              <h4 className="font-bold text-sm text-text">X.509 Extensions ({certInfo.extensions.length})</h4>
              <div className="space-y-2">
                {certInfo.extensions.map((ext, i) => (
                  <div key={i} className="p-3 rounded-lg bg-surface border border-border text-xs font-mono flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sky-400 font-bold">{ext.name}</span>
                      {ext.critical && <span className="text-red-400 text-[10px] uppercase font-bold">Critical</span>}
                    </div>
                    <span className="text-text-muted text-[11px]">{ext.oid}</span>
                    <span className="text-text-muted text-[11px] break-all">{ext.valueHex}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
