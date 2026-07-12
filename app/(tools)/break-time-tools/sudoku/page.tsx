import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import SudokuClientWrapper from './SudokuClientWrapper';

const toolId = 'sudoku';
const cat = CATEGORIES.find(c => c.id === 'break-time');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="Sudoku"
      description="Play Sudoku right in your browser with multiple difficulty levels, notes mode, move history, and best-time tracking."
      category={cat}
      toolId={toolId}
    >
      <SudokuClientWrapper />
    </ToolShell>
  );
}
