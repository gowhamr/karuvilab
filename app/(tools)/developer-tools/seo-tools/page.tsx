import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';

import SeoToolsClientWrapper from './SeoToolsClientWrapper';

const toolId = 'seo-tools';
const cat = CATEGORIES.find(c => c.id === 'developer');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="seo-tools"
      description=""
      category={cat}
      toolId={toolId}
    >
      <SeoToolsClientWrapper />
    </ToolShell>
  );
}
