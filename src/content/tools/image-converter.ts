import { ToolContent } from '../../registry/types';

export const imageConverter: ToolContent = {
  detailedDescription:
    "Convert images between JPEG, PNG, WebP, and BMP formats using the browser's Canvas API. Simply upload an image, choose the output format, and download the converted file. No file is ever sent to a server — conversion is entirely local.",
  howTo: [
    "Upload an image by clicking or dragging it into the tool.",
    "Select the target format from the dropdown (JPEG, PNG, WebP, BMP).",
    "Adjust quality if converting to a lossy format like JPEG or WebP.",
    "Click 'Convert' and then 'Download' to save the output.",
  ],
  faq: [
    {
      question: "Will converting to JPEG lose quality?",
      answer:
        "Yes. JPEG is a lossy format. Each re-encoding introduces some quality loss. Use the quality slider to balance size and fidelity.",
    },
    {
      question: "Can I convert a WebP image to JPEG?",
      answer:
        "Yes. The tool handles WebP input natively in modern browsers (Chrome, Edge, Firefox).",
    },
    {
      question: "Does Safari support WebP?",
      answer:
        "Safari 14+ supports WebP. If you need compatibility with older Safari versions, convert to PNG or JPEG instead.",
    },
  ],
  useCases: [
    "Converting a PNG screenshot to JPEG to reduce file size",
    "Converting WebP images downloaded from the web to JPEG for compatibility",
    "Preparing images in WebP format for a modern website",
    "Converting BMP images from legacy software to a web-friendly format",
  ],
  commonErrors: [
    {
      error: "Transparent PNG turns white after converting to JPEG",
      fix: "JPEG does not support transparency. The transparent areas are filled with white. Use PNG or WebP to retain transparency.",
    },
    {
      error: "Output file is unexpectedly large",
      fix: "You may be converting from a lossy format to a lossless one (e.g., JPEG → PNG). Lossless formats store all pixel data and are typically larger.",
    },
  ],
  alternatives: ["Squoosh.app", "CloudConvert", "GIMP"],
};
