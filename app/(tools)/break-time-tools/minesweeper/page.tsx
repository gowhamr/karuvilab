import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
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

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-flood-fill"
          title="How it Works: The Flood Fill Algorithm"
          preview="Learn the recursive algorithm that clears large empty areas of the board instantly."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              When you click on a cell in Minesweeper that has no adjacent mines, the game magically opens up a massive cavern of empty space all at once. How does the computer know exactly which cells to open?
            </p>
            <h3>Recursive Algorithms</h3>
            <p>
              The game uses a classic Computer Science algorithm called <strong>Flood Fill</strong> (the exact same algorithm used by the "Paint Bucket" tool in Photoshop).
            </p>
            <p>
              When you click a "zero" cell, a function runs with the following logic:
            </p>
            <ol>
              <li>Reveal the clicked cell.</li>
              <li>Look at all 8 neighboring cells.</li>
              <li>For each neighbor: If it hasn't been revealed yet, reveal it.</li>
              <li><strong>The Magic Step:</strong> If the neighbor is <em>also</em> a zero, call this exact same function again, but starting from the neighbor's position.</li>
            </ol>
            <p>
              This is called <strong>Recursion</strong> (a function that calls itself). The function will spider outwards in every direction until it hits cells that are adjacent to mines, creating the natural boundaries of the cleared area.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
