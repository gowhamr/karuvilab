import { workerManager } from '../workers/manager';

/**
 * Creates a ZIP file from a collection of Blobs using a Web Worker.
 * (IMG-RUNTIME-007) Non-blocking ZIP generation for large batches.
 */
export async function createZip(files: Record<string, Blob>): Promise<Blob> {
  const zipData: Record<string, Uint8Array> = {};
  
  for (const [name, blob] of Object.entries(files)) {
    const buffer = await blob.arrayBuffer();
    zipData[name] = new Uint8Array(buffer);
  }

  const result = await workerManager.runZip(zipData);
  return new Blob([result as any], { type: 'application/zip' });
}

/**
 * Downloads a Blob as a file.
 */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 100);
}
