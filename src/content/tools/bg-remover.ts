import { ToolContent } from '../../registry/types';

export const bgRemover: ToolContent = {
  detailedDescription:
    "Remove solid-color backgrounds from images using color-tolerance-based pixel replacement directly in the browser canvas. Best suited for images with a uniform background color (e.g., white product photos). More complex backgrounds may need a dedicated AI tool. No image is uploaded to any server.",
  howTo: [
    "Upload your image using the file picker.",
    "Click the background color (or use the color picker to specify it).",
    "Adjust the color tolerance slider to control how aggressively similar colors are removed.",
    "Preview the result — the removed area is shown as a transparent checkerboard.",
    "Download the image as a PNG (transparency is preserved).",
  ],
  faq: [
    {
      question: "Does this use AI to remove backgrounds?",
      answer:
        "No. The tool uses color-based pixel matching, which works well for uniform backgrounds but not complex or gradient backgrounds. For AI removal, see the alternatives.",
    },
    {
      question: "Why are parts of the subject being removed?",
      answer:
        "The tolerance is too high, removing pixels with colors similar to the background. Reduce the tolerance slider.",
    },
    {
      question: "What output format preserves transparency?",
      answer:
        "Download as PNG. JPEG does not support transparency.",
    },
  ],
  useCases: [
    "Removing the white background from product photos",
    "Isolating a logo from a solid-color background",
    "Preparing images for a transparent overlay on a slide deck",
    "Cleaning up scanned documents with a uniform background",
  ],
  commonErrors: [
    {
      error: "Background partially removed with visible fringe",
      fix: "Increase the tolerance slightly. If fringe persists, use a higher-quality source image with a cleaner background.",
    },
    {
      error: "Subject has the same color as the background",
      fix: "Color-based removal cannot distinguish subject from background in this case. Use an AI background removal tool instead.",
    },
  ],
  alternatives: ["remove.bg", "Adobe Express Background Remover", "Canva Background Remover"],
};
