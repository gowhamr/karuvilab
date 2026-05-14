import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image to PDF Converter | KV",
  description: "Convert one or more images (JPG, PNG) into a single PDF file, all in your browser.",
  keywords: ["image to pdf", "jpg to pdf", "png to pdf", "photos to pdf", "images to pdf converter"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
