import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';

import HmacGeneratorWrapper from './HmacGeneratorWrapper';

const toolId = 'hmac-generator';
const cat = CATEGORIES.find(c => c.id === 'security');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="HMAC Generator"
      description="Generate HMAC signatures."
      category={cat}
      toolId={toolId}
    >
      <HmacGeneratorWrapper />
    </ToolShell>
  );
}
