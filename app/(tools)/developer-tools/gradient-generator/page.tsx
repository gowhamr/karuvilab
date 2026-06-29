import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';

import GradientGeneratorWrapper from './GradientGeneratorWrapper';

const toolId = 'gradient-generator';
const cat = CATEGORIES.find(c => c.id === 'developer');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="CSS Gradient Generator"
      description="Visual CSS gradient builder."
      category={cat}
      toolId={toolId}
    >
      <GradientGeneratorWrapper />
    </ToolShell>
  );
}
