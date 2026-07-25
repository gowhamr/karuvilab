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

      // We need a decent amount of pixels for better color representation
      const MAX_WIDTH = 200; 
      const scale = Math.min(MAX_WIDTH / Math.max(1, imgBitmap.width), 1);
      const width = Math.max(1, Math.round(imgBitmap.width * scale));
      const height = Math.max(1, Math.round(imgBitmap.height * scale));

      if (typeof OffscreenCanvas === 'undefined') {
        throw new Error("OffscreenCanvas not supported");
      }
      
      const canvas = new OffscreenCanvas(width, height);
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) throw new Error("Could not get 2D context");
      
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(imgBitmap, 0, 0, width, height);
      const imageData = ctx.getImageData(0, 0, width, height).data;

      if (onProgress) onProgress({ percent: 30, message: "Sampling pixels..." });
      const pixels: [number, number, number][] = [];
      for (let i = 0; i < imageData.length; i += 4) {
        // Only include pixels that aren't fully transparent
        if (imageData[i+3]! > 128) {
          pixels.push([imageData[i]!, imageData[i+1]!, imageData[i+2]!]);
        }
      }

      if (pixels.length === 0) return [];
      
      // Ensure k does not exceed the number of unique pixels
      k = Math.min(k, pixels.length);

      if (onProgress) onProgress({ percent: 50, message: "Clustering colors (K-Means++)..." });
      
      // K-Means++ Initialization
      let centroids: [number, number, number][] = [];
      centroids.push(pixels[Math.floor(Math.random() * pixels.length)]!);
      
      for(let i=1; i<k; i++) {
        let max_dist = -1;
        let best_pixel = pixels[0]!;
        for(let p=0; p<Math.min(pixels.length, 10000); p+=Math.max(1, Math.floor(pixels.length/2000))) { // sample subset for speed
          const px = pixels[p]!;
          let min_c_dist = Infinity;
          for(let c=0; c<centroids.length; c++) {
            const dist = (px[0]-centroids[c]![0])**2 + (px[1]-centroids[c]![1])**2 + (px[2]-centroids[c]![2])**2;
            if (dist < min_c_dist) min_c_dist = dist;
          }
          if (min_c_dist > max_dist) {
            max_dist = min_c_dist;
            best_pixel = px;
          }
        }
        centroids.push(best_pixel);
      }

      const assignments = new Int32Array(pixels.length);
      const MAX_ITERATIONS = 20;

      for (let iter = 0; iter < MAX_ITERATIONS; iter++) {
        let changed = false;
        
        for (let i = 0; i < pixels.length; i++) {
          let min_dist = Infinity;
          let best_centroid = 0;
          for (let j = 0; j < k; j++) {
            const dist = 
              (pixels[i]![0] - centroids[j]![0]) ** 2 +
              (pixels[i]![1] - centroids[j]![1]) ** 2 +
              (pixels[i]![2] - centroids[j]![2]) ** 2;
            
            if (dist < min_dist) {
              min_dist = dist;
              best_centroid = j;
            }
          }
          if (assignments[i] !== best_centroid) {
            changed = true;
            assignments[i] = best_centroid;
          }
        }

        if (!changed && iter > 0) break; // converged

        const new_centroids: [number, number, number][] = Array.from({length: k}, () => [0, 0, 0]);
        const counts = new Int32Array(k);
        
        for (let i = 0; i < pixels.length; i++) {
          const centroid_index = assignments[i]!;
          new_centroids[centroid_index]![0] += pixels[i]![0];
          new_centroids[centroid_index]![1] += pixels[i]![1];
          new_centroids[centroid_index]![2] += pixels[i]![2];
          counts[centroid_index]!++;
        }

        for (let i = 0; i < k; i++) {
          if (counts[i]! > 0) {
            new_centroids[i]![0] /= counts[i]!;
            new_centroids[i]![1] /= counts[i]!;
            new_centroids[i]![2] /= counts[i]!;
          } else {
             new_centroids[i] = pixels[Math.floor(Math.random() * pixels.length)]!;
          }
        }
        centroids = new_centroids;
        if (onProgress) onProgress({ percent: 50 + (iter / MAX_ITERATIONS) * 40, message: `Optimizing palette (iter ${iter+1})...` });
      }
      
      if (onProgress) onProgress({ percent: 95, message: "Finalizing palette..." });
      
      // Sort centroids by frequency (most dominant first)
      const finalCounts = new Int32Array(k);
      for (let i = 0; i < pixels.length; i++) finalCounts[assignments[i]!]!++;
      
      const sortedCentroids = centroids.map((c, i) => ({ c, count: finalCounts[i]! }))
        .sort((a, b) => b.count - a.count)
        .map(x => x.c);
      
      // Deduplicate similar colors
      const uniqueColors: string[] = [];
      const threshold = 15; // minimum distance to be considered unique
      
      for (let i = 0; i < sortedCentroids.length; i++) {
        let isUnique = true;
        for(let j = 0; j < uniqueColors.length; j++) {
           const uR = parseInt(uniqueColors[j]!.substring(1, 3), 16);
           const uG = parseInt(uniqueColors[j]!.substring(3, 5), 16);
           const uB = parseInt(uniqueColors[j]!.substring(5, 7), 16);
           
           const dist = Math.sqrt(
              (sortedCentroids[i]![0] - uR) ** 2 +
              (sortedCentroids[i]![1] - uG) ** 2 +
              (sortedCentroids[i]![2] - uB) ** 2
           );
           if (dist < threshold) {
             isUnique = false;
             break;
           }
        }
        if (isUnique) {
          const r = Math.round(sortedCentroids[i]![0]).toString(16).padStart(2, '0');
          const g = Math.round(sortedCentroids[i]![1]).toString(16).padStart(2, '0');
          const b = Math.round(sortedCentroids[i]![2]).toString(16).padStart(2, '0');
          uniqueColors.push(`#${r}${g}${b}`);
        }
      }

      if (onProgress) onProgress({ percent: 100, message: "Done!" });
      return uniqueColors;
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
