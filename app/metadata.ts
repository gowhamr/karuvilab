import type { Metadata } from "next";

const siteConfig = {
  name: "KV",
  fullName: "KaruviLab",
  description: "KV (KaruviLab) — The world's fastest, most private browser-side toolkit. No uploads. No tracking. 100% local-first tools for developers, designers, and daily tasks.",
  url: "https://karuvilab.com",
  ogImage: "https://karuvilab.com/og-image.png",
  links: {
    twitter: "https://twitter.com/karuvilab",
    github: "https://github.com/karuvilab",
  },
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name + " — Fast, Private Browser Tools",
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "KV",
    "KaruviLab",
    "online tools",
    "privacy first",
    "browser tools",
    "developer tools",
    "pdf tools",
    "image tools",
    "calculators",
    "no-upload tools",
    "client-side processing"
  ],
  authors: [{ name: "KV Labs", url: siteConfig.url }],
  creator: "KV Labs",
  publisher: "KV Labs",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: siteConfig.name + " — Fast, Private Browser Tools",
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name + " — Fast, Private Browser Tools",
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@karuvilab",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/icons/icon-180.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: siteConfig.fullName,
  },
  manifest: "/manifest.json",
};
