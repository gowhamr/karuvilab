#!/usr/bin/env node
/**
 * Generate favicon.ico + PNG icons for KaruviLab.
 * Uses only built-in Node.js modules (zlib, fs, path).
 * Renders a rounded-square with the brand gradient and a white 'K' lettermark.
 */
'use strict';
const zlib = require('zlib');
const fs   = require('fs');
const path = require('path');

// ── CRC32 ─────────────────────────────────────────────────────────────────────
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
    t[i] = c;
  }
  return t;
})();
function crc32(buf) {
  let c = 0xFFFFFFFF;
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xFF] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
}
function pngChunk(type, data) {
  const td  = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}

// ── PNG encoder ───────────────────────────────────────────────────────────────
function makePng(w, h, getPixel) {
  const rows = [];
  for (let y = 0; y < h; y++) {
    rows.push(0); // filter: None
    for (let x = 0; x < w; x++) rows.push(...getPixel(x, y));
  }
  const idat = zlib.deflateSync(Buffer.from(rows), { level: 9 });
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; ihdr[9] = 6; // 8-bit RGBA
  return Buffer.concat([
    Buffer.from([137,80,78,71,13,10,26,10]),
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', idat),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
}

// ── Icon pixel renderer ───────────────────────────────────────────────────────
function distSeg(px, py, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay;
  const len2 = dx * dx + dy * dy;
  if (len2 === 0) return Math.hypot(px - ax, py - ay);
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / len2));
  return Math.hypot(px - ax - t * dx, py - ay - t * dy);
}

function iconPixel(x, y, size) {
  const s  = size;
  const cx = s / 2, cy = s / 2;

  // Rounded-rect SDF – corner radius = 24 % of size
  const cr = s * 0.24;
  const hw = s / 2 - 0.5, hh = s / 2 - 0.5;
  const rx = Math.abs(x - cx) - hw + cr;
  const ry = Math.abs(y - cy) - hh + cr;
  const dist = Math.min(Math.max(rx, ry), 0) +
               Math.sqrt(Math.max(rx, 0) ** 2 + Math.max(ry, 0) ** 2) - cr;

  if (dist > 1.2) return [0, 0, 0, 0]; // outside
  const baseAlpha = Math.round(Math.min(1, Math.max(0, 1.2 - dist)) * 255);

  // --- Premium Gradient Background ---
  // Gradient: Indigo-500 -> Blue-600 -> Indigo-800
  // Approx interpolation for a nice diagonal feel
  const t = (x / s + y / s) / 2;
  let bgR, bgG, bgB;
  if (t < 0.5) {
    const it = t * 2;
    bgR = Math.round(99 + (37 - 99) * it);
    bgG = Math.round(102 + (99 - 102) * it);
    bgB = Math.round(241 + (235 - 241) * it);
  } else {
    const it = (t - 0.5) * 2;
    bgR = Math.round(37 + (55 - 37) * it);
    bgG = Math.round(99 + (48 - 99) * it);
    bgB = Math.round(235 + (163 - 235) * it);
  }

  // --- Glass Highlights & Depth ---
  // 1. Top Highlight (Glare)
  const glare = Math.max(0, 1 - Math.hypot((x - s*0.2)/s, (y - s*0.1)/s) * 2.5);
  const glareAmount = Math.pow(glare, 2) * 60;
  
  // 2. Inner Glow / Border
  const innerGlow = Math.max(0, 1 - Math.abs(dist + 0.5) * (15 / s));
  const glowAmount = Math.pow(innerGlow, 2) * 40;

  bgR = Math.min(255, bgR + glareAmount + glowAmount);
  bgG = Math.min(255, bgG + glareAmount + glowAmount);
  bgB = Math.min(255, bgB + glareAmount + glowAmount);

  // --- Refined 'KV' Lettermark ---
  const sc  = s * 0.38; // Slightly smaller to breathe
  const nx  = (x - cx) / sc;
  const ny  = (y - cy) / sc;
  const sw  = 0.14; // stroke half-width

  // K Stem (M26 20V80 -> nx approx -0.6)
  const inKStem = Math.abs(nx + 0.6) < sw && Math.abs(ny) < 0.75;
  // K Chevron (M54 20L26 50L54 80 -> nx -0.6 to 0.1)
  const inKUpper = distSeg(nx, ny, 0.1, -0.75, -0.6, 0) < sw;
  const inKLower = distSeg(nx, ny, -0.6, 0, 0.1, 0.75) < sw;

  // V (M62 20L76 80L90 20 -> nx 0.3 to 1.0)
  const inVLeft  = distSeg(nx, ny, 0.3, -0.75, 0.65, 0.75) < sw;
  const inVRight = distSeg(nx, ny, 0.65, 0.75, 1.0, -0.75) < sw;

  if (inKStem || inKUpper || inKLower || inVLeft || inVRight) {
    // White K with subtle gloss
    const gloss = Math.max(0, 1 - ny) * 15;
    return [
      Math.min(255, 250 + gloss), 
      Math.min(255, 250 + gloss), 
      Math.min(255, 250 + gloss), 
      baseAlpha
    ];
  }

  return [bgR, bgG, bgB, baseAlpha];
}

// ── Generate PNGs ─────────────────────────────────────────────────────────────
// Write directly to the project root so favicon assets are picked up by
// every page. (Earlier versions of this script wrote to scripts/icons/
// which is gitignored — that left generated assets stranded.)
const projectRoot = path.resolve(__dirname, '..');
const iconsDir = path.join(projectRoot, 'public', 'icons');
if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir, { recursive: true });

const sizes = [16, 32, 48, 180, 192, 256, 512];
const pngMap = {};
for (const sz of sizes) {
  const buf = makePng(sz, sz, (x, y) => iconPixel(x, y, sz));
  const file = path.join(iconsDir, `icon-${sz}.png`);
  fs.writeFileSync(file, buf);
  pngMap[sz] = buf;
  console.log(`  public/icons/icon-${sz}.png  (${buf.length} bytes)`);
}

// ── Generate favicon.ico (16 + 32 + 48 as embedded PNGs) ─────────────────────
function makeIco(entries) {
  const count  = entries.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(count, 4);

  let offset = 6 + count * 16;
  const dirs = entries.map(({ sz, png }) => {
    const d = Buffer.alloc(16);
    d[0] = sz >= 256 ? 0 : sz; d[1] = sz >= 256 ? 0 : sz;
    d[2] = 0; d[3] = 0;
    d.writeUInt16LE(1, 4); d.writeUInt16LE(32, 6);
    d.writeUInt32LE(png.length, 8);
    d.writeUInt32LE(offset,     12);
    offset += png.length;
    return d;
  });

  return Buffer.concat([header, ...dirs, ...entries.map(e => e.png)]);
}

const ico = makeIco([
  { sz: 16, png: pngMap[16] },
  { sz: 32, png: pngMap[32] },
  { sz: 48, png: pngMap[48] },
]);
fs.writeFileSync(path.join(projectRoot, 'public', 'favicon.ico'), ico);
fs.writeFileSync(path.join(projectRoot, 'favicon.ico'), ico);
console.log(`  favicon.ico           (${ico.length} bytes)`);
