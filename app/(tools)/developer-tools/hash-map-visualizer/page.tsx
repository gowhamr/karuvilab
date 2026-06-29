import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';

import ClientWrapper from './ClientWrapper';

const toolId = 'hash-map-visualizer';
const cat = CATEGORIES.find(c => c.id === 'developer');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Hash Map Visualizer"
      description=""
      category={cat}
      toolId={toolId}
    >
      <ClientWrapper />
    </ToolShell>
  );
}
