import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import SitemapClientWrapper from './SitemapClientWrapper';

const toolId = 'sitemap-generator';
const cat = CATEGORIES.find(c => c.id === 'developer');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="XML Sitemap Generator"
      description="Generate XML sitemaps for websites with custom URL priorities and change frequencies."
      category={cat}
      toolId={toolId}
    >
      <SitemapClientWrapper />
    </ToolShell>
  );
}
