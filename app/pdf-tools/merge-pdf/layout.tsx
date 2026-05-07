import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Merge PDF | KaruviLab",
  description: "Combine multiple PDF files into a single document. Drag to reorder pages before merging.",
  keywords: ["merge pdf", "combine pdf", "join pdf", "pdf merger", "merge pdf files"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
