import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';

import SplitCopyClientWrapper from './SplitCopyClientWrapper';

const toolId = 'split-copy';
const cat = CATEGORIES.find(c => c.id === 'utilities');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Split & Copy"
      description="Break long text into chunks and copy each part individually."
      category={cat}
      toolId={toolId}
    >
      <SplitCopyClientWrapper />

      <LearningHub title="Understanding the Clipboard API">
        
        <LearningSection type="architecture" title="The Legacy Approach">
          <p>In the past, websites used a hacky, synchronous command called <code>document.execCommand('copy')</code> to copy text.</p>
          <p className="mt-2">This worked by programmatically creating an invisible text input on the screen, dumping the text into it, focusing the input, selecting all the text, and then simulating a Ctrl+C keystroke. It was unreliable, blocked the main UI thread, and lacked proper security checks.</p>
        </LearningSection>
        
        <LearningSection type="api" title="The Async Clipboard API">
          <p>Modern applications (like this tool) use the <code>navigator.clipboard.writeText()</code> API.</p>
          <p className="mt-2">It is <strong>asynchronous</strong> (returns a Promise), meaning it doesn't freeze the webpage while it waits for the underlying operating system to confirm the copy operation.</p>
        </LearningSection>

        <LearningSection type="security" title="Security Constraints">
          <p>The ability to silently read or write to a user's clipboard is a massive security risk, so modern browsers restrict it heavily:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Secure Context:</strong> The API only exists on pages served over HTTPS (or localhost).</li>
            <li><strong>Transient Activation:</strong> You cannot trigger a copy operation programmatically on a timer (e.g. `setTimeout`). The API will immediately throw a <code>NotAllowedError</code> unless the copy was triggered directly by a real user gesture (like a click or touch event).</li>
          </ul>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "Why will a script fail if it tries to copy text to the clipboard exactly 10 seconds after the page loads?",
                options: [
                  "Because strings disappear from memory after 5 seconds.",
                  "Because of the 'Transient Activation' security requirement, which demands a direct user interaction (like a click) to trigger clipboard access.",
                  "Because the Async Clipboard API doesn't support setTimeout.",
                  "Because it uses too much battery."
                ],
                correctIndex: 1,
                explanation: "Browsers prevent websites from silently overwriting your clipboard in the background. A physical user click is required."
              },
              {
                question: "What is a major benefit of navigator.clipboard over the old document.execCommand?",
                options: [
                  "It is asynchronous, meaning it doesn't freeze the UI while waiting for the OS to complete the copy.",
                  "It allows copying without a secure HTTPS connection.",
                  "It can copy physical files.",
                  "It bypasses user permission prompts."
                ],
                correctIndex: 0,
                explanation: "Asynchronous APIs prevent the main thread from blocking, leading to smoother UI performance."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
