import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';

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

      <LearningHub title="Understanding the Fisher-Yates Shuffle">
        
        <LearningSection type="architecture" title="The Shuffling Problem">
          <p>When this game starts, it takes a list of pairs (e.g., <code>[Apple, Apple, Banana, Banana]</code>) and shuffles them so they are distributed randomly across the grid.</p>
        </LearningSection>
        
        <LearningSection type="security" title="The Naive Approach (And Why It Fails)">
          <p>A beginner programmer might try to shuffle an array by using the built-in sorting function: <code>array.sort(() =&gt; Math.random() - 0.5)</code>.</p>
          <p className="mt-2">This is considered a terrible practice. Sorting algorithms are designed for transitive logic (if A &gt; B and B &gt; C, then A &gt; C). When you introduce randomness into a sort function, the browser's engine gets confused, resulting in an uneven distribution where some cards are statistically much more likely to stay near their original positions.</p>
        </LearningSection>

        <LearningSection type="api" title="The Fisher-Yates Shuffle">
          <p>The standard computer science algorithm for shuffling an array is the <strong>Fisher-Yates Shuffle</strong> (specifically the Durstenfeld version):</p>
          <ol className="list-decimal pl-5 mt-2 space-y-1">
            <li>Start at the very last card in the deck.</li>
            <li>Pick a random number between 0 and the current card's index.</li>
            <li>Swap the current card with the card at that random index.</li>
            <li>Move to the previous card and repeat until you reach the beginning.</li>
          </ol>
        </LearningSection>

        <LearningSection type="performance" title="O(N) Complexity">
          <p>Because the Fisher-Yates shuffle only touches each card exactly once, its time complexity is <code>O(N)</code>. This guarantees a perfectly uniform mathematical distribution while remaining incredibly fast, even for decks with millions of cards.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "Why is array.sort(() => Math.random() - 0.5) a bad way to shuffle an array?",
                options: [
                  "It uses too much memory.",
                  "It doesn't work in Safari.",
                  "It results in an uneven distribution, meaning the shuffle isn't truly random.",
                  "It throws an error in strict mode."
                ],
                correctIndex: 2,
                explanation: "Sort algorithms expect consistent comparisons. Injecting randomness breaks their logic, leading to biased shuffles."
              },
              {
                question: "What is the time complexity of the Fisher-Yates shuffle?",
                options: [
                  "O(N^2)",
                  "O(log N)",
                  "O(N)",
                  "O(1)"
                ],
                correctIndex: 2,
                explanation: "The algorithm visits each element exactly once, making it O(N) — the optimal time for a shuffle."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
