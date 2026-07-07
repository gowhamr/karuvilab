import * as Comlink from "comlink";

// ─── MD5 & SHA-224 Pure JS Fallbacks ────────────────────────────────────────

function md5(input: string | Uint8Array): string {
  function cmn(q: number, a: number, b: number, x: number, s: number, t: number) {
    a = (((a + q) & 0xFFFFFFFF) + ((x + t) & 0xFFFFFFFF)) & 0xFFFFFFFF;
    return (((a << s) | (a >>> (32 - s))) + b) & 0xFFFFFFFF;
  }
  function ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return cmn((b & c) | (~b & d), a, b, x, s, t); }
  function gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return cmn((b & d) | (c & ~d), a, b, x, s, t); }
  function hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return cmn(b ^ c ^ d, a, b, x, s, t); }
  function ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return cmn(c ^ (b | ~d), a, b, x, s, t); }

  const bytes = typeof input === "string" ? new TextEncoder().encode(input) : input;
  const len8 = bytes.length;
  const len64 = (((len8 + 8) >>> 6) + 1) << 4;
  const s = new Uint32Array(len64);
  for (let i = 0; i < len8; i++) (s as any)[i >> 2] |= (bytes as any)[i] << ((i & 3) * 8);
  (s as any)[len8 >> 2] |= 0x80 << ((len8 & 3) * 8);
  (s as any)[len64 - 2] = len8 * 8;

  let a = 1732584193, b = -271733879, c = -1732584194, d = 271733878;
  for (let i = 0; i < len64; i += 16) {
    const [A, B, C, D] = [a, b, c, d];
    a=ff(a,b,c,d,s[i] ?? 0,7,-680876936); d=ff(d,a,b,c,s[i+1] ?? 0,12,-389564586); c=ff(c,d,a,b,s[i+2] ?? 0,17,606105819); b=ff(b,c,d,a,s[i+3] ?? 0,22,-1044525330);
    a=ff(a,b,c,d,s[i+4] ?? 0,7,-176418897); d=ff(d,a,b,c,s[i+5] ?? 0,12,1200080426); c=ff(c,d,a,b,s[i+6] ?? 0,17,-1473231341); b=ff(b,c,d,a,s[i+7] ?? 0,22,-45705983);
    a=ff(a,b,c,d,s[i+8] ?? 0,7,1770035416); d=ff(d,a,b,c,s[i+9] ?? 0,12,-1958414417); c=ff(c,d,a,b,s[i+10] ?? 0,17,-42063); b=ff(b,c,d,a,s[i+11] ?? 0,22,-1990404162);
    a=ff(a,b,c,d,s[i+12] ?? 0,7,1804603682); d=ff(d,a,b,c,s[i+13] ?? 0,12,-40341101); c=ff(c,d,a,b,s[i+14] ?? 0,17,-1502002290); b=ff(b,c,d,a,s[i+15] ?? 0,22,1236535329);
    a=gg(a,b,c,d,s[i+1] ?? 0,5,-165796510); d=gg(d,a,b,c,s[i+6] ?? 0,9,-1069501632); c=gg(c,d,a,b,s[i+11] ?? 0,14,643717713); b=gg(b,c,d,a,s[i] ?? 0,20,-373897302);
    a=gg(a,b,c,d,s[i+5] ?? 0,5,-701558691); d=gg(d,a,b,c,s[i+10] ?? 0,9,38016083); c=gg(c,d,a,b,s[i+15] ?? 0,14,-660478335); b=gg(b,c,d,a,s[i+4] ?? 0,20,-405537848);
    a=gg(a,b,c,d,s[i+9] ?? 0,5,568446438); d=gg(d,a,b,c,s[i+14] ?? 0,9,-1019803690); c=gg(c,d,a,b,s[i+3] ?? 0,14,-187363961); b=gg(b,c,d,a,s[i+8] ?? 0,20,1163531501);
    a=gg(a,b,c,d,s[i+13] ?? 0,5,-1444681467); d=gg(d,a,b,c,s[i+2] ?? 0,9,-51403784); c=gg(c,d,a,b,s[i+7] ?? 0,14,1735328473); b=gg(b,c,d,a,s[i+12] ?? 0,20,-1926607734);
    a=hh(a,b,c,d,s[i+5] ?? 0,4,-378558); d=hh(d,a,b,c,s[i+8] ?? 0,11,-2022574463); c=hh(c,d,a,b,s[i+11] ?? 0,16,1839030562); b=hh(b,c,d,a,s[i+14] ?? 0,23,-35309556);
    a=hh(a,b,c,d,s[i+1] ?? 0,4,-1530992060); d=hh(d,a,b,c,s[i+4] ?? 0,11,1272893353); c=hh(c,d,a,b,s[i+7] ?? 0,16,-155497632); b=hh(b,c,d,a,s[i+10] ?? 0,23,-1094730640);
    a=hh(a,b,c,d,s[i+13] ?? 0,4,681279174); d=hh(d,a,b,c,s[i] ?? 0,11,-358537222); c=hh(c,d,a,b,s[i+3] ?? 0,16,-722521979); b=hh(b,c,d,a,s[i+6] ?? 0,23,76029189);
    a=hh(a,b,c,d,s[i+9] ?? 0,4,-640364487); d=hh(d,a,b,c,s[i+12] ?? 0,11,-421815835); c=hh(c,d,a,b,s[i+15] ?? 0,16,530742520); b=hh(b,c,d,a,s[i+2] ?? 0,23,-995338651);
    a=ii(a,b,c,d,s[i] ?? 0,6,-198630844); d=ii(d,a,b,c,s[i+7] ?? 0,10,1126891415); c=ii(c,d,a,b,s[i+14] ?? 0,15,-1416354905); b=ii(b,c,d,a,s[i+5] ?? 0,21,-57434055);
    a=ii(a,b,c,d,s[i+12] ?? 0,6,1700485571); d=ii(d,a,b,c,s[i+3] ?? 0,10,-1894986606); c=ii(c,d,a,b,s[i+10] ?? 0,15,-1051523); b=ii(b,c,d,a,s[i+1] ?? 0,21,-2054922799);
    a=ii(a,b,c,d,s[i+8] ?? 0,6,1873313359); d=ii(d,a,b,c,s[i+15] ?? 0,10,-30611744); c=ii(c,d,a,b,s[i+6] ?? 0,15,-1560198380); b=ii(b,c,d,a,s[i+13] ?? 0,21,1309151649);
    a=ii(a,b,c,d,s[i+4] ?? 0,6,-145523070); d=ii(d,a,b,c,s[i+11] ?? 0,10,-1120210379); c=ii(c,d,a,b,s[i+2] ?? 0,15,718787259); b=ii(b,c,d,a,s[i+9] ?? 0,21,-343485551);
    a=(a+A)&0xFFFFFFFF; b=(b+B)&0xFFFFFFFF; c=(c+C)&0xFFFFFFFF; d=(d+D)&0xFFFFFFFF;
  }
  return [a, b, c, d]
    .map(v => Array.from({ length: 4 }, (_, i) => ((v >>> (i * 8)) & 0xFF).toString(16).padStart(2, "0")).join(""))
    .join("");
}

function bufToHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

function bufToBase64(buf: ArrayBuffer): string {
  let binary = "";
  const bytes = new Uint8Array(buf);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]!);
  }
  return btoa(binary);
}

function base64ToBuf(b64: string): ArrayBuffer {
  const binary = atob(b64.replace(/\s/g, ""));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

function pemToDer(pem: string): ArrayBuffer {
  const b64 = pem.replace(/-----[^-]+-----/g, "").replace(/\s/g, "");
  return base64ToBuf(b64);
}

function derToPem(der: ArrayBuffer, type: string): string {
  const b64 = bufToBase64(der);
  const lines = b64.match(/.{1,64}/g)?.join("\n") ?? b64;
  return `-----BEGIN ${type}-----\n${lines}\n-----END ${type}-----`;
}

async function sha(algo: string, input: string | Uint8Array): Promise<ArrayBuffer> {
  const bytes = typeof input === "string" ? new TextEncoder().encode(input) : input;
  const cryptoProvider = self.crypto || (globalThis as any).crypto;
  if (!cryptoProvider?.subtle) {
    throw new Error("Web Crypto API (subtle) is not available.");
  }
  const webCryptoAlgo = algo.replace("SHA1", "SHA-1").replace("SHA224", "SHA-256").replace("SHA", "SHA-");
  const res = await cryptoProvider.subtle.digest(webCryptoAlgo, bytes.buffer as ArrayBuffer);
  if (algo === "SHA224" || algo === "SHA-224") {
    return res.slice(0, 28); // 224 bits = 28 bytes
  }
  return res;
}

async function hmac(algo: string, key: string, input: string | Uint8Array): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(key);
  const data = typeof input === "string" ? encoder.encode(input) : input;
  const cryptoProvider = self.crypto || (globalThis as any).crypto;
  const webCryptoAlgo = algo.replace("SHA1", "SHA-1").replace("SHA224", "SHA-256").replace("SHA", "SHA-");

  const cryptoKey = await cryptoProvider.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: { name: webCryptoAlgo } },
    false,
    ["sign"]
  );
  const res = await cryptoProvider.subtle.sign("HMAC", cryptoKey, data as any);
  if (algo === "SHA224" || algo === "SHA-224") {
    return res.slice(0, 28);
  }
  return res;
}

const api = {
  // ─── HASHING & HMAC ────────────────────────────────────────────────────────
  async generateHashes(text: string, algos: string[], encoding: 'hex' | 'base64' = 'hex', onProgress: any) {
    if (typeof text !== "string" || text.length > 10 * 1024 * 1024) {
      throw new Error("Input text too large or invalid (max 10MB)");
    }
    const results: Record<string, string> = {};
    const total = algos.length;
    let current = 0;

    for (const algo of algos) {
      if (algo === "MD5") {
        const hexStr = md5(text);
        results["MD5"] = encoding === "base64" ? btoa(hexStr.match(/\w{2}/g)!.map(a => String.fromCharCode(parseInt(a, 16))).join("")) : hexStr;
      } else {
        const buf = await sha(algo, text);
        results[algo] = encoding === 'base64' ? bufToBase64(buf) : bufToHex(buf);
      }
      current++;
      if (onProgress) onProgress({ percent: (current / total) * 100, message: `Computed ${algo}` });
    }
    return results;
  },

  async generateFileHash(file: ArrayBuffer, algo: string, encoding: 'hex' | 'base64' = 'hex', onProgress: any) {
    if (onProgress) onProgress({ percent: 10, message: "Starting hash computation..." });
    let result = "";
    const bytes = new Uint8Array(file);
    if (algo === "MD5") {
      const hexStr = md5(bytes);
      result = encoding === "base64" ? btoa(hexStr.match(/\w{2}/g)!.map(a => String.fromCharCode(parseInt(a, 16))).join("")) : hexStr;
    } else {
      const buf = await sha(algo, bytes);
      result = encoding === 'base64' ? bufToBase64(buf) : bufToHex(buf);
    }
    if (onProgress) onProgress({ percent: 100, message: "Done!" });
    return result;
  },

  async directoryHashManifest(files: Array<{ path: string; buffer: ArrayBuffer }>, algo: string, encoding: 'hex' | 'base64' = 'hex', onProgress: any) {
    const manifest: Array<{ path: string; size: number; hash: string }> = [];
    for (let i = 0; i < files.length; i++) {
      const item = files[i]!;
      const bytes = new Uint8Array(item.buffer);
      let hash = "";
      if (algo === "MD5") {
        const hexStr = md5(bytes);
        hash = encoding === "base64" ? btoa(hexStr.match(/\w{2}/g)!.map(a => String.fromCharCode(parseInt(a, 16))).join("")) : hexStr;
      } else {
        const buf = await sha(algo, bytes);
        hash = encoding === "base64" ? bufToBase64(buf) : bufToHex(buf);
      }
      manifest.push({ path: item.path, size: item.buffer.byteLength, hash });
      if (onProgress) onProgress({ percent: Math.round(((i + 1) / files.length) * 100), message: `Hashed ${item.path}` });
    }
    return manifest;
  },

  async generateHmac(text: string, key: string, algo: string, encoding: 'hex' | 'base64' = 'hex', onProgress: any) {
    if (onProgress) onProgress({ percent: 10, message: "Importing key..." });
    const buf = await hmac(algo, key, text);
    const result = encoding === 'base64' ? bufToBase64(buf) : bufToHex(buf);
    if (onProgress) onProgress({ percent: 100, message: "Done!" });
    return result;
  },

  // ─── AES ENCRYPTION ────────────────────────────────────────────────────────
  async aesEncrypt(plaintext: string, password: string, mode: 'GCM' | 'CBC' = 'GCM', keySize: 128 | 192 | 256 = 256, onProgress?: any) {
    const enc = new TextEncoder();
    const salt = self.crypto.getRandomValues(new Uint8Array(16));
    const iv = self.crypto.getRandomValues(new Uint8Array(mode === 'GCM' ? 12 : 16));

    if (onProgress) onProgress({ percent: 20, message: "Deriving AES key using PBKDF2..." });
    const keyMaterial = await self.crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveKey"]);
    const key = await self.crypto.subtle.deriveKey(
      { name: "PBKDF2", salt, iterations: 600000, hash: "SHA-256" },
      keyMaterial,
      { name: `AES-${mode}`, length: keySize },
      false,
      ["encrypt"]
    );

    if (onProgress) onProgress({ percent: 60, message: "Encrypting plaintext..." });
    const cipherBuf = await self.crypto.subtle.encrypt({ name: `AES-${mode}`, iv }, key, enc.encode(plaintext));

    const combined = new Uint8Array(salt.length + iv.length + cipherBuf.byteLength);
    combined.set(salt, 0);
    combined.set(iv, 16);
    combined.set(new Uint8Array(cipherBuf), 16 + iv.length);

    if (onProgress) onProgress({ percent: 100, message: "Done!" });
    return bufToBase64(combined.buffer);
  },

  async aesDecrypt(ciphertextB64: string, password: string, mode: 'GCM' | 'CBC' = 'GCM', keySize: 128 | 192 | 256 = 256, onProgress?: any) {
    const combined = new Uint8Array(base64ToBuf(ciphertextB64));
    const ivLen = mode === 'GCM' ? 12 : 16;
    const salt = combined.slice(0, 16);
    const iv = combined.slice(16, 16 + ivLen);
    const cipher = combined.slice(16 + ivLen);

    if (onProgress) onProgress({ percent: 20, message: "Deriving AES key..." });
    const keyMaterial = await self.crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveKey"]);
    const key = await self.crypto.subtle.deriveKey(
      { name: "PBKDF2", salt, iterations: 600000, hash: "SHA-256" },
      keyMaterial,
      { name: `AES-${mode}`, length: keySize },
      false,
      ["decrypt"]
    );

    if (onProgress) onProgress({ percent: 60, message: "Decrypting ciphertext..." });
    const plainBuf = await self.crypto.subtle.decrypt({ name: `AES-${mode}`, iv }, key, cipher);
    if (onProgress) onProgress({ percent: 100, message: "Done!" });
    return new TextDecoder().decode(plainBuf);
  },

  // ─── RSA KEY GEN & ENCRYPTION ──────────────────────────────────────────────
  async generateRsaKeyPair(modulusLength: 1024 | 2048 | 3072 | 4096 = 2048, hash: 'SHA-256' | 'SHA-512' = 'SHA-256', onProgress?: any) {
    if (onProgress) onProgress({ percent: 20, message: `Generating RSA ${modulusLength}-bit keypair...` });
    const keyPair = await self.crypto.subtle.generateKey(
      { name: "RSA-OAEP", modulusLength, publicExponent: new Uint8Array([1, 0, 1]), hash },
      true,
      ["encrypt", "decrypt"]
    );

    if (onProgress) onProgress({ percent: 70, message: "Exporting PEM keys..." });
    const pubDer = await self.crypto.subtle.exportKey("spki", keyPair.publicKey);
    const privDer = await self.crypto.subtle.exportKey("pkcs8", keyPair.privateKey);

    return {
      publicKeyPem: derToPem(pubDer, "PUBLIC KEY"),
      privateKeyPem: derToPem(privDer, "PRIVATE KEY"),
    };
  },

  async rsaEncrypt(plaintext: string, publicKeyPem: string, hash: 'SHA-256' | 'SHA-512' = 'SHA-256', onProgress?: any) {
    const der = pemToDer(publicKeyPem);
    const key = await self.crypto.subtle.importKey("spki", der, { name: "RSA-OAEP", hash }, false, ["encrypt"]);
    const cipherBuf = await self.crypto.subtle.encrypt({ name: "RSA-OAEP" }, key, new TextEncoder().encode(plaintext));
    return bufToBase64(cipherBuf);
  },

  async rsaDecrypt(ciphertextB64: string, privateKeyPem: string, hash: 'SHA-256' | 'SHA-512' = 'SHA-256', onProgress?: any) {
    const der = pemToDer(privateKeyPem);
    const key = await self.crypto.subtle.importKey("pkcs8", der, { name: "RSA-OAEP", hash }, false, ["decrypt"]);
    const plainBuf = await self.crypto.subtle.decrypt({ name: "RSA-OAEP" }, key, base64ToBuf(ciphertextB64));
    return new TextDecoder().decode(plainBuf);
  },

  async rsaSign(plaintext: string, privateKeyPem: string, hash: 'SHA-256' | 'SHA-512' = 'SHA-256', onProgress?: any) {
    const der = pemToDer(privateKeyPem);
    const key = await self.crypto.subtle.importKey("pkcs8", der, { name: "RSASSA-PKCS1-v1_5", hash }, false, ["sign"]);
    const sigBuf = await self.crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, new TextEncoder().encode(plaintext));
    return bufToBase64(sigBuf);
  },

  async rsaVerify(plaintext: string, signatureB64: string, publicKeyPem: string, hash: 'SHA-256' | 'SHA-512' = 'SHA-256', onProgress?: any) {
    const der = pemToDer(publicKeyPem);
    const key = await self.crypto.subtle.importKey("spki", der, { name: "RSASSA-PKCS1-v1_5", hash }, false, ["verify"]);
    return await self.crypto.subtle.verify("RSASSA-PKCS1-v1_5", key, base64ToBuf(signatureB64), new TextEncoder().encode(plaintext));
  },

  // ─── ECDSA & ECDH ──────────────────────────────────────────────────────────
  async ecdsaGenerateKeyPair(curve: 'P-256' | 'P-384' | 'P-521' = 'P-256', onProgress?: any) {
    const keyPair = await self.crypto.subtle.generateKey({ name: "ECDSA", namedCurve: curve }, true, ["sign", "verify"]);
    const pubDer = await self.crypto.subtle.exportKey("spki", keyPair.publicKey);
    const privDer = await self.crypto.subtle.exportKey("pkcs8", keyPair.privateKey);
    return {
      publicKeyPem: derToPem(pubDer, "PUBLIC KEY"),
      privateKeyPem: derToPem(privDer, "PRIVATE KEY"),
    };
  },

  async ecdsaSign(plaintext: string, privateKeyPem: string, curve: 'P-256' | 'P-384' | 'P-521' = 'P-256', onProgress?: any) {
    const hashAlgo = curve === 'P-256' ? 'SHA-256' : curve === 'P-384' ? 'SHA-384' : 'SHA-512';
    const der = pemToDer(privateKeyPem);
    const key = await self.crypto.subtle.importKey("pkcs8", der, { name: "ECDSA", namedCurve: curve }, false, ["sign"]);
    const sigBuf = await self.crypto.subtle.sign({ name: "ECDSA", hash: hashAlgo }, key, new TextEncoder().encode(plaintext));
    return bufToBase64(sigBuf);
  },

  async ecdsaVerify(plaintext: string, signatureB64: string, publicKeyPem: string, curve: 'P-256' | 'P-384' | 'P-521' = 'P-256', onProgress?: any) {
    const hashAlgo = curve === 'P-256' ? 'SHA-256' : curve === 'P-384' ? 'SHA-384' : 'SHA-512';
    const der = pemToDer(publicKeyPem);
    const key = await self.crypto.subtle.importKey("spki", der, { name: "ECDSA", namedCurve: curve }, false, ["verify"]);
    return await self.crypto.subtle.verify({ name: "ECDSA", hash: hashAlgo }, key, base64ToBuf(signatureB64), new TextEncoder().encode(plaintext));
  },

  async ecdhDeriveSecret(partyAPrivateKeyPem: string, partyBPublicKeyPem: string, curve: 'P-256' | 'P-384' | 'P-521' = 'P-256', onProgress?: any) {
    const privDer = pemToDer(partyAPrivateKeyPem);
    const pubDer = pemToDer(partyBPublicKeyPem);

    const privKey = await self.crypto.subtle.importKey("pkcs8", privDer, { name: "ECDH", namedCurve: curve }, false, ["deriveBits"]);
    const pubKey = await self.crypto.subtle.importKey("spki", pubDer, { name: "ECDH", namedCurve: curve }, false, []);

    const derivedBits = await self.crypto.subtle.deriveBits({ name: "ECDH", public: pubKey }, privKey, 256);
    return bufToHex(derivedBits);
  },

  // ─── KEY DERIVATION (PBKDF2 / HKDF) ────────────────────────────────────────
  async pbkdf2Derive(password: string, salt: string, iterations = 600000, hash = "SHA-256", lengthBits = 256, onProgress?: any) {
    const enc = new TextEncoder();
    const keyMaterial = await self.crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
    const bits = await self.crypto.subtle.deriveBits(
      { name: "PBKDF2", salt: enc.encode(salt), iterations, hash },
      keyMaterial,
      lengthBits
    );
    return { hex: bufToHex(bits), base64: bufToBase64(bits) };
  },

  async hkdfDerive(ikm: string, salt: string, info: string, hash = "SHA-256", lengthBits = 256, onProgress?: any) {
    const enc = new TextEncoder();
    const keyMaterial = await self.crypto.subtle.importKey("raw", enc.encode(ikm), "HKDF", false, ["deriveBits"]);
    const bits = await self.crypto.subtle.deriveBits(
      { name: "HKDF", salt: enc.encode(salt), info: enc.encode(info), hash },
      keyMaterial,
      lengthBits
    );
    return { hex: bufToHex(bits), base64: bufToBase64(bits) };
  }
};

Comlink.expose(api);
export type CryptoWorkerAPI = typeof api;
