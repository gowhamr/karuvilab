import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
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

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-2048"
          title="How it Works: 2D Matrix Operations"
          preview="Learn how developers build sliding puzzle games using simple array transformations."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              Games like 2048 are built using a data structure called a <strong>2D Array</strong> (an array of arrays). The grid is represented in memory as a 4x4 matrix of numbers.
            </p>
            <h3>Matrix Transformations</h3>
            <p>
              When a player presses the "Left" arrow, the game processes each row individually. It filters out the empty spaces (zeros), checks if adjacent numbers match (e.g., merging <code>2</code> and <code>2</code> into <code>4</code>), and then pads the end of the array with zeros to keep the length at 4.
            </p>
            <p>
              But what happens when the player presses "Up"? Rather than writing entirely new logic for vertical merging, developers use a clever mathematical trick called <strong>Transposition</strong>.
            </p>
            <ol>
              <li>The matrix is transposed (columns become rows, rows become columns).</li>
              <li>The exact same "Left" arrow logic is executed on the new rows.</li>
              <li>The matrix is transposed <em>back</em> to its original orientation.</li>
            </ol>
            <p>
              By combining matrix transpositions and reversals, developers only have to write the merge logic once (for a left swipe), drastically reducing bugs and keeping the codebase clean.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
