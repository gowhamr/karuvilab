"use client";
import { useState } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { CopyButton } from "@/components/ui/CopyButton";

const cat = CATEGORIES.find(c => c.id === "security")!;

function b64urlDecode(str: string): string {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - str.length % 4) % 4);
  try {
    return decodeURIComponent(escape(atob(padded)));
  } catch {
    return atob(padded);
  }
}

const CLAIM_DESCRIPTIONS: Record<string, string> = {
  iss: "Issuer",
  sub: "Subject",
  aud: "Audience",
  exp: "Expires At",
  nbf: "Not Before",
  iat: "Issued At",
  jti: "JWT ID",
  name: "Full Name",
  email: "Email",
  role: "Role",
  roles: "Roles",
  scope: "Scope",
};

function formatTimestamp(ts: number): string {
  return new Date(ts * 1000).toLocaleString();
}

function timeRelative(ts: number): string {
  const diff = ts * 1000 - Date.now();
  const abs = Math.abs(diff);
  const mins = Math.floor(abs / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  const label = days > 0 ? `${days}d ${hours % 24}h` : hours > 0 ? `${hours}h ${mins % 60}m` : `${mins}m`;
  return diff > 0 ? `in ${label}` : `${label} ago`;
}

export default function JWTDecoderClient() {
  const [token, setToken] = useState("");

  const decoded = (() => {
    if (!token.trim()) return null;
    const parts = token.trim().split(".");
    if (parts.length !== 3) return { error: "Invalid JWT: expected 3 parts separated by dots." };
    try {
      const p0 = parts[0];
      const p1 = parts[1];
      const p2 = parts[2];
      if (!p0 || !p1 || !p2) throw new Error("Missing JWT parts");
      
      const header = JSON.parse(b64urlDecode(p0));
      const payload = JSON.parse(b64urlDecode(p1));
      const sig = p2;
      return { header, payload, sig };
    } catch (e) {
      return { error: "Failed to parse JWT: " + (e as Error).message };
    }
  })();

  const isExpired = decoded && !("error" in decoded) && decoded.payload.exp
    ? decoded.payload.exp * 1000 < Date.now()
    : false;

  return (
    <div className="space-y-6">
      <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-4">
        <label className="text-sm font-bold text-text-2">JWT Token</label>
        <textarea
          className="w-full px-4 py-3 bg-bg border border-border rounded-xl font-mono text-sm focus:ring-2 focus:ring-blue outline-none transition-all resize-none"
          rows={4}
          placeholder="Paste your JWT token here…"
          value={token}
          onChange={e => setToken(e.target.value)}
        />
        {token && decoded && !("error" in decoded) && (
          <div className="flex items-center gap-2">
            <div className={`px-3 py-1 rounded-full text-xs font-bold ${isExpired ? "bg-red-500/10 text-red-500" : "bg-green-500/10 text-green-600"}`}>
              {isExpired ? "Expired" : "Valid"}
            </div>
            {decoded.payload.exp && (
              <span className="text-xs text-text-4">
                {isExpired ? "Expired " : "Expires "}{timeRelative(decoded.payload.exp)}
              </span>
            )}
          </div>
        )}
      </div>

      {decoded && ("error" in decoded) && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-sm text-red-500">
          {decoded.error}
        </div>
      )}

      {decoded && !("error" in decoded) && (
        <div className="space-y-4">
          {/* Header */}
          <div className="bg-surface border border-border p-5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-text-2">Header</h2>
              <CopyButton text={JSON.stringify(decoded.header, null, 2)} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(decoded.header).map(([k, v]) => (
                <div key={k} className="bg-bg border border-border rounded-xl p-3">
                  <div className="text-xs font-bold text-text-4 uppercase tracking-wider mb-1">{k}</div>
                  <div className="font-mono text-sm text-text">{String(v)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Payload */}
          <div className="bg-surface border border-border p-5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-text-2">Payload</h2>
              <CopyButton text={JSON.stringify(decoded.payload, null, 2)} />
            </div>
            <div className="space-y-2">
              {Object.entries(decoded.payload).map(([k, v]) => {
                const isTime = ["exp", "iat", "nbf"].includes(k) && typeof v === "number";
                return (
                  <div key={k} className="bg-bg border border-border rounded-xl p-3 flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-blue">{k}</span>
                      {CLAIM_DESCRIPTIONS[k] && (
                        <span className="text-xs text-text-4">— {CLAIM_DESCRIPTIONS[k]}</span>
                      )}
                    </div>
                    <div className="font-mono text-sm text-text break-all">
                      {typeof v === "object" ? JSON.stringify(v) : String(v)}
                    </div>
                    {isTime && typeof v === "number" && (
                      <div className="text-xs text-text-4">{formatTimestamp(v)} ({timeRelative(v)})</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Signature */}
          <div className="bg-surface border border-border p-5 rounded-2xl space-y-3">
            <h2 className="text-sm font-bold text-text-2">Signature</h2>
            <p className="text-xs text-text-4">The signature cannot be verified client-side without the secret key. Use a trusted server-side tool to verify signatures.</p>
            <div className="font-mono text-xs text-text-3 break-all bg-bg border border-border rounded-xl p-3">
              {decoded.sig}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
