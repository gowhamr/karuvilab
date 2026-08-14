"use client";

import { useState, useCallback } from "react";
import { parseBinaryInput, parseASN1, decodeOID, KNOWN_OIDS, bytesToHex } from "@/src/lib/security/asn1";
import { CopyButton } from "@/components/ui/CopyButton";
import { Key, Eye, AlertCircle } from "lucide-react";
import { workerManager } from "@/src/workers/manager";
import { ToolWorkspace } from "@/components/ui/ToolWorkspace";
import { ToolInput } from "@/components/ui/ToolInput";
import { Button } from "@/components/ui/Button";

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
    <ToolWorkspace
      input={
        <>
          <ToolInput
            label="Paste Public Key (SPKI PEM or DER):"
            placeholder="-----BEGIN PUBLIC KEY-----\n..."
            value={pemInput}
            onChange={setPemInput}
            rows={6}
            mono
            id="public-key-input"
          />

          <Button
            id="public-key-inspect-btn"
            onClick={handleInspect}
            className="w-full"
            size="lg"
          >
            <Eye className="w-5 h-5 mr-2" />
            Inspect Public Key
          </Button>

          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}
        </>
      }
      output={
        info ? (
          <div className="space-y-4">
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
        ) : (
          <div className="h-full flex items-center justify-center text-text-muted italic min-h-[200px]">
            Enter a public key to inspect its details
          </div>
        )
      }
    />
  );
}
