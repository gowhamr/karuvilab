import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import SeoTitleClientWrapper from './SeoTitleClientWrapper';

const toolId = 'seo-title';
const cat = CATEGORIES.find(c => c.id === 'developer');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="SEO Title Tester & Pixel Width Counter"
      description="Test SEO title length, character count, and Google SERP pixel width bounds."
      category={cat}
      toolId={toolId}
    >
      <SeoTitleClientWrapper />
    </ToolShell>
  );
}
