import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';

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

      <LearningHub title="Understanding the Flood Fill Algorithm">
        
        <LearningSection type="architecture" title="The Cavern Effect">
          <p>When you click on a cell in Minesweeper that has no adjacent mines (a "zero" cell), the game magically opens up a massive cavern of empty space all at once. How does the computer know exactly which cells to open?</p>
        </LearningSection>
        
        <LearningSection type="api" title="Recursive Algorithms">
          <p>The game uses a classic Computer Science algorithm called <strong>Flood Fill</strong> (the exact same algorithm used by the "Paint Bucket" tool in Photoshop).</p>
          <p className="mt-2">When you click a zero cell, a function runs with the following logic:</p>
          <ol className="list-decimal pl-5 mt-2 space-y-1">
            <li>Reveal the clicked cell.</li>
            <li>Look at all 8 neighboring cells.</li>
            <li>For each neighbor: If it hasn't been revealed yet, reveal it.</li>
            <li><strong>The Magic Step:</strong> If the neighbor is <em>also</em> a zero, call this exact same function again, but starting from the neighbor's position.</li>
          </ol>
        </LearningSection>

        <LearningSection type="performance" title="Recursion Limits">
          <p>This is called <strong>Recursion</strong> (a function that calls itself). The function will spider outwards in every direction until it hits cells that are adjacent to mines (numbers greater than 0), creating the natural boundaries of the cleared area.</p>
          <p className="mt-2">Because recursion adds a new frame to the Call Stack for every iteration, clearing a massive 1000x1000 Minesweeper board using recursion could cause a "Stack Overflow" crash. In professional massive-scale implementations, developers rewrite the recursive flood fill using a <code>Queue</code> or <code>Stack</code> data structure (an Iterative approach) to avoid crashing the browser.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "What is it called when a function calls itself from within its own code?",
                options: [
                  "Iteration",
                  "Polymorphism",
                  "Recursion",
                  "Encapsulation"
                ],
                correctIndex: 2,
                explanation: "Recursion is the process of a function calling itself to solve a smaller piece of a larger problem."
              },
              {
                question: "What other famous piece of software relies heavily on the Flood Fill algorithm?",
                options: [
                  "The Paint Bucket tool in Photoshop",
                  "Google Search autocomplete",
                  "Video compression",
                  "Excel formulas"
                ],
                correctIndex: 0,
                explanation: "The Paint Bucket uses Flood Fill to spider outwards from the clicked pixel, replacing all connected pixels of the same color."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
