const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../src/workers/crypto.worker.ts');
let content = fs.readFileSync(file, 'utf8');

const replacement = `
  async generateHashes(text: string, algos: string[], encoding: 'hex' | 'base64' = 'hex', onProgress: any) {
    if (typeof text !== "string" || text.length > 10 * 1024 * 1024) {
      throw new Error("Input text too large or invalid (max 10MB)");
    }
    const results: Record<string, string> = {};
    const total = algos.length;
    let current = 0;

    for (const algo of algos) {
      if (algo.startsWith("SHA3") || algo === "BLAKE3") {
        const hasher = await getHashWasm(algo);
        hasher.init();
        hasher.update(text);
        const hexStr = hasher.digest('hex');
        results[algo] = encoding === "base64" ? btoa(hexStr.match(/\\w{2}/g)!.map(a => String.fromCharCode(parseInt(a, 16))).join("")) : hexStr;
      } else if (algo === "MD5") {
        const hexStr = md5(text);
        results["MD5"] = encoding === "base64" ? btoa(hexStr.match(/\\w{2}/g)!.map(a => String.fromCharCode(parseInt(a, 16))).join("")) : hexStr;
      } else {
        const buf = await sha(algo, text);
        results[algo] = encoding === 'base64' ? bufToBase64(buf) : bufToHex(buf);
      }
      current++;
      if (onProgress) onProgress({ percent: (current / total) * 100, message: \`Computed \${algo}\` });
    }
    return results;
  },

  async generateFileHash(file: File, algo: string, encoding: 'hex' | 'base64' = 'hex', onProgress: any) {
    if (onProgress) onProgress({ percent: 0, message: "Initializing hasher..." });
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
        onProgress({ percent: Math.round((offset / totalSize) * 100), message: \`Hashing: \${(offset / 1024 / 1024).toFixed(1)} MB / \${(totalSize / 1024 / 1024).toFixed(1)} MB\` });
      }
    }
    const hexStr = hasher.digest('hex');
    const result = encoding === "base64" ? btoa(hexStr.match(/\\w{2}/g)!.map(a => String.fromCharCode(parseInt(a, 16))).join("")) : hexStr;
    if (onProgress) onProgress({ percent: 100, message: "Done!" });
    return result;
  },

  async directoryHashManifest(files: Array<{ path: string; file: File }>, algo: string, encoding: 'hex' | 'base64' = 'hex', onProgress: any) {
    const manifest: Array<{ path: string; size: number; hash: string }> = [];
    const hasher = await getHashWasm(algo);
    for (let i = 0; i < files.length; i++) {
      const item = files[i]!;
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
      const hash = encoding === "base64" ? btoa(hexStr.match(/\\w{2}/g)!.map(a => String.fromCharCode(parseInt(a, 16))).join("")) : hexStr;
      manifest.push({ path: item.path, size: totalSize, hash });
      if (onProgress) onProgress({ percent: Math.round(((i + 1) / files.length) * 100), message: \`Hashed \${item.path}\` });
    }
    return manifest;
  },

  async generateHmac(text: string, key: string, algo: string, encoding: 'hex' | 'base64' = 'hex', onProgress: any) {
    if (onProgress) onProgress({ percent: 10, message: "Importing key..." });
    let result = "";
    if (algo.startsWith("SHA3") || algo === "BLAKE3") {
      const { createHMAC } = await import("hash-wasm");
      const hasher = await getHashWasm(algo);
      const hmacObj = await createHMAC(hasher, key);
      hmacObj.init();
      hmacObj.update(text);
      const hexStr = hmacObj.digest('hex');
      result = encoding === "base64" ? btoa(hexStr.match(/\\w{2}/g)!.map(a => String.fromCharCode(parseInt(a, 16))).join("")) : hexStr;
    } else {
      const buf = await hmac(algo, key, text);
      result = encoding === 'base64' ? bufToBase64(buf) : bufToHex(buf);
    }
    if (onProgress) onProgress({ percent: 100, message: "Done!" });
    return result;
  },

  async generateFileHmac(file: File, key: string, algo: string, encoding: 'hex' | 'base64' = 'hex', onProgress: any) {
    if (onProgress) onProgress({ percent: 0, message: "Initializing HMAC..." });
    let result = "";
    if (algo.startsWith("SHA3") || algo === "BLAKE3") {
      const { createHMAC } = await import("hash-wasm");
      const hasher = await getHashWasm(algo);
      const hmacObj = await createHMAC(hasher, key);
      hmacObj.init();
      const chunkSize = 5 * 1024 * 1024;
      const totalSize = file.size;
      let offset = 0;
      while (offset < totalSize) {
        const slice = file.slice(offset, offset + chunkSize);
        const chunkBuffer = await slice.arrayBuffer();
        hmacObj.update(new Uint8Array(chunkBuffer));
        offset += chunkSize;
        if (onProgress) onProgress({ percent: Math.round((offset / totalSize) * 100), message: \`Hashing: \${(offset / 1024 / 1024).toFixed(1)} MB / \${(totalSize / 1024 / 1024).toFixed(1)} MB\` });
      }
      const hexStr = hmacObj.digest('hex');
      result = encoding === "base64" ? btoa(hexStr.match(/\\w{2}/g)!.map(a => String.fromCharCode(parseInt(a, 16))).join("")) : hexStr;
    } else {
      // Fallback for native Web Crypto HMAC which needs ArrayBuffer
      // Since HMAC with native crypto requires full buffer, we'll read it fully. 
      // But we can just use hash-wasm for EVERYTHING in file HMAC to get streaming!
      const { createHMAC } = await import("hash-wasm");
      const hasher = await getHashWasm(algo);
      const hmacObj = await createHMAC(hasher, key);
      hmacObj.init();
      const chunkSize = 5 * 1024 * 1024;
      const totalSize = file.size;
      let offset = 0;
      while (offset < totalSize) {
        const slice = file.slice(offset, offset + chunkSize);
        const chunkBuffer = await slice.arrayBuffer();
        hmacObj.update(new Uint8Array(chunkBuffer));
        offset += chunkSize;
        if (onProgress) onProgress({ percent: Math.round((offset / totalSize) * 100), message: \`Hashing: \${(offset / 1024 / 1024).toFixed(1)} MB / \${(totalSize / 1024 / 1024).toFixed(1)} MB\` });
      }
      const hexStr = hmacObj.digest('hex');
      result = encoding === "base64" ? btoa(hexStr.match(/\\w{2}/g)!.map(a => String.fromCharCode(parseInt(a, 16))).join("")) : hexStr;
    }
    if (onProgress) onProgress({ percent: 100, message: "Done!" });
    return result;
  },
`;

const getHashWasmCode = `
async function getHashWasm(algo: string) {
  switch (algo.toUpperCase()) {
    case "MD5": { const { createMD5 } = await import("hash-wasm"); return createMD5(); }
    case "SHA-1": { const { createSHA1 } = await import("hash-wasm"); return createSHA1(); }
    case "SHA-224": { const { createSHA224 } = await import("hash-wasm"); return createSHA224(); }
    case "SHA-256": { const { createSHA256 } = await import("hash-wasm"); return createSHA256(); }
    case "SHA-384": { const { createSHA384 } = await import("hash-wasm"); return createSHA384(); }
    case "SHA-512": { const { createSHA512 } = await import("hash-wasm"); return createSHA512(); }
    case "SHA3-224": { const { createSHA3 } = await import("hash-wasm"); return createSHA3(224); }
    case "SHA3-256": { const { createSHA3 } = await import("hash-wasm"); return createSHA3(256); }
    case "SHA3-384": { const { createSHA3 } = await import("hash-wasm"); return createSHA3(384); }
    case "SHA3-512": { const { createSHA3 } = await import("hash-wasm"); return createSHA3(512); }
    case "BLAKE3": { const { createBLAKE3 } = await import("hash-wasm"); return createBLAKE3(); }
    default: throw new Error(\`Algorithm \${algo} not supported by hash-wasm\`);
  }
}
`;

// Regex to replace from `async generateHashes` to the end of `generateHmac`
const startRegex = /async generateHashes\([^)]+\) \{/;
const endStr = "  // ─── AES ENCRYPTION ────────────────────────────────────────────────────────";

const startIndex = content.search(startRegex);
const endIndex = content.indexOf(endStr);

if (startIndex === -1 || endIndex === -1) {
  console.error("Could not find the bounds to replace");
  process.exit(1);
}

// insert getHashWasmCode right before const api
const apiIndex = content.lastIndexOf("const api = {");
let newContent = content.slice(0, apiIndex) + getHashWasmCode + "\n" + content.slice(apiIndex, startIndex) + replacement + "\n" + content.slice(endIndex);

fs.writeFileSync(file, newContent);
console.log("Patched crypto.worker.ts successfully");
