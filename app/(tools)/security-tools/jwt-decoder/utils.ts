export interface DecodedJWT {
  raw: string;
  header: any;
  payload: any;
  sig: string;
  parts: { p0: string; p1: string; p2: string };
  sizes: {
    total: number;
    header: number;
    payload: number;
    sig: number;
  };
  entropy: {
    total: string;
    sig: string;
  };
}

export function b64urlDecode(str: string): string {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - str.length % 4) % 4);
  try {
    return decodeURIComponent(escape(atob(padded)));
  } catch {
    return atob(padded);
  }
}

export function base64UrlToBuffer(str: string): Uint8Array {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - str.length % 4) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export function calculateEntropy(str: string): string {
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

export function bufferToHex(buffer: Uint8Array): string {
  return Array.from(buffer).map(b => b.toString(16).padStart(2, "0")).join(" ");
}

export const CLAIM_DESCRIPTIONS: Record<string, string> = {
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

export function formatTimestamp(ts: number): string {
  return new Date(ts * 1000).toLocaleString();
}

export function timeRelative(ts: number): string {
  const diff = ts * 1000 - Date.now();
  const abs = Math.abs(diff);
  const mins = Math.floor(abs / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  const label = days > 0 ? `${days}d ${hours % 24}h` : hours > 0 ? `${hours}h ${mins % 60}m` : `${mins}m`;
  return diff > 0 ? `in ${label}` : `${label} ago`;
}
