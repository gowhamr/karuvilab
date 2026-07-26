import * as Comlink from "comlink";
import { EmiInputs, EmiResult } from "../lib/emi-calculations";

export type { EmiInputs, EmiResult };

export type TaskProgress = {
  percent: number;
  message?: string;
  stage?: string;
};

export type ProgressCallback = (progress: TaskProgress) => void;

export type DiffType = 'added' | 'removed' | 'equal';

export interface DiffLine {
  type: DiffType;
  text: string;
  lineA?: number;
  lineB?: number;
}

export interface CompressionSettings {
  quality: number;
  format: 'image/jpeg' | 'image/png' | 'image/webp' | 'image/avif';
  resizeWidth: number | null;
  resizeHeight: number | null;
  maintainAspectRatio: boolean;
  lossless: boolean;
}

export interface HashOptions {
  algo: string;
  hmacKey?: string;
  encoding?: 'hex' | 'base64';
}

export interface WorkerAPI {
  // Hash Tasks
  generateHashes(
    text: string, 
    algos: string[], 
    encoding?: 'hex' | 'base64',
    onProgress?: ProgressCallback
  ): Promise<Record<string, string>>;

  generateFileHash(
    file: ArrayBuffer,
    algo: string,
    encoding?: 'hex' | 'base64',
    onProgress?: ProgressCallback
  ): Promise<string>;

  directoryHashManifest(
    files: Array<{ path: string; buffer: ArrayBuffer }>,
    algo: string,
    encoding?: 'hex' | 'base64',
    onProgress?: ProgressCallback
  ): Promise<Array<{ path: string; size: number; hash: string }>>;

  generateHmac(
    text: string,
    key: string,
    algo: string,
    encoding?: 'hex' | 'base64',
    onProgress?: ProgressCallback
  ): Promise<string>;

  generateFileHmac(
    file: ArrayBuffer,
    key: string,
    algo: string,
    encoding?: 'hex' | 'base64',
    onProgress?: ProgressCallback
  ): Promise<string>;
  
  // Encryption & Key Tasks
  aesEncrypt(
    plaintext: string,
    password: string,
    mode?: 'GCM' | 'CBC',
    keySize?: 128 | 192 | 256,
    onProgress?: ProgressCallback
  ): Promise<string>;

  aesDecrypt(
    ciphertextB64: string,
    password: string,
    mode?: 'GCM' | 'CBC',
    keySize?: 128 | 192 | 256,
    onProgress?: ProgressCallback
  ): Promise<string>;

  generateRsaKeyPair(
    modulusLength?: 1024 | 2048 | 3072 | 4096,
    hash?: 'SHA-256' | 'SHA-512',
    onProgress?: ProgressCallback
  ): Promise<{ publicKeyPem: string; privateKeyPem: string }>;

  rsaEncrypt(
    plaintext: string,
    publicKeyPem: string,
    hash?: 'SHA-256' | 'SHA-512',
    onProgress?: ProgressCallback
  ): Promise<string>;

  rsaDecrypt(
    ciphertextB64: string,
    privateKeyPem: string,
    hash?: 'SHA-256' | 'SHA-512',
    onProgress?: ProgressCallback
  ): Promise<string>;

  rsaSign(
    plaintext: string,
    privateKeyPem: string,
    hash?: 'SHA-256' | 'SHA-512',
    onProgress?: ProgressCallback
  ): Promise<string>;

  rsaVerify(
    plaintext: string,
    signatureB64: string,
    publicKeyPem: string,
    hash?: 'SHA-256' | 'SHA-512',
    onProgress?: ProgressCallback
  ): Promise<boolean>;

  ecdsaGenerateKeyPair(
    curve?: 'P-256' | 'P-384' | 'P-521',
    onProgress?: ProgressCallback
  ): Promise<{ publicKeyPem: string; privateKeyPem: string }>;

  ecdhGenerateKeyPair(
    curve?: 'P-256' | 'P-384' | 'P-521',
    onProgress?: ProgressCallback
  ): Promise<{ publicKeyPem: string; privateKeyPem: string }>;

  ecdsaSign(
    plaintext: string,
    privateKeyPem: string,
    curve?: 'P-256' | 'P-384' | 'P-521',
    onProgress?: ProgressCallback
  ): Promise<string>;

  ecdsaVerify(
    plaintext: string,
    signatureB64: string,
    publicKeyPem: string,
    curve?: 'P-256' | 'P-384' | 'P-521',
    onProgress?: ProgressCallback
  ): Promise<boolean>;

  ecdhDeriveSecret(
    partyAPrivateKeyPem: string,
    partyBPublicKeyPem: string,
    curve?: 'P-256' | 'P-384' | 'P-521',
    onProgress?: ProgressCallback
  ): Promise<string>;

  pbkdf2Derive(
    password: string,
    salt: string,
    iterations?: number,
    hash?: string,
    lengthBits?: number,
    onProgress?: ProgressCallback
  ): Promise<{ hex: string; base64: string }>;

  hkdfDerive(
    ikm: string,
    salt: string,
    info: string,
    hash?: string,
    lengthBits?: number,
    onProgress?: ProgressCallback
  ): Promise<{ hex: string; base64: string }>;

  // PDF Tasks
  exportPdfEditor(
    file: ArrayBuffer,
    pagesState: any[],
    annotations: any[],
    onProgress?: ProgressCallback
  ): Promise<Uint8Array>;

  getPdfPageCount(file: ArrayBuffer): Promise<number>;

  rotatePdf(
    file: ArrayBuffer,
    rotateAll: boolean,
    allAngle: number,
    pageAngles: number[],
    onProgress?: ProgressCallback
  ): Promise<Uint8Array>;

  watermarkPdf(
    file: ArrayBuffer,
    options: {
      type: "text" | "image";
      text?: string;
      imageBytes?: ArrayBuffer;
      imageType?: string;
      opacity: number;
      fontSize: number;
      colorHex: string;
      angle: number;
      scale: number;
    },
    onProgress?: ProgressCallback
  ): Promise<Uint8Array>;

  mergePdfs(
    files: (Blob | ArrayBuffer)[], 
    onProgress?: ProgressCallback
  ): Promise<Uint8Array>;

  compressPdf(
    file: ArrayBuffer,
    level: 'low' | 'medium' | 'high',
    onProgress?: ProgressCallback
  ): Promise<Uint8Array>;

  splitPdf(
    file: ArrayBuffer,
    splitAll: boolean,
    rangesStr: string,
    onProgress?: ProgressCallback
  ): Promise<{ data: Uint8Array; ext: string; count: number }>;

  convertImagesToPdf(
    images: Array<{ buffer: ArrayBuffer, mime: string }>,
    pageSize: "a4" | "letter" | "fit",
    onProgress?: ProgressCallback
  ): Promise<Uint8Array>;

  convertAudio(
    file: ArrayBuffer,
    mimeType: string,
    targetFormat: string,
    onProgress?: ProgressCallback
  ): Promise<Uint8Array>;

  ocrExtract(
    file: ArrayBuffer,
    mimeType: string,
    onProgress?: ProgressCallback
  ): Promise<string>;

  lockPdf(
    file: ArrayBuffer,
    userPassword: string,
    ownerPassword?: string,
    onProgress?: ProgressCallback
  ): Promise<Uint8Array>;

  unlockPdf(
    file: ArrayBuffer,
    password: string,
    onProgress?: ProgressCallback
  ): Promise<Uint8Array>;

  addPageNumbersToPdf(
    file: ArrayBuffer,
    options: {
      startNum: number;
      prefix: string;
      suffix: string;
      position: "bottom-center" | "bottom-right" | "bottom-left" | "top-center" | "top-right" | "top-left";
      fontSize: number;
      colorHex: string;
    },
    onProgress?: ProgressCallback
  ): Promise<Uint8Array>;

  adjustPdfLayout(
    file: ArrayBuffer,
    options: {
      action: 'crop' | 'resize' | 'margin';
      pages: number[] | 'all';
      // For crop
      cropBox?: { x: number; y: number; width: number; height: number }; // Percentage 0-100 or Points? Let's use points or percentages. Let's pass points.
      // For resize
      targetSize?: [number, number]; // [width, height]
      scaleToFit?: boolean;
      // For margin
      margins?: { top: number; right: number; bottom: number; left: number };
    },
    onProgress?: ProgressCallback
  ): Promise<Uint8Array>;

  getPdfMetadata(file: ArrayBuffer): Promise<Record<string, string | Date | undefined>>;
  
  setPdfMetadata(
    file: ArrayBuffer,
    metadata: {
      title?: string | null;
      author?: string | null;
      subject?: string | null;
      keywords?: string[] | null;
      producer?: string | null;
      creator?: string | null;
      clearAll?: boolean;
    },
    onProgress?: ProgressCallback
  ): Promise<Uint8Array>;

  getPdfBookmarks(
    file: ArrayBuffer,
    onProgress?: ProgressCallback
  ): Promise<any[]>;

  extractPdfAttachments(
    file: ArrayBuffer,
    onProgress?: ProgressCallback
  ): Promise<Array<{ filename: string; content: Uint8Array }>>;

  // Image Tasks (Standard)
  compressImage(
    file: ArrayBuffer,
    mimeType: string,
    format: string,
    quality: number,
    onProgress?: ProgressCallback
  ): Promise<Uint8Array>;

  resizeImage(
    file: ArrayBuffer,
    width: number,
    height: number,
    format: "image/jpeg" | "image/png" | "image/webp" | "image/avif" | "image/bmp",
    quality: number,
    onProgress?: ProgressCallback
  ): Promise<Uint8Array>;

  removeBackground(
    file: ArrayBuffer,
    bgColor: string,
    tolerance: number,
    onProgress?: ProgressCallback
  ): Promise<Uint8Array>;

  // Image Tasks (Specialized Batch)
  compressImageBatch(
    file: ArrayBuffer,
    mimeType: string,
    settings: CompressionSettings,
    onProgress?: (p: any) => void
  ): Promise<Uint8Array>;

  extractColorPalette(
    file: ArrayBuffer,
    k: number,
    onProgress?: ProgressCallback
  ): Promise<string[]>;

  // Developer Tasks
  minifyCode(
    code: string,
    lang: "css" | "js" | "html",
    onProgress?: ProgressCallback
  ): Promise<{ code: string; error: { type: string; message: string } | null }>;

  computeDiff(
    textA: string,
    textB: string,
    onProgress?: ProgressCallback
  ): Promise<DiffLine[]>;

  processYaml(
    input: string,
    action: 'validate' | 'json_to_yaml' | 'yaml_to_json'
  ): Promise<{ result?: string; error?: string }>;

  processJson(
    input: string,
    mode: "beautify" | "minify",
    indent: number | "tab"
  ): Promise<{ output: string; parsed: any; error: any }>;

  createZip(
    files: Record<string, Uint8Array>,
    onProgress?: ProgressCallback
  ): Promise<Uint8Array>;

  // Media Tasks
  encodeMp3(
    left: Float32Array,
    right: Float32Array | null,
    sampleRate: number,
    onProgress?: ProgressCallback
  ): Promise<Uint8Array>;
  encodeWav(
    channels: Float32Array[],
    sampleRate: number,
    onProgress?: ProgressCallback
  ): Promise<Uint8Array>;
  createGif(
    frames: ArrayBuffer[],
    width: number,
    height: number,
    delay: number,
    onProgress?: ProgressCallback
  ): Promise<Uint8Array>;

  // Math Tasks
  evaluateMath(expr: string): Promise<number>;

  // EMI Tasks
  calculateEmiSchedule(inputs: EmiInputs): Promise<EmiResult>;

  // Document Tasks
  extractRawTextFromDocx(
    file: ArrayBuffer,
    onProgress?: ProgressCallback
  ): Promise<string>;

  convertDocxToPdf(
    file: ArrayBuffer,
    onProgress?: ProgressCallback
  ): Promise<Uint8Array>;

  extractImagesFromPdf(
    file: ArrayBuffer,
    onProgress?: ProgressCallback
  ): Promise<Array<{
    arrayBuffer: ArrayBuffer;
    width: number;
    height: number;
    page: number;
    index: number;
  }>>;

  extractTextFromPdf(
    file: ArrayBuffer,
    onProgress?: ProgressCallback
  ): Promise<string>;

  generateDocxFromText(
    text: string,
    onProgress?: ProgressCallback
  ): Promise<Uint8Array>;

  // Numeral Tasks
  convertNumeral(
    input: string,
    inputFormat: string,
    targetFormat: string,
    extraOptions?: any
  ): Promise<{ value: string; error: string }>;

  detectNumeralFormat(input: string): Promise<{ format: string; confidence: string }>;

  // Grammar Tasks
  checkGrammar(
    text: string,
    ignoredWords: string[],
    tone: string,
    onProgress?: ProgressCallback
  ): Promise<{
    errors: Array<{
      id: string;
      message: string;
      replacements: string[];
      offset: number;
      length: number;
      type: 'spelling' | 'grammar' | 'style' | 'readability';
    }>;
    stats: {
      words: number;
      characters: number;
      sentences: number;
      readabilityScore: number;
      readingTimeMs: number;
    };
  }>;
  applyImageFilter(file: ArrayBuffer, mimeType: string, filter: string, intensity: number, onProgress?: ProgressCallback): Promise<ArrayBuffer>;
  computePerceptualHash(file: ArrayBuffer, mimeType: string, onProgress?: ProgressCallback): Promise<string>;
  rotateImageStandard(file: ArrayBuffer, mimeType: string, onProgress?: ProgressCallback): Promise<ArrayBuffer>;
  generateSpriteSheet(file: ArrayBuffer, mimeType: string, onProgress?: ProgressCallback): Promise<ArrayBuffer>;
  optimizeSvg(file: ArrayBuffer, mimeType: string, onProgress?: ProgressCallback): Promise<string>;
  generateHistogram(file: ArrayBuffer, mimeType: string, onProgress?: ProgressCallback): Promise<number[]>;
  simulateColorBlindness(file: ArrayBuffer, mimeType: string, type: string, onProgress?: ProgressCallback): Promise<ArrayBuffer>;
  watermarkImage(file: ArrayBuffer, mimeType: string, options: any, onProgress?: ProgressCallback): Promise<ArrayBuffer>;
  parseMarkdown(text: string): Promise<string>;
  processBase64File(file: ArrayBuffer, mimeType: string, action: string, onProgress?: ProgressCallback): Promise<string | ArrayBuffer>;
  removeImageMetadata(file: ArrayBuffer, mimeType: string, onProgress?: ProgressCallback): Promise<ArrayBuffer>;
  cropImageCenter(file: ArrayBuffer, mimeType: string, width: number, height: number, onProgress?: ProgressCallback): Promise<ArrayBuffer>;
}
