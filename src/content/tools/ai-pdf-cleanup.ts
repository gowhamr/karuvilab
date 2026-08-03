import { ToolContent } from '../../registry/types';

export const aiPdfCleanupContent: ToolContent = {
  detailedDescription: `
<p>AI PDF Cleanup & Document Intelligence automatically cleans, deskews, denoises, and enhances scanned PDF documents in your browser. It restores faded text contrast, removes background shadows and punch holes, and generates searchable PDF documents with OCR text layer positioning.</p>

<p>Scanned documents often suffer from rotation skew, gray background shadows, low contrast, and noise artifacts that make reading difficult and break text searchability. KaruviLab's Document Intelligence pipeline processes pages off the main thread in a Web Worker, performing computer vision transformations and local OCR text extraction.</p>

<p>Because processing is 100% offline and client-side, confidential legal documents, medical records, and financial statements are cleaned safely with zero server transmission or data privacy risks.</p>
`,
  howTo: [
    "<strong>Upload PDF:</strong> Select a scanned or degraded PDF file from your computer.",
    "<strong>Select Enhancement Mode:</strong> Choose Auto-Deskew, Denoise Background, or High-Contrast Text.",
    "<strong>Run Document Intelligence:</strong> Click 'Process & Clean PDF' to run page transformations.",
    "<strong>Download Clean PDF:</strong> Preview the restored pages and download your searchable, high-contrast PDF."
  ],
  faq: [
    { question: "Does it make scanned PDFs searchable?", answer: "Yes! The tool extracts text positions via OCR and embeds a searchable text layer into the output PDF." },
    { question: "Are confidential documents uploaded to any server?", answer: "No. The document processing pipeline runs 100% locally in your browser." },
    { question: "What document issues does it fix?", answer: "Auto-deskew (rotation alignment), background shadow removal, contrast boost, and hole punch removal." },
    { question: "Does it work with multi-page PDFs?", answer: "Yes. Multi-page PDFs are processed page-by-page off the main thread." },
    { question: "What export formats are supported?", answer: "Cleaned PDF, Plain Text, and Markdown." }
  ],
  examples: [
    { label: "Scanned Receipt / Contract", input: "Crooked gray PDF scan", output: "Cleaned, Straight, High-Contrast PDF", description: "Deskewing crooked scans and removing gray background shadows." },
    { label: "Book / Document Scan", input: "Faded text scan", output: "Searchable PDF with Text Layer", description: "Restoring faded text readability and enabling text search." },
    { label: "Invoice Processing", input: "Low contrast PDF", output: "Sharp, Black & White PDF", description: "Binarizing background noise for crisp archival printing." }
  ]
};

export default aiPdfCleanupContent;
