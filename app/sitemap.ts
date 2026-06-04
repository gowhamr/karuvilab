import { MetadataRoute } from 'next';
import { ALL_TOOLS, CATEGORIES } from '@/src/tool-registry';
import { emiCalculator } from '@/src/content/tools/emi-calculator'; // Sample to check if we can import content

const BASE_URL = 'https://karuvilab.com';

// Heuristic: only include tools that have substantial content in their sitemap entry
// In a real build, we'd check the word count of the actual content file.
// For now, we'll exclude the tools known to have < 250 words.
const THIN_TOOLS = [
  'command-cheat-sheet', 'hash-map-visualizer', 'color-palette-extractor', 
  'fake-data-generator', 'mic-camera-tester', 'phone-mockup-generator',
  'text-sorter-deduper', 'typing-speed-test', 'wifi-qr-code', 'color-converter',
  'audio-converter', 'gif-creator', 'video-metadata-viewer'
];


export const dynamic = 'force-static';

/**
 * Generates a single, comprehensive sitemap for all KaruviLab pages.
 * Consolidating into one file for simplicity and reliability.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  // 1. Static Pages
  const staticPages: MetadataRoute.Sitemap = [
    '',
    '/about',
    '/help',
    '/settings',
    '/privacy',
    '/terms',
    '/disclaimer',
    '/contact',
    '/all-tools',
  ].map(route => ({
    url: `${BASE_URL}${route}/`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: route === '' ? 1.0 : 0.8,
  }));

  // 2. Category Hubs
  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map(cat => ({
    url: `${BASE_URL}/${cat.href.replace(/\/$/, '')}/`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.9,
  }));

  // 3. Individual Tools
  const toolPages: MetadataRoute.Sitemap = ALL_TOOLS
    .filter(tool => !THIN_TOOLS.includes(tool.id))
    .map(tool => ({
    url: `${BASE_URL}/${tool.href.replace(/\/$/, '')}/`,
    lastModified: tool.lastUpdated ? new Date(tool.lastUpdated) : new Date(),
    changeFrequency: 'monthly',
    priority: tool.priority || 0.8,
  }));

  return [...staticPages, ...categoryPages, ...toolPages];
}
