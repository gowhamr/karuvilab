/**
 * Image Paste and Drag-and-Drop Handler for Markdown Editor.
 * Converts clipboard / dropped image files into optimized inline Base64 data URLs.
 */

export interface OptimizedImageData {
  dataUrl: string;
  fileName: string;
  width: number;
  height: number;
}

const SUPPORTED_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'image/avif',
];

export function isImageFile(file: File | Blob): boolean {
  return SUPPORTED_MIME_TYPES.includes(file.type.toLowerCase()) || file.type.startsWith('image/');
}

export function extractImagesFromDataTransfer(dataTransfer: DataTransfer): File[] {
  const images: File[] = [];

  if (dataTransfer.items) {
    for (let i = 0; i < dataTransfer.items.length; i++) {
      const item = dataTransfer.items[i];
      if (item && item.kind === 'file' && item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) images.push(file);
      }
    }
  } else if (dataTransfer.files) {
    for (let i = 0; i < dataTransfer.files.length; i++) {
      const file = dataTransfer.files[i];
      if (file && isImageFile(file)) {
        images.push(file);
      }
    }
  }

  return images;
}

/**
 * Optimizes an image to a compact Base64 Data URL (resizing if larger than maxDimension).
 */
export async function optimizeImageToDataUrl(
  file: File,
  maxDimension = 1600,
  quality = 0.85
): Promise<OptimizedImageData> {
  // For SVG images, read directly as data URL without rasterizing
  if (file.type === 'image/svg+xml') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({
          dataUrl: reader.result as string,
          fileName: file.name || 'image.svg',
          width: 0,
          height: 0,
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;

        // Resize down proportionally if exceeds max dimension
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // Fallback to raw data URL
          resolve({
            dataUrl: event.target?.result as string,
            fileName: file.name || 'image.png',
            width,
            height,
          });
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Prefer WebP or JPEG for photographs, PNG for transparent graphics
        const isPng = file.type === 'image/png';
        const targetFormat = isPng ? 'image/png' : 'image/jpeg';
        const dataUrl = canvas.toDataURL(targetFormat, quality);

        const safeName = file.name
          ? file.name.replace(/\.[^/.]+$/, '')
          : `screenshot-${new Date().toISOString().slice(0, 10)}`;

        resolve({
          dataUrl,
          fileName: safeName,
          width,
          height,
        });
      };
      img.onerror = () => reject(new Error('Failed to load image for optimization'));
      img.src = event.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
