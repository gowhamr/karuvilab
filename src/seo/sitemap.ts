// src/seo/sitemap.ts
import { getCanonicalUrl } from "./canonical";

export interface SitemapEntry {
  url: string;
  lastModified?: string | Date;
  changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
}

// Heuristic: tools that do not meet SEO standards or are thin should be excluded
export const THIN_TOOLS_SET = new Set([
  "command-cheat-sheet", 
  "hash-map-visualizer", 
  "color-palette-extractor", 
  "fake-data-generator", 
  "mic-camera-tester", 
  "phone-mockup-generator",
  "text-sorter-deduper", 
  "typing-speed-test", 
  "wifi-qr-code", 
  "color-converter",
  "audio-converter", 
  "gif-creator", 
  "video-metadata-viewer"
]);

/**
 * Automates sitemap generation for tools, categories, and static pages.
 */
export function generateSitemapEntries({
  staticPaths,
  categories,
  tools,
}: {
  staticPaths: string[];
  categories: { id: string; href: string }[];
  tools: { id: string; href: string; priority?: number; lastUpdated?: string }[];
}): SitemapEntry[] {
  const entries: SitemapEntry[] = [];

  // 1. Static Pages
  staticPaths.forEach((path) => {
    entries.push({
      url: getCanonicalUrl(path),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: path === "" ? 1.0 : 0.8,
    });
  });

  // 2. Category Hubs
  categories.forEach((cat) => {
    entries.push({
      url: getCanonicalUrl(cat.href),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    });
  });

  // 3. High-Quality, Non-Thin Tools
  tools
    .filter((tool) => !THIN_TOOLS_SET.has(tool.id))
    .forEach((tool) => {
      entries.push({
        url: getCanonicalUrl(tool.href),
        lastModified: tool.lastUpdated ? new Date(tool.lastUpdated) : new Date(),
        changeFrequency: "monthly",
        priority: tool.priority || 0.8,
      });
    });

  return entries;
}
