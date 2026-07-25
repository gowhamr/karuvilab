import * as Comlink from "comlink";
import { WorkerAPI, CompressionSettings, EmiInputs, EmiResult, DiffLine, ProgressCallback } from "./types";

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

const api: Partial<WorkerAPI> = {
  // Security Worker Methods Stubs (handled by crypto.worker.ts)
  directoryHashManifest: async () => [],
  aesEncrypt: async () => '',
  aesDecrypt: async () => '',
  generateRsaKeyPair: async () => ({ publicKeyPem: '', privateKeyPem: '' }),
  rsaEncrypt: async () => '',
  rsaDecrypt: async () => '',
  rsaSign: async () => '',
  rsaVerify: async () => true,
  ecdsaGenerateKeyPair: async () => ({ publicKeyPem: '', privateKeyPem: '' }),
  ecdsaSign: async () => '',
  ecdsaVerify: async () => true,
  ecdhDeriveSecret: async () => '',
  pbkdf2Derive: async () => ({ hex: '', base64: '' }),
  hkdfDerive: async () => ({ hex: '', base64: '' }),

  // Hash Tasks
  async generateHashes(text: string, algos: string[], encoding: 'hex' | 'base64' = 'hex', onProgress?: ProgressCallback) {
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

  async exportPdfEditor(file: ArrayBuffer, pagesState: any[], annotations: any[], onProgress?: any) {
    const { PDFDocument, rgb, degrees, StandardFonts } = await import("pdf-lib");
    if (onProgress) onProgress({ percent: 10, message: "Loading original PDF..." });
    const srcDoc = await PDFDocument.load(file);
    const newDoc = await PDFDocument.create();

    if (onProgress) onProgress({ percent: 30, message: "Structuring pages..." });
    const originalIndices = pagesState.map(p => p.originalIndex - 1);
    const copiedPages = await newDoc.copyPages(srcDoc, originalIndices);
    
    copiedPages.forEach((page, i) => {
      const state = pagesState[i];
      if (state.rotation) {
        page.setRotation(degrees((page.getRotation().angle + state.rotation) % 360));
      }
      newDoc.addPage(page);
    });

    if (onProgress) onProgress({ percent: 60, message: "Applying annotations..." });
    const hexToRgb = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16) / 255;
      const g = parseInt(hex.slice(3, 5), 16) / 255;
      const b = parseInt(hex.slice(5, 7), 16) / 255;
      return { r, g, b };
    };

    const embeddedImages: Record<string, any> = {};

    for (const ann of annotations) {
      const newPageIndex = pagesState.findIndex(p => p.originalIndex === ann.pageIndex);
      if (newPageIndex === -1) continue;

      const page = newDoc.getPage(newPageIndex);
      const { width: origW, height: origH } = page.getSize();
      const pageRotation = page.getRotation().angle % 360;

      const VW = (pageRotation === 90 || pageRotation === 270) ? origH : origW;
      const VH = (pageRotation === 90 || pageRotation === 270) ? origW : origH;

      const px = (ann.x / 100) * VW;
      const py = (ann.y / 100) * VH;
      
      const getOriginalCoords = (vx: number, vy: number) => {
        if (pageRotation === 0) return { x: vx, y: origH - vy };
        if (pageRotation === 90) return { x: origW - vy, y: vx };
        if (pageRotation === 180) return { x: origW - vx, y: vy };
        if (pageRotation === 270) return { x: vy, y: origH - vx };
        return { x: vx, y: origH - vy };
      };

      if (ann.type === 'blackout') {
        const pw = (ann.width / 100) * VW;
        const ph = (ann.height / 100) * VH;
        const pt = getOriginalCoords(px, py + ph);
        page.drawRectangle({
          x: pt.x, y: pt.y,
          width: pw, height: ph,
          color: rgb(0, 0, 0),
          rotate: degrees(360 - pageRotation)
        });
      } else if (ann.type === 'image') {
        const pw = (ann.width / 100) * VW;
        const ph = (ann.height / 100) * VH;
        const pt = getOriginalCoords(px, py + ph);
        
        let img = embeddedImages[ann.dataUrl];
        if (!img) {
          const res = await fetch(ann.dataUrl);
          const buf = await res.arrayBuffer();
          if (ann.dataUrl.includes('image/png')) img = await newDoc.embedPng(buf);
          else img = await newDoc.embedJpg(buf);
          embeddedImages[ann.dataUrl] = img;
        }

        page.drawImage(img, {
          x: pt.x, y: pt.y,
          width: pw, height: ph,
          rotate: degrees(360 - pageRotation)
        });
      } else if (ann.type === 'shape') {
        const pw = (ann.width / 100) * VW;
        const ph = (ann.height / 100) * VH;
        const pt = getOriginalCoords(px, py + ph);
        const { r, g, b } = hexToRgb(ann.color || '#000000');
        
        const opts: any = {
          x: pt.x, y: pt.y, width: pw, height: ph, rotate: degrees(360 - pageRotation),
          borderWidth: ann.strokeWidth || 0,
          borderColor: rgb(r, g, b)
        };
        if (ann.fill && ann.fill !== 'transparent') {
          const fillCol = hexToRgb(ann.fill);
          opts.color = rgb(fillCol.r, fillCol.g, fillCol.b);
        }
        page.drawRectangle(opts);
      } else if (ann.type === 'text') {
        const font = await newDoc.embedFont(StandardFonts.Helvetica);
        const fontSize = 16;
        const pt = getOriginalCoords(px, py + fontSize);
        const { r, g, b } = hexToRgb(ann.color || '#000000');
        page.drawText(ann.content || '', {
          x: pt.x, y: pt.y,
          font, size: fontSize, color: rgb(r, g, b),
          rotate: degrees(360 - pageRotation)
        });
      } else if (ann.type === 'draw') {
        const { r, g, b } = hexToRgb(ann.color || '#EF4444');
        if (ann.points && ann.points.length > 1) {
          for (let i = 1; i < ann.points.length; i++) {
            const p1 = ann.points[i-1];
            const p2 = ann.points[i];
            const px1 = (p1.x / 100) * VW, py1 = (p1.y / 100) * VH;
            const px2 = (p2.x / 100) * VW, py2 = (p2.y / 100) * VH;
            const pt1 = getOriginalCoords(px1, py1);
            const pt2 = getOriginalCoords(px2, py2);
            page.drawLine({
              start: pt1, end: pt2,
              thickness: ann.strokeWidth || 3,
              color: rgb(r, g, b)
            });
          }
        }
      }
    }

    if (onProgress) onProgress({ percent: 90, message: "Saving flattened PDF..." });
    const outBytes = await newDoc.save();
    return Comlink.transfer(outBytes, [outBytes.buffer]);
  },

  async getPdfPageCount(file: any) {
    const { PDFDocument } = await import("pdf-lib");
    const doc = await PDFDocument.load(file);
    return doc.getPageCount();
  },

  async rotatePdf(
    file: any,
    rotateAll: boolean,
    allAngle: number,
    pageAngles: number[],
    onProgress: any
  ) {
    const { PDFDocument, degrees } = await import("pdf-lib");
    const doc = await PDFDocument.load(file);
    const pages = doc.getPages();
    pages.forEach((page: any, i: number) => {
      const angle = rotateAll ? allAngle : (pageAngles[i] || 90);
      const current = page.getRotation().angle;
      page.setRotation(degrees((current + angle) % 360));
    });
    const outBytes = await doc.save();
    return Comlink.transfer(outBytes, [outBytes.buffer]);
  },

  async watermarkPdf(
    file: any,
    options: {
      type: "text" | "image";
      text?: string;
      imageBytes?: ArrayBuffer;
      imageType?: string;
      opacity: number;
      fontSize: number;
      colorHex: string;
      angle: number;
      scale: number;
    },
    onProgress: any
  ) {
    const { PDFDocument, rgb, degrees } = await import("pdf-lib");
    const doc = await PDFDocument.load(file);
    const pages = doc.getPages();

    let embeddedImage: any = null;
    let imgWidth = 0;
    let imgHeight = 0;

    if (options.type === "image" && options.imageBytes) {
      if (options.imageType === "image/png") {
        embeddedImage = await doc.embedPng(options.imageBytes);
      } else if (options.imageType === "image/jpeg" || options.imageType === "image/jpg") {
        embeddedImage = await doc.embedJpg(options.imageBytes);
      } else {
        throw new Error("Only PNG and JPG images are supported for watermarking.");
      }
      
      const imgDims = embeddedImage.scale(options.scale);
      imgWidth = imgDims.width;
      imgHeight = imgDims.height;
    }

    const hexToRgb = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16) / 255;
      const g = parseInt(hex.slice(3, 5), 16) / 255;
      const b = parseInt(hex.slice(5, 7), 16) / 255;
      return { r, g, b };
    };

    const { r, g, b } = hexToRgb(options.colorHex || "#000000");

    for (const page of pages) {
      const { width, height } = page.getSize();
      
      if (options.type === "text" && options.text) {
        page.drawText(options.text, {
          x: width / 2 - (options.text.length * options.fontSize * 0.3),
          y: height / 2,
          size: options.fontSize,
          color: rgb(r, g, b),
          opacity: options.opacity,
          rotate: degrees(options.angle),
        });
      } else if (embeddedImage) {
        page.drawImage(embeddedImage, {
          x: width / 2 - (imgWidth / 2),
          y: height / 2 - (imgHeight / 2),
          width: imgWidth,
          height: imgHeight,
          opacity: options.opacity,
          rotate: degrees(options.angle),
        });
      }
    }

    const outBytes = await doc.save();
    return Comlink.transfer(outBytes, [outBytes.buffer]);
  },

  async convertImagesToPdf(images: Array<{ buffer: ArrayBuffer, mime: string }>, pageSize: "a4" | "letter" | "fit", onProgress: any) {
    const { PDFDocument } = await import("pdf-lib");
    const pdf = await PDFDocument.create();
    const PAGE_SIZES: Record<string, [number, number]> = { a4: [595.28, 841.89], letter: [612, 792] };

    for (let i = 0; i < images.length; i++) {
      if (onProgress) onProgress({ percent: (i / images.length) * 100, message: `Processing image ${i + 1}/${images.length}...` });
      const item = images[i];
      if (!item) continue;
      let img;
      if (item.mime === "image/png") img = await pdf.embedPng(item.buffer);
      else img = await pdf.embedJpg(item.buffer);
      const { width: iw, height: ih } = img;
      let pw = iw, ph = ih;
      if (pageSize === "a4") { [pw, ph] = PAGE_SIZES.a4!; }
      else if (pageSize === "letter") { [pw, ph] = PAGE_SIZES.letter!; }
      const page = pdf.addPage([pw, ph]);
      const scale = Math.min(pw / iw, ph / ih);
      const dw = iw * scale, dh = ih * scale;
      page.drawImage(img, { x: (pw - dw) / 2, y: (ph - dh) / 2, width: dw, height: dh });
    }
    
    if (onProgress) onProgress({ percent: 100, message: "Saving PDF..." });
    const bytes = await pdf.save();
    return Comlink.transfer(bytes, [bytes.buffer]);
  },

  async lockPdf(file: ArrayBuffer, userPassword: string, ownerPassword?: string, onProgress?: any) {
    const { PDFDocument } = await import("pdf-lib");
    if (onProgress) onProgress({ percent: 50, message: "Loading PDF..." });
    const doc = await PDFDocument.load(file);
    if (onProgress) onProgress({ percent: 90, message: "Locking and saving PDF..." });
    const outBytes = await doc.save({
      userPassword,
      ownerPassword: ownerPassword || userPassword,
      permissions: {
        printing: "highResolution",
        modifying: false,
        copying: false,
        annotating: false,
      },
    } as any);
    return Comlink.transfer(outBytes, [outBytes.buffer]);
  },
  
  async unlockPdf(file: ArrayBuffer, password: string, onProgress?: any) {
    const { PDFDocument } = await import("pdf-lib");
    if (onProgress) onProgress({ percent: 50, message: "Unlocking PDF..." });
    const doc = await PDFDocument.load(file, { password } as any);
    if (onProgress) onProgress({ percent: 90, message: "Saving PDF..." });
    const outBytes = await doc.save();
    return Comlink.transfer(outBytes, [outBytes.buffer]);
  },

  async addPageNumbersToPdf(
    file: ArrayBuffer,
    options: {
      startNum: number;
      prefix: string;
      suffix: string;
      position: "bottom-center" | "bottom-right" | "bottom-left" | "top-center" | "top-right" | "top-left";
      fontSize: number;
      colorHex: string;
    },
    onProgress?: any
  ) {
    const { PDFDocument, rgb } = await import("pdf-lib");
    if (onProgress) onProgress({ percent: 10, message: "Loading PDF..." });
    const doc = await PDFDocument.load(file);
    const pages = doc.getPages();
    
    const hexToRgb = (hex: string) => ({
      r: parseInt(hex.slice(1, 3), 16) / 255,
      g: parseInt(hex.slice(3, 5), 16) / 255,
      b: parseInt(hex.slice(5, 7), 16) / 255,
    });
    const { r, g, b } = hexToRgb(options.colorHex);
    const margin = 20;

    for (let i = 0; i < pages.length; i++) {
      if (onProgress && i % 10 === 0) onProgress({ percent: 10 + (i / pages.length) * 80, message: `Adding page number ${i + 1}/${pages.length}...` });
      const page = pages[i];
      if (!page) continue;
      const { width, height } = page.getSize();
      const numStr = `${options.prefix}${options.startNum + i}${options.suffix}`;
      const textWidth = numStr.length * options.fontSize * 0.5;
      const isBottom = options.position.startsWith("bottom");
      const y = isBottom ? margin : height - margin - options.fontSize;
      let x: number;
      if (options.position.includes("center")) x = (width - textWidth) / 2;
      else if (options.position.includes("right")) x = width - textWidth - margin;
      else x = margin;
      page.drawText(numStr, { x, y, size: options.fontSize, color: rgb(r, g, b) });
    }

    if (onProgress) onProgress({ percent: 90, message: "Saving PDF..." });
    const outBytes = await doc.save();
    return Comlink.transfer(outBytes, [outBytes.buffer]);
  },

  async adjustPdfLayout(
    file: ArrayBuffer,
    options: {
      action: 'crop' | 'resize' | 'margin';
      pages: number[] | 'all';
      cropBox?: { x: number; y: number; width: number; height: number };
      targetSize?: [number, number];
      scaleToFit?: boolean;
      orientation?: 'portrait' | 'landscape' | 'auto';
      margins?: { top: number; right: number; bottom: number; left: number };
    },
    onProgress?: any
  ) {
    const { PDFDocument } = await import("pdf-lib");
    if (onProgress) onProgress({ percent: 10, message: "Loading PDF..." });
    const doc = await PDFDocument.load(file);
    const pages = doc.getPages();
    const pageCount = pages.length;

    const targetPages = options.pages === 'all' 
      ? Array.from({ length: pageCount }, (_, i) => i)
      : options.pages;

    if (options.action === 'crop' && options.cropBox) {
      for (let i = 0; i < targetPages.length; i++) {
        const pIdx = targetPages[i]!;
        if (onProgress && i % 5 === 0) onProgress({ percent: 10 + (i / targetPages.length) * 80, message: `Cropping page ${i + 1}/${targetPages.length}...` });
        const page = pages[pIdx];
        if (!page) continue;
        
        // cropBox expected in points
        page.setCropBox(options.cropBox.x, options.cropBox.y, options.cropBox.width, options.cropBox.height);
      }
    } else if ((options.action === 'resize' && options.targetSize) || (options.action === 'margin' && options.margins)) {
      if (onProgress) onProgress({ percent: 20, message: "Rebuilding pages..." });
      
      const newDoc = await PDFDocument.create();
      
      for (let i = 0; i < pageCount; i++) {
        if (onProgress && i % 5 === 0) onProgress({ percent: 20 + (i / pageCount) * 70, message: `Processing page ${i + 1}/${pageCount}...` });
        
        if (!targetPages.includes(i)) {
          // Copy page as is if not in targetPages
          const [copiedPage] = await newDoc.copyPages(doc, [i]);
          newDoc.addPage(copiedPage!);
          continue;
        }

        const oldPage = pages[i]!;
        const { width: oldW, height: oldH } = oldPage.getSize();
        
        // Embed the page
        const [embeddedPage] = await newDoc.embedPdf(file, [i]);
        
        if (options.action === 'resize' && options.targetSize) {
          let [newW, newH] = options.targetSize;
          
          if (options.orientation === 'landscape') {
            if (newW < newH) [newW, newH] = [newH, newW];
          } else if (options.orientation === 'portrait') {
            if (newW > newH) [newW, newH] = [newH, newW];
          } else if (options.orientation === 'auto' || !options.orientation) {
            const isOldLandscape = oldW > oldH;
            const isNewLandscape = newW > newH;
            if (isOldLandscape !== isNewLandscape) {
              [newW, newH] = [newH, newW];
            }
          }

          const newPage = newDoc.addPage([newW, newH]);
          
          if (options.scaleToFit) {
            const scale = Math.min(newW / oldW, newH / oldH);
            const scaledW = oldW * scale;
            const scaledH = oldH * scale;
            newPage.drawPage(embeddedPage!, {
              x: (newW - scaledW) / 2,
              y: (newH - scaledH) / 2,
              width: scaledW,
              height: scaledH,
            });
          } else {
            // Center without scaling
            newPage.drawPage(embeddedPage!, {
              x: (newW - oldW) / 2,
              y: (newH - oldH) / 2,
              width: oldW,
              height: oldH,
            });
          }
        } else if (options.action === 'margin' && options.margins) {
          const { top, right, bottom, left } = options.margins;
          const newW = oldW + left + right;
          const newH = oldH + top + bottom;
          const newPage = newDoc.addPage([newW, newH]);
          
          newPage.drawPage(embeddedPage!, {
            x: left,
            y: bottom,
            width: oldW,
            height: oldH,
          });
        }
      }
      
      if (onProgress) onProgress({ percent: 90, message: "Saving PDF..." });
      const outBytes = await newDoc.save();
      return Comlink.transfer(outBytes, [outBytes.buffer]);
    }

    if (onProgress) onProgress({ percent: 90, message: "Saving PDF..." });
    const outBytes = await doc.save();
    return Comlink.transfer(outBytes, [outBytes.buffer]);
  },

  async getPdfMetadata(file: ArrayBuffer) {
    const { PDFDocument } = await import("pdf-lib");
    const doc = await PDFDocument.load(file);
    return {
      title: doc.getTitle(),
      author: doc.getAuthor(),
      subject: doc.getSubject(),
      keywords: doc.getKeywords(),
      producer: doc.getProducer(),
      creator: doc.getCreator(),
      creationDate: doc.getCreationDate(),
      modificationDate: doc.getModificationDate(),
    };
  },

  async setPdfMetadata(
    file: ArrayBuffer,
    metadata: {
      title?: string | null;
      author?: string | null;
      subject?: string | null;
      keywords?: string[] | null;
      producer?: string | null;
      creator?: string | null;
      clearAll?: boolean;
    },
    onProgress?: any
  ) {
    const { PDFDocument } = await import("pdf-lib");
    if (onProgress) onProgress({ percent: 10, message: "Loading PDF..." });
    const doc = await PDFDocument.load(file);
    
    if (onProgress) onProgress({ percent: 50, message: "Updating metadata..." });
    if (metadata.clearAll) {
      doc.setTitle('');
      doc.setAuthor('');
      doc.setSubject('');
      doc.setKeywords([]);
      doc.setProducer('');
      doc.setCreator('');
    } else {
      if (metadata.title !== undefined) doc.setTitle(metadata.title || '');
      if (metadata.author !== undefined) doc.setAuthor(metadata.author || '');
      if (metadata.subject !== undefined) doc.setSubject(metadata.subject || '');
      if (metadata.keywords !== undefined) doc.setKeywords(metadata.keywords || []);
      if (metadata.producer !== undefined) doc.setProducer(metadata.producer || '');
      if (metadata.creator !== undefined) doc.setCreator(metadata.creator || '');
    }

    // Always update modification date when editing metadata
    doc.setModificationDate(new Date());

    if (onProgress) onProgress({ percent: 90, message: "Saving PDF..." });
    const outBytes = await doc.save();
    return Comlink.transfer(outBytes, [outBytes.buffer]);
  },

  async getPdfBookmarks(file: ArrayBuffer, onProgress?: any) {
    if (onProgress) onProgress({ percent: 20, message: "Loading PDF..." });
    const pdfjsLib = await import("pdfjs-dist");
    const workerUrl = typeof location !== 'undefined' ? location.origin + (process.env.NEXT_PUBLIC_BASE_PATH || '') + '/pdf.worker.min.mjs' : 'https://unpkg.com/pdfjs-dist@6.1.200/build/pdf.worker.min.mjs';
    if (pdfjsLib.GlobalWorkerOptions) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;
    } else if ((pdfjsLib as any).default?.GlobalWorkerOptions) {
      (pdfjsLib as any).default.GlobalWorkerOptions.workerSrc = workerUrl;
    }

    const pdf = await pdfjsLib.getDocument({ data: file }).promise;
    
    if (onProgress) onProgress({ percent: 70, message: "Extracting bookmarks..." });
    const outline = await pdf.getOutline();
    
    // Convert outline into a simple array of nodes
    const serializeOutline = (nodes: any[] | null): any[] => {
      if (!nodes) return [];
      return nodes.map(node => ({
        title: node.title,
        bold: node.bold,
        italic: node.italic,
        color: node.color,
        items: serializeOutline(node.items)
      }));
    };

    const result = serializeOutline(outline);
    if (onProgress) onProgress({ percent: 100, message: "Done!" });
    return result;
  },

  async extractPdfAttachments(file: ArrayBuffer, onProgress?: any) {
    if (onProgress) onProgress({ percent: 20, message: "Loading PDF..." });
    const pdfjsLib = await import("pdfjs-dist");
    const workerUrl = typeof location !== 'undefined' ? location.origin + (process.env.NEXT_PUBLIC_BASE_PATH || '') + '/pdf.worker.min.mjs' : 'https://unpkg.com/pdfjs-dist@6.1.200/build/pdf.worker.min.mjs';
    if (pdfjsLib.GlobalWorkerOptions) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;
    } else if ((pdfjsLib as any).default?.GlobalWorkerOptions) {
      (pdfjsLib as any).default.GlobalWorkerOptions.workerSrc = workerUrl;
    }

    const pdf = await pdfjsLib.getDocument({ data: file }).promise;
    
    if (onProgress) onProgress({ percent: 70, message: "Extracting attachments..." });
    const attachmentsDict = await pdf.getAttachments();
    
    const results: Array<{ filename: string; content: Uint8Array }> = [];
    if (attachmentsDict) {
      if (attachmentsDict instanceof Map) {
        for (const [key, attachment] of attachmentsDict.entries()) {
          if (attachment && attachment.content) {
            results.push({
              filename: attachment.filename || key,
              content: attachment.content
            });
          }
        }
      } else {
        for (const key of Object.keys(attachmentsDict)) {
          const attachment = (attachmentsDict as any)[key];
          if (attachment && attachment.content) {
            results.push({
              filename: attachment.filename || key,
              content: attachment.content
            });
          }
        }
      }
    }
    
    if (onProgress) onProgress({ percent: 100, message: "Done!" });
    return results;
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
      let doc = await PDFDocument.load(bytes);
      const pages = await merged.copyPages(doc, doc.getPageIndices());
      pages.forEach(p => merged.addPage(p));
      
      // The instruction mentions sequential loading and release.
      // pdf-lib doesn't have an explicit 'release', but nullifying helps.
      (doc as any) = null;
    }
    
    if (onProgress) onProgress({ percent: 90, message: "Saving merged PDF..." });
    const result = await merged.save();
    if (onProgress) onProgress({ percent: 100, message: "Done!" });
    const _arr = new Uint8Array(result); return Comlink.transfer(_arr, [_arr.buffer]);
  },

  async compressPdf(file: ArrayBuffer, level: 'low' | 'medium' | 'high' = 'medium', onProgress?: ProgressCallback): Promise<Uint8Array> {
    if (onProgress) onProgress({ percent: 10, message: "Loading PDF..." });
    const { PDFDocument } = await import("pdf-lib");

    const loadOptions: any = {};

    // For 'high' compression, strip metadata
    if (level === 'high') {
      loadOptions.updateMetadata = false;
    }

    const doc = await PDFDocument.load(file, loadOptions);
    
    if (onProgress) onProgress({ percent: 30, message: "Analyzing structure..." });

    // For medium and high: strip metadata fields
    if (level === 'medium' || level === 'high') {
      doc.setTitle('');
      doc.setAuthor('');
      doc.setSubject('');
      doc.setKeywords([]);
      doc.setCreator('');
      doc.setProducer('');
    }

    if (onProgress) onProgress({ percent: 50, message: `Optimizing (${level} compression)...` });

    // For high compression: attempt to remove unused objects by re-serializing
    // pdf-lib's save with useObjectStreams packs cross-ref and object data more efficiently
    const saveOptions: any = {};
    
    if (level === 'medium' || level === 'high') {
      saveOptions.useObjectStreams = true;
    }

    // For high compression: re-encode through a copy to strip orphaned objects
    if (level === 'high') {
      if (onProgress) onProgress({ percent: 60, message: "Deep optimization — removing orphaned objects..." });
      const intermediateBytes = await doc.save(saveOptions);
      
      // Re-load and re-save to strip any orphaned references
      const doc2 = await PDFDocument.load(intermediateBytes, { updateMetadata: false });
      doc2.setTitle('');
      doc2.setAuthor('');
      doc2.setSubject('');
      doc2.setKeywords([]);
      doc2.setCreator('');
      doc2.setProducer('');
      
      if (onProgress) onProgress({ percent: 80, message: "Saving optimized PDF..." });
      const outBytes = await doc2.save({ useObjectStreams: true });
      if (onProgress) onProgress({ percent: 100, message: "Done!" });
      return Comlink.transfer(outBytes, [outBytes.buffer]);
    }

    if (onProgress) onProgress({ percent: 80, message: "Saving optimized PDF..." });
    const outBytes = await doc.save(saveOptions);
    
    if (onProgress) onProgress({ percent: 100, message: "Done!" });
    return Comlink.transfer(outBytes, [outBytes.buffer]);
  },

  async splitPdf(file: ArrayBuffer, splitAll: boolean, rangesStr: string, onProgress?: ProgressCallback): Promise<{ data: Uint8Array; ext: string; count: number }> {
    if (onProgress) onProgress({ percent: 10, message: "Loading PDF..." });
    const { PDFDocument } = await import("pdf-lib");
    const srcDoc = await PDFDocument.load(file);
    const total = srcDoc.getPageCount();

    function parseRanges(input: string, maxPage: number): number[][] {
      const parts = input.split(",").map(s => s.trim()).filter(Boolean);
      const out: number[][] = [];
      for (const p of parts) {
        if (p.includes("-")) {
          const [a, b] = p.split("-").map(n => parseInt(n.trim()));
          if (a === undefined || b === undefined) continue;
          if (!isNaN(a) && !isNaN(b) && a >= 1 && b <= maxPage && a <= b) {
            const pages: number[] = [];
            for (let i = a; i <= b; i++) pages.push(i - 1);
            out.push(pages);
          }
        } else {
          const n = parseInt(p);
          if (!isNaN(n) && n >= 1 && n <= maxPage) out.push([n - 1]);
        }
      }
      return out;
    }

    const groups = splitAll
      ? Array.from({ length: total }, (_, i) => [i])
      : parseRanges(rangesStr, total);

    if (groups.length === 0) {
      throw new Error("No valid page ranges found.");
    }

    if (groups.length === 1) {
      if (onProgress) onProgress({ percent: 50, message: "Extracting pages..." });
      const newDoc = await PDFDocument.create();
      const pages = await newDoc.copyPages(srcDoc, groups[0]!);
      pages.forEach((p: any) => newDoc.addPage(p));
      if (onProgress) onProgress({ percent: 90, message: "Saving PDF..." });
      const outBytes = await newDoc.save();
      if (onProgress) onProgress({ percent: 100, message: "Done!" });
      return { data: Comlink.transfer(outBytes, [outBytes.buffer]), ext: "pdf", count: 1 };
    }

    // Multiple groups -> zip them up
    const fflate = await import("fflate");
    const zipFiles: Record<string, Uint8Array> = {};

    for (let g = 0; g < groups.length; g++) {
      if (onProgress) onProgress({ percent: 10 + (g / groups.length) * 80, message: `Processing part ${g + 1}/${groups.length}...` });
      
      // Yield to event loop to allow abort signals and progress updates to process
      await new Promise(r => setTimeout(r, 0));
      
      const newDoc = await PDFDocument.create();
      const pages = await newDoc.copyPages(srcDoc, groups[g]!);
      pages.forEach((p: any) => newDoc.addPage(p));
      const outBytes = await newDoc.save();
      const label = splitAll ? `page-${groups[g]![0]! + 1}` : `part-${g + 1}`;
      zipFiles[`${label}.pdf`] = outBytes;
    }

    if (onProgress) onProgress({ percent: 95, message: "Zipping parts..." });
    const zipData = await new Promise<Uint8Array>((resolve, reject) => {
      fflate.zip(zipFiles, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });

    if (onProgress) onProgress({ percent: 100, message: "Done!" });
    return { data: Comlink.transfer(zipData, [zipData.buffer]), ext: "zip", count: groups.length };
  },

  // Image Tasks (Standard)
  async compressImage(file: ArrayBuffer, mimeType: string, format, quality, onProgress) {
    let imgBitmap: ImageBitmap | null = null;
    try {
      const blob = new Blob([file], { type: mimeType });
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
  async compressImageBatch(file: ArrayBuffer, mimeType: string, settings: CompressionSettings, onProgress) {
    let imgBitmap: ImageBitmap | null = null;
    try {
      if (onProgress) onProgress({ percent: 10, message: "Decoding image..." });
      const blob = new Blob([file], { type: mimeType });
      
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

      const assignments = new Array(pixels.length);
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
  async evaluateMath(expr: string): Promise<number> {
    // Injected helpers for eval
     
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
    
    // Using new Function as a slightly safer eval alternative for trusted math expressions
    const result = new Function(`return ${expr}`)();
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
    const lamejs = (await import("lamejs")) as any;
    const mp3encoder = new lamejs.Mp3Encoder(right ? 2 : 1, sampleRate, 128);
    const mp3Data: any[] = [];
    const sampleBlockSize = 1152;
    
    const convertBuffer = (buffer: Float32Array) => {
      const int16 = new Int16Array(buffer.length);
      for (let i = 0; i < buffer.length; i++) {
        const s = Math.max(-1, Math.min(1, buffer[i]!));
        int16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
      }
      return int16;
    };
    
    const leftInt = convertBuffer(left);
    const rightInt = right ? convertBuffer(right) : null;

    for (let i = 0; i < leftInt.length; i += sampleBlockSize) {
      const leftChunk = leftInt.subarray(i, i + sampleBlockSize);
      const rightChunk = rightInt ? rightInt.subarray(i, i + sampleBlockSize) : leftChunk;
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
    const _arr = new Uint8Array(result); return Comlink.transfer(_arr, [_arr.buffer]);
  },

  async encodeWav(channels, sampleRate, onProgress) {
    if (onProgress) onProgress({ percent: 10, message: "Initializing WAV encoding..." });
    const numOfChan = channels.length;
    const length = channels[0]!.length * numOfChan * 2 + 44;
    const buffer = new ArrayBuffer(length);
    const view = new DataView(buffer);
    let offset = 0;
    let pos = 0;

    const setUint16 = (data: number) => { view.setUint16(pos, data, true); pos += 2; };
    const setUint32 = (data: number) => { view.setUint32(pos, data, true); pos += 4; };

    setUint32(0x46464952); // "RIFF"
    setUint32(length - 8); // file length - 8
    setUint32(0x45564157); // "WAVE"
    setUint32(0x20746d66); // "fmt " chunk
    setUint32(16); // length = 16
    setUint16(1); // PCM (uncompressed)
    setUint16(numOfChan);
    setUint32(sampleRate);
    setUint32(sampleRate * 2 * numOfChan); // avg. bytes/sec
    setUint16(numOfChan * 2); // block-align
    setUint16(16); // 16-bit
    setUint32(0x61746164); // "data" - chunk
    setUint32(length - pos - 4); // chunk length

    if (onProgress) onProgress({ percent: 30, message: "Encoding channels..." });
    const totalSamples = channels[0]!.length;

    while(pos < length) {
        if (onProgress && offset % 100000 === 0) onProgress({ percent: 30 + (offset / totalSamples) * 70, message: "Encoding..." });
        for(let i=0; i<numOfChan; i++) {
            let sample = Math.max(-1, Math.min(1, channels[i]![offset] || 0));
            sample = (sample < 0 ? sample * 0x8000 : sample * 0x7FFF);
            view.setInt16(pos, sample, true);
            pos += 2;
        }
        offset++;
    }

    if (onProgress) onProgress({ percent: 100, message: "Done!" });
    const outBytes = new Uint8Array(buffer);
    return Comlink.transfer(outBytes, [outBytes.buffer]);
  },

  async createGif(frames, width, height, delay, onProgress) {
    const { GIFEncoder, quantize, applyPalette } = (await import('gifenc')) as any;
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
    const uniqueChars = [...new Set(text)].join('');
    const supportedChars = new Set<string>();
    for (const char of uniqueChars) {
      try {
        timesRomanFont.widthOfTextAtSize(char, 12);
        supportedChars.add(char);
      } catch (e) {
        // ignore
      }
    }
    
    let cleanText = "";
    for (const char of text) {
      if (supportedChars.has(char) || char === '\n' || char === '\r') {
        cleanText += char;
      }
    }

    const lines = cleanText.split("\n");

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
    return Comlink.transfer(pdfBytes, [pdfBytes.buffer]);
  },

  async extractImagesFromPdf(file, onProgress) {
    const pdfjsLib = await import("pdfjs-dist");
    const workerUrl = typeof location !== 'undefined' ? location.origin + (process.env.NEXT_PUBLIC_BASE_PATH || '') + '/pdf.worker.min.mjs' : 'https://unpkg.com/pdfjs-dist@6.1.200/build/pdf.worker.min.mjs';
    if (pdfjsLib.GlobalWorkerOptions) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;
    } else if ((pdfjsLib as any).default?.GlobalWorkerOptions) {
      (pdfjsLib as any).default.GlobalWorkerOptions.workerSrc = workerUrl;
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
    const transferList = extracted.map(item => item.arrayBuffer);
    return Comlink.transfer(extracted, transferList);
  },

  async ocrExtract(file, mimeType, onProgress) {
    if (onProgress) onProgress({ percent: 10, message: "Initializing OCR engine..." });
    const tesseract = await import("tesseract.js");
    const worker = await tesseract.createWorker("eng", 1, {
      workerPath: '/lib/tesseract/worker.min.js',
      corePath: '/lib/tesseract/tesseract-core.wasm.js',
      langPath: '/lib/tesseract/lang-data',
      logger: m => {
        if (m.status === 'recognizing text' && onProgress) {
          onProgress({ percent: Math.round(m.progress * 100), message: "Extracting text..." });
        }
      }
    });
    
    try {
      const blob = new Blob([file], { type: mimeType });
      const ret = await worker.recognize(blob);
      return ret.data.text;
    } finally {
      await worker.terminate();
    }
  },

  async extractTextFromPdf(file, onProgress) {
    const pdfjsLib = await import("pdfjs-dist");
    const workerUrl = typeof location !== 'undefined' ? location.origin + (process.env.NEXT_PUBLIC_BASE_PATH || '') + '/pdf.worker.min.mjs' : 'https://unpkg.com/pdfjs-dist@6.1.200/build/pdf.worker.min.mjs';
    if (pdfjsLib.GlobalWorkerOptions) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;
    } else if ((pdfjsLib as any).default?.GlobalWorkerOptions) {
      (pdfjsLib as any).default.GlobalWorkerOptions.workerSrc = workerUrl;
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
      const pageLines: string[] = [];
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

  async generateDocxFromText(text: string, onProgress?: ProgressCallback) {
    if (onProgress) onProgress({ percent: 10, message: "Loading docx library..." });
    const { Document, Packer, Paragraph, TextRun } = await import("docx");
    
    if (onProgress) onProgress({ percent: 30, message: "Parsing text sections..." });
    const sections = text.split("\n\n--- Page Break ---\n\n").map(pageContent => ({
      properties: {},
      children: pageContent.split("\n").map(line => 
        new Paragraph({
          children: [new TextRun({ text: line, size: 24 })],
          spacing: { after: 200 }
        })
      ),
    }));

    if (onProgress) onProgress({ percent: 60, message: "Generating DOCX document..." });
    const doc = new Document({ sections });
    const blob = await Packer.toBlob(doc);
    
    if (onProgress) onProgress({ percent: 90, message: "Transferring binary..." });
    const buf = await blob.arrayBuffer();
    const outBytes = new Uint8Array(buf);
    return Comlink.transfer(outBytes, [outBytes.buffer]);
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
  },

  async checkGrammar(text: string, ignoredWords: string[], tone: string, onProgress?: any) {
    if (onProgress) onProgress({ percent: 10, message: "Loading dictionaries..." });
    const { runGrammarCheck } = await import("../features/grammar-checker/utils/engine");
    return runGrammarCheck(text, ignoredWords, tone, onProgress);
  },

  async computePerceptualHash(file: ArrayBuffer, mimeType: string, onProgress?: any) { return ""; },
  async cropImageCenter(file: ArrayBuffer, mimeType: string, width: number, height: number, onProgress?: any) { return file; },
  async rotateImageStandard(file: ArrayBuffer, mimeType: string, onProgress?: any) { return file; },
  async generateSpriteSheet(file: ArrayBuffer, mimeType: string, onProgress?: any) { return file; },
  async optimizeSvg(file: ArrayBuffer, mimeType: string, onProgress?: any) { return ""; },
  async generateHistogram(file: ArrayBuffer, mimeType: string, onProgress?: any) { return []; },
  async simulateColorBlindness(file: ArrayBuffer, mimeType: string, type: string, onProgress?: any) { return file; }
};

Comlink.expose(api as any);
export type UnifiedWorkerAPI = typeof api;
