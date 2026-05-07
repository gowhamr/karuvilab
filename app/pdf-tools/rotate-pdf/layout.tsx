import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rotate PDF | KaruviLab",
  description: "Rotate individual pages or all pages in a PDF by 90°, 180°, or 270°.",
  keywords: ["rotate pdf", "pdf rotate", "flip pdf", "pdf orientation", "rotate pdf pages"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
