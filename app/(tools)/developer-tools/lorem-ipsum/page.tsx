import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';

import LoremIpsumWrapper from './LoremIpsumWrapper';

const toolId = 'lorem-ipsum';
const cat = CATEGORIES.find(c => c.id === 'developer');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Lorem Ipsum Generator"
      description="Generate Lorem Ipsum placeholder text."
      category={cat}
      toolId={toolId}
    >
      <LoremIpsumWrapper />

      <LearningHub title="The Engineering of Placeholder Text">
        
        <LearningSection type="architecture" title="Visual Design vs Content">
          <p>When a UI engineer or designer is building a layout, they need text to test fonts, line heights, and padding.</p>
          <p className="mt-2">If they use real English text (like "Welcome to our new application..."), stakeholders and reviewers inevitably get distracted reading the content. They start arguing about the copywriting instead of evaluating the structural CSS layout.</p>
        </LearningSection>
        
        <LearningSection type="api" title="The Problem with 'asdf'">
          <p>If the designer just mashes their keyboard and uses "asdf asdf asdf" as a placeholder, the layout tests fail. The word lengths are unnatural, the letter distribution is skewed to the home row, and the visual weight (color density) of the paragraph is ruined.</p>
          <p className="mt-2"><strong>Lorem Ipsum</strong> solves this. It provides a normal, organic distribution of letters and word lengths that looks exactly like real language to the human eye, but is completely unreadable. This forces the reviewer's brain to bypass the content and focus entirely on the typography.</p>
        </LearningSection>

        <LearningSection type="standards" title="Historical Origins">
          <p>Lorem Ipsum is not randomly generated nonsense. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.</p>
          <p className="mt-2">It originates from Cicero's <em>"de Finibus Bonorum et Malorum"</em> (The Extremes of Good and Evil). In the 1500s, an unknown printer took a galley of type and scrambled it to make a type specimen book, cementing it as the industry standard for centuries before the invention of the web.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "Why do designers use unreadable Latin text instead of real English text when testing layouts?",
                options: [
                  "Because Latin fonts are cheaper to license.",
                  "Because it forces stakeholders to evaluate the visual layout without getting distracted by arguing over the meaning of the words.",
                  "Because Latin takes up less disk space than English.",
                  "Because it renders faster in CSS."
                ],
                correctIndex: 1,
                explanation: "Lorem Ipsum acts as a psychological trick. By stripping away meaning, it forces the brain to look at the text purely as graphical shapes and spacing."
              },
              {
                question: "Why is 'Lorem Ipsum' better than just typing random letters like 'asdfasdf'?",
                options: [
                  "It has a natural distribution of vowels, consonants, and word lengths, giving the paragraph realistic visual weight.",
                  "It complies with international SEO standards.",
                  "It allows the browser to cache the text faster.",
                  "Random letters trigger spam filters."
                ],
                correctIndex: 0,
                explanation: "Typography relies heavily on letter shapes (ascenders and descenders) and organic word lengths. 'asdf' creates a blocky, unrealistic visual texture that does not test the font accurately."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
