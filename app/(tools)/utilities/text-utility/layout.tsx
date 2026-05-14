import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Text Utility | KV",
  description: "Transform and analyze text — case conversion, word count, whitespace cleanup, reverse text, and more.",
  keywords: ["text utility", "text tools", "word counter", "case converter", "text transformer"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
