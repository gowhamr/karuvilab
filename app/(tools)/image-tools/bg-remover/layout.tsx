import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Background Remover | KaruviLab",
  description: "Remove image backgrounds locally in your browser using smart color detection. No data leaves your device.",
  keywords: ["background remover", "remove background", "transparent background", "image background", "bg remover"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
