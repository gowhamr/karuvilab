import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';

import GrammarCheckerClientWrapper from './GrammarCheckerClientWrapper';

const toolId = 'grammar-checker';
const cat = CATEGORIES.find(c => c.id === 'utilities');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Grammar Checker"
      description="Basic grammar and spelling check. For comprehensive checking, use Grammarly or LanguageTool."
      category={cat}
      toolId={toolId}
    >
      <GrammarCheckerClientWrapper />
      
      <LearningHub title="Understanding Natural Language Processing (NLP)">
        
        <LearningSection type="architecture" title="Rule-Based vs Machine Learning">
          <p>Early grammar checkers relied entirely on strict, hard-coded rules. A programmer would write a rule saying: "If the word is 'a' and the next word starts with a vowel, flag an error."</p>
          <p className="mt-2">While fast, rule-based systems struggle with the complexity and exceptions of human language.</p>
        </LearningSection>
        
        <LearningSection type="api" title="The Shift to NLP">
          <p>Modern grammar tools (like Grammarly) use <strong>Natural Language Processing (NLP)</strong>. Instead of static rules, they train massive machine learning models on millions of books and articles.</p>
          <p className="mt-2">The model learns the statistical probability of words appearing together. If it sees "I is happy", the neural network flags it not because it hit a rule, but because its training data indicates "I am happy" is statistically much more probable in that context.</p>
        </LearningSection>

        <LearningSection type="security" title="Privacy Implications">
          <p>To run these massive neural networks, modern grammar tools usually require sending every single keystroke you type to their remote cloud servers for analysis.</p>
          <p className="mt-2">This presents a major security risk for enterprise users, as sensitive emails, proprietary source code, and confidential documents are constantly streamed to a third-party server.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "Why do modern grammar checkers use Machine Learning instead of hard-coded rules?",
                options: [
                  "Because rules take up too much hard drive space.",
                  "Because human language has too many complex exceptions and contextual nuances for static rules to cover effectively.",
                  "Because machine learning is cheaper to run.",
                  "Because browsers require machine learning."
                ],
                correctIndex: 1,
                explanation: "Language is fluid and context-dependent. Statistical models are much better at understanding intent and nuance than rigid programming rules."
              },
              {
                question: "What is a major privacy concern with advanced online grammar checkers?",
                options: [
                  "They use too much CPU power.",
                  "They require a monthly subscription.",
                  "They often send all typed text (including sensitive data) to remote servers for processing.",
                  "They only work in English."
                ],
                correctIndex: 2,
                explanation: "Because NLP models are too large to run on a phone or basic laptop, the text is uploaded to the cloud, creating a potential vector for data leaks."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
