import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';

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

      <LearningHub title="Understanding the Evaluation Algorithm">
        
        <LearningSection type="architecture" title="The Naive Approach">
          <p>When you submit a guess, coloring the boxes Green (correct letter, correct spot), Yellow (correct letter, wrong spot), or Gray (wrong letter) seems simple. But a naive implementation will have severe bugs when it comes to duplicate letters.</p>
        </LearningSection>
        
        <LearningSection type="security" title="The Duplicate Letter Bug">
          <p>Imagine the secret word is <strong>APPLE</strong> and you guess <strong>PAPER</strong>.</p>
          <p className="mt-2">A naive algorithm loops through your guess one letter at a time:</p>
          <ol className="list-decimal pl-5 mt-2 space-y-1">
            <li>Is <strong>P</strong> in APPLE? Yes! Color it Yellow.</li>
            <li>Is <strong>A</strong> in APPLE? Yes! But not in this spot. Color it Yellow.</li>
            <li>Is <strong>P</strong> in APPLE? Yes, in this exact spot! Color it Green.</li>
          </ol>
          <p className="mt-2">Wait, the secret word only has two P's, but the algorithm just colored <em>both</em> of your P's (one Yellow, one Green), and might even color a third if you guessed PPPPP. This gives the player incorrect information about the word's letter counts.</p>
        </LearningSection>

        <LearningSection type="api" title="The Two-Pass Algorithm">
          <p>To fix this, the game uses a Two-Pass Evaluation Algorithm:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Pass 1 (Find Exacts):</strong> Find all the exact matches (Greens) first. When a Green is found, cross that letter out of a temporary copy of the secret word so it can't be matched again.</li>
            <li><strong>Pass 2 (Find Partials):</strong> Look at the remaining letters in your guess. If the letter exists in the <em>remaining</em> letters of the temporary secret word, color it Yellow and cross it out. Otherwise, color it Gray.</li>
          </ul>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "Why does the evaluation algorithm require two separate passes instead of just one?",
                options: [
                  "Because the browser can't process 5 letters fast enough in one pass.",
                  "To prioritize exact matches (Greens) first, ensuring they consume the available letters before partial matches (Yellows) can claim them.",
                  "Because Yellow is a secondary color.",
                  "To support 6-letter words."
                ],
                correctIndex: 1,
                explanation: "If you do it in one pass, a letter in the wrong spot might 'steal' the match credit from the same letter that is in the correct spot later in the word."
              },
              {
                question: "If the secret word is 'HELLO' and you guess 'LLLLL', what should the colors be?",
                options: [
                  "Yellow, Yellow, Green, Green, Yellow",
                  "Gray, Gray, Green, Green, Gray",
                  "Green, Green, Green, Green, Green",
                  "Yellow, Yellow, Yellow, Yellow, Yellow"
                ],
                correctIndex: 1,
                explanation: "Pass 1 finds the exact matches (the two L's in the middle) and colors them Green, crossing out all available L's. Pass 2 sees no L's remaining, so the rest become Gray."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
