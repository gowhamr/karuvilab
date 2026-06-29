import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';

import TextUtilityClientWrapper from './TextUtilityClientWrapper';

const toolId = 'text-utility';
const cat = CATEGORIES.find(c => c.id === 'utilities');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Text Utility"
      description="Case conversion, line sorting, text cleaning, and character count — all in one place."
      category={cat}
      toolId={toolId}
    >
      <TextUtilityClientWrapper />
    </ToolShell>
  );
}
