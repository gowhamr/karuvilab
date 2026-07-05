"use client";
import { useState, useMemo, useRef, useCallback, useDeferredValue } from "react";
import { CopyButton } from "@/components/ui/CopyButton";
import { blobManager } from "@/src/lib/blob-manager";
import { 
  ShieldCheck, ShieldAlert, AlertTriangle, Clock, Key, FileCode, 
  Download, Upload, Activity, Code, Shield, Layers
} from "lucide-react";

function b64urlDecode(str: string): string {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - str.length % 4) % 4);
  try {
    return decodeURIComponent(escape(atob(padded)));
  } catch {
    return atob(padded);
  }
}

function base64UrlToBuffer(str: string): Uint8Array {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - str.length % 4) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function calculateEntropy(str: string): string {
  const len = str.length;
  if (len === 0) return "0.00";
  const frequencies: Record<string, number> = {};
  for (let i = 0; i < len; i++) {
    const char = str[i] as string;
    frequencies[char] = (frequencies[char] || 0) + 1;
  }
  let entropy = 0;
  for (const char in frequencies) {
    const freq = frequencies[char] as number;
    const p = freq / len;
    entropy -= p * Math.log2(p);
  }
  return entropy.toFixed(2);
}

function bufferToHex(buffer: Uint8Array): string {
  return Array.from(buffer).map(b => b.toString(16).padStart(2, "0")).join(" ");
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
  const deferredToken = useDeferredValue(token);
  const [secretOrKey, setSecretOrKey] = useState("");
  const [verifyStatus, setVerifyStatus] = useState<"idle" | "valid" | "invalid" | "error">("idle");
  const [snippetLang, setSnippetLang] = useState<"curl" | "js" | "node" | "python" | "go" | "java" | "csharp">("curl");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const decoded = useMemo(() => {
    const raw = deferredToken.trim();
    if (!raw) return null;
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

  // Expiration Analysis
  const expInfo = useMemo(() => {
    if (!decoded || "error" in decoded || !decoded.payload.exp) return null;
    const expMs = decoded.payload.exp * 1000;
    const nowMs = Date.now();
    const diffMs = expMs - nowMs;
    const isExpired = diffMs <= 0;
    const expiresSoon = !isExpired && diffMs < 300000;

    return {
      isExpired,
      expiresSoon,
      statusLabel: isExpired ? "Expired" : expiresSoon ? "Expires Soon" : "Valid",
      relativeText: timeRelative(decoded.payload.exp),
      formatted: formatTimestamp(decoded.payload.exp),
    };
  }, [decoded]);

  const verifySignature = useCallback(async () => {
    if (!decoded || "error" in decoded || !secretOrKey.trim()) return;
    try {
      const alg = decoded.header.alg;
      const dataToVerify = new TextEncoder().encode(`${decoded.parts.p0}.${decoded.parts.p1}`);
      const signatureBytes = base64UrlToBuffer(decoded.parts.p2);

      if (alg.startsWith("HS")) {
        const hashAlg = alg === "HS256" ? "SHA-256" : alg === "HS384" ? "SHA-384" : "SHA-512";
        const key = await window.crypto.subtle.importKey(
          "raw",
          new TextEncoder().encode(secretOrKey.trim()),
          { name: "HMAC", hash: hashAlg },
          false,
          ["verify"]
        );
        const isValid = await window.crypto.subtle.verify("HMAC", key, signatureBytes.buffer as ArrayBuffer, dataToVerify);
        setVerifyStatus(isValid ? "valid" : "invalid");
      } else if (alg.startsWith("RS") || alg.startsWith("PS") || alg.startsWith("ES")) {
        const pem = secretOrKey.trim();
        const b64 = pem.replace(/-----BEGIN (.*)-----/g, "").replace(/-----END (.*)-----/g, "").replace(/\s/g, "");
        const binary = atob(b64);
        const bytes = new Uint8Array(binary.length);
        for(let i=0; i<binary.length; i++) {
           bytes[i] = binary.charCodeAt(i);
        }
        
        let algorithm: any;
        let verifyAlg: any;
        if (alg.startsWith("RS")) {
            algorithm = { name: "RSASSA-PKCS1-v1_5", hash: "SHA-" + alg.slice(2) };
            verifyAlg = "RSASSA-PKCS1-v1_5";
        } else if (alg.startsWith("PS")) {
            algorithm = { name: "RSA-PSS", hash: "SHA-" + alg.slice(2) };
            verifyAlg = { name: "RSA-PSS", saltLength: parseInt(alg.slice(2)) / 8 };
        } else if (alg.startsWith("ES")) {
            const hashMap: Record<string, string> = { "ES256": "P-256", "ES384": "P-384", "ES512": "P-521" };
            algorithm = { name: "ECDSA", namedCurve: hashMap[alg] };
            verifyAlg = { name: "ECDSA", hash: "SHA-" + alg.slice(2) };
        }
        
        const key = await window.crypto.subtle.importKey("spki", bytes.buffer as ArrayBuffer, algorithm, false, ["verify"]);
        const isValid = await window.crypto.subtle.verify(verifyAlg, key, signatureBytes.buffer as ArrayBuffer, dataToVerify);
        setVerifyStatus(isValid ? "valid" : "invalid");
      } else {
        setVerifyStatus("error");
      }
    } catch {
      setVerifyStatus("error");
    }
  }, [decoded, secretOrKey]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      if (evt.target?.result) setToken(String(evt.target.result));
    };
    reader.readAsText(file);
  };

  const codeSnippets = useMemo(() => {
    if (!decoded || "error" in decoded) return {};
    const jwt = decoded.raw;
    return {
      curl: `curl -X GET "https://api.example.com/data" \\\n  -H "Authorization: Bearer ${jwt}" \\\n  -H "Accept: application/json"`,
      js: `fetch("https://api.example.com/data", {\n  headers: {\n    "Authorization": "Bearer ${jwt}"\n  }\n}).then(res => res.json());`,
      node: `const axios = require('axios');\n\naxios.get('https://api.example.com/data', {\n  headers: { 'Authorization': 'Bearer ${jwt}' }\n});`,
      python: `import requests\n\nheaders = {"Authorization": "Bearer ${jwt}"}\nresponse = requests.get("https://api.example.com/data", headers=headers)`,
      go: `req, _ := http.NewRequest("GET", "https://api.example.com/data", nil)\nreq.Header.Set("Authorization", "Bearer ${jwt}")`,
      java: `HttpRequest request = HttpRequest.newBuilder()\n    .uri(URI.create("https://api.example.com/data"))\n    .header("Authorization", "Bearer ${jwt}")\n    .GET().build();`,
      csharp: `var client = new HttpClient();\nclient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "${jwt}");`
    };
  }, [decoded]);

  return (
    <div className="space-y-6">
      <section 
        aria-labelledby="input-heading"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (evt) => {
              if (evt.target?.result) setToken(String(evt.target.result));
            };
            reader.readAsText(file);
          }
        }}
        className="bg-surface border border-border p-5 md:p-6 rounded-3xl space-y-4 shadow-sm"
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
          onChange={(e) => {
            setToken(e.target.value);
            setVerifyStatus("idle");
          }}
        />

        {decoded && !("error" in decoded) && (
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-text-muted">Algorithm:</span>
              <span className="font-mono font-bold px-2 py-0.5 rounded-md bg-blue/10 text-blue border border-blue/20">
                {decoded.header.alg || "unknown"}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                aria-label="Download payload as JSON file"
                onClick={() => {
                  const blob = new Blob([JSON.stringify(decoded.payload, null, 2)], { type: "application/json" });
                  blobManager.download(blob, `jwt-payload-${Date.now()}.json`);
                }}
                className="text-xs font-bold text-text hover:text-blue flex items-center gap-1 min-h-[44px] md:min-h-9 px-3 rounded-lg border border-border hover:bg-bg"
              >
                <Download className="w-3.5 h-3.5" aria-hidden="true" /> Pretty JSON
              </button>
              <CopyButton text={decoded.raw} label="Copy JWT" />
            </div>
          </div>
        )}
      </section>

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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
              
              {/* Expiration Card */}
              <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
                expInfo?.isExpired 
                  ? "bg-rose-500/10 border-rose-500/20 text-rose-400" 
                  : expInfo?.expiresSoon 
                  ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                  : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              }`}>
                <Clock className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider">Expiration Status</h3>
                  <p className="text-sm font-black mt-0.5">{expInfo?.statusLabel ?? "No Expiry Claim"}</p>
                  {expInfo && <p className="text-xs opacity-80 mt-1">{expInfo.relativeText} ({expInfo.formatted})</p>}
                </div>
              </div>

              {/* Algorithm Safety Card */}
              <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
                decoded.header.alg === "none"
                  ? "bg-rose-500/10 border-rose-500/20 text-rose-400"
                  : "bg-blue/10 border-blue/20 text-blue"
              }`}>
                {decoded.header.alg === "none" ? (
                  <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" aria-hidden="true" />
                ) : (
                  <ShieldCheck className="w-5 h-5 text-blue shrink-0 mt-0.5" aria-hidden="true" />
                )}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider">Algorithm Security</h3>
                  <p className="text-sm font-black mt-0.5">
                    {decoded.header.alg === "none" ? "Unsafe (alg: none)" : `${decoded.header.alg} Standard`}
                  </p>
                  <p className="text-xs opacity-80 mt-1">
                    {decoded.header.alg === "none" 
                      ? "Tokens with alg:none carry no cryptographic signature protection."
                      : "Cryptographic signature algorithm declared in header."}
                  </p>
                </div>
              </div>

              {/* Signature Verification Card */}
              <div className="p-4 rounded-2xl border border-border bg-surface flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-text-muted shrink-0 mt-0.5" aria-hidden="true" />
                <div className="w-full">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">Signature Verification</h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <label htmlFor="signature-secret" className="sr-only">Signature Secret or PEM Key</label>
                    <input
                      id="signature-secret"
                      type="password"
                      placeholder={decoded.header.alg?.startsWith("HS") ? "Enter HMAC Secret..." : "Paste PEM Public Key..."}
                      value={secretOrKey}
                      onChange={(e) => setSecretOrKey(e.target.value)}
                      className="w-full md:flex-1 min-h-[44px] md:min-h-[36px] px-2.5 py-1 bg-bg border border-border rounded-lg text-xs font-mono outline-none focus:border-blue"
                    />
                    <button
                      aria-label="Verify Signature"
                      onClick={verifySignature}
                      className="w-full md:w-auto min-h-[44px] md:min-h-[36px] px-3 py-1 rounded-lg bg-blue text-white text-xs font-bold hover:bg-blue-dark transition-all shrink-0"
                    >
                      Verify
                    </button>
                  </div>
                  {verifyStatus !== "idle" && (
                    <p role="status" className={`text-xs font-bold mt-2 ${
                      verifyStatus === "valid" ? "text-emerald-400" : "text-rose-400"
                    }`}>
                      {verifyStatus === "valid" ? "✅ Signature Verified Valid" : "❌ Invalid Signature Match"}
                    </p>
                  )}
                </div>
              </div>

            </div>

            {/* ── Developer Analysis Panel ── */}
            <section aria-labelledby="analysis-heading" className="bg-surface border border-border p-5 rounded-3xl space-y-4">
               <div className="flex items-center justify-between">
                  <h3 id="analysis-heading" className="text-sm font-bold text-text flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue" aria-hidden="true" /> Developer Analysis
                  </h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                   <div className="bg-bg border border-border rounded-xl p-3">
                      <p className="text-[10px] uppercase font-bold text-text-muted">Total Size</p>
                      <p className="text-sm font-mono text-text mt-1">{decoded.sizes.total} B</p>
                   </div>
                   <div className="bg-bg border border-border rounded-xl p-3">
                      <p className="text-[10px] uppercase font-bold text-text-muted">Header Size</p>
                      <p className="text-sm font-mono text-purple-400 mt-1">{decoded.sizes.header} B</p>
                   </div>
                   <div className="bg-bg border border-border rounded-xl p-3">
                      <p className="text-[10px] uppercase font-bold text-text-muted">Payload Size</p>
                      <p className="text-sm font-mono text-blue mt-1">{decoded.sizes.payload} B</p>
                   </div>
                   <div className="bg-bg border border-border rounded-xl p-3">
                      <p className="text-[10px] uppercase font-bold text-text-muted">Signature Size</p>
                      <p className="text-sm font-mono text-emerald-400 mt-1">{decoded.sizes.sig} B</p>
                   </div>
                   <div className="bg-bg border border-border rounded-xl p-3">
                      <p className="text-[10px] uppercase font-bold text-text-muted">Encoding</p>
                      <p className="text-sm font-mono text-text mt-1">Base64URL</p>
                   </div>
                   <div className="bg-bg border border-border rounded-xl p-3">
                      <p className="text-[10px] uppercase font-bold text-text-muted">Token Entropy</p>
                      <p className="text-sm font-mono text-text mt-1">{decoded.entropy.total} bits</p>
                   </div>
                   <div className="bg-bg border border-border rounded-xl p-3">
                      <p className="text-[10px] uppercase font-bold text-text-muted">Signature Entropy</p>
                      <p className="text-sm font-mono text-text mt-1">{decoded.entropy.sig} bits</p>
                   </div>
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Header Column */}
              <section aria-labelledby="header-heading" className="bg-surface border border-border p-5 rounded-3xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 id="header-heading" className="text-sm font-bold text-text flex items-center gap-2">
                    <Layers className="w-4 h-4 text-purple-500" aria-hidden="true" /> Header
                  </h3>
                  <CopyButton text={JSON.stringify(decoded.header, null, 2)} label="Copy" />
                </div>
                <pre className="p-4 rounded-2xl bg-bg border border-border font-mono text-xs text-purple-400 leading-relaxed overflow-x-auto">
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
                      <div className="p-3 rounded-xl bg-bg border border-border font-mono text-xs text-emerald-400 break-all">
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

            {/* ── Code Snippet Generator ── */}
            <section aria-labelledby="snippets-heading" className="bg-surface border border-border p-5 rounded-3xl space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 id="snippets-heading" className="text-sm font-bold text-text flex items-center gap-2">
                  <Code className="w-4 h-4 text-amber-500" aria-hidden="true" /> API Request Snippets
                </h3>
                <div className="flex flex-wrap items-center gap-1.5" role="tablist" aria-label="Code Snippet Languages">
                  {(["curl", "js", "node", "python", "go", "java", "csharp"] as const).map(lang => (
                    <button
                      key={lang}
                      role="tab"
                      aria-selected={snippetLang === lang}
                      onClick={() => setSnippetLang(lang)}
                      className={`min-h-[44px] md:min-h-[32px] px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                        snippetLang === lang 
                          ? "bg-blue text-white shadow-sm" 
                          : "bg-bg text-text-muted hover:text-text border border-border"
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative">
                <pre className="p-4 rounded-2xl bg-bg border border-border font-mono text-xs text-amber-400 leading-relaxed overflow-x-auto">
                  {codeSnippets[snippetLang]}
                </pre>
                <div className="absolute top-3 right-3">
                  <CopyButton text={codeSnippets[snippetLang] || ""} aria-label={`Copy ${snippetLang} snippet`} />
                </div>
              </div>
            </section>

          </div>
        )}
      </div>
    </div>
  );
}
