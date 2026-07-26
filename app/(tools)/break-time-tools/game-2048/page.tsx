import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';

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

      <LearningHub title="Understanding Matrix Transpositions">
        
        <LearningSection type="architecture" title="2D Arrays">
          <p>Games like 2048 are built using a data structure called a <strong>2D Array</strong> (an array of arrays). The grid is represented in memory as a 4x4 matrix of numbers.</p>
        </LearningSection>
        
        <LearningSection type="api" title="The Merge Logic">
          <p>When a player presses the "Left" arrow, the game processes each row individually.</p>
          <ol className="list-decimal pl-5 mt-2 space-y-1">
            <li>It filters out the empty spaces (zeros).</li>
            <li>It iterates through the remaining numbers, checking if adjacent numbers match (e.g., merging <code>2</code> and <code>2</code> into <code>4</code>).</li>
            <li>It pads the end of the array with zeros to keep the total length exactly 4.</li>
          </ol>
        </LearningSection>

        <LearningSection type="performance" title="The Transposition Trick">
          <p>But what happens when the player presses "Up"? Rather than writing entirely new logic for vertical merging, developers use a clever mathematical trick called <strong>Matrix Transposition</strong>.</p>
          <ol className="list-decimal pl-5 mt-2 space-y-1">
            <li>The matrix is transposed (columns become rows, rows become columns).</li>
            <li>The exact same "Left" arrow logic is executed on the new rows.</li>
            <li>The matrix is transposed <em>back</em> to its original orientation.</li>
          </ol>
          <p className="mt-2">By combining matrix transpositions and reversals, developers only have to write the complex merge logic once (for a left swipe), drastically reducing bugs and keeping the codebase clean.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "How do developers handle 'Up' and 'Down' swipes in 2048 without writing redundant vertical merge logic?",
                options: [
                  "By rotating the user's screen.",
                  "By transposing the 2D matrix, running the horizontal swipe logic, and transposing it back.",
                  "By using a 3D array.",
                  "By relying on the CSS grid layout engine to do the math."
                ],
                correctIndex: 1,
                explanation: "Transposition flips the matrix over its diagonal, turning columns into rows so they can be processed horizontally."
              },
              {
                question: "In programming, how is the 4x4 grid of 2048 stored in memory?",
                options: [
                  "As a single 16-digit integer.",
                  "As an HTML table.",
                  "As a 2D Array (an array containing four smaller arrays).",
                  "As a binary tree."
                ],
                correctIndex: 2,
                explanation: "A 2D array maps perfectly to a grid, allowing developers to target specific coordinates using row and column indices (e.g., grid[y][x])."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
