/**
 * KaruviLab (KV) AI Super Resolution - Constants & Config
 */
export const ESRGAN_MODEL_MANIFEST = {
    id: 'super-resolution-esrgan',
    name: 'Real-ESRGAN 4x Upscaler',
    version: '4.0',
    file: '/models/realesrgan-4x.onnx',
    sha256: 'f8723939c05878d6b9d6a3666d6268800938f328a6f3a61f237890a88e89f99',
    sizeMB: 24.1,
    backend: ['webgpu', 'wasm'],
    input: { width: 256, height: 256, channels: 3, dataType: 'float32', shape: [1, 3, 256, 256] },
    output: { width: 1024, height: 1024, channels: 3, dataType: 'float32', shape: [1, 3, 1024, 1024] },
    category: 'super-resolution',
    inputFormats: ['png', 'jpg', 'webp'],
    outputFormats: ['png', 'jpg'],
    preferredBackend: 'webgpu',
    supportsBatch: false,
    supportsOffline: true,
    estimatedMemoryMB: 220,
    estimatedInferenceMs: 1800,
    description: '2x / 4x AI image upscaling and clarity enhancement.',
    license: 'BSD-3-Clause'
};
