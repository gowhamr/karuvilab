import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image Resizer | KaruviLab",
  description: "Resize images to exact pixel dimensions while preserving aspect ratio. All processing is local.",
  keywords: ["image resizer", "resize image", "image dimensions", "scale image", "resize photo"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
