import { Layers, FileCode, Shield } from "lucide-react";
import { CopyButton } from "@/components/ui/CopyButton";
import { DecodedJWT, CLAIM_DESCRIPTIONS, formatTimestamp, timeRelative, bufferToHex, base64UrlToBuffer } from "../utils";

interface JwtPartsViewProps {
  decoded: DecodedJWT;
}

export function JwtPartsView({ decoded }: JwtPartsViewProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Header Column */}
      <section aria-labelledby="header-heading" className="bg-surface border border-border p-5 rounded-3xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 id="header-heading" className="text-sm font-bold text-text flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-500" aria-hidden="true" /> Header
          </h3>
          <CopyButton text={JSON.stringify(decoded.header, null, 2)} label="Copy" />
        </div>
        <pre className="p-4 rounded-2xl bg-bg border border-border font-mono text-xs text-purple-600 dark:text-purple-400 leading-relaxed overflow-x-auto">
          {JSON.stringify(decoded.header, null, 2)}
        </pre>
      </section>

      {/* Payload Column */}
      <section aria-labelledby="payload-heading" className="bg-surface border border-border p-5 rounded-3xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 id="payload-heading" className="text-sm font-bold text-text flex items-center gap-2">
            <FileCode className="w-4 h-4 text-blue" aria-hidden="true" /> Payload
          </h3>
          <CopyButton text={JSON.stringify(decoded.payload, null, 2)} label="Copy" />
        </div>
        <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
          {Object.entries(decoded.payload).map(([k, v]) => {
            const isTime = ["exp", "iat", "nbf"].includes(k) && typeof v === "number";
            return (
              <div key={k} className="bg-bg border border-border rounded-xl p-3 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue font-mono">{k}</span>
                  {CLAIM_DESCRIPTIONS[k] && (
                    <span className="text-[10px] font-semibold text-text-muted">{CLAIM_DESCRIPTIONS[k]}</span>
                  )}
                </div>
                <div className="font-mono text-xs text-text break-all">
                  {typeof v === "object" ? JSON.stringify(v) : String(v)}
                </div>
                {isTime && typeof v === "number" && (
                  <div className="text-[11px] text-text-muted pt-1 border-t border-border/50">
                    📅 {formatTimestamp(v)} ({timeRelative(v)})
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Signature Column */}
      <section aria-labelledby="signature-heading" className="bg-surface border border-border p-5 rounded-3xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 id="signature-heading" className="text-sm font-bold text-text flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-500" aria-hidden="true" /> Signature
          </h3>
          {decoded.sig && <CopyButton text={decoded.sig} label="Copy" />}
        </div>
        
        {decoded.sig ? (
          <div className="space-y-3">
            <div>
              <p className="text-[10px] uppercase font-bold text-text-muted mb-1">Raw Base64URL</p>
              <div className="p-3 rounded-xl bg-bg border border-border font-mono text-xs text-emerald-600 dark:text-emerald-400 break-all">
                {decoded.sig}
              </div>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-text-muted mb-1">Hex View</p>
              <div className="p-3 rounded-xl bg-bg border border-border font-mono text-[10px] text-text-muted break-all max-h-40 overflow-y-auto">
                {bufferToHex(base64UrlToBuffer(decoded.sig))}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-bg border border-border text-xs text-text-muted italic text-center">
            Unsigned JWT
          </div>
        )}
      </section>

    </div>
  );
}
