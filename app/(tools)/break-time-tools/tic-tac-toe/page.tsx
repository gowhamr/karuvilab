import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
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

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-minimax"
          title="How it Works: Game Theory & Minimax"
          preview="Learn how to write an AI that never loses at Tic-Tac-Toe."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              Tic-Tac-Toe is a "solved" game. This means that if both players play perfectly, every single game will result in a draw. Because the board is only 3x3, there are a very limited number of possible board states (exactly 5,478 legal states).
            </p>
            <h3>The Minimax Algorithm</h3>
            <p>
              When a computer plays Tic-Tac-Toe, it doesn't use neural networks or machine learning. It uses a brute-force Game Theory algorithm called <strong>Minimax</strong>.
            </p>
            <p>
              Before making a move, the AI simulates every possible move it could make. Then, for each of those moves, it simulates every possible move the human could make in response, and so on, until the game is over.
            </p>
            <ul>
              <li>If a sequence ends in the AI winning, it assigns a score of <strong>+10</strong>.</li>
              <li>If a sequence ends in a draw, it assigns a score of <strong>0</strong>.</li>
              <li>If a sequence ends in the human winning, it assigns a score of <strong>-10</strong>.</li>
            </ul>
            <p>
              The AI assumes the human will always play perfectly to minimize the AI's score. Therefore, the AI chooses the move that <em>maximizes</em> its minimum guaranteed score. This guarantees the AI will always win or draw, but never lose.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
