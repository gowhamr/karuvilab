import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import MetaTagsClientWrapper from './MetaTagsClientWrapper';

const toolId = 'meta-tags';
const cat = CATEGORIES.find(c => c.id === 'developer');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="Meta Tags Generator"
      description="Build, preview, and generate meta tags for your website."
      category={cat}
      toolId={toolId}
    >
      <MetaTagsClientWrapper />
    </ToolShell>
  );
}
