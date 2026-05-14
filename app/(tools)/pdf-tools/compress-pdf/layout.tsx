import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compress PDF | KV",
  description: "Reduce PDF file size in your browser using pdf-lib re-encoding. No uploads needed.",
  keywords: ["compress pdf", "reduce pdf size", "pdf compressor", "smaller pdf", "pdf optimizer"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
