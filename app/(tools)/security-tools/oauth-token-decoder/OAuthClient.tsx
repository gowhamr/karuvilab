"use client";

import { useState, useCallback } from "react";
import { parseJwt, JwtParsed } from "@/src/lib/security/tokens";
import { Key, Clock, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { ToolWorkspace } from "@/components/ui/ToolWorkspace";
import { ToolInput } from "@/components/ui/ToolInput";
import { ToolResultArea } from "@/components/ui/ToolResultArea";

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
    <ToolWorkspace
      input={
        <div className="space-y-4">
          <ToolInput
            label="Paste OAuth 2.0 Bearer / ID Token:"
            id="oauth-token-input"
            rows={5}
            mono
            placeholder="eyJhY2Nlc3NfdG9rZW4iOi... or eyJhbGciOiJSUzI1Ni..."
            value={tokenInput}
            onChange={(val) => {
              if (val.length > 1 * 1024 * 1024) {
                toast("Input token exceeds 1MB limit", "error");
              } else {
                setTokenInput(val);
              }
            }}
          />

          <button
            id="oauth-decode-btn"
            onClick={handleDecode}
            className="w-full py-3 rounded-xl bg-primary text-white font-bold text-base flex items-center justify-center gap-2 hover:opacity-90 transition"
          >
            <Key className="w-5 h-5" />
            Decode OAuth Token
          </button>
        </div>
      }
      output={
        <div className="space-y-6 h-full flex flex-col">
          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          {parsed && (
            <>
              {/* Status Banner */}
              <div className={`p-4 rounded-xl border flex items-center justify-between ${
                parsed.isExpired
                  ? 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                  : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
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

              <div className="flex flex-col gap-6 flex-1">
                <ToolResultArea
                  label="Header (JOSE Parameters)"
                  value={JSON.stringify(parsed.header, null, 2)}
                  language="json"
                />
                <ToolResultArea
                  label="Payload (OAuth Claims & Scopes)"
                  value={JSON.stringify(parsed.payload, null, 2)}
                  language="json"
                />
              </div>
            </>
          )}

          {!error && !parsed && (
            <div className="flex-1 flex items-center justify-center text-text-4 italic">
              Decoded token information will appear here...
            </div>
          )}
        </div>
      }
    />
  );
}
