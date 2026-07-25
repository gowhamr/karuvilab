"use client";

import { useState, useCallback } from "react";
import { parseJwt, JwtParsed } from "@/src/lib/security/tokens";
import { CopyButton } from "@/components/ui/CopyButton";
import { Key, Clock, ShieldCheck, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

export default function OAuthClient() {
  const { toast } = useToast();
  const [tokenInput, setTokenInput] = useState("");
  const [parsed, setParsed] = useState<JwtParsed | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDecode = useCallback(() => {
    setError(null);
    setParsed(null);
    if (!tokenInput.trim()) {
      setError("Please paste an OAuth 2.0 / OIDC Bearer Token");
      return;
    }

    try {
      const res = parseJwt(tokenInput);
      setParsed(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid OAuth Token structure');
    }
  }, [tokenInput]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-text">Paste OAuth 2.0 Bearer / ID Token:</label>
        <textarea
          id="oauth-token-input"
          rows={5}
          placeholder="eyJhY2Nlc3NfdG9rZW4iOi... or eyJhbGciOiJSUzI1Ni..."
          value={tokenInput}
          onChange={(e) => {
            if (e.target.value.length > 1 * 1024 * 1024) {
              toast("Input token exceeds 1MB limit", "error");
            } else {
              setTokenInput(e.target.value);
            }
          }}
          className="w-full p-4 rounded-xl bg-surface border border-border font-mono text-xs focus:outline-none"
        />
      </div>

      <button
        id="oauth-decode-btn"
        onClick={handleDecode}
        className="w-full py-3 rounded-xl bg-primary text-white font-bold text-base flex items-center justify-center gap-2 hover:opacity-90 transition"
      >
        <Key className="w-5 h-5" />
        Decode OAuth Token
      </button>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {parsed && (
        <div className="space-y-6">
          {/* Status Banner */}
          <div className={`p-4 rounded-xl border flex items-center justify-between ${
            parsed.isExpired
              ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
              : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
          }`}>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span className="font-bold text-sm">
                Status: {parsed.isExpired ? 'EXPIRED TOKEN' : 'ACTIVE / VALID EXPIRATION'}
              </span>
            </div>
            {parsed.expirationDate && (
              <span className="text-xs font-mono">Exp: {parsed.expirationDate}</span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Header */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-text">Header (JOSE Parameters):</label>
                <CopyButton text={JSON.stringify(parsed.header, null, 2)} />
              </div>
              <pre className="p-4 rounded-xl bg-surface border border-border font-mono text-xs text-sky-300 overflow-x-auto">
                {JSON.stringify(parsed.header, null, 2)}
              </pre>
            </div>

            {/* Claims / Payload */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-text">Payload (OAuth Claims & Scopes):</label>
                <CopyButton text={JSON.stringify(parsed.payload, null, 2)} />
              </div>
              <pre className="p-4 rounded-xl bg-surface border border-border font-mono text-xs text-emerald-300 overflow-x-auto">
                {JSON.stringify(parsed.payload, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
