// ═══════════════════════════════════════════════════════════════
//  KaruviLab – Shared TypeScript Interfaces & Types
// ═══════════════════════════════════════════════════════════════

// ─── Result monad ───────────────────────────────────────────────

export type Result<T, E = Error> =
  | { ok: true;  value: T }
  | { ok: false; error: E };

// ─── Result types ───────────────────────────────────────────────

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export interface ValidationCheck {
  label: string;
  pass: boolean;
  warn: boolean;
  detail: string;
}

export interface ValidationResult {
  passed: boolean;
  checks: ValidationCheck[];
  rule: DocRule;
}

// ─── Document / validator rules ─────────────────────────────────

export interface DocRule {
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

export interface CompressionOptions {
  targetKB?: number;
  maxWidth?: number;
  signal?: AbortSignal | null;
}

export interface CompressResult {
  blob: Blob;
  width: number;
  height: number;
  quality: number;
  iterations: number;
  mime: string;
  fmtKey: string;
}

export interface ConvertResult {
  blob: Blob;
  mime: string;
  fmtKey: string;
  fallback: boolean;
}

export interface ResolvedMime {
  mime: string;
  fmtKey: string;
  fallback: boolean;
}

export interface CreateOptions {
  width: number;
  height: number;
  bg?: string;
  format?: string;
  srcFile?: File | null;
  fit?: string;
  quality?: number;
  lockRatio?: boolean;
}

export interface CreateResult {
  blob: Blob;
  canvas: HTMLCanvasElement;
  mime?: string;
  fmtKey: string;
  fallback: boolean;
}

// ─── PDF processing ──────────────────────────────────────────────

export type PdfPageSize = 'a4' | 'letter' | 'fit';
export type PdfOrientation = 'portrait' | 'landscape';

// ─── Security tools ──────────────────────────────────────────────

export interface PasswordOptions {
  upper: boolean;
  lower: boolean;
  number: boolean;
  symbol: boolean;
}

export interface PasswordStrength {
  score: number;
  label: string;
  color: string;
  pct: number;
}

export interface JWTDecodeResult {
  header?: Record<string, unknown>;
  payload?: Record<string, unknown>;
  valid: boolean;
  error?: string;
}

// ─── Compress presets ────────────────────────────────────────────

export interface CompressPreset {
  kb: number;
  px: number;
  mb: number;
}

// ─── Format metadata ─────────────────────────────────────────────

export interface FormatInfo {
  label: string;
  exts: string[];
  color: string;
  canExport: boolean;
}

// ─── Toast / UI ──────────────────────────────────────────────────

export type ToastType = 'info' | 'success' | 'error' | 'warn';

// ─── Regex worker messages ───────────────────────────────────────

export interface RegexWorkerRequest {
  pattern: string;
  flags: string;
  testStr: string;
}

export interface RegexMatch {
  index: number;
  value: string;
}

export interface RegexWorkerResult {
  type: 'result';
  matches: RegexMatch[];
}

export interface RegexWorkerError {
  type: 'error';
  message: string;
}

export type RegexWorkerMessage = RegexWorkerResult | RegexWorkerError;

// ─── Split tool ──────────────────────────────────────────────────

export type SplitMethod = 'equal' | 'chars' | 'delim' | 'custom';

export interface SplitToolState {
  parts: string[];
  content: string;
  currentMethod: SplitMethod;
}
