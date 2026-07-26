// src/seo/metadata.ts
import { Metadata } from "next";
import { getCanonicalUrl } from "./canonical";

const BASE_URL = "https://karuvilab.com";
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.webp`;

export interface SiteConfig {
  name: string;
  fullName: string;
  description: string;
  url: string;
  ogImage: string;
  twitterCreator: string;
}

export const siteConfig: SiteConfig = {
  name: "KV",
  fullName: "KaruviLab",
  description: "KV (KaruviLab) — The world's fastest, most private browser-side toolkit. No uploads. No tracking. 100% local-first tools for developers, designers, and daily tasks.",
  url: BASE_URL,
  ogImage: DEFAULT_OG_IMAGE,
  twitterCreator: "@karuvilab",
};

/**
 * Helper to build metadata for static pages.
 */
export function generateMetadata({
  title,
  description,
  path,
  ogImage = siteConfig.ogImage,
  noIndex = false,
}: {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  noIndex?: boolean;
}): Metadata {
  const canonicalUrl = getCanonicalUrl(path);
  const fullTitle = `${title} | ${siteConfig.fullName}`;

  return {
    title: fullTitle,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName: siteConfig.fullName,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
      creator: siteConfig.twitterCreator,
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
    },
  };
}

/**
 * Dynamic metadata generator for standard tool pages.
 */
export function generateToolMetadata(toolConfig: {
  name: string;
  description: string;
  seo: {
    title: string;
    description: string;
    keywords: string[];
    canonical: string;
    ogImage: string;
  };
}): Metadata {
  const canonicalUrl = getCanonicalUrl(toolConfig.seo.canonical);
  const ogImage = toolConfig.seo.ogImage.startsWith("http")
    ? toolConfig.seo.ogImage
    : `${BASE_URL}${toolConfig.seo.ogImage}`;

  return {
    title: toolConfig.seo.title,
    description: toolConfig.seo.description,
    keywords: toolConfig.seo.keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: toolConfig.seo.title,
      description: toolConfig.seo.description,
      url: canonicalUrl,
      siteName: siteConfig.fullName,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: toolConfig.name,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: toolConfig.seo.title,
      description: toolConfig.seo.description,
      images: [ogImage],
      creator: siteConfig.twitterCreator,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
