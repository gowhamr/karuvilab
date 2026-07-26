import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';

import CodeFormatterClientWrapper from './CodeFormatterClientWrapper';

const toolId = 'format';
const cat = CATEGORIES.find(c => c.id === 'developer');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Code Formatter"
      description="Format JSON, HTML, CSS, SQL, and Markdown. Note: for production-quality formatting, consider Prettier locally."
      category={cat}
      toolId={toolId}
    >
      <CodeFormatterClientWrapper />

      <LearningHub title="Understanding Code Formatters">
        
        <LearningSection type="architecture" title="Abstract Syntax Trees (AST)">
          <p>Formatting code isn't as simple as just adding spaces after every curly brace or newline after every semicolon. A reliable formatter must understand the actual structure of the code, so it doesn't accidentally break things (like splitting a string literal in half).</p>
          <p className="mt-2">To do this safely, modern formatters (like Prettier) typically parse the source code into an <strong>Abstract Syntax Tree (AST)</strong>. The AST is a massive JSON object representing every variable, function declaration, and block of logic independently of how it was typed.</p>
        </LearningSection>
        
        <LearningSection type="api" title="The Printing Phase">
          <p>Once the AST is successfully built, the formatter completely drops and ignores all the original whitespace from the source file.</p>
          <p className="mt-2">It then traverses the tree and prints the code back out from scratch, applying a consistent, highly opinionated set of rules (like indenting exactly 2 spaces inside blocks, or wrapping lines at 80 characters). This guarantees that the final code functions exactly the same mathematically, but with perfectly uniform spacing.</p>
        </LearningSection>

        <LearningSection type="failures" title="Syntax Errors">
          <p>If you try to format code that is missing a closing bracket or has a typo, an AST-based formatter will crash. It cannot build the tree if the code is invalid. This is why formatting often fails in your IDE while you are actively typing a new function.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "How does a modern AST-based code formatter handle the existing whitespace in your unformatted code?",
                options: [
                  "It counts the spaces and averages them out.",
                  "It uses regular expressions to replace multiple spaces with single spaces.",
                  "It parses the logic into a tree, completely ignores your original whitespace, and reprints the code from scratch.",
                  "It only fixes whitespace at the beginning of a line."
                ],
                correctIndex: 2,
                explanation: "Formatters like Prettier discard the original formatting entirely. By re-printing from the AST, they guarantee absolute consistency."
              },
              {
                question: "Why might a code formatter suddenly stop working on a file you are editing?",
                options: [
                  "The file became too large for the formatter's memory limit.",
                  "There is a syntax error (like a missing comma), preventing the parser from building a valid Abstract Syntax Tree.",
                  "The formatter encountered a variable name it doesn't recognize.",
                  "The code contains too many comments."
                ],
                correctIndex: 1,
                explanation: "AST parsers require valid syntax to build the tree. A single missing bracket breaks the parser, halting the formatting process entirely."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
