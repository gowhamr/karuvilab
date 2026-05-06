import { describe, it, expect } from 'vitest';

// Pure functions extracted from src/utils.ts for isolated testing.
// These have zero DOM/browser dependencies.

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

function getExt(filename: string): string {
  const dot = filename.lastIndexOf('.');
  return dot > 0 ? filename.slice(dot + 1).toLowerCase() : '';
}

function replaceExt(filename: string, newExt: string): string {
  const dot = filename.lastIndexOf('.');
  const base = dot > 0 ? filename.slice(0, dot) : filename;
  return base + '.' + newExt;
}

function escHtml(str: unknown): string {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function mimeFromExt(ext: string): string {
  const map: Record<string, string> = {
    jpg: 'image/jpeg', jpeg: 'image/jpeg', jfif: 'image/jpeg',
    png: 'image/png',  gif: 'image/gif',
    webp: 'image/webp', avif: 'image/avif',
    tiff: 'image/tiff', tif: 'image/tiff',
    bmp: 'image/bmp',
    heic: 'image/heic', heif: 'image/heif',
    pdf: 'application/pdf',
  };
  return map[ext.toLowerCase()] || 'application/octet-stream';
}

// ─── formatBytes ────────────────────────────────────────────────
describe('formatBytes', () => {
  it('formats bytes under 1 KB', () => {
    expect(formatBytes(0)).toBe('0 B');
    expect(formatBytes(512)).toBe('512 B');
    expect(formatBytes(1023)).toBe('1023 B');
  });

  it('formats values in KB range', () => {
    expect(formatBytes(1024)).toBe('1.0 KB');
    expect(formatBytes(1536)).toBe('1.5 KB');
    expect(formatBytes(102400)).toBe('100.0 KB');
  });

  it('formats values in MB range', () => {
    expect(formatBytes(1048576)).toBe('1.00 MB');
    expect(formatBytes(5242880)).toBe('5.00 MB');
  });
});

// ─── getExt ─────────────────────────────────────────────────────
describe('getExt', () => {
  it('returns lowercase extension', () => {
    expect(getExt('photo.JPG')).toBe('jpg');
    expect(getExt('doc.PDF')).toBe('pdf');
  });

  it('handles files with multiple dots', () => {
    expect(getExt('archive.tar.gz')).toBe('gz');
  });

  it('returns empty string for no extension', () => {
    expect(getExt('README')).toBe('');
    expect(getExt('.gitignore')).toBe('');
  });
});

// ─── safeName ───────────────────────────────────────────────────
describe('safeName', () => {
  it('replaces special characters in basename', () => {
    expect(safeName('my file (1).jpg')).toBe('my_file__1_.jpg');
  });

  it('lowercases the extension', () => {
    expect(safeName('Photo.JPG')).toBe('Photo.jpg');
  });

  it('preserves hyphens and underscores', () => {
    expect(safeName('my-photo_01.png')).toBe('my-photo_01.png');
  });

  it('handles names with no extension', () => {
    expect(safeName('my file!')).toBe('my_file_');
  });
});

// ─── hasSpecialChars ────────────────────────────────────────────
describe('hasSpecialChars', () => {
  it('detects spaces', () => { expect(hasSpecialChars('my file.jpg')).toBe(true); });
  it('detects parentheses', () => { expect(hasSpecialChars('file(1).png')).toBe(true); });
  it('returns false for clean names', () => { expect(hasSpecialChars('clean-file_01.jpg')).toBe(false); });
  it('checks only the base name (up to last dot)', () => {
    // base of 'archive.tar.gz' is 'archive.tar' which contains a dot → true
    expect(hasSpecialChars('archive.tar.gz')).toBe(true);
    // base of 'clean_file.jpg' is 'clean_file' → false
    expect(hasSpecialChars('clean_file.jpg')).toBe(false);
  });
});

// ─── replaceExt ─────────────────────────────────────────────────
describe('replaceExt', () => {
  it('replaces the extension', () => {
    expect(replaceExt('photo.jpg', 'png')).toBe('photo.png');
    expect(replaceExt('doc.pdf', 'jpg')).toBe('doc.jpg');
  });

  it('handles no-extension filenames', () => {
    expect(replaceExt('README', 'txt')).toBe('README.txt');
  });
});

// ─── escHtml ────────────────────────────────────────────────────
describe('escHtml', () => {
  it('escapes all four dangerous characters', () => {
    expect(escHtml('<script>alert("xss")</script>')).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
  });

  it('escapes ampersands', () => {
    expect(escHtml('a & b')).toBe('a &amp; b');
  });

  it('coerces non-strings', () => {
    expect(escHtml(42)).toBe('42');
    expect(escHtml(null)).toBe('null');
  });

  it('returns empty string unchanged', () => {
    expect(escHtml('')).toBe('');
  });
});

// ─── mimeFromExt ────────────────────────────────────────────────
describe('mimeFromExt', () => {
  it('maps image extensions correctly', () => {
    expect(mimeFromExt('jpg')).toBe('image/jpeg');
    expect(mimeFromExt('jpeg')).toBe('image/jpeg');
    expect(mimeFromExt('png')).toBe('image/png');
    expect(mimeFromExt('webp')).toBe('image/webp');
    expect(mimeFromExt('avif')).toBe('image/avif');
  });

  it('is case-insensitive', () => {
    expect(mimeFromExt('JPG')).toBe('image/jpeg');
    expect(mimeFromExt('PNG')).toBe('image/png');
  });

  it('maps pdf correctly', () => {
    expect(mimeFromExt('pdf')).toBe('application/pdf');
  });

  it('falls back to octet-stream for unknown types', () => {
    expect(mimeFromExt('xyz')).toBe('application/octet-stream');
  });
});

// ─── b64EncodeUtf8 / b64DecodeUtf8 ───────────────────────────────
function b64EncodeUtf8(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}
function b64DecodeUtf8(b64: string): string {
  let s = b64.replace(/-/g, '+').replace(/_/g, '/').replace(/\s+/g, '');
  while (s.length % 4) s += '=';
  const bin = atob(s);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder('utf-8', { fatal: false }).decode(bytes);
}

describe('b64EncodeUtf8 / b64DecodeUtf8', () => {
  it('round-trips ASCII text', () => {
    expect(b64DecodeUtf8(b64EncodeUtf8('Hello world'))).toBe('Hello world');
  });
  it('round-trips emoji safely (native btoa would throw)', () => {
    const original = 'Hello 👋 KaruviLab 🚀';
    const encoded = b64EncodeUtf8(original);
    expect(typeof encoded).toBe('string');
    expect(b64DecodeUtf8(encoded)).toBe(original);
  });
  it('round-trips multi-byte non-ASCII', () => {
    const original = 'ಕರುವಿ — naïve résumé · 日本語 · العربية';
    expect(b64DecodeUtf8(b64EncodeUtf8(original))).toBe(original);
  });
  it('decodes URL-safe base64 with no padding', () => {
    const original = 'Hello 👋';
    const std = b64EncodeUtf8(original);
    const urlSafe = std.replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
    expect(b64DecodeUtf8(urlSafe)).toBe(original);
  });
});

// ─── lenientJsonParse ───────────────────────────────────────────
function lenientJsonParse(text: string):
  | { ok: true; value: unknown; sanitized: boolean }
  | { ok: false; error: string; line?: number; col?: number; pos?: number } {
  function tryParse(t: string) {
    try { return { ok: true as const, value: JSON.parse(t) }; }
    catch (e) { return { ok: false as const, error: (e as Error).message }; }
  }
  const first = tryParse(text);
  if (first.ok) return { ok: true, value: first.value, sanitized: false };

  const sanitized = text
    .replace(/(['"`])(?:\\.|(?!\1)[^\\])*\1|\/\/.*$|\/\*[\s\S]*?\*\//gm,
             m => (m.startsWith('"') || m.startsWith("'") || m.startsWith('`')) ? m : '')
    .replace(/,\s*([}\]])/g, '$1');
  if (sanitized !== text) {
    const second = tryParse(sanitized);
    if (second.ok) return { ok: true, value: second.value, sanitized: true };
  }

  const msg = first.error;
  const posMatch = msg.match(/position\s+(\d+)/i);
  let line: number | undefined;
  let col: number | undefined;
  let pos: number | undefined;
  if (posMatch) {
    pos = parseInt(posMatch[1], 10);
    const upTo = text.slice(0, pos);
    line = upTo.split('\n').length;
    col = pos - upTo.lastIndexOf('\n');
  }
  return { ok: false, error: msg, line, col, pos };
}

describe('lenientJsonParse', () => {
  it('parses valid JSON without sanitisation', () => {
    const r = lenientJsonParse('{"a":1,"b":[1,2,3]}');
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value).toEqual({ a: 1, b: [1, 2, 3] });
      expect(r.sanitized).toBe(false);
    }
  });
  it('strips trailing commas in objects and arrays', () => {
    const r = lenientJsonParse('{"name":"test",}');
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value).toEqual({ name: 'test' });
      expect(r.sanitized).toBe(true);
    }
    const r2 = lenientJsonParse('[1, 2, 3,]');
    expect(r2.ok).toBe(true);
    if (r2.ok) expect(r2.value).toEqual([1, 2, 3]);
  });
  it('strips line and block comments', () => {
    const r = lenientJsonParse('{\n"a":1, // comment\n"b":2 /* trailing */}');
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toEqual({ a: 1, b: 2 });
  });
  it('reports an error on real failures', () => {
    const r = lenientJsonParse('{"a":}');
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(typeof r.error).toBe('string');
      expect(r.error.length).toBeGreaterThan(0);
    }
  });
});
