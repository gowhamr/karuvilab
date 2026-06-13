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

async function sha(algo: string, input: string | Uint8Array): Promise<ArrayBuffer> {
  const bytes = typeof input === "string" ? new TextEncoder().encode(input) : input;
  const cryptoProvider = self.crypto || (globalThis as any).crypto;
  if (!cryptoProvider?.subtle) {
    throw new Error("Web Crypto API (subtle) is not available in this environment.");
  }
  return await cryptoProvider.subtle.digest(algo.replace("SHA-", "SHA-"), bytes.buffer as ArrayBuffer);
}

async function hmac(algo: string, key: string, input: string | Uint8Array): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(key);
  const data = typeof input === "string" ? encoder.encode(input) : input;
  
  const cryptoProvider = self.crypto || (globalThis as any).crypto;
  if (!cryptoProvider?.subtle) {
    throw new Error("Web Crypto API (subtle) is not available.");
  }

  const cryptoKey = await cryptoProvider.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: { name: algo.replace("SHA-", "SHA") } },
    false,
    ["sign"]
  );
  
  return await cryptoProvider.subtle.sign("HMAC", cryptoKey, data as any);
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
      const hexString = md5(text);
      results["MD5"] = encoding === "base64"
        ? Buffer.from(hexString, "hex").toString("base64")
        : hexString;
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
    let imgBitmap: ImageBitmap | null = null;
    try {
      const blob = new Blob([file]);
      imgBitmap = await createImageBitmap(blob);
      
      const width = Math.max(1, imgBitmap.width);
      const height = Math.max(1, imgBitmap.height);

      if (typeof OffscreenCanvas === 'undefined') {
        throw new Error("OffscreenCanvas not supported in this browser. Please use a modern browser.");
      }

      const canvas = new OffscreenCanvas(width, height);
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not get 2D context from OffscreenCanvas");

      ctx.drawImage(imgBitmap, 0, 0);
      const compressedBlob = await canvas.convertToBlob({ type: format, quality: quality / 100 });
      if (!compressedBlob) throw new Error("Canvas export failed: Blob is null");

      const result = await compressedBlob.arrayBuffer();
      const bytes = new Uint8Array(result);
      return Comlink.transfer(bytes, [bytes.buffer]);
    } catch (err: any) {
      throw new Error(`Compression failed: ${err.message || 'Unknown error'}`);
    } finally {
      if (imgBitmap) imgBitmap.close();
    }
  },

  async resizeImage(file, width, height, format, quality, onProgress) {
    let imgBitmap: ImageBitmap | null = null;
    try {
      const blob = new Blob([file]);
      imgBitmap = await createImageBitmap(blob);
      
      const targetW = Math.max(1, Math.floor(width));
      const targetH = Math.max(1, Math.floor(height));

      if (typeof OffscreenCanvas === 'undefined') {
        throw new Error("OffscreenCanvas not supported in this browser.");
      }

      const canvas = new OffscreenCanvas(targetW, targetH);
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not get 2D context");

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(imgBitmap, 0, 0, targetW, targetH);
      
      const compressedBlob = await canvas.convertToBlob({ type: format, quality: quality / 100 });
      if (!compressedBlob) throw new Error("Canvas export failed");

      const result = await compressedBlob.arrayBuffer();
      const bytes = new Uint8Array(result);
      return Comlink.transfer(bytes, [bytes.buffer]);
    } catch (err: any) {
      throw new Error(`Resize failed: ${err.message || 'Unknown error'}`);
    } finally {
      if (imgBitmap) imgBitmap.close();
    }
  },

  async removeBackground(file, bgColor, tolerance, onProgress) {
    let imgBitmap: ImageBitmap | null = null;
    try {
      const blob = new Blob([file]);
      imgBitmap = await createImageBitmap(blob);
      const width = imgBitmap.width;
      const height = imgBitmap.height;

      if (typeof OffscreenCanvas === 'undefined') {
        throw new Error("OffscreenCanvas not supported");
      }

      const canvas = new OffscreenCanvas(width, height);
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) throw new Error("Could not get 2D context");

      ctx.drawImage(imgBitmap, 0, 0);
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;

      // Color matching logic
      const r_target = parseInt(bgColor.slice(1, 3), 16);
      const g_target = parseInt(bgColor.slice(3, 5), 16);
      const b_target = parseInt(bgColor.slice(5, 7), 16);

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i]!, g = data[i + 1]!, b = data[i + 2]!;
        const diff = Math.sqrt((r - r_target) ** 2 + (g - g_target) ** 2 + (b - b_target) ** 2);
        
        if (diff <= tolerance) {
          data[i + 3] = 0;
        } else if (diff <= tolerance * 1.5) {
          const alpha = Math.round(((diff - tolerance) / (tolerance * 0.5)) * 255);
          data[i + 3] = Math.min(data[i + 3]!, alpha);
        }
      }

      ctx.putImageData(imageData, 0, 0);
      const resultBlob = await canvas.convertToBlob({ type: 'image/png' });
      if (!resultBlob) throw new Error("Canvas export failed");

      const result = await resultBlob.arrayBuffer();
      const bytes = new Uint8Array(result);
      return Comlink.transfer(bytes, [bytes.buffer]);
    } catch (err: any) {
      throw new Error(`Background removal failed: ${err.message || 'Unknown error'}`);
    } finally {
      if (imgBitmap) imgBitmap.close();
    }
  },

  // Image Tasks (Batch specialized)
  async compressImageBatch(file: ArrayBuffer, settings: CompressionSettings, onProgress) {
    let imgBitmap: ImageBitmap | null = null;
    try {
      if (onProgress) onProgress({ percent: 10, message: "Decoding image..." });
      const blob = new Blob([file]);
      
      // Wrap createImageBitmap in try/catch (IMG-RUNTIME-005)
      try {
        imgBitmap = await createImageBitmap(blob);
      } catch (e) {
        throw new Error("Failed to decode image. The file might be corrupted or in an unsupported format.");
      }
      
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

      // Ensure dimensions are valid positive integers (IMG-RUNTIME-005)
      width = Math.max(1, Math.floor(width));
      height = Math.max(1, Math.floor(height));

      if (typeof OffscreenCanvas === 'undefined') {
        throw new Error("OffscreenCanvas not supported");
      }

      const canvas = new OffscreenCanvas(width, height);
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not get 2D context");

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
      if (!compressedBlob) throw new Error("Canvas export failed: Resulting blob is null");

      const result = await compressedBlob.arrayBuffer();
      const bytes = new Uint8Array(result);
      
      if (onProgress) onProgress({ percent: 100, message: "Done!" });
      return Comlink.transfer(bytes, [bytes.buffer]);
    } catch (err: any) {
      console.error("[Worker] Compression task failed:", err);
      throw new Error(`Compression failed: ${err.message || 'Unknown error'}`);
    } finally {
      if (imgBitmap) imgBitmap.close();
    }
  },

  async extractColorPalette(file, k = 5, onProgress) {
    let imgBitmap: ImageBitmap | null = null;
    try {
      if (onProgress) onProgress({ percent: 10, message: "Decoding image..." });
      const blob = new Blob([file]);
      imgBitmap = await createImageBitmap(blob);

      const MAX_WIDTH = 100;
      const scale = Math.min(MAX_WIDTH / imgBitmap.width, 1);
      const width = Math.round(imgBitmap.width * scale);
      const height = Math.round(imgBitmap.height * scale);

      const canvas = new OffscreenCanvas(width, height);
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) throw new Error("Could not get 2D context");
      
      ctx.drawImage(imgBitmap, 0, 0, width, height);
      const imageData = ctx.getImageData(0, 0, width, height).data;

      if (onProgress) onProgress({ percent: 30, message: "Sampling pixels..." });
      const pixels: [number, number, number][] = [];
      for (let i = 0; i < imageData.length; i += 4) {
        if (imageData[i+3]! > 128) { // Ignore transparent pixels
          pixels.push([imageData[i]!, imageData[i+1]!, imageData[i+2]!]);
        }
      }

      if (pixels.length === 0) return [];

      if (onProgress) onProgress({ percent: 50, message: "Clustering colors (k-means)..." });
      
      // k-means implementation
      let centroids: [number, number, number][] = [];
      for(let i=0; i<k; i++) {
        centroids.push(pixels[Math.floor(Math.random() * pixels.length)]!);
      }

      let assignments = new Array(pixels.length);
      const MAX_ITERATIONS = 10;

      for (let iter = 0; iter < MAX_ITERATIONS; iter++) {
        // Assign pixels to closest centroid
        for (let i = 0; i < pixels.length; i++) {
          let min_dist = Infinity;
          let best_centroid = 0;
          for (let j = 0; j < k; j++) {
            const dist = Math.sqrt(
              (pixels[i]![0] - centroids[j]![0]) ** 2 +
              (pixels[i]![1] - centroids[j]![1]) ** 2 +
              (pixels[i]![2] - centroids[j]![2]) ** 2
            );
            if (dist < min_dist) {
              min_dist = dist;
              best_centroid = j;
            }
          }
          assignments[i] = best_centroid;
        }

        // Update centroids
        const new_centroids: [number, number, number][] = new Array(k).fill(0).map(() => [0, 0, 0]);
        const counts = new Array(k).fill(0);
        for (let i = 0; i < pixels.length; i++) {
          const centroid_index = assignments[i]!;
          new_centroids[centroid_index]![0] += pixels[i]![0];
          new_centroids[centroid_index]![1] += pixels[i]![1];
          new_centroids[centroid_index]![2] += pixels[i]![2];
          counts[centroid_index]++;
        }

        for (let i = 0; i < k; i++) {
          if (counts[i] > 0) {
            new_centroids[i]![0] /= counts[i];
            new_centroids[i]![1] /= counts[i];
            new_centroids[i]![2] /= counts[i];
          } else {
             // Re-initialize if a cluster becomes empty
             new_centroids[i] = pixels[Math.floor(Math.random() * pixels.length)]!;
          }
        }
        centroids = new_centroids;
      }
      
      if (onProgress) onProgress({ percent: 90, message: "Finalizing palette..." });
      
      return centroids.map(c => {
        const r = Math.round(c[0]).toString(16).padStart(2, '0');
        const g = Math.round(c[1]).toString(16).padStart(2, '0');
        const b = Math.round(c[2]).toString(16).padStart(2, '0');
        return `#${r}${g}${b}`;
      });

    } catch (err: any) {
      throw new Error(`Color extraction failed: ${err.message || 'Unknown error'}`);
    } finally {
      if (imgBitmap) imgBitmap.close();
    }
  },

  // Developer Tasks
  async minifyCode(code, lang, onProgress) {
    if (lang === 'js') {
      try {
        const { minify } = await import("terser");
        const result = await minify(code, { compress: true, mangle: true, module: true });
        return { code: result.code || code, error: null };
      } catch (err: any) {
        return { 
          code, 
          error: { 
            type: 'premium_engine_unavailable', 
            message: 'Premium JS minification engine (Terser) is currently unavailable.' 
          } 
        };
      }
    }
    // Basic fallback minifiers for CSS/HTML (no heavy dependencies)
    let minified = code;
    if (lang === "css") minified = code.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s*([{}:;,>~+])\s*/g, "$1").replace(/;\s*}/g, "}").replace(/\s+/g, " ").trim();
    if (lang === "html") minified = code.replace(/<!--[\s\S]*?-->/g, "").replace(/\s+/g, " ").replace(/>\s+</g, "><").trim();
    
    return { code: minified, error: null };
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

  async processYaml(input, action) {
    const YAML = await import("yaml");
    try {
      if (action === 'validate') {
        YAML.parse(input);
        return { result: 'Valid YAML' };
      }
      if (action === 'yaml_to_json') {
        const doc = YAML.parse(input);
        return { result: JSON.stringify(doc, null, 2) };
      }
      if (action === 'json_to_yaml') {
        const doc = JSON.parse(input);
        return { result: YAML.stringify(doc) };
      }
      return { error: 'Invalid action' };
    } catch (e: any) {
      return { error: e.message || 'An unknown error occurred' };
    }
  },

  async processJson(input, mode, indent) {
    try {
      const obj = JSON.parse(input);
      let out = "";
      if (mode === "minify") {
        out = JSON.stringify(obj);
      } else {
        const spaces = indent === "tab" ? "\t" : indent;
        out = JSON.stringify(obj, null, spaces);
      }
      return { output: out, parsed: obj, error: null };
    } catch (e: any) {
      return { output: "", parsed: null, error: { message: e.message } };
    }
  },

  async createZip(files, onProgress) {
    const fflate = await import("fflate");
    return new Promise((resolve, reject) => {
      fflate.zip(files, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
  },

  // Math Tasks
  async evaluateMath(expr: string) {
    // Injected helpers for eval
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const factorial = (n: number): number => {
      if (n < 0 || n > 170) return NaN;
      if (n === 0) return 1;
      let res = 1;
      for (let i = 2; i <= Math.floor(n); i++) res *= i;
      return res;
    };

    // Basic validation to prevent arbitrary JS execution (KL-Security)
    // Only allows digits, operators, parentheses, Math functions, and factorial helper
    if (!/^(?:[0-9+\-*/.%() \t]|Math\.[a-z0-9]+|\*\*|factorial)+$/i.test(expr)) {
      throw new Error("Invalid characters in expression");
    }
    
    // Using eval here as it's a trusted worker environment (KL-Security)
    // eslint-disable-next-line no-eval
    const result = eval(expr);
    if (typeof result !== "number" || !isFinite(result)) {
      throw new Error("Result is not a finite number");
    }
    return result;
  },

  // EMI Tasks
  async calculateEmiSchedule(inputs) {
    const { generateSchedule } = await import("../lib/emi-calculations");
    return generateSchedule(inputs);
  },

  // Media Tasks
  async encodeMp3(left, right, sampleRate, onProgress) {
    // @ts-ignore
    const lamejs = await import("lamejs");
    const mp3encoder = new lamejs.Mp3Encoder(right ? 2 : 1, sampleRate, 128);
    const mp3Data: any[] = [];
    const sampleBlockSize = 1152;
    
    for (let i = 0; i < left.length; i += sampleBlockSize) {
      const leftChunk = left.subarray(i, i + sampleBlockSize);
      const rightChunk = right ? right.subarray(i, i + sampleBlockSize) : leftChunk;
      const mp3buf = mp3encoder.encodeBuffer(leftChunk, rightChunk);
      if (mp3buf.length > 0) mp3Data.push(mp3buf);
      if (onProgress) onProgress({ percent: (i / left.length) * 100 });
    }
    
    const end = mp3encoder.flush();
    if (end.length > 0) mp3Data.push(end);
    
    // Concatenate chunks
    const totalLen = mp3Data.reduce((acc, buf) => acc + buf.length, 0);
    const result = new Uint8Array(totalLen);
    let offset = 0;
    for (const buf of mp3Data) {
      result.set(new Uint8Array(buf), offset);
      offset += buf.length;
    }
    return result;
  },

  async createGif(frames, width, height, delay, onProgress) {
    // @ts-ignore
    const { GIFEncoder, quantize, applyPalette } = await import('gifenc');
    const gif = new GIFEncoder();
    
    for (let i = 0; i < frames.length; i++) {
      const frameBuffer = frames[i];
      if (!frameBuffer) continue;
      const data = new Uint8Array(frameBuffer);
      const palette = quantize(data, 256);
      const index = applyPalette(data, palette);
      gif.writeFrame(index, width, height, { palette, delay });
      if (onProgress) onProgress({ percent: (i / frames.length) * 100 });
    }
    
    gif.finish();
    return gif.bytes();
  },

  async extractRawTextFromDocx(file, onProgress) {
    const mammoth = await import("mammoth");
    const result = await mammoth.extractRawText({ arrayBuffer: file });
    return result.value;
  },

  async convertDocxToPdf(file, onProgress) {
    const mammoth = await import("mammoth");
    const PDFLib = await import("pdf-lib");

    const { value: text } = await mammoth.extractRawText({ arrayBuffer: file });
    if (!text.trim()) {
      throw new Error("The document seems to be empty or unreadable.");
    }

    const pdfDoc = await PDFLib.PDFDocument.create();
    const timesRomanFont = await pdfDoc.embedFont(PDFLib.StandardFonts.TimesRoman);
    const pageSize = { width: 595.28, height: 841.89 }; // A4
    let page = pdfDoc.addPage([pageSize.width, pageSize.height]);
    const { width, height } = page.getSize();
    const fontSize = 12;
    const margin = 50;
    const maxWidth = width - margin * 2;
    let y = height - margin;
    const lines = text.split("\n");

    for (let k = 0; k < lines.length; k++) {
      const line = lines[k]!;
      if (onProgress) {
        onProgress({ percent: (k / lines.length) * 100, message: `Writing page...` });
      }

      if (!line.trim()) {
        y -= fontSize;
        continue;
      }

      const words = line.split(" ");
      let currentLine = "";
      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const textWidth = timesRomanFont.widthOfTextAtSize(testLine, fontSize);
        if (textWidth > maxWidth) {
          page.drawText(currentLine, { x: margin, y, size: fontSize, font: timesRomanFont });
          y -= fontSize * 1.2;
          currentLine = word;
          if (y < margin) {
            page = pdfDoc.addPage([pageSize.width, pageSize.height]);
            y = height - margin;
          }
        } else {
          currentLine = testLine;
        }
      }

      if (currentLine) {
        page.drawText(currentLine, { x: margin, y, size: fontSize, font: timesRomanFont });
        y -= fontSize * 1.2;
      }

      if (y < margin) {
        page = pdfDoc.addPage([pageSize.width, pageSize.height]);
        y = height - margin;
      }
    }

    const pdfBytes = await pdfDoc.save();
    return new Uint8Array(pdfBytes);
  },

  async extractImagesFromPdf(file, onProgress) {
    const pdfjsLib = await import("pdfjs-dist");
    if (typeof (pdfjsLib as any).GlobalWorkerOptions !== 'undefined') {
      (pdfjsLib as any).GlobalWorkerOptions.workerSrc = "";
    }

    const pdf = await pdfjsLib.getDocument({ data: file }).promise;
    const extracted: Array<{ arrayBuffer: ArrayBuffer; width: number; height: number; page: number; index: number }> = [];
    let imgIndex = 0;

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      if (onProgress) {
        onProgress({ percent: (pageNum / pdf.numPages) * 100, message: `Scanning page ${pageNum} of ${pdf.numPages}…` });
      }
      const page = await pdf.getPage(pageNum);
      const ops = await page.getOperatorList();
      const fns = ops.fnArray;
      const args = ops.argsArray;

      for (let i = 0; i < fns.length; i++) {
        const OPS = (pdfjsLib as any).OPS;
        if (fns[i] === OPS.paintImageXObject || fns[i] === OPS.paintImageXObjectRepeat) {
          const imgName = args[i][0];
          try {
            const imgData = await new Promise<any>((res, rej) => {
              page.objs.get(imgName, (img: any) => img ? res(img) : rej(new Error("not found")));
            });

            // Use OffscreenCanvas in Worker
            const canvas = new OffscreenCanvas(imgData.width, imgData.height);
            const ctx = canvas.getContext("2d")!;
            const imageData = ctx.createImageData(imgData.width, imgData.height);

            if (imgData.data && imgData.data.length) {
              const src = imgData.data;
              const dst = imageData.data;
              if (src.length === imgData.width * imgData.height * 3) {
                for (let p = 0; p < imgData.width * imgData.height; p++) {
                  dst[p * 4] = src[p * 3];
                  dst[p * 4 + 1] = src[p * 3 + 1];
                  dst[p * 4 + 2] = src[p * 3 + 2];
                  dst[p * 4 + 3] = 255;
                }
              } else {
                dst.set(src.slice(0, dst.length));
              }
            }

            ctx.putImageData(imageData, 0, 0);
            const blob = await canvas.convertToBlob({ type: "image/png" });
            const arrayBuffer = await blob.arrayBuffer();
            extracted.push({
              arrayBuffer,
              width: imgData.width,
              height: imgData.height,
              page: pageNum,
              index: imgIndex++
            });
          } catch (err) {
            console.error("Failed to extract image object:", err);
          }
        }
      }
    }
    return extracted;
  },

  async extractTextFromPdf(file, onProgress) {
    const pdfjsLib = await import("pdfjs-dist");
    if (typeof (pdfjsLib as any).GlobalWorkerOptions !== 'undefined') {
      (pdfjsLib as any).GlobalWorkerOptions.workerSrc = "";
    }

    const pdf = await pdfjsLib.getDocument({ data: file }).promise;
    const allText: string[] = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      if (onProgress) {
        onProgress({ percent: (i / pdf.numPages) * 100, message: `Extracting page ${i} of ${pdf.numPages}…` });
      }
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();

      let lastY = -1;
      let pageLines: string[] = [];
      let currentLine: string[] = [];

      for (const item of (content.items as any[])) {
        if (lastY !== -1 && Math.abs(item.transform[5] - lastY) > 5) {
          pageLines.push(currentLine.join(" "));
          currentLine = [];
        }
        currentLine.push(item.str);
        lastY = item.transform[5];
      }
      if (currentLine.length > 0) pageLines.push(currentLine.join(" "));

      allText.push(pageLines.join("\n"));
    }

    return allText.join("\n\n--- Page Break ---\n\n");
  },

  // Numeral Tasks
  async convertNumeral(input: string, inputFormat: string, targetFormat: string, extraOptions?: any) {
    const { decodeToBytes, encodeFromBytes, detectFormat } = await import("../features/numeral-converter/utils/conversion-helpers");
    try {
      const detected = inputFormat === 'auto' ? detectFormat(input).format : inputFormat;
      const bytes = decodeToBytes(input, detected);
      const value = encodeFromBytes(bytes, targetFormat, extraOptions);
      return { value, error: "" };
    } catch (e: any) {
      return { value: "", error: e.message || "Conversion failed" };
    }
  },

  async detectNumeralFormat(input: string) {
    const { detectFormat } = await import("../features/numeral-converter/utils/conversion-helpers");
    return detectFormat(input);
  }
};

Comlink.expose(api);
export type UnifiedWorkerAPI = typeof api;
