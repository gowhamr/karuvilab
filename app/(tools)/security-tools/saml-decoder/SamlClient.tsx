"use client";

import { useState, useCallback } from "react";
import { parseSaml, SamlParsed } from "@/src/lib/security/tokens";
import { CopyButton } from "@/components/ui/CopyButton";
import { ShieldCheck, FileCode, AlertCircle, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

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
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-text">Paste SAML Payload (Base64, URL Encoded, or Raw XML):</label>
        <textarea
          id="saml-input-text"
          rows={5}
          placeholder="PHNhbWxwOkF1dGhuUmVxdWVzdCB4bWxuczpzYW1scD0..."
          value={input}
          onChange={(e) => {
            if (e.target.value.length > 1 * 1024 * 1024) {
              toast("Input text exceeds 1MB limit", "error");
            } else {
              setInput(e.target.value);
            }
          }}
          className="w-full p-4 rounded-xl bg-surface border border-border font-mono text-xs focus:outline-none"
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

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {parsed && (
        <div className="space-y-6">
          {/* Summary Info */}
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
                <span className="text-text font-bold">{parsed.issuer || "N/A"}</span>
              </div>
              <div>
                <span className="text-text-muted block font-sans text-xs">Subject NameID:</span>
                <span className="text-emerald-300">{parsed.nameId || "N/A"}</span>
              </div>
              <div>
                <span className="text-text-muted block font-sans text-xs">Destination Endpoint:</span>
                <span className="text-sky-300">{parsed.destination || "N/A"}</span>
              </div>
              <div>
                <span className="text-text-muted block font-sans text-xs">Issue Instant:</span>
                <span className="text-amber-300">{parsed.issueInstant || "N/A"}</span>
              </div>
            </div>

            {/* Extracted Attributes */}
            {Object.keys(parsed.attributes).length > 0 && (
              <div className="space-y-2 pt-2">
                <label className="text-xs font-semibold text-text-muted font-sans">Extracted Assertion Attributes:</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {Object.entries(parsed.attributes).map(([k, v], i) => (
                    <div key={i} className="p-2 rounded-lg bg-surface border border-border text-xs font-mono">
                      <span className="text-sky-400 font-bold">{k}:</span> <span className="text-text">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Formatted XML */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-text">Pretty Formatted SAML XML:</label>
              <CopyButton text={parsed.decodedXml} />
            </div>
            <pre className="p-4 rounded-xl bg-surface border border-border font-mono text-xs text-sky-200 overflow-x-auto max-h-96">
              {parsed.decodedXml}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
