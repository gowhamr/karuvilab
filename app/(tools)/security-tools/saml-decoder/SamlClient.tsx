"use client";

import { useState, useCallback } from "react";
import { parseSaml, SamlParsed } from "@/src/lib/security/tokens";
import { FileCode, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { ToolWorkspace } from "@/components/ui/ToolWorkspace";
import { ToolResultArea } from "@/components/ui/ToolResultArea";

export default function SamlClient() {
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [parsed, setParsed] = useState<SamlParsed | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDecode = useCallback(() => {
    setError(null);
    setParsed(null);
    if (!input.trim()) {
      setError("Please paste a SAML Request, Response, or Assertion string");
      return;
    }

    try {
      const res = parseSaml(input);
      setParsed(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse SAML XML payload');
    }
  }, [input]);

  return (
    <ToolWorkspace
      input={
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="saml-input-text" className="text-sm font-semibold text-text">
              Paste SAML Payload (Base64, URL Encoded, or Raw XML):
            </label>
            <textarea
              id="saml-input-text"
              rows={8}
              placeholder="PHNhbWxwOkF1dGhuUmVxdWVzdCB4bWxuczpzYW1scD0..."
              value={input}
              onChange={(e) => {
                if (e.target.value.length > 1 * 1024 * 1024) {
                  toast("Input text exceeds 1MB limit", "error");
                } else {
                  setInput(e.target.value);
                }
              }}
              className="w-full p-4 rounded-xl bg-surface border border-border font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue/50 resize-y"
            />
          </div>

          <button
            id="saml-decode-btn"
            onClick={handleDecode}
            className="w-full py-3 rounded-xl bg-primary text-white font-bold text-base flex items-center justify-center gap-2 hover:opacity-90 transition"
          >
            <FileCode className="w-5 h-5" />
            Decode SAML Payload
          </button>
        </div>
      }
      output={
        <div className="space-y-6 flex flex-col h-full">
          {parsed && (
            <div className="p-5 rounded-xl bg-surface-2 border border-border space-y-3">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="font-bold text-base text-sky-400 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  {parsed.isResponse ? "SAML Response / Assertion" : parsed.isRequest ? "SAML AuthnRequest / LogoutRequest" : "SAML Document"}
                </h3>
              </div>
  
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <span className="text-text-muted block font-sans text-xs">Issuer:</span>
                  <span className="text-text font-bold break-all">{parsed.issuer || "N/A"}</span>
                </div>
                <div>
                  <span className="text-text-muted block font-sans text-xs">Subject NameID:</span>
                  <span className="text-emerald-300 break-all">{parsed.nameId || "N/A"}</span>
                </div>
                <div>
                  <span className="text-text-muted block font-sans text-xs">Destination Endpoint:</span>
                  <span className="text-sky-300 break-all">{parsed.destination || "N/A"}</span>
                </div>
                <div>
                  <span className="text-text-muted block font-sans text-xs">Issue Instant:</span>
                  <span className="text-amber-300">{parsed.issueInstant || "N/A"}</span>
                </div>
              </div>
  
              {Object.keys(parsed.attributes).length > 0 && (
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-semibold text-text-muted font-sans">Extracted Assertion Attributes:</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {Object.entries(parsed.attributes).map(([k, v], i) => (
                      <div key={i} className="p-2 rounded-lg bg-surface border border-border text-xs font-mono break-all">
                        <span className="text-sky-400 font-bold">{k}:</span> <span className="text-text">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex-1 flex flex-col min-h-[400px]">
            <ToolResultArea
              label="Pretty Formatted SAML XML"
              value={parsed?.decodedXml || ""}
              error={error || undefined}
              language="xml"
            />
          </div>
        </div>
      }
    />
  );
}
