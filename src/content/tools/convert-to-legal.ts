import { ToolContent } from '../../registry/types';

export const convertToLegal: ToolContent = {
  detailedDescription: `
The **Convert to Legal PDF** tool instantly resizes any PDF document to the standard US Legal page size (8.5 × 14 inches / 216 × 356 mm). 

US Legal is commonly required for legal documents, contracts, real estate forms, and court filings. If you have an A4 or Letter-sized document that needs to meet strict filing requirements, this tool will automatically adjust the canvas. 

You can choose to dynamically **Scale to Fit** (scaling the contents to perfectly match the new dimensions) or disable scaling to keep the original content size while simply extending the canvas borders. The tool even features smart **Orientation Detection**, automatically detecting if your PDF pages are Portrait or Landscape to ensure they resize cleanly without squashing.

All processing occurs strictly inside your browser. No files are uploaded to any server.
`,
  howTo: [
    "**Step 1:** Upload your target PDF file.",
    "**Step 2:** Choose the Orientation (Auto is recommended to match the original document).",
    "**Step 3:** Check or uncheck 'Scale to Fit' based on whether you want the text to enlarge.",
    "**Step 4:** Click **Convert to Legal** to process the file instantly.",
    "**Step 5:** The new PDF will download automatically to your device."
  ],
  faq: [
    {
      question: "What is US Legal size?",
      answer: "US Legal size is 8.5 by 14 inches (216 × 356 mm). It is exactly 3 inches longer than standard US Letter size, providing extra space often required for signatures and lengthy legal clauses."
    },
    {
      question: "Is my document secure?",
      answer: "Yes, 100%. The conversion runs locally using Web Workers. Your files are never transmitted over the internet."
    },
    {
      question: "What does 'Scale to Fit' do?",
      answer: "When enabled, it stretches or shrinks your text and images proportionally so they take up the full Legal page. When disabled, it places your original page directly in the center of the new, larger Legal canvas."
    }
  ],
  useCases: [
    "Preparing documents for court filings that mandate strictly US Legal dimensions.",
    "Standardizing a mixed-size PDF containing both A4 and Letter pages into a uniform Legal format.",
    "Printing documents cleanly on a Legal-sized printer tray without unexpected cropping."
  ],
  alternatives: ["Convert to A4", "Convert to Letter", "PDF Resize Tool"]
};
