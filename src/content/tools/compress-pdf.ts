import { ToolContent } from '../../registry/types';

export const compressPdf: ToolContent = {
  detailedDescription:
    "Reduce the file size of a PDF by re-encoding it using pdf-lib in the browser. Removes redundant objects and optionally recompresses embedded images. The original file is never uploaded — all processing happens locally in your browser tab.",
  howTo: [
    "Click 'Upload PDF' and select your file.",
    "Choose a compression level (low, medium, high).",
    "Click 'Compress' and wait for processing to complete.",
    "Compare the original and compressed file sizes shown.",
    "Click 'Download' to save the compressed PDF.",
  ],
  faq: [
    {
      question: "How much smaller will the PDF get?",
      answer:
        "Results vary. PDFs with embedded high-resolution images can shrink significantly. Text-only PDFs may see little reduction since text is already compact.",
    },
    {
      question: "Will the compressed PDF look different?",
      answer:
        "At low compression, the visual difference is minimal. At high compression, embedded images may appear softer. Text quality is unaffected.",
    },
    {
      question: "Is the PDF uploaded to a server?",
      answer:
        "No. The PDF is processed entirely in your browser using pdf-lib compiled to WebAssembly. Nothing is transmitted.",
    },
    {
      question: "Does this work with password-protected PDFs?",
      answer:
        "No. Encrypted or password-protected PDFs cannot be processed without the password.",
    },
  ],
  useCases: [
    "Shrinking a large PDF report before emailing it",
    "Reducing a portfolio PDF to meet an upload size limit",
    "Compressing scanned document PDFs for archiving",
    "Preparing a PDF for uploading to a web form with file size restrictions",
  ],
  commonErrors: [
    {
      error: "Compressed file is the same size as the original",
      fix: "The PDF may already be well-optimized. Text-heavy PDFs with minimal images have little room for compression.",
    },
    {
      error: "PDF becomes corrupted after compression",
      fix: "Some PDFs use non-standard structures that pdf-lib cannot safely process. Try with a different PDF or use a desktop tool.",
    },
  ],
  alternatives: ["Smallpdf.com", "ilovepdf.com", "Ghostscript (CLI)"],
};
