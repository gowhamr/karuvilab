const ImageTools = /* @__PURE__ */ (() => {
  function isImage(file) {
    return FormatUtils.isImage(file);
  }
  async function resolveMime(fmtKey) {
    const map = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      jfif: "image/jpeg",
      png: "image/png",
      gif: "image/png",
      // canvas cannot encode real GIF; PNG is visually correct
      webp: "image/webp",
      avif: "image/avif"
    };
    const mime = map[fmtKey] || "image/jpeg";
    if (mime === "image/avif" || mime === "image/webp") {
      const ok = await Utils.supportsFormat(mime);
      if (!ok) return { mime: "image/jpeg", fallback: true, fmtKey: "jpg" };
    }
    return { mime, fallback: false, fmtKey };
  }
  async function compress(file, opts = {}) {
    const targetKB = opts.targetKB ?? 100;
    const maxWidth = opts.maxWidth ?? 1e3;
    const signal = opts.signal ?? null;
    const srcExt = Utils.getExt(file.name);
    if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
    const src = await FormatUtils.loadAny(file);
    let canvas = FormatUtils.drawElement(src, maxWidth, null);
    const lossless = srcExt === "png";
    let mime, fmtKey;
    if (lossless) {
      mime = "image/png";
      fmtKey = "png";
    } else {
      const resolved = await resolveMime(["webp", "avif"].includes(srcExt) ? srcExt : "jpg");
      mime = resolved.mime;
      fmtKey = resolved.fmtKey;
    }
    let quality = 0.85;
    let blob = await Utils.canvasToBlob(canvas, mime, quality);
    let iterations = 0;
    if (!lossless) {
      while (blob.size > targetKB * 1024 && quality > 0.1 && iterations < 12) {
        if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
        quality = Math.max(0.1, quality - 0.08);
        blob = await Utils.canvasToBlob(canvas, mime, quality);
        iterations++;
      }
    }
    if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
    if (blob.size > targetKB * 1024) {
      const scale = Math.sqrt(targetKB * 1024 / blob.size);
      canvas = FormatUtils.drawElement(src, Math.max(50, Math.round(canvas.width * scale)), null);
      blob = await Utils.canvasToBlob(canvas, mime, quality);
    }
    return {
      blob,
      width: canvas.width,
      height: canvas.height,
      quality,
      iterations: lossless ? 0 : Math.max(1, iterations),
      mime,
      fmtKey
    };
  }
  async function convert(file, targetFmt, quality = 0.85) {
    const src = await FormatUtils.loadAny(file);
    const canvas = FormatUtils.drawElement(src, null, null);
    if (targetFmt === "bmp") {
      return { blob: FormatUtils.encodeBmp(canvas), mime: "image/bmp", fmtKey: "bmp", fallback: false };
    }
    if (targetFmt === "tiff" || targetFmt === "tif") {
      return { blob: FormatUtils.encodeTiff(canvas), mime: "image/tiff", fmtKey: "tiff", fallback: false };
    }
    if (targetFmt === "heic" || targetFmt === "heif") {
      throw new Error("HEIC/HEIF export is not supported in browsers. Convert to another format.");
    }
    const { mime, fallback, fmtKey } = await resolveMime(targetFmt);
    const blob = await Utils.canvasToBlob(canvas, mime, quality);
    return { blob, mime, fallback, fmtKey };
  }
  async function create(opts) {
    const {
      width,
      height,
      bg = "#ffffff",
      format = "jpeg",
      srcFile = null,
      fit = "contain",
      quality = 0.9
    } = opts;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (bg === "transparent" || bg === "rgba(0,0,0,0)") {
      ctx.clearRect(0, 0, width, height);
    } else {
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);
    }
    if (srcFile) {
      const src = await FormatUtils.loadAny(srcFile);
      const sw0 = src.naturalWidth ?? src.width;
      const sh0 = src.naturalHeight ?? src.height;
      let dw, dh, dx, dy;
      if (fit === "stretch") {
        dw = width;
        dh = height;
        dx = 0;
        dy = 0;
      } else if (fit === "cover") {
        const ratio = Math.max(width / sw0, height / sh0);
        dw = sw0 * ratio;
        dh = sh0 * ratio;
        dx = (width - dw) / 2;
        dy = (height - dh) / 2;
      } else {
        const ratio = Math.min(width / sw0, height / sh0);
        dw = sw0 * ratio;
        dh = sh0 * ratio;
        dx = (width - dw) / 2;
        dy = (height - dh) / 2;
      }
      ctx.drawImage(src, Math.round(dx), Math.round(dy), Math.round(dw), Math.round(dh));
    }
    if (format === "bmp") {
      return { blob: FormatUtils.encodeBmp(canvas), canvas, fmtKey: "bmp", fallback: false };
    }
    if (format === "tiff") {
      return { blob: FormatUtils.encodeTiff(canvas), canvas, fmtKey: "tiff", fallback: false };
    }
    const { mime, fallback, fmtKey } = await resolveMime(format);
    const blob = await Utils.canvasToBlob(canvas, mime, quality);
    return { blob, canvas, mime, fallback, fmtKey };
  }
  async function autoFix(file, docType) {
    const rules = Validator.getRules()[docType] || Validator.getRules()["general"];
    const targetKB = rules.maxKB || 100;
    const targetW = rules.exactW || rules.maxWidthPx || 1e3;
    const targetH = rules.exactH || null;
    const src = await FormatUtils.loadAny(file);
    const sw0 = src.naturalWidth ?? src.width;
    const sh0 = src.naturalHeight ?? src.height;
    const canvas = document.createElement("canvas");
    canvas.width = targetW;
    canvas.height = targetH || Math.round(sh0 * targetW / sw0);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const ratio = Math.min(canvas.width / sw0, canvas.height / sh0);
    const sw = Math.round(sw0 * ratio), sh = Math.round(sh0 * ratio);
    ctx.drawImage(
      src,
      Math.round((canvas.width - sw) / 2),
      Math.round((canvas.height - sh) / 2),
      sw,
      sh
    );
    let quality = 0.85;
    let blob = await Utils.canvasToBlob(canvas, "image/jpeg", quality);
    while (blob.size > targetKB * 1024 && quality > 0.1) {
      quality -= 0.08;
      blob = await Utils.canvasToBlob(canvas, "image/jpeg", Math.max(0.1, quality));
    }
    return blob;
  }
  return { isImage, compress, convert, create, autoFix, resolveMime };
})();
