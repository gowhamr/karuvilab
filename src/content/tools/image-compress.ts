import { ToolContent } from '../../registry/types';

export const imageCompress: ToolContent = {
  detailedDescription:
    "Reduce image file sizes using HTML5 Canvas re-encoding with adjustable quality settings. Supports JPEG, PNG, and WebP inputs. Preview the compressed image and compare file sizes before downloading. All processing happens in your browser — images are never uploaded.",
  howTo: [
    "Click or drag-and-drop an image file onto the upload area.",
    "Adjust the quality slider (lower = smaller file, higher = better quality).",
    "Preview the result side by side with the original.",
    "Click 'Download' to save the compressed image.",
  ],
  faq: [
    {
      question: "What formats are supported?",
      answer:
        "Input: JPEG, PNG, WebP, BMP. Output: JPEG or WebP (lossy), PNG (lossless). PNG compression has limits since PNG is already lossless.",
    },
    {
      question: "Why isn't the PNG getting smaller?",
      answer:
        "PNG is a lossless format. Canvas re-encoding cannot reduce its size the way JPEG quality reduction can. Consider converting to WebP for better compression.",
    },
    {
      question: "Is there a file size limit?",
      answer:
        "Very large images (over 20 MP) may slow or crash the browser tab due to canvas memory limits. Resize the image first if needed.",
    },
  ],
  useCases: [
    "Compressing product photos before uploading to an online store",
    "Reducing blog post images to improve page load speed",
    "Shrinking screenshots for email attachments",
    "Optimizing images to pass a website performance audit",
  ],
  commonErrors: [
    {
      error: "Compressed file is larger than the original",
      fix: "This can happen if the original JPEG was already highly compressed. Lower the quality setting further or try WebP output.",
    },
    {
      error: "Transparent areas turn black after compression",
      fix: "JPEG does not support transparency. Use PNG or WebP output format to preserve alpha channels.",
    },
  ],
  alternatives: ["Squoosh.app", "TinyPNG", "ImageOptim (macOS)"],
};
