/**
 * KaruviLab (KV) AI Super Resolution - Preprocessing
 * Converts image source into normalized tile Float32 tensor [1, 3, 256, 256]
 */
export async function preprocessSuperResImage(imageSource, tileWidth = 256, tileHeight = 256) {
    let origWidth = 0;
    let origHeight = 0;
    if (imageSource instanceof HTMLImageElement) {
        origWidth = imageSource.naturalWidth || imageSource.width;
        origHeight = imageSource.naturalHeight || imageSource.height;
    }
    else if (imageSource instanceof ImageBitmap || imageSource instanceof ImageData) {
        origWidth = imageSource.width;
        origHeight = imageSource.height;
    }
    const canvas = new OffscreenCanvas(tileWidth, tileHeight);
    canvas.width = tileWidth;
    canvas.height = tileHeight;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) {
        throw new Error('Failed to create super resolution preprocessing canvas context');
    }
    if (imageSource instanceof ImageData) {
        const tempCanvas = new OffscreenCanvas(origWidth, origHeight);
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx?.putImageData(imageSource, 0, 0);
        ctx.drawImage(tempCanvas, 0, 0, tileWidth, tileHeight);
    }
    else {
        ctx.drawImage(imageSource, 0, 0, tileWidth, tileHeight);
    }
    const imageData = ctx.getImageData(0, 0, tileWidth, tileHeight);
    const { data } = imageData;
    const channelSize = tileWidth * tileHeight;
    const tensorData = new Float32Array(3 * channelSize);
    for (let i = 0; i < channelSize; i++) {
        const r = (data[i * 4] ?? 0) / 255.0;
        const g = (data[i * 4 + 1] ?? 0) / 255.0;
        const b = (data[i * 4 + 2] ?? 0) / 255.0;
        tensorData[i] = r;
        tensorData[channelSize + i] = g;
        tensorData[channelSize * 2 + i] = b;
    }
    return {
        tensorData,
        dims: [1, 3, tileHeight, tileWidth],
        originalWidth: origWidth,
        originalHeight: origHeight
    };
}
