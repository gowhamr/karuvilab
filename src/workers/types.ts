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
  
  // PDF Tasks
  mergePdfs(
    files: (Blob | ArrayBuffer)[], 
    onProgress?: ProgressCallback
  ): Promise<Uint8Array>;

  // Image Tasks (Standard)
  compressImage(
    file: ArrayBuffer, 
    format: "image/jpeg" | "image/png" | "image/webp" | "image/avif" | "image/bmp",
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
    settings: CompressionSettings,
    onProgress?: ProgressCallback
  ): Promise<Uint8Array>;

  // Developer Tasks
  minifyCode(
    code: string,
    lang: "css" | "js" | "html",
    onProgress?: ProgressCallback
  ): Promise<string>;

  computeDiff(
    textA: string,
    textB: string,
    onProgress?: ProgressCallback
  ): Promise<DiffLine[]>;

  createZip(
    files: Record<string, Uint8Array>,
    onProgress?: ProgressCallback
  ): Promise<Uint8Array>;

  // EMI Tasks
  calculateEmiSchedule(inputs: EmiInputs): Promise<EmiResult>;
}
