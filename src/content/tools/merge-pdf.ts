import { ToolContent } from '../../registry/types';

export const mergePdf: ToolContent = {
  detailedDescription:
    "Combine multiple PDF files into a single document in any order using pdf-lib running in your browser. Drag and drop files to reorder them before merging. No files are sent to a server — merging is entirely local.",
  howTo: [
    "Upload two or more PDF files using the file picker or drag-and-drop.",
    "Drag the files in the list to set the desired page order.",
    "Click 'Merge PDFs'.",
    "Download the merged PDF when processing completes.",
  ],
  faq: [
    {
      question: "Is there a limit on the number of files I can merge?",
      answer:
        "There is no hard limit, but very large or numerous PDFs may exhaust browser memory. Merging up to 20 typical documents is generally reliable.",
    },
    {
      question: "Are bookmarks and links preserved?",
      answer:
        "Internal links may break after merging since page numbers shift. External links and basic content are preserved.",
    },
    {
      question: "Can I merge password-protected PDFs?",
      answer:
        "No. Encrypted PDFs must be unlocked first. Use a PDF reader to remove the password, then merge.",
    },
  ],
  useCases: [
    "Combining multiple invoice PDFs into a single monthly report",
    "Assembling chapters of a document written in separate files",
    "Merging a cover page with a main document",
    "Combining form pages before submission",
  ],
  commonErrors: [
    {
      error: "Some pages are blank in the merged PDF",
      fix: "The source PDF may have blank pages intentionally, or it uses features (like embedded forms) that pdf-lib renders as blank. Inspect the source files.",
    },
    {
      error: "Merge fails with a large number of files",
      fix: "Split the task into two batches. Merge the first half, then merge that result with the second half.",
    },
  ],
  alternatives: ["Smallpdf.com", "ilovepdf.com", "PDFtk (CLI)"],
};
