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
    return workerOrchestrator.run("mergePdfs", [files], undefined, onProgress, abortSignal);
  }

  async compressImage(
    file: ArrayBuffer, 
    format: "image/jpeg" | "image/png" | "image/webp",
    quality: number,
    onProgress?: ProgressCallback,
    abortSignal?: AbortSignal
  ): Promise<Uint8Array> {
    return workerOrchestrator.run("compressImage", [file, format, quality], [file], onProgress, abortSignal);
  }

  async resizeImage(
    file: ArrayBuffer,
    width: number,
    height: number,
    format: "image/jpeg" | "image/png" | "image/webp",
    quality: number,
    onProgress?: ProgressCallback,
    abortSignal?: AbortSignal
  ): Promise<Uint8Array> {
    return workerOrchestrator.run("resizeImage", [file, width, height, format, quality], [file], onProgress, abortSignal);
  }

  async minifyCode(
    code: string,
    lang: "css" | "js" | "html",
    onProgress?: ProgressCallback,
    abortSignal?: AbortSignal
  ): Promise<string> {
    return workerOrchestrator.run("minifyCode", [code, lang], undefined, onProgress, abortSignal);
  }

  async computeDiff(
    textA: string,
    textB: string,
    onProgress?: ProgressCallback,
    abortSignal?: AbortSignal
  ): Promise<any[]> {
    return workerOrchestrator.run("computeDiff", [textA, textB], undefined, onProgress, abortSignal);
  }

  terminateAll() {
    workerOrchestrator.terminateAll();
  }
}

export const workerManager = new WorkerManager();
