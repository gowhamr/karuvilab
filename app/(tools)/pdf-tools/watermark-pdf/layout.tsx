import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Watermark PDF | KV",
  description: "Add a custom text or image watermark to your PDF pages in seconds, without uploading.",
  keywords: ["watermark pdf", "add watermark", "pdf stamp", "pdf watermark", "text watermark"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
