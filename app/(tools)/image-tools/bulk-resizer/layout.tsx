import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bulk Image Resizer | KaruviLab",
  description: "Resize multiple images at once to custom dimensions. Batch processing done entirely in your browser.",
  keywords: ["bulk image resizer", "batch image resize", "resize multiple images", "bulk resize", "batch photo resize"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
