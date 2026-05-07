import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF to Word Converter | KaruviLab",
  description: "Extract text content from PDF files and convert to editable Word-compatible format.",
  keywords: ["pdf to word", "pdf to docx", "convert pdf word", "pdf text extractor", "pdf converter"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
