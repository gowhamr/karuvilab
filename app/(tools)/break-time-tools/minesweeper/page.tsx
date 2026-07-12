import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import MinesweeperClientWrapper from './MinesweeperClientWrapper';

const toolId = 'minesweeper';
const cat = CATEGORIES.find(c => c.id === 'break-time');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="Minesweeper"
      description="Play classic Minesweeper in your browser. Clear the grid without detonating mines. Offers multiple difficulty grids."
      category={cat}
      toolId={toolId}
    >
      <MinesweeperClientWrapper />
    </ToolShell>
  );
}
