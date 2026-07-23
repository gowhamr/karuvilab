import { ToolEntry } from '../types';

export const pdfAttachments: ToolEntry = {
  id: "pdf-attachments",
  name: "PDF Attachments",
  desc: "Extract embedded files and attachments from PDFs",
  category: "pdf",
  href: "/pdf-tools/pdf-attachments",
  input: "pdf",
  output: "any-file",
  status: "new",
  keywords: ["pdf", "attachments", "extract", "embedded", "files"]
};
