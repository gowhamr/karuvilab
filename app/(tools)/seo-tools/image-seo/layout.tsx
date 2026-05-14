import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image SEO Optimizer | KV",
  description: "Analyze and optimize image filenames and alt text for better search engine visibility.",
  keywords: ["image seo", "image alt text", "image optimization", "seo images", "image metadata"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
