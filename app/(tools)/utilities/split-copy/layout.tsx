import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Split & Copy Tool | KaruviLab",
  description: "Break long text into equal-sized chunks and copy each part individually to clipboard.",
  keywords: ["split text", "text splitter", "copy text chunks", "split copy", "text divider"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
