import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';

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

      <LearningHub title="Understanding the Backtracking Algorithm">
        
        <LearningSection type="architecture" title="The Problem">
          <p>A 9x9 Sudoku puzzle isn't just a random assortment of numbers. If a developer just placed numbers randomly, it's highly likely the puzzle would be completely unsolvable.</p>
        </LearningSection>
        
        <LearningSection type="api" title="Generating the Board">
          <p>To create a valid puzzle, the computer first creates a <em>completely full, fully solved</em> 9x9 board. It does this using a computer science technique called <strong>Backtracking</strong>.</p>
          <ol className="list-decimal pl-5 mt-2 space-y-1">
            <li>The computer looks at the first empty cell and guesses a number (e.g., <code>1</code>).</li>
            <li>It moves to the next cell and guesses another number, ensuring it doesn't violate Sudoku rules (no duplicates in the row, column, or 3x3 box).</li>
            <li>If it reaches a cell where <em>no</em> valid numbers can be placed, it realizes it made a mistake earlier. It "backtracks" to the previous cell, erases the guess, and tries a different number.</li>
          </ol>
        </LearningSection>

        <LearningSection type="performance" title="Aggressive Tree Search">
          <p>This algorithm aggressively searches through the tree of possibilities. Because computers process millions of operations per second, a backtracking algorithm can perfectly fill a 9x9 board in a fraction of a millisecond.</p>
          <p className="mt-2">Once the full board is generated, the game starts deleting numbers one by one to create difficulty. To ensure the puzzle still has exactly one unique solution, the backtracking algorithm is run <em>again</em> after every deletion to verify that a human could still logically deduce the missing number.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "What does a Backtracking algorithm do when it hits a dead end (a cell where no valid number can be placed)?",
                options: [
                  "It throws an error and crashes the game.",
                  "It goes back to a previous cell, undoes the guess, and tries a different option.",
                  "It places a zero and moves on.",
                  "It expands the board to 10x10."
                ],
                correctIndex: 1,
                explanation: "Backtracking explores a path until it fails, then systematically steps back to the last valid state and tries the next available branch."
              },
              {
                question: "How does the game ensure the puzzle it gives you is actually solvable?",
                options: [
                  "By downloading verified puzzles from a database.",
                  "By only removing 5 numbers.",
                  "By using the backtracking algorithm to solve its own generated puzzle after removing numbers, ensuring only one solution exists.",
                  "By checking if the sum of all rows is 45."
                ],
                correctIndex: 2,
                explanation: "The algorithm verifies its own work. If removing a number creates a puzzle with multiple valid solutions, it puts the number back."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
