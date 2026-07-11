import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import MemoryMatchClientWrapper from './MemoryMatchClientWrapper';

const toolId = 'memory-match';
const cat = CATEGORIES.find(c => c.id === 'break-time');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="Memory Match"
      description="Flip cards and match all pairs. A classic memory-training game with best-score tracking."
      category={cat}
      toolId={toolId}
    >
      <MemoryMatchClientWrapper />
    </ToolShell>
  );
}
