import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';

import TextUtilityClientWrapper from './TextUtilityClientWrapper';

const toolId = 'text-utility';
const cat = CATEGORIES.find(c => c.id === 'utilities');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Text Utility"
      description="Case conversion, line sorting, text cleaning, and character count — all in one place."
      category={cat}
      toolId={toolId}
    >
      <TextUtilityClientWrapper />

      <LearningHub title="Understanding String Encoding and Invisible Characters">
        
        <LearningSection type="architecture" title="The Problem with Pasting">
          <p>When you copy text from a PDF, a Microsoft Word document, or a bloated website, it rarely pastes cleanly into another application. It often contains weird line breaks, extra spaces, or strange formatting.</p>
          <p className="mt-2">This happens because text isn't just letters and numbers. The Unicode standard includes dozens of "invisible" characters used for layout and formatting.</p>
        </LearningSection>
        
        <LearningSection type="api" title="Common Invisible Characters">
          <ul className="list-disc pl-5 mt-2 space-y-2">
            <li><strong>Zero-width space (U+200B)</strong>: Often inserted by text editors to allow line wrapping without a visible gap. If you unknowingly paste this into a password field, authentication will fail, even though the password "looks" perfectly correct.</li>
            <li><strong>Non-breaking space (U+00A0)</strong>: Used to prevent two words from being split across a line break. Standard <code>trim()</code> functions in some programming languages ignore these, leading to buggy database inserts.</li>
            <li><strong>Carriage Return (<code>\r</code>) vs Line Feed (<code>\n</code>)</strong>: Windows uses both (<code>\r\n</code>) to signify a new line, while Linux/Mac just use <code>\n</code>. Pasting between them often results in double-spacing or completely missing breaks.</li>
          </ul>
        </LearningSection>

        <LearningSection type="performance" title="Normalization">
          <p>A good text utility helps you normalize these hidden complexities. By applying aggressive Regex replacement and string stripping, it converts the bloated clipboard payload into a clean, standard UTF-8 string that is safe for code, databases, and configuration files.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "Why might a perfectly valid-looking password be rejected by a server after pasting it from a Word document?",
                options: [
                  "The server doesn't allow pasting.",
                  "The Word document may have injected invisible formatting characters (like a zero-width space) into the string.",
                  "Passwords must be typed manually.",
                  "The clipboard encrypted the text."
                ],
                correctIndex: 1,
                explanation: "Invisible Unicode characters alter the actual byte-value of the string without changing its visual appearance, causing strict equality checks to fail."
              },
              {
                question: "What is the difference between how Windows and Linux signify a 'new line' in text?",
                options: [
                  "Windows uses CRLF (\\r\\n), while Linux uses LF (\\n).",
                  "Linux uses <br>, while Windows uses \\n.",
                  "There is no difference.",
                  "Windows uses tab characters."
                ],
                correctIndex: 0,
                explanation: "This historical difference is a common cause of formatting bugs when moving code or text files between different operating systems."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
