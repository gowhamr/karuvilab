import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';

import URLCleanerClientWrapper from './URLCleanerClientWrapper';

const toolId = 'url-cleaner';
const cat = CATEGORIES.find(c => c.id === 'utilities');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="URL Cleaner / UTM Stripper"
      description="Remove UTM tags, fbclid, gclid and other tracking parameters from URLs."
      category={cat}
      toolId={toolId}
    >
      <URLCleanerClientWrapper />
    </ToolShell>
  );
}
