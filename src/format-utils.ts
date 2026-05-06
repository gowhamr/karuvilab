/* ===== format-utils.ts – special format encode/decode ===== */

import { FormatInfo } from './types';
import * as Utils from './utils';

declare global {
  interface Window {
    heic2any?: (options: { blob: Blob; toType: string; quality: number }) => Promise<Blob | Blob[]>;
    UTIF?: {
      decode: (buffer: ArrayBuffer) => any[];
      decodeImage: (buffer: ArrayBuffer, ifd: any) => void;
      toRGBA8: (ifd: any) => Uint8Array;
      encodeImage: (rgba: Uint8ClampedArray | Uint8Array, w: number, h: number) => ArrayBuffer;
    };
  }
}

export const FORMAT_INFO: Record<string, FormatInfo> = {
  jpg:  { label: 'JPEG',  exts: ['jpg', 'jpeg', 'jfif'], color: '#f97316', canExport: true  },
  png:  { label: 'PNG',   exts: ['png'],                 color: '#0ea5e9', canExport: true  },
  gif:  { label: 'GIF',   exts: ['gif'],                 color: '#8b5cf6', canExport: true  },
  webp: { label: 'WebP',  exts: ['webp'],                color: '#10b981', canExport: true  },
  avif: { label: 'AVIF',  exts: ['avif'],                color: '#6366f1', canExport: true  },
  tiff: { label: 'TIFF',  exts: ['tiff', 'tif'],         color: '#f59e0b', canExport: true  },
  bmp:  { label: 'BMP',   exts: ['bmp'],                 color: '#64748b', canExport: true  },
  heic: { label: 'HEIC',  exts: ['heic', 'heif'],        color: '#ec4899', canExport: false },
  jfif: { label: 'JFIF',  exts: ['jfif'],                color: '#f97316', canExport: true  },
  pdf:  { label: 'PDF',   exts: ['pdf'],                 color: '#ef4444', canExport: true  },
};

export const SPECIAL_READ = ['heic', 'heif', 'tiff', 'tif'];
export const ALL_IMAGE_EXTS = ['jpg', 'jpeg', 'jfif', 'png', 'gif', 'webp', 'avif', 'tiff', 'tif', 'bmp', 'heic', 'heif'];

export function isImage(file: File): boolean {
  const ext = Utils.getExt(file.name);
  return ALL_IMAGE_EXTS.includes(ext) || /^image\//.test(file.type);
}

export function needsSpecialRead(file: File): boolean {
  return SPECIAL_READ.includes(Utils.getExt(file.name));
}

export async function loadAny(file: File): Promise<HTMLImageElement | HTMLCanvasElement> {
  const ext = Utils.getExt(file.name);
  if (ext === 'heic' || ext === 'heif') return loadHeic(file);
  if (ext === 'tiff' || ext === 'tif')  return loadTiff(file);
  const dataUrl = await Utils.readAsDataURL(file);
  return Utils.loadImage(dataUrl);
}

export async function loadHeic(file: File): Promise<HTMLImageElement> {
  if (typeof window === 'undefined' || !window.heic2any) throw new Error('HEIC decoder (heic2any) not loaded. Check your network connection.');
  const result = await window.heic2any({ blob: file, toType: 'image/png', quality: 0.95 });
  const pngBlob = Array.isArray(result) ? result[0] : result;
  const url = URL.createObjectURL(pngBlob);
  const img = await Utils.loadImage(url);
  URL.revokeObjectURL(url);
  return img;
}

export async function loadTiff(file: File): Promise<HTMLCanvasElement> {
  if (typeof window === 'undefined' || !window.UTIF) throw new Error('TIFF decoder (UTIF) not loaded. Check your network connection.');
  const ab   = await Utils.readAsArrayBuffer(file);
  const ifds = window.UTIF.decode(ab);
  if (!ifds.length) throw new Error('No images found in TIFF file.');
  window.UTIF.decodeImage(ab, ifds[0]);
  const rgba = window.UTIF.toRGBA8(ifds[0]);
  const w = ifds[0].width, h = ifds[0].height;
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  const imgData = ctx.createImageData(w, h);
  imgData.data.set(new Uint8Array(rgba.buffer ?? rgba));
  ctx.putImageData(imgData, 0, 0);
  return canvas;
}

export function encodeTiff(canvas: HTMLCanvasElement): Blob {
  if (typeof window === 'undefined' || !window.UTIF) throw new Error('TIFF encoder (UTIF) not loaded.');
  const ctx     = canvas.getContext('2d') as CanvasRenderingContext2D;
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const tiffBuf = window.UTIF.encodeImage(imgData.data, canvas.width, canvas.height);
  return new Blob([tiffBuf], { type: 'image/tiff' });
}

export function encodeBmp(canvas: HTMLCanvasElement): Blob {
  const w = canvas.width, h = canvas.height;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  const { data } = ctx.getImageData(0, 0, w, h);

  const rowPad  = (4 - ((w * 3) % 4)) % 4;
  const rowSize = w * 3 + rowPad;
  const pixSize = rowSize * h;
  const fileSize = 54 + pixSize;

  const buf  = new ArrayBuffer(fileSize);
  const view = new DataView(buf);
  const u8   = new Uint8Array(buf);

  u8[0] = 0x42; u8[1] = 0x4D;
  view.setUint32(2,  fileSize, true);
  view.setUint32(6,  0,        true);
  view.setUint32(10, 54,       true);
  view.setUint32(14, 40,       true);
  view.setInt32 (18, w,        true);
  view.setInt32 (22, h,        true);
  view.setUint16(26, 1,        true);
  view.setUint16(28, 24,       true);
  view.setUint32(30, 0,        true);
  view.setUint32(34, pixSize,  true);
  view.setInt32 (38, 2835,     true);
  view.setInt32 (42, 2835,     true);
  view.setUint32(46, 0,        true);
  view.setUint32(50, 0,        true);

  let off = 54;
  for (let y = h - 1; y >= 0; y--) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      u8[off++] = data[i + 2];
      u8[off++] = data[i + 1];
      u8[off++] = data[i];
    }
    for (let p = 0; p < rowPad; p++) u8[off++] = 0;
  }

  return new Blob([buf], { type: 'image/bmp' });
}

export function drawElement(
  el: HTMLImageElement | HTMLCanvasElement,
  maxW: number | null,
  maxH: number | null
): HTMLCanvasElement {
  const w0 = (el as HTMLImageElement).naturalWidth  ?? (el as HTMLCanvasElement).width;
  const h0 = (el as HTMLImageElement).naturalHeight ?? (el as HTMLCanvasElement).height;
  let w = w0, h = h0;
  if (maxW && w > maxW) { h = Math.round(h * maxW / w); w = maxW; }
  if (maxH && h > maxH) { w = Math.round(w * maxH / h); h = maxH; }
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  (c.getContext('2d') as CanvasRenderingContext2D).drawImage(el, 0, 0, w, h);
  return c;
}

export function colorFor(ext: string): string {
  const key =
    ext === 'jpeg' || ext === 'jfif' ? 'jpg' :
    ext === 'tif'  ? 'tiff' :
    ext === 'heif' ? 'heic' : ext;
  return (FORMAT_INFO[key] || {}).color || '#6366f1';
}

export function jsonToCsv(arr: Record<string, unknown>[]): string {
  if (!Array.isArray(arr) || !arr.length) return '';
  const headers = Object.keys(arr[0]);
  const csvRows: string[] = [];
  csvRows.push(headers.join(','));
  for (const row of arr) {
    const values = headers.map(header => {
      const val     = row[header];
      const escaped = String(val ?? '').replace(/"/g, '\\"');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }
  return csvRows.join('\n');
}
