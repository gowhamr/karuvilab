import * as Comlink from "comlink";

export type TaskProgress = {
  percent: number;
  message?: string;
};

export type ProgressCallback = (progress: TaskProgress) => void;

export interface CompressionSettings {
  quality: number;
  format: 'image/jpeg' | 'image/png' | 'image/webp' | 'image/avif';
  resizeWidth: number | null;
  resizeHeight: number | null;
  maintainAspectRatio: boolean;
  lossless: boolean;
}

const workerApi = {
  async compressImage(
    file: ArrayBuffer,
    settings: CompressionSettings,
    onProgress?: ProgressCallback
  ): Promise<Uint8Array> {
    if (onProgress) onProgress({ percent: 10, message: "Decoding image..." });
    
    const blob = new Blob([file]);
    const imgBitmap = await createImageBitmap(blob);
    
    let { width, height } = imgBitmap;
    
    // Calculate new dimensions if resizing is requested
    if (settings.resizeWidth || settings.resizeHeight) {
      if (settings.resizeWidth && settings.resizeHeight) {
        width = settings.resizeWidth;
        height = settings.resizeHeight;
      } else if (settings.resizeWidth) {
        if (settings.maintainAspectRatio) {
          height = (settings.resizeWidth / imgBitmap.width) * imgBitmap.height;
        }
        width = settings.resizeWidth;
      } else if (settings.resizeHeight) {
        if (settings.maintainAspectRatio) {
          width = (settings.resizeHeight / imgBitmap.height) * imgBitmap.width;
        }
        height = settings.resizeHeight;
      }
    }

    if (onProgress) onProgress({ percent: 40, message: "Processing canvas..." });
    
    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext("2d")!;
    
    // Draw image with smoothing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    
    // For PNG lossless, we might want to ensure background is handled
    if (settings.format === 'image/jpeg') {
      ctx.fillStyle = "#FFFFFF"; // JPEG doesn't support transparency
      ctx.fillRect(0, 0, width, height);
    }
    
    ctx.drawImage(imgBitmap, 0, 0, width, height);
    
    if (onProgress) onProgress({ percent: 70, message: "Encoding output..." });
    
    const options: ImageEncodeOptions = {
      type: settings.format,
      quality: settings.quality / 100
    };
    
    // Special handling for lossless
    if (settings.lossless && settings.format === 'image/png') {
      // quality is ignored for PNG in most browsers but we set it anyway
      options.quality = 1.0;
    }

    try {
      const compressedBlob = await canvas.convertToBlob(options);
      if (onProgress) onProgress({ percent: 90, message: "Finalizing..." });
      
      const result = await compressedBlob.arrayBuffer();
      
      // Cleanup
      imgBitmap.close();
      
      if (onProgress) onProgress({ percent: 100, message: "Done!" });
      return new Uint8Array(result);
    } catch (error) {
      imgBitmap.close();
      throw error;
    }
  }
};

Comlink.expose(workerApi);
export type ImageCompressWorkerAPI = typeof workerApi;
