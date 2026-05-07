import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF Page Numbering | KaruviLab",
  description: "Add automatic page numbers to any PDF with custom position, font size, and starting number.",
  keywords: ["pdf page numbers", "add page numbers pdf", "page numbering", "pdf pagination"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
