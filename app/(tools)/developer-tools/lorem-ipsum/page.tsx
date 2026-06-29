import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';

import LoremIpsumWrapper from './LoremIpsumWrapper';

const toolId = 'lorem-ipsum';
const cat = CATEGORIES.find(c => c.id === 'developer');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Lorem Ipsum Generator"
      description="Generate Lorem Ipsum placeholder text."
      category={cat}
      toolId={toolId}
    >
      <LoremIpsumWrapper />
    </ToolShell>
  );
}
