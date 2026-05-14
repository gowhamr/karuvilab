import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HTML Entities Converter | KV",
  description: "Convert special characters to HTML entities and decode HTML entities back to text.",
  keywords: ["html entities", "html escape", "html encode", "html decode", "special characters html"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
