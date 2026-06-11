#!/usr/bin/env node
/**
 * Generate Maskable Icons, Shortcut Icons, and iOS Splash Screens.
 * Uses only built-in Node.js modules.
 */
'use strict';
const zlib = require('zlib');
const fs   = require('fs');
const path = require('path');

// CRC32 table & function
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

// PNG Encoder
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

// Segment distance
function distSeg(px, py, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay;
  const len2 = dx * dx + dy * dy;
  if (len2 === 0) return Math.hypot(px - ax, py - ay);
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / len2));
  return Math.hypot(px - ax - t * dx, py - ay - t * dy);
}

// Logo distance SDF
function logoDist(nx, ny) {
  const d1 = distSeg(nx, ny, -0.6, -0.75, -0.6, 0.75) - 0.14;
  const d2 = distSeg(nx, ny, 0.1, -0.75, -0.6, 0) - 0.14;
  const d3 = distSeg(nx, ny, -0.6, 0, 0.1, 0.75) - 0.14;
  const d4 = distSeg(nx, ny, 0.3, -0.75, 0.65, 0.75) - 0.14;
  const d5 = distSeg(nx, ny, 0.65, 0.75, 1.0, -0.75) - 0.14;
  return Math.min(d1, d2, d3, d4, d5);
}

const projectRoot = path.resolve(__dirname, '..');

// ── 1. Create Maskable Icons ──────────────────────────────────────────────
const iconsDir = path.join(projectRoot, 'public', 'icons');
if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir, { recursive: true });

function renderMaskableIcon(w, h, x, y) {
  // Brand color background #4F46E5 (79, 70, 229)
  const bgR = 79, bgG = 70, bgB = 229;
  
  // Center logo: logo occupies max 60% of canvas width.
  // Logo bounding box in nx is [-0.6, 1.0], center is at 0.2.
  const sc = w * 0.35; // scale
  const cx = w / 2 - 0.2 * sc;
  const cy = h / 2;

  const nx = (x - cx) / sc;
  const ny = (y - cy) / sc;

  const d = logoDist(nx, ny) * sc;
  const alpha = Math.min(1, Math.max(0, 0.5 - d)); // AA edge

  const r = Math.round(bgR + (255 - bgR) * alpha);
  const g = Math.round(bgG + (255 - bgG) * alpha);
  const b = Math.round(bgB + (255 - bgB) * alpha);

  return [r, g, b, 255];
}

const maskable192 = makePng(192, 192, (x, y) => renderMaskableIcon(192, 192, x, y));
fs.writeFileSync(path.join(iconsDir, 'icon-maskable-192x192.png'), maskable192);
console.log(`Created public/icons/icon-maskable-192x192.png (${maskable192.length} bytes)`);

const maskable512 = makePng(512, 512, (x, y) => renderMaskableIcon(512, 512, x, y));
fs.writeFileSync(path.join(iconsDir, 'icon-maskable-512x512.png'), maskable512);
console.log(`Created public/icons/icon-maskable-512x512.png (${maskable512.length} bytes)`);


// ── 2. Create Tool-Specific Shortcut Icons (96x96) ─────────────────────────
function renderShortcutImageCompressor(x, y) {
  const bgR = 79, bgG = 70, bgB = 229; // brand bg
  
  // Outer frame box
  const outer = Math.abs(x - 48) <= 22 && Math.abs(y - 48) <= 18;
  const inner = Math.abs(x - 48) <= 19 && Math.abs(y - 48) <= 15;
  const inFrame = outer && !inner;

  // Sun inside the inner area
  const inSun = Math.abs(x - 48) <= 19 && Math.abs(y - 48) <= 15 && (Math.hypot(x - 60, y - 38) <= 4.5);

  // Mountain 1 (left)
  const inM1 = Math.abs(x - 48) <= 19 && Math.abs(y - 48) <= 15 && (y >= 47 && y <= 63 && Math.abs(x - 40) <= (y - 47));

  // Mountain 2 (right)
  const inM2 = Math.abs(x - 48) <= 19 && Math.abs(y - 48) <= 15 && (y >= 39 && y <= 63 && Math.abs(x - 54) <= (y - 39) * 0.7);

  if (inFrame || inSun || inM1 || inM2) {
    return [255, 255, 255, 255];
  }
  return [bgR, bgG, bgB, 255];
}

function renderShortcutPdfMerger(x, y) {
  const bgR = 79, bgG = 70, bgB = 229; // brand bg

  // Front sheet
  const inFront = (x >= 28 && x <= 58 && y >= 34 && y <= 68);
  const inFrontBorder = inFront && (x <= 30 || x >= 56 || y <= 36 || y >= 66);

  // Back sheet
  const inBack = (x >= 38 && x <= 68 && y >= 24 && y <= 58);
  const inBackBorder = inBack && !inFront && (x <= 40 || x >= 66 || y <= 26 || y >= 56);

  // Plus sign in the middle of front sheet
  const inPlusH = inFront && (Math.abs(x - 43) <= 6 && Math.abs(y - 51) <= 1.5);
  const inPlusV = inFront && (Math.abs(x - 43) <= 1.5 && Math.abs(y - 51) <= 6);

  if (inFrontBorder || inBackBorder || inPlusH || inPlusV) {
    return [255, 255, 255, 255];
  }
  return [bgR, bgG, bgB, 255];
}

function renderShortcutMarkdown(x, y) {
  const bgR = 79, bgG = 70, bgB = 229; // brand bg

  // Border frame representing the markdown logo box
  const outerBox = Math.abs(x - 48) <= 26 && Math.abs(y - 48) <= 18;
  const innerBox = Math.abs(x - 48) <= 23 && Math.abs(y - 48) <= 15;
  const inBorder = outerBox && !innerBox;

  // "M" rendering
  const inMLeft = (x >= 28 && x <= 31 && y >= 36 && y <= 60);
  const inMRight = (x >= 45 && x <= 48 && y >= 36 && y <= 60);
  const inMDiagL = (y >= 36 && y <= 48 && Math.abs(x - (29.5 + (y - 36) * 8.5 / 12)) <= 1.5);
  const inMDiagR = (y >= 36 && y <= 48 && Math.abs(x - (46.5 - (y - 36) * 8.5 / 12)) <= 1.5);

  // "↓" (Arrow) rendering
  const inArrowStem = (x >= 59 && x <= 61 && y >= 36 && y <= 56);
  const inArrowHeadL = distSeg(x, y, 60, 56, 55, 51) <= 1.2;
  const inArrowHeadR = distSeg(x, y, 60, 56, 65, 51) <= 1.2;

  if (inBorder || inMLeft || inMRight || inMDiagL || inMDiagR || inArrowStem || inArrowHeadL || inArrowHeadR) {
    return [255, 255, 255, 255];
  }
  return [bgR, bgG, bgB, 255];
}

const shCompressor = makePng(96, 96, renderShortcutImageCompressor);
fs.writeFileSync(path.join(iconsDir, 'shortcut-image-compressor.png'), shCompressor);
console.log(`Created public/icons/shortcut-image-compressor.png (${shCompressor.length} bytes)`);

const shPdf = makePng(96, 96, renderShortcutPdfMerger);
fs.writeFileSync(path.join(iconsDir, 'shortcut-pdf-merger.png'), shPdf);
console.log(`Created public/icons/shortcut-pdf-merger.png (${shPdf.length} bytes)`);

const shMarkdown = makePng(96, 96, renderShortcutMarkdown);
fs.writeFileSync(path.join(iconsDir, 'shortcut-markdown.png'), shMarkdown);
console.log(`Created public/icons/shortcut-markdown.png (${shMarkdown.length} bytes)`);


// ── 3. Create iOS Startup Splash Screens ───────────────────────────────────
const splashesDir = path.join(projectRoot, 'public', 'splashes');
if (!fs.existsSync(splashesDir)) fs.mkdirSync(splashesDir, { recursive: true });

const splashSizes = [
  { w: 640, h: 1136, name: 'splash-640x1136.png' },   // iPhone SE
  { w: 750, h: 1334, name: 'splash-750x1334.png' },   // iPhone 8
  { w: 1242, h: 2208, name: 'splash-1242x2208.png' }, // iPhone 8 Plus
  { w: 1125, h: 2436, name: 'splash-1125x2436.png' }, // iPhone X/XS
  { w: 1242, h: 2688, name: 'splash-1242x2688.png' }, // iPhone XS Max
  { w: 828, h: 1792, name: 'splash-828x1792.png' },   // iPhone XR
  { w: 1170, h: 2532, name: 'splash-1170x2532.png' }, // iPhone 12/13/14
  { w: 1284, h: 2778, name: 'splash-1284x2778.png' }, // iPhone 12/13/14 Pro Max
  { w: 1179, h: 2556, name: 'splash-1179x2556.png' }, // iPhone 14 Pro
  { w: 1290, h: 2796, name: 'splash-1290x2796.png' }, // iPhone 14 Pro Max
  { w: 1488, h: 2266, name: 'splash-1488x2266.png' }, // iPad Mini
  { w: 1640, h: 2360, name: 'splash-1640x2360.png' }, // iPad Air
  { w: 2048, h: 2732, name: 'splash-2048x2732.png' }, // iPad Pro 12.9"
];

function renderSplashScreen(w, h, x, y) {
  // Background: #0A0F1E (10, 15, 30)
  const bgR = 10, bgG = 15, bgB = 30;

  // Logo: centered horizontally, 60% from top vertically, max 20% of canvas width.
  const sc = w * 0.125;
  const cx = w / 2 - 0.2 * sc;
  const cy = h * 0.6;

  const nx = (x - cx) / sc;
  const ny = (y - cy) / sc;

  const d = logoDist(nx, ny) * sc;
  const alpha = Math.min(1, Math.max(0, 0.5 - d)); // AA edge

  const r = Math.round(bgR + (255 - bgR) * alpha);
  const g = Math.round(bgG + (255 - bgG) * alpha);
  const b = Math.round(bgB + (255 - bgB) * alpha);

  return [r, g, b, 255];
}

for (const splash of splashSizes) {
  const buf = makePng(splash.w, splash.h, (x, y) => renderSplashScreen(splash.w, splash.h, x, y));
  fs.writeFileSync(path.join(splashesDir, splash.name), buf);
  console.log(`Created public/splashes/${splash.name} (${buf.length} bytes)`);
}

console.log('PWA Asset generation completed successfully!');
