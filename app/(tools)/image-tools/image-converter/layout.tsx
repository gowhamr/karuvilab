import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image Format Converter | KaruviLab",
  description: "Convert images between JPG, PNG, WebP, and BMP formats entirely in your browser.",
  keywords: ["image converter", "jpg to png", "png to webp", "image format converter", "convert image"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
