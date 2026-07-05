"use client";
import { useState, useMemo, useCallback, useEffect } from "react";
import { Clock, AlertTriangle, ShieldCheck, ShieldAlert } from "lucide-react";
import { DecodedJWT, base64UrlToBuffer, formatTimestamp, timeRelative } from "../utils";

interface SecurityInsightsProps {
  decoded: DecodedJWT;
}

export function SecurityInsights({ decoded }: SecurityInsightsProps) {
  const [secretOrKey, setSecretOrKey] = useState("");
  const [verifyStatus, setVerifyStatus] = useState<"idle" | "valid" | "invalid" | "error">("idle");

  useEffect(() => {
    setVerifyStatus("idle");
  }, [decoded.raw]);

  const expInfo = useMemo(() => {
    if (!decoded.payload.exp) return null;
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
    if (!secretOrKey.trim()) return;
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

  return (
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
  );
}
