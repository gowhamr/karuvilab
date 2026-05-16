import { ToolContent } from '../../registry/types';

export const splitPdf: ToolContent = {
  detailedDescription:
    "Extract specific pages or page ranges from a PDF to create new, smaller documents. Built on pdf-lib running locally in the browser — your PDF is never uploaded anywhere. Useful for sharing only the relevant pages of a large document.",
  howTo: [
    "Upload your PDF file.",
    "Enter the pages or page ranges to extract (e.g., `1-3, 5, 8-10`).",
    "Click 'Split'.",
    "Download the extracted pages as a new PDF.",
  ],
  faq: [
    {
      question: "Can I split every page into a separate PDF?",
      answer:
        "Yes. Select 'Extract each page' mode to get one PDF file per page, packaged in a ZIP download.",
    },
    {
      question: "Does the page numbering start at 1?",
      answer:
        "Yes. Page numbers in the tool are 1-indexed to match the physical page order.",
    },
    {
      question: "Are annotations and form fields preserved?",
      answer:
        "Basic annotations are preserved. Complex interactive forms may not retain all functionality after splitting.",
    },
  ],
  useCases: [
    "Extracting a single chapter from a large eBook PDF",
    "Sharing specific slides from a PDF presentation",
    "Separating receipts from a merged expense report",
    "Extracting a signed signature page from a contract",
  ],
  commonErrors: [
    {
      error: "Entered page number is out of range",
      fix: "The tool shows the total page count after upload. Ensure your page numbers do not exceed this count.",
    },
    {
      error: "Downloaded ZIP is empty",
      fix: "Check that 'Extract each page' was selected and the PDF loaded correctly. Re-upload and try again.",
    },
  ],
  alternatives: ["Smallpdf.com", "ilovepdf.com", "PDFtk (CLI)"],
};
