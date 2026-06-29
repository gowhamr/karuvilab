import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';

import SplitCopyClientWrapper from './SplitCopyClientWrapper';

const toolId = 'split-copy';
const cat = CATEGORIES.find(c => c.id === 'utilities');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Split & Copy"
      description="Break long text into chunks and copy each part individually."
      category={cat}
      toolId={toolId}
    >
      <SplitCopyClientWrapper />
    </ToolShell>
  );
}
