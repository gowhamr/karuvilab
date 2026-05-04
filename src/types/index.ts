// ═══════════════════════════════════════════════════════════════
//  KaruviLab – Shared TypeScript Interfaces & Types
// ═══════════════════════════════════════════════════════════════

// ─── Result monad ───────────────────────────────────────────────

type Result<T, E = Error> =
  | { ok: true;  value: T }
  | { ok: false; error: E };

// ─── Result types ───────────────────────────────────────────────

interface FileValidationResult {
  valid: boolean;
  error?: string;
}

interface ValidationCheck {
  label: string;
  pass: boolean;
  warn: boolean;
  detail: string;
}

interface ValidationResult {
  passed: boolean;
  checks: ValidationCheck[];
  rule: DocRule;
}

// ─── Document / validator rules ─────────────────────────────────

interface DocRule {
  label: string;
  formats: string[];
  minKB?: number;
  maxKB?: number;
  exactW?: number;
  exactH?: number;
  maxWidthPx?: number;
  background?: string;
}

// ─── Image processing ────────────────────────────────────────────

interface CompressionOptions {
  targetKB?: number;
  maxWidth?: number;
  signal?: AbortSignal | null;
}

interface CompressResult {
  blob: Blob;
  width: number;
  height: number;
  quality: number;
  iterations: number;
  mime: string;
  fmtKey: string;
}

interface ConvertResult {
  blob: Blob;
  mime: string;
  fmtKey: string;
  fallback: boolean;
}

interface ResolvedMime {
  mime: string;
  fmtKey: string;
  fallback: boolean;
}

interface CreateOptions {
  width: number;
  height: number;
  bg?: string;
  format?: string;
  srcFile?: File | null;
  fit?: string;
  quality?: number;
  lockRatio?: boolean;
}

interface CreateResult {
  blob: Blob;
  canvas: HTMLCanvasElement;
  mime?: string;
  fmtKey: string;
  fallback: boolean;
}

// ─── PDF processing ──────────────────────────────────────────────

type PdfPageSize = 'a4' | 'letter' | 'fit';
type PdfOrientation = 'portrait' | 'landscape';

// ─── Security tools ──────────────────────────────────────────────

interface PasswordOptions {
  upper: boolean;
  lower: boolean;
  number: boolean;
  symbol: boolean;
}

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
  pct: number;
}

interface JWTDecodeResult {
  header?: Record<string, unknown>;
  payload?: Record<string, unknown>;
  valid: boolean;
  error?: string;
}

// ─── Compress presets ────────────────────────────────────────────

interface CompressPreset {
  kb: number;
  px: number;
  mb: number;
}

// ─── Format metadata ─────────────────────────────────────────────

interface FormatInfo {
  label: string;
  exts: string[];
  color: string;
  canExport: boolean;
}

// ─── Toast / UI ──────────────────────────────────────────────────

type ToastType = 'info' | 'success' | 'error' | 'warn';

// ─── Regex worker messages ───────────────────────────────────────

interface RegexWorkerRequest {
  pattern: string;
  flags: string;
  testStr: string;
}

interface RegexMatch {
  index: number;
  value: string;
}

interface RegexWorkerResult {
  type: 'result';
  matches: RegexMatch[];
}

interface RegexWorkerError {
  type: 'error';
  message: string;
}

type RegexWorkerMessage = RegexWorkerResult | RegexWorkerError;

// ─── Split tool ──────────────────────────────────────────────────

type SplitMethod = 'equal' | 'chars' | 'delim' | 'custom';

interface SplitToolState {
  parts: string[];
  content: string;
  currentMethod: SplitMethod;
}
