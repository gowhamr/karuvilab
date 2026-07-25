import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import { generateToolMetadata } from '@/src/lib/seo';
import WordGuessClientWrapper from './WordGuessClientWrapper';

const toolId = 'word-guess';
const cat = CATEGORIES.find(c => c.id === 'break-time');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="Word Guess"
      description="Guess the secret 5-letter word in 6 attempts. Classic Wordle gameplay with statistics and offline support."
      category={cat}
      toolId={toolId}
    >
      <WordGuessClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-evaluation"
          title="How it Works: The Coloring Algorithm"
          preview="Learn why marking letters as green or yellow is actually much harder than it looks."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              When you submit a guess, coloring the boxes Green (correct letter, correct spot), Yellow (correct letter, wrong spot), or Gray (wrong letter) seems simple. But a naive implementation will have severe bugs when it comes to duplicate letters.
            </p>
            <h3>The Duplicate Letter Bug</h3>
            <p>
              Imagine the secret word is <strong>APPLE</strong> and you guess <strong>PAPER</strong>.
            </p>
            <p>
              A naive algorithm loops through your guess one letter at a time:
            </p>
            <ol>
              <li>Is <strong>P</strong> in APPLE? Yes! Color it Yellow.</li>
              <li>Is <strong>A</strong> in APPLE? Yes! But not in this spot. Color it Yellow.</li>
              <li>Is <strong>P</strong> in APPLE? Yes, in this exact spot! Color it Green.</li>
            </ol>
            <p>
              Wait, the secret word only has two P's, but the algorithm just colored <em>both</em> of your P's (one Yellow, one Green). This gives the player incorrect information.
            </p>
            <h3>The Two-Pass Algorithm</h3>
            <p>
              To fix this, the game uses a Two-Pass Evaluation Algorithm:
            </p>
            <ul>
              <li><strong>Pass 1:</strong> Find all the exact matches (Greens) first. When a Green is found, cross that letter out of the secret word so it can't be used again.</li>
              <li><strong>Pass 2:</strong> Look at the remaining letters in your guess. If the letter exists in the <em>remaining</em> letters of the secret word, color it Yellow and cross it out. Otherwise, color it Gray.</li>
            </ul>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
