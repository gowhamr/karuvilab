import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "XML Sitemap Generator | KaruviLab",
  description: "Generate an XML sitemap for your website to help Google and other search engines index your pages.",
  keywords: ["sitemap generator", "xml sitemap", "website sitemap", "sitemap xml", "google sitemap"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
