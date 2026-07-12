import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import SnakeGameClientWrapper from './SnakeGameClientWrapper';

const toolId = 'snake-game';
const cat = CATEGORIES.find(c => c.id === 'break-time');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="Snake Game"
      description="Classic arcade Snake game right in your browser. Eat apples, grow longer, and set new high scores."
      category={cat}
      toolId={toolId}
    >
      <SnakeGameClientWrapper />
    </ToolShell>
  );
}
