import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import { generateToolMetadata } from '@/src/lib/seo';
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

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-deque"
          title="How it Works: Double-Ended Queues"
          preview="Learn the computer science data structure that makes the snake move without redrawing every segment."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              When a snake gets to be 50 segments long, moving it forward one step might seem like a heavy operation. Do you have to update the X/Y coordinates of all 50 segments in memory on every single frame?
            </p>
            <h3>The Naive Approach</h3>
            <p>
              A beginner might write a loop: <code>for (let i = snake.length - 1; i &gt; 0; i--) snake[i] = snake[i-1];</code>. This shifts every single segment to the position of the one in front of it. While this works, it takes <code>O(N)</code> time, meaning the longer the snake gets, the slower the game runs.
            </p>
            <h3>The Deque (Double-Ended Queue)</h3>
            <p>
              In computer science, a snake is modeled using a <strong>Deque</strong> (pronounced "deck"). Instead of updating 50 segments, the game engine only ever does two things on a tick:
            </p>
            <ol>
              <li>It creates <em>one</em> new segment based on the current direction and <code>push()</code>es it to the front of the array (the new head).</li>
              <li>It immediately <code>pop()</code>s the last segment off the back of the array (the tail).</li>
            </ol>
            <p>
              Because the middle 48 segments never actually changed their coordinates, the operation always takes exactly the same amount of time, <code>O(1)</code>, whether the snake is 3 segments long or 3,000 segments long.
            </p>
            <p>
              When the snake eats an apple, the engine simply skips Step 2 for that frame, causing the snake to grow by exactly one segment.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
