import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
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

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-backtracking"
          title="How it Works: The Backtracking Algorithm"
          preview="Learn how computers generate perfectly solvable Sudoku puzzles instantly."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              A 9x9 Sudoku puzzle isn't just a random assortment of numbers. If a developer just placed numbers randomly, it's highly likely the puzzle would be completely unsolvable.
            </p>
            <h3>Generating the Board</h3>
            <p>
              To create a valid puzzle, the computer first creates a <em>completely full, fully solved</em> 9x9 board. It does this using a computer science technique called <strong>Backtracking</strong>.
            </p>
            <ol>
              <li>The computer looks at the first empty cell and guesses a number (e.g., <code>1</code>).</li>
              <li>It moves to the next cell and guesses another number, ensuring it doesn't violate Sudoku rules (no duplicates in the row, column, or 3x3 box).</li>
              <li>If it reaches a cell where <em>no</em> valid numbers can be placed, it realizes it made a mistake earlier. It "backtracks" to the previous cell, erases the guess, and tries a different number.</li>
            </ol>
            <p>
              This algorithm aggressively searches through the tree of possibilities. Because computers process millions of operations per second, a backtracking algorithm can fill a 9x9 board perfectly in a fraction of a millisecond.
            </p>
            <h3>Creating Difficulty</h3>
            <p>
              Once the full board is generated, the game starts deleting numbers one by one. To ensure the puzzle has exactly one unique solution, the backtracking algorithm is run <em>again</em> after every deletion to verify that a human could still logically deduce the missing number.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
