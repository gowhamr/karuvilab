/**
 * KaruviLab (KV) AI Background Remover - Constants & Model Config
 * Rule AI-01: Framework owns infrastructure, features own intelligence
 */
export const RMBG_MODEL_MANIFEST = {
    id: 'background-removal-rmbg',
    name: 'RMBG 2.0 (Quantized)',
    version: '2.0',
    file: '/models/rmbg-2.0.onnx',
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
