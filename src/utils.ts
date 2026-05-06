/* ===== utils.ts – shared helpers ===== */

const Utils = (() => {

  function formatBytes(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  }

  function safeName(name: string): string {
    const lastDot = name.lastIndexOf('.');
    if (lastDot <= 0) return name.replace(/[^a-zA-Z0-9_\-]/g, '_');
    const base = name.slice(0, lastDot);
    const ext  = name.slice(lastDot);
    return base.replace(/[^a-zA-Z0-9_\-]/g, '_') + ext.toLowerCase();
  }

  function hasSpecialChars(name: string): boolean {
    const lastDot = name.lastIndexOf('.');
    const base = lastDot <= 0 ? name : name.slice(0, lastDot);
    return /[^a-zA-Z0-9_\-]/.test(base);
  }

  function readAsDataURL(file: File): Promise<string> {
    return new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = e => res((e.target as FileReader).result as string);
      r.onerror = rej;
      r.readAsDataURL(file);
    });
  }

  function readAsArrayBuffer(file: File | Blob): Promise<ArrayBuffer> {
    return new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = e => res((e.target as FileReader).result as ArrayBuffer);
      r.onerror = rej;
      r.readAsArrayBuffer(file);
    });
  }

  function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((res, rej) => {
      const img = new Image();
      img.onload = () => res(img);
      img.onerror = rej;
      img.src = src;
    });
  }

  function downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 1000);
  }

  function drawResized(img: HTMLImageElement, maxW: number | null, maxH: number | null): HTMLCanvasElement {
    let w = img.naturalWidth;
    let h = img.naturalHeight;
    if (maxW && w > maxW) { h = Math.round(h * maxW / w); w = maxW; }
    if (maxH && h > maxH) { w = Math.round(w * maxH / h); h = maxH; }
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    (c.getContext('2d') as CanvasRenderingContext2D).drawImage(img, 0, 0, w, h);
    return c;
  }

  function canvasToBlob(canvas: HTMLCanvasElement, mimeType: string = 'image/jpeg', quality: number = 0.85): Promise<Blob> {
    return new Promise(res => canvas.toBlob(b => res(b as Blob), mimeType, quality));
  }

  function mimeFromExt(ext: string): string {
    const map: Record<string, string> = {
      jpg: 'image/jpeg', jpeg: 'image/jpeg', jfif: 'image/jpeg',
      png: 'image/png', gif: 'image/gif',
      webp: 'image/webp', avif: 'image/avif',
      tiff: 'image/tiff', tif: 'image/tiff',
      bmp: 'image/bmp',
      heic: 'image/heic', heif: 'image/heif',
      pdf: 'application/pdf'
    };
    return map[ext.toLowerCase()] || 'application/octet-stream';
  }

  function extFromMime(mime: string): string {
    const map: Record<string, string> = {
      'image/jpeg': 'jpg', 'image/png': 'png', 'image/gif': 'gif',
      'image/webp': 'webp', 'image/avif': 'avif',
      'image/tiff': 'tiff', 'image/bmp': 'bmp',
      'image/heic': 'heic', 'image/heif': 'heif',
      'application/pdf': 'pdf'
    };
    return map[mime] || 'bin';
  }

  function supportsFormat(mime: string): Promise<boolean> {
    return new Promise(resolve => {
      const c = document.createElement('canvas');
      c.width = c.height = 2;
      (c.getContext('2d') as CanvasRenderingContext2D).fillRect(0, 0, 2, 2);
      c.toBlob(b => resolve(b !== null && b.type === mime), mime, 0.9);
    });
  }

  function replaceExt(filename: string, newExt: string): string {
    const dot = filename.lastIndexOf('.');
    const base = dot > 0 ? filename.slice(0, dot) : filename;
    return base + '.' + newExt;
  }

  function getExt(filename: string): string {
    const dot = filename.lastIndexOf('.');
    return dot > 0 ? filename.slice(dot + 1).toLowerCase() : '';
  }

  function escHtml(str: unknown): string {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function spinnerHTML(): string {
    return '<span class="spinner"></span>';
  }

  function sizeBars(originalBytes: number, newBytes: number): string {
    const pct = Math.min(100, Math.round(newBytes / originalBytes * 100));
    const cls = pct < 70 ? 'fill-ok' : pct < 95 ? 'fill-warn' : 'fill-bad';
    return `<div class="size-bar-wrap">
      <div class="size-bar-label">${formatBytes(originalBytes)} → <strong>${formatBytes(newBytes)}</strong> (${pct}%)</div>
      <div class="size-bar"><div class="size-bar-fill ${cls}" style="width:${pct}%"></div></div>
    </div>`;
  }

  function debounce<T extends (...args: unknown[]) => void>(func: T, wait: number): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout> | undefined;
    return function executedFunction(...args: Parameters<T>) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // ── Blob URL registry – tracks all object URLs so they can be revoked ──
  const _blobUrls: string[] = [];

  function createObjectURL(blob: Blob): string {
    const url = URL.createObjectURL(blob);
    _blobUrls.push(url);
    return url;
  }

  function revokeObjectURL(url: string): void {
    const idx = _blobUrls.indexOf(url);
    if (idx !== -1) _blobUrls.splice(idx, 1);
    URL.revokeObjectURL(url);
  }

  function revokeAllObjectURLs(): void {
    _blobUrls.forEach(u => URL.revokeObjectURL(u));
    _blobUrls.length = 0;
  }

  function validateFile(file: File | null, allowedExtensions: string[] = [], maxMB: number = 20): FileValidationResult {
    if (!file) return { valid: false, error: 'No file selected.' };

    const maxSize = maxMB * 1024 * 1024;
    if (file.size > maxSize) {
      return { valid: false, error: `File is too large (max ${maxMB}MB).` };
    }

    const ext = getExt(file.name);
    if (allowedExtensions.length > 0) {
      if (!allowedExtensions.includes(ext)) {
        return { valid: false, error: `Invalid file type. Allowed: ${allowedExtensions.join(', ')}` };
      }
    }

    const expectedMime = mimeFromExt(ext);
    if (file.type && expectedMime !== 'application/octet-stream') {
      const isMatch =
        (file.type === expectedMime) ||
        (expectedMime === 'image/jpeg' && ['image/pjpeg', 'image/jpg'].includes(file.type)) ||
        (expectedMime === 'image/png' && file.type === 'image/x-png');

      if (!isMatch) {
        const expectedCat = expectedMime.split('/')[0];
        const actualCat   = file.type.split('/')[0];
        if (expectedCat !== actualCat) {
          return { valid: false, error: `Security Warning: File content (${file.type}) does not match extension (.${ext}).` };
        }
      }
    }

    return { valid: true };
  }

  /**
   * UTF-8-safe Base64 encode. The native btoa() throws on multi-byte
   * characters (emoji, non-ASCII). Encode UTF-8 bytes to a Latin-1
   * string that btoa() accepts.
   */
  function b64EncodeUtf8(text: string): string {
    const bytes = new TextEncoder().encode(text);
    let bin = '';
    for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin);
  }

  /**
   * UTF-8-safe Base64 decode. Accepts both standard and URL-safe Base64
   * (with or without padding) and decodes the resulting bytes as UTF-8.
   */
  function b64DecodeUtf8(b64: string): string {
    let s = b64.replace(/-/g, '+').replace(/_/g, '/').replace(/\s+/g, '');
    while (s.length % 4) s += '=';
    const bin = atob(s);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder('utf-8', { fatal: false }).decode(bytes);
  }

  /**
   * Forgiving JSON parser. Returns the value on success. On failure, returns
   * an object with line/column information extracted from the native parse
   * error so callers can show a friendly message. As a last resort, strips
   * common offenders (trailing commas, JS comments) and retries.
   */
  function lenientJsonParse(text: string): { ok: true; value: unknown; sanitized: boolean }
                                          | { ok: false; error: string; line?: number; col?: number; pos?: number } {
    function tryParse(t: string) {
      try { return { ok: true as const, value: JSON.parse(t) }; }
      catch (e) { return { ok: false as const, error: (e as Error).message }; }
    }
    const first = tryParse(text);
    if (first.ok) return { ok: true, value: first.value, sanitized: false };

    // Strip line + block comments and trailing commas (matches outside strings only)
    const sanitized = text
      .replace(/(['"`])(?:\\.|(?!\1)[^\\])*\1|\/\/.*$|\/\*[\s\S]*?\*\//gm,
               m => (m.startsWith('"') || m.startsWith("'") || m.startsWith('`')) ? m : '')
      .replace(/,\s*([}\]])/g, '$1');
    if (sanitized !== text) {
      const second = tryParse(sanitized);
      if (second.ok) return { ok: true, value: second.value, sanitized: true };
    }

    // Extract position info from the native error message
    const msg = first.error;
    const posMatch = msg.match(/position\s+(\d+)/i);
    const lineMatch = msg.match(/line\s+(\d+)/i);
    const colMatch = msg.match(/column\s+(\d+)/i);
    let line: number | undefined;
    let col: number | undefined;
    let pos: number | undefined;
    if (posMatch) {
      pos = parseInt(posMatch[1], 10);
      const upTo = text.slice(0, pos);
      line = upTo.split('\n').length;
      col = pos - upTo.lastIndexOf('\n');
    } else if (lineMatch) {
      line = parseInt(lineMatch[1], 10);
      if (colMatch) col = parseInt(colMatch[1], 10);
    }
    return { ok: false, error: msg, line, col, pos };
  }

  return {
    formatBytes, safeName, hasSpecialChars,
    readAsDataURL, readAsArrayBuffer,
    loadImage, downloadBlob, drawResized, canvasToBlob,
    mimeFromExt, extFromMime, supportsFormat,
    replaceExt, getExt,
    escHtml, spinnerHTML, sizeBars,
    debounce, validateFile,
    createObjectURL, revokeObjectURL, revokeAllObjectURLs,
    b64EncodeUtf8, b64DecodeUtf8, lenientJsonParse,
  };
})();
