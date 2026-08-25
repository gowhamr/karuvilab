import * as Comlink from "comlink";
// ─── MD5 & SHA-224 Pure JS Fallbacks ────────────────────────────────────────
function md5(input) {
    function cmn(q, a, b, x, s, t) {
        a = (((a + q) & 0xFFFFFFFF) + ((x + t) & 0xFFFFFFFF)) & 0xFFFFFFFF;
        return (((a << s) | (a >>> (32 - s))) + b) & 0xFFFFFFFF;
    }
    function ff(a, b, c, d, x, s, t) { return cmn((b & c) | (~b & d), a, b, x, s, t); }
    function gg(a, b, c, d, x, s, t) { return cmn((b & d) | (c & ~d), a, b, x, s, t); }
    function hh(a, b, c, d, x, s, t) { return cmn(b ^ c ^ d, a, b, x, s, t); }
    function ii(a, b, c, d, x, s, t) { return cmn(c ^ (b | ~d), a, b, x, s, t); }
    const bytes = typeof input === "string" ? new TextEncoder().encode(input) : input;
    const len8 = bytes.length;
    const len64 = (((len8 + 8) >>> 6) + 1) << 4;
    const s = new Uint32Array(len64);
    for (let i = 0; i < len8; i++)
        s[i >> 2] |= bytes[i] << ((i & 3) * 8);
    s[len8 >> 2] |= 0x80 << ((len8 & 3) * 8);
    s[len64 - 2] = len8 * 8;
    let a = 1732584193, b = -271733879, c = -1732584194, d = 271733878;
    for (let i = 0; i < len64; i += 16) {
        const [A, B, C, D] = [a, b, c, d];
        a = ff(a, b, c, d, s[i] ?? 0, 7, -680876936);
        d = ff(d, a, b, c, s[i + 1] ?? 0, 12, -389564586);
        c = ff(c, d, a, b, s[i + 2] ?? 0, 17, 606105819);
        b = ff(b, c, d, a, s[i + 3] ?? 0, 22, -1044525330);
        a = ff(a, b, c, d, s[i + 4] ?? 0, 7, -176418897);
        d = ff(d, a, b, c, s[i + 5] ?? 0, 12, 1200080426);
        c = ff(c, d, a, b, s[i + 6] ?? 0, 17, -1473231341);
        b = ff(b, c, d, a, s[i + 7] ?? 0, 22, -45705983);
        a = ff(a, b, c, d, s[i + 8] ?? 0, 7, 1770035416);
        d = ff(d, a, b, c, s[i + 9] ?? 0, 12, -1958414417);
        c = ff(c, d, a, b, s[i + 10] ?? 0, 17, -42063);
        b = ff(b, c, d, a, s[i + 11] ?? 0, 22, -1990404162);
        a = ff(a, b, c, d, s[i + 12] ?? 0, 7, 1804603682);
        d = ff(d, a, b, c, s[i + 13] ?? 0, 12, -40341101);
        c = ff(c, d, a, b, s[i + 14] ?? 0, 17, -1502002290);
        b = ff(b, c, d, a, s[i + 15] ?? 0, 22, 1236535329);
        a = gg(a, b, c, d, s[i + 1] ?? 0, 5, -165796510);
        d = gg(d, a, b, c, s[i + 6] ?? 0, 9, -1069501632);
        c = gg(c, d, a, b, s[i + 11] ?? 0, 14, 643717713);
        b = gg(b, c, d, a, s[i] ?? 0, 20, -373897302);
        a = gg(a, b, c, d, s[i + 5] ?? 0, 5, -701558691);
        d = gg(d, a, b, c, s[i + 10] ?? 0, 9, 38016083);
        c = gg(c, d, a, b, s[i + 15] ?? 0, 14, -660478335);
        b = gg(b, c, d, a, s[i + 4] ?? 0, 20, -405537848);
        a = gg(a, b, c, d, s[i + 9] ?? 0, 5, 568446438);
        d = gg(d, a, b, c, s[i + 14] ?? 0, 9, -1019803690);
        c = gg(c, d, a, b, s[i + 3] ?? 0, 14, -187363961);
        b = gg(b, c, d, a, s[i + 8] ?? 0, 20, 1163531501);
        a = gg(a, b, c, d, s[i + 13] ?? 0, 5, -1444681467);
        d = gg(d, a, b, c, s[i + 2] ?? 0, 9, -51403784);
        c = gg(c, d, a, b, s[i + 7] ?? 0, 14, 1735328473);
        b = gg(b, c, d, a, s[i + 12] ?? 0, 20, -1926607734);
        a = hh(a, b, c, d, s[i + 5] ?? 0, 4, -378558);
        d = hh(d, a, b, c, s[i + 8] ?? 0, 11, -2022574463);
        c = hh(c, d, a, b, s[i + 11] ?? 0, 16, 1839030562);
        b = hh(b, c, d, a, s[i + 14] ?? 0, 23, -35309556);
        a = hh(a, b, c, d, s[i + 1] ?? 0, 4, -1530992060);
        d = hh(d, a, b, c, s[i + 4] ?? 0, 11, 1272893353);
        c = hh(c, d, a, b, s[i + 7] ?? 0, 16, -155497632);
        b = hh(b, c, d, a, s[i + 10] ?? 0, 23, -1094730640);
        a = hh(a, b, c, d, s[i + 13] ?? 0, 4, 681279174);
        d = hh(d, a, b, c, s[i] ?? 0, 11, -358537222);
        c = hh(c, d, a, b, s[i + 3] ?? 0, 16, -722521979);
        b = hh(b, c, d, a, s[i + 6] ?? 0, 23, 76029189);
        a = hh(a, b, c, d, s[i + 9] ?? 0, 4, -640364487);
        d = hh(d, a, b, c, s[i + 12] ?? 0, 11, -421815835);
        c = hh(c, d, a, b, s[i + 15] ?? 0, 16, 530742520);
        b = hh(b, c, d, a, s[i + 2] ?? 0, 23, -995338651);
        a = ii(a, b, c, d, s[i] ?? 0, 6, -198630844);
        d = ii(d, a, b, c, s[i + 7] ?? 0, 10, 1126891415);
        c = ii(c, d, a, b, s[i + 14] ?? 0, 15, -1416354905);
        b = ii(b, c, d, a, s[i + 5] ?? 0, 21, -57434055);
        a = ii(a, b, c, d, s[i + 12] ?? 0, 6, 1700485571);
        d = ii(d, a, b, c, s[i + 3] ?? 0, 10, -1894986606);
        c = ii(c, d, a, b, s[i + 10] ?? 0, 15, -1051523);
        b = ii(b, c, d, a, s[i + 1] ?? 0, 21, -2054922799);
        a = ii(a, b, c, d, s[i + 8] ?? 0, 6, 1873313359);
        d = ii(d, a, b, c, s[i + 15] ?? 0, 10, -30611744);
        c = ii(c, d, a, b, s[i + 6] ?? 0, 15, -1560198380);
        b = ii(b, c, d, a, s[i + 13] ?? 0, 21, 1309151649);
        a = ii(a, b, c, d, s[i + 4] ?? 0, 6, -145523070);
        d = ii(d, a, b, c, s[i + 11] ?? 0, 10, -1120210379);
        c = ii(c, d, a, b, s[i + 2] ?? 0, 15, 718787259);
        b = ii(b, c, d, a, s[i + 9] ?? 0, 21, -343485551);
        a = (a + A) & 0xFFFFFFFF;
        b = (b + B) & 0xFFFFFFFF;
        c = (c + C) & 0xFFFFFFFF;
        d = (d + D) & 0xFFFFFFFF;
    }
    return [a, b, c, d]
        .map(v => Array.from({ length: 4 }, (_, i) => ((v >>> (i * 8)) & 0xFF).toString(16).padStart(2, "0")).join(""))
        .join("");
}
function bufToHex(buf) {
    return Array.from(new Uint8Array(buf))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
}
function bufToBase64(buf) {
    let binary = "";
    const bytes = new Uint8Array(buf);
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}
function base64ToBuf(b64) {
    const binary = atob(b64.replace(/\s/g, ""));
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++)
        bytes[i] = binary.charCodeAt(i);
    return bytes.buffer;
}
function pemToDer(pem) {
    const b64 = pem.replace(/-----[^-]+-----/g, "").replace(/\s/g, "");
    return base64ToBuf(b64);
}
function derToPem(der, type) {
    const b64 = bufToBase64(der);
    const lines = b64.match(/.{1,64}/g)?.join("\n") ?? b64;
    return `-----BEGIN ${type}-----\n${lines}\n-----END ${type}-----`;
}
function sha224_js(input) {
    const K = new Uint32Array([
        0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
        0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
        0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
        0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
        0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
        0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
        0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
        0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ]);
    const H = new Uint32Array([
        0xc1059ed8, 0x367cd507, 0x3070dd17, 0xf70e5939,
        0xffc00b31, 0x68581511, 0x64f98fa7, 0xbefa4fa4
    ]);
    const bytes = typeof input === "string" ? new TextEncoder().encode(input) : input;
    const len = bytes.length;
    const blocks = (((len + 8) >> 6) + 1);
    const W = new Uint32Array(64);
    for (let i = 0; i < blocks; i++) {
        for (let j = 0; j < 16; j++) {
            const offset = i * 64 + j * 4;
            let val = 0;
            for (let k = 0; k < 4; k++) {
                const p = offset + k;
                if (p < len)
                    val = (val << 8) | bytes[p];
                else if (p === len)
                    val = (val << 8) | 0x80;
                else
                    val = val << 8;
            }
            W[j] = val;
        }
        if (i === blocks - 1) {
            const lenBits = len * 8;
            W[14] = Math.floor(lenBits / 0x100000000);
            W[15] = lenBits & 0xFFFFFFFF;
        }
        for (let j = 16; j < 64; j++) {
            const w15 = W[j - 15], w2 = W[j - 2];
            const s0 = (w15 >>> 7 | w15 << 25) ^ (w15 >>> 18 | w15 << 14) ^ (w15 >>> 3);
            const s1 = (w2 >>> 17 | w2 << 15) ^ (w2 >>> 19 | w2 << 13) ^ (w2 >>> 10);
            W[j] = (W[j - 16] + s0 + W[j - 7] + s1) | 0;
        }
        let a = H[0], b = H[1], c = H[2], d = H[3], e = H[4], f = H[5], g = H[6], h = H[7];
        for (let j = 0; j < 64; j++) {
            const s1 = (e >>> 6 | e << 26) ^ (e >>> 11 | e << 21) ^ (e >>> 25 | e << 7);
            const ch = (e & f) ^ (~e & g);
            const temp1 = (h + s1 + ch + K[j] + W[j]) | 0;
            const s0 = (a >>> 2 | a << 30) ^ (a >>> 13 | a << 19) ^ (a >>> 22 | a << 10);
            const maj = (a & b) ^ (a & c) ^ (b & c);
            const temp2 = (s0 + maj) | 0;
            h = g;
            g = f;
            f = e;
            e = (d + temp1) | 0;
            d = c;
            c = b;
            b = a;
            a = (temp1 + temp2) | 0;
        }
        H[0] = (H[0] + a) | 0;
        H[1] = (H[1] + b) | 0;
        H[2] = (H[2] + c) | 0;
        H[3] = (H[3] + d) | 0;
        H[4] = (H[4] + e) | 0;
        H[5] = (H[5] + f) | 0;
        H[6] = (H[6] + g) | 0;
        H[7] = (H[7] + h) | 0;
    }
    const buffer = new ArrayBuffer(28);
    const view = new DataView(buffer);
    for (let i = 0; i < 7; i++)
        view.setUint32(i * 4, H[i], false);
    return buffer;
}
function hmac_sha224_js(key, message) {
    let keyBytes = new TextEncoder().encode(key);
    const msgBytes = typeof message === "string" ? new TextEncoder().encode(message) : message;
    if (keyBytes.length > 64) {
        keyBytes = new Uint8Array(sha224_js(keyBytes));
    }
    const oKeyPad = new Uint8Array(64);
    const iKeyPad = new Uint8Array(64);
    for (let i = 0; i < 64; i++) {
        const b = i < keyBytes.length ? keyBytes[i] : 0;
        oKeyPad[i] = b ^ 0x5c;
        iKeyPad[i] = b ^ 0x36;
    }
    const innerInput = new Uint8Array(64 + msgBytes.length);
    innerInput.set(iKeyPad);
    innerInput.set(msgBytes, 64);
    const innerHash = new Uint8Array(sha224_js(innerInput));
    const outerInput = new Uint8Array(64 + 28);
    outerInput.set(oKeyPad);
    outerInput.set(innerHash, 64);
    return sha224_js(outerInput);
}
async function sha(algo, input) {
    const bytes = typeof input === "string" ? new TextEncoder().encode(input) : input;
    if (algo === "SHA224" || algo === "SHA-224") {
        return sha224_js(bytes);
    }
    const cryptoProvider = self.crypto || globalThis.crypto;
    if (!cryptoProvider?.subtle) {
        throw new Error("Web Crypto API (subtle) is not available.");
    }
    const webCryptoAlgo = algo.replace(/SHA-?/, "SHA-");
    const res = await cryptoProvider.subtle.digest(webCryptoAlgo, bytes.buffer);
    return res;
}
async function hmac(algo, key, input) {
    if (algo === "SHA224" || algo === "SHA-224") {
        return hmac_sha224_js(key, input);
    }
    const encoder = new TextEncoder();
    const keyData = encoder.encode(key);
    const data = typeof input === "string" ? encoder.encode(input) : input;
    const cryptoProvider = self.crypto || globalThis.crypto;
    const webCryptoAlgo = algo.replace(/SHA-?/, "SHA-");
    const cryptoKey = await cryptoProvider.subtle.importKey("raw", keyData, { name: "HMAC", hash: { name: webCryptoAlgo } }, false, ["sign"]);
    return await cryptoProvider.subtle.sign("HMAC", cryptoKey, data);
}
async function getHashWasm(algo) {
    switch (algo.toUpperCase()) {
        case "MD5": {
            const { createMD5 } = await import("hash-wasm");
            return createMD5();
        }
        case "SHA-1": {
            const { createSHA1 } = await import("hash-wasm");
            return createSHA1();
        }
        case "SHA-224": {
            const { createSHA224 } = await import("hash-wasm");
            return createSHA224();
        }
        case "SHA-256": {
            const { createSHA256 } = await import("hash-wasm");
            return createSHA256();
        }
        case "SHA-384": {
            const { createSHA384 } = await import("hash-wasm");
            return createSHA384();
        }
        case "SHA-512": {
            const { createSHA512 } = await import("hash-wasm");
            return createSHA512();
        }
        case "SHA3-224": {
            const { createSHA3 } = await import("hash-wasm");
            return createSHA3(224);
        }
        case "SHA3-256": {
            const { createSHA3 } = await import("hash-wasm");
            return createSHA3(256);
        }
        case "SHA3-384": {
            const { createSHA3 } = await import("hash-wasm");
            return createSHA3(384);
        }
        case "SHA3-512": {
            const { createSHA3 } = await import("hash-wasm");
            return createSHA3(512);
        }
        case "BLAKE3": {
            const { createBLAKE3 } = await import("hash-wasm");
            return createBLAKE3();
        }
        default: throw new Error(`Algorithm ${algo} not supported by hash-wasm`);
    }
}
const api = {
    // ─── HASHING & HMAC ────────────────────────────────────────────────────────
    async generateHashes(text, algos, encoding = 'hex', onProgress) {
        if (typeof text !== "string" || text.length > 10 * 1024 * 1024) {
            throw new Error("Input text too large or invalid (max 10MB)");
        }
        const results = {};
        const total = algos.length;
        let current = 0;
        for (const algo of algos) {
            if (algo.startsWith("SHA3") || algo === "BLAKE3") {
                const hasher = await getHashWasm(algo);
                hasher.init();
                hasher.update(text);
                const hexStr = hasher.digest('hex');
                results[algo] = encoding === "base64" ? btoa(hexStr.match(/\w{2}/g).map(a => String.fromCharCode(parseInt(a, 16))).join("")) : hexStr;
            }
            else if (algo === "MD5") {
                const hexStr = md5(text);
                results["MD5"] = encoding === "base64" ? btoa(hexStr.match(/\w{2}/g).map(a => String.fromCharCode(parseInt(a, 16))).join("")) : hexStr;
            }
            else {
                const buf = await sha(algo, text);
                results[algo] = encoding === 'base64' ? bufToBase64(buf) : bufToHex(buf);
            }
            current++;
            if (onProgress)
                onProgress({ percent: (current / total) * 100, message: `Computed ${algo}` });
        }
        return results;
    },
    async generateFileHash(file, algo, encoding = 'hex', onProgress) {
        if (onProgress)
            onProgress({ percent: 0, message: "Initializing hasher..." });
        const hasher = await getHashWasm(algo);
        hasher.init();
        const chunkSize = 5 * 1024 * 1024; // 5 MB chunks
        const totalSize = file.size;
        let offset = 0;
        while (offset < totalSize) {
            const slice = file.slice(offset, offset + chunkSize);
            const chunkBuffer = await slice.arrayBuffer();
            hasher.update(new Uint8Array(chunkBuffer));
            offset += chunkSize;
            if (onProgress) {
                onProgress({ percent: Math.round((offset / totalSize) * 100), message: `Hashing: ${(offset / 1024 / 1024).toFixed(1)} MB / ${(totalSize / 1024 / 1024).toFixed(1)} MB` });
            }
        }
        const hexStr = hasher.digest('hex');
        const result = encoding === "base64" ? btoa(hexStr.match(/\w{2}/g).map(a => String.fromCharCode(parseInt(a, 16))).join("")) : hexStr;
        if (onProgress)
            onProgress({ percent: 100, message: "Done!" });
        return result;
    },
    async directoryHashManifest(files, algo, encoding = 'hex', onProgress) {
        const manifest = [];
        const hasher = await getHashWasm(algo);
        for (let i = 0; i < files.length; i++) {
            const item = files[i];
            hasher.init();
            const chunkSize = 5 * 1024 * 1024;
            const totalSize = item.file.size;
            let offset = 0;
            while (offset < totalSize) {
                const slice = item.file.slice(offset, offset + chunkSize);
                const chunkBuffer = await slice.arrayBuffer();
                hasher.update(new Uint8Array(chunkBuffer));
                offset += chunkSize;
            }
            const hexStr = hasher.digest('hex');
            const hash = encoding === "base64" ? btoa(hexStr.match(/\w{2}/g).map(a => String.fromCharCode(parseInt(a, 16))).join("")) : hexStr;
            manifest.push({ path: item.path, size: totalSize, hash });
            if (onProgress)
                onProgress({ percent: Math.round(((i + 1) / files.length) * 100), message: `Hashed ${item.path}` });
        }
        return manifest;
    },
    async generateHmac(text, key, algo, encoding = 'hex', onProgress) {
        if (onProgress)
            onProgress({ percent: 10, message: "Importing key..." });
        let result = "";
        if (algo.startsWith("SHA3") || algo === "BLAKE3") {
            const { createHMAC } = await import("hash-wasm");
            const hmacObj = await createHMAC(getHashWasm(algo), key);
            hmacObj.init();
            hmacObj.update(text);
            const hexStr = hmacObj.digest('hex');
            result = encoding === "base64" ? btoa(hexStr.match(/\w{2}/g).map(a => String.fromCharCode(parseInt(a, 16))).join("")) : hexStr;
        }
        else {
            const buf = await hmac(algo, key, text);
            result = encoding === 'base64' ? bufToBase64(buf) : bufToHex(buf);
        }
        if (onProgress)
            onProgress({ percent: 100, message: "Done!" });
        return result;
    },
    async generateFileHmac(file, key, algo, encoding = 'hex', onProgress) {
        if (onProgress)
            onProgress({ percent: 0, message: "Initializing HMAC..." });
        let result = "";
        const { createHMAC } = await import("hash-wasm");
        const hmacObj = await createHMAC(getHashWasm(algo), key);
        hmacObj.init();
        if (file instanceof ArrayBuffer) {
            hmacObj.update(new Uint8Array(file));
        }
        else {
            const chunkSize = 5 * 1024 * 1024;
            const totalSize = file.size;
            let offset = 0;
            while (offset < totalSize) {
                const slice = file.slice(offset, offset + chunkSize);
                const chunkBuffer = await slice.arrayBuffer();
                hmacObj.update(new Uint8Array(chunkBuffer));
                offset += chunkSize;
                if (onProgress)
                    onProgress({ percent: Math.round((offset / totalSize) * 100), message: `Hashing: ${(offset / 1024 / 1024).toFixed(1)} MB / ${(totalSize / 1024 / 1024).toFixed(1)} MB` });
            }
        }
        const hexStr = hmacObj.digest('hex');
        result = encoding === "base64" ? btoa(hexStr.match(/\w{2}/g).map(a => String.fromCharCode(parseInt(a, 16))).join("")) : hexStr;
        if (onProgress)
            onProgress({ percent: 100, message: "Done!" });
        return result;
    },
    // ─── AES ENCRYPTION ────────────────────────────────────────────────────────
    async aesEncrypt(plaintext, passwordOrHexKey, mode = 'GCM', keySize = 256, isRawKey = false, customIvHex, onProgress) {
        const enc = new TextEncoder();
        let iv;
        if (customIvHex) {
            const ivMatch = customIvHex.match(/[\da-f]{2}/gi);
            if (!ivMatch)
                throw new Error("Invalid IV hex string");
            iv = new Uint8Array(ivMatch.map(h => parseInt(h, 16)));
        }
        else {
            iv = self.crypto.getRandomValues(new Uint8Array(mode === 'GCM' ? 12 : 16));
        }
        let key;
        let salt = new Uint8Array(0);
        if (isRawKey) {
            if (onProgress)
                onProgress({ percent: 20, message: "Using raw AES key..." });
            const keyMatch = passwordOrHexKey.match(/[\da-f]{2}/gi);
            if (!keyMatch)
                throw new Error("Invalid hex key string");
            const keyBytes = new Uint8Array(keyMatch.map(h => parseInt(h, 16)));
            if (keyBytes.length * 8 !== keySize) {
                throw new Error(`Raw key length (${keyBytes.length * 8} bits) does not match expected size (${keySize} bits)`);
            }
            key = await self.crypto.subtle.importKey("raw", keyBytes, { name: `AES-${mode}`, length: keySize }, false, ["encrypt"]);
        }
        else {
            salt = self.crypto.getRandomValues(new Uint8Array(16));
            if (onProgress)
                onProgress({ percent: 20, message: "Deriving AES key using PBKDF2..." });
            const keyMaterial = await self.crypto.subtle.importKey("raw", enc.encode(passwordOrHexKey), "PBKDF2", false, ["deriveKey"]);
            key = await self.crypto.subtle.deriveKey({ name: "PBKDF2", salt, iterations: 600000, hash: "SHA-256" }, keyMaterial, { name: `AES-${mode}`, length: keySize }, false, ["encrypt"]);
        }
        if (onProgress)
            onProgress({ percent: 60, message: "Encrypting plaintext..." });
        const cipherBuf = await self.crypto.subtle.encrypt({ name: `AES-${mode}`, iv: iv }, key, enc.encode(plaintext));
        let combined;
        if (isRawKey) {
            // For raw key mode, we return just IV + ciphertext
            combined = new Uint8Array(iv.length + cipherBuf.byteLength);
            combined.set(iv, 0);
            combined.set(new Uint8Array(cipherBuf), iv.length);
        }
        else {
            combined = new Uint8Array(salt.length + iv.length + cipherBuf.byteLength);
            combined.set(salt, 0);
            combined.set(iv, 16);
            combined.set(new Uint8Array(cipherBuf), 16 + iv.length);
        }
        if (onProgress)
            onProgress({ percent: 100, message: "Done!" });
        return {
            ciphertextBase64: bufToBase64(combined.buffer),
            ivHex: bufToHex(iv.buffer)
        };
    },
    async aesDecrypt(ciphertextB64, passwordOrHexKey, mode = 'GCM', keySize = 256, isRawKey = false, customIvHex, onProgress) {
        const combined = new Uint8Array(base64ToBuf(ciphertextB64));
        const ivLen = mode === 'GCM' ? 12 : 16;
        let iv;
        let cipher;
        let key;
        if (isRawKey) {
            if (customIvHex) {
                const ivMatch = customIvHex.match(/[\da-f]{2}/gi);
                if (!ivMatch)
                    throw new Error("Invalid IV hex string");
                iv = new Uint8Array(ivMatch.map(h => parseInt(h, 16)));
                cipher = combined; // In this case, we expect just the ciphertext if IV is external.
                // Actually, let's assume the combined buffer is still IV + ciphertext
                // if customIvHex is not provided, or just ciphertext if customIvHex is provided.
                // Wait, to keep it simple: if customIvHex is provided, we assume combined is just ciphertext.
                // But if combined includes IV, we should extract it.
                // Let's assume standard format for our app: IV + ciphertext (raw) or SALT + IV + ciphertext (PBKDF2).
                if (customIvHex) {
                    cipher = combined; // Assume pure ciphertext input if custom IV is explicitly given
                }
                else {
                    iv = combined.slice(0, ivLen);
                    cipher = combined.slice(ivLen);
                }
            }
            else {
                iv = combined.slice(0, ivLen);
                cipher = combined.slice(ivLen);
            }
            const keyMatch = passwordOrHexKey.match(/[\da-f]{2}/gi);
            if (!keyMatch)
                throw new Error("Invalid hex key string");
            const keyBytes = new Uint8Array(keyMatch.map(h => parseInt(h, 16)));
            if (onProgress)
                onProgress({ percent: 20, message: "Using raw AES key..." });
            key = await self.crypto.subtle.importKey("raw", keyBytes, { name: `AES-${mode}`, length: keySize }, false, ["decrypt"]);
        }
        else {
            const salt = combined.slice(0, 16);
            iv = combined.slice(16, 16 + ivLen);
            cipher = combined.slice(16 + ivLen);
            if (onProgress)
                onProgress({ percent: 20, message: "Deriving AES key..." });
            const keyMaterial = await self.crypto.subtle.importKey("raw", new TextEncoder().encode(passwordOrHexKey), "PBKDF2", false, ["deriveKey"]);
            key = await self.crypto.subtle.deriveKey({ name: "PBKDF2", salt, iterations: 600000, hash: "SHA-256" }, keyMaterial, { name: `AES-${mode}`, length: keySize }, false, ["decrypt"]);
        }
        if (onProgress)
            onProgress({ percent: 60, message: "Decrypting ciphertext..." });
        const plainBuf = await self.crypto.subtle.decrypt({ name: `AES-${mode}`, iv: iv }, key, cipher);
        if (onProgress)
            onProgress({ percent: 100, message: "Done!" });
        return new TextDecoder().decode(plainBuf);
    },
    // ─── RSA KEY GEN & ENCRYPTION ──────────────────────────────────────────────
    async generateRsaKeyPair(modulusLength = 2048, hash = 'SHA-256', onProgress) {
        if (onProgress)
            onProgress({ percent: 20, message: `Generating RSA ${modulusLength}-bit keypair...` });
        const keyPair = await self.crypto.subtle.generateKey({ name: "RSA-OAEP", modulusLength, publicExponent: new Uint8Array([1, 0, 1]), hash }, true, ["encrypt", "decrypt"]);
        if (onProgress)
            onProgress({ percent: 70, message: "Exporting PEM keys..." });
        const pubDer = await self.crypto.subtle.exportKey("spki", keyPair.publicKey);
        const privDer = await self.crypto.subtle.exportKey("pkcs8", keyPair.privateKey);
        return {
            publicKeyPem: derToPem(pubDer, "PUBLIC KEY"),
            privateKeyPem: derToPem(privDer, "PRIVATE KEY"),
        };
    },
    async rsaEncrypt(plaintext, publicKeyPem, hash = 'SHA-256', onProgress) {
        const der = pemToDer(publicKeyPem);
        const key = await self.crypto.subtle.importKey("spki", der, { name: "RSA-OAEP", hash }, false, ["encrypt"]);
        const cipherBuf = await self.crypto.subtle.encrypt({ name: "RSA-OAEP" }, key, new TextEncoder().encode(plaintext));
        return bufToBase64(cipherBuf);
    },
    async rsaDecrypt(ciphertextB64, privateKeyPem, hash = 'SHA-256', onProgress) {
        const der = pemToDer(privateKeyPem);
        const key = await self.crypto.subtle.importKey("pkcs8", der, { name: "RSA-OAEP", hash }, false, ["decrypt"]);
        const plainBuf = await self.crypto.subtle.decrypt({ name: "RSA-OAEP" }, key, base64ToBuf(ciphertextB64));
        return new TextDecoder().decode(plainBuf);
    },
    async rsaSign(plaintext, privateKeyPem, hash = 'SHA-256', onProgress) {
        const der = pemToDer(privateKeyPem);
        const key = await self.crypto.subtle.importKey("pkcs8", der, { name: "RSASSA-PKCS1-v1_5", hash }, false, ["sign"]);
        const sigBuf = await self.crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, new TextEncoder().encode(plaintext));
        return bufToBase64(sigBuf);
    },
    async rsaVerify(plaintext, signatureB64, publicKeyPem, hash = 'SHA-256', onProgress) {
        const der = pemToDer(publicKeyPem);
        const key = await self.crypto.subtle.importKey("spki", der, { name: "RSASSA-PKCS1-v1_5", hash }, false, ["verify"]);
        return await self.crypto.subtle.verify("RSASSA-PKCS1-v1_5", key, base64ToBuf(signatureB64), new TextEncoder().encode(plaintext));
    },
    // ─── ECDSA & ECDH ──────────────────────────────────────────────────────────
    async ecdsaGenerateKeyPair(curve = 'P-256', onProgress) {
        const keyPair = await self.crypto.subtle.generateKey({ name: "ECDSA", namedCurve: curve }, true, ["sign", "verify"]);
        const pubDer = await self.crypto.subtle.exportKey("spki", keyPair.publicKey);
        const privDer = await self.crypto.subtle.exportKey("pkcs8", keyPair.privateKey);
        return {
            publicKeyPem: derToPem(pubDer, "PUBLIC KEY"),
            privateKeyPem: derToPem(privDer, "PRIVATE KEY"),
        };
    },
    async ecdhGenerateKeyPair(curve = 'P-256', onProgress) {
        const keyPair = await self.crypto.subtle.generateKey({ name: "ECDH", namedCurve: curve }, true, ["deriveBits", "deriveKey"]);
        const pubDer = await self.crypto.subtle.exportKey("spki", keyPair.publicKey);
        const privDer = await self.crypto.subtle.exportKey("pkcs8", keyPair.privateKey);
        return {
            publicKeyPem: derToPem(pubDer, "PUBLIC KEY"),
            privateKeyPem: derToPem(privDer, "PRIVATE KEY"),
        };
    },
    async ecdsaSign(plaintext, privateKeyPem, curve = 'P-256', onProgress) {
        const hashAlgo = curve === 'P-256' ? 'SHA-256' : curve === 'P-384' ? 'SHA-384' : 'SHA-512';
        const der = pemToDer(privateKeyPem);
        const key = await self.crypto.subtle.importKey("pkcs8", der, { name: "ECDSA", namedCurve: curve }, false, ["sign"]);
        const sigBuf = await self.crypto.subtle.sign({ name: "ECDSA", hash: hashAlgo }, key, new TextEncoder().encode(plaintext));
        return bufToBase64(sigBuf);
    },
    async ecdsaVerify(plaintext, signatureB64, publicKeyPem, curve = 'P-256', onProgress) {
        const hashAlgo = curve === 'P-256' ? 'SHA-256' : curve === 'P-384' ? 'SHA-384' : 'SHA-512';
        const der = pemToDer(publicKeyPem);
        const key = await self.crypto.subtle.importKey("spki", der, { name: "ECDSA", namedCurve: curve }, false, ["verify"]);
        return await self.crypto.subtle.verify({ name: "ECDSA", hash: hashAlgo }, key, base64ToBuf(signatureB64), new TextEncoder().encode(plaintext));
    },
    async ecdhDeriveSecret(partyAPrivateKeyPem, partyBPublicKeyPem, curve = 'P-256', onProgress) {
        const privDer = pemToDer(partyAPrivateKeyPem);
        const pubDer = pemToDer(partyBPublicKeyPem);
        const privKey = await self.crypto.subtle.importKey("pkcs8", privDer, { name: "ECDH", namedCurve: curve }, false, ["deriveBits"]);
        const pubKey = await self.crypto.subtle.importKey("spki", pubDer, { name: "ECDH", namedCurve: curve }, false, []);
        const derivedBits = await self.crypto.subtle.deriveBits({ name: "ECDH", public: pubKey }, privKey, 256);
        return bufToHex(derivedBits);
    },
    // ─── KEY DERIVATION (PBKDF2 / HKDF) ────────────────────────────────────────
    async pbkdf2Derive(password, salt, iterations = 600000, hash = "SHA-256", lengthBits = 256, onProgress) {
        const enc = new TextEncoder();
        const keyMaterial = await self.crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
        const bits = await self.crypto.subtle.deriveBits({ name: "PBKDF2", salt: enc.encode(salt), iterations, hash }, keyMaterial, lengthBits);
        return { hex: bufToHex(bits), base64: bufToBase64(bits) };
    },
    async hkdfDerive(ikm, salt, info, hash = "SHA-256", lengthBits = 256, onProgress) {
        const enc = new TextEncoder();
        const keyMaterial = await self.crypto.subtle.importKey("raw", enc.encode(ikm), "HKDF", false, ["deriveBits"]);
        const bits = await self.crypto.subtle.deriveBits({ name: "HKDF", salt: enc.encode(salt), info: enc.encode(info), hash }, keyMaterial, lengthBits);
        return { hex: bufToHex(bits), base64: bufToBase64(bits) };
    }
};
Comlink.expose(api);
