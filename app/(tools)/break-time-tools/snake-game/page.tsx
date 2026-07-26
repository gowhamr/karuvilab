import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';

import SnakeGameClientWrapper from './SnakeGameClientWrapper';

const toolId = 'snake-game';
const cat = CATEGORIES.find(c => c.id === 'break-time');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="Snake Game"
      description="Classic arcade Snake game right in your browser. Eat apples, grow longer, and set new high scores."
      category={cat}
      toolId={toolId}
    >
      <SnakeGameClientWrapper />

      <LearningHub title="Understanding Double-Ended Queues (Deque)">
        
        <LearningSection type="architecture" title="The Movement Problem">
          <p>When a snake gets to be 50 segments long, moving it forward one step might seem like a heavy operation. Do you have to update the X/Y coordinates of all 50 segments in memory on every single frame?</p>
        </LearningSection>
        
        <LearningSection type="performance" title="The Naive Approach: O(N)">
          <p>A beginner might write a loop: <code>for (let i = snake.length - 1; i &gt; 0; i--) snake[i] = snake[i-1];</code>. This shifts every single segment to the position of the one in front of it.</p>
          <p className="mt-2">While this works, it takes <strong>O(N)</strong> time, meaning the longer the snake gets, the slower the game runs, eventually causing lag when the snake is huge.</p>
        </LearningSection>

        <LearningSection type="api" title="The Solution: The Deque (O(1))">
          <p>In computer science, a snake is perfectly modeled using a <strong>Deque</strong> (pronounced "deck"). Instead of updating 50 segments, the game engine only ever does two things on a tick:</p>
          <ol className="list-decimal pl-5 mt-2 space-y-1">
            <li>It creates <em>one</em> new segment based on the current direction and <code>push()</code>es it to the front of the array (the new head).</li>
            <li>It immediately <code>pop()</code>s the last segment off the back of the array (the tail).</li>
          </ol>
          <p className="mt-2">Because the middle 48 segments never actually changed their coordinates, the operation always takes exactly the same amount of time, <strong>O(1)</strong>, whether the snake is 3 segments long or 3,000 segments long.</p>
          <p className="mt-2">When the snake eats an apple, the engine simply skips Step 2 for that frame, causing the snake to grow by exactly one segment.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "Why is updating the coordinates of every snake segment on every frame a bad approach?",
                options: [
                  "It requires a 3D graphics card.",
                  "It changes the direction of the snake randomly.",
                  "It runs in O(N) time, meaning the game's performance degrades as the snake gets longer.",
                  "It causes the screen to flicker."
                ],
                correctIndex: 2,
                explanation: "If performance scales linearly with size, a massive snake will eventually cause frame drops. An O(1) solution avoids this completely."
              },
              {
                question: "How does the Deque approach handle the snake 'growing' when it eats an apple?",
                options: [
                  "It pushes two heads to the front of the array.",
                  "It skips popping the tail for one frame.",
                  "It multiplies the snake's speed by 1.5.",
                  "It creates a new array and copies the old one over."
                ],
                correctIndex: 1,
                explanation: "By pushing a new head but NOT popping the tail, the length of the array permanently increases by 1."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
