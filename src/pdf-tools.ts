/* ===== pdf-tools.ts – PDF creation, merge, compress, split ===== */

const PDFJS_WORKER_SRC = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
const MAX_PDF_SIZE_MB  = 200;

const PdfTools = (() => {

  function jsPDF(): JsPDFConstructor | null {
    return window.jspdf ? window.jspdf.jsPDF : null;
  }

  function pdfLib(): PDFLibInterface | null {
    return window.PDFLib || null;
  }

  async function ready(): Promise<boolean> {
    const libs: string[] = [];
    if (!window.jspdf)   libs.push('jspdf');
    if (!window.PDFLib)  libs.push('PDFLib');
    if (!window.pdfjsLib) libs.push('pdfjsLib');
    if (libs.length === 0) return true;
    return window.Shell.waitForLibs(libs, 'PDF Tools');
  }

  function getPdfjsLib(): PdfjsLib | null {
    const lib = window.pdfjsLib ?? null;
    if (lib && lib.GlobalWorkerOptions.workerSrc !== PDFJS_WORKER_SRC) {
      lib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_SRC;
    }
    return lib;
  }

  const A4_W = 595.28, A4_H = 841.89;
  const LETTER_W = 612,  LETTER_H = 792;

  async function imagesToPdf(
    files: File[],
    pageSize: PdfPageSize = 'a4',
    orientation: PdfOrientation = 'portrait',
    signal: AbortSignal | null = null
  ): Promise<Blob> {
    const JsPDFCtor = jsPDF();
    if (!JsPDFCtor) throw new Error('jsPDF library not loaded');

    let doc: JsPDFInstance | null = null;

    for (let i = 0; i < files.length; i++) {
      if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
      const file   = files[i];
      const dataUrl = await Utils.readAsDataURL(file);
      const img    = await Utils.loadImage(dataUrl);
      const iw = img.naturalWidth, ih = img.naturalHeight;

      let pgW: number, pgH: number;
      if (pageSize === 'fit') {
        pgW = iw * 0.75; pgH = ih * 0.75;
      } else if (pageSize === 'letter') {
        pgW = orientation === 'landscape' ? LETTER_H : LETTER_W;
        pgH = orientation === 'landscape' ? LETTER_W : LETTER_H;
      } else {
        pgW = orientation === 'landscape' ? A4_H : A4_W;
        pgH = orientation === 'landscape' ? A4_W : A4_H;
      }

      if (i === 0) {
        doc = new JsPDFCtor({ unit: 'pt', format: [pgW, pgH], orientation: orientation === 'landscape' ? 'l' : 'p' });
      } else {
        doc!.addPage([pgW, pgH], orientation === 'landscape' ? 'l' : 'p');
      }

      const pad = 20;
      const availW = pgW - pad * 2, availH = pgH - pad * 2;
      const scale  = Math.min(availW / iw, availH / ih, 1);
      const dw = iw * scale, dh = ih * scale;
      const dx = pad + (availW - dw) / 2, dy = pad + (availH - dh) / 2;

      const ext = Utils.getExt(file.name);
      let fmt = 'JPEG';
      if (ext === 'png') fmt = 'PNG';
      else if (ext === 'webp') fmt = 'WEBP';

      doc!.addImage(dataUrl, fmt, dx, dy, dw, dh);
    }

    if (!doc) throw new Error('No files provided');
    return doc.output('blob');
  }

  async function mergePdfs(
    pdfs: (File | Blob)[],
    signal: AbortSignal | null = null
  ): Promise<Blob> {
    const lib = pdfLib();
    if (!lib) throw new Error('pdf-lib library not loaded');

    const merged = await lib.PDFDocument.create();
    for (const pdf of pdfs) {
      if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
      
      // PDF-002: MIME type validation
      if (pdf.type && pdf.type !== 'application/pdf') {
        throw new Error('Unsupported file type. Please provide only PDF files.');
      }

      const ab  = await Utils.readAsArrayBuffer(pdf);
      const doc = await lib.PDFDocument.load(ab, { ignoreEncryption: true });
      const pages = await merged.copyPages(doc, doc.getPageIndices());
      pages.forEach(p => merged.addPage(p));
    }
    const bytes = await merged.save();
    return new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' });
  }

  async function compressPdf(
    file: File,
    imageQuality: number = 0.6,
    onProgress: ((page: number, total: number) => void) | null = null,
    signal: AbortSignal | null = null
  ): Promise<Blob> {
    if (file.size > MAX_PDF_SIZE_MB * 1024 * 1024) {
      throw new Error(`File too large. Please use a PDF under ${MAX_PDF_SIZE_MB} MB.`);
    }

    const JsPDFCtor = jsPDF();
    if (!JsPDFCtor) throw new Error('jsPDF not loaded');

    const pdfjsLib = getPdfjsLib();
    if (!pdfjsLib) throw new Error('PDF.js not loaded');

    const ab          = await Utils.readAsArrayBuffer(file);
    const loadingTask = pdfjsLib.getDocument({ data: ab });
    const pdfDoc      = await loadingTask.promise;
    const total       = pdfDoc.numPages;

    let jsdoc: JsPDFInstance | null = null;

    // PDF-002: Adapt render scale to file size so very large PDFs don't
    // exhaust memory or freeze the tab during canvas.toDataURL().
    const scale = file.size > 25 * 1024 * 1024 ? 1.0
                : file.size > 10 * 1024 * 1024 ? 1.25
                : 1.5;

    try {
      for (let i = 1; i <= total; i++) {
        if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');

        // PDF-001: Yield to the browser so the UI thread can repaint
        // (spinner, progress bar) between pages.
        await new Promise(resolve => requestAnimationFrame(resolve));

        if (onProgress) onProgress(i, total);

        const page     = await pdfDoc.getPage(i);
        const viewport = page.getViewport({ scale });
        const canvas   = document.createElement('canvas');
        canvas.width   = Math.round(viewport.width);
        canvas.height  = Math.round(viewport.height);
        const ctx      = canvas.getContext('2d') as CanvasRenderingContext2D;

        await page.render({ canvasContext: ctx, viewport }).promise;

        // Yield once more before the (synchronous) toDataURL — keeps the
        // spinner animating on huge pages.
        await new Promise(resolve => setTimeout(resolve, 0));
        const dataUrl = canvas.toDataURL('image/jpeg', imageQuality);
        const pgW = viewport.width  * 0.75;
        const pgH = viewport.height * 0.75;

        if (i === 1) {
          jsdoc = new JsPDFCtor({
            unit: 'pt',
            format: [pgW, pgH],
            orientation: pgW > pgH ? 'l' : 'p',
            compress: true,
          });
        } else {
          jsdoc!.addPage([pgW, pgH], pgW > pgH ? 'l' : 'p');
        }

        jsdoc!.addImage(dataUrl, 'JPEG', 0, 0, pgW, pgH, undefined, 'FAST');

        // Release canvas memory immediately so large PDFs don't accumulate
        canvas.width = 0;
        canvas.height = 0;
      }
    } finally {
      await pdfDoc.destroy();
    }

    if (!jsdoc) throw new Error('PDF has no pages');
    return jsdoc.output('blob');
  }

  async function pdfPageToImage(
    file: File,
    pageNum: number = 1,
    format: string = 'jpeg',
    scale: number = 2
  ): Promise<{ blob: Blob; width: number; height: number }> {
    const pdfjsLib = getPdfjsLib();
    if (!pdfjsLib) throw new Error('PDF.js not loaded');

    const ab     = await Utils.readAsArrayBuffer(file);
    const pdfDoc = await pdfjsLib.getDocument({ data: ab }).promise;
    try {
      const page     = await pdfDoc.getPage(pageNum);
      const viewport = page.getViewport({ scale });
      const canvas   = document.createElement('canvas');
      canvas.width   = Math.round(viewport.width);
      canvas.height  = Math.round(viewport.height);
      await page.render({ canvasContext: canvas.getContext('2d') as CanvasRenderingContext2D, viewport }).promise;

      const mime = format === 'png' ? 'image/png' : 'image/jpeg';
      const blob = await Utils.canvasToBlob(canvas, mime, 0.9);
      return { blob, width: canvas.width, height: canvas.height };
    } finally {
      await pdfDoc.destroy();
    }
  }

  // PDF-002: Fix – `results` array was referenced but never declared in original JS
  async function splitPdf(
    pdf: File | Blob,
    range: string = 'all',
    signal: AbortSignal | null = null
  ): Promise<Blob[]> {
    const lib = pdfLib();
    if (!lib) throw new Error('pdf-lib library not loaded');

    const ab     = await Utils.readAsArrayBuffer(pdf);
    const srcDoc = await lib.PDFDocument.load(ab, { ignoreEncryption: true });
    const pageCount = srcDoc.getPageCount();

    const pagesToExtract: number[][] = [];

    if (range === 'all') {
      for (let i = 0; i < pageCount; i++) pagesToExtract.push([i]);
    } else if (!range || !range.trim()) {
      throw new Error('Please enter a valid page range (e.g. 1-3, 5).');
    } else {
      if (!/^\s*\d+\s*(?:-\s*\d+\s*)?(?:,\s*\d+\s*(?:-\s*\d+\s*)?)*$/.test(range)) {
        throw new Error('Invalid range format. Use numbers and ranges like "1-3, 5".');
      }
      const parts = range.split(',').map(s => s.trim());
      for (const part of parts) {
        if (part.includes('-')) {
          const [startStr, endStr] = part.split('-');
          const start = Number(startStr), end = Number(endStr);
          if (isNaN(start) || isNaN(end)) throw new Error(`Invalid range: ${part}`);
          if (start > end) throw new Error(`Start page cannot be greater than end page: ${part}`);
          if (start < 1 || end > pageCount) throw new Error(`Range ${part} is out of bounds (1-${pageCount})`);
          const rangePages: number[] = [];
          for (let i = start - 1; i < end; i++) rangePages.push(i);
          if (rangePages.length) pagesToExtract.push(rangePages);
        } else {
          const num = parseInt(part, 10);
          if (isNaN(num)) throw new Error(`Invalid page number: ${part}`);
          if (num < 1 || num > pageCount) throw new Error(`Page ${num} is out of bounds (1-${pageCount})`);
          pagesToExtract.push([num - 1]);
        }
      }
    }

    if (!pagesToExtract.length) throw new Error('No valid pages selected for split.');

    const results: Blob[] = []; // PDF-002: declare results array before the loop
    for (const indices of pagesToExtract) {
      if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
      const newDoc       = await lib.PDFDocument.create();
      const copiedPages  = await newDoc.copyPages(srcDoc, indices);
      copiedPages.forEach(p => newDoc.addPage(p));
      const bytes = await newDoc.save();
      results.push(new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' }));
    }
    return results;
  }

  return { ready, imagesToPdf, mergePdfs, compressPdf, pdfPageToImage, splitPdf };
})();
