"use client";
import { useState, useMemo, useRef, useDeferredValue } from "react";
import { CopyButton } from "@/components/ui/CopyButton";
import { ToolWorkspace } from "@/components/ui/ToolWorkspace";
import { blobManager } from "@/src/lib/blob-manager";
import { AlertTriangle, Key, Download, Upload } from "lucide-react";
import { b64urlDecode, calculateEntropy, DecodedJWT } from "./utils";
import { SecurityInsights } from "./components/SecurityInsights";
import { DeveloperAnalysis } from "./components/DeveloperAnalysis";
import { JwtPartsView } from "./components/JwtPartsView";
import { ApiSnippets } from "./components/ApiSnippets";
import { useToast } from "@/components/ui/Toast";

export default function JWTDecoderClient() {
  const [token, setToken] = useState("");
  const deferredToken = useDeferredValue(token);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const decoded = useMemo<DecodedJWT | { error: string } | null>(() => {
    const raw = deferredToken.trim();
    if (!raw) return null;
    if (raw.length > 5 * 1024 * 1024) return { error: "JWT is too large. Maximum size is 5MB." };
    const parts = raw.split(".");
    if (parts.length !== 3) return { error: "Invalid JWT format: expected exactly 3 parts separated by dots (Header.Payload.Signature)." };
    
    try {
      const p0 = parts[0] as string;
      const p1 = parts[1] as string;
      const p2 = parts[2] as string;
      if (!p0) throw new Error("Missing header");
      if (!p1) throw new Error("Missing payload");
      
      const headerRaw = b64urlDecode(p0);
      let header;
      try {
        header = JSON.parse(headerRaw);
      } catch {
        throw new Error("Header contains invalid JSON.");
      }

      const payloadRaw = b64urlDecode(p1);
      let payload;
      try {
        payload = JSON.parse(payloadRaw);
      } catch {
        throw new Error("Payload contains invalid JSON.");
      }

      return {
        raw,
        header,
        payload,
        sig: p2,
        parts: { p0, p1, p2 },
        sizes: {
          total: raw.length,
          header: p0.length,
          payload: p1.length,
          sig: p2.length,
        },
        entropy: {
          total: calculateEntropy(raw),
          sig: calculateEntropy(p2)
        }
      };
    } catch (e) {
      return { error: "Failed to parse JWT: " + (e as Error).message };
    }
  }, [deferredToken]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast("File is too large. Maximum size is 5MB.", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = (evt) => {
      if (evt.target?.result) setToken(String(evt.target.result));
    };
    reader.readAsText(file);
  };

  return (
    <ToolWorkspace
      layout="stacked"
      input={
        <div 
          aria-labelledby="input-heading"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files?.[0];
            if (file) {
              if (file.size > 5 * 1024 * 1024) {
                toast("File is too large. Maximum size is 5MB.", "error");
                return;
              }
              const reader = new FileReader();
              reader.onload = (evt) => {
                if (evt.target?.result) setToken(String(evt.target.result));
              };
              reader.readAsText(file);
            }
          }}
          className="space-y-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-blue" aria-hidden="true" />
              <h2 id="input-heading" className="text-sm font-bold text-text">Encoded JWT Input</h2>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                aria-label="Paste JWT from clipboard"
                onClick={async () => {
                  try {
                    const text = await navigator.clipboard.readText();
                    if (text) setToken(text);
                  } catch {}
                }}
                className="text-xs font-bold text-blue hover:underline flex items-center gap-1 min-h-[44px] md:min-h-9 px-3 rounded-lg hover:bg-blue/5"
              >
                Paste Clipboard
              </button>
              <button
                aria-label="Upload .jwt file"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-bold text-text-muted hover:text-text flex items-center gap-1 min-h-[44px] md:min-h-9 px-3 rounded-lg border border-border hover:bg-bg"
              >
                <Upload className="w-3.5 h-3.5" aria-hidden="true" />
                Upload .jwt
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                className="hidden" 
                accept=".jwt,.txt" 
                aria-hidden="true"
                tabIndex={-1} 
              />
            </div>
          </div>

          <label htmlFor="jwt-input" className="sr-only">Paste encoded JWT token here</label>
          <textarea
            id="jwt-input"
            aria-invalid={decoded && "error" in decoded ? "true" : "false"}
            className="w-full px-4 py-3 bg-bg border border-border rounded-2xl font-mono text-xs md:text-sm text-text focus:ring-2 focus:ring-blue outline-none transition-all resize-none leading-relaxed break-all min-h-[120px]"
            rows={4}
            placeholder="Paste encoded JWT token here (eyJhbGciOi...)..."
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />

          {decoded && !("error" in decoded) && (
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-text-muted">Algorithm:</span>
                <span className="font-mono font-bold px-2 py-0.5 rounded-md bg-blue/10 text-blue border border-blue/20">
                  {(decoded as DecodedJWT).header.alg || "unknown"}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  aria-label="Download payload as JSON file"
                  onClick={() => {
                    const blob = new Blob([JSON.stringify((decoded as DecodedJWT).payload, null, 2)], { type: "application/json" });
                    blobManager.download(blob, `jwt-payload-${Date.now()}.json`);
                  }}
                  className="text-xs font-bold text-text hover:text-blue flex items-center gap-1 min-h-[44px] md:min-h-9 px-3 rounded-lg border border-border hover:bg-bg"
                >
                  <Download className="w-3.5 h-3.5" aria-hidden="true" /> Pretty JSON
                </button>
                <CopyButton text={(decoded as DecodedJWT).raw} label="Copy JWT" />
              </div>
            </div>
          )}
        </div>
      }
      output={
        <div aria-live="polite" className="space-y-6">
          {decoded && "error" in decoded && (
            <div role="alert" className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 text-xs font-medium text-rose-400 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" aria-hidden="true" />
              <div>
                <p className="font-bold">Invalid JWT</p>
                <p className="mt-0.5">{decoded.error}</p>
              </div>
            </div>
          )}

          {decoded && !("error" in decoded) && (
            <div className="space-y-6">
              <SecurityInsights decoded={decoded as DecodedJWT} />
              <DeveloperAnalysis decoded={decoded as DecodedJWT} />
              <JwtPartsView decoded={decoded as DecodedJWT} />
              <ApiSnippets decoded={decoded as DecodedJWT} />
            </div>
          )}
        </div>
      }
    />
  );
}
