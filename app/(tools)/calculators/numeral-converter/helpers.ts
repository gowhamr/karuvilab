// Numeral & Encoding Converter Upgrade Helpers

export const MORSE_MAP: Record<string, string> = {
  A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.", G: "--.", H: "....",
  I: "..", J: ".---", K: "-.-", L: ".-..", M: "--", N: "-.", O: "---", P: ".--.",
  Q: "--.-", R: ".-.", S: "...", T: "-", U: "..-", V: "...-", W: ".--", X: "-..-",
  Y: "-.--", Z: "--..",
  "1": ".----", "2": "..---", "3": "...--", "4": "....-", "5": ".....",
  "6": "-....", "7": "--...", "8": "---..", "9": "----.", "0": "-----",
  " ": "/"
};

const REVERSE_MORSE: Record<string, string> = Object.fromEntries(
  Object.entries(MORSE_MAP).map(([k, v]) => [v, k])
);

// HTML Entities Named Map (Common Characters)
export const HTML_ENTITIES_MAP: Record<string, string> = {
  "&lt;": "<", "&gt;": ">", "&amp;": "&", "&quot;": "\"", "&apos;": "'", "&nbsp;": "\u00A0",
  "&copy;": "©", "&reg;": "®", "&trade;": "™", "&eacute;": "é", "&egrave;": "è"
};

// Base32 RFC 4648
const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

export function bytesToBase32(bytes: Uint8Array): string {
  let binString = "";
  for (let i = 0; i < bytes.length; i++) {
    binString += bytes[i]!.toString(2).padStart(8, "0");
  }
  let b32 = "";
  for (let i = 0; i < binString.length; i += 5) {
    const chunk = binString.slice(i, i + 5).padEnd(5, "0");
    const val = parseInt(chunk, 2);
    b32 += BASE32_ALPHABET[val];
  }
  const padLength = (8 - (b32.length % 8)) % 8;
  return b32 + "=".repeat(padLength);
}

export function base32ToBytes(b32: string): Uint8Array {
  const clean = b32.toUpperCase().replace(/=+$/, "").replace(/\s+/g, "");
  if (!clean) return new Uint8Array(0);
  let binString = "";
  for (let i = 0; i < clean.length; i++) {
    const val = BASE32_ALPHABET.indexOf(clean[i]!);
    if (val === -1) return new Uint8Array(0);
    binString += val.toString(2).padStart(5, "0");
  }
  const bytes: number[] = [];
  for (let i = 0; i + 8 <= binString.length; i += 8) {
    bytes.push(parseInt(binString.slice(i, i + 8), 2));
  }
  return new Uint8Array(bytes);
}

// 1. Detect Format
export function detectFormat(input: string): { format: string; confidence: "high" | "medium" | "low" } {
  const trimmed = input.trim();
  if (!trimmed) return { format: "utf8", confidence: "low" };

  // 1. JWT Token
  if (/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]*$/.test(trimmed)) {
    return { format: "jwt", confidence: "high" };
  }

  // 2. Unicode Escape Sequences
  if (/\\u[0-9a-fA-F]{4}|\\x[0-9a-fA-F]{2}|U\+[0-9a-fA-F]{4}/.test(trimmed)) {
    return { format: "unicode-escape", confidence: "high" };
  }

  // 3. HTML Entities
  if (/&[a-zA-Z0-9]+;|&#[0-9]+;|&#x[0-9a-fA-F]+;/.test(trimmed)) {
    return { format: "html-entities", confidence: "high" };
  }

  // 4. URL Percent Encoding
  if (/%[0-9a-fA-F]{2}/.test(trimmed)) {
    return { format: "url-encoded", confidence: "high" };
  }

  // 5. Binary
  const binaryClean = trimmed.replace(/[\s]/g, "");
  if (/^[01]+$/.test(binaryClean) && binaryClean.length >= 8) {
    return { format: "bin", confidence: "high" };
  }

  // 6. Hexadecimal
  const hexClean = trimmed.replace(/0x|\\x|[\s:-]/gi, "");
  if (/^[0-9a-fA-F]+$/.test(hexClean) && hexClean.length >= 4 && hexClean.length % 2 === 0) {
    return { format: "hex", confidence: "high" };
  }

  // 7. Morse Code
  if (/^[.\-\/\s]+$/.test(trimmed) && (trimmed.includes(".") || trimmed.includes("-"))) {
    return { format: "morse", confidence: "high" };
  }

  // 8. Base64 Standard
  if (/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(trimmed) && trimmed.length >= 4) {
    try {
      const decoded = atob(trimmed);
      const isReadable = /^[\x20-\x7E\s]*$/.test(decoded);
      return { format: "base64", confidence: isReadable ? "high" : "medium" };
    } catch {
      // Ignored
    }
  }

  // 9. Base64 URL-Safe
  if (/^[A-Za-z0-9_-]+$/.test(trimmed) && (trimmed.includes("-") || trimmed.includes("_")) && trimmed.length >= 4) {
    return { format: "base64url", confidence: "medium" };
  }

  // 10. Decimal Bytes (space separated numbers 0-255)
  const decParts = trimmed.split(/[\s,]+/);
  if (decParts.length >= 2 && decParts.every(p => /^\d+$/.test(p) && parseInt(p, 10) <= 255)) {
    return { format: "dec-bytes", confidence: "high" };
  }

  // 11. Octal (space separated numbers 0-377 / base 8)
  if (decParts.length >= 2 && decParts.every(p => /^[0-7]+$/.test(p) && parseInt(p, 8) <= 255)) {
    return { format: "oct", confidence: "medium" };
  }

  // Default: Plain UTF-8 Text
  return { format: "utf8", confidence: "low" };
}

// 2. Decode To Uint8Array Bytes
export function decodeToBytes(input: string, format: string): Uint8Array {
  const trimmed = input.trim();
  if (!trimmed) return new Uint8Array(0);

  switch (format) {
    case "hex": {
      const clean = trimmed.replace(/0x|\\x|[\s:-]/gi, "");
      const matches = clean.match(/.{1,2}/g) || [];
      const bytes = new Uint8Array(matches.length);
      for (let i = 0; i < matches.length; i++) {
        bytes[i] = parseInt(matches[i]!, 16);
      }
      return bytes;
    }
    case "bin": {
      const clean = trimmed.replace(/[^01]/g, "");
      const bytes: number[] = [];
      for (let i = 0; i < clean.length; i += 8) {
        const chunk = clean.slice(i, i + 8);
        bytes.push(parseInt(chunk.padEnd(8, "0"), 2));
      }
      return new Uint8Array(bytes);
    }
    case "oct": {
      const parts = trimmed.split(/[\s,]+/).filter(p => p.length > 0 && /^[0-7]+$/.test(p));
      return new Uint8Array(parts.map(p => parseInt(p, 8)));
    }
    case "dec-bytes": {
      const parts = trimmed.split(/[\s,]+/).filter(p => p.length > 0 && /^\d+$/.test(p));
      return new Uint8Array(parts.map(p => Math.min(255, parseInt(p, 10))));
    }
    case "base64":
    case "base64url": {
      let clean = trimmed.replace(/-/g, "+").replace(/_/g, "/").replace(/\s+/g, "");
      while (clean.length % 4) clean += "=";
      try {
        const binary = atob(clean);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        return bytes;
      } catch {
        return new Uint8Array(0);
      }
    }
    case "base32":
      return base32ToBytes(trimmed);
    case "url-encoded": {
      const clean = trimmed.replace(/\+/g, " ");
      const result: number[] = [];
      for (let i = 0; i < clean.length; i++) {
        if (clean[i] === "%" && i + 2 < clean.length) {
          const hex = clean.slice(i + 1, i + 3);
          if (/[0-9a-fA-F]{2}/.test(hex)) {
            result.push(parseInt(hex, 16));
            i += 2;
            continue;
          }
        }
        result.push(clean.charCodeAt(i));
      }
      return new Uint8Array(result);
    }
    case "html-entities": {
      const unescaped = trimmed.replace(/&(?:#[0-9]+|#x[0-9a-fA-F]+|[a-zA-Z0-9]+);/g, (match) => {
        const matchLower = match.toLowerCase();
        if (matchLower.startsWith("&#x")) {
          return String.fromCodePoint(parseInt(match.slice(3, -1), 16));
        }
        if (matchLower.startsWith("&#")) {
          return String.fromCodePoint(parseInt(match.slice(2, -1), 10));
        }
        return HTML_ENTITIES_MAP[matchLower] || match;
      });
      return new TextEncoder().encode(unescaped);
    }
    case "unicode-escape": {
      const decoded = trimmed
        .replace(/\\u\{([0-9a-fA-F]+)\}/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
        .replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
        .replace(/\\U([0-9a-fA-F]{8})/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
        .replace(/\\x([0-9a-fA-F]{2})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
        .replace(/U\+([0-9a-fA-F]{4,6})/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)));
      return new TextEncoder().encode(decoded);
    }
    case "utf16le": {
      const hexClean = trimmed.replace(/[\s]/g, "");
      const matches = hexClean.match(/.{1,2}/g) || [];
      const u8 = new Uint8Array(matches.map(h => parseInt(h, 16)));
      const view = new DataView(u8.buffer);
      let text = "";
      for (let i = 0; i + 2 <= u8.length; i += 2) {
        text += String.fromCharCode(view.getUint16(i, true));
      }
      return new TextEncoder().encode(text);
    }
    case "utf16be": {
      const hexClean = trimmed.replace(/[\s]/g, "");
      const matches = hexClean.match(/.{1,2}/g) || [];
      const u8 = new Uint8Array(matches.map(h => parseInt(h, 16)));
      const view = new DataView(u8.buffer);
      let text = "";
      for (let i = 0; i + 2 <= u8.length; i += 2) {
        text += String.fromCharCode(view.getUint16(i, false));
      }
      return new TextEncoder().encode(text);
    }
    case "utf32le": {
      const hexClean = trimmed.replace(/[\s]/g, "");
      const matches = hexClean.match(/.{1,2}/g) || [];
      const u8 = new Uint8Array(matches.map(h => parseInt(h, 16)));
      const view = new DataView(u8.buffer);
      let text = "";
      for (let i = 0; i + 4 <= u8.length; i += 4) {
        text += String.fromCodePoint(view.getUint32(i, true));
      }
      return new TextEncoder().encode(text);
    }
    case "utf32be": {
      const hexClean = trimmed.replace(/[\s]/g, "");
      const matches = hexClean.match(/.{1,2}/g) || [];
      const u8 = new Uint8Array(matches.map(h => parseInt(h, 16)));
      const view = new DataView(u8.buffer);
      let text = "";
      for (let i = 0; i + 4 <= u8.length; i += 4) {
        text += String.fromCodePoint(view.getUint32(i, false));
      }
      return new TextEncoder().encode(text);
    }
    case "morse": {
      const text = trimmed.split(/\s+/).map(sym => REVERSE_MORSE[sym] || "").join("");
      return new TextEncoder().encode(text);
    }
    case "rot13": {
      const shifted = caesarShift(trimmed, 13);
      return new TextEncoder().encode(shifted);
    }
    case "ascii": {
      return new TextEncoder().encode(trimmed);
    }
    case "utf8":
    default:
      return new TextEncoder().encode(input);
  }
}

// 3. Encode From Uint8Array Bytes
export function encodeFromBytes(bytes: Uint8Array, format: string, extraOptions?: any): string {
  if (bytes.length === 0) return "";

  switch (format) {
    case "utf8":
      return new TextDecoder("utf-8", { fatal: false }).decode(bytes);
    case "ascii": {
      const hasNonAscii = bytes.some(b => b > 127);
      if (hasNonAscii) {
        throw new Error("Contains non-ASCII characters — not representable");
      }
      return new TextDecoder("utf-8").decode(bytes);
    }
    case "latin1": {
      const text = new TextDecoder("utf-8", { fatal: false }).decode(bytes);
      const hasNonLatin1 = Array.from(text).some(c => (c.codePointAt(0) || 0) > 255);
      if (hasNonLatin1) {
        throw new Error("Contains characters outside Latin-1 (0-255)");
      }
      return new TextDecoder("iso-8859-1").decode(bytes);
    }
    case "win1252":
      return new TextDecoder("windows-1252", { fatal: false }).decode(bytes);
    case "utf16le": {
      const text = new TextDecoder("utf-8", { fatal: false }).decode(bytes);
      const u16Bytes = new Uint8Array(text.length * 2);
      const view = new DataView(u16Bytes.buffer);
      for (let i = 0; i < text.length; i++) {
        view.setUint16(i * 2, text.charCodeAt(i), true);
      }
      return Array.from(u16Bytes).map(b => b.toString(16).padStart(2, "0").toUpperCase()).join(" ");
    }
    case "utf16be": {
      const text = new TextDecoder("utf-8", { fatal: false }).decode(bytes);
      const u16Bytes = new Uint8Array(text.length * 2);
      const view = new DataView(u16Bytes.buffer);
      for (let i = 0; i < text.length; i++) {
        view.setUint16(i * 2, text.charCodeAt(i), false);
      }
      return Array.from(u16Bytes).map(b => b.toString(16).padStart(2, "0").toUpperCase()).join(" ");
    }
    case "utf32le": {
      const text = new TextDecoder("utf-8", { fatal: false }).decode(bytes);
      const u32Bytes = new Uint8Array(text.length * 4);
      const view = new DataView(u32Bytes.buffer);
      for (let i = 0; i < text.length; i++) {
        view.setUint32(i * 4, text.codePointAt(i) || 0, true);
      }
      return Array.from(u32Bytes).map(b => b.toString(16).padStart(2, "0").toUpperCase()).join(" ");
    }
    case "utf32be": {
      const text = new TextDecoder("utf-8", { fatal: false }).decode(bytes);
      const u32Bytes = new Uint8Array(text.length * 4);
      const view = new DataView(u32Bytes.buffer);
      for (let i = 0; i < text.length; i++) {
        view.setUint32(i * 4, text.codePointAt(i) || 0, false);
      }
      return Array.from(u32Bytes).map(b => b.toString(16).padStart(2, "0").toUpperCase()).join(" ");
    }
    case "bin":
      return Array.from(bytes).map(b => b.toString(2).padStart(8, "0")).join(" ");
    case "oct":
      return Array.from(bytes).map(b => b.toString(8).padStart(3, "0")).join(" ");
    case "dec-bytes":
      return Array.from(bytes).map(b => b.toString(10)).join(" ");
    case "hex":
      return Array.from(bytes).map(b => b.toString(16).padStart(2, "0").toUpperCase()).join(" ");
    case "base64": {
      let bin = "";
      for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]!);
      return btoa(bin);
    }
    case "base64url": {
      let bin = "";
      for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]!);
      return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
    }
    case "base32":
      return bytesToBase32(bytes);
    case "url-encoded":
      return Array.from(bytes).map(b => "%" + b.toString(16).padStart(2, "0").toUpperCase()).join("");
    case "html-entities": {
      const text = new TextDecoder("utf-8", { fatal: false }).decode(bytes);
      if (extraOptions?.encodeAll) {
        return Array.from(text).map(c => `&#x${c.codePointAt(0)!.toString(16).toUpperCase()};`).join("");
      }
      return Array.from(text).map(c => {
        const code = c.codePointAt(0)!;
        if (c === "<") return "&lt;";
        if (c === ">") return "&gt;";
        if (c === "&") return "&amp;";
        if (c === "\"") return "&quot;";
        if (c === "'") return "&apos;";
        if (code > 127) return `&#x${code.toString(16).toUpperCase()};`;
        return c;
      }).join("");
    }
    case "unicode-escape": {
      const text = new TextDecoder("utf-8", { fatal: false }).decode(bytes);
      const style = extraOptions?.escapeStyle || "js";
      return Array.from(text).map(c => {
        const code = c.codePointAt(0)!;
        if (style === "python" || style === "c") {
          return code <= 255 
            ? `\\x${code.toString(16).padStart(2, "0").toUpperCase()}`
            : `\\u${code.toString(16).padStart(4, "0").toUpperCase()}`;
        }
        if (style === "css") {
          return `\\${code.toString(16).padStart(6, "0").toUpperCase()}`;
        }
        if (style === "rust") {
          return `\\u{${code.toString(16).toUpperCase()}}`;
        }
        if (style === "go") {
          return `\\U${code.toString(16).padStart(8, "0").toUpperCase()}`;
        }
        return `\\u${code.toString(16).padStart(4, "0").toUpperCase()}`;
      }).join("");
    }
    case "morse": {
      const text = new TextDecoder("utf-8", { fatal: false }).decode(bytes).toUpperCase();
      return Array.from(text).map(c => MORSE_MAP[c] || "").filter(Boolean).join(" ");
    }
    case "rot13": {
      const text = new TextDecoder("utf-8", { fatal: false }).decode(bytes);
      return caesarShift(text, 13);
    }
    case "caesar": {
      const text = new TextDecoder("utf-8", { fatal: false }).decode(bytes);
      return caesarShift(text, extraOptions?.shift || 3);
    }
    case "atbash": {
      const text = new TextDecoder("utf-8", { fatal: false }).decode(bytes);
      return atbash(text);
    }
    case "unicode-codepoints": {
      const text = new TextDecoder("utf-8", { fatal: false }).decode(bytes);
      return Array.from(text).map(c => `U+${c.codePointAt(0)!.toString(16).padStart(4, "0").toUpperCase()}`).join(" ");
    }
    default:
      return "";
  }
}

// 4. ROT-N / Caesar Shift Implementation
export function caesarShift(text: string, shift: number): string {
  const s = ((shift % 26) + 26) % 26;
  return Array.from(text).map(c => {
    const code = c.charCodeAt(0);
    if (code >= 65 && code <= 90) {
      return String.fromCharCode(((code - 65 + s) % 26) + 65);
    }
    if (code >= 97 && code <= 122) {
      return String.fromCharCode(((code - 97 + s) % 26) + 97);
    }
    return c;
  }).join("");
}

// 5. Atbash Cipher Implementation
export function atbash(text: string): string {
  return Array.from(text).map(c => {
    const code = c.charCodeAt(0);
    if (code >= 65 && code <= 90) return String.fromCharCode(90 - (code - 65));
    if (code >= 97 && code <= 122) return String.fromCharCode(122 - (code - 97));
    return c;
  }).join("");
}

// 6. JWT Decoder
export interface DecodedJWT {
  header: any;
  payload: any;
  signature: string;
  error?: string;
  expiryStatus?: "valid" | "expired" | "no-expiry";
  expDate?: Date | undefined;
  iatDate?: Date | undefined;
  nbfDate?: Date | undefined;
}

export function decodeJWT(token: string): DecodedJWT {
  try {
    const parts = token.split(".");
    if (parts.length < 2 || parts.length > 3) {
      throw new Error("Invalid JWT token format. Must be 2 or 3 dot-separated segments.");
    }
    const headerB64 = parts[0]!;
    const payloadB64 = parts[1]!;
    const signature = parts[2] || "";

    const header = JSON.parse(new TextDecoder().decode(base64ToBytes(headerB64)));
    const payload = JSON.parse(new TextDecoder().decode(base64ToBytes(payloadB64)));

    let expiryStatus: "valid" | "expired" | "no-expiry" = "no-expiry";
    let expDate: Date | undefined;
    let iatDate: Date | undefined;
    let nbfDate: Date | undefined;

    if (payload.exp) {
      expDate = new Date(payload.exp * 1000);
      expiryStatus = expDate.getTime() > Date.now() ? "valid" : "expired";
    }
    if (payload.iat) {
      iatDate = new Date(payload.iat * 1000);
    }
    if (payload.nbf) {
      nbfDate = new Date(payload.nbf * 1000);
    }

    return { header, payload, signature, expiryStatus, expDate, iatDate, nbfDate };
  } catch (e: any) {
    return { header: null, payload: null, signature: "", error: e.message || "Decoding failed" };
  }
}

function base64ToBytes(b64: string): Uint8Array {
  let s = b64.replace(/-/g, "+").replace(/_/g, "/").replace(/\s+/g, "");
  while (s.length % 4) s += "=";
  const bin = atob(s);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

// 7. IEEE 754 Visualizer Helpers
export interface IEEE754Visual {
  sign: number;
  exponent: string;
  mantissa: string;
  exponentVal: number;
  mantissaVal: number;
  value: number;
}

export function floatToIEEE754(num: number, doublePrecision: boolean = false): IEEE754Visual {
  const buffer = new ArrayBuffer(doublePrecision ? 8 : 4);
  const view = new DataView(buffer);
  if (doublePrecision) {
    view.setFloat64(0, num, false);
  } else {
    view.setFloat32(0, num, false);
  }

  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += bytes[i]!.toString(2).padStart(8, "0");
  }

  if (doublePrecision) {
    const sign = parseInt(binary[0]!, 2);
    const exponent = binary.slice(1, 12);
    const mantissa = binary.slice(12);
    const exponentVal = parseInt(exponent, 2) - 1023;
    const mantissaVal = 1 + Array.from(mantissa).reduce((acc, bit, idx) => acc + (bit === "1" ? Math.pow(2, -(idx + 1)) : 0), 0);
    return { sign, exponent, mantissa, exponentVal, mantissaVal, value: num };
  } else {
    const sign = parseInt(binary[0]!, 2);
    const exponent = binary.slice(1, 9);
    const mantissa = binary.slice(9);
    const exponentVal = parseInt(exponent, 2) - 127;
    const mantissaVal = 1 + Array.from(mantissa).reduce((acc, bit, idx) => acc + (bit === "1" ? Math.pow(2, -(idx + 1)) : 0), 0);
    return { sign, exponent, mantissa, exponentVal, mantissaVal, value: num };
  }
}

export function ieee754ToFloat(visual: { sign: number; exponent: string; mantissa: string }, doublePrecision: boolean = false): number {
  const binary = visual.sign.toString() + visual.exponent + visual.mantissa;
  const buffer = new ArrayBuffer(doublePrecision ? 8 : 4);
  const bytes = new Uint8Array(buffer);

  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(binary.slice(i * 8, (i + 1) * 8), 2);
  }

  const view = new DataView(buffer);
  return doublePrecision ? view.getFloat64(0, false) : view.getFloat32(0, false);
}
