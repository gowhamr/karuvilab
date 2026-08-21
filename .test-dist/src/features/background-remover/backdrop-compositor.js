/**
 * KaruviLab (KV) AI Background Remover - Backdrop Compositor & Transform Engine
 * Supports:
 * - Transparent PNG
 * - Solid Color Presets & Custom Hex
 * - 7 Studio Gradients
 * - Custom Background Image Replacement
 * - Original Background Bokeh Blur
 * - Transformations: Rotation, Flip H/V, Padding & Aspect Ratio
 * - Multi-Format Export: PNG, WebP, JPEG with quality and custom dimensions
 */
export const STUDIO_PRESETS = [
    {
        id: 'studio-soft-spotlight',
        name: 'Soft Spotlight',
        description: 'Clean bright studio with soft radial vignette',
        cssPreview: 'radial-gradient(circle at 50% 35%, #ffffff 0%, #cbd5e1 100%)',
        draw: (ctx, width, height) => {
            const grad = ctx.createRadialGradient(width * 0.5, height * 0.35, width * 0.1, width * 0.5, height * 0.5, Math.max(width, height) * 0.75);
            grad.addColorStop(0, '#ffffff');
            grad.addColorStop(1, '#cbd5e1');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, width, height);
        }
    },
    {
        id: 'studio-portrait-slate',
        name: 'Portrait Slate',
        description: 'Professional dark slate studio backdrop',
        cssPreview: 'radial-gradient(circle at 50% 30%, #334155 0%, #0f172a 100%)',
        draw: (ctx, width, height) => {
            const grad = ctx.createRadialGradient(width * 0.5, height * 0.3, width * 0.08, width * 0.5, height * 0.5, Math.max(width, height) * 0.8);
            grad.addColorStop(0, '#334155');
            grad.addColorStop(1, '#0f172a');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, width, height);
        }
    },
    {
        id: 'studio-warm-sunset',
        name: 'Warm Sunset',
        description: 'Golden ambient gradient for lifestyle and portraits',
        cssPreview: 'linear-gradient(135deg, #fff7ed 0%, #fed7aa 50%, #fb923c 100%)',
        draw: (ctx, width, height) => {
            const grad = ctx.createLinearGradient(0, 0, width, height);
            grad.addColorStop(0, '#fff7ed');
            grad.addColorStop(0.5, '#fed7aa');
            grad.addColorStop(1, '#fb923c');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, width, height);
        }
    },
    {
        id: 'studio-clean-pastel',
        name: 'Clean Pastel',
        description: 'Subtle modern pastel glow for product showcases',
        cssPreview: 'linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 100%)',
        draw: (ctx, width, height) => {
            const grad = ctx.createLinearGradient(0, 0, width, height);
            grad.addColorStop(0, '#f0fdf4');
            grad.addColorStop(1, '#e0f2fe');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, width, height);
        }
    },
    {
        id: 'studio-executive-navy',
        name: 'Executive Navy',
        description: 'Corporate royal navy to deep midnight blue',
        cssPreview: 'linear-gradient(180deg, #1e3a8a 0%, #0f172a 100%)',
        draw: (ctx, width, height) => {
            const grad = ctx.createLinearGradient(0, 0, 0, height);
            grad.addColorStop(0, '#1e3a8a');
            grad.addColorStop(1, '#0f172a');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, width, height);
        }
    },
    {
        id: 'studio-cyber-neon',
        name: 'Cyber Neon',
        description: 'Electric indigo radial glow on deep void',
        cssPreview: 'radial-gradient(circle at 50% 50%, #312e81 0%, #030712 100%)',
        draw: (ctx, width, height) => {
            const grad = ctx.createRadialGradient(width * 0.5, height * 0.5, width * 0.05, width * 0.5, height * 0.5, Math.max(width, height) * 0.7);
            grad.addColorStop(0, '#312e81');
            grad.addColorStop(1, '#030712');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, width, height);
        }
    },
    {
        id: 'studio-dark-stage',
        name: 'Dark Stage',
        description: 'Focused dramatic spotlight on jet black background',
        cssPreview: 'radial-gradient(circle at 50% 25%, #475569 0%, #020617 85%)',
        draw: (ctx, width, height) => {
            const grad = ctx.createRadialGradient(width * 0.5, height * 0.25, width * 0.05, width * 0.5, height * 0.5, Math.max(width, height) * 0.85);
            grad.addColorStop(0, '#475569');
            grad.addColorStop(1, '#020617');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, width, height);
        }
    }
];
/**
 * Composite cutout foreground onto target backdrop with transforms and export formatting
 */
export async function compositeCutoutWithBackdrop(options) {
    const { cutoutImage, originalImage, customBgImage, width, height, backdropType, solidColor = '#ffffff', studioPresetId, blurRadius = 15, transforms, exportSettings } = options;
    // 1. Calculate Target Canvas Dimensions based on Aspect Ratio
    let targetWidth = width;
    let targetHeight = height;
    if (transforms && transforms.aspectRatio && transforms.aspectRatio !== 'original') {
        switch (transforms.aspectRatio) {
            case '1:1':
                const side = Math.max(width, height);
                targetWidth = side;
                targetHeight = side;
                break;
            case '4:5':
                targetWidth = width;
                targetHeight = Math.round(width * 1.25);
                break;
            case '16:9':
                targetWidth = width;
                targetHeight = Math.round(width * (9 / 16));
                break;
            case '9:16':
                targetWidth = width;
                targetHeight = Math.round(width * (16 / 9));
                break;
            case '3:4':
                targetWidth = width;
                targetHeight = Math.round(width * (4 / 3));
                break;
        }
    }
    // Handle Custom Export Dimensions
    if (exportSettings?.customWidth && exportSettings?.customHeight) {
        targetWidth = exportSettings.customWidth;
        targetHeight = exportSettings.customHeight;
    }
    let canvas;
    let ctx = null;
    if (typeof OffscreenCanvas !== 'undefined') {
        canvas = new OffscreenCanvas(targetWidth, targetHeight);
        ctx = canvas.getContext('2d');
    }
    else {
        canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        ctx = canvas.getContext('2d');
    }
    if (!ctx) {
        throw new Error('Failed to create compositing canvas context');
    }
    // 2. Draw Backdrop
    if (backdropType === 'solid') {
        ctx.fillStyle = solidColor;
        ctx.fillRect(0, 0, targetWidth, targetHeight);
    }
    else if (backdropType === 'studio') {
        const preset = STUDIO_PRESETS.find((p) => p.id === studioPresetId) || STUDIO_PRESETS[0];
        preset.draw(ctx, targetWidth, targetHeight);
    }
    else if (backdropType === 'custom-image' && customBgImage) {
        ctx.drawImage(customBgImage, 0, 0, targetWidth, targetHeight);
    }
    else if (backdropType === 'blur' && originalImage) {
        ctx.save();
        ctx.filter = `blur(${blurRadius}px)`;
        ctx.drawImage(originalImage, -20, -20, targetWidth + 40, targetHeight + 40);
        ctx.restore();
    }
    else {
        // Transparent: clear canvas
        ctx.clearRect(0, 0, targetWidth, targetHeight);
    }
    // 3. Apply Transforms & Draw Foreground Cutout
    ctx.save();
    const centerX = targetWidth / 2;
    const centerY = targetHeight / 2;
    ctx.translate(centerX, centerY);
    if (transforms) {
        if (transforms.rotation) {
            ctx.rotate((transforms.rotation * Math.PI) / 180);
        }
        const scaleX = transforms.flipH ? -1 : 1;
        const scaleY = transforms.flipV ? -1 : 1;
        ctx.scale(scaleX, scaleY);
    }
    // Calculate draw dimensions respecting padding
    const paddingPercent = transforms?.padding ? transforms.padding / 100 : 0;
    const drawWidth = width * (1 - paddingPercent);
    const drawHeight = height * (1 - paddingPercent);
    ctx.drawImage(cutoutImage, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
    ctx.restore();
    // 4. Export Blob with requested Format & Quality
    const format = exportSettings?.format || (backdropType === 'transparent' ? 'png' : 'jpeg');
    const quality = exportSettings?.quality ?? 0.95;
    const mimeType = format === 'png' ? 'image/png' : format === 'webp' ? 'image/webp' : 'image/jpeg';
    if (canvas instanceof OffscreenCanvas) {
        return await canvas.convertToBlob({
            type: mimeType,
            quality
        });
    }
    else {
        return await new Promise((resolve, reject) => {
            canvas.toBlob((b) => {
                if (b)
                    resolve(b);
                else
                    reject(new Error('Failed to convert canvas to blob'));
            }, mimeType, quality);
        });
    }
}
/**
 * Auto-detect the predominant background color by sampling the 4 corners and borders of an image
 */
export function autoDetectBackgroundColor(img) {
    if (typeof document === 'undefined' && typeof OffscreenCanvas === 'undefined') {
        return '#ffffff';
    }
    const isImg = typeof HTMLImageElement !== 'undefined' && img instanceof HTMLImageElement;
    const width = isImg ? (img.naturalWidth || img.width) : img.width || 100;
    const height = isImg ? (img.naturalHeight || img.height) : img.height || 100;
    let sampleCanvas;
    let ctx = null;
    if (typeof OffscreenCanvas !== 'undefined') {
        sampleCanvas = new OffscreenCanvas(Math.min(width, 100), Math.min(height, 100));
        ctx = sampleCanvas.getContext('2d');
    }
    else if (typeof document !== 'undefined') {
        sampleCanvas = document.createElement('canvas');
        sampleCanvas.width = Math.min(width, 100);
        sampleCanvas.height = Math.min(height, 100);
        ctx = sampleCanvas.getContext('2d');
    }
    else {
        return '#ffffff';
    }
    if (!ctx || typeof ctx.getImageData !== 'function')
        return '#ffffff';
    ctx.drawImage(img, 0, 0, sampleCanvas.width, sampleCanvas.height);
    const data = ctx.getImageData(0, 0, sampleCanvas.width, sampleCanvas.height).data;
    // Sample corner pixel colors: top-left, top-right, bottom-left, bottom-right
    const sw = sampleCanvas.width;
    const sh = sampleCanvas.height;
    const sampleIndices = [
        0, // (0,0)
        (sw - 1) * 4, // (sw-1, 0)
        ((sh - 1) * sw) * 4, // (0, sh-1)
        ((sh - 1) * sw + (sw - 1)) * 4 // (sw-1, sh-1)
    ];
    let rSum = 0;
    let gSum = 0;
    let bSum = 0;
    for (const idx of sampleIndices) {
        rSum += data[idx] ?? 255;
        gSum += data[idx + 1] ?? 255;
        bSum += data[idx + 2] ?? 255;
    }
    const r = Math.round(rSum / sampleIndices.length).toString(16).padStart(2, '0');
    const g = Math.round(gSum / sampleIndices.length).toString(16).padStart(2, '0');
    const b = Math.round(bSum / sampleIndices.length).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
}
