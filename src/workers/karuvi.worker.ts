import * as Comlink from "comlink";
import { WorkerAPI, CompressionSettings, EmiInputs, EmiResult, DiffLine } from "./types";

// MD5 implementation (from core.worker.ts)
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
    a=ff(a,b,c,d,s[i]!,7,-680876936); d=ff(d,a,b,c,s[i+1]!,12,-389564586); c=ff(c,d,a,b,s[i+2]!,17,606105819); b=ff(b,c,d,a,s[i+3]!,22,-1044525330);
    a=ff(a,b,c,d,s[i+4]!,7,-176418897); d=ff(d,a,b,c,s[i+5]!,12,1200080426); c=ff(c,d,a,b,s[i+6]!,17,-1473231341); b=ff(b,c,d,a,s[i+7]!,22,-45705983);
    a=ff(a,b,c,d,s[i+8]!,7,1770035416); d=ff(d,a,b,c,s[i+9]!,12,-1958414417); c=ff(c,d,a,b,s[i+10]!,17,-42063); b=ff(b,c,d,a,s[i+11]!,22,-1990404162);
    a=ff(a,b,c,d,s[i+12]!,7,1804603682); d=ff(d,a,b,c,s[i+13]!,12,-40341101); c=ff(c,d,a,b,s[i+14]!,17,-1502002290); b=ff(b,c,d,a,s[i+15]!,22,1236535329);
    a=gg(a,b,c,d,s[i+1]!,5,-165796510); d=gg(d,a,b,c,s[i+6]!,9,-1069501632); c=gg(c,d,a,b,s[i+11]!,14,643717713); b=gg(b,c,d,a,s[i]!,20,-373897302);
    a=gg(a,b,c,d,s[i+5]!,5,-701558691); d=gg(d,a,b,c,s[i+10]!,9,38016083); c=gg(c,d,a,b,s[i+15]!,14,-660478335); b=gg(b,c,d,a,s[i+4]!,20,-405537848);
    a=gg(a,b,c,d,s[i+9]!,5,568446438); d=gg(d,a,b,c,s[i+14]!,9,-1019803690); c=gg(c,d,a,b,s[i+3]!,14,-187363961); b=gg(b,c,d,a,s[i+8]!,20,1163531501);
    a=gg(a,b,c,d,s[i+13]!,5,-1444681467); d=gg(d,a,b,c,s[i+2]!,9,-51403784); c=gg(c,d,a,b,s[i+7]!,14,1735328473); b=gg(b,c,d,a,s[i+12]!,20,-1926607734);
    a=hh(a,b,c,d,s[i+5]!,4,-378558); d=hh(d,a,b,c,s[i+8]!,11,-2022574463); c=hh(c,d,a,b,s[i+11]!,16,1839030562); b=hh(b,c,d,a,s[i+14]!,23,-35309556);
    a=hh(a,b,c,d,s[i+1]!,4,-1530992060); d=hh(d,a,b,c,s[i+4]!,11,1272893353); c=hh(c,d,a,b,s[i+7]!,16,-155497632); b=hh(b,c,d,a,s[i+10]!,23,-1094730640);
    a=hh(a,b,c,d,s[i+13]!,4,681279174); d=hh(d,a,b,c,s[i]!,11,-358537222); c=hh(c,d,a,b,s[i+3]!,16,-722521979); b=hh(b,c,d,a,s[i+6]!,23,76029189);
    a=hh(a,b,c,d,s[i+9]!,4,-640364487); d=hh(d,a,b,c,s[i+12]!,11,-421815835); c=hh(c,d,a,b,s[i+15]!,16,530742520); b=hh(b,c,d,a,s[i+2]!,23,-995338651);
    a=ii(a,b,c,d,s[i]!,6,-198630844); d=ii(d,a,b,c,s[i+7]!,10,1126891415); c=ii(c,d,a,b,s[i+14]!,15,-1416354905); b=ii(b,c,d,a,s[i+5]!,21,-57434055);
    a=ii(a,b,c,d,s[i+12]!,6,1700485571); d=ii(d,a,b,c,s[i+3]!,10,-1894986606); c=ii(c,d,a,b,s[i+10]!,15,-1051523); b=ii(b,c,d,a,s[i+1]!,21,-2054922799);
    a=ii(a,b,c,d,s[i+8]!,6,1873313359); d=ii(d,a,b,c,s[i+15]!,10,-30611744); c=ii(c,d,a,b,s[i+6]!,15,-1560198380); b=ii(b,c,d,a,s[i+13]!,21,1309151649);
    a=ii(a,b,c,d,s[i+4]!,6,-145523070); d=ii(d,a,b,c,s[i+11]!,10,-1120210379); c=ii(c,d,a,b,s[i+2]!,15,718787259); b=ii(b,c,d,a,s[i+9]!,21,-343485551);
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

async function sha(algo: string, input: string | Uint8Array): Promise<ArrayBuffer> {
  const bytes = typeof input === "string" ? new TextEncoder().encode(input) : input;
  return await crypto.subtle.digest(algo, bytes.buffer as ArrayBuffer);
}

async function hmac(algo: string, key: string, input: string | Uint8Array): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(key);
  const data = typeof input === "string" ? encoder.encode(input) : input;
  
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: { name: algo.replace("SHA-", "SHA") } },
    false,
    ["sign"]
  );
  
  return await crypto.subtle.sign("HMAC", cryptoKey, data as any);
}

const api: WorkerAPI = {
  // Hash Tasks
  async generateHashes(text: string, algos: string[], encoding: 'hex' | 'base64' = 'hex', onProgress) {
    if (typeof text !== "string" || text.length > 10 * 1024 * 1024) {
      throw new Error("Input text too large or invalid (max 10MB)");
    }
    const results: Record<string, string> = {};
    const total = algos.length;
    let current = 0;
    
    if (algos.includes("MD5")) {
      results["MD5"] = md5(text); // MD5 is already hex string in this implementation
      // TODO: if encoding is base64, convert MD5 hex to base64 if needed, 
      // but usually MD5 is always hex.
      current++;
      if (onProgress) onProgress({ percent: (current / total) * 100, message: "Computed MD5" });
    }
    
    for (const algo of algos.filter(a => a !== "MD5")) {
      const buf = await sha(algo, text);
      results[algo] = encoding === 'base64' ? bufToBase64(buf) : bufToHex(buf);
      current++;
      if (onProgress) onProgress({ percent: (current / total) * 100, message: `Computed ${algo}` });
    }
    
    return results;
  },

  async generateFileHash(file: ArrayBuffer, algo: string, encoding: 'hex' | 'base64' = 'hex', onProgress) {
    if (onProgress) onProgress({ percent: 10, message: "Starting hash computation..." });
    let result = "";
    const bytes = new Uint8Array(file);
    if (algo === "MD5") {
      result = md5(bytes);
    } else {
      const buf = await sha(algo, bytes);
      result = encoding === 'base64' ? bufToBase64(buf) : bufToHex(buf);
    }
    if (onProgress) onProgress({ percent: 100, message: "Done!" });
    return result;
  },

  async generateHmac(text: string, key: string, algo: string, encoding: 'hex' | 'base64' = 'hex', onProgress) {
    if (onProgress) onProgress({ percent: 10, message: "Importing key..." });
    const buf = await hmac(algo, key, text);
    const result = encoding === 'base64' ? bufToBase64(buf) : bufToHex(buf);
    if (onProgress) onProgress({ percent: 100, message: "Done!" });
    return result;
  },

  async generateFileHmac(file: ArrayBuffer, key: string, algo: string, encoding: 'hex' | 'base64' = 'hex', onProgress) {
    if (onProgress) onProgress({ percent: 10, message: "Importing key..." });
    const buf = await hmac(algo, key, new Uint8Array(file));
    const result = encoding === 'base64' ? bufToBase64(buf) : bufToHex(buf);
    if (onProgress) onProgress({ percent: 100, message: "Done!" });
    return result;
  },

  // PDF Tasks (with memory optimization)
  async mergePdfs(files: (Blob | ArrayBuffer)[], onProgress) {
    const totalSize = files.reduce((acc, f) => acc + (f instanceof ArrayBuffer ? f.byteLength : f.size), 0);
    if (totalSize > 250 * 1024 * 1024) { 
      throw new Error("Total PDF size too large (max 250MB)");
    }
    const { PDFDocument } = await import("pdf-lib");
    const merged = await PDFDocument.create();
    const total = files.length;
    
    for (let i = 0; i < total; i++) {
      const file = files[i]!;
      if (onProgress) onProgress({ percent: (i / total) * 80, message: `Merging PDF ${i + 1}/${total}` });
      
      const bytes = file instanceof ArrayBuffer ? file : await file.arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      const pages = await merged.copyPages(doc, doc.getPageIndices());
      pages.forEach(p => merged.addPage(p));
      
      // The instruction mentions sequential loading and release.
      // pdf-lib doesn't have an explicit 'release', but nullifying helps.
      (doc as any) = null;
    }
    
    if (onProgress) onProgress({ percent: 90, message: "Saving merged PDF..." });
    const result = await merged.save();
    if (onProgress) onProgress({ percent: 100, message: "Done!" });
    return result;
  },

  // Image Tasks (Standard)
  async compressImage(file: ArrayBuffer, format, quality, onProgress) {
    const blob = new Blob([file]);
    const imgBitmap = await createImageBitmap(blob);
    const canvas = new OffscreenCanvas(imgBitmap.width, imgBitmap.height);
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(imgBitmap, 0, 0);
    const compressedBlob = await canvas.convertToBlob({ type: format, quality: quality / 100 });
    const result = await compressedBlob.arrayBuffer();
    imgBitmap.close();
    canvas.width = 0; canvas.height = 0;
    return new Uint8Array(result);
  },

  async resizeImage(file, width, height, format, quality, onProgress) {
    const blob = new Blob([file]);
    const imgBitmap = await createImageBitmap(blob);
    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(imgBitmap, 0, 0, width, height);
    const compressedBlob = await canvas.convertToBlob({ type: format, quality: quality / 100 });
    const result = await compressedBlob.arrayBuffer();
    imgBitmap.close();
    canvas.width = 0; canvas.height = 0;
    return new Uint8Array(result);
  },

  // Image Tasks (Batch specialized)
  async compressImageBatch(file: ArrayBuffer, settings: CompressionSettings, onProgress) {
    if (onProgress) onProgress({ percent: 10, message: "Decoding image..." });
    const blob = new Blob([file]);
    const imgBitmap = await createImageBitmap(blob);
    let { width, height } = imgBitmap;
    
    if (settings.resizeWidth || settings.resizeHeight) {
      if (settings.resizeWidth && settings.resizeHeight) {
        width = settings.resizeWidth; height = settings.resizeHeight;
      } else if (settings.resizeWidth) {
        if (settings.maintainAspectRatio) height = (settings.resizeWidth / imgBitmap.width) * imgBitmap.height;
        width = settings.resizeWidth;
      } else if (settings.resizeHeight) {
        if (settings.maintainAspectRatio) width = (settings.resizeHeight / imgBitmap.height) * imgBitmap.width;
        height = settings.resizeHeight;
      }
    }

    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    if (settings.format === 'image/jpeg') {
      ctx.fillStyle = "#FFFFFF"; ctx.fillRect(0, 0, width, height);
    }
    ctx.drawImage(imgBitmap, 0, 0, width, height);
    
    const options: ImageEncodeOptions = {
      type: settings.format,
      quality: settings.quality / 100
    };
    if (settings.lossless && settings.format === 'image/png') options.quality = 1.0;

    const compressedBlob = await canvas.convertToBlob(options);
    const result = await compressedBlob.arrayBuffer();
    imgBitmap.close();
    canvas.width = 0; canvas.height = 0;
    if (onProgress) onProgress({ percent: 100, message: "Done!" });
    return new Uint8Array(result);
  },

  // Developer Tasks
  async minifyCode(code, lang, onProgress) {
    if (lang === 'js') {
      try {
        const { minify } = await import("terser");
        const result = await minify(code, { compress: true, mangle: true, module: true });
        return result.code || code;
      } catch (err) { /* fallback */ }
    }
    // Basic fallback minifiers
    if (lang === "css") return code.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s*([{}:;,>~+])\s*/g, "$1").replace(/;\s*}/g, "}").replace(/\s+/g, " ").trim();
    if (lang === "html") return code.replace(/<!--[\s\S]*?-->/g, "").replace(/\s+/g, " ").replace(/>\s+</g, "><").trim();
    return code;
  },

  async computeDiff(textA, textB, onProgress) {
    const linesA = textA.split(/\r?\n/);
    const linesB = textB.split(/\r?\n/);
    const m = linesA.length, n = linesB.length;
    if (m * n > 10000000) {
      const result: DiffLine[] = [];
      linesA.forEach((l, i) => result.push({ type: 'removed', text: l, lineA: i + 1 }));
      linesB.forEach((l, i) => result.push({ type: 'added', text: l, lineB: i + 1 }));
      return result;
    }
    const dp = Array.from({ length: m + 1 }, () => new Int32Array(n + 1));
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (linesA[i - 1] === linesB[j - 1]) dp[i]![j] = dp[i - 1]![j - 1]! + 1;
        else dp[i]![j] = Math.max(dp[i - 1]![j]!, dp[i]![j - 1]!);
      }
    }
    const result: DiffLine[] = [];
    let i = m, j = n;
    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && linesA[i - 1] === linesB[j - 1]) {
        result.unshift({ type: "equal", text: linesA[i - 1]!, lineA: i, lineB: j });
        i--; j--;
      } else if (j > 0 && (i === 0 || dp[i]![j - 1]! >= dp[i - 1]![j]!)) {
        result.unshift({ type: "added", text: linesB[j - 1]!, lineB: j });
        j--;
      } else {
        result.unshift({ type: "removed", text: linesA[i - 1]!, lineA: i });
        i--;
      }
    }
    return result;
  },

  // EMI Tasks
  async calculateEmiSchedule(inputs) {
    const { generateSchedule } = await import("../lib/emi-calculations");
    return generateSchedule(inputs);
  }
};

Comlink.expose(api);
export type UnifiedWorkerAPI = typeof api;
