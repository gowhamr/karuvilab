/**
 * KaruviLab (KV) AI Background Remover - Postprocessing & Alpha Matting
 * Converts raw output alpha mask tensor [1, 1, 1024, 1024] back to high-res transparent Canvas
 * Supports adaptive thresholding, edge feathering, and mask inversion.
 */
export async function createTransparentCanvas(options) {
    const { outputTensorData, maskWidth, maskHeight, originalImage, threshold = 0.5, feather = 2, invert = false } = options;
    const origWidth = originalImage instanceof HTMLImageElement
        ? (originalImage.naturalWidth || originalImage.width)
        : originalImage.width;
    const origHeight = originalImage instanceof HTMLImageElement
        ? (originalImage.naturalHeight || originalImage.height)
        : originalImage.height;
    // 1. Render raw Float32 probability tensor to 1024x1024 alpha mask canvas
    const maskCanvas = new OffscreenCanvas(maskWidth, maskHeight);
    const maskCtx = maskCanvas.getContext('2d', { willReadFrequently: true });
    if (!maskCtx) {
        throw new Error('Failed to create mask canvas context');
    }
    const maskImageData = maskCtx.createImageData(maskWidth, maskHeight);
    const maskPixels = maskImageData.data;
    const totalPixels = maskWidth * maskHeight;
    const lowBound = Math.max(0, threshold - 0.15);
    const highBound = Math.min(1, threshold + 0.15);
    for (let i = 0; i < totalPixels; i++) {
        const rawVal = outputTensorData[i] ?? 0;
        // Apply sigmoid activation if model output is unscaled logits
        let prob = rawVal;
        if (rawVal < 0 || rawVal > 1) {
            prob = 1 / (1 + Math.exp(-rawVal));
        }
        if (invert) {
            prob = 1.0 - prob;
        }
        // Smooth step alpha interpolation for soft hair & boundary transition
        let alpha = 0;
        if (prob >= highBound) {
            alpha = 1.0;
        }
        else if (prob <= lowBound) {
            alpha = 0.0;
        }
        else {
            const t = (prob - lowBound) / (highBound - lowBound);
            alpha = t * t * (3 - 2 * t); // Smoothstep curve
        }
        const alphaByte = Math.round(alpha * 255);
        maskPixels[i * 4] = 255; // R
        maskPixels[i * 4 + 1] = 255; // G
        maskPixels[i * 4 + 2] = 255; // B
        maskPixels[i * 4 + 3] = alphaByte; // A
    }
    maskCtx.putImageData(maskImageData, 0, 0);
    if (feather > 0) {
        const tempCanvas = new OffscreenCanvas(maskWidth, maskHeight);
        const tempCtx = tempCanvas.getContext('2d');
        if (tempCtx) {
            tempCtx.filter = `blur(${feather}px)`;
            tempCtx.drawImage(maskCanvas, 0, 0);
            maskCtx.clearRect(0, 0, maskWidth, maskHeight);
            maskCtx.drawImage(tempCanvas, 0, 0);
        }
    }
    // 3. Composite original high-res image with scaled alpha mask
    const resultCanvas = new OffscreenCanvas(origWidth, origHeight);
    const resultCtx = resultCanvas.getContext('2d');
    if (!resultCtx) {
        throw new Error('Failed to create result canvas context');
    }
    resultCtx.drawImage(originalImage, 0, 0, origWidth, origHeight);
    resultCtx.globalCompositeOperation = 'destination-in';
    resultCtx.drawImage(maskCanvas, 0, 0, origWidth, origHeight);
    resultCtx.globalCompositeOperation = 'source-over';
    return resultCanvas.transferToImageBitmap();
}
