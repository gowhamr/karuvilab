import { MetadataRoute } from 'next';
import { ALL_TOOLS, CATEGORIES } from '@/src/tool-registry';

const BASE_URL = 'https://karuvilab.com';

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
  const toolPages: MetadataRoute.Sitemap = ALL_TOOLS.map(tool => ({
    url: `${BASE_URL}/${tool.href.replace(/\/$/, '')}/`,
    lastModified: tool.lastUpdated ? new Date(tool.lastUpdated) : new Date(),
    changeFrequency: 'monthly',
    priority: tool.priority || 0.8,
  }));

  return [...staticPages, ...categoryPages, ...toolPages];
}
