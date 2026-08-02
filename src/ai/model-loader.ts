/**
 * KaruviLab (KV) Local AI Engine - Model Loader
 * Handles fetching, streaming progress, caching, and loading model ArrayBuffers
 */

import { ModelManifest, ModelProgress } from './types';
import { getCachedModel, saveCachedModel } from './model-cache';
import { ModelLoadError } from './errors';

export async function loadModelBuffer(
  manifest: ModelManifest,
  onProgress?: (progress: ModelProgress) => void,
  signal?: AbortSignal
): Promise<ArrayBuffer> {
  // 1. Check IDB Cache first
  const cachedBuffer = await getCachedModel(manifest.id, manifest.version);
  if (cachedBuffer) {
    if (onProgress) {
      onProgress({
        loadedBytes: cachedBuffer.byteLength,
        totalBytes: cachedBuffer.byteLength,
        percent: 100,
        stage: 'caching'
      });
    }
    return cachedBuffer;
  }

  // 2. Fetch from network/public assets if not cached
  try {
    const response = await fetch(manifest.file, signal ? { signal } : {});
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const contentLengthHeader = response.headers.get('content-length');
    const totalBytes = contentLengthHeader ? parseInt(contentLengthHeader, 10) : Math.round(manifest.sizeMB * 1024 * 1024);
    
    if (!response.body) {
      const buffer = await response.arrayBuffer();
      await saveCachedModel(manifest.id, manifest.version, buffer);
      return buffer;
    }

    const reader = response.body.getReader();
    const chunks: Uint8Array[] = [];
    let loadedBytes = 0;

    while (true) {
      if (signal?.aborted) {
        reader.cancel();
        throw new Error('Model download aborted');
      }

      const { done, value } = await reader.read();
      if (done) break;

      chunks.push(value);
      loadedBytes += value.byteLength;

      if (onProgress) {
        const percent = Math.min(99, Math.round((loadedBytes / totalBytes) * 100));
        onProgress({
          loadedBytes,
          totalBytes,
          percent,
          stage: 'downloading'
        });
      }
    }

    // Combine chunks into single ArrayBuffer
    const combined = new Uint8Array(loadedBytes);
    let offset = 0;
    for (const chunk of chunks) {
      combined.set(chunk, offset);
      offset += chunk.byteLength;
    }

    const buffer = combined.buffer;

    // Save to IDB cache asynchronously
    await saveCachedModel(manifest.id, manifest.version, buffer);

    if (onProgress) {
      onProgress({
        loadedBytes,
        totalBytes: loadedBytes,
        percent: 100,
        stage: 'caching'
      });
    }

    return buffer;
  } catch (err) {
    throw new ModelLoadError(manifest.id, err);
  }
}
