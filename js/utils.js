const Utils = /* @__PURE__ */ (() => {
  function formatBytes(bytes) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  }
  function safeName(name) {
    const lastDot = name.lastIndexOf(".");
    if (lastDot <= 0) return name.replace(/[^a-zA-Z0-9_\-]/g, "_");
    const base = name.slice(0, lastDot);
    const ext = name.slice(lastDot);
    return base.replace(/[^a-zA-Z0-9_\-]/g, "_") + ext.toLowerCase();
  }
  function hasSpecialChars(name) {
    const lastDot = name.lastIndexOf(".");
    const base = lastDot <= 0 ? name : name.slice(0, lastDot);
    return /[^a-zA-Z0-9_\-]/.test(base);
  }
  function readAsDataURL(file) {
    return new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = (e) => res(e.target.result);
      r.onerror = rej;
      r.readAsDataURL(file);
    });
  }
  function readAsArrayBuffer(file) {
    return new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = (e) => res(e.target.result);
      r.onerror = rej;
      r.readAsArrayBuffer(file);
    });
  }
  function loadImage(src) {
    return new Promise((res, rej) => {
      const img = new Image();
      img.onload = () => res(img);
      img.onerror = rej;
      img.src = src;
    });
  }
  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 1e3);
  }
  function drawResized(img, maxW, maxH) {
    let w = img.naturalWidth;
    let h = img.naturalHeight;
    if (maxW && w > maxW) {
      h = Math.round(h * maxW / w);
      w = maxW;
    }
    if (maxH && h > maxH) {
      w = Math.round(w * maxH / h);
      h = maxH;
    }
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    c.getContext("2d").drawImage(img, 0, 0, w, h);
    return c;
  }
  function canvasToBlob(canvas, mimeType = "image/jpeg", quality = 0.85) {
    return new Promise((res) => canvas.toBlob((b) => res(b), mimeType, quality));
  }
  function mimeFromExt(ext) {
    const map = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      jfif: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      webp: "image/webp",
      avif: "image/avif",
      tiff: "image/tiff",
      tif: "image/tiff",
      bmp: "image/bmp",
      heic: "image/heic",
      heif: "image/heif",
      pdf: "application/pdf"
    };
    return map[ext.toLowerCase()] || "application/octet-stream";
  }
  function extFromMime(mime) {
    const map = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/gif": "gif",
      "image/webp": "webp",
      "image/avif": "avif",
      "image/tiff": "tiff",
      "image/bmp": "bmp",
      "image/heic": "heic",
      "image/heif": "heif",
      "application/pdf": "pdf"
    };
    return map[mime] || "bin";
  }
  function supportsFormat(mime) {
    return new Promise((resolve) => {
      const c = document.createElement("canvas");
      c.width = c.height = 2;
      c.getContext("2d").fillRect(0, 0, 2, 2);
      c.toBlob((b) => resolve(b !== null && b.type === mime), mime, 0.9);
    });
  }
  function replaceExt(filename, newExt) {
    const dot = filename.lastIndexOf(".");
    const base = dot > 0 ? filename.slice(0, dot) : filename;
    return base + "." + newExt;
  }
  function getExt(filename) {
    const dot = filename.lastIndexOf(".");
    return dot > 0 ? filename.slice(dot + 1).toLowerCase() : "";
  }
  function escHtml(str) {
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function spinnerHTML() {
    return '<span class="spinner"></span>';
  }
  function sizeBars(originalBytes, newBytes) {
    const pct = Math.min(100, Math.round(newBytes / originalBytes * 100));
    const cls = pct < 70 ? "fill-ok" : pct < 95 ? "fill-warn" : "fill-bad";
    return `<div class="size-bar-wrap">
      <div class="size-bar-label">${formatBytes(originalBytes)} \u2192 <strong>${formatBytes(newBytes)}</strong> (${pct}%)</div>
      <div class="size-bar"><div class="size-bar-fill ${cls}" style="width:${pct}%"></div></div>
    </div>`;
  }
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  const _blobUrls = [];
  function createObjectURL(blob) {
    const url = URL.createObjectURL(blob);
    _blobUrls.push(url);
    return url;
  }
  function revokeObjectURL(url) {
    const idx = _blobUrls.indexOf(url);
    if (idx !== -1) _blobUrls.splice(idx, 1);
    URL.revokeObjectURL(url);
  }
  function revokeAllObjectURLs() {
    _blobUrls.forEach((u) => URL.revokeObjectURL(u));
    _blobUrls.length = 0;
  }
  function validateFile(file, allowedExtensions = [], maxMB = 20) {
    if (!file) return { valid: false, error: "No file selected." };
    const maxSize = maxMB * 1024 * 1024;
    if (file.size > maxSize) {
      return { valid: false, error: `File is too large (max ${maxMB}MB).` };
    }
    const ext = getExt(file.name);
    if (allowedExtensions.length > 0) {
      if (!allowedExtensions.includes(ext)) {
        return { valid: false, error: `Invalid file type. Allowed: ${allowedExtensions.join(", ")}` };
      }
    }
    const expectedMime = mimeFromExt(ext);
    if (file.type && expectedMime !== "application/octet-stream") {
      const isMatch = file.type === expectedMime || expectedMime === "image/jpeg" && ["image/pjpeg", "image/jpg"].includes(file.type) || expectedMime === "image/png" && file.type === "image/x-png";
      if (!isMatch) {
        const expectedCat = expectedMime.split("/")[0];
        const actualCat = file.type.split("/")[0];
        if (expectedCat !== actualCat) {
          return { valid: false, error: `Security Warning: File content (${file.type}) does not match extension (.${ext}).` };
        }
      }
    }
    return { valid: true };
  }
  function b64EncodeUtf8(text) {
    const bytes = new TextEncoder().encode(text);
    let bin = "";
    for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin);
  }
  function b64DecodeUtf8(b64) {
    let s = b64.replace(/-/g, "+").replace(/_/g, "/").replace(/\s+/g, "");
    while (s.length % 4) s += "=";
    const bin = atob(s);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder("utf-8", { fatal: false }).decode(bytes);
  }
  function lenientJsonParse(text) {
    function tryParse(t) {
      try {
        return { ok: true, value: JSON.parse(t) };
      } catch (e) {
        return { ok: false, error: e.message };
      }
    }
    const first = tryParse(text);
    if (first.ok) return { ok: true, value: first.value, sanitized: false };
    const sanitized = text.replace(
      /(['"`])(?:\\.|(?!\1)[^\\])*\1|\/\/.*$|\/\*[\s\S]*?\*\//gm,
      (m) => m.startsWith('"') || m.startsWith("'") || m.startsWith("`") ? m : ""
    ).replace(/,\s*([}\]])/g, "$1");
    if (sanitized !== text) {
      const second = tryParse(sanitized);
      if (second.ok) return { ok: true, value: second.value, sanitized: true };
    }
    const msg = first.error;
    const posMatch = msg.match(/position\s+(\d+)/i);
    const lineMatch = msg.match(/line\s+(\d+)/i);
    const colMatch = msg.match(/column\s+(\d+)/i);
    let line;
    let col;
    let pos;
    if (posMatch) {
      pos = parseInt(posMatch[1], 10);
      const upTo = text.slice(0, pos);
      line = upTo.split("\n").length;
      col = pos - upTo.lastIndexOf("\n");
    } else if (lineMatch) {
      line = parseInt(lineMatch[1], 10);
      if (colMatch) col = parseInt(colMatch[1], 10);
    }
    return { ok: false, error: msg, line, col, pos };
  }
  return {
    formatBytes,
    safeName,
    hasSpecialChars,
    readAsDataURL,
    readAsArrayBuffer,
    loadImage,
    downloadBlob,
    drawResized,
    canvasToBlob,
    mimeFromExt,
    extFromMime,
    supportsFormat,
    replaceExt,
    getExt,
    escHtml,
    spinnerHTML,
    sizeBars,
    debounce,
    validateFile,
    createObjectURL,
    revokeObjectURL,
    revokeAllObjectURLs,
    b64EncodeUtf8,
    b64DecodeUtf8,
    lenientJsonParse
  };
})();
