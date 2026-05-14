/**
 * Utility functions for image compression tool
 */

/**
 * Formats a size in bytes to a human-readable string (KB/MB)
 */
export function formatSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Estimates reduction percentage
 */
export function getReduction(original: number, compressed: number): string {
  if (original === 0) return '0%';
  const reduction = ((original - compressed) / original) * 100;
  return reduction.toFixed(1) + '%';
}

/**
 * Detects browser support for a specific image mime type
 */
export async function isFormatSupported(mime: string): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  
  // Quick check for common formats
  if (['image/jpeg', 'image/png'].includes(mime)) return true;
  
  // Use a tiny transparent image to test support
  const images: Record<string, string> = {
    'image/webp': 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=',
    'image/avif': 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0BAAAAAAAAbmkyY29scgBjb2xybmNseAABAA0ABoAAAAAMcGl4aQAAAAAABwAAAAAAbmF4cHREAAAACmF2MUMBAQAAAABtSGl0bQAAAAAAGWlwcnAAAAAkaXBtYQAAAAAAAAABAAEEAYIDBAAAABhpcGNvAAAAFGF2MUMBAQAAAAAMY29scm5jbHgAAQA0AAaAAAAAAnBpeGkAAAAAAwcAAAAAAnByb3AAAAAACmF2MUMBAQAAAAAAYXQwYmF0AQAAAAADZGlkZAAAACBtZGF0EgAKCBgABogRA0IAAAAAB0F2aWY=',
  };

  const src = images[mime];
  if (!src) return false;

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
}

/**
 * Gets supported formats for the current browser
 */
export async function getSupportedFormats(): Promise<string[]> {
  const formats = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
  const results = await Promise.all(formats.map(isFormatSupported));
  const supported: string[] = [];
  results.forEach((res, i) => {
    const format = formats[i];
    if (res && format) supported.push(format);
  });
  return supported;
}

/**
 * Calculates new dimensions keeping aspect ratio
 */
export function calculateAspectRatio(
  originalW: number,
  originalH: number,
  targetW: number | null,
  targetH: number | null
): { width: number; height: number } {
  if (targetW && targetH) return { width: targetW, height: targetH };
  
  if (targetW) {
    return {
      width: targetW,
      height: Math.round((targetW / originalW) * originalH),
    };
  }
  
  if (targetH) {
    return {
      width: Math.round((targetH / originalH) * originalW),
      height: targetH,
    };
  }
  
  return { width: originalW, height: originalH };
}
