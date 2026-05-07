import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meta Tags Generator | KaruviLab",
  description: "Generate SEO-friendly HTML meta tags including Open Graph, Twitter Cards, and canonical tags.",
  keywords: ["meta tags generator", "og tags", "twitter cards", "seo meta tags", "open graph generator"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
