import { ToolEntry } from '../types';

export const pdfBookmarks: ToolEntry = {
  id: "pdf-bookmarks",
  name: "PDF Bookmarks",
  desc: "View and export PDF bookmarks (outline)",
  category: "pdf",
  subCategory: 'Security & Metadata',
  href: "/pdf-tools/pdf-bookmarks/",
  input: "pdf",
  output: "json",
  status: "new",
  keywords: ["pdf", "bookmarks", "outline", "toc", "table of contents"]
};
