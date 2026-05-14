import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Open Graph Preview | KV",
  description: "Preview how your Open Graph meta tags appear when shared on Facebook, Twitter, and LinkedIn.",
  keywords: ["og preview", "open graph preview", "social media preview", "og tags preview", "link preview"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
