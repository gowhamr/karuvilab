import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Code Formatter | KaruviLab",
  description: "Auto-format code in multiple languages including JavaScript, CSS, HTML, JSON, SQL, and Markdown.",
  keywords: ["code formatter", "prettier", "format code", "beautify code", "js formatter", "css formatter"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
