import * as Comlink from "comlink";
import { CompressionSettings } from "./types";

const api = {
  async encodeMp3(left: any, right: any, sampleRate: any, onProgress: any) {
    const lamejs = await import("lamejs");
    const mp3encoder = new lamejs.Mp3Encoder(right ? 2 : 1, sampleRate, 128);
    const mp3Data: any[] = [];
    const sampleBlockSize = 1152;
    
    for (let i = 0; i < left.length; i += sampleBlockSize) {
      const leftChunk = left.subarray(i, i + sampleBlockSize);
      const rightChunk = right ? right.subarray(i, i + sampleBlockSize) : leftChunk;
      const mp3buf = mp3encoder.encodeBuffer(leftChunk, rightChunk);
      if (mp3buf.length > 0) mp3Data.push(mp3buf);
      if (onProgress) onProgress({ percent: (i / left.length) * 100 });
    }
    
    const end = mp3encoder.flush();
    if (end.length > 0) mp3Data.push(end);
    
    const totalLen = mp3Data.reduce((acc, buf) => acc + buf.length, 0);
    const result = new Uint8Array(totalLen);
    let offset = 0;
    for (const buf of mp3Data) {
      result.set(new Uint8Array(buf), offset);
      offset += buf.length;
    }
    return result;
  },

  
  // PDF Tasks (with memory optimization)
  // Image Tasks (Standard)
  async compressImage(file: ArrayBuffer, mimeType: string, format: any, quality: any, onProgress: any) {
    let imgBitmap: ImageBitmap | null = null;
    try {
      const blob = new Blob([file], { type: mimeType });
      imgBitmap = await createImageBitmap(blob);
      
      const width = Math.max(1, imgBitmap.width);
      const height = Math.max(1, imgBitmap.height);

      if (typeof OffscreenCanvas === 'undefined') {
        throw new Error("OffscreenCanvas not supported in this browser. Please use a modern browser.");
      }

      const canvas = new OffscreenCanvas(width, height);
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not get 2D context from OffscreenCanvas");

      ctx.drawImage(imgBitmap, 0, 0);
      const compressedBlob = await canvas.convertToBlob({ type: format, quality: quality / 100 });
      if (!compressedBlob) throw new Error("Canvas export failed: Blob is null");

      const result = await compressedBlob.arrayBuffer();
      const bytes = new Uint8Array(result);
      return Comlink.transfer(bytes, [bytes.buffer]);
    } catch (err: any) {
      throw new Error(`Compression failed: ${err.message || 'Unknown error'}`);
    } finally {
      if (imgBitmap) imgBitmap.close();
    }
  },

  async resizeImage(file: any, width: any, height: any, mode: any, format: any, quality: any, onProgress: any) {
    let imgBitmap: ImageBitmap | null = null;
    try {
      const blob = new Blob([file]);
      imgBitmap = await createImageBitmap(blob);
      
      let targetW = Math.max(1, Math.floor(width));
      let targetH = Math.max(1, Math.floor(height));
      const origW = imgBitmap.width;
      const origH = imgBitmap.height;

      let drawX = 0, drawY = 0, drawW = targetW, drawH = targetH;
      
      if (mode === "fit") {
        const ratio = Math.min(targetW / origW, targetH / origH);
        drawW = origW * ratio;
        drawH = origH * ratio;
        // Resize canvas to exactly fit the image
        targetW = drawW;
        targetH = drawH;
      } else if (mode === "fill") {
        const ratio = Math.max(targetW / origW, targetH / origH);
        drawW = origW * ratio;
        drawH = origH * ratio;
        drawX = (targetW - drawW) / 2;
        drawY = (targetH - drawH) / 2;
      } else if (mode === "stretch") {
        drawW = targetW;
        drawH = targetH;
      }

      if (typeof OffscreenCanvas === 'undefined') {
        throw new Error("OffscreenCanvas not supported in this browser.");
      }

      const canvas = new OffscreenCanvas(targetW, targetH);
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not get 2D context");

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      
      if (format === 'image/jpeg') {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, targetW, targetH);
      }
      
      ctx.drawImage(imgBitmap, drawX, drawY, drawW, drawH);
      
      const compressedBlob = await canvas.convertToBlob({ type: format, quality: quality / 100 });
      if (!compressedBlob) throw new Error("Canvas export failed");

      const result = await compressedBlob.arrayBuffer();
      const bytes = new Uint8Array(result);
      return Comlink.transfer(bytes, [bytes.buffer]);
    } catch (err: any) {
      throw new Error(`Resize failed: ${err.message || 'Unknown error'}`);
    } finally {
      if (imgBitmap) imgBitmap.close();
    }
  },

  async removeBackground(file: any, bgColor: any, tolerance: any, onProgress: any) {
    let imgBitmap: ImageBitmap | null = null;
    try {
      const blob = new Blob([file]);
      imgBitmap = await createImageBitmap(blob);
      const width = imgBitmap.width;
      const height = imgBitmap.height;

      if (typeof OffscreenCanvas === 'undefined') {
        throw new Error("OffscreenCanvas not supported");
      }

      const canvas = new OffscreenCanvas(width, height);
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) throw new Error("Could not get 2D context");

      ctx.drawImage(imgBitmap, 0, 0);
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;

      const r_target = parseInt(bgColor.slice(1, 3), 16);
      const g_target = parseInt(bgColor.slice(3, 5), 16);
      const b_target = parseInt(bgColor.slice(5, 7), 16);

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i]!, g = data[i + 1]!, b = data[i + 2]!;
        const diff = Math.sqrt((r - r_target) ** 2 + (g - g_target) ** 2 + (b - b_target) ** 2);
        
        if (diff <= tolerance) {
          data[i + 3] = 0;
        } else if (diff <= tolerance * 1.5) {
          const alpha = Math.round(((diff - tolerance) / (tolerance * 0.5)) * 255);
          data[i + 3] = Math.min(data[i + 3]!, alpha);
        }
      }

      ctx.putImageData(imageData, 0, 0);
      const resultBlob = await canvas.convertToBlob({ type: 'image/png' });
      if (!resultBlob) throw new Error("Canvas export failed");

      const result = await resultBlob.arrayBuffer();
      const bytes = new Uint8Array(result);
      return Comlink.transfer(bytes, [bytes.buffer]);
    } catch (err: any) {
      throw new Error(`Background removal failed: ${err.message || 'Unknown error'}`);
    } finally {
      if (imgBitmap) imgBitmap.close();
    }
  },

  // Image Tasks (Batch specialized)
  async compressImageBatch(file: ArrayBuffer, mimeType: string, settings: CompressionSettings, onProgress: any) {
    let imgBitmap: ImageBitmap | null = null;
    try {
      if (onProgress) onProgress({ percent: 10, message: "Decoding image..." });
      const blob = new Blob([file], { type: mimeType });
      
      try {
        imgBitmap = await createImageBitmap(blob);
      } catch (e) {
        throw new Error("Failed to decode image. The file might be corrupted or in an unsupported format.");
      }
      
      let { width, height } = imgBitmap;
      
      if (settings.resizeWidth || settings.resizeHeight) {
        if (settings.resizeWidth && settings.resizeHeight) {
          width = settings.resizeWidth; height = settings.resizeHeight;
        } else if (settings.resizeWidth) {
          if (settings.maintainAspectRatio) height = (settings.resizeWidth / imgBitmap.width) * imgBitmap.height;
          width = settings.resizeWidth;
        } else if (settings.resizeHeight) {
          if (settings.maintainAspectRatio) width = (settings.resizeHeight / imgBitmap.height) * imgBitmap.width;
          height = settings.resizeHeight;
        }
      }

      width = Math.max(1, Math.floor(width));
      height = Math.max(1, Math.floor(height));

      if (typeof OffscreenCanvas === 'undefined') {
        throw new Error("OffscreenCanvas not supported");
      }

      const canvas = new OffscreenCanvas(width, height);
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not get 2D context");

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      
      if (settings.format === 'image/jpeg') {
        ctx.fillStyle = "#FFFFFF"; ctx.fillRect(0, 0, width, height);
      }
      
      ctx.drawImage(imgBitmap, 0, 0, width, height);
      
      const options: ImageEncodeOptions = {
        type: settings.format,
        quality: settings.quality / 100
      };
      
      if (settings.lossless && settings.format === 'image/png') options.quality = 1.0;

      const compressedBlob = await canvas.convertToBlob(options);
      if (!compressedBlob) throw new Error("Canvas export failed: Resulting blob is null");

      const result = await compressedBlob.arrayBuffer();
      const bytes = new Uint8Array(result);
      
      if (onProgress) onProgress({ percent: 100, message: "Done!" });
      return Comlink.transfer(bytes, [bytes.buffer]);
    } catch (err: any) {
      console.error("[Worker] Compression task failed:", err);
      throw new Error(`Compression failed: ${err.message || 'Unknown error'}`);
    } finally {
      if (imgBitmap) imgBitmap.close();
    }
  },

  async extractColorPalette(file: any, k = 5, onProgress: any) {
    let imgBitmap: ImageBitmap | null = null;
    try {
      if (onProgress) onProgress({ percent: 10, message: "Decoding image..." });
      const blob = new Blob([file]);
      imgBitmap = await createImageBitmap(blob);

      const MAX_WIDTH = 100;
      const scale = Math.min(MAX_WIDTH / imgBitmap.width, 1);
      const width = Math.round(imgBitmap.width * scale);
      const height = Math.round(imgBitmap.height * scale);

      const canvas = new OffscreenCanvas(width, height);
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) throw new Error("Could not get 2D context");
      
      ctx.drawImage(imgBitmap, 0, 0, width, height);
      const imageData = ctx.getImageData(0, 0, width, height).data;

      if (onProgress) onProgress({ percent: 30, message: "Sampling pixels..." });
      const pixels: [number, number, number][] = [];
      for (let i = 0; i < imageData.length; i += 4) {
        if (imageData[i+3]! > 128) {
          pixels.push([imageData[i]!, imageData[i+1]!, imageData[i+2]!]);
        }
      }

      if (pixels.length === 0) return [];

      if (onProgress) onProgress({ percent: 50, message: "Clustering colors (k-means)..." });
      
      let centroids: [number, number, number][] = [];
      for(let i=0; i<k; i++) {
        centroids.push(pixels[Math.floor(Math.random() * pixels.length)]!);
      }

      const assignments = new Array(pixels.length);
      const MAX_ITERATIONS = 10;

      for (let iter = 0; iter < MAX_ITERATIONS; iter++) {
        for (let i = 0; i < pixels.length; i++) {
          let min_dist = Infinity;
          let best_centroid = 0;
          for (let j = 0; j < k; j++) {
            const dist = Math.sqrt(
              (pixels[i]![0] - centroids[j]![0]) ** 2 +
              (pixels[i]![1] - centroids[j]![1]) ** 2 +
              (pixels[i]![2] - centroids[j]![2]) ** 2
            );
            if (dist < min_dist) {
              min_dist = dist;
              best_centroid = j;
            }
          }
          assignments[i] = best_centroid;
        }

        const new_centroids: [number, number, number][] = new Array(k).fill(0).map(() => [0, 0, 0]);
        const counts = new Array(k).fill(0);
        for (let i = 0; i < pixels.length; i++) {
          const centroid_index = assignments[i]!;
          new_centroids[centroid_index]![0] += pixels[i]![0];
          new_centroids[centroid_index]![1] += pixels[i]![1];
          new_centroids[centroid_index]![2] += pixels[i]![2];
          counts[centroid_index]++;
        }

        for (let i = 0; i < k; i++) {
          if (counts[i] > 0) {
            new_centroids[i]![0] /= counts[i];
            new_centroids[i]![1] /= counts[i];
            new_centroids[i]![2] /= counts[i];
          } else {
             new_centroids[i] = pixels[Math.floor(Math.random() * pixels.length)]!;
          }
        }
        centroids = new_centroids;
      }
      
      if (onProgress) onProgress({ percent: 90, message: "Finalizing palette..." });
      
      return centroids.map(c => {
        const r = Math.round(c[0]).toString(16).padStart(2, '0');
        const g = Math.round(c[1]).toString(16).padStart(2, '0');
        const b = Math.round(c[2]).toString(16).padStart(2, '0');
        return `#${r}${g}${b}`;
      });

    } catch (err: any) {
      throw new Error(`Color extraction failed: ${err.message || 'Unknown error'}`);
    } finally {
      if (imgBitmap) imgBitmap.close();
    }
  },

  async createGif(frames: any, width: any, height: any, delay: any, onProgress: any) {
    const { GIFEncoder, quantize, applyPalette } = await import('gifenc');
    const gif = new GIFEncoder();
    
    for (let i = 0; i < frames.length; i++) {
      const frameBuffer = frames[i];
      if (!frameBuffer) continue;
      const data = new Uint8Array(frameBuffer);
      const palette = quantize(data, 256);
      const index = applyPalette(data, palette);
      gif.writeFrame(index, width, height, { palette, delay });
      if (onProgress) onProgress({ percent: (i / frames.length) * 100 });
    }
    
    gif.finish();
    return gif.bytes();
  },

  };

Comlink.expose(api);
export type ImageWorkerAPI = typeof api;
