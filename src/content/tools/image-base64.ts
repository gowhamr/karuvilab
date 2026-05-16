import { ToolContent } from '../../registry/types';

export const imageBase64: ToolContent = {
  detailedDescription:
    "Convert any image file to a Base64-encoded data URI that can be embedded directly in HTML, CSS, or JSON without referencing an external file. Also decodes data URIs back to downloadable image files. Processing is entirely local — your images are not uploaded anywhere.",
  howTo: [
    "Upload an image file using the file picker.",
    "The Base64 data URI is generated and displayed in the output field.",
    "Copy the full data URI (including the `data:image/...;base64,` prefix) for use in your code.",
    "To decode, paste a data URI into the input and click 'Decode' to download the image.",
  ],
  faq: [
    {
      question: "When should I embed images as Base64?",
      answer:
        "Base64 is useful for small icons and images to eliminate HTTP requests. Avoid it for large images — Base64 adds ~33% overhead to file size.",
    },
    {
      question: "Does it work with SVG files?",
      answer:
        "Yes. SVG can be Base64-encoded, though for SVG it is often more efficient to embed the raw XML directly in HTML.",
    },
    {
      question: "What is the maximum image size?",
      answer:
        "There is no hard limit, but browsers may struggle with very large files. Keep Base64-embedded images under 100 KB for best performance.",
    },
  ],
  useCases: [
    "Embedding a logo in a single-file HTML email template",
    "Inlining a small icon in a CSS `background-image` property",
    "Storing an image in a JSON configuration file",
    "Creating a self-contained HTML page with no external assets",
  ],
  examples: [
    {
      label: "Small PNG to data URI",
      input: "1×1 red pixel PNG",
      output: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI6QAAAABJRU5ErkJggg==",
    },
  ],
  commonErrors: [
    {
      error: "Image does not display in the browser when using the data URI",
      fix: "Ensure the MIME type in the data URI matches the actual file type (e.g., `data:image/png` for a PNG file).",
    },
    {
      error: "Data URI is too long for the use case",
      fix: "Large images produce very long data URIs. Host the image separately and reference it with a normal URL instead.",
    },
  ],
  alternatives: ["Base64Guru.com", "CyberChef", "CSS-Tricks data URI tool"],
};
