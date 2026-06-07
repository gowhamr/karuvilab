import { Metadata } from "next";
import HomeClient from "./HomeClient";
import { HomeHero } from "./HomeHero";

export const metadata: Metadata = {
  title: "KaruviLab — Free Private Browser Tools",
  description:
    "Free browser tools for files, text, images, PDFs and more. " +
    "100% local processing. No uploads. No account. No tracking.",
  alternates: {
    canonical: "https://karuvilab.com/",
  },
  openGraph: {
    title: "KaruviLab — Free Private Browser Tools",
    description:
      "100+ tools. Process locally. Zero uploads. Zero tracking.",
    type: "website",
    url: "https://karuvilab.com/",
    siteName: "KaruviLab",
  },
  twitter: {
    card: "summary_large_image",
    title: "KaruviLab — Free Private Browser Tools",
    description: "100+ tools. No uploads. No tracking. No account.",
  },
  keywords: [
    "browser tools",
    "free online tools",
    "pdf tools",
    "image tools",
    "privacy tools",
    "local file processing",
    "no upload tools",
  ],
};

export default function Home() {
  return (
    <>
      <HomeHero />
      <HomeClient />
    </>
  );
}
