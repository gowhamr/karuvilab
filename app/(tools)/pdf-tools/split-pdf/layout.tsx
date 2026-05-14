import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Split PDF | KV",
  description: "Extract specific pages or page ranges from a PDF into a new file.",
  keywords: ["split pdf", "extract pdf pages", "pdf splitter", "pdf page extractor", "split pdf online"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
