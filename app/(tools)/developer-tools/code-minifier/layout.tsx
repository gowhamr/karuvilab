import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Code Minifier | KV",
  description: "Minify CSS, JavaScript, and HTML to reduce file size and improve page load performance.",
  keywords: ["code minifier", "css minifier", "js minifier", "html minifier", "minify code"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
