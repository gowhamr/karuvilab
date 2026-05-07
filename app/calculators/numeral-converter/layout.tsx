import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Number Base Converter | KaruviLab",
  description: "Convert numbers between binary, octal, decimal, and hexadecimal bases instantly.",
  keywords: ["number base converter", "binary to decimal", "hex to decimal", "numeral converter", "base conversion"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
