import { ToolContent } from '../../registry/types';

export const superResolutionContent: ToolContent = {
  detailedDescription: `
<p>The AI Image Upscaler (Super Resolution) uses deep neural network inference (Real-ESRGAN) running 100% locally in your web browser via WebAssembly and WebGPU. It allows you to upscale low-resolution images by 2x or 4x without losing sharpness, introducing blocky artifacts, or sending your private photos to remote cloud servers.</p>

<p>Traditional image interpolation methods like bilinear or bicubic scaling simply stretch existing pixels, resulting in blurry, fuzzy images. Real-ESRGAN uses learned sub-pixel convolutional features to reconstruct fine textures, sharp edges, and photographic details that were lost during compression or downscaling.</p>

<p>Because KaruviLab operates offline-first, your images remain completely private. Model weights are cached securely in IndexedDB after the initial load, giving you instant, serverless upscaling for web graphics, historic photos, and digital art.</p>
`,
  howTo: [
    "<strong>Upload Image:</strong> Drag and drop any low-res JPEG, PNG, or WebP photo into the upload area.",
    "<strong>Select Scale Factor:</strong> Choose between 2x or 4x AI resolution enhancement.",
    "<strong>Run Local AI:</strong> Click 'Enhance Image' to execute Real-ESRGAN inference in a Web Worker thread.",
    "<strong>Compare & Download:</strong> Inspect the before and after split slider, then save your high-resolution PNG."
  ],
  faq: [
    { question: "What AI model is used for super resolution?", answer: "KaruviLab uses Real-ESRGAN quantized ONNX model optimized for in-browser execution." },
    { question: "Are my photos uploaded to a server?", answer: "No. Inference runs 100% locally inside your browser using WebAssembly or WebGPU acceleration." },
    { question: "What image formats are supported?", answer: "PNG, JPEG, WebP, and BMP images up to 4096x4096 pixels." },
    { question: "Does it work offline?", answer: "Yes! Once the model is cached, the upscaler functions fully offline without an internet connection." },
    { question: "How long does 4x upscaling take?", answer: "Upscaling typically takes 2-8 seconds depending on your device GPU/CPU capabilities." }
  ],
  examples: [
    { label: "Low-Res Graphic", input: "500x500 PNG Icon", output: "2000x2000 Sharp PNG", description: "Upscaling small vector graphics and logos without pixelation." },
    { label: "Old Photo Restoration", input: "Compress JPEG Photo", output: "4x High Definition Image", description: "Restoring missing detail and texture in low-resolution portrait photos." },
    { label: "Digital Artwork", input: "720p Render", output: "4K High Resolution Render", description: "Enhancing AI-generated artwork for printing or desktop wallpapers." }
  ]
};

export default superResolutionContent;
