let qrInitialized = false;
let qrDebounceTimer = null;
let lastQrRequestId = 0;
function qrInit() {
  if (qrInitialized) return;
  qrInitialized = true;
  document.querySelectorAll(".qr-preset-chip").forEach((btn) => {
    btn.addEventListener("click", () => {
      const b = btn;
      const prefix = b.dataset.qrPrefix || b.textContent?.trim() || "";
      const textarea = document.getElementById("qr-input");
      if (textarea) {
        textarea.value = prefix;
        textarea.focus();
        qrOnInput();
      }
    });
  });
  const qrInput = document.getElementById("qr-input");
  const qrSizeEl = document.getElementById("qr-size");
  const qrEclEl = document.getElementById("qr-ecl");
  const qrFgEl = document.getElementById("qr-fg-color");
  const qrBgEl = document.getElementById("qr-bg-color");
  qrInput?.addEventListener("input", qrOnInput);
  qrSizeEl?.addEventListener("change", qrGenerate);
  qrEclEl?.addEventListener("change", qrGenerate);
  qrFgEl?.addEventListener("input", qrGenerate);
  qrBgEl?.addEventListener("input", qrGenerate);
  document.getElementById("qr-gen-btn")?.addEventListener("click", qrGenerate);
  if (qrInput?.value.trim()) qrGenerate();
}
function qrOnInput() {
  if (qrDebounceTimer !== null) clearTimeout(qrDebounceTimer);
  const downloadBtn = document.getElementById("qr-download-btn");
  const copyBtn = document.getElementById("qr-copy-btn");
  const svgBtn = document.getElementById("qr-svg-btn");
  if (downloadBtn) downloadBtn.disabled = true;
  if (copyBtn) copyBtn.disabled = true;
  if (svgBtn) svgBtn.disabled = true;
  qrDebounceTimer = setTimeout(qrGenerate, 150);
}
function qrGenerate() {
  if (typeof window.QRCode === "undefined") return;
  const inputEl = document.getElementById("qr-input");
  const canvas = document.getElementById("qr-canvas");
  if (!inputEl || !canvas) return;
  const requestId = ++lastQrRequestId;
  const input = inputEl.value.trim();
  const size = parseInt(document.getElementById("qr-size")?.value ?? "256", 10) || 256;
  const ecl = document.getElementById("qr-ecl")?.value ?? "M";
  const fgColor = document.getElementById("qr-fg-color")?.value ?? "#000000";
  const bgColor = document.getElementById("qr-bg-color")?.value ?? "#ffffff";
  const emptyHint = document.getElementById("qr-empty-hint");
  const caption = document.getElementById("qr-caption");
  const downloadBtn = document.getElementById("qr-download-btn");
  const copyBtn = document.getElementById("qr-copy-btn");
  const svgBtn = document.getElementById("qr-svg-btn");
  if (!input) {
    canvas.style.display = "none";
    if (emptyHint) emptyHint.style.display = "flex";
    if (caption) caption.textContent = "";
    if (downloadBtn) downloadBtn.disabled = true;
    if (copyBtn) copyBtn.disabled = true;
    if (svgBtn) svgBtn.disabled = true;
    return;
  }
  canvas.width = size;
  canvas.height = size;
  canvas.style.maxWidth = "100%";
  canvas.style.height = "auto";
  const genBtn = document.getElementById("qr-gen-btn");
  if (genBtn) genBtn.disabled = true;
  try {
    window.QRCode.toCanvas(canvas, input, {
      width: size,
      margin: 1,
      errorCorrectionLevel: ecl,
      color: { dark: fgColor, light: bgColor }
    }, (err) => {
      if (requestId === lastQrRequestId && genBtn) genBtn.disabled = false;
      if (requestId !== lastQrRequestId) return;
      if (err) {
        window.Shell.toast("QR generation failed: " + err.message, "error");
        return;
      }
      canvas.style.display = "block";
      if (emptyHint) emptyHint.style.display = "none";
      if (caption) caption.textContent = `${size}\xD7${size} \xB7 ${input.length} chars \xB7 Level ${ecl}`;
      if (downloadBtn) downloadBtn.disabled = false;
      if (copyBtn) copyBtn.disabled = false;
      if (svgBtn) svgBtn.disabled = false;
    });
  } catch (e) {
    if (genBtn) genBtn.disabled = false;
    window.Shell.toast("Error: " + e.message, "error");
  }
}
function qrDownload(format) {
  const inputEl = document.getElementById("qr-input");
  const input = inputEl?.value.trim() ?? "";
  if (!input) {
    window.Shell.toast("Enter content to generate QR first.", "warn");
    return;
  }
  if (format === "png") {
    const canvas = document.getElementById("qr-canvas");
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `qrcode-${Date.now()}.png`;
    a.click();
    window.Shell.toast("PNG downloaded!", "success");
    return;
  }
  if (format === "svg") {
    if (typeof window.QRCode === "undefined") return;
    const size = parseInt(document.getElementById("qr-size")?.value ?? "256", 10) || 256;
    const ecl = document.getElementById("qr-ecl")?.value ?? "M";
    const fgColor = document.getElementById("qr-fg-color")?.value ?? "#000000";
    const bgColor = document.getElementById("qr-bg-color")?.value ?? "#ffffff";
    window.QRCode.toString(input, {
      width: size,
      margin: 1,
      errorCorrectionLevel: ecl,
      type: "image/svg+xml",
      color: { dark: fgColor, light: bgColor }
    }, (err, svg) => {
      if (err) {
        window.Shell.toast("SVG export failed: " + err.message, "error");
        return;
      }
      const blob = new Blob([svg], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `qrcode-${Date.now()}.svg`;
      a.click();
      URL.revokeObjectURL(url);
      window.Shell.toast("SVG downloaded!", "success");
    });
  }
}
function qrCopyImage() {
  const canvas = document.getElementById("qr-canvas");
  if (!canvas || canvas.style.display === "none") {
    window.Shell.toast("Generate a QR code first.", "warn");
    return;
  }
  canvas.toBlob((blob) => {
    if (!blob) return;
    try {
      const item = new ClipboardItem({ "image/png": blob });
      navigator.clipboard.write([item]).then(() => {
        window.Shell.toast("QR code copied to clipboard!", "success");
        const btn = document.getElementById("qr-copy-btn");
        if (btn) {
          const oldText = btn.textContent ?? "Copy";
          btn.textContent = "\u2713 Copied!";
          setTimeout(() => {
            btn.textContent = oldText;
          }, 2e3);
        }
      }).catch((err) => {
        window.Shell.toast("Copy failed: " + err.message, "error");
      });
    } catch (e) {
      window.Shell.toast("Clipboard API not supported: " + e.message, "error");
    }
  });
}
window.qrInit = qrInit;
window.qrGenerate = qrGenerate;
window.qrDownload = qrDownload;
window.qrCopyImage = qrCopyImage;
