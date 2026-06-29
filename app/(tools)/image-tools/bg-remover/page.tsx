import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';

import BgRemoverClientWrapper from './BgRemoverClientWrapper';

const toolId = 'bg-remover';
const cat = CATEGORIES.find(c => c.id === 'image');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Background Remover"
      description="Remove solid or near-solid backgrounds from images using color threshold matching."
      category={cat}
      toolId={toolId}
    >
      <BgRemoverClientWrapper />
    </ToolShell>
  );
}
