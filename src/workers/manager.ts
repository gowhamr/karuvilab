import { WorkerAPI, ProgressCallback, EmiInputs, EmiResult } from "./types";
import { workerOrchestrator } from "../engine/workers/WorkerOrchestrator";

class WorkerManager {
  isSupported() {
    return typeof Worker !== "undefined";
  }

  async calculateEmiSchedule(inputs: EmiInputs): Promise<EmiResult> {
    return workerOrchestrator.run<EmiResult>("calculateEmiSchedule", [inputs]);
  }

  async generateHashes(
    text: string, 
    algos: string[], 
    encoding?: 'hex' | 'base64',
    onProgress?: ProgressCallback,
    abortSignal?: AbortSignal
  ): Promise<Record<string, string>> {
    return workerOrchestrator.run("generateHashes", [text, algos, encoding], undefined, onProgress, abortSignal);
  }

  async generateFileHash(
    file: ArrayBuffer,
    algo: string,
    encoding?: 'hex' | 'base64',
    onProgress?: ProgressCallback,
    abortSignal?: AbortSignal
  ): Promise<string> {
    return workerOrchestrator.run("generateFileHash", [file, algo, encoding], [file], onProgress, abortSignal);
  }

  async generateHmac(
    text: string,
    key: string,
    algo: string,
    encoding?: 'hex' | 'base64',
    onProgress?: ProgressCallback,
    abortSignal?: AbortSignal
  ): Promise<string> {
    return workerOrchestrator.run("generateHmac", [text, key, algo, encoding], undefined, onProgress, abortSignal);
  }

  async generateFileHmac(
    file: ArrayBuffer,
    key: string,
    algo: string,
    encoding?: 'hex' | 'base64',
    onProgress?: ProgressCallback,
    abortSignal?: AbortSignal
  ): Promise<string> {
    return workerOrchestrator.run("generateFileHmac", [file, key, algo, encoding], [file], onProgress, abortSignal);
  }

  async mergePdfs(
    files: (Blob | ArrayBuffer)[], 
    onProgress?: ProgressCallback,
    abortSignal?: AbortSignal
  ): Promise<Uint8Array> {
    // PDF merge is idempotent: safe to retry if worker crashes.
    return workerOrchestrator.run("mergePdfs", [files], undefined, onProgress, abortSignal, true, 2);
  }

  async compressImage(
    file: ArrayBuffer, 
    format: "image/jpeg" | "image/png" | "image/webp" | "image/avif" | "image/bmp",
    quality: number,
    onProgress?: ProgressCallback,
    abortSignal?: AbortSignal
  ): Promise<Uint8Array> {
    return workerOrchestrator.run("compressImage", [file, format, quality], [file], onProgress, abortSignal, true, 2);
  }

  async resizeImage(
    file: ArrayBuffer,
    width: number,
    height: number,
    format: "image/jpeg" | "image/png" | "image/webp" | "image/avif" | "image/bmp",
    quality: number,
    onProgress?: ProgressCallback,
    abortSignal?: AbortSignal
  ): Promise<Uint8Array> {
    return workerOrchestrator.run("resizeImage", [file, width, height, format, quality], [file], onProgress, abortSignal, true, 2);
  }

  async removeBackground(
    file: ArrayBuffer,
    bgColor: string,
    tolerance: number,
    onProgress?: ProgressCallback,
    abortSignal?: AbortSignal
  ): Promise<Uint8Array> {
    return workerOrchestrator.run("removeBackground", [file, bgColor, tolerance], [file], onProgress, abortSignal, true, 2);
  }

  async minifyCode(
    code: string,
    lang: "css" | "js" | "html",
    onProgress?: ProgressCallback,
    abortSignal?: AbortSignal
  ): Promise<{ code: string; error: { type: string; message: string } | null }> {
    return workerOrchestrator.run("minifyCode", [code, lang], undefined, onProgress, abortSignal, true, 2);
  }

  async processJson(
    input: string,
    mode: "beautify" | "minify",
    indent: number | "tab",
    abortSignal?: AbortSignal
  ): Promise<{ output: string; parsed: any; error: any }> {
    return workerOrchestrator.run("processJson", [input, mode, indent], undefined, undefined, abortSignal);
  }

  async computeDiff(
    textA: string,
    textB: string,
    onProgress?: ProgressCallback,
    abortSignal?: AbortSignal
  ): Promise<any[]> {
    return workerOrchestrator.run("computeDiff", [textA, textB], undefined, onProgress, abortSignal, true, 2);
  }

  async runZip(
    files: Record<string, Uint8Array>,
    onProgress?: ProgressCallback,
    abortSignal?: AbortSignal
  ): Promise<Uint8Array> {
    return workerOrchestrator.run("createZip", [files], undefined, onProgress, abortSignal, true, 2);
  }

  async encodeMp3(
    left: Int16Array,
    right: Int16Array | null,
    sampleRate: number,
    onProgress?: ProgressCallback,
    abortSignal?: AbortSignal
  ): Promise<Uint8Array> {
    const transfer = right ? [left.buffer, right.buffer] : [left.buffer];
    return workerOrchestrator.run("encodeMp3", [left, right, sampleRate], transfer, onProgress, abortSignal, true, 3);
  }

  async createGif(
    frames: ArrayBuffer[],
    width: number,
    height: number,
    delay: number,
    onProgress?: ProgressCallback,
    abortSignal?: AbortSignal
  ): Promise<Uint8Array> {
    return workerOrchestrator.run("createGif", [frames, width, height, delay], frames, onProgress, abortSignal, true, 3);
  }

  terminateAll() {
    workerOrchestrator.terminateAll();
  }
}

export const workerManager = new WorkerManager();
