import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import ToolClientWrapper from './ToolClientWrapper';

const toolId = 'bg-remover';
const cat = CATEGORIES.find(c => c.id === 'image');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="AI Background Remover"
      description="Remove image backgrounds automatically in your browser using local AI (RMBG 2.0 / BiRefNet)"
      category={cat}
      toolId={toolId}
    >
      <ToolClientWrapper />
    </ToolShell>
  );
}
