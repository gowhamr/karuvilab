/**
 * KaruviLab (KV) AI Background Remover - Preprocessing
 * Converts HTMLImageElement / ImageData to normalized Float32Array tensor [1, 3, 1024, 1024]
 */
export async function preprocessImage(imageSource, targetWidth = 1024, targetHeight = 1024) {
    let origWidth = 0;
    let origHeight = 0;
    if (imageSource instanceof HTMLImageElement) {
        origWidth = imageSource.naturalWidth || imageSource.width;
        origHeight = imageSource.naturalHeight || imageSource.height;
    }
    else if (imageSource instanceof ImageBitmap) {
        origWidth = imageSource.width;
        origHeight = imageSource.height;
    }
    else if (imageSource instanceof ImageData) {
        origWidth = imageSource.width;
        origHeight = imageSource.height;
    }
    // Create an offscreen canvas to resize image to model target dimensions (1024x1024)
    const canvas = new OffscreenCanvas(targetWidth, targetHeight);
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) {
        throw new Error('Failed to create offscreen canvas context for image preprocessing');
    }
    // Draw scaled image
    if (imageSource instanceof ImageData) {
        const tempCanvas = new OffscreenCanvas(origWidth, origHeight);
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx?.putImageData(imageSource, 0, 0);
        ctx.drawImage(tempCanvas, 0, 0, targetWidth, targetHeight);
    }
    else {
        ctx.drawImage(imageSource, 0, 0, targetWidth, targetHeight);
    }
    const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight);
    const { data } = imageData; // RGBA uint8 array
    // Allocate Float32Array tensor memory for planar RGB format [1, 3, 1024, 1024]
    const channelSize = targetWidth * targetHeight;
    const tensorData = new Float32Array(3 * channelSize);
    // Normalize pixel channels from uint8 [0, 255] to float32 [0.0, 1.0]
    for (let i = 0; i < channelSize; i++) {
        const r = (data[i * 4] ?? 0) / 255.0;
        const g = (data[i * 4 + 1] ?? 0) / 255.0;
        const b = (data[i * 4 + 2] ?? 0) / 255.0;
        // Planar format: Red channel first, Green second, Blue third
        tensorData[i] = r;
        tensorData[channelSize + i] = g;
        tensorData[channelSize * 2 + i] = b;
    }
    return {
        tensorData,
        dims: [1, 3, targetHeight, targetWidth],
        originalWidth: origWidth,
        originalHeight: origHeight
    };
}
