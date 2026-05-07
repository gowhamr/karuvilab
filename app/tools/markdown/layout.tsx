import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Markdown Editor | KaruviLab",
  description: "Live-preview Markdown editor with side-by-side rendering. Export as HTML.",
  keywords: ["markdown editor", "markdown preview", "markdown to html", "live markdown", "md editor"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
