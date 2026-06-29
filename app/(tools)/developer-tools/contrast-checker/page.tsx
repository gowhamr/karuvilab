import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';

import ContrastCheckerWrapper from './ContrastCheckerWrapper';

const toolId = 'contrast-checker';
const cat = CATEGORIES.find(c => c.id === 'developer');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Contrast Checker"
      description="WCAG contrast ratio checker."
      category={cat}
      toolId={toolId}
    >
      <ContrastCheckerWrapper />
    </ToolShell>
  );
}
