/* ===== qrcode-tool.ts – QR Code Generator ===== */

let qrInitialized = false;
let qrDebounceTimer: ReturnType<typeof setTimeout> | null = null;
let lastQrRequestId = 0;

function qrInit(): void {
  if (qrInitialized) return;
  qrInitialized = true;

  document.querySelectorAll('.qr-preset-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      const b = btn as HTMLElement;
      const prefix   = b.dataset.qrPrefix || b.textContent?.trim() || '';
      const textarea = document.getElementById('qr-input') as HTMLTextAreaElement | null;
      if (textarea) {
        textarea.value = prefix;
        textarea.focus();
        qrOnInput();
      }
    });
  });

  const qrInput  = document.getElementById('qr-input')    as HTMLTextAreaElement | null;
  const qrSizeEl = document.getElementById('qr-size')     as HTMLSelectElement   | null;
  const qrEclEl  = document.getElementById('qr-ecl')      as HTMLSelectElement   | null;
  const qrFgEl   = document.getElementById('qr-fg-color') as HTMLInputElement    | null;
  const qrBgEl   = document.getElementById('qr-bg-color') as HTMLInputElement    | null;

  qrInput?.addEventListener('input', qrOnInput);
  qrSizeEl?.addEventListener('change', qrGenerate);
  qrEclEl?.addEventListener('change', qrGenerate);
  qrFgEl?.addEventListener('input', qrGenerate);
  qrBgEl?.addEventListener('input', qrGenerate);

  document.getElementById('qr-gen-btn')?.addEventListener('click', qrGenerate);

  if (qrInput?.value.trim()) qrGenerate();
}

function qrOnInput(): void {
  if (qrDebounceTimer !== null) clearTimeout(qrDebounceTimer);

  // QR-001: Immediately disable action buttons during typing/debounce
  const downloadBtn = document.getElementById('qr-download-btn') as HTMLButtonElement | null;
  const copyBtn     = document.getElementById('qr-copy-btn')     as HTMLButtonElement | null;
  const svgBtn      = document.getElementById('qr-svg-btn')      as HTMLButtonElement | null;
  if (downloadBtn) downloadBtn.disabled = true;
  if (copyBtn)     copyBtn.disabled     = true;
  if (svgBtn)      svgBtn.disabled      = true;

  qrDebounceTimer = setTimeout(qrGenerate, 150);
}

function qrGenerate(): void {
  if (typeof window.QRCode === 'undefined') return;
  const inputEl = document.getElementById('qr-input') as HTMLTextAreaElement | null;
  const canvas  = document.getElementById('qr-canvas') as HTMLCanvasElement | null;
  if (!inputEl || !canvas) return;

  const requestId = ++lastQrRequestId;
  const input     = inputEl.value.trim();
  const size      = parseInt((document.getElementById('qr-size') as HTMLSelectElement | null)?.value ?? '256', 10) || 256;
  const ecl       = (document.getElementById('qr-ecl')      as HTMLSelectElement | null)?.value ?? 'M';
  const fgColor   = (document.getElementById('qr-fg-color') as HTMLInputElement   | null)?.value ?? '#000000';
  const bgColor   = (document.getElementById('qr-bg-color') as HTMLInputElement   | null)?.value ?? '#ffffff';

  const emptyHint  = document.getElementById('qr-empty-hint');
  const caption    = document.getElementById('qr-caption');
  const downloadBtn = document.getElementById('qr-download-btn') as HTMLButtonElement | null;
  const copyBtn    = document.getElementById('qr-copy-btn')     as HTMLButtonElement | null;
  const svgBtn     = document.getElementById('qr-svg-btn')      as HTMLButtonElement | null;

  if (!input) {
    canvas.style.display = 'none';
    if (emptyHint)  emptyHint.style.display = 'flex';
    if (caption)    caption.textContent = '';
    if (downloadBtn) downloadBtn.disabled = true;
    if (copyBtn)    copyBtn.disabled = true;
    if (svgBtn)     svgBtn.disabled  = true;
    return;
  }

  canvas.width  = size;
  canvas.height = size;
  canvas.style.maxWidth = '100%';
  canvas.style.height   = 'auto';

  try {
    window.QRCode.toCanvas(canvas, input, {
      width: size,
      margin: 1,
      errorCorrectionLevel: ecl,
      color: { dark: fgColor, light: bgColor },
    }, (err: Error | null) => {
      if (requestId !== lastQrRequestId) return;
      if (err) {
        window.Shell.toast('QR generation failed: ' + err.message, 'error');
        return;
      }
      canvas.style.display = 'block';
      if (emptyHint)  emptyHint.style.display = 'none';
      if (caption)    caption.textContent = `${size}×${size} · ${input.length} chars · Level ${ecl}`;
      if (downloadBtn) downloadBtn.disabled = false;
      if (copyBtn)    copyBtn.disabled = false;
      if (svgBtn)     svgBtn.disabled  = false;
    });
  } catch (e) {
    window.Shell.toast('Error: ' + (e as Error).message, 'error');
  }
}

function qrDownload(format: 'png' | 'svg'): void {
  const inputEl = document.getElementById('qr-input') as HTMLTextAreaElement | null;
  const input   = inputEl?.value.trim() ?? '';
  if (!input) {
    window.Shell.toast('Enter content to generate QR first.', 'warn');
    return;
  }

  if (format === 'png') {
    const canvas = document.getElementById('qr-canvas') as HTMLCanvasElement | null;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a   = document.createElement('a');
    a.href     = url;
    a.download = `qrcode-${Date.now()}.png`;
    a.click();
    window.Shell.toast('PNG downloaded!', 'success');
    return;
  }

  if (format === 'svg') {
    if (typeof window.QRCode === 'undefined') return;
    const size    = parseInt((document.getElementById('qr-size') as HTMLSelectElement | null)?.value ?? '256', 10) || 256;
    const ecl     = (document.getElementById('qr-ecl')      as HTMLSelectElement | null)?.value ?? 'M';
    const fgColor = (document.getElementById('qr-fg-color') as HTMLInputElement   | null)?.value ?? '#000000';
    const bgColor = (document.getElementById('qr-bg-color') as HTMLInputElement   | null)?.value ?? '#ffffff';

    window.QRCode.toString(input, {
      width: size,
      margin: 1,
      errorCorrectionLevel: ecl,
      type: 'image/svg+xml',
      color: { dark: fgColor, light: bgColor },
    }, (err: Error | null, svg: string) => {
      if (err) {
        window.Shell.toast('SVG export failed: ' + err.message, 'error');
        return;
      }
      const blob = new Blob([svg], { type: 'image/svg+xml' });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `qrcode-${Date.now()}.svg`;
      a.click();
      URL.revokeObjectURL(url);
      window.Shell.toast('SVG downloaded!', 'success');
    });
  }
}

function qrCopyImage(): void {
  const canvas = document.getElementById('qr-canvas') as HTMLCanvasElement | null;
  if (!canvas || canvas.style.display === 'none') {
    window.Shell.toast('Generate a QR code first.', 'warn');
    return;
  }

  canvas.toBlob((blob: Blob | null) => {
    if (!blob) return;
    try {
      const item = new ClipboardItem({ 'image/png': blob });
      navigator.clipboard.write([item]).then(() => {
        window.Shell.toast('QR code copied to clipboard!', 'success');
        const btn = document.getElementById('qr-copy-btn') as HTMLButtonElement | null;
        if (btn) {
          const oldText = btn.textContent ?? 'Copy';
          btn.textContent = '✓ Copied!';
          setTimeout(() => { btn.textContent = oldText; }, 2000);
        }
      }).catch((err: Error) => {
        window.Shell.toast('Copy failed: ' + err.message, 'error');
      });
    } catch (e) {
      window.Shell.toast('Clipboard API not supported: ' + (e as Error).message, 'error');
    }
  });
}

// Expose on window for HTML onclick attributes
window.qrInit     = qrInit;
window.qrGenerate = qrGenerate;
window.qrDownload = qrDownload;
window.qrCopyImage = qrCopyImage;
