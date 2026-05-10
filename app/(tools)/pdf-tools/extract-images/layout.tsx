import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Extract Images from PDF | KaruviLab",
  description: "Pull all embedded images out of a PDF file and download them as separate files.",
  keywords: ["extract images from pdf", "pdf image extractor", "pdf to images", "save images from pdf"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
