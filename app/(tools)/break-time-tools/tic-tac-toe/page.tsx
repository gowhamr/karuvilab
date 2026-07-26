import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';

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

      <LearningHub title="Understanding Game Theory & Minimax">
        
        <LearningSection type="architecture" title="A 'Solved' Game">
          <p>Tic-Tac-Toe is a "solved" game. This means that if both players play perfectly, every single game will result in a draw. Because the board is only 3x3, there are a very limited number of possible board states (exactly 5,478 legal states).</p>
        </LearningSection>
        
        <LearningSection type="api" title="The Minimax Algorithm">
          <p>When a computer plays Tic-Tac-Toe, it doesn't use modern neural networks or machine learning. It uses a foundational, brute-force Game Theory algorithm called <strong>Minimax</strong>.</p>
          <p className="mt-2">Before making a move, the AI simulates every possible move it could make. Then, for each of those moves, it simulates every possible move the human could make in response, and so on, recursively, until the game is over.</p>
        </LearningSection>

        <LearningSection type="performance" title="Scoring Futures">
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>If a sequence ends in the AI winning, it assigns that path a score of <strong>+10</strong>.</li>
            <li>If a sequence ends in a draw, it assigns a score of <strong>0</strong>.</li>
            <li>If a sequence ends in the human winning, it assigns a score of <strong>-10</strong>.</li>
          </ul>
          <p className="mt-2">The AI assumes the human will always play perfectly to minimize the AI's score. Therefore, the AI chooses the move that <em>maximizes</em> its minimum guaranteed score. This guarantees the AI will always win or draw, but never lose.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "Why doesn't the AI need a complex Neural Network to play Tic-Tac-Toe perfectly?",
                options: [
                  "Because Neural Networks can't run in the browser.",
                  "Because the game has a small enough number of possible states that a brute-force algorithm (Minimax) can evaluate every single future possibility instantly.",
                  "Because Tic-Tac-Toe requires 3D rendering.",
                  "Because the AI just memorized 5 moves."
                ],
                correctIndex: 1,
                explanation: "Minimax explores the entire decision tree. For games like Chess, the tree is too massive for brute force, which is where Neural Networks become necessary."
              },
              {
                question: "What score does the Minimax algorithm assign to a future board state where the Human wins?",
                options: [
                  "+10",
                  "0",
                  "-10",
                  "Undefined"
                ],
                correctIndex: 2,
                explanation: "The AI considers a human win a massive negative outcome (-10), and avoids choosing any move that allows the human to force that outcome."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
