import { ToolContent } from '../../registry/types';

export const tiffConverter: ToolContent = {
  detailedDescription:
    "Convert images to and from the professional TIFF format directly in your browser. Upload TIFF files to export as web-friendly PNG, JPEG, or WebP formats, or upload standard images to encode them into high-fidelity TIFF format. Processed 100% locally with zero server uploads.",
  howTo: [
    "Upload a TIFF or standard image file by dragging and dropping or browsing.",
    "The tool automatically detects input format and configures target format.",
    "Select desired output format (PNG, JPEG, WebP, or TIFF) and adjust quality if applicable.",
    "Preview original and converted images side-by-side with file size comparison.",
    "Click 'Download Converted Image' to save the file."
  ],
  faq: [
    {
      question: "What is TIFF used for?",
      answer: "TIFF (Tagged Image File Format) is a professional, high-quality image format widely used in photography, digital publishing, archiving, and graphic design due to its lossless compression and rich color space support."
    },
    {
      question: "Can standard web browsers display TIFF files?",
      answer: "Most web browsers cannot display native TIFF images directly in standard image tags. This tool decodes TIFF files locally using JavaScript & WebAssembly to render a browser-compatible preview."
    },
    {
      question: "Are my images uploaded to any server?",
      answer: "No. All decoding and encoding calculations happen entirely in your browser using local memory. Your images never leave your device."
    }
  ],
  useCases: [
    "Converting TIFF photos from professional cameras to web formats (PNG/JPEG/WebP)",
    "Converting Web PNG or JPEG images into uncompressed TIFF format for print publishing",
    "Previewing TIFF image contents instantly in any modern browser without downloading heavy desktop software"
  ],
  commonErrors: [
    {
      error: "TIFF file fails to load or shows invalid structure error",
      fix: "Ensure the file is a valid 8-bit or standard RGBA TIFF file. Multi-layer proprietary camera raw files should be exported as standard TIFF."
    }
  ],
  alternatives: ["Adobe Photoshop", "GIMP", "ImageMagick"]
};
