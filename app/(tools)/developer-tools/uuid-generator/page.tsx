import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';

import UuidGeneratorWrapper from './UuidGeneratorWrapper';

const toolId = 'uuid-generator';
const cat = CATEGORIES.find(c => c.id === 'developer');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="UUID Generator"
      description="Generate RFC-compliant UUIDs (v1, v4, v5, v7)."
      category={cat}
      toolId={toolId}
    >
      <UuidGeneratorWrapper />
    </ToolShell>
  );
}
