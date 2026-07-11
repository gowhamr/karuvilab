import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import TicTacToeClientWrapper from './TicTacToeClientWrapper';

const toolId = 'tic-tac-toe';
const cat = CATEGORIES.find(c => c.id === 'break-time');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="Tic-Tac-Toe"
      description="Classic 2-player Tic-Tac-Toe. No downloads, no sign-in, fully offline."
      category={cat}
      toolId={toolId}
    >
      <TicTacToeClientWrapper />
    </ToolShell>
  );
}
