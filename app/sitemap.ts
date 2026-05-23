import { MetadataRoute } from 'next';
import { ALL_TOOLS, CATEGORIES } from '@/src/tool-registry';

const BASE_URL = 'https://karuvilab.com';

export async function generateSitemaps() {
  // We'll create one sitemap index segment per category + one for static pages
  return [
    { id: 'main' },
    ...CATEGORIES.map(cat => ({ id: cat.id }))
  ];
}

export default function sitemap({ id }: { id: string }): MetadataRoute.Sitemap {
  // 1. Main sitemap: Static pages and Category hubs
  if (id === 'main') {
    const staticPages = [
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
      changeFrequency: 'monthly' as const,
      priority: route === '' ? 1.0 : 0.8,
    }));

    const categoryPages = CATEGORIES.map(cat => ({
      url: `${BASE_URL}/${cat.href.replace(/\/$/, '')}/`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    }));

    return [...staticPages, ...categoryPages];
  }

  // 2. Category-specific sitemaps for tools
  const toolsInCategory = ALL_TOOLS.filter(t => t.category === id);
  
  return toolsInCategory.map(tool => ({
    url: `${BASE_URL}/${tool.href.replace(/\/$/, '')}/`,
    lastModified: tool.lastUpdated ? new Date(tool.lastUpdated) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: tool.priority || 0.8,
  }));
}
