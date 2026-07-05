"use client";

import { useState, useCallback } from "react";
import { parseBinaryInput, parseASN1, decodeOID, KNOWN_OIDS, bytesToHex } from "@/src/lib/security/asn1";
import { CopyButton } from "@/components/ui/CopyButton";
import { Key, Eye, AlertCircle, CheckCircle2 } from "lucide-react";
import { workerManager } from "@/src/workers/manager";

export default function PublicKeyClient() {
  const [pemInput, setPemInput] = useState("");
  const [info, setInfo] = useState<{ algo: string; sizeBits: number; fp: string; rawHex: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInspect = useCallback(async () => {
    setError(null);
    setInfo(null);
    if (!pemInput.trim()) {
      setError("Please paste a Public Key PEM or Base64 string");
      return;
    }

    try {
      const bytes = parseBinaryInput(pemInput);
      const tree = parseASN1(bytes);

      let algoOid = "";
      if (tree.children[0]?.children[0]?.value) {
        algoOid = decodeOID(tree.children[0].children[0].value);
      }

      const algoName = KNOWN_OIDS[algoOid] ?? (algoOid || "Unknown Algorithm");
      const sizeBits = bytes.length * 8;

      const fpHex = await workerManager.run('generateFileHash', [bytes.buffer as ArrayBuffer, 'SHA-256', 'hex']);
      const formattedFp = fpHex.match(/.{1,2}/g)?.join(":").toUpperCase() || fpHex;

      setInfo({
        algo: algoName,
        sizeBits,
        fp: formattedFp,
        rawHex: bytesToHex(bytes, " "),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse Public Key structure');
    }
  }, [pemInput]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-text">Paste Public Key (SPKI PEM or DER):</label>
        <textarea
          id="public-key-input"
          rows={6}
          placeholder="-----BEGIN PUBLIC KEY-----\n..."
          value={pemInput}
          onChange={(e) => setPemInput(e.target.value)}
          className="w-full p-4 rounded-xl bg-surface border border-border font-mono text-xs focus:outline-none"
        />
      </div>

      <button
        id="public-key-inspect-btn"
        onClick={handleInspect}
        className="w-full py-3 rounded-xl bg-primary text-white font-bold text-base flex items-center justify-center gap-2 hover:opacity-90 transition"
      >
        <Eye className="w-5 h-5" />
        Inspect Public Key
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
            <h3 className="font-bold text-base text-sky-400 flex items-center gap-2">
              <Key className="w-5 h-5" />
              Public Key Verified
            </h3>
            <span className="text-xs px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-400 font-semibold border border-sky-500/20">
              Valid SPKI
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <span className="text-text-muted block font-sans text-xs">Algorithm:</span>
              <span className="text-text font-bold">{info.algo}</span>
            </div>
            <div>
              <span className="text-text-muted block font-sans text-xs">DER Payload Length:</span>
              <span className="text-emerald-300">{info.sizeBits / 8} Bytes ({info.sizeBits} bits)</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-surface border border-border space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-text-muted">SHA-256 Fingerprint:</span>
              <CopyButton text={info.fp} />
            </div>
            <p className="font-mono text-xs text-emerald-300 break-all">{info.fp}</p>
          </div>
        </div>
      )}
    </div>
  );
}
