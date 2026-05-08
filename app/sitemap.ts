import { MetadataRoute } from 'next';
import { ALL_TOOLS, CATEGORIES } from '@/src/tool-registry';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://karuvilab.com';

  // Base pages
  const staticPages = [
    '',
    '/about',
    '/help',
    '/settings',
    '/privacy',
    '/terms',
    '/disclaimer',
    '/contact',
  ].map(route => ({
    url: `${baseUrl}${route}/`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 1.0,
  }));

  // Category pages
  const categoryPages = CATEGORIES.map(cat => ({
    url: `${baseUrl}/${cat.href}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }));

  // Tool pages
  const toolPages = ALL_TOOLS.map(tool => ({
    url: `${baseUrl}/${tool.href}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: tool.priority || 0.8,
  }));

  return [...staticPages, ...categoryPages, ...toolPages];
}
