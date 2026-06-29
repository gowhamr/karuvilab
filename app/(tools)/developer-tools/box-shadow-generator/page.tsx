import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';

import BoxShadowGeneratorWrapper from './BoxShadowGeneratorWrapper';

const toolId = 'box-shadow-generator';
const cat = CATEGORIES.find(c => c.id === 'developer');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Box Shadow Generator"
      description="Visual box shadow generator."
      category={cat}
      toolId={toolId}
    >
      <BoxShadowGeneratorWrapper />
    </ToolShell>
  );
}
