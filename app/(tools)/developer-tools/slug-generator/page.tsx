import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import SlugClientWrapper from './SlugClientWrapper';

const toolId = 'slug-generator';
const cat = CATEGORIES.find(c => c.id === 'developer');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="URL Slug Generator"
      description="Convert title strings into clean, SEO-friendly URL slugs."
      category={cat}
      toolId={toolId}
    >
      <SlugClientWrapper />
    </ToolShell>
  );
}
