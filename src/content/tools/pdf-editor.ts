import { ToolContent } from '../../registry/types';

export const pdfEditor: ToolContent = {
  detailedDescription: `
The **PDF Editor** is KaruviLab's flagship document manipulation tool. It allows you to seamlessly add text, draw freehand, insert shapes, highlight content, and blackout sensitive information directly on your PDF pages—all within your browser.

In line with KaruviLab's privacy-first philosophy, this tool uses the powerful \`pdf-lib\` and Web Workers to process your documents locally. **Your PDF files are never uploaded to any cloud server.** Whether you're filling out a form, signing a contract, or redacting sensitive financial data, you can do it securely offline.
`,
  howTo: [
    "**Step 1:** Upload your PDF file. The document will be rendered immediately in the browser.",
    "**Step 2:** Use the left sidebar to navigate between pages via thumbnails.",
    "**Step 3:** Select a tool from the floating toolbar (Text, Draw, Highlight, Blackout, etc.).",
    "**Step 4:** Click or drag on the page to place and adjust your annotations.",
    "**Step 5:** Click **Save PDF** to instantly download the modified document with all annotations flattened and embedded."
  ],
  faq: [
    {
      question: "Are my PDFs uploaded to a server?",
      answer: "No. The entire editing and saving process happens completely locally in your device's memory using Web Workers."
    },
    {
      question: "Can I undo mistakes?",
      answer: "Yes, you can select any annotation you've placed and delete it using the trash icon before saving the PDF."
    },
    {
      question: "Is the Blackout tool secure?",
      answer: "Yes. The blackout tool draws an opaque black rectangle over the selected area. However, it does not permanently strip underlying text data from the raw PDF streams. For absolute redaction of classified documents, professional redaction software is recommended."
    }
  ],
  useCases: [
    "Filling out non-fillable PDF forms (like government or tax documents).",
    "Signing contracts by using the Draw tool.",
    "Redacting (blacking out) sensitive information like SSNs or bank numbers before sharing.",
    "Adding notes or highlighting important sections for students and researchers."
  ],
  commonErrors: [
    {
      error: "PDF fails to load or render",
      fix: "This can happen if the PDF is password-protected or heavily encrypted. Use the 'Unlock PDF' tool first to remove the password."
    }
  ],
  alternatives: ["Adobe Acrobat", "Smallpdf (Server-based)", "Preview (macOS)"]
};
