import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image to Base64 Converter | KaruviLab",
  description: "Encode any image as a Base64 data URI for embedding directly in HTML, CSS, or JSON.",
  keywords: ["image to base64", "base64 image", "data uri", "image encoder", "base64 encode image"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
