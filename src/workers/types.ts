import * as Comlink from "comlink";

export type TaskProgress = {
  percent: number;
  message?: string;
  stage?: string;
};

export type ProgressCallback = (progress: TaskProgress) => void;

export interface WorkerAPI {
  // Hash Tasks
  generateHashes(
    text: string, 
    algos: string[], 
    onProgress?: ProgressCallback
  ): Promise<Record<string, string>>;
  
  // PDF Tasks
  mergePdfs(
    files: ArrayBuffer[], 
    onProgress?: ProgressCallback
  ): Promise<Uint8Array>;

  // Image Tasks
  compressImage(
    file: ArrayBuffer, 
    format: "image/jpeg" | "image/png" | "image/webp",
    quality: number,
    onProgress?: ProgressCallback
  ): Promise<Uint8Array>;

  // Developer Tasks
  minifyCode(
    code: string,
    lang: "css" | "js" | "html",
    onProgress?: ProgressCallback
  ): Promise<string>;
}
