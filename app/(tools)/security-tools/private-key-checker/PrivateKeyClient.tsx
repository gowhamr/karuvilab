"use client";

import { useState, useCallback } from "react";
import { parseBinaryInput, parseASN1, decodeOID, KNOWN_OIDS } from "@/src/lib/security/asn1";
import { CopyButton } from "@/components/ui/CopyButton";
import { ShieldAlert, Eye, AlertCircle, CheckCircle2 } from "lucide-react";
import { workerManager } from "@/src/workers/manager";

export default function PrivateKeyClient() {
  const [pemInput, setPemInput] = useState("");
  const [info, setInfo] = useState<{ algo: string; sizeBits: number; fp: string; format: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheck = useCallback(async () => {
    setError(null);
    setInfo(null);
    if (!pemInput.trim()) {
      setError("Please paste a Private Key PEM or Base64 string");
      return;
    }

    try {
      const bytes = parseBinaryInput(pemInput);
      const tree = parseASN1(bytes);

      let format = "PKCS#8";
      let algoOid = "";

      if (pemInput.includes("RSA PRIVATE KEY") || pemInput.includes("EC PRIVATE KEY")) {
        format = "PKCS#1 / SSLeay";
      }

      if (tree.children[1]?.children[0]?.value) {
        algoOid = decodeOID(tree.children[1].children[0].value);
      }

      const algoName = KNOWN_OIDS[algoOid] ?? (algoOid ? `OID (${algoOid})` : "RSA/ECDSA Private Key");
      const sizeBits = bytes.length * 8;

      const fpHex = await workerManager.run('generateFileHash', [bytes.buffer as ArrayBuffer, 'SHA-256', 'hex']);
      const formattedFp = fpHex.match(/.{1,2}/g)?.join(":").toUpperCase() || fpHex;

      setInfo({
        algo: algoName,
        sizeBits,
        fp: formattedFp,
        format,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid Private Key DER/ASN.1 structure');
    }
  }, [pemInput]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium flex items-center gap-2">
        <ShieldAlert className="w-5 h-5 flex-shrink-0" />
        <span>Your private key is parsed 100% locally in memory and is NEVER transmitted or stored anywhere.</span>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-text">Paste Private Key (PKCS#8 or PKCS#1 PEM):</label>
        <textarea
          id="private-key-input"
          rows={6}
          placeholder="-----BEGIN PRIVATE KEY-----\n..."
          value={pemInput}
          onChange={(e) => setPemInput(e.target.value)}
          className="w-full p-4 rounded-xl bg-surface border border-border font-mono text-xs focus:outline-none"
        />
      </div>

      <button
        id="private-key-check-btn"
        onClick={handleCheck}
        className="w-full py-3 rounded-xl bg-amber-600 text-white font-bold text-base flex items-center justify-center gap-2 hover:opacity-90 transition"
      >
        <Eye className="w-5 h-5" />
        Validate Private Key
      </button>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {info && (
        <div className="p-5 rounded-xl bg-surface-2 border border-border space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="font-bold text-base text-amber-400 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Private Key Validated ({info.format})
            </h3>
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
              Valid Structure
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <span className="text-text-muted block font-sans text-xs">Algorithm:</span>
              <span className="text-text font-bold">{info.algo}</span>
            </div>
            <div>
              <span className="text-text-muted block font-sans text-xs">DER Length:</span>
              <span className="text-amber-300">{info.sizeBits / 8} Bytes ({info.sizeBits} bits)</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-surface border border-border space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-text-muted">Key Digest SHA-256 Fingerprint:</span>
              <CopyButton text={info.fp} />
            </div>
            <p className="font-mono text-xs text-amber-300 break-all">{info.fp}</p>
          </div>
        </div>
      )}
    </div>
  );
}
