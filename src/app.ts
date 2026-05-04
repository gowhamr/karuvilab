/* ===== app.ts – KaruviLab main app controller ===== */

document.addEventListener('DOMContentLoaded', () => {

  // ══════════════════════════════════════════════════════
  //  AUTO-INIT FOR STANDALONE PAGES
  // ══════════════════════════════════════════════════════
  const shellActive = window.SHELL_ACTIVE;
  if (shellActive === 'markdown') maybeLoadMarkdown();
  if (shellActive === 'qrcode')   maybeLoadQRCode();

  // ══════════════════════════════════════════════════════
  //  PANEL NAVIGATION
  // ══════════════════════════════════════════════════════
  let activePanel = 'home';
  let panelTransitioning = false;
  const homePanel = document.getElementById('panel-home');

  // UI-002: Track cancellable operations to abort on panel switch
  let compressAbortCtrl: AbortController | null = null;
  let convertAbortCtrl:  AbortController | null = null;
  let regexWorker:       Worker          | null = null;
  let regexTimeout:      ReturnType<typeof setTimeout> | null = null;

  const TOOL_PANELS: string[] = [
    'compressor', 'converter', 'creator', 'pdf', 'validator',
    'base64', 'regex', 'formatter', 'markdown', 'qrcode',
    'history', 'texttools', 'hash', 'urlencode', 'moretools',
  ];

  function setDockActive(dockId: string): void {
    document.querySelectorAll('.dock-btn[data-dock]').forEach(b => {
      b.classList.toggle('active', (b as HTMLElement).dataset.dock === dockId);
    });
  }

  function maybeLoadMarkdown(): void {
    if (typeof window.mdInit === 'function') window.mdInit();
  }

  function maybeLoadQRCode(): void {
    if (typeof window.qrInit === 'function') window.qrInit();
  }

  function showPanel(panelId: string): void {
    if (panelId === activePanel || panelTransitioning) return;

    // UI-002: Abort previous panel operations
    compressAbortCtrl?.abort();
    convertAbortCtrl?.abort();
    if (regexWorker) { regexWorker.terminate(); regexWorker = null; }
    if (regexTimeout) clearTimeout(regexTimeout);

    panelTransitioning = true;

    const prev = document.querySelector('.panel.active');
    if (prev) prev.classList.remove('active');

    const TRANSITION_MS = 320;
    const animating = [
      homePanel,
      prev,
      document.getElementById('panel-' + panelId),
    ].filter((el): el is HTMLElement => el !== null && el !== undefined);
    animating.forEach(p => { p.style.willChange = 'transform'; });

    setTimeout(() => {
      animating.forEach(p => { p.style.willChange = ''; });
      panelTransitioning = false;
    }, TRANSITION_MS);

    if (panelId === 'home') {
      homePanel?.classList.remove('pushed');
      setDockActive('home');
    } else {
      homePanel?.classList.add('pushed');
      const next = document.getElementById('panel-' + panelId);
      if (next) next.classList.add('active');

      if (panelId === 'history') setDockActive('history');
      else setDockActive('tools');

      if (panelId === 'markdown') maybeLoadMarkdown();
      if (panelId === 'qrcode')   maybeLoadQRCode();
    }
    activePanel = panelId;

    document.querySelectorAll('.sb-link, .ts-nav-link').forEach(el => {
      el.classList.toggle('active', (el as HTMLElement).dataset.panel === panelId);
    });
  }

  // 4-tab dock
  document.querySelectorAll('.dock-btn[data-dock]').forEach(btn => {
    btn.addEventListener('click', () => {
      const dockId = (btn as HTMLElement).dataset.dock!;
      if (dockId === 'home') {
        showPanel('home');
        homePanel?.querySelector('.home-wrap')?.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (dockId === 'tools') {
        const needsTransition = activePanel !== 'home';
        showPanel('home');
        setTimeout(() => {
          document.getElementById('file-tools-label')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, needsTransition ? 320 : 60);
        setDockActive('tools');
      } else if (dockId === 'history') {
        showPanel('history');
      } else if (dockId === 'more') {
        openFaq();
      }
    });
  });

  document.querySelectorAll('[data-panel]:not([id])').forEach(btn => {
    btn.addEventListener('click', () => showPanel((btn as HTMLElement).dataset.panel!));
  });

  document.querySelectorAll('[data-back]').forEach(btn => {
    btn.addEventListener('click', () => {
      const activeCalcDetail = document.querySelector('#calc-embed-container .mch-detail.active');
      if (activeCalcDetail) {
        (document.querySelector('#calc-embed-container .mch-back-btn') as HTMLElement | null)?.click();
        return;
      }
      showPanel('home');
    });
  });

  // Doc type chips → sync hidden select
  document.querySelectorAll('.doc-type-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.doc-type-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const sel = document.getElementById('validator-doc-type') as HTMLSelectElement | null;
      if (sel) { sel.value = (chip as HTMLElement).dataset.docType!; sel.dispatchEvent(new Event('change')); }
    });
  });

  // Validate button
  const validateBtn = document.getElementById('validate-btn') as HTMLButtonElement | null;
  if (validateBtn) {
    const enableValidateBtn = (): void => { validateBtn.disabled = false; };
    document.getElementById('validator-input')?.addEventListener('change', enableValidateBtn);
    document.getElementById('validator-drop')?.addEventListener('drop', enableValidateBtn);
    validateBtn.addEventListener('click', () => { if (validatorFile) runValidator(validatorFile); });
  }

  // ══════════════════════════════════════════════════════
  //  FAQ / MORE OVERLAY
  // ══════════════════════════════════════════════════════
  const faqOverlay  = document.getElementById('faq-overlay');
  const moreBtn     = document.getElementById('more-open-btn');
  const faqCloseBtn = document.getElementById('faq-close-btn');

  function openFaq(): void {
    faqOverlay?.classList.remove('hidden');
    setDockActive('more');
  }
  function closeFaq(): void {
    faqOverlay?.classList.add('hidden');
    setDockActive(
      activePanel === 'history' ? 'history' :
      TOOL_PANELS.includes(activePanel) ? 'tools' : 'home'
    );
  }

  moreBtn?.addEventListener('click', openFaq);
  faqCloseBtn?.addEventListener('click', closeFaq);
  faqOverlay?.addEventListener('click', (e: Event) => { if (e.target === faqOverlay) closeFaq(); });
  document.addEventListener('keydown', (e: KeyboardEvent) => { if (e.key === 'Escape') closeFaq(); });

  // ══════════════════════════════════════════════════════
  //  DROP ZONE FACTORY
  // ══════════════════════════════════════════════════════
  function setupDropZone(
    zoneId: string,
    inputId: string,
    fileListId: string | null,
    onFilesAdded: (files: File[]) => void,
    allowedExts: string[] = []
  ): File[] {
    const zone  = document.getElementById(zoneId)  as HTMLElement | null;
    const input = document.getElementById(inputId) as HTMLInputElement | null;
    const files: File[] = [];
    if (!zone || !input) return files;

    zone.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('link') || target.tagName === 'LABEL') return;
      input.click();
    });
    ['dragenter', 'dragover'].forEach(ev =>
      zone.addEventListener(ev, (e: Event) => { e.preventDefault(); zone.classList.add('drag-over'); })
    );
    ['dragleave', 'drop'].forEach(ev =>
      zone.addEventListener(ev, (e: Event) => { e.preventDefault(); zone.classList.remove('drag-over'); })
    );
    zone.addEventListener('drop', (e: DragEvent) =>
      addFiles(Array.from(e.dataTransfer?.files ?? []))
    );
    input.addEventListener('change', () => { addFiles(Array.from(input.files ?? [])); input.value = ''; });

    function addFiles(newFiles: File[]): void {
      let addedCount = 0;
      newFiles.forEach(f => {
        const check = Utils.validateFile(f, allowedExts);
        if (check.valid) {
          files.push(f);
          addedCount++;
        } else {
          window.Shell.toast(`${f.name}: ${check.error}`, 'error');
        }
      });
      if (addedCount > 0) {
        if (fileListId) renderFileList(fileListId, files, () => onFilesAdded(files));
        onFilesAdded(files);
      }
    }
    return files;
  }

  function renderFileList(listId: string, files: File[], onChange?: () => void): void {
    const el = document.getElementById(listId);
    if (!el) return;
    el.innerHTML = '';
    files.forEach((f, i) => {
      const ext    = Utils.getExt(f.name);
      const isPdf  = ext === 'pdf';
      const color  = FormatUtils.colorFor(ext);
      const item   = document.createElement('div');
      item.className = 'file-item';
      item.innerHTML = `
        <span class="file-icon">${isPdf ? '&#128196;' : '&#128247;'}</span>
        <div class="file-info">
          <div class="file-name">${Utils.escHtml(f.name)}</div>
          <div class="file-meta">${Utils.formatBytes(f.size)}</div>
        </div>
        <span class="file-fmt-badge" style="background:${color}22;color:${color}">${ext.toUpperCase()}</span>
        <button class="remove-btn" title="Remove">&#10005;</button>`;
      (item.querySelector('.remove-btn') as HTMLButtonElement).addEventListener('click', () => {
        files.splice(i, 1);
        renderFileList(listId, files, onChange);
        if (onChange) onChange();
      });
      el.appendChild(item);
    });
  }

  // ══════════════════════════════════════════════════════
  //  QUALITY SLIDERS
  // ══════════════════════════════════════════════════════
  function bindSlider(sliderId: string, valId: string): void {
    const s = document.getElementById(sliderId) as HTMLInputElement | null;
    const v = document.getElementById(valId);
    if (!s || !v) return;
    const upd = (): void => {
      v.textContent = Math.round(Number(s.value) * 100) + '%';
      s.setAttribute('aria-valuenow', s.value);
    };
    s.addEventListener('input', upd);
    upd();
  }

  bindSlider('convert-quality', 'convert-quality-val');
  bindSlider('pdf-img-quality', 'pdf-img-quality-val');

  // ══════════════════════════════════════════════════════
  //  CLIPBOARD HELPERS
  // ══════════════════════════════════════════════════════
  async function copyBlobToClipboard(blob: Blob): Promise<boolean> {
    if (!navigator.clipboard || !window.ClipboardItem) return false;
    try {
      await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
      return true;
    } catch { return false; }
  }

  function attachClipboardBtns(
    container: Element,
    getBlob: ((i: number) => Blob | null) | Blob
  ): void {
    container.querySelectorAll('.copy-clip-btn').forEach((btn, i) => {
      btn.addEventListener('click', async () => {
        const blob = typeof getBlob === 'function' ? getBlob(i) : getBlob;
        if (!blob) return;
        const ok = await copyBlobToClipboard(blob);
        (btn as HTMLButtonElement).textContent = ok ? '✓ Copied!' : '✗ Failed';
        (btn as HTMLButtonElement).disabled = true;
        setTimeout(() => {
          (btn as HTMLButtonElement).textContent = '📋 Copy';
          (btn as HTMLButtonElement).disabled = false;
        }, 2000);
      });
    });
  }

  // ══════════════════════════════════════════════════════
  //  COMPRESSOR SLIDERS + PRESETS
  // ══════════════════════════════════════════════════════
  const COMPRESS_PRESETS: Record<string, CompressPreset> = {
    small:  { kb: 80,  px: 800,  mb: 0.5 },
    medium: { kb: 150, px: 1200, mb: 1.5 },
    high:   { kb: 300, px: 2000, mb: 3.0 },
  };

  function setSliderVal(id: string, valId: string, val: number, fmt: (v: number) => string): void {
    const s = document.getElementById(id) as HTMLInputElement | null;
    const v = document.getElementById(valId);
    if (s) { s.value = String(val); s.setAttribute('aria-valuenow', String(val)); }
    if (v) v.textContent = fmt(val);
  }

  const sliderDefs: Array<[string, string, (v: number) => string]> = [
    ['img-target-kb', 'img-target-kb-val', v => v + ' KB'],
    ['img-max-width', 'img-max-width-val', v => v + ' px'],
    ['pdf-target-mb', 'pdf-target-mb-val', v => parseFloat(String(v)).toFixed(1) + ' MB'],
  ];
  sliderDefs.forEach(([sliderId, valId, fmt]) => {
    const slider = document.getElementById(sliderId) as HTMLInputElement | null;
    const valEl  = document.getElementById(valId);
    if (!slider || !valEl) return;
    const upd = (): void => {
      valEl.textContent = fmt(Number(slider.value));
      slider.setAttribute('aria-valuenow', slider.value);
    };
    slider.addEventListener('input', upd);
    slider.addEventListener('change', runCompressor);
    upd();
  });

  document.querySelectorAll('.preset-chip[data-preset]').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.preset-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const p = COMPRESS_PRESETS[(chip as HTMLElement).dataset.preset!];
      if (!p) return;
      setSliderVal('img-target-kb', 'img-target-kb-val', p.kb, v => v + ' KB');
      setSliderVal('img-max-width', 'img-max-width-val', p.px, v => v + ' px');
      setSliderVal('pdf-target-mb', 'pdf-target-mb-val', p.mb, v => parseFloat(String(v)).toFixed(1) + ' MB');
      if (compressorFiles.length) runCompressor();
    });
  });

  // ══════════════════════════════════════════════════════
  //  COMPRESSOR
  // ══════════════════════════════════════════════════════
  const compressBtn = document.getElementById('compress-btn') as HTMLButtonElement | null;
  let compressProcessing = false;

  function syncCompressBtn(): void {
    if (compressBtn) compressBtn.disabled = compressorFiles.length === 0 || compressProcessing;
  }

  const ALL_IMG  = ['jpg', 'jpeg', 'png', 'webp', 'avif', 'tiff', 'tif', 'bmp', 'heic', 'heif'];
  const ALL_FILE = [...ALL_IMG, 'pdf'];

  const compressorFiles = setupDropZone(
    'compressor-drop', 'compressor-input', 'compressor-file-list',
    () => { syncCompressBtn(); }, ALL_FILE
  );
  document.getElementById('compressor-drop')?.addEventListener('drop',    () => setTimeout(runCompressor, 120));
  document.getElementById('compressor-input')?.addEventListener('change', () => setTimeout(runCompressor, 120));
  compressBtn?.addEventListener('click', runCompressor);

  window.addEventListener('pagehide', () => { compressAbortCtrl?.abort(); Utils.revokeAllObjectURLs(); });

  async function runCompressor(): Promise<void> {
    if (compressProcessing) return;
    const resultsEl = document.getElementById('compressor-results');
    if (!compressorFiles.length) {
      window.Shell.toast('Please upload some files first.', 'warn');
      if (resultsEl) resultsEl.innerHTML = '';
      return;
    }

    compressAbortCtrl?.abort();
    compressAbortCtrl = new AbortController();
    const { signal } = compressAbortCtrl;

    compressProcessing = true;
    if (compressBtn) { compressBtn.disabled = true; compressBtn.innerHTML = Utils.spinnerHTML() + ' Processing…'; }

    if (resultsEl) resultsEl.innerHTML = processingMsg(`Processing ${compressorFiles.length} file(s)…`);
    const targetKB = Number((document.getElementById('img-target-kb') as HTMLInputElement | null)?.value) || 100;
    const maxWidth = Number((document.getElementById('img-max-width') as HTMLInputElement | null)?.value) || 1000;
    const resultBlobs: (Blob | null)[] = [];
    let html = '';
    let successCount = 0;

    try {
      for (const file of compressorFiles) {
        if (signal.aborted) break;
        try {
          if (/\.pdf$/i.test(file.name)) {
            if (resultsEl) resultsEl.innerHTML = processingMsg(`Compressing PDF: ${file.name}…`);
            await PdfTools.ready();
            const blob = await PdfTools.compressPdf(file, 0.6, null, signal);
            resultBlobs.push(blob);
            html += buildResultCard(file, blob, 'compressed', 'pdf');
          } else {
            const { blob, fmtKey } = await ImageTools.compress(file, { targetKB, maxWidth, signal });
            resultBlobs.push(blob);
            html += buildResultCard(file, blob, 'compressed', 'img', fmtKey);
          }
          successCount++;
        } catch (err) {
          if ((err as DOMException).name === 'AbortError') break;
          html += errorCard(file.name, (err as Error).message);
          resultBlobs.push(null);
          window.Shell.toast(`Error processing ${file.name}: ${(err as Error).message}`, 'error');
        }
      }
    } finally {
      compressProcessing = false;
      if (compressBtn) {
        compressBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14V4h10l6 6v10H4v-2"/><path d="M14 4v6h6"/><path d="M7 14l5-5 5 5"/></svg> Compress Now`;
        syncCompressBtn();
      }
    }

    if (!signal.aborted && resultsEl) {
      resultsEl.innerHTML = html;
      attachClipboardBtns(resultsEl, i => resultBlobs[i] ?? null);
      if (successCount > 0) window.Shell.toast(`Successfully compressed ${successCount} file(s)`, 'success');
    }
  }

  // ══════════════════════════════════════════════════════
  //  CONVERTER
  // ══════════════════════════════════════════════════════
  let convertProcessing = false;

  const converterFiles = setupDropZone('converter-drop', 'converter-input', 'converter-file-list', files => {
    const btn = document.getElementById('convert-btn') as HTMLButtonElement | null;
    if (btn) btn.disabled = files.length === 0 || convertProcessing;
  }, ALL_FILE);

  window.addEventListener('pagehide', () => convertAbortCtrl?.abort());

  const fmtNoteEl = document.getElementById('modern-fmt-note');
  document.getElementById('convert-to-format')?.addEventListener('change', function (this: HTMLSelectElement) {
    if (['webp', 'avif'].includes(this.value)) {
      if (fmtNoteEl) {
        fmtNoteEl.style.display = '';
        fmtNoteEl.textContent = `✦ ${this.value.toUpperCase()} is a modern format. Supported in Chrome 80+, Firefox 93+, Safari 16+. Falls back to JPG if the browser canvas does not support it.`;
      }
    } else if (this.value === 'tiff') {
      if (fmtNoteEl) { fmtNoteEl.style.display = ''; fmtNoteEl.textContent = 'TIFF files are large and uncompressed. Best for print/archival use.'; }
    } else if (this.value === 'bmp') {
      if (fmtNoteEl) { fmtNoteEl.style.display = ''; fmtNoteEl.textContent = 'BMP files are uncompressed. Expect very large file sizes.'; }
    } else {
      if (fmtNoteEl) fmtNoteEl.style.display = 'none';
    }
  });

  const convertBtn = document.getElementById('convert-btn') as HTMLButtonElement | null;
  convertBtn?.addEventListener('click', async () => {
    if (convertProcessing) return;
    const resultsEl = document.getElementById('converter-results');
    if (!converterFiles.length) {
      window.Shell.toast('Please upload some files to convert.', 'warn');
      return;
    }

    convertAbortCtrl?.abort();
    convertAbortCtrl = new AbortController();
    const { signal } = convertAbortCtrl;

    convertProcessing = true;
    if (convertBtn) { convertBtn.disabled = true; convertBtn.innerHTML = Utils.spinnerHTML() + ' Converting…'; }

    const targetFmt = (document.getElementById('convert-to-format') as HTMLSelectElement).value;
    const quality   = Number((document.getElementById('convert-quality') as HTMLInputElement).value);
    if (resultsEl) resultsEl.innerHTML = processingMsg('Converting…');
    const resultBlobs: (Blob | null)[] = [];
    let html = '';
    let successCount = 0;

    try {
      for (const file of converterFiles) {
        if (signal.aborted) break;
        try {
          const srcExt = Utils.getExt(file.name);
          if (targetFmt === 'pdf') {
            await PdfTools.ready();
            const blob = await PdfTools.imagesToPdf([file], 'fit', 'portrait', signal);
            resultBlobs.push(blob);
            html += buildResultCard(file, blob, 'converted', 'pdf', 'pdf');
          } else if (srcExt === 'pdf') {
            await PdfTools.ready();
            const fmtArg = ['png', 'bmp', 'tiff'].includes(targetFmt) ? targetFmt : 'jpeg';
            const { blob } = await PdfTools.pdfPageToImage(file, 1, fmtArg, 2);
            resultBlobs.push(blob);
            html += buildResultCard(file, blob, 'converted', 'img', targetFmt);
          } else {
            const { blob, fmtKey, fallback } = await ImageTools.convert(file, targetFmt, quality);
            resultBlobs.push(blob);
            const note = fallback ? `<em style="color:var(--warn)">(browser fallback → JPG)</em>` : '';
            html += buildResultCard(file, blob, 'converted', 'img', fmtKey, note);
          }
          successCount++;
        } catch (err) {
          if ((err as DOMException).name === 'AbortError') break;
          html += errorCard(file.name, (err as Error).message);
          resultBlobs.push(null);
          window.Shell.toast(`Error converting ${file.name}: ${(err as Error).message}`, 'error');
        }
      }
    } finally {
      convertProcessing = false;
      if (convertBtn) { convertBtn.textContent = 'Convert Now'; convertBtn.disabled = converterFiles.length === 0; }
    }
    if (!signal.aborted && resultsEl) {
      resultsEl.innerHTML = html;
      attachClipboardBtns(resultsEl, i => resultBlobs[i] ?? null);
      if (successCount > 0) window.Shell.toast(`Successfully converted ${successCount} file(s)`, 'success');
    }
  });

  // ══════════════════════════════════════════════════════
  //  IMAGE CREATOR
  // ══════════════════════════════════════════════════════
  let creatorSrcFile: File | null = null;
  let creatorAspect: number | null = null;
  const widthInput  = document.getElementById('create-width')  as HTMLInputElement | null;
  const heightInput = document.getElementById('create-height') as HTMLInputElement | null;
  const lockRatio   = document.getElementById('create-lock-ratio') as HTMLInputElement | null;

  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      const b = btn as HTMLElement;
      if (widthInput)  widthInput.value  = b.dataset.w ?? '';
      if (heightInput) heightInput.value = b.dataset.h ?? '';
      creatorAspect = Number(b.dataset.w) / Number(b.dataset.h);
    });
  });

  widthInput?.addEventListener('input', () => {
    if (lockRatio?.checked && creatorAspect && heightInput)
      heightInput.value = String(Math.round(Number(widthInput!.value) / creatorAspect));
    else
      creatorAspect = Number(widthInput!.value) / Number(heightInput?.value);
  });
  heightInput?.addEventListener('input', () => {
    if (lockRatio?.checked && creatorAspect && widthInput)
      widthInput.value = String(Math.round(Number(heightInput!.value) * creatorAspect));
    else
      creatorAspect = Number(widthInput?.value) / Number(heightInput!.value);
  });
  lockRatio?.addEventListener('change', () => {
    if (lockRatio.checked) creatorAspect = Number(widthInput?.value) / Number(heightInput?.value);
  });

  document.getElementById('create-dim-apply')?.addEventListener('click', applyQuickDim);
  document.getElementById('create-dim-quick')?.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Enter') applyQuickDim();
  });
  function applyQuickDim(): void {
    const inp = document.getElementById('create-dim-quick') as HTMLInputElement | null;
    if (!inp) return;
    const m = inp.value.trim().match(/^(\d+)\s*[xX×*,\s]\s*(\d+)$/);
    if (m) {
      const w = parseInt(m[1], 10), h = parseInt(m[2], 10);
      if (w > 0 && h > 0 && w <= 10000 && h <= 10000) {
        if (widthInput)  widthInput.value  = String(w);
        if (heightInput) heightInput.value = String(h);
        creatorAspect = w / h;
        document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('selected'));
        inp.style.borderColor = 'var(--success)';
        setTimeout(() => { inp.style.borderColor = ''; }, 1200);
        return;
      }
    }
    inp.style.borderColor = 'var(--error)';
    setTimeout(() => { inp.style.borderColor = ''; }, 1200);
  }

  const creatorZone  = document.getElementById('creator-drop') as HTMLElement | null;
  const creatorInput = document.getElementById('creator-input') as HTMLInputElement | null;
  creatorZone?.addEventListener('click', (e: Event) => {
    const t = e.target as HTMLElement;
    if (!t.classList.contains('link') && t.tagName !== 'LABEL') creatorInput?.click();
  });
  ['dragenter', 'dragover'].forEach(ev =>
    creatorZone?.addEventListener(ev, (e: Event) => { e.preventDefault(); creatorZone.classList.add('drag-over'); })
  );
  ['dragleave', 'drop'].forEach(ev =>
    creatorZone?.addEventListener(ev, (e: Event) => { e.preventDefault(); creatorZone.classList.remove('drag-over'); })
  );
  creatorZone?.addEventListener('drop', (e: DragEvent) => {
    const f = e.dataTransfer?.files[0];
    if (f) setCreatorFile(f);
  });
  creatorInput?.addEventListener('change', () => {
    if (creatorInput.files?.[0]) setCreatorFile(creatorInput.files[0]);
    creatorInput.value = '';
  });

  function setCreatorFile(f: File): void {
    creatorSrcFile = f;
    const p = creatorZone?.querySelector('.upload-or');
    if (p) p.innerHTML = `Loaded: <strong>${Utils.escHtml(f.name)}</strong> · <label class="link" for="creator-input">change</label>`;
  }

  document.getElementById('create-btn')?.addEventListener('click', async () => {
    const resultEl = document.getElementById('creator-result');
    const canvasEl = document.getElementById('creator-canvas') as HTMLCanvasElement | null;
    const hintEl   = document.getElementById('creator-preview-hint');

    const w = parseInt(widthInput?.value ?? '', 10);
    const h = parseInt(heightInput?.value ?? '', 10);

    if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) {
      window.Shell.toast('Please enter valid dimensions (W x H).', 'warn');
      widthInput?.focus();
      return;
    }
    if (w > 10000 || h > 10000) {
      window.Shell.toast('Dimensions are too large (max 10,000px).', 'warn');
      return;
    }

    if (resultEl) resultEl.innerHTML = processingMsg('Creating…');
    try {
      const bg  = (document.getElementById('create-bg')     as HTMLInputElement | null)?.value ?? '#ffffff';
      const fmt = (document.getElementById('create-format') as HTMLSelectElement | null)?.value ?? 'jpeg';
      const { blob, canvas: c, fmtKey, fallback } = await ImageTools.create({
        width: w, height: h, bg, format: fmt, srcFile: creatorSrcFile, lockRatio: lockRatio?.checked,
      });
      if (canvasEl) {
        const ctx = canvasEl.getContext('2d') as CanvasRenderingContext2D;
        canvasEl.width = c.width; canvasEl.height = c.height;
        ctx.drawImage(c, 0, 0);
        canvasEl.style.display = 'block';
      }
      if (hintEl) hintEl.style.display = 'none';
      const ext      = fmtKey === 'jpeg' ? 'jpg' : fmtKey;
      const filename = `created_${w}x${h}.${ext}`;
      const url      = Utils.createObjectURL(blob);
      const fallbackNote = fallback ? `<em style="color:var(--warn)"> (browser fallback → JPG)</em>` : '';
      if (resultEl) resultEl.innerHTML = `
        <div class="result-card success">
          <div class="result-header">
            <h4>${Utils.escHtml(filename)}</h4>
            <span class="status-badge badge-success">Ready</span>
          </div>
          <div class="result-meta">
            <span>${w}&times;${h} px</span>
            <span>${Utils.formatBytes(blob.size)}</span>
            ${fallbackNote}
          </div>
          <div class="download-row">
            <a class="btn btn-success btn-small" href="${url}" download="${filename}">&#11015; Download</a>
            ${blob.type.startsWith('image/') ? '<button class="btn btn-ghost btn-small copy-clip-btn">&#128203; Copy</button>' : ''}
          </div>
        </div>`;
      if (resultEl) attachClipboardBtns(resultEl, () => blob);
      window.Shell.toast('Image created successfully!', 'success');
    } catch (err) {
      if (resultEl) resultEl.innerHTML = errorCard('Create', (err as Error).message);
      window.Shell.toast('Creation failed: ' + (err as Error).message, 'error');
    }
  });

  // ══════════════════════════════════════════════════════
  //  VALIDATOR
  // ══════════════════════════════════════════════════════
  let validatorFile: File | null = null;
  const validatorDrop  = document.getElementById('validator-drop')  as HTMLElement | null;
  const validatorInput = document.getElementById('validator-input') as HTMLInputElement | null;

  validatorDrop?.addEventListener('click', (e: Event) => {
    const t = e.target as HTMLElement;
    if (!t.classList.contains('link') && t.tagName !== 'LABEL') validatorInput?.click();
  });
  ['dragenter', 'dragover'].forEach(ev =>
    validatorDrop?.addEventListener(ev, (e: Event) => { e.preventDefault(); validatorDrop.classList.add('drag-over'); })
  );
  ['dragleave', 'drop'].forEach(ev =>
    validatorDrop?.addEventListener(ev, (e: Event) => { e.preventDefault(); validatorDrop.classList.remove('drag-over'); })
  );
  validatorDrop?.addEventListener('drop', (e: DragEvent) => {
    const f = e.dataTransfer?.files[0];
    if (f) runValidator(f);
  });
  validatorInput?.addEventListener('change', () => {
    if (validatorInput.files?.[0]) runValidator(validatorInput.files[0]);
    validatorInput.value = '';
  });
  document.getElementById('validator-doc-type')?.addEventListener('change', () => {
    if (validatorFile) runValidator(validatorFile);
  });

  async function runValidator(file: File): Promise<void> {
    if (!file) {
      window.Shell.toast('Please select a file to validate.', 'warn');
      return;
    }
    const preCheck = Utils.validateFile(file, Validator.ALLOWED_FORMATS, 50);
    if (!preCheck.valid) {
      window.Shell.toast(preCheck.error ?? 'Invalid file.', 'error');
      return;
    }
    validatorFile = file;
    const resultEl = document.getElementById('validator-result');
    const docType  = (document.getElementById('validator-doc-type') as HTMLSelectElement | null)?.value ?? 'general';
    if (resultEl) resultEl.innerHTML = processingMsg('Validating…');
    try {
      const { passed, checks } = await Validator.validate(file, docType);
      if (passed) window.Shell.toast('Validation Passed!', 'success');
      else        window.Shell.toast('Validation Failed — check details.', 'warn');

      let checksHtml = '<ul class="check-list">';
      checks.forEach(c => {
        const icon = c.pass ? '&#9989;' : '&#10060;';
        const cls  = c.pass ? 'icon-pass' : 'icon-fail';
        checksHtml += `<li><span class="${cls}">${icon}</span><span><strong>${Utils.escHtml(c.label)}</strong> — ${Utils.escHtml(c.detail)}</span></li>`;
      });
      checksHtml += '</ul>';
      let autoFix = '';
      if (!passed && ImageTools.isImage(file)) {
        autoFix = `<button class="btn btn-primary btn-small" id="auto-fix-btn">&#128295; Auto-Fix &amp; Download</button>`;
      }
      if (resultEl) resultEl.innerHTML = `
        <div class="result-card ${passed ? 'success' : 'error'}">
          <div class="result-header">
            <h4>${Utils.escHtml(file.name)}</h4>
            <span class="status-badge ${passed ? 'badge-success' : 'badge-error'}">${passed ? '&#9989; PASSED' : '&#10060; FAILED'}</span>
          </div>
          <div class="result-meta"><span>${Utils.formatBytes(file.size)}</span></div>
          ${checksHtml}
          <div class="download-row">${autoFix}</div>
        </div>`;
      if (!passed) {
        const autoFixBtn = document.getElementById('auto-fix-btn') as HTMLButtonElement | null;
        if (autoFixBtn) {
          autoFixBtn.addEventListener('click', async () => {
            autoFixBtn.disabled = true;
            autoFixBtn.innerHTML = Utils.spinnerHTML() + 'Fixing…';
            try {
              const fixed = await ImageTools.autoFix(file, docType);
              const name  = Utils.safeName(Utils.replaceExt(file.name, 'jpg'));
              Utils.downloadBlob(fixed, name);
              autoFixBtn.innerHTML  = '&#9989; Fixed &amp; Downloaded';
              autoFixBtn.className  = 'btn btn-success btn-small';
              window.Shell.toast('File fixed and downloaded!', 'success');
            } catch (e) {
              autoFixBtn.innerHTML = '&#10060; ' + Utils.escHtml((e as Error).message);
              window.Shell.toast('Auto-fix failed: ' + (e as Error).message, 'error');
            }
          });
        }
      }
    } catch (err) {
      if (resultEl) resultEl.innerHTML = errorCard(file.name, (err as Error).message);
      window.Shell.toast('Validation error: ' + (err as Error).message, 'error');
    }
  }

  // ══════════════════════════════════════════════════════
  //  SHARED RESULT CARD HELPERS
  // ══════════════════════════════════════════════════════
  function buildResultCard(
    origFile: File,
    blob: Blob,
    verb: string,
    kind: 'img' | 'pdf',
    targetFmt?: string,
    extraNote: string = ''
  ): string {
    const rawExt = targetFmt || (kind === 'pdf' ? 'pdf' : Utils.getExt(origFile.name));
    const extOut = rawExt === 'jpeg' ? 'jpg' : rawExt;
    const newName = verb === 'converted'
      ? Utils.replaceExt(origFile.name, extOut)
      : (() => {
          const dot  = origFile.name.lastIndexOf('.');
          const base = dot > 0 ? origFile.name.slice(0, dot) : origFile.name;
          return `${base}_${verb}.${extOut}`;
        })();
    const url      = Utils.createObjectURL(blob);
    const saved    = origFile.size - blob.size;
    const savedStr = saved > 0 ? `· saved ${Utils.formatBytes(saved)}` : '';
    const color    = FormatUtils.colorFor(extOut);

    let previewHtml = '';
    if (kind === 'img') {
      previewHtml = `<div class="preview-wrap"><img src="${url}" class="preview-thumb" alt="preview" /></div>`;
    } else {
      previewHtml = `<div class="preview-wrap pdf-preview-placeholder">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>
        <span>PDF Document</span>
      </div>`;
    }

    return `<div class="result-card success-pop">
      <div class="result-header">
        <div style="display:flex;align-items:center;gap:8px">
          <div class="success-check">✓</div>
          <h4>${Utils.escHtml(newName)}</h4>
        </div>
        <span class="status-badge" style="background:${color}22;color:${color}">${verb.charAt(0).toUpperCase() + verb.slice(1)}</span>
      </div>
      ${previewHtml}
      ${Utils.sizeBars(origFile.size, blob.size)}
      <div class="result-meta">
        <span>${Utils.formatBytes(blob.size)} ${savedStr}</span>
        ${extraNote}
      </div>
      <div class="download-row">
        <a class="btn btn-primary btn-success-main" href="${url}" download="${Utils.escHtml(newName)}">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Download Now
        </a>
        ${blob.type.startsWith('image/') ? '<button class="btn btn-ghost btn-small copy-clip-btn">Copy to Clipboard</button>' : ''}
      </div>
    </div>`;
  }

  function errorCard(name: string, msg: string): string {
    return `<div class="result-card error">
      <div class="result-header">
        <h4>${Utils.escHtml(name)}</h4>
        <span class="status-badge badge-error">Error</span>
      </div>
      <p class="result-meta">&#10060; ${Utils.escHtml(msg)}</p>
    </div>`;
  }

  function processingMsg(msg: string): string {
    return `<div class="processing-wrap">
      <div class="processing-msg">${Utils.spinnerHTML()} ${Utils.escHtml(msg)}</div>
      <div class="progress-bar-container"><div class="progress-bar-fill"></div></div>
    </div>`;
  }

  // ══════════════════════════════════════════════════════
  //  TOOL TABS (shared: b64-tabs, fmt-tabs)
  // ══════════════════════════════════════════════════════
  document.querySelectorAll('.tool-tabs').forEach(tabGroup => {
    tabGroup.querySelectorAll('.tool-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        tabGroup.querySelectorAll('.tool-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
      });
    });
  });

  // ══════════════════════════════════════════════════════
  //  BASE64 TOOL
  // ══════════════════════════════════════════════════════
  (function initBase64(): void {
    const input   = document.getElementById('b64-input')  as HTMLTextAreaElement | null;
    const runBtn  = document.getElementById('b64-run')    as HTMLButtonElement   | null;
    if (!input || !runBtn) return;

    const output  = document.getElementById('b64-output')      as HTMLTextAreaElement | null;
    const outWrap = document.getElementById('b64-output-wrap');
    const errEl   = document.getElementById('b64-error');
    const clrBtn  = document.getElementById('b64-clear')  as HTMLButtonElement | null;
    const copyBtn = document.getElementById('b64-copy')   as HTMLButtonElement | null;
    const tabs    = document.getElementById('b64-tabs');

    function getMode(): string {
      return (tabs?.querySelector('.tool-tab.active') as HTMLElement | null)?.dataset.tab ?? 'encode';
    }
    function showErr(msg: string): void {
      if (errEl) { errEl.textContent = msg; errEl.hidden = false; }
      if (outWrap) outWrap.hidden = true;
      window.Shell.toast(msg, 'error');
    }
    function showOut(val: string): void {
      if (output) output.value = val;
      if (outWrap) outWrap.hidden = false;
      if (errEl) errEl.hidden = true;
    }

    runBtn.addEventListener('click', () => {
      const text = input.value; // BASE64-001: Don't trim – spaces are valid content
      if (!text) {
        window.Shell.toast('Please enter some text or base64 to process.', 'warn');
        input.focus();
        return;
      }
      try {
        if (getMode() === 'encode') {
          const bytes     = new TextEncoder().encode(text);
          const binString = Array.from(bytes, byte => String.fromCharCode(byte)).join('');
          showOut(btoa(binString));
          window.Shell.toast('Text encoded successfully', 'success');
        } else {
          // BASE64-001: Support decoding with whitespace
          const cleanedText = text.replace(/\s/g, '');
          const binary      = atob(cleanedText);
          const bytes       = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
          showOut(new TextDecoder().decode(bytes));
          window.Shell.toast('Base64 decoded successfully', 'success');
        }
      } catch (err) {
        showErr(getMode() === 'decode'
          ? 'Invalid Base64 string: ' + (err as Error).message
          : 'Could not encode — check for unsupported characters.');
      }
    });

    clrBtn?.addEventListener('click', () => {
      input.value = '';
      if (output) output.value = '';
      if (outWrap) outWrap.hidden = true;
      if (errEl) errEl.hidden = true;
    });

    copyBtn?.addEventListener('click', () => {
      if (!output) return;
      navigator.clipboard.writeText(output.value).then(() => {
        if (copyBtn) {
          copyBtn.textContent = 'Copied!';
          copyBtn.classList.add('copied');
          setTimeout(() => { copyBtn.textContent = 'Copy'; copyBtn.classList.remove('copied'); }, 1800);
        }
      });
    });
  })();

  // ══════════════════════════════════════════════════════
  //  REGEX TESTER  (DEV-002: 5s timeout enforced)
  // ══════════════════════════════════════════════════════
  (function initRegex(): void {
    const patternInput = document.getElementById('regex-pattern') as HTMLInputElement   | null;
    const runBtn       = document.getElementById('regex-run')     as HTMLButtonElement   | null;
    if (!patternInput || !runBtn) return;

    const testInput   = document.getElementById('regex-test')        as HTMLTextAreaElement | null;
    const outWrap     = document.getElementById('regex-output-wrap');
    const highlighted = document.getElementById('regex-highlighted');
    const matchCount  = document.getElementById('regex-match-count');
    const errEl       = document.getElementById('regex-error');

    document.querySelectorAll('.regex-preset-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.regex-preset-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const c = chip as HTMLElement;
        patternInput.value = c.dataset.pattern ?? '';
        const flags = c.dataset.flags ?? '';
        const gf = document.getElementById('rf-g') as HTMLInputElement | null; if (gf) gf.checked = flags.includes('g');
        const ifl = document.getElementById('rf-i') as HTMLInputElement | null; if (ifl) ifl.checked = flags.includes('i');
        const mf = document.getElementById('rf-m') as HTMLInputElement | null; if (mf) mf.checked = flags.includes('m');
      });
    });

    function getFlags(): string {
      return ['g', 'i', 'm'].filter(f => {
        const el = document.getElementById('rf-' + f) as HTMLInputElement | null;
        return el ? el.checked : false;
      }).join('');
    }

    function applyRegexString(raw: string): boolean {
      const m = raw.match(/^\/(.+)\/([gimsuy]*)$/s);
      if (m && patternInput) {
        patternInput.value = m[1];
        const gf = document.getElementById('rf-g') as HTMLInputElement | null; if (gf) gf.checked = m[2].includes('g');
        const ifl = document.getElementById('rf-i') as HTMLInputElement | null; if (ifl) ifl.checked = m[2].includes('i');
        const mf = document.getElementById('rf-m') as HTMLInputElement | null; if (mf) mf.checked = m[2].includes('m');
        return true;
      }
      return false;
    }

    patternInput.addEventListener('paste', (e: ClipboardEvent) => {
      const pasted = (e.clipboardData ?? (window as unknown as { clipboardData: DataTransfer }).clipboardData).getData('text');
      if (applyRegexString(pasted.trim())) {
        e.preventDefault();
        document.querySelectorAll('.regex-preset-chip').forEach(c => c.classList.remove('active'));
      }
    });

    patternInput.addEventListener('change', () => {
      if (applyRegexString(patternInput.value.trim())) {
        document.querySelectorAll('.regex-preset-chip').forEach(c => c.classList.remove('active'));
      }
    });

    function escapeHtml(s: string): string {
      return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    runBtn.addEventListener('click', () => {
      const pattern = patternInput.value.trim();
      const testStr = testInput?.value ?? '';
      if (errEl) errEl.hidden = true;
      if (!pattern) {
        const msg = 'Enter a regex pattern.';
        if (errEl) { errEl.textContent = msg; errEl.hidden = false; }
        window.Shell.toast(msg, 'warn');
        patternInput.focus();
        return;
      }

      const baseFlags = getFlags();
      const flags = baseFlags.includes('g') ? baseFlags : baseFlags + 'g';

      if (highlighted) highlighted.innerHTML = '';
      if (matchCount) matchCount.textContent = 'Processing…';
      if (outWrap) outWrap.hidden = false;
      runBtn.disabled = true;
      runBtn.textContent = '⚡ Testing…';

      if (regexWorker) regexWorker.terminate();
      regexWorker = new Worker((window.KARUVI_BASE ?? '/') + 'js/regex-worker.js');

      // DEV-002: 5-second timeout to prevent runaway regex hanging the UI
      regexTimeout = setTimeout(() => {
        if (regexWorker) {
          regexWorker.terminate();
          regexWorker = null;
          runBtn.disabled = false;
          runBtn.textContent = '⚡ Test Pattern';
          const msg = 'Regex took too long and was terminated (5s limit).';
          if (errEl) { errEl.textContent = msg; errEl.hidden = false; }
          window.Shell.toast(msg, 'error');
        }
      }, 5000);

      regexWorker.onmessage = function (e: MessageEvent<RegexWorkerMessage>) {
        if (regexTimeout) clearTimeout(regexTimeout);
        runBtn.disabled = false;
        runBtn.textContent = '⚡ Test Pattern';

        if (e.data.type === 'error') {
          const msg = 'Invalid regex: ' + e.data.message;
          if (errEl) { errEl.textContent = msg; errEl.hidden = false; }
          if (outWrap) outWrap.hidden = true;
          window.Shell.toast(msg, 'error');
          return;
        }

        const matches = (e.data as RegexWorkerResult).matches;
        if (matchCount) {
          matchCount.textContent = matches.length
            ? `${matches.length} match${matches.length > 1 ? 'es' : ''} found`
            : 'No matches found';
          if (matches.length > 0) window.Shell.toast(`Found ${matches.length} matches`, 'success');
          else window.Shell.toast('No matches found', 'info');
        }

        let result = '';
        let last   = 0;
        for (const m of matches) {
          result += escapeHtml(testStr.slice(last, m.index));
          result += `<mark>${escapeHtml(m.value)}</mark>`;
          last = m.index + m.value.length;
          if (m.value.length === 0) last++;
        }
        result += escapeHtml(testStr.slice(last));
        if (highlighted) highlighted.innerHTML = result;
        if (outWrap) outWrap.hidden = false;
      };

      regexWorker.postMessage({ pattern, flags, testStr } as RegexWorkerRequest);
    });
  })();

  // ══════════════════════════════════════════════════════
  //  JSON / XML FORMATTER
  // ══════════════════════════════════════════════════════
  (function initFormatter(): void {
    const fmtInput    = document.getElementById('fmt-input')    as HTMLTextAreaElement | null;
    const beautifyBtn = document.getElementById('fmt-beautify') as HTMLButtonElement   | null;
    if (!fmtInput || !beautifyBtn) return;

    const fmtOutput  = document.getElementById('fmt-output');
    const fmtOutWrap = document.getElementById('fmt-output-wrap');
    const fmtErr     = document.getElementById('fmt-error');
    const minifyBtn  = document.getElementById('fmt-minify')  as HTMLButtonElement | null;
    const clearBtn   = document.getElementById('fmt-clear')   as HTMLButtonElement | null;
    const copyBtn    = document.getElementById('fmt-copy')    as HTMLButtonElement | null;
    const tabs       = document.getElementById('fmt-tabs');

    function getMode(): string {
      return (tabs?.querySelector('.tool-tab.active') as HTMLElement | null)?.dataset.tab ?? 'json';
    }
    function showErr(msg: string): void {
      if (fmtErr) { fmtErr.textContent = msg; fmtErr.hidden = false; }
      if (fmtOutWrap) fmtOutWrap.hidden = true;
      window.Shell.toast(msg, 'error');
    }
    function showOut(val: string): void {
      if (fmtOutput) fmtOutput.textContent = val;
      if (fmtOutWrap) fmtOutWrap.hidden = false;
      if (fmtErr) fmtErr.hidden = true;
      window.Shell.toast('Formatted successfully', 'success');
    }

    function formatJson(text: string, minify: boolean): string {
      try {
        const obj = JSON.parse(text);
        return minify ? JSON.stringify(obj) : JSON.stringify(obj, null, 2);
      } catch (e) {
        let msg = (e as Error).message;
        const posMatch = msg.match(/at position (\d+)/);
        if (posMatch) {
          const pos    = parseInt(posMatch[1], 10);
          const before = text.substring(0, pos);
          const lines  = before.split('\n');
          const line   = lines.length;
          const col    = lines[line - 1].length + 1;
          msg = `JSON Parse Error: ${msg} (Line ${line}, Column ${col})`;
          if (fmtInput) { fmtInput.focus(); fmtInput.setSelectionRange(pos, pos + 1); }
        }
        throw new Error(msg);
      }
    }

    function formatXml(text: string, minify: boolean): string {
      const parser = new DOMParser();
      const doc    = parser.parseFromString(text, 'application/xml');
      const parseErr = doc.querySelector('parsererror');
      if (parseErr) throw new Error(parseErr.textContent?.split('\n')[0] ?? 'Parse error');

      const prologMatch = text.match(/^<\?xml.*?\?>/i);
      const prolog      = prologMatch ? prologMatch[0] + '\n' : '';

      if (minify) {
        const s = new XMLSerializer();
        return (prolog + s.serializeToString(doc).replace(/>\s+</g, '><')).trim();
      }

      function indent(node: Node, level: number): string {
        const pad = '  '.repeat(level);
        if (node.nodeType === 3) {
          const t = node.textContent?.trim() ?? '';
          return t ? pad + t + '\n' : '';
        }
        if (node.nodeType === 8) return `${pad}<!--${node.textContent}-->\n`;
        if (node.nodeType !== 1) return '';

        const el    = node as Element;
        let attrs   = '';
        if (el.attributes) {
          for (const a of Array.from(el.attributes)) attrs += ` ${a.name}="${a.value}"`;
        }
        const children  = Array.from(el.childNodes);
        const childText = children.filter(c => c.nodeType === 3 && c.textContent?.trim());

        if (children.length === 1 && childText.length === 1) {
          return `${pad}<${el.tagName}${attrs}>${childText[0].textContent?.trim()}</${el.tagName}>\n`;
        }
        if (children.length === 0) return `${pad}<${el.tagName}${attrs}/>\n`;

        let out = `${pad}<${el.tagName}${attrs}>\n`;
        children.forEach(c => { out += indent(c, level + 1); });
        out += `${pad}</${el.tagName}>\n`;
        return out;
      }

      return (prolog + indent(doc.documentElement, 0)).trimEnd();
    }

    function run(minify: boolean): void {
      if (!fmtInput) return;
      const text = fmtInput.value.trim();
      if (!text) {
        window.Shell.toast('Please paste some content first.', 'warn');
        fmtInput.focus();
        return;
      }
      try {
        showOut(getMode() === 'json' ? formatJson(text, minify) : formatXml(text, minify));
      } catch (e) {
        showErr('Parse error: ' + (e as Error).message);
      }
    }

    beautifyBtn.addEventListener('click', () => run(false));
    minifyBtn?.addEventListener('click', () => run(true));
    clearBtn?.addEventListener('click', () => {
      fmtInput.value = '';
      if (fmtOutput) fmtOutput.textContent = '';
      if (fmtOutWrap) fmtOutWrap.hidden = true;
      if (fmtErr) fmtErr.hidden = true;
    });
    copyBtn?.addEventListener('click', () => {
      if (!fmtOutput) return;
      navigator.clipboard.writeText(fmtOutput.textContent ?? '').then(() => {
        if (copyBtn) {
          copyBtn.textContent = 'Copied!';
          copyBtn.classList.add('copied');
          setTimeout(() => { copyBtn.textContent = 'Copy'; copyBtn.classList.remove('copied'); }, 1800);
        }
      });
    });
  })();

});
