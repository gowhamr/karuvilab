import { MetadataRoute } from 'next';
import { ALL_TOOLS, CATEGORIES } from '@/src/tool-registry';
import { articles } from '@/src/content/blog/articles';
import { getArticleMetadata } from '@/src/content/blog/utils';

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
    '/blog',
  ].map(route => ({
    url: `${BASE_URL}${route}/`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: route === '' ? 1.0 : (route === '/blog' ? 0.8 : 0.8),
  }));

  // 2. Category Hubs
  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map(cat => ({
    url: `${BASE_URL}/${cat.href.replace(/^\/+|\/+$/g, '')}/`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.9,
  }));

  // 3. Individual Tools
  const toolPages: MetadataRoute.Sitemap = ALL_TOOLS
    .map(tool => ({
    url: `${BASE_URL}/${tool.href.replace(/^\/+|\/+$/g, '')}/`,
    lastModified: tool.lastUpdated ? new Date(tool.lastUpdated) : new Date(),
    changeFrequency: 'monthly',
    priority: tool.priority || 0.8,
  }));

  // 4. Blog Articles
  const blogPages: MetadataRoute.Sitemap = Object.entries(articles).map(([slug, article]) => {
    const meta = getArticleMetadata(slug, article);
    return {
      url: `${BASE_URL}/blog/${slug}/`,
      lastModified: new Date(meta.isoDate),
      changeFrequency: 'monthly',
      priority: 0.7,
    };
  });

  return [...staticPages, ...categoryPages, ...toolPages, ...blogPages];
}
