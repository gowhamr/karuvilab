import { WorkerAPI, ProgressCallback, EmiInputs, EmiResult } from "./types";
import { workerOrchestrator } from "../engine/workers/WorkerOrchestrator";

class WorkerManager {
  isSupported() {
    return typeof Worker !== "undefined";
  }

  async run<K extends keyof WorkerAPI>(
    method: K,
    args: Parameters<WorkerAPI[K]>,
    options?: { signal?: AbortSignal; onProgress?: ProgressCallback }
  ): Promise<ReturnType<WorkerAPI[K]>> {
    return workerOrchestrator.run(
      method,
      args as unknown[],
      undefined,
      options?.onProgress,
      options?.signal
    ) as Promise<ReturnType<WorkerAPI[K]>>;
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

  async getPdfPageCount(file: ArrayBuffer): Promise<number> {
    return workerOrchestrator.run("getPdfPageCount", [file]);
  }

  async exportPdfEditor(
    file: ArrayBuffer,
    pagesState: any[],
    annotations: any[],
    onProgress?: ProgressCallback,
    abortSignal?: AbortSignal
  ): Promise<Uint8Array> {
    return workerOrchestrator.run("exportPdfEditor", [file, pagesState, annotations], [file], onProgress, abortSignal, true, 2);
  }

  async rotatePdf(
    file: ArrayBuffer,
    rotateAll: boolean,
    allAngle: number,
    pageAngles: number[],
    onProgress?: ProgressCallback,
    abortSignal?: AbortSignal
  ): Promise<Uint8Array> {
    return workerOrchestrator.run("rotatePdf", [file, rotateAll, allAngle, pageAngles], [file], onProgress, abortSignal, true, 2);
  }

  async watermarkPdf(
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
    onProgress?: ProgressCallback,
    abortSignal?: AbortSignal
  ): Promise<Uint8Array> {
    const transfers: ArrayBuffer[] = [file];
    if (options.imageBytes) transfers.push(options.imageBytes);
    return workerOrchestrator.run("watermarkPdf", [file, options], transfers, onProgress, abortSignal, true, 2);
  }

  async mergePdfs(
    files: (Blob | ArrayBuffer)[], 
    onProgress?: ProgressCallback,
    abortSignal?: AbortSignal
  ): Promise<Uint8Array> {
    // PDF merge is idempotent: safe to retry if worker crashes.
    return workerOrchestrator.run("mergePdfs", [files], undefined, onProgress, abortSignal, true, 2);
  }

  async compressPdf(
    file: ArrayBuffer,
    level: 'low' | 'medium' | 'high' = 'medium',
    onProgress?: ProgressCallback,
    abortSignal?: AbortSignal
  ): Promise<Uint8Array> {
    return workerOrchestrator.run("compressPdf", [file, level], [file], onProgress, abortSignal, true, 2);
  }

  async splitPdf(
    file: ArrayBuffer,
    splitAll: boolean,
    rangesStr: string,
    onProgress?: ProgressCallback,
    abortSignal?: AbortSignal
  ): Promise<{ data: Uint8Array; ext: string; count: number }> {
    return workerOrchestrator.run("splitPdf", [file, splitAll, rangesStr], [file], onProgress, abortSignal, true, 2);
  }

  async convertImagesToPdf(
    images: Array<{ buffer: ArrayBuffer, mime: string }>,
    pageSize: "a4" | "letter" | "fit",
    onProgress?: ProgressCallback,
    abortSignal?: AbortSignal
  ): Promise<Uint8Array> {
    const buffers = images.map(i => i.buffer);
    return workerOrchestrator.run("convertImagesToPdf", [images, pageSize], buffers, onProgress, abortSignal, true, 2);
  }

  async lockPdf(
    file: ArrayBuffer,
    userPassword: string,
    ownerPassword?: string,
    onProgress?: ProgressCallback,
    abortSignal?: AbortSignal
  ): Promise<Uint8Array> {
    return workerOrchestrator.run("lockPdf", [file, userPassword, ownerPassword], [file], onProgress, abortSignal, true, 2);
  }

  async unlockPdf(
    file: ArrayBuffer,
    password: string,
    onProgress?: ProgressCallback,
    abortSignal?: AbortSignal
  ): Promise<Uint8Array> {
    return workerOrchestrator.run("unlockPdf", [file, password], [file], onProgress, abortSignal, true, 2);
  }

  async addPageNumbersToPdf(
    file: ArrayBuffer,
    options: {
      startNum: number;
      prefix: string;
      suffix: string;
      position: "bottom-center" | "bottom-right" | "bottom-left" | "top-center" | "top-right" | "top-left";
      fontSize: number;
      colorHex: string;
    },
    onProgress?: ProgressCallback,
    abortSignal?: AbortSignal
  ): Promise<Uint8Array> {
    return workerOrchestrator.run("addPageNumbersToPdf", [file, options], [file], onProgress, abortSignal, true, 2);
  }

  async adjustPdfLayout(
    file: ArrayBuffer,
    options: any,
    onProgress?: ProgressCallback,
    abortSignal?: AbortSignal
  ): Promise<Uint8Array> {
    return workerOrchestrator.run("adjustPdfLayout", [file, options], [file], onProgress, abortSignal, true, 2);
  }

  async getPdfMetadata(file: ArrayBuffer, abortSignal?: AbortSignal): Promise<Record<string, string | Date | undefined>> {
    return workerOrchestrator.run("getPdfMetadata", [file], [file], undefined, abortSignal, true, 2);
  }

  async setPdfMetadata(
    file: ArrayBuffer,
    metadata: any,
    onProgress?: ProgressCallback,
    abortSignal?: AbortSignal
  ): Promise<Uint8Array> {
    return workerOrchestrator.run("setPdfMetadata", [file, metadata], [file], onProgress, abortSignal, true, 2);
  }

  async getPdfBookmarks(
    file: ArrayBuffer,
    onProgress?: ProgressCallback,
    abortSignal?: AbortSignal
  ): Promise<any[]> {
    return workerOrchestrator.run("getPdfBookmarks", [file], [file], onProgress, abortSignal, true, 2);
  }

  async extractPdfAttachments(
    file: ArrayBuffer,
    onProgress?: ProgressCallback,
    abortSignal?: AbortSignal
  ): Promise<Array<{ filename: string; content: Uint8Array }>> {
    return workerOrchestrator.run("extractPdfAttachments", [file], [file], onProgress, abortSignal, true, 2);
  }

  async extractTextFromPdf(
    file: ArrayBuffer,
    onProgress?: ProgressCallback,
    abortSignal?: AbortSignal
  ): Promise<string> {
    return workerOrchestrator.run("extractTextFromPdf", [file], [file], onProgress, abortSignal, true, 2);
  }

  async compressImage(
    file: ArrayBuffer,
    mimeType: string,
    format: string,
    quality: number,
    onProgress?: (p: any) => void,
    abortSignal?: AbortSignal
  ): Promise<Uint8Array> {
    return workerOrchestrator.run("compressImage", [file, mimeType, format, quality], [file], onProgress, abortSignal, true, 2);
  }

  async resizeImage(
    file: ArrayBuffer,
    width: number,
    height: number,
    mode: "fit" | "fill" | "stretch",
    format: "image/jpeg" | "image/png" | "image/webp" | "image/avif" | "image/bmp",
    quality: number,
    onProgress?: ProgressCallback,
    abortSignal?: AbortSignal
  ): Promise<Uint8Array> {
    return workerOrchestrator.run("resizeImage", [file, width, height, mode, format, quality], [file], onProgress, abortSignal, true, 2);
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
    const transferList = Object.values(files).map(v => v.buffer);
    return workerOrchestrator.run("createZip", [files], transferList, onProgress, abortSignal, true, 2);
  }

  async encodeMp3(
    left: Float32Array,
    right: Float32Array | null,
    sampleRate: number,
    onProgress?: ProgressCallback,
    abortSignal?: AbortSignal
  ): Promise<Uint8Array> {
    const transfer = right ? [left.buffer, right.buffer] : [left.buffer];
    return workerOrchestrator.run("encodeMp3", [left, right, sampleRate], transfer, onProgress, abortSignal, true, 3);
  }

  async encodeWav(
    channels: Float32Array[],
    sampleRate: number,
    onProgress?: ProgressCallback,
    abortSignal?: AbortSignal
  ): Promise<Uint8Array> {
    const transfers = channels.map(c => c.buffer);
    return workerOrchestrator.run("encodeWav", [channels, sampleRate], transfers, onProgress, abortSignal, true, 3);
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

  async checkGrammar(
    text: string,
    ignoredWords: string[],
    tone: string,
    onProgress?: ProgressCallback,
    abortSignal?: AbortSignal
  ): Promise<any> {
    return workerOrchestrator.run("checkGrammar", [text, ignoredWords, tone], undefined, onProgress, abortSignal);
  }

  terminateAll() {
    workerOrchestrator.terminateAll();
  }
}

export const workerManager = new WorkerManager();
