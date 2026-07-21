import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF Editor | KV",
  description: "View and annotate PDF documents locally. Add text, freehand drawings, and black out sensitive data securely in your browser.",
  keywords: ["pdf editor", "annotate pdf", "draw on pdf", "edit pdf", "pdf tools"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
