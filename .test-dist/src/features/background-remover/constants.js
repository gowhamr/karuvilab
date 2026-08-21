/**
 * KaruviLab (KV) AI Background Remover - Constants & Model Config
 * Rule AI-01: Framework owns infrastructure, features own intelligence
 */
export const RMBG_MODEL_MANIFEST = {
    id: 'background-removal-rmbg',
    name: 'RMBG 2.0 (Quantized)',
    version: '2.0',
    file: '/models/rmbg-2.0.onnx',
    cdnUrls: [
        'https://huggingface.co/briaai/RMBG-1.4/resolve/main/onnx/model.onnx',
        'https://huggingface.co/Xenova/birefnet-general/resolve/main/onnx/model_quantized.onnx'
    ],
    fallbackModelId: 'u2netp-mobile',
    sha256: '8cafcf770b06757c4eaced21b1a88e57fd2b66de01b8045f35f01535ba742e0f',
    sizeMB: 168,
    backend: ['webgpu', 'wasm'],
    input: {
        width: 1024,
        height: 1024,
        channels: 3,
        dataType: 'float32'
    },
    output: {
        channels: 1,
        dataType: 'float32'
    },
    category: 'segmentation',
    inputFormats: ['png', 'jpg', 'webp'],
    outputFormats: ['png'],
    preferredBackend: 'webgpu',
    supportsBatch: false,
    supportsOffline: true,
    estimatedMemoryMB: 180,
    estimatedInferenceMs: 1200,
    description: 'High-accuracy in-browser portrait & object background removal model.',
    license: 'Open-Rail'
};
export const U2NETP_MODEL_MANIFEST = {
    id: 'u2netp-mobile',
    name: 'U²-NetP Ultra-Fast Mobile',
    version: '1.0',
    file: '/models/u2netp.onnx',
    cdnUrls: [
        'https://huggingface.co/Xenova/u2netp/resolve/main/onnx/model_quantized.onnx'
    ],
    sha256: '309c8469258dda742793dce0ebea8e6dd393174f89934733ecc8b14c76f4ddd8',
    sizeMB: 4.7,
    backend: ['wasm'],
    input: {
        width: 320,
        height: 320,
        channels: 3,
        dataType: 'float32'
    },
    output: {
        channels: 1,
        dataType: 'float32'
    },
    category: 'segmentation',
    inputFormats: ['png', 'jpg', 'webp'],
    outputFormats: ['png'],
    preferredBackend: 'wasm',
    supportsBatch: true,
    supportsOffline: true,
    estimatedMemoryMB: 45,
    estimatedInferenceMs: 180,
    description: 'Lightweight pruned U2-Net model optimized for mobile & desktop browsers.',
    license: 'Apache-2.0'
};
