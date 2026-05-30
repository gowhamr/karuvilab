import { ToolContent } from '../../registry/types';

export const compressPdf: ToolContent = {
  detailedDescription: `
<p>The KaruviLab PDF Compressor is a secure, browser-native tool designed to reduce the file size of your PDF documents instantly. Whether you need to meet file size limits for email attachments, online job applications, or web uploads, this tool helps you optimize your PDFs without compromising document quality.</p>

<p>Traditional PDF compression tools often require you to upload your documents to a cloud server, raising significant privacy concerns. KaruviLab operates on a zero-upload, local-first principle. Your PDF files are processed entirely within your web browser, ensuring your sensitive business documents, contracts, and personal records stay strictly on your device.</p>

<p>Our compressor uses advanced algorithms to identify redundant data and efficiently pack your document, delivering a significantly smaller file while retaining text readability and image clarity. It is the perfect solution for anyone managing large document libraries and wanting to balance performance with data privacy.</p>
`,
  howTo: [
    "<strong>Upload:</strong> Click the 'Upload PDF' button to select your document.",
    "<strong>Configure:</strong> Choose your preferred compression level (Low, Medium, or High) based on your needs.",
    "<strong>Compress:</strong> Hit the 'Compress' button to start the local optimization process.",
    "<strong>Review & Download:</strong> Once complete, compare the original and new file sizes, then click 'Download' to save the optimized PDF to your device.",
  ],
  faq: [
    {
      question: "Is this process secure?",
      answer: "Yes. All processing occurs locally in your browser. Your files are never uploaded to any server.",
    },
    {
      question: "Will the image quality drop?",
      answer: "We strive to preserve as much visual fidelity as possible. The compression focuses on removing redundant metadata and optimizing image data that is often unnecessarily large in digital PDFs.",
    },
    {
      question: "Can I compress password-protected files?",
      answer: "Currently, our compressor works best with standard, unprotected PDFs. Please unlock your file before compression.",
    },
    {
      question: "Is there a limit on file size?",
      answer: "To ensure browser stability, we suggest files under 50MB. Larger documents may require more browser memory and can lead to performance issues on mobile devices.",
    },
  ],
  useCases: [
    "Reducing PDF size for email attachments that exceed provider limits.",
    "Preparing documents for fast uploading to online job portals.",
    "Archiving old digital paperwork while minimizing storage usage.",
    "Optimizing documents for mobile viewing where bandwidth is limited.",
  ],
  examples: [
    {
      input: "15MB scanned invoice PDF",
      output: "3MB optimized PDF",
      description: "Significantly reduces the size of document scans without sacrificing readability."
    }
  ],
  commonErrors: [
    {
      error: "Document text became blurry",
      fix: "If text or images are not readable, the compression parameters may be too aggressive. This is rare in standard document PDFs but can happen if the original had very high-res embedded graphics.",
    },
  ],
  alternatives: ["Adobe Acrobat Compressor", "SmallPDF", "ILovePDF"],
};
