import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';

import GlassmorphismGeneratorWrapper from './GlassmorphismGeneratorWrapper';

const toolId = 'glassmorphism-generator';
const cat = CATEGORIES.find(c => c.id === 'developer');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Glassmorphism Generator"
      description="Glassmorphism CSS generator."
      category={cat}
      toolId={toolId}
    >
      <GlassmorphismGeneratorWrapper />
    </ToolShell>
  );
}
