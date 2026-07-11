import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import Game2048ClientWrapper from './Game2048ClientWrapper';

const toolId = 'game-2048';
const cat = CATEGORIES.find(c => c.id === 'break-time');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="2048"
      description="Slide and merge tiles to reach 2048. Fully offline — no sign-in required."
      category={cat}
      toolId={toolId}
    >
      <Game2048ClientWrapper />
    </ToolShell>
  );
}
