import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import { generateToolMetadata } from '@/src/lib/seo';
import MemoryMatchClientWrapper from './MemoryMatchClientWrapper';

const toolId = 'memory-match';
const cat = CATEGORIES.find(c => c.id === 'break-time');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="Memory Match"
      description="Flip cards and match all pairs. A classic memory-training game with best-score tracking."
      category={cat}
      toolId={toolId}
    >
      <MemoryMatchClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-fisher-yates"
          title="How it Works: The Fisher-Yates Shuffle"
          preview="Learn the standard computer science algorithm for shuffling a deck of cards perfectly."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              When this game starts, it takes a list of pairs (e.g., <code>[Apple, Apple, Banana, Banana...]</code>) and shuffles them so they are distributed randomly across the grid.
            </p>
            <h3>The Naive Approach (And Why It Fails)</h3>
            <p>
              A beginner programmer might try to shuffle an array by writing something like <code>array.sort(() =&gt; Math.random() - 0.5)</code>. 
            </p>
            <p>
              This is considered a terrible practice. Sorting algorithms are designed for transitive logic (if A &gt; B and B &gt; C, then A &gt; C). When you introduce randomness into a sort function, it causes the browser's engine to perform unevenly, resulting in a deck where some cards are statistically more likely to stay near their original positions than others.
            </p>
            <h3>The Fisher-Yates Shuffle</h3>
            <p>
              The correct way to shuffle an array in computer science is the <strong>Fisher-Yates Shuffle</strong> (specifically the Durstenfeld version):
            </p>
            <ol>
              <li>Start at the very last card in the deck.</li>
              <li>Pick a random number between 0 and the current card's index.</li>
              <li>Swap the current card with the card at that random index.</li>
              <li>Move to the previous card and repeat until you reach the beginning.</li>
            </ol>
            <p>
              This guarantees a perfectly uniform distribution (every card has an exactly equal mathematical probability of ending up in any position) and it does it in <code>O(N)</code> time, making it incredibly fast.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
