import * as fflate from 'fflate';

/**
 * Creates a ZIP file from a collection of Blobs.
 * @param files A record where keys are filenames and values are Blobs.
 * @returns A Blob representing the ZIP file.
 */
export async function createZip(files: Record<string, Blob>): Promise<Blob> {
  const zipData: Record<string, Uint8Array> = {};
  
  for (const [name, blob] of Object.entries(files)) {
    const buffer = await blob.arrayBuffer();
    zipData[name] = new Uint8Array(buffer);
  }

  return new Promise((resolve, reject) => {
    fflate.zip(zipData, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(new Blob([data as any], { type: 'application/zip' }));
      }
    });
  });
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
