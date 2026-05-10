import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON Formatter & Validator | KaruviLab",
  description: "Beautify, minify, and validate JSON with syntax highlighting and an interactive tree view.",
  keywords: ["json formatter", "json validator", "json beautifier", "format json", "json parser"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
