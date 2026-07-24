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
    return workerOrchestrator.dispatch(
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
    return workerOrchestrator.dispatch("generateHashes", [text, algos, encoding], undefined, onProgress, abortSignal);
  }

  async generateFileHash(
    file: ArrayBuffer,
    algo: string,
    encoding?: 'hex' | 'base64',
    onProgress?: ProgressCallback,
    abortSignal?: AbortSignal
  ): Promise<string> {
    return workerOrchestrator.dispatch("generateFileHash", [file, algo, encoding], [file], onProgress, abortSignal);
  }

  async generateHmac(
    text: string,
    key: string,
    algo: string,
    encoding?: 'hex' | 'base64',
    onProgress?: ProgressCallback,
    abortSignal?: AbortSignal
  ): Promise<string> {
    return workerOrchestrator.dispatch("generateHmac", [text, key, algo, encoding], undefined, onProgress, abortSignal);
  }

  async generateFileHmac(
    file: ArrayBuffer,
    key: string,
    algo: string,
    encoding?: 'hex' | 'base64',
    onProgress?: ProgressCallback,
    abortSignal?: AbortSignal
  ): Promise<string> {
    return workerOrchestrator.dispatch("generateFileHmac", [file, key, algo, encoding], [file], onProgress, abortSignal);
  }

  async getPdfPageCount(file: ArrayBuffer): Promise<number> {
    return workerOrchestrator.dispatch("getPdfPageCount", [file]);
  }

  async exportPdfEditor(
    file: ArrayBuffer,
    pagesState: any[],
    annotations: any[],
    onProgress?: ProgressCallback,
    abortSignal?: AbortSignal
  ): Promise<Uint8Array> {
    return workerOrchestrator.dispatch("exportPdfEditor", [file, pagesState, annotations], [file], onProgress, abortSignal, true, 2);
  }

  async rotatePdf(
    file: ArrayBuffer,
    rotateAll: boolean,
    allAngle: number,
    pageAngles: number[],
    onProgress?: ProgressCallback,
    abortSignal?: AbortSignal
  ): Promise<Uint8Array> {
    return workerOrchestrator.dispatch("rotatePdf", [file, rotateAll, allAngle, pageAngles], [file], onProgress, abortSignal, true, 2);
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
    return workerOrchestrator.dispatch("watermarkPdf", [file, options], transfers, onProgress, abortSignal, true, 2);
  }

  async mergePdfs(
    files: (Blob | ArrayBuffer)[], 
    onProgress?: ProgressCallback,
    abortSignal?: AbortSignal
  ): Promise<Uint8Array> {
    // PDF merge is idempotent: safe to retry if worker crashes.
    return workerOrchestrator.dispatch("mergePdfs", [files], undefined, onProgress, abortSignal, true, 2);
  }

  async compressPdf(
    file: ArrayBuffer,
    level: 'low' | 'medium' | 'high' = 'medium',
    onProgress?: ProgressCallback,
    abortSignal?: AbortSignal
  ): Promise<Uint8Array> {
    return workerOrchestrator.dispatch("compressPdf", [file, level], [file], onProgress, abortSignal, true, 2);
  }

  async splitPdf(
    file: ArrayBuffer,
    splitAll: boolean,
    rangesStr: string,
    onProgress?: ProgressCallback,
    abortSignal?: AbortSignal
  ): Promise<{ data: Uint8Array; ext: string; count: number }> {
    return workerOrchestrator.dispatch("splitPdf", [file, splitAll, rangesStr], [file], onProgress, abortSignal, true, 2);
  }

  async convertImagesToPdf(
    images: Array<{ buffer: ArrayBuffer, mime: string }>,
    pageSize: "a4" | "letter" | "fit",
    onProgress?: ProgressCallback,
    abortSignal?: AbortSignal
  ): Promise<Uint8Array> {
    const buffers = images.map(i => i.buffer);
    return workerOrchestrator.dispatch("convertImagesToPdf", [images, pageSize], buffers, onProgress, abortSignal, true, 2);
  }

  async convertAudio(
    file: ArrayBuffer,
    mimeType: string,
    targetFormat: string,
    onProgress?: ProgressCallback,
    abortSignal?: AbortSignal
  ): Promise<Uint8Array> {
    return workerOrchestrator.dispatch("convertAudio", [file, mimeType, targetFormat], [file], onProgress, abortSignal);
  }

  async ocrExtract(
    file: ArrayBuffer,
    mimeType: string,
    onProgress?: ProgressCallback,
    abortSignal?: AbortSignal
  ): Promise<string> {
    return workerOrchestrator.dispatch("ocrExtract", [file, mimeType], [file], onProgress, abortSignal, true, 5);
  }

  async lockPdf(
    file: ArrayBuffer,
    userPassword: string,
    ownerPassword?: string,
    onProgress?: ProgressCallback,
    abortSignal?: AbortSignal
  ): Promise<Uint8Array> {
    return workerOrchestrator.dispatch("lockPdf", [file, userPassword, ownerPassword], [file], onProgress, abortSignal, true, 2);
  }

  async unlockPdf(
    file: ArrayBuffer,
    password: string,
    onProgress?: ProgressCallback,
    abortSignal?: AbortSignal
  ): Promise<Uint8Array> {
    return workerOrchestrator.dispatch("unlockPdf", [file, password], [file], onProgress, abortSignal, true, 2);
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
    return workerOrchestrator.dispatch("addPageNumbersToPdf", [file, options], [file], onProgress, abortSignal, true, 2);
  }

  async adjustPdfLayout(
    file: ArrayBuffer,
    options: any,
    onProgress?: ProgressCallback,
    abortSignal?: AbortSignal
  ): Promise<Uint8Array> {
    return workerOrchestrator.dispatch("adjustPdfLayout", [file, options], [file], onProgress, abortSignal, true, 2);
  }

  async getPdfMetadata(file: ArrayBuffer, abortSignal?: AbortSignal): Promise<Record<string, string | Date | undefined>> {
    return workerOrchestrator.dispatch("getPdfMetadata", [file], [file], undefined, abortSignal, true, 2);
  }

  async setPdfMetadata(
    file: ArrayBuffer,
    metadata: any,
    onProgress?: ProgressCallback,
    abortSignal?: AbortSignal
  ): Promise<Uint8Array> {
    return workerOrchestrator.dispatch("setPdfMetadata", [file, metadata], [file], onProgress, abortSignal, true, 2);
  }

  async getPdfBookmarks(
    file: ArrayBuffer,
    onProgress?: ProgressCallback,
    abortSignal?: AbortSignal
  ): Promise<any[]> {
    return workerOrchestrator.dispatch("getPdfBookmarks", [file], [file], onProgress, abortSignal, true, 2);
  }

  async extractPdfAttachments(
    file: ArrayBuffer,
    onProgress?: ProgressCallback,
    abortSignal?: AbortSignal
  ): Promise<Array<{ filename: string; content: Uint8Array }>> {
    return workerOrchestrator.dispatch("extractPdfAttachments", [file], [file], onProgress, abortSignal, true, 2);
  }

  async extractTextFromPdf(
    file: ArrayBuffer,
    onProgress?: ProgressCallback,
    abortSignal?: AbortSignal
  ): Promise<string> {
    return workerOrchestrator.dispatch("extractTextFromPdf", [file], [file], onProgress, abortSignal, true, 2);
  }

  async compressImage(
    file: ArrayBuffer,
    mimeType: string,
    format: string,
    quality: number,
    onProgress?: (p: any) => void,
    abortSignal?: AbortSignal
  ): Promise<Uint8Array> {
    return workerOrchestrator.dispatch("compressImage", [file, mimeType, format, quality], [file], onProgress, abortSignal, true, 2);
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
    return workerOrchestrator.dispatch("resizeImage", [file, width, height, mode, format, quality], [file], onProgress, abortSignal, true, 2);
  }

  async removeBackground(
    file: ArrayBuffer,
    bgColor: string,
    tolerance: number,
    onProgress?: ProgressCallback,
    abortSignal?: AbortSignal
  ): Promise<Uint8Array> {
    return workerOrchestrator.dispatch("removeBackground", [file, bgColor, tolerance], [file], onProgress, abortSignal, true, 2);
  }

  async minifyCode(
    code: string,
    lang: "css" | "js" | "html",
    onProgress?: ProgressCallback,
    abortSignal?: AbortSignal
  ): Promise<{ code: string; error: { type: string; message: string } | null }> {
    return workerOrchestrator.dispatch("minifyCode", [code, lang], undefined, onProgress, abortSignal, true, 2);
  }

  async processJson(
    input: string,
    mode: "beautify" | "minify",
    indent: number | "tab",
    abortSignal?: AbortSignal
  ): Promise<{ output: string; parsed: any; error: any }> {
    return workerOrchestrator.dispatch("processJson", [input, mode, indent], undefined, undefined, abortSignal);
  }

  async computeDiff(
    textA: string,
    textB: string,
    onProgress?: ProgressCallback,
    abortSignal?: AbortSignal
  ): Promise<any[]> {
    return workerOrchestrator.dispatch("computeDiff", [textA, textB], undefined, onProgress, abortSignal, true, 2);
  }

  async runZip(
    files: Record<string, Uint8Array>,
    onProgress?: ProgressCallback,
    abortSignal?: AbortSignal
  ): Promise<Uint8Array> {
    const transferList = Object.values(files).map(v => v.buffer);
    return workerOrchestrator.dispatch("createZip", [files], transferList, onProgress, abortSignal, true, 2);
  }

  async encodeMp3(
    left: Float32Array,
    right: Float32Array | null,
    sampleRate: number,
    onProgress?: ProgressCallback,
    abortSignal?: AbortSignal
  ): Promise<Uint8Array> {
    const transfer = right ? [left.buffer, right.buffer] : [left.buffer];
    return workerOrchestrator.dispatch("encodeMp3", [left, right, sampleRate], transfer, onProgress, abortSignal, true, 3);
  }

  async encodeWav(
    channels: Float32Array[],
    sampleRate: number,
    onProgress?: ProgressCallback,
    abortSignal?: AbortSignal
  ): Promise<Uint8Array> {
    const transfers = channels.map(c => c.buffer);
    return workerOrchestrator.dispatch("encodeWav", [channels, sampleRate], transfers, onProgress, abortSignal, true, 3);
  }

  async createGif(
    frames: ArrayBuffer[],
    width: number,
    height: number,
    delay: number,
    onProgress?: ProgressCallback,
    abortSignal?: AbortSignal
  ): Promise<Uint8Array> {
    return workerOrchestrator.dispatch("createGif", [frames, width, height, delay], frames, onProgress, abortSignal, true, 3);
  }

  async checkGrammar(
    text: string,
    ignoredWords: string[],
    tone: string,
    onProgress?: ProgressCallback,
    abortSignal?: AbortSignal
  ): Promise<any> {
    return workerOrchestrator.dispatch("checkGrammar", [text, ignoredWords, tone], undefined, onProgress, abortSignal);
  }

  async applyImageFilter(file: ArrayBuffer, mimeType: string, filter: string, intensity: number, onProgress?: ProgressCallback, abortSignal?: AbortSignal): Promise<ArrayBuffer> {
    return workerOrchestrator.dispatch("applyImageFilter", [file, mimeType, filter, intensity], [file], onProgress, abortSignal);
  }

  async processBase64File(file: ArrayBuffer, mimeType: string, action: string, onProgress?: ProgressCallback, abortSignal?: AbortSignal): Promise<string | ArrayBuffer> {
    return workerOrchestrator.dispatch("processBase64File", [file, mimeType, action], [file], onProgress, abortSignal);
  }

  async watermarkImage(file: ArrayBuffer, mimeType: string, options: any, onProgress?: ProgressCallback, abortSignal?: AbortSignal): Promise<ArrayBuffer> {
    return workerOrchestrator.dispatch("watermarkImage", [file, mimeType, options], [file], onProgress, abortSignal);
  }

  async removeImageMetadata(file: ArrayBuffer, mimeType: string, onProgress?: ProgressCallback, abortSignal?: AbortSignal): Promise<ArrayBuffer> {
    return workerOrchestrator.dispatch("removeImageMetadata", [file, mimeType], [file], onProgress, abortSignal);
  }

  async cropImageCenter(file: ArrayBuffer, mimeType: string, width: number, height: number, onProgress?: ProgressCallback, abortSignal?: AbortSignal): Promise<ArrayBuffer> {
    return workerOrchestrator.dispatch("cropImageCenter", [file, mimeType, width, height], [file], onProgress, abortSignal);
  }

  async computePerceptualHash(file: ArrayBuffer, mimeType: string, onProgress?: ProgressCallback, abortSignal?: AbortSignal): Promise<string> {
    return workerOrchestrator.dispatch("computePerceptualHash", [file, mimeType], [file], onProgress, abortSignal);
  }

  async rotateImageStandard(file: ArrayBuffer, mimeType: string, onProgress?: ProgressCallback, abortSignal?: AbortSignal): Promise<ArrayBuffer> {
    return workerOrchestrator.dispatch("rotateImageStandard", [file, mimeType], [file], onProgress, abortSignal);
  }

  async generateSpriteSheet(file: ArrayBuffer, mimeType: string, onProgress?: ProgressCallback, abortSignal?: AbortSignal): Promise<ArrayBuffer> {
    return workerOrchestrator.dispatch("generateSpriteSheet", [file, mimeType], [file], onProgress, abortSignal);
  }

  async optimizeSvg(file: ArrayBuffer, mimeType: string, onProgress?: ProgressCallback, abortSignal?: AbortSignal): Promise<string> {
    return workerOrchestrator.dispatch("optimizeSvg", [file, mimeType], [file], onProgress, abortSignal);
  }

  async generateHistogram(file: ArrayBuffer, mimeType: string, onProgress?: ProgressCallback, abortSignal?: AbortSignal): Promise<number[]> {
    return workerOrchestrator.dispatch("generateHistogram", [file, mimeType], [file], onProgress, abortSignal);
  }

  async simulateColorBlindness(file: ArrayBuffer, mimeType: string, type: string, onProgress?: ProgressCallback, abortSignal?: AbortSignal): Promise<ArrayBuffer> {
    return workerOrchestrator.dispatch("simulateColorBlindness", [file, mimeType, type], [file], onProgress, abortSignal);
  }

  async parseMarkdown(text: string, abortSignal?: AbortSignal): Promise<string> {
    return workerOrchestrator.dispatch("parseMarkdown", [text], undefined, undefined, abortSignal);
  }

  terminateAll() {
    workerOrchestrator.terminateAll();
  }
}

export const workerManager = new WorkerManager();
