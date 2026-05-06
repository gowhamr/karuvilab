// ═══════════════════════════════════════════════════════════════
//  KaruviLab – Ambient declarations for CDN libraries & window globals
// ═══════════════════════════════════════════════════════════════

// ─── pdf-lib ─────────────────────────────────────────────────────

interface PDFPage {}

interface PDFDocument {
  addPage(page: PDFPage): PDFPage;
  copyPages(src: PDFDocument, indices: number[]): Promise<PDFPage[]>;
  getPageCount(): number;
  getPageIndices(): number[];
  save(): Promise<Uint8Array>;
}

interface PDFDocumentConstructor {
  create(): Promise<PDFDocument>;
  load(bytes: ArrayBuffer, opts?: { ignoreEncryption?: boolean }): Promise<PDFDocument>;
}

interface PDFLibInterface {
  PDFDocument: PDFDocumentConstructor;
}

// ─── jsPDF ───────────────────────────────────────────────────────

interface JsPDFOptions {
  unit?: string;
  format?: number[] | string;
  orientation?: 'p' | 'l';
}

interface JsPDFInstance {
  addPage(format: number[], orientation: 'p' | 'l'): void;
  addImage(
    data: string,
    format: string,
    x: number, y: number,
    w: number, h: number
  ): void;
  output(type: 'blob'): Blob;
}

type JsPDFConstructor = new (opts: JsPDFOptions) => JsPDFInstance;

interface JsPDFModule {
  jsPDF: JsPDFConstructor;
}

// ─── PDF.js (pdfjs-dist) ─────────────────────────────────────────

interface PdfjsViewport {
  width: number;
  height: number;
}

interface PdfjsRenderTask {
  promise: Promise<void>;
}

interface PdfjsPage {
  getViewport(opts: { scale: number }): PdfjsViewport;
  render(opts: { canvasContext: CanvasRenderingContext2D; viewport: PdfjsViewport }): PdfjsRenderTask;
}

interface PdfjsDocument {
  numPages: number;
  getPage(num: number): Promise<PdfjsPage>;
  getPageIndices(): number[];
  destroy(): Promise<void>;
}

interface PdfjsGetDocumentTask {
  promise: Promise<PdfjsDocument>;
}

interface PdfjsLib {
  GlobalWorkerOptions: { workerSrc: string };
  getDocument(src: { data: ArrayBuffer }): PdfjsGetDocumentTask;
}

// ─── QRCode.js ───────────────────────────────────────────────────

interface QRCodeColorOptions {
  dark: string;
  light: string;
}

interface QRCodeOptions {
  width: number;
  margin: number;
  errorCorrectionLevel: string;
  color?: QRCodeColorOptions;
  type?: string;
}

interface QRCodeLib {
  toCanvas(
    canvas: HTMLCanvasElement,
    text: string,
    opts: QRCodeOptions,
    cb: (err: Error | null) => void
  ): void;
  toString(
    text: string,
    opts: QRCodeOptions,
    cb: (err: Error | null, svg: string) => void
  ): void;
}

// ─── UTIF.js (TIFF codec) ────────────────────────────────────────

interface UTIFImage {
  width: number;
  height: number;
}

interface UTIFLib {
  decode(ab: ArrayBuffer): UTIFImage[];
  decodeImage(ab: ArrayBuffer, ifd: UTIFImage): void;
  toRGBA8(ifd: UTIFImage): Uint8Array;
  encodeImage(rgba: Uint8ClampedArray, w: number, h: number): ArrayBuffer;
}

// ─── heic2any ────────────────────────────────────────────────────

interface Heic2AnyOptions {
  blob: Blob;
  toType: string;
  quality: number;
}

type Heic2AnyFn = (opts: Heic2AnyOptions) => Promise<Blob | Blob[]>;

// ─── marked (Markdown parser) ────────────────────────────────────

interface MarkedLib {
  parse(src: string): string;
}

// ─── highlight.js ────────────────────────────────────────────────

interface HljsLib {
  highlightElement(el: Element): void;
}

// ─── mermaid ─────────────────────────────────────────────────────

interface MermaidLib {
  initialize(opts: Record<string, unknown>): void;
  run(opts: { nodes: NodeListOf<Element> }): Promise<void>;
}

// ─── Window global extensions ────────────────────────────────────

interface Window {
  // KaruviLab internals
  SHELL_ACTIVE?: string;
  KARUVI_BASE?: string;
  THEME_MANAGER_LOADED?: boolean;

  // Tool init hooks (called by app.js or shell pages)
  mdInit?: () => void;
  qrInit?: () => void;
  splitInit?: () => void;

  // QR tool globals (called from HTML onclick)
  qrGenerate?: () => void;
  qrDownload?: (format: 'png' | 'svg') => void;
  qrCopyImage?: () => void;

  // Markdown tool globals
  mdExportHtml?: (source: string) => void;
  mdExportPDF?: (source: string) => void;
  mdExportWord?: (source: string) => void;

  // CDN libraries
  PDFLib?: PDFLibInterface;
  jspdf?: JsPDFModule;
  pdfjsLib?: PdfjsLib;
  QRCode?: QRCodeLib;
  UTIF?: UTIFLib;
  heic2any?: Heic2AnyFn;
  marked?: MarkedLib;
  hljs?: HljsLib;
  mermaid?: MermaidLib;

  // Computed globals
  Shell: ShellInterface;
  Utils: UtilsInterface;
  States?: StatesInterface;
  PDFFlow?: PDFFlowInterface;
  KaruviRegistry?: KaruviRegistryInterface;
}

// ─── PDFFlow interface (defined in pdf-flow.ts) ──────────────────

interface PDFFlowInterface {
  setStep(name: string, selector?: string): void;
  advance(name: string, selector?: string): void;
  reset(selector?: string): void;
  currentStep(selector?: string): string | null;
}

// ─── States interface (defined in states.ts) ─────────────────────

interface StateLoadingOptions { title?: string; message?: string; progress?: number; }
interface StateEmptyOptions   { title?: string; message?: string; icon?: string; }
interface StateErrorOptions   { title?: string; message?: string; onRetry?: () => void; retryLabel?: string; }
interface StateSuccessOptions { title?: string; message?: string; actionLabel?: string; onAction?: () => void; }

interface StatesInterface {
  loading(target: HTMLElement | string, opts?: StateLoadingOptions): HTMLElement | null;
  empty(target: HTMLElement | string, opts?: StateEmptyOptions): HTMLElement | null;
  error(target: HTMLElement | string, opts?: StateErrorOptions): HTMLElement | null;
  success(target: HTMLElement | string, opts?: StateSuccessOptions): HTMLElement | null;
  clear(target: HTMLElement | string): void;
}

// ─── Utils interface (defined in utils.ts) ───────────────────────

interface UtilsInterface {
  formatBytes(bytes: number): string;
  safeName(name: string): string;
  hasSpecialChars(name: string): boolean;
  readAsDataURL(file: File): Promise<string>;
  readAsArrayBuffer(file: File | Blob): Promise<ArrayBuffer>;
  loadImage(src: string): Promise<HTMLImageElement>;
  downloadBlob(blob: Blob, filename: string): void;
  drawResized(img: HTMLImageElement, maxW: number | null, maxH: number | null): HTMLCanvasElement;
  canvasToBlob(canvas: HTMLCanvasElement, mimeType?: string, quality?: number): Promise<Blob>;
  mimeFromExt(ext: string): string;
  extFromMime(mime: string): string;
  supportsFormat(mime: string): Promise<boolean>;
  replaceExt(filename: string, newExt: string): string;
  getExt(filename: string): string;
  escHtml(str: unknown): string;
  spinnerHTML(): string;
  sizeBars(originalBytes: number, newBytes: number): string;
  debounce<T extends (...args: unknown[]) => void>(func: T, wait: number): (...args: Parameters<T>) => void;
  validateFile(file: File | null, allowedExtensions?: string[], maxMB?: number): FileValidationResult;
}

// ─── Shell interface (defined in shell.ts, used everywhere) ──────

interface ShellInterface {
  init(): void;
  goHome(): void;
  render(): void;
  setupTheme(): void;
  setupEffects(): void;
  setupErrorHandling(): void;
  setupSidebar(): void;
  buildSidebar(base: string, active: string): HTMLElement;
  recordVisit(): void;
  showFallbackError(msg?: string): void;
  waitForLibs(libs: string[], toolName: string): Promise<boolean>;
  toast(msg: string, type?: ToastType, duration?: number): void;
}

// ─── Tool Registry (defined in tool-registry.ts) ─────────────────

interface KaruviToolEntry {
  id: string;
  name: string;
  desc: string;
  href: string;
  category: 'calculators' | 'pdf' | 'image' | 'security' | 'developer' | 'utilities' | 'seo';
  keywords: string[];
  popular?: boolean;
}

interface KaruviRegistryInterface {
  TOOLS: KaruviToolEntry[];
  CATEGORIES: Array<{ id: KaruviToolEntry['category']; label: string; href: string; emoji: string }>;
  findToolById(id: string): KaruviToolEntry | undefined;
  findToolByPath(pathname: string): KaruviToolEntry | undefined;
  getRecentTools(): KaruviToolEntry[];
}
